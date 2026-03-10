# Painel Administrativo `/admin`

## 1. Visão geral

### Propósito

O `/admin` é o painel administrativo do site da Dra. Aline Rech. Ele foi criado para permitir que usuários não desenvolvedores operem o conteúdo institucional do site, a biblioteca de mídia e o atendimento inicial de leads, sem depender de alterações manuais no código.

Na prática, ele resolve quatro problemas principais:

1. Elimina a dependência do desenvolvedor para trocar textos, imagens e blocos de conteúdo do site.
2. Introduz fluxo editorial com `rascunho` e `publicação`, reduzindo risco de edição direta em produção.
3. Centraliza ativos de mídia em uma biblioteca reutilizável com rastreamento de uso.
4. Consolida leads capturados pelo formulário público em um fluxo operacional dentro do painel.

### Fluxo principal do usuário

#### Fluxo de autenticação

1. O usuário acessa `/admin`.
2. O `proxy.ts` valida se existe sessão Supabase.
3. Se não houver sessão, o usuário é redirecionado para `/admin/login`.
4. Após login, o layout protegido valida se o usuário possui perfil administrativo ativo em `admin_profiles`.
5. Se o perfil for válido, o dashboard é renderizado.

#### Fluxo editorial de conteúdo

1. O usuário escolhe um módulo no menu lateral, por exemplo `/admin/hero`.
2. A página carrega o snapshot do módulo com:
   - versão publicada atual
   - versão de rascunho atual, se existir
   - fallback definido em código, se ainda não houver publicação
3. O usuário edita os campos do formulário.
4. Ao clicar em `Salvar rascunho`, os dados são validados com Zod e persistidos em `site_sections` com status `draft`.
5. O usuário revisa o comparativo entre rascunho e publicado.
6. Ao clicar em `Publicar`, o rascunho atual substitui a versão publicada do módulo.
7. O site público passa a consumir a nova versão publicada.

#### Fluxo de mídia

1. O usuário acessa `/admin/gallery` ou usa os campos de imagem dos módulos.
2. As imagens são enviadas ao Supabase Storage e registradas em `media_assets`.
3. O ativo passa a poder ser reutilizado em múltiplos módulos.
4. O painel mostra se a mídia está em uso em rascunho, publicado ou ambos.
5. A exclusão é bloqueada quando o ativo ainda está referenciado.

#### Fluxo de leads

1. O formulário público de contato salva registros em `leads`.
2. O usuário acessa `/admin/leads`.
3. O painel permite buscar, filtrar, alterar status e abrir o detalhe do lead.
4. O atendente pode disparar contato por WhatsApp, telefone ou e-mail a partir do modal do lead.

---

## 2. Arquitetura e tecnologias

### Stack utilizada

- Framework principal: Next.js 16 com App Router
- UI: React 19
- Linguagem: TypeScript
- Estilo: Tailwind CSS
- Componentes base: Radix UI + componentes utilitários do projeto
- Banco, autenticação e storage: Supabase
- Validação de payloads: Zod
- Ícones: Lucide React
- Hospedagem esperada: Vercel + Supabase

### Serviços externos

- Supabase Auth: autenticação do admin
- Supabase Postgres: persistência de conteúdo, leads e metadados de mídia
- Supabase Storage: armazenamento de imagens (`site-images` e `results-images`)

### Estrutura de arquivos relevante

```text
app/
  admin/
    layout.tsx
    login/page.tsx
    (dashboard)/
      layout.tsx
      page.tsx
      activity/page.tsx
      gallery/page.tsx
      leads/page.tsx
      about/page.tsx
      contact/page.tsx
      faq/page.tsx
      features/page.tsx
      footer/page.tsx
      header/page.tsx
      hero/page.tsx
      myths/page.tsx
      process/page.tsx
      results/page.tsx
      services/page.tsx
      testimonials/page.tsx
      [module]/page.tsx
  actions/
    admin-content.ts
    auth.ts
    leads.ts

components/
  admin/
    admin-sidebar-nav.tsx
    activity-feed.tsx
    admin-image-field.tsx
    editor-section.tsx
    editor-section-nav.tsx
    leads-table.tsx
    media-library-browser.tsx
    media-library-grid.tsx
    media-library-manager.tsx
    section-snapshot-preview.tsx
    *-editor-form.tsx

lib/content/
  defaults.ts
  server.ts
  types.ts

utils/supabase/
  client.ts
  server.ts

supabase/migrations/
  20260309_admin_cms.sql
  20260309_admin_rls_fix.sql

proxy.ts
```

