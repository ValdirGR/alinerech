'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLead } from '@/lib/content/server'
import type { ActionResult } from '@/lib/content/types'

const leadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome completo.'),
  phone: z.string().trim().min(8, 'Informe um telefone válido.'),
  email: z.string().trim().email('Informe um e-mail válido.').or(z.literal('')),
  message: z.string().trim().max(1500, 'Mensagem muito longa.').optional(),
})

export async function submitLead(formData: FormData): Promise<ActionResult> {
  try {
    const payload = leadSchema.parse({
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email') ?? '',
      message: formData.get('message') ?? '',
    })

    await createLead({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      message: payload.message ?? '',
    })

    revalidatePath('/admin/leads')

    return {
      success: true,
      message: 'Mensagem enviada com sucesso.',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0]?.message ?? 'Dados inválidos.',
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Não foi possível enviar sua mensagem.',
    }
  }
}