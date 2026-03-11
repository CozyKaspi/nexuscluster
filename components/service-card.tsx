'use client'

import { Service, STATUS_CONFIG } from '@/lib/types'
import { cn } from '@/lib/cn'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ServiceCardProps {
  service: Service
  onDelete: (id: string) => Promise<void>
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const statusConfig = STATUS_CONFIG[service.status] || STATUS_CONFIG.unknown
  const isOperational = service.status === 'operational'

  const handleDelete = async () => {
    if (confirm(`Delete ${service.name}?`)) {
      setIsDeleting(true)
      try {
        await onDelete(service.id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getStatusStyles = () => {
    switch (service.status) {
      case 'operational':
        return {
          border: 'border-emerald-500/20 hover:border-emerald-500/40',
          bg: 'bg-emerald-500/5 hover:bg-emerald-500/10',
          glow: 'bg-emerald-500',
          dot: 'bg-emerald-500',
          text: 'text-emerald-400',
        }
      case 'degraded':
        return {
          border: 'border-amber-500/20 hover:border-amber-500/40',
          bg: 'bg-amber-500/5 hover:bg-amber-500/10',
          glow: 'bg-amber-500',
          dot: 'bg-amber-500',
          text: 'text-amber-400',
        }
      case 'outage':
        return {
          border: 'border-red-500/20 hover:border-red-500/40',
          bg: 'bg-red-500/5 hover:bg-red-500/10',
          glow: 'bg-red-500',
          dot: 'bg-red-500',
          text: 'text-red-400',
        }
      default:
        return {
          border: 'border-slate-500/20 hover:border-slate-500/40',
          bg: 'bg-slate-500/5 hover:bg-slate-500/10',
          glow: 'bg-slate-500',
          dot: 'bg-slate-500',
          text: 'text-slate-400',
        }
    }
  }

  const styles = getStatusStyles()

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-lg border backdrop-blur-xl transition-all duration-300',
        styles.border,
        styles.bg
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn('absolute h-40 w-40 rounded-full opacity-20', styles.glow)}
          style={{
            top: '-50%',
            right: '-50%',
          }}
        />
      </div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{service.name}</h3>
            <p className="text-sm text-slate-400 truncate">{service.url}</p>
            {service.category && (
              <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded bg-white/10 text-slate-300">
                {service.category}
              </span>
            )}
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/10 hover:bg-red-500/20 text-red-400 disabled:opacity-50"
            aria-label="Delete service"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('h-3 w-3 rounded-full animate-pulse', styles.dot)} />
            <span className={cn('text-sm font-medium', styles.text)}>
              {statusConfig.label}
            </span>
          </div>
          {service.latency && (
            <span className="text-xs text-slate-500">{service.latency}ms</span>
          )}
        </div>
      </div>
    </div>
  )
}