### Diagrama de fluxo de dados

```mermaid
flowchart TD
  A[Usuario Admin] --> B[/admin]
  B --> C[proxy.ts]
  C --> D[Supabase Auth]
  D --> E[app/admin/(dashboard)/layout.tsx]
  E --> F[getAdminProfile]
  F --> G[(admin_profiles)]

  E --> H[Paginas do painel]
  H --> I[Server actions]
  I --> J[lib/content/server.ts]

  J --> K[(site_sections)]
  J --> L[(leads)]
  J --> M[(media_assets)]
  J --> N[(storage.objects)]

  K --> O[Site publico consome versoes publicadas]
  L --> P[Atendimento de leads no /admin/leads]
  M --> Q[Galeria / campos de imagem]
  N --> Q
```

### Resumo arquitetural

- O painel usa páginas server-side para carregar dados iniciais diretamente do Supabase.
- As interações de escrita são feitas por Server Actions.
- O estado de edição mais complexo fica em componentes client-side, principalmente nos formulários, galeria, histórico e leads.
- O modelo editorial é baseado em snapshots versionados por módulo, e não em edição in-place da publicação atual.

---

## 3. Funcionalidades e recursos

### 3.1 Dashboard

**O que faz**

Exibe visão geral do CMS, quantidade de módulos, leads recebidos, módulos com rascunho e histórico recente.

**Como funciona internamente**

- Carrega `getDashboardModuleSummaries()`.
- Carrega `getLeads()`.
- Carrega `getSectionActivity(5)`.

**Arquivos envolvidos**

- `app/admin/(dashboard)/page.tsx`
- `lib/content/server.ts`
- `components/admin/activity-feed.tsx`

### 3.2 Login e logout administrativo

**O que faz**

Permite autenticação via e-mail e senha com Supabase Auth.

**Como funciona internamente**

- O formulário envia os dados para `login()`.
- `login()` usa `supabase.auth.signInWithPassword()`.
- `logout()` usa `supabase.auth.signOut()`.

**Arquivos envolvidos**

- `app/admin/login/page.tsx`
- `app/actions/auth.ts`
- `utils/supabase/server.ts`

### 3.3 Proteção de acesso ao `/admin`

**O que faz**

Garante que apenas usuários autenticados e com perfil administrativo ativo acessem o painel.

**Como funciona internamente**

- `proxy.ts` protege rotas `/admin/*` contra usuários sem sessão.
- `app/admin/(dashboard)/layout.tsx` valida o perfil em `admin_profiles`.
- Se o perfil não existir ou estiver inativo, o usuário é redirecionado para `/admin/login`.

**Arquivos envolvidos**

- `proxy.ts`
- `app/admin/(dashboard)/layout.tsx`
- `lib/content/server.ts`

### 3.4 Edição de módulos de conteúdo

**Módulos disponíveis**

- Header
- Hero
- Sobre
- Serviços
- Resultados
- Como Funciona
- Mito ou Verdade
- Diferenciais
- FAQ
- Contato
- Depoimentos
- Footer

**O que fazem**

Permitem editar o conteúdo das seções públicas da home.

**Como funcionam internamente**

- Cada página carrega um `SectionSnapshot<T>` via `getSectionSnapshot()`.
- O formulário client-side é preenchido com `snapshot.current`.
- O botão `Salvar rascunho` chama `save<Modulo>Draft()`.
- O botão `Publicar` chama `publish<Modulo>()`.
- As ações usam `upsertSectionDraft()` e `publishSectionDraft()`.
- Os schemas Zod em `app/actions/admin-content.ts` garantem integridade do payload.

**Arquivos envolvidos**

- `app/admin/(dashboard)/*/page.tsx`
- `components/admin/*-editor-form.tsx`
- `app/actions/admin-content.ts`
- `lib/content/server.ts`
- `lib/content/defaults.ts`
- `lib/content/types.ts`

### 3.5 Fluxo `rascunho` x `publicado`

**O que faz**

Separa alterações em andamento do conteúdo visível no site.

