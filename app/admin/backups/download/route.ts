import { NextRequest } from 'next/server'
import { z } from 'zod'
import { generateBackupArtifact } from '@/lib/admin/backup'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const scopeSchema = z.enum(['database', 'storage', 'full'])

export async function GET(request: NextRequest) {
  const scopeResult = scopeSchema.safeParse(request.nextUrl.searchParams.get('scope') ?? 'full')

  if (!scopeResult.success) {
    return new Response('Escopo de backup inválido.', { status: 400 })
  }

  try {
    const artifact = await generateBackupArtifact(scopeResult.data)

    return new Response(artifact.buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${artifact.fileName}"`,
        'Content-Length': artifact.contentLength.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Não foi possível gerar o backup.'
    const status = /restrito|apenas para administradores/i.test(message) ? 403 : 500

    return new Response(message, { status })
  }
}