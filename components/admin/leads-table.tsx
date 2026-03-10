'use client'

import { useDeferredValue, useMemo, useState, useTransition } from 'react'
import { updateLeadStatusAction } from '@/app/actions/leads'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { LeadRecord } from '@/lib/content/types'

type LeadsTableProps = {
  leads: LeadRecord[]
}

const ALL_FILTER_VALUE = '__all__'

const getStatusBadgeClassName = (status: LeadRecord['status']) => {
  switch (status) {
    case 'in_contact':
      return 'bg-sky-100 text-sky-700'
    case 'converted':
      return 'bg-emerald-100 text-emerald-700'
    case 'archived':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

const getStatusLabel = (status: LeadRecord['status']) => {
  switch (status) {
    case 'in_contact':
      return 'Em contato'
    case 'converted':
      return 'Convertido'
    case 'archived':
      return 'Arquivado'
    default:
      return 'Novo'
  }
}

const getSourceLabel = (source: string | undefined) => {
  if (!source) {
    return 'Nao informado'
  }

  if (source === 'site_contact_form') {
    return 'Formulario do site'
  }

  return source.replace(/_/g, ' ')
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [leadItems, setLeadItems] = useState(leads)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE)
  const [sourceFilter, setSourceFilter] = useState(ALL_FILTER_VALUE)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [feedbackError, setFeedbackError] = useState(false)
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const deferredSearchTerm = useDeferredValue(searchTerm)

  const normalizedSearchTerm = deferredSearchTerm.trim().toLocaleLowerCase('pt-BR')
  const sourceOptions = useMemo(
    () => Array.from(new Set(leadItems.map((lead) => lead.source || ''))).filter(Boolean).sort((left, right) => left.localeCompare(right, 'pt-BR')),
    [leadItems],
  )

  const filteredLeads = leadItems.filter((lead) => {
    if (statusFilter !== ALL_FILTER_VALUE && lead.status !== statusFilter) {
      return false
    }

    if (sourceFilter !== ALL_FILTER_VALUE && (lead.source || '') !== sourceFilter) {
      return false
    }

    if (!normalizedSearchTerm) {
      return true
    }

    const searchableContent = [
      lead.name,
      lead.phone,
      lead.email,
      lead.message,
      getSourceLabel(lead.source),
      getStatusLabel(lead.status),
    ]
      .join(' ')
      .toLocaleLowerCase('pt-BR')

    return searchableContent.includes(normalizedSearchTerm)
  })

  const statusCounts = filteredLeads.reduce(
    (counts, lead) => {
      counts[lead.status] += 1
      return counts
    },
    { new: 0, in_contact: 0, converted: 0, archived: 0 } as Record<LeadRecord['status'], number>,
  )

  const handleStatusChange = (leadId: string, nextStatus: LeadRecord['status']) => {
    const previousLead = leadItems.find((lead) => lead.id === leadId)

    if (!previousLead || previousLead.status === nextStatus) {
      return
    }

    setLeadItems((currentLeads) =>
      currentLeads.map((lead) => (lead.id === leadId ? { ...lead, status: nextStatus } : lead)),
    )
    setPendingLeadId(leadId)
    setFeedbackMessage(null)

    startTransition(async () => {
      const result = await updateLeadStatusAction({ leadId, status: nextStatus })

      if (!result.success) {
        setLeadItems((currentLeads) =>
          currentLeads.map((lead) =>
            lead.id === leadId && previousLead ? { ...lead, status: previousLead.status } : lead,
          ),
        )
      }

      setFeedbackMessage(result.message)
      setFeedbackError(!result.success)
      setPendingLeadId(null)
    })
  }

  if (leadItems.length === 0) {
    return (
      <div className="p-10 text-sm text-gray-500">
        Nenhum lead encontrado ainda. Depois que a migration for aplicada e o formulario comecar a salvar,
        os contatos aparecerao aqui.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 px-6 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#0B3D4C]">Entradas recentes</h2>
            <p className="text-sm text-gray-500">Filtre por status, origem ou pesquise pelo contato.</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-[#0B3D4C] px-3 py-1 font-semibold uppercase tracking-wide text-white">
              {filteredLeads.length} registro(s)
            </span>
            <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-700">
              {statusCounts.new} novo(s)
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 font-semibold text-sky-700">
              {statusCounts.in_contact} em contato
            </span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">
              {statusCounts.converted} convertido(s)
            </span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1.4fr),220px,220px,auto]">
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por nome, telefone, e-mail ou mensagem"
            className="bg-white"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todos os status</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="in_contact">Em contato</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
              <SelectItem value="archived">Arquivado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Todas as origens" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER_VALUE}>Todas as origens</SelectItem>
              {sourceOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {getSourceLabel(source)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              setStatusFilter(ALL_FILTER_VALUE)
              setSourceFilter(ALL_FILTER_VALUE)
            }}
            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-[#0B3D4C] transition-colors hover:border-[#C9A962] hover:bg-white"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      {feedbackMessage ? (
        <div
          className={`mx-6 rounded-xl border px-4 py-3 text-sm ${
            feedbackError
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {feedbackMessage}
        </div>
      ) : null}

      {filteredLeads.length === 0 ? (
        <div className="px-6 pb-6 text-sm text-gray-500">Nenhum lead corresponde aos filtros aplicados.</div>
      ) : (
        <div className="px-6 pb-6">
          <Table className="min-w-full">
            <TableHeader className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <TableRow>
                <TableHead className="px-4 py-4">Nome</TableHead>
                <TableHead className="px-4 py-4">Telefone</TableHead>
                <TableHead className="px-4 py-4">E-mail</TableHead>
                <TableHead className="px-4 py-4">Mensagem</TableHead>
                <TableHead className="px-4 py-4">Origem</TableHead>
                <TableHead className="px-4 py-4">Status</TableHead>
                <TableHead className="px-4 py-4">Recebido em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="px-4 py-4 font-medium whitespace-normal text-[#0B3D4C]">
                    {lead.name}
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600">{lead.phone}</TableCell>
                  <TableCell className="px-4 py-4 whitespace-normal text-gray-600">
                    {lead.email || 'Nao informado'}
                  </TableCell>
                  <TableCell className="max-w-xs px-4 py-4 whitespace-normal text-gray-600">
                    <span className="line-clamp-3">{lead.message || 'Sem mensagem adicional'}</span>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600">{getSourceLabel(lead.source)}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="space-y-2">
                      <Select
                        value={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value as LeadRecord['status'])}
                        disabled={isPending && pendingLeadId === lead.id}
                      >
                        <SelectTrigger className="h-8 w-[160px] bg-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">Novo</SelectItem>
                          <SelectItem value="in_contact">Em contato</SelectItem>
                          <SelectItem value="converted">Convertido</SelectItem>
                          <SelectItem value="archived">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>

                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusBadgeClassName(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-4 text-gray-600">
                    {new Date(lead.createdAt).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}