**Como funciona internamente**

- `site_sections` armazena versões com `status = draft|published`.
- Apenas o registro `published` com `is_current = true` é consumido no site.
- Ao publicar, a versão publicada anterior perde `is_current`.

**Arquivos envolvidos**

- `lib/content/server.ts`
- `app/actions/admin-content.ts`
- `supabase/migrations/20260309_admin_cms.sql`

### 3.6 Comparativo de versões

**O que faz**

Mostra diferenças entre rascunho e publicação por campo, com destaque visual.

**Como funciona internamente**

- O componente normaliza e achata o conteúdo JSON.
- Calcula diferenças por caminho de propriedade.
- Marca campos como `alterado`, `novo`, `removido` ou `sem mudança`.

**Arquivos envolvidos**

- `components/admin/section-snapshot-preview.tsx`
- `app/admin/(dashboard)/*/page.tsx`

### 3.7 Formularios recolhíveis e navegação interna

**O que faz**

Melhora a usabilidade dos formulários grandes com seções recolhíveis e atalhos de navegação por âncora.

**Como funciona internamente**

- `EditorSection` encapsula cada bloco do formulário usando `Collapsible`.
- `EditorSectionNav` renderiza atalhos para as seções.
- Quando a URL recebe `#section-id`, o bloco correspondente é aberto automaticamente.

**Arquivos envolvidos**

- `components/admin/editor-section.tsx`
- `components/admin/editor-section-nav.tsx`
- `components/admin/*-editor-form.tsx`

### 3.8 Biblioteca de mídia

**O que faz**

Centraliza upload, reaproveitamento, filtro, edição de alt text e exclusão controlada de ativos.

**Como funciona internamente**

- O upload vai para Supabase Storage.
- Cada arquivo enviado também gera um registro em `media_assets`.
- `getMediaAssets()` cruza `media_assets` com `site_sections` para descobrir onde a mídia está em uso.
- A exclusão é impedida se a mídia ainda aparecer em rascunho ou publicado.

**Arquivos envolvidos**

- `app/admin/(dashboard)/gallery/page.tsx`
- `components/admin/admin-image-field.tsx`
- `components/admin/media-library-browser.tsx`
- `components/admin/media-library-grid.tsx`
- `components/admin/media-library-manager.tsx`
- `lib/content/server.ts`

### 3.9 Histórico editorial

**O que faz**

Lista salvamentos de rascunho e publicações, com filtros por ação e módulo.

**Como funciona internamente**

- O backend consulta `site_sections` ordenado por `updated_at`.
- Os IDs dos autores são resolvidos via `admin_profiles`.
- O componente client-side permite busca textual e filtros.

**Arquivos envolvidos**

- `app/admin/(dashboard)/activity/page.tsx`
- `components/admin/activity-feed.tsx`
- `lib/content/server.ts`

### 3.10 Leads

**O que faz**

Exibe os leads capturados pelo formulário público, com busca, filtros, alteração de status e visualização detalhada.

**Como funciona internamente**

- O formulário público usa `submitLead()`.
- `createLead()` persiste em `leads`.
- `/admin/leads` usa `getLeads()` para leitura.
- `updateLeadStatusAction()` atualiza o status com RLS protegida.
- O componente client-side aplica filtros locais e mostra um modal com detalhes e atalhos de contato.

**Arquivos envolvidos**

- `app/actions/leads.ts`
- `app/admin/(dashboard)/leads/page.tsx`
- `components/admin/leads-table.tsx`
- `lib/content/server.ts`

### 3.11 Backups manuais

**O que faz**

Permite ao perfil `admin` gerar um backup operacional sob demanda diretamente no `/admin`, com download em `.zip` para a máquina local.

**Como funciona internamente**

- A página `/admin/backups` expõe opções de exportação manual.
- A rota `/admin/backups/download` valida o escopo solicitado.
- O backend exige perfil `admin` e usa `SUPABASE_SERVICE_ROLE_KEY` apenas no servidor.
- O acesso visual ao item de navegação é exibido apenas para usuários com papel `admin`.
- O ZIP pode incluir:
  - tabelas `site_sections`, `media_assets`, `admin_profiles`, `leads`
  - arquivos dos buckets `site-images` e `results-images`
  - `manifest.json` com metadados da exportação
