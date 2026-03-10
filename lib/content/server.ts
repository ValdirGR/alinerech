import { createClient } from '@/utils/supabase/server';
import { adminModules } from '@/lib/content/defaults';
import type {
  AdminProfile,
  DashboardModuleSummary,
  LeadInput,
  LeadRecord,
  MediaAssetRecord,
  SectionActivityRecord,
  SectionKey,
  SectionSnapshot,
  SectionStatus,
  SiteSectionRecord,
} from '@/lib/content/types';

type RawSectionRow = {
  id: string;
  section_key: string;
  status: SectionStatus;
  version: number;
  content: unknown;
  is_current: boolean;
  published_at: string | null;
  updated_at: string;
};

const collectStringValues = (value: unknown, results: string[] = []): string[] => {
  if (typeof value === 'string') {
    results.push(value);
    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStringValues(item, results));
    return results;
  }

  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach((item) => collectStringValues(item, results));
  }

  return results;
};

const toSectionRecord = <TContent>(
  row: RawSectionRow,
  normalize: (value: unknown) => TContent
): SiteSectionRecord<TContent> => ({
  id: row.id,
  sectionKey: row.section_key as SectionKey,
  status: row.status,
  version: row.version,
  content: normalize(row.content),
  isCurrent: row.is_current,
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
});

const isMissingTableError = (error: { code?: string } | null) => error?.code === '42P01';

export async function getAdminProfile(): Promise<AdminProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('admin_profiles')
    .select('id, full_name, role, is_active')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error || !data || !data.is_active) {
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name,
    role: data.role,
    isActive: data.is_active,
  };
}

export async function requireAdminAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado.');
  }

  const profile = await getAdminProfile();

  if (!profile) {
    throw new Error('Usuário sem permissão administrativa.');
  }

  return { supabase, user, profile };
}

export async function requirePrimaryAdminAccess() {
  const context = await requireAdminAccess();

  if (context.profile.role !== 'admin') {
    throw new Error('Acesso restrito a administradores.');
  }

  return context;
}

export async function getCurrentSection<TContent>(
  sectionKey: SectionKey,
  status: SectionStatus,
  normalize: (value: unknown) => TContent
): Promise<SiteSectionRecord<TContent> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_sections')
    .select('id, section_key, status, version, content, is_current, published_at, updated_at')
    .eq('section_key', sectionKey)
    .eq('status', status)
    .eq('is_current', true)
    .maybeSingle();

  if (error) {
    if (!isMissingTableError(error)) {
      console.error(`Error loading ${sectionKey} (${status}):`, error.message);
    }
    return null;
  }

  return data ? toSectionRecord(data, normalize) : null;
}

export async function getSectionSnapshot<TContent>(
  sectionKey: SectionKey,
  normalize: (value: unknown) => TContent,
  fallback: TContent
): Promise<SectionSnapshot<TContent>> {
  const [draft, published] = await Promise.all([
    getCurrentSection(sectionKey, 'draft', normalize),
    getCurrentSection(sectionKey, 'published', normalize),
  ]);

  return {
    draft,
    published,
    current: draft?.content ?? published?.content ?? fallback,
  };
}

export async function upsertSectionDraft<TContent>(params: {
  sectionKey: SectionKey;
  content: TContent;
  userId: string;
}) {
  const supabase = await createClient();
  const { data: existingDraft } = await supabase
    .from('site_sections')
    .select('id, version')
    .eq('section_key', params.sectionKey)
    .eq('status', 'draft')
    .eq('is_current', true)
    .maybeSingle();

  if (existingDraft) {
    const { error } = await supabase
      .from('site_sections')
      .update({
        content: params.content,
        created_by: params.userId,
      })
      .eq('id', existingDraft.id);

    if (error) {
      throw error;
    }

    return existingDraft.id;
  }

  const { data: latestVersionRow } = await supabase
    .from('site_sections')
    .select('version')
    .eq('section_key', params.sectionKey)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextVersion = (latestVersionRow?.version ?? 0) + 1;

  const { data, error } = await supabase
    .from('site_sections')
    .insert({
      section_key: params.sectionKey,
      status: 'draft',
      version: nextVersion,
      content: params.content,
      is_current: true,
      created_by: params.userId,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

export async function publishSectionDraft(sectionKey: SectionKey, userId: string) {
  const supabase = await createClient();
  const { data: draft, error: draftError } = await supabase
    .from('site_sections')
    .select('id')
    .eq('section_key', sectionKey)
    .eq('status', 'draft')
    .eq('is_current', true)
    .maybeSingle();

  if (draftError) {
    throw draftError;
  }

  if (!draft) {
    throw new Error('Nenhum rascunho encontrado para publicação.');
  }

  const { error: archivePublishedError } = await supabase
    .from('site_sections')
    .update({ is_current: false })
    .eq('section_key', sectionKey)
    .eq('status', 'published')
    .eq('is_current', true);

  if (archivePublishedError) {
    throw archivePublishedError;
  }

  const { error: publishError } = await supabase
    .from('site_sections')
    .update({
      status: 'published',
      published_by: userId,
      published_at: new Date().toISOString(),
    })
    .eq('id', draft.id);

  if (publishError) {
    throw publishError;
  }
}

export async function getDashboardModuleSummaries(): Promise<DashboardModuleSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_sections')
    .select('section_key, status, updated_at, published_at')
    .eq('is_current', true);

  if (error) {
    if (!isMissingTableError(error)) {
      console.error('Error loading admin summaries:', error.message);
    }

    return adminModules.map((moduleItem) => ({
      ...moduleItem,
      hasPublished: false,
      hasDraft: false,
      publishedAt: null,
      draftUpdatedAt: null,
    }));
  }

  return adminModules.map((moduleItem) => {
    const published = data.find(
      (row) => row.section_key === moduleItem.key && row.status === 'published'
    );
    const draft = data.find((row) => row.section_key === moduleItem.key && row.status === 'draft');

    return {
      ...moduleItem,
      hasPublished: Boolean(published),
      hasDraft: Boolean(draft),
      publishedAt: published?.published_at ?? null,
      draftUpdatedAt: draft?.updated_at ?? null,
    };
  });
}

export async function createLead(input: LeadInput) {
  const supabase = await createClient();
  const { error } = await supabase.from('leads').insert({
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    message: input.message || null,
    source: input.source ?? 'site_contact_form',
  });

  if (error) {
    throw error;
  }
}

export async function getLeads(): Promise<LeadRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leads')
    .select('id, name, phone, email, message, source, status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    if (!isMissingTableError(error)) {
      console.error('Error loading leads:', error.message);
    }
    return [];
  }

  return (data ?? []).map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? '',
    message: lead.message ?? '',
    source: lead.source,
    status: lead.status,
    createdAt: lead.created_at,
  }));
}

