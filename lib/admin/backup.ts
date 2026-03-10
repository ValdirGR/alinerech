import 'server-only'

import JSZip from 'jszip'
import { requirePrimaryAdminAccess } from '@/lib/content/server'
import { createAdminClient } from '@/utils/supabase/admin'

const BACKUP_BUCKETS = ['site-images', 'results-images'] as const

export type BackupScope = 'database' | 'storage' | 'full'

type StorageObjectRow = {
  bucket_id: string
  name: string
  created_at: string | null
  updated_at: string | null
  metadata: {
    size?: number
    mimetype?: string
  } | null
}

interface BackupArtifact {
  buffer: Buffer
  contentLength: number
  fileName: string
}

const backupLabels: Record<BackupScope, string> = {
  database: 'database-only',
  storage: 'storage-only',
  full: 'full-backup',
}

const scopeIncludesDatabase = (scope: BackupScope) => scope === 'database' || scope === 'full'

const scopeIncludesStorage = (scope: BackupScope) => scope === 'storage' || scope === 'full'

const toCsvValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return ''
  }

  const normalized = typeof value === 'string' ? value : JSON.stringify(value)
  return `"${normalized.replace(/"/g, '""')}"`
}

const toCsv = (rows: Array<Record<string, unknown>>) => {
  if (rows.length === 0) {
    return ''
  }

  const headers = Object.keys(rows[0])
  const lines = rows.map((row) => headers.map((header) => toCsvValue(row[header])).join(','))

  return [headers.join(','), ...lines].join('\n')
}

const getTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '')

async function assertPrimaryAdminAccess() {
  const { profile } = await requirePrimaryAdminAccess()
  return profile
}

async function fetchDatabaseTables() {
  const adminClient = createAdminClient()

  const [siteSections, mediaAssets, adminProfiles, leads] = await Promise.all([
    adminClient.from('site_sections').select('*').order('section_key').order('version'),
    adminClient.from('media_assets').select('*').order('created_at', { ascending: false }),
    adminClient.from('admin_profiles').select('*').order('full_name'),
    adminClient.from('leads').select('*').order('created_at', { ascending: false }),
  ])

  for (const result of [siteSections, mediaAssets, adminProfiles, leads]) {
    if (result.error) {
      throw result.error
    }
  }

  return {
    site_sections: siteSections.data ?? [],
    media_assets: mediaAssets.data ?? [],
    admin_profiles: adminProfiles.data ?? [],
    leads: leads.data ?? [],
  }
}

async function fetchStorageObjects() {
  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .schema('storage')
    .from('objects')
    .select('bucket_id, name, created_at, updated_at, metadata')
    .in('bucket_id', [...BACKUP_BUCKETS])
    .order('bucket_id')
    .order('name')

  if (error) {
    throw error
  }

  return (data ?? []) as StorageObjectRow[]
}

export async function generateBackupArtifact(scope: BackupScope): Promise<BackupArtifact> {
  const profile = await assertPrimaryAdminAccess()
  const adminClient = createAdminClient()
  const zip = new JSZip()
  const exportedAt = new Date().toISOString()
  const timestamp = getTimestamp()
  const storageObjects = scopeIncludesStorage(scope) ? await fetchStorageObjects() : []
  const databaseTables = scopeIncludesDatabase(scope)
    ? await fetchDatabaseTables()
    : {
        site_sections: [],
        media_assets: [],
        admin_profiles: [],
        leads: [],
      }

  if (scopeIncludesDatabase(scope)) {
    zip.file('database/site_sections.json', JSON.stringify(databaseTables.site_sections, null, 2))
    zip.file('database/media_assets.json', JSON.stringify(databaseTables.media_assets, null, 2))
    zip.file('database/admin_profiles.json', JSON.stringify(databaseTables.admin_profiles, null, 2))
    zip.file('database/leads.csv', toCsv(databaseTables.leads as Array<Record<string, unknown>>))
    zip.file('database/leads.json', JSON.stringify(databaseTables.leads, null, 2))
  }

  if (scopeIncludesStorage(scope)) {
    for (const objectItem of storageObjects) {
      const { data, error } = await adminClient.storage.from(objectItem.bucket_id).download(objectItem.name)

      if (error) {
        throw error
      }

      const fileBuffer = Buffer.from(await data.arrayBuffer())
      zip.file(`storage/${objectItem.bucket_id}/${objectItem.name}`, fileBuffer)
    }

    zip.file('storage/manifest.json', JSON.stringify(storageObjects, null, 2))
  }

  const manifest = {
    generatedAt: exportedAt,
    requestedBy: {
      name: profile.fullName,
      role: profile.role,
    },
    scope,
    schemaVersion: 1,
    tables: {
      site_sections: databaseTables.site_sections.length,
      media_assets: databaseTables.media_assets.length,
      admin_profiles: databaseTables.admin_profiles.length,
      leads: databaseTables.leads.length,
    },
    storage: {
      buckets: [...BACKUP_BUCKETS],
      files: storageObjects.length,
    },
  }

  zip.file('manifest.json', JSON.stringify(manifest, null, 2))

  const archiveBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6,
    },
  })

  return {
    buffer: archiveBuffer,
    contentLength: archiveBuffer.byteLength,
    fileName: `aline-rech-${backupLabels[scope]}-${timestamp}.zip`,
  }
}