- Os escopos disponíveis atualmente são:
  - `database`: exporta apenas dados estruturados do painel
  - `storage`: exporta apenas os arquivos dos buckets usados pelo site
  - `full`: combina banco e storage no mesmo pacote
- O nome do arquivo segue o padrão `aline-rech-<scope>-<timestamp>.zip`.
- Esta etapa é exclusivamente manual e operacional: não há agendamento, retenção histórica nem fluxo de restauração.

**Arquivos envolvidos**

- `app/admin/(dashboard)/backups/page.tsx`
- `app/admin/backups/download/route.ts`
- `lib/admin/backup.ts`
- `utils/supabase/admin.ts`

### 3.12 Placeholder de módulos inexistentes

**O que faz**

Fornece fallback seguro para uma chave de módulo válida ainda não implementada.

**Como funciona internamente**

- A rota dinâmica `[module]` valida se a chave existe em `adminModules`.
- Se não existir, retorna `notFound()`.
- Se existir mas não estiver implementada, pode renderizar placeholder.

**Arquivos envolvidos**

- `app/admin/(dashboard)/[module]/page.tsx`
- `components/admin/module-placeholder.tsx`
- `lib/content/defaults.ts`

---

## 4. Modelos de dados

### 4.1 `public.admin_profiles`

Representa o perfil administrativo de um usuário autenticado.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK para `auth.users(id)` |
| `full_name` | `text` | Nome exibido no painel |
| `role` | `text` | `admin` ou `editor` |
| `is_active` | `boolean` | Habilita ou bloqueia acesso |
| `created_at` | `timestamptz` | Auditoria |
| `updated_at` | `timestamptz` | Auditoria |

### 4.2 `public.site_sections`

Armazena snapshots versionados de cada módulo de conteúdo.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `uuid` | PK |
| `section_key` | `text` | Ex.: `hero`, `about`, `faq` |
| `status` | `text` | `draft` ou `published` |
| `version` | `integer` | Número da versão |
| `content` | `jsonb` | Payload estruturado do módulo |
| `is_current` | `boolean` | Marca a versão vigente daquele status |
| `created_by` | `uuid` | FK para `auth.users` |
| `published_by` | `uuid` | FK para `auth.users` |
| `published_at` | `timestamptz` | Data de publicação |
| `created_at` | `timestamptz` | Auditoria |
| `updated_at` | `timestamptz` | Auditoria |

**Índices importantes**

- `site_sections_current_status_idx`
- `site_sections_lookup_idx`

### 4.3 `public.leads`

Armazena os contatos enviados pelo formulário público.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `uuid` | PK |
| `name` | `text` | Nome do contato |
| `phone` | `text` | Telefone informado |
| `email` | `text` | Opcional |
| `message` | `text` | Opcional |
| `source` | `text` | Origem do lead, padrão `site_contact_form` |
| `status` | `text` | `new`, `in_contact`, `converted`, `archived` |
| `created_at` | `timestamptz` | Data de criação |
| `updated_at` | `timestamptz` | Data de atualização |

**Índice importante**

- `leads_status_created_idx`

### 4.4 `public.media_assets`

Metadados dos arquivos enviados ao storage.

| Campo | Tipo | Observação |
|---|---|---|
| `id` | `uuid` | PK |
| `module` | `text` | Módulo que originou o upload |
| `bucket_name` | `text` | `site-images` ou `results-images` |
| `file_path` | `text` | Caminho no storage |
| `public_url` | `text` | URL pública do ativo |
| `alt_text` | `text` | Texto alternativo |
| `uploaded_by` | `uuid` | FK para `auth.users` |
| `created_at` | `timestamptz` | Data do upload |

### 4.5 Buckets de storage

- `site-images`: imagens gerais do site
- `results-images`: imagens da seção de resultados

### 4.6 Relações principais

- `admin_profiles.user_id -> auth.users.id`
- `site_sections.created_by -> auth.users.id`
- `site_sections.published_by -> auth.users.id`
- `media_assets.uploaded_by -> auth.users.id`

### 4.7 Políticas de acesso (RLS)

As tabelas com RLS habilitada são:

- `public.admin_profiles`
- `public.site_sections`
- `public.leads`
- `public.media_assets`

Também existem políticas sobre `storage.objects` para os buckets usados pelo CMS.

