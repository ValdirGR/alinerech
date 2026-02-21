"use client"

import { useTransition } from 'react'
import { logout } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'

export function AdminLogoutButton() {
    const [isPending, startTransition] = useTransition()

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            await logout()
        })
    }

    return (
        <form onSubmit={handleLogout}>
            <Button
                type="submit"
                variant="ghost"
                disabled={isPending}
                className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-500/20"
            >
                {isPending ? 'Saindo...' : 'Sair da Conta'}
            </Button>
        </form>
    )
}
