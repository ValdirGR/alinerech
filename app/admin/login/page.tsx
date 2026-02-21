"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState, useTransition } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        startTransition(async () => {
            const result = await login({ error: null }, formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    return (
        <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
            <div className="glass-effect w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeInUp">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#0B3D4C] mb-2">Painel Admin</h1>
                    <p className="text-gray-600">Acesse sua conta para gerenciar a plataforma.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[#0B3D4C] font-medium">E-mail</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            className="border-gray-200 focus:border-[#C9A962] focus:ring-[#C9A962]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#0B3D4C] font-medium">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="border-gray-200 focus:border-[#C9A962] focus:ring-[#C9A962]"
                        />
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-100 rounded-md">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-gradient-accent text-white hover:opacity-90 hover-lift text-lg font-medium py-6"
                    >
                        {isPending ? 'Verificando...' : 'Entrar'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