#### Função de autorização

O controle administrativo final é feito por `private.is_admin_user(uuid)`, criada em `20260309_admin_rls_fix.sql`.

Ela retorna `true` apenas se:

- existir linha em `admin_profiles`
- `is_active = true`
- `role in ('admin', 'editor')`

#### Resumo das políticas

- `admin_profiles`
  - usuário autenticado pode ler o próprio perfil
  - admins/editors podem ler e gerenciar perfis
- `site_sections`
  - público pode ler apenas conteúdo `published` e `is_current = true`
  - admins/editors podem fazer `select/insert/update/delete`
- `leads`
  - público pode fazer `insert`
  - admins/editors podem fazer `select` e `update`
- `media_assets`
  - admins/editors podem gerenciar todos os registros
- `storage.objects`
  - público pode ler buckets públicos
  - admins/editors podem inserir, atualizar e deletar objetos dos buckets do CMS

---

## 5. Autenticação e autorização

### Como o acesso ao `/admin` é protegido

#### Camada 1: sessão autenticada

`proxy.ts` intercepta qualquer rota `/admin/*`, exceto `/admin/login`, e redireciona para o login quando não existe usuário autenticado no Supabase Auth.

#### Camada 2: perfil administrativo

Mesmo com sessão válida, o usuário só acessa o dashboard se `getAdminProfile()` encontrar um registro correspondente em `admin_profiles` com `is_active = true`.

### Roles e permissões

Roles aceitas pelo banco:

- `admin`
- `editor`

No estado atual da implementação, ambas têm acesso operacional equivalente dentro do painel, porque a função `private.is_admin_user()` aceita os dois papéis.

Exceção importante: a funcionalidade de backup manual não segue essa equivalência. Embora `admin` e `editor` continuem equivalentes para CMS, mídia, histórico e leads, a exportação em `/admin/backups` é explicitamente restrita ao papel `admin` no backend.

### Requisitos mínimos para liberar um usuário

1. Criar o usuário em `auth.users` via Supabase Auth.
2. Inserir linha correspondente em `public.admin_profiles`.
3. Definir `role` como `admin` ou `editor`.
4. Definir `is_active = true`.

---

## 6. Integrações e dependências

### APIs e interfaces utilizadas

Não existe API REST customizada para o painel. A comunicação é feita por:

- Server Components lendo o banco com `@supabase/ssr`
- Server Actions do Next.js para escrita
- Cliente Supabase no browser para operações de mídia que precisam de interação imediata

### Integrações externas ativas

- Supabase Auth
- Supabase Postgres
- Supabase Storage
- Vercel Environment Variables para disponibilizar `SUPABASE_SERVICE_ROLE_KEY` no ambiente de execução do servidor

### Integrações não implementadas no `/admin`

- N8N: não há integração no estado atual
- APIs HTTP próprias: não há endpoints dedicados para o painel

### Dependências relevantes por responsabilidade

- `@supabase/ssr`, `@supabase/supabase-js`: auth, banco e storage
- `jszip`: geração server-side do arquivo `.zip` para exportação manual de backup
- `zod`: validação dos formulários e actions
- `@radix-ui/react-*`: componentes de interface usados no painel
- `vaul`: drawer utilitário disponível no projeto
- `lucide-react`: ícones do painel

---

## 7. Como rodar e testar localmente

### Variáveis de ambiente necessárias

As variáveis confirmadas pelo código são:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Essas variáveis são usadas em:

- `utils/supabase/server.ts`
- `utils/supabase/client.ts`
- `proxy.ts`
- `utils/supabase/admin.ts`

#### Observação sobre `SUPABASE_SERVICE_ROLE_KEY`

- Essa variável é obrigatória para a funcionalidade de backup manual.
- Ela deve existir apenas no ambiente do servidor.
- Nunca deve ser exposta em componentes client-side ou em variáveis prefixadas com `NEXT_PUBLIC_`.
- Em produção, deve ser configurada no provedor de hospedagem, por exemplo na Vercel.

### Pré-requisitos

1. Node.js compatível com Next 16
2. Dependências instaladas com `npm install`
3. Projeto Supabase acessível
4. Usuário admin cadastrado em Auth e em `admin_profiles`

