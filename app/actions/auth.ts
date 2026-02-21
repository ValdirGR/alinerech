'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export type LoginState = {
    error?: string | null
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
    'use server'
    const supabase = await createClient()

    // Get email and password from form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'E-mail e senha são obrigatórios.' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error.message)
        return { error: 'Credenciais inválidas.' }
    }

    // Redirect to admin dashboard on success
    revalidatePath('/admin', 'layout')
    redirect('/admin')
}

export async function logout() {
    'use server'
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Logout error:', error.message)
        return { error: 'Erro ao sair da conta.' }
    }

    // Redirect to login page
    revalidatePath('/', 'layout')
    redirect('/admin/login')
}
