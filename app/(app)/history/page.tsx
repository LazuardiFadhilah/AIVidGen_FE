'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { FiSearch, FiLoader, FiVideo, FiClock, FiList, FiPlayCircle, FiTrash2 } from 'react-icons/fi'

interface Scene { sceneNumber: number; timeRange: string; visual: string; script: string }
interface Generation {
  _id: string
  videoType: string
  topic: string
  keywords: string[]
  tone: string
  duration: string
  audience?: string
  createdAt: string
  output: { title: string; fullScript: string; scenes: Scene[] }
}

const TYPE_BADGE: Record<string, string> = {
  marketing: 'bg-secondary-container text-on-secondary-container',
  educational: 'bg-[#1e293b] text-[#94a3b8] border border-[#334155]',
  social_media: 'bg-[#3b2e1e] text-yellow-400 border border-[#713f12]',
  explainer: 'bg-primary-container/20 text-primary-fixed-dim border border-primary/20',
}

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(date).toLocaleDateString()
}

export default function HistoryPage() {
  const router = useRouter()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/history')
      setGenerations(data.generations)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await api.delete(`/history/${id}`)
      setGenerations((prev) => prev.filter((g) => g._id !== id))
      toast.success('Deleted successfully')
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handlePreview = (gen: Generation) => {
    localStorage.setItem('previewGeneration', JSON.stringify(gen))
    router.push('/dashboard')
  }

  const filtered = generations.filter((g) => {
    const matchType = filterType === 'all' || g.videoType === filterType
    const matchSearch = g.output.title.toLowerCase().includes(search.toLowerCase()) ||
      g.topic.toLowerCase().includes(search.toLowerCase())
    return matchType && matchSearch
  })

  return (
    <main className="min-h-screen relative">
      {/* Ambient dot bg */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-[-0.04em] text-on-surface mb-1">Generation History</h1>
          <p className="text-on-surface-variant text-sm">All your previously generated video scripts and scene breakdowns.</p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history..."
                className="bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-dim focus:border-primary-dim transition-all w-56 placeholder:text-on-surface-variant/50"
              />
            </div>
            {/* Filter */}
            <select
              value={filterType} onChange={(e) => setFilterType(e.target.value)}
              className="bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-dim appearance-none"
            >
              <option value="all">All Types</option>
              <option value="marketing">Marketing</option>
              <option value="educational">Educational</option>
              <option value="social_media">Social Media</option>
              <option value="explainer">Explainer</option>
            </select>
          </div>
          <div className="text-sm text-on-surface-variant">
            {loading ? 'Loading...' : `${filtered.length} project${filtered.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FiLoader className="text-primary text-4xl animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FiVideo className="text-on-surface-variant text-6xl block mx-auto mb-4" />
            <p className="text-on-surface-variant text-lg font-medium">No generations found</p>
            <p className="text-on-surface-variant/60 text-sm mt-1">
              {search || filterType !== 'all' ? 'Try adjusting your search or filter' : 'Go generate your first video script!'}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-2.5 px-6 rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              Create New Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((gen, index) => {
              const isExpanded = expandedId === gen._id
              const isFirst = index === 0
              const badgeClass = TYPE_BADGE[gen.videoType] || 'bg-surface-container-high text-on-surface-variant'

              return (
                <div
                  key={gen._id}
                  className={`${isFirst && filtered.length > 2 ? 'lg:col-span-2' : ''} bg-surface-container-low rounded-3xl border border-outline-variant/15 shadow-[0_24px_48px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col relative group hover:border-outline-variant/40 transition-colors duration-300`}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="p-6 flex-1">
                    <div className={`flex ${isFirst && filtered.length > 2 ? 'flex-col md:flex-row gap-6' : 'flex-col gap-4'}`}>
                      {/* Main info */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`${badgeClass} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                            {gen.videoType.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs">
                            <FiClock className="text-lg" />
                            {timeAgo(gen.createdAt)}
                          </div>
                        </div>
                        <h2 className={`font-bold font-headline text-on-surface group-hover:text-primary transition-colors duration-300 mb-2 ${isFirst ? 'text-2xl' : 'text-xl'}`}>
                          {gen.output.title}
                        </h2>
                        <p className="text-on-surface-variant text-sm line-clamp-2 flex-1 leading-relaxed mb-4">{gen.topic}</p>

                        {/* Keywords */}
                        {gen.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {gen.keywords.slice(0, 4).map((kw) => (
                              <span key={kw} className="bg-surface-container-highest border border-outline-variant/20 px-2.5 py-1 rounded-lg text-xs text-on-surface-variant">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Scene preview (featured card only) */}
                      {isFirst && filtered.length > 2 && (
                        <div className="md:w-80 flex-shrink-0 bg-surface-container-highest rounded-xl border border-outline-variant/15 p-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-dim/10 blur-3xl rounded-full pointer-events-none" />
                          <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
                            <FiList className="text-primary text-lg" />
                            Scene Breakdown
                          </h3>
                          <div className="space-y-2">
                            {gen.output.scenes.slice(0, 2).map((scene) => (
                              <div key={scene.sceneNumber} className={`bg-surface-container-low rounded-lg p-2.5 border-t border-r border-b border-outline-variant/10 ${scene.sceneNumber === 1 ? 'border-l-2 border-l-primary' : ''}`}>
                                <div className="flex justify-between items-center mb-1">
                                  <span className={`text-xs font-bold ${scene.sceneNumber === 1 ? 'text-primary' : 'text-on-surface'}`}>Scene {scene.sceneNumber}</span>
                                  <span className="text-[10px] text-on-surface-variant bg-surface px-1.5 py-0.5 rounded">{scene.timeRange}</span>
                                </div>
                                <p className="text-xs text-on-surface-variant line-clamp-2">{scene.visual}</p>
                              </div>
                            ))}
                            {gen.output.scenes.length > 2 && (
                              <button
                                onClick={() => setExpandedId(isExpanded ? null : gen._id)}
                                className="w-full text-center text-xs text-primary font-medium py-2 opacity-70 hover:opacity-100 transition-opacity"
                              >
                                View {gen.output.scenes.length - 2} more scenes
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded scenes */}
                  {isExpanded && (
                    <div className="px-6 pb-4 space-y-2">
                      {gen.output.scenes.slice(2).map((scene) => (
                        <div key={scene.sceneNumber} className="bg-surface-container-highest rounded-xl p-3 border border-outline-variant/10">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-on-surface">Scene {scene.sceneNumber}</span>
                            <span className="text-[10px] text-on-surface-variant">{scene.timeRange}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant">{scene.visual}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="bg-surface-container-highest/60 px-6 py-3 border-t border-outline-variant/15 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-on-surface-variant text-xs">{gen.output.scenes.length} scenes · {gen.duration}</span>
                      <button
                        onClick={() => handlePreview(gen)}
                        className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors font-medium"
                      >
                        <FiPlayCircle className="text-xl" />
                        Preview & Export
                      </button>
                    </div>
                    <button
                      onClick={() => handleDelete(gen._id)}
                      disabled={deletingId === gen._id}
                      className="text-error-dim hover:text-error transition-colors flex items-center justify-center w-8 h-8 rounded-full hover:bg-error-container/10 disabled:opacity-50"
                    >
                      {deletingId === gen._id
                        ? <FiLoader className="text-xl animate-spin" />
                        : <FiTrash2 className="text-xl" />
                      }
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