export async function updateLeadStatus(params: {
  leadId: string;
  status: LeadRecord['status'];
}) {
  const { supabase } = await requireAdminAccess();

  const { error } = await supabase
    .from('leads')
    .update({ status: params.status })
    .eq('id', params.leadId);

  if (error) {
    throw error;
  }
}

export async function getMediaAssets(params?: {
  bucketName?: 'site-images' | 'results-images';
  module?: string;
}): Promise<MediaAssetRecord[]> {
  const supabase = await createClient();

  let query = supabase
    .from('media_assets')
    .select('id, module, bucket_name, file_path, public_url, alt_text, created_at')
    .order('created_at', { ascending: false });

  if (params?.bucketName) {
    query = query.eq('bucket_name', params.bucketName);
  }

  if (params?.module) {
    query = query.eq('module', params.module);
  }

  const { data, error } = await query;

  if (error) {
    if (!isMissingTableError(error)) {
      console.error('Error loading media assets:', error.message);
    }

    return [];
  }

  const { data: sectionRows, error: sectionError } = await supabase
    .from('site_sections')
    .select('section_key, status, content')
    .eq('is_current', true);

  if (sectionError && !isMissingTableError(sectionError)) {
    console.error('Error loading section usage:', sectionError.message);
  }

  const usageEntries = (sectionRows ?? []).map((row) => ({
    sectionKey: row.section_key as SectionKey,
    status: row.status as SectionStatus,
    label: `${row.section_key} (${row.status})`,
    values: new Set(collectStringValues(row.content)),
  }));

  return (data ?? []).map((item) => ({
    id: item.id,
    module: item.module,
    bucketName: item.bucket_name,
    filePath: item.file_path,
    publicUrl: item.public_url,
    altText: item.alt_text,
    createdAt: item.created_at,
    usedIn: usageEntries
      .filter((entry) => entry.values.has(item.public_url))
      .map((entry) => ({
        sectionKey: entry.sectionKey,
        status: entry.status,
        label: entry.label,
      })),
  }));
}

export async function getSectionActivity(limit = 12): Promise<SectionActivityRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_sections')
    .select('id, section_key, status, version, is_current, created_by, published_by, published_at, updated_at')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    if (!isMissingTableError(error)) {
      console.error('Error loading section activity:', error.message);
    }

    return [];
  }

  const actorIds = Array.from(
    new Set(
      (data ?? [])
        .flatMap((item) => [item.created_by, item.published_by])
        .filter((value): value is string => Boolean(value))
    )
  );

  let profilesByUserId = new Map<string, string>();

  if (actorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('admin_profiles')
      .select('user_id, full_name')
      .in('user_id', actorIds);

    if (profilesError) {
      if (!isMissingTableError(profilesError)) {
        console.error('Error loading activity actors:', profilesError.message);
      }
    } else {
      profilesByUserId = new Map((profiles ?? []).map((item) => [item.user_id, item.full_name]));
    }
  }

  return (data ?? []).map((item) => {
    const isPublishedAction = item.status === 'published' && Boolean(item.published_at);
    const actorId = isPublishedAction ? item.published_by : item.created_by;

    return {
      id: item.id,
      sectionKey: item.section_key as SectionKey,
      sectionLabel: adminModules.find((moduleItem) => moduleItem.key === item.section_key)?.label ?? item.section_key,
      action: isPublishedAction ? 'published' : 'draft_saved',
      actionLabel: isPublishedAction ? 'Publicação' : 'Rascunho salvo',
      version: item.version,
      actorName: actorId ? profilesByUserId.get(actorId) ?? 'Administrador' : 'Sistema',
      occurredAt: isPublishedAction ? item.published_at ?? item.updated_at : item.updated_at,
      status: item.status,
      isCurrent: item.is_current,
    };
  });
}