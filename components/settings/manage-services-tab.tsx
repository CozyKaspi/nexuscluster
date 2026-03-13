'use client'

import { Service, STATUS_TYPE_LABELS } from '@/lib/types'
import { Trash2, Pencil, GripVertical } from 'lucide-react'
import { useState } from 'react'

interface ManageServicesTabProps {
  services: Service[]
  onSuccess: () => void
}

export default function ManageServicesTab({ services, onSuccess }: ManageServicesTabProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [draggedOverId, setDraggedOverId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    setDeleting(id)
    try {
      const response = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Failed to delete service')
      }
    } catch (error) {
      console.error('[v0] Delete error:', error)
      alert('Failed to delete service')
    } finally {
      setDeleting(null)
    }
  }

  const handleDragStart = (id: string) => {
    setDraggingId(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    setDraggedOverId(id)
  }

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    setDraggedOverId(null)

    if (!draggingId || draggingId === targetId) {
      setDraggingId(null)
      return
    }

    // Reorder services
    const draggedIndex = services.findIndex((s) => s.id === draggingId)
    const targetIndex = services.findIndex((s) => s.id === targetId)

    if (draggedIndex < targetIndex) {
      // Moving down
      for (let i = draggedIndex; i < targetIndex; i++) {
        const newOrder = services[i].display_order
        services[i].display_order = services[i + 1].display_order
      }
      services[targetIndex].display_order = newOrder
    } else {
      // Moving up
      for (let i = draggedIndex; i > targetIndex; i--) {
        const newOrder = services[i].display_order
        services[i].display_order = services[i - 1].display_order
      }
      services[targetIndex].display_order = newOrder
    }

    // Update all affected services
    try {
      for (let i = Math.min(draggedIndex, targetIndex); i <= Math.max(draggedIndex, targetIndex); i++) {
        await fetch('/api/services', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: services[i].id,
            display_order: services[i].display_order,
          }),
        })
      }
      onSuccess()
    } catch (error) {
      console.error('[v0] Reorder error:', error)
    }

    setDraggingId(null)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Manage Services</h3>
        <p className="text-slate-400">{services.length} service{services.length !== 1 ? 's' : ''} configured.</p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400">No services yet. Add your first service to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              draggable
              onDragStart={() => handleDragStart(service.id)}
              onDragOver={(e) => handleDragOver(e, service.id)}
              onDragLeave={() => setDraggedOverId(null)}
              onDrop={(e) => handleDrop(e, service.id)}
              className={`group flex items-center gap-4 p-4 rounded-lg border transition-all cursor-move ${
                draggedOverId === service.id
                  ? 'bg-slate-800/50 border-cyan-500/50'
                  : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <GripVertical size={20} className="text-slate-500 group-hover:text-slate-400 flex-shrink-0" />

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white">{service.name}</h4>
                {service.description && <p className="text-sm text-slate-400">{service.description}</p>}
                <p className="text-xs text-slate-500 truncate">{service.api_url}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 py-1 text-xs font-semibold rounded bg-slate-700 text-slate-200 uppercase">
                  {STATUS_TYPE_LABELS[service.status_type]}
                </span>

                <button
                  className="p-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Edit service"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deleting === service.id}
                  className="p-2 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Delete service"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