### Passos para subir localmente

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:3000`.

### Passos para preparar o banco

Aplicar as migrations do diretório `supabase/migrations/` no projeto Supabase correspondente.

Opções possíveis:

1. Via Supabase CLI

```bash
supabase db push
```

2. Via SQL Editor do Supabase Dashboard

Executar, na ordem:

- `supabase/migrations/20260309_admin_cms.sql`
- `supabase/migrations/20260309_admin_rls_fix.sql`

### Como validar o acesso administrativo

1. Criar um usuário no Supabase Auth.
2. Inserir um registro em `public.admin_profiles` com `user_id`, `full_name`, `role` e `is_active = true`.
3. Acessar `/admin/login`.
4. Fazer login com o mesmo usuário.

### Como testar manualmente as principais funcionalidades

#### Conteúdo

1. Abrir um módulo, por exemplo `/admin/hero`.
2. Alterar um campo.
3. Salvar rascunho.
4. Confirmar que o comparativo mostra a mudança.
5. Publicar.
6. Validar a atualização no site público.

#### Mídia

1. Abrir `/admin/gallery`.
2. Confirmar listagem, filtros e atualização de alt text.
3. Tentar excluir uma mídia em uso para validar a proteção.

#### Histórico

1. Abrir `/admin/activity`.
2. Filtrar por módulo e ação.
3. Confirmar registros de rascunho e publicação.

#### Leads

1. Enviar formulário público.
2. Abrir `/admin/leads`.
3. Buscar o lead pelo nome ou telefone.
4. Alterar o status.
5. Abrir o modal de detalhe.
6. Validar atalhos de contato.

#### Backups

1. Garantir que o usuário autenticado tenha `role = admin` em `admin_profiles`.
2. Garantir que `SUPABASE_SERVICE_ROLE_KEY` esteja configurada no ambiente do servidor.
3. Abrir `/admin/backups`.
4. Confirmar que a navegação “Backups” aparece apenas para `admin`.
5. Testar os três escopos de exportação: `database`, `storage` e `full`.
6. Validar que o navegador baixa um arquivo `.zip`.
7. Abrir o pacote e confirmar a presença de `manifest.json`.
8. Confirmar a presença da pasta `database/` quando o escopo incluir banco.
9. Confirmar a presença da pasta `storage/` quando o escopo incluir storage.

#### Produção

1. Configurar `SUPABASE_SERVICE_ROLE_KEY` na Vercel ou no provedor equivalente.
2. Fazer novo deploy após cadastrar a variável.
3. Validar `/admin/backups` já no ambiente publicado.

### Verificação de build

O check técnico mínimo recomendado antes de qualquer merge ou deploy é:

```bash
npm run build
```

Esse é o principal verificador já usado durante a evolução desta funcionalidade.

---

## Observações de manutenção

### Padrão atual de evolução de módulos

Para adicionar um novo módulo ao CMS, o fluxo recomendado é:

1. Definir tipo em `lib/content/types.ts`
2. Adicionar `default` e `normalize` em `lib/content/defaults.ts`
3. Criar schema Zod e actions em `app/actions/admin-content.ts`
4. Criar página em `app/admin/(dashboard)/<modulo>/page.tsx`
5. Criar formulário em `components/admin/<modulo>-editor-form.tsx`
6. Adicionar o módulo em `adminModules`
7. Conectar o consumo no site público

### Riscos e pontos de atenção

- O painel depende diretamente do formato JSON salvo em `site_sections.content`; mudanças de schema precisam manter compatibilidade com `normalize*()`.
- `editor` e `admin` hoje têm a mesma capacidade operacional. Se houver necessidade de perfis distintos, a função `private.is_admin_user()` e as policies precisarão ser refinadas.
- A gestão de leads ainda não possui notas internas, responsável atribuído ou histórico de interação.
- A auditoria editorial é derivada de `site_sections`; não existe tabela dedicada de auditoria com eventos arbitrários.

### Arquivos mais importantes para manutenção contínua

- `lib/content/server.ts`: leitura e persistência central
- `app/actions/admin-content.ts`: validação e ações editoriais
- `app/actions/leads.ts`: criação e atualização de leads
- `lib/content/defaults.ts`: catálogo de módulos e fallbacks
- `supabase/migrations/*.sql`: estrutura e segurança do banco
- `components/admin/*`: UX do painel
