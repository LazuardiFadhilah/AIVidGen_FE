'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import api from '@/lib/api'

const VIDEO_TYPES = [
  { value: 'marketing', label: 'Marketing Explainer' },
  { value: 'educational', label: 'Educational Tutorial' },
  { value: 'social_media', label: 'Social Media Ad' },
  { value: 'explainer', label: 'Explainer Video' },
]

const TONES = [
  { value: 'formal', label: 'Formal' },
  { value: 'casual', label: 'Casual' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'inspirational', label: 'Inspirational' },
]

const DURATIONS = ['15s', '30s', '60s', '90s']

interface Scene { sceneNumber: number; timeRange: string; visual: string; script: string }
interface GenerationOutput { title: string; fullScript: string; scenes: Scene[] }
interface Generation { _id: string; videoType: string; duration: string; output: GenerationOutput }

export default function DashboardPage() {
  const [videoType, setVideoType] = useState('marketing')
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('casual')
  const [duration, setDuration] = useState('30s')
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Generation | null>(null)
  const [scriptOpen, setScriptOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const addKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keywordInput.trim()) {
      e.preventDefault()
      if (!keywords.includes(keywordInput.trim())) {
        setKeywords([...keywords, keywordInput.trim()])
      }
      setKeywordInput('')
    }
  }

  const removeKeyword = (kw: string) => setKeywords(keywords.filter((k) => k !== kw))

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Please enter a topic'); return }
    setLoading(true)
    setResult(null)
    try {
      const { data } = await api.post('/generate', { videoType, topic, audience, tone, duration, keywords })
      setResult(data.generation)
      toast.success('Script generated!')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error(msg || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const copyScript = () => {
    if (!result?.output.fullScript) return
    navigator.clipboard.writeText(result.output.fullScript)
    setCopied(true)
    toast.success('Script copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadScript = () => {
    if (!result) return
    const blob = new Blob([result.output.fullScript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${result.output.title || 'script'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 lg:p-8 bg-surface bg-[radial-gradient(ellipse_at_top_right,#131319_0%,transparent_60%)]">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl lg:text-4xl font-bold text-on-surface tracking-[-0.04em] mb-1">Generate Video Script</h1>
          <p className="text-on-surface-variant text-sm">Describe your video and let AI do the rest.</p>
        </header>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Settings */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/15 shadow-[0px_24px_48px_rgba(0,0,0,0.4)]">

              {/* Video Type */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Video Type</label>
                <div className="relative">
                  <select
                    value={videoType}
                    onChange={(e) => setVideoType(e.target.value)}
                    className="w-full bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:border-primary-dim focus:ring-1 focus:ring-primary-dim appearance-none text-sm transition-all"
                  >
                    {VIDEO_TYPES.map((vt) => (
                      <option key={vt.value} value={vt.value}>{vt.label}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-xl">expand_more</span>
                </div>
              </div>

              {/* Audience */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Target Audience</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">group</span>
                  <input
                    type="text" value={audience} onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g. Young Professionals, Tech Enthusiasts"
                    className="w-full bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary-dim focus:ring-1 focus:ring-primary-dim text-sm placeholder:text-on-surface-variant/50 transition-all"
                  />
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setTone(t.value)}
                      className={`py-2 px-3 text-sm font-medium rounded-xl border transition-colors ${
                        tone === t.value
                          ? 'bg-primary/20 text-primary border-primary/30'
                          : 'bg-surface-container-high text-on-surface-variant border-outline-variant/15 hover:bg-surface-variant'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Topic + Keywords + Duration + CTA */}
          <div className="lg:col-span-7">
            <div className="bg-surface-container-low rounded-2xl p-5 border border-outline-variant/15 shadow-[0px_24px_48px_rgba(0,0,0,0.4)] h-full flex flex-col gap-5">

              {/* Topic */}
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider flex items-center justify-between">
                  Topic / Core Idea
                  <span className="text-xs text-primary normal-case">AI Enhanced</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Describe what happens in your video. The more detail, the better the script..."
                  className="w-full flex-1 min-h-[120px] bg-surface-container-lowest text-on-surface border border-outline-variant/15 rounded-xl py-3 px-4 focus:outline-none focus:border-primary-dim focus:ring-1 focus:ring-primary-dim font-headline text-base resize-none placeholder:text-on-surface-variant/30 transition-all"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Keywords & Elements</label>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {keywords.map((kw) => (
                      <span key={kw} className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        {kw}
                        <button onClick={() => removeKeyword(kw)} className="hover:text-primary-dim ml-1">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={addKeyword}
                  placeholder="Add keyword and press Enter..."
                  className="w-full bg-surface-container-high text-on-surface border border-outline-variant/15 rounded-xl py-2.5 px-4 focus:outline-none focus:border-primary-dim focus:ring-1 focus:ring-primary-dim text-sm placeholder:text-on-surface-variant/50 transition-all"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-medium text-on-surface-variant mb-2 uppercase tracking-wider">Target Duration</label>
                <div className="flex bg-surface-container-lowest p-1 rounded-xl border border-outline-variant/15 gap-1">
                  {DURATIONS.map((d) => (
                    <button
                      key={d} type="button" onClick={() => setDuration(d)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        duration === d
                          ? 'bg-surface-container-highest text-primary border border-outline-variant/30 shadow-sm'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-[0px_0px_20px_rgba(189,157,255,0.2)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                    <span className="text-base">Generating Script...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>magic_button</span>
                    <span className="text-base">Generate Script & Scenes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-5 animate-[fade-in_0.4s_ease]">
            {/* Result Header */}
            <div className="bg-surface-container-low rounded-2xl p-5 border border-primary/20 shadow-ambient">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                      {result.videoType.replace('_', ' ')}
                    </span>
                    <span className="bg-surface-container-highest text-on-surface-variant px-2.5 py-0.5 rounded-full text-xs font-medium border border-outline-variant/30">
                      {result.duration}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-on-surface tracking-tight">{result.output.title}</h2>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={copyScript}
                    className="bg-surface-container-highest text-on-surface border border-outline-variant/15 rounded-xl py-2 px-3 text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">{copied ? 'check' : 'content_copy'}</span>
                    <span className="hidden sm:inline">Copy</span>
                  </button>
                  <button
                    onClick={downloadScript}
                    className="bg-surface-container-highest text-on-surface border border-outline-variant/15 rounded-xl py-2 px-3 text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">download</span>
                    <span className="hidden sm:inline">.txt</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Scenes */}
            <div className="space-y-3">
              {result.output.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="bg-surface-container-highest rounded-2xl p-5 border-l-4 border-l-primary border border-outline-variant/15 flex flex-col md:flex-row gap-5"
                >
                  <div className="md:w-1/4 flex-shrink-0">
                    <span className="text-primary font-bold text-sm block mb-1">Scene {String(scene.sceneNumber).padStart(2, '0')}</span>
                    <span className="text-on-surface-variant text-xs">{scene.timeRange}</span>
                  </div>
                  <div className="md:w-3/4 space-y-3">
                    <div>
                      <h4 className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">Visual</h4>
                      <p className="text-on-surface text-sm leading-relaxed">{scene.visual}</p>
                    </div>
                    <div className="bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/10">
                      <h4 className="text-xs font-bold text-tertiary uppercase tracking-wider mb-1">Audio / Script</h4>
                      <p className="text-on-surface-variant text-sm italic">&ldquo;{scene.script}&rdquo;</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Full Script Collapsible */}
            <div className="bg-surface-container-low rounded-2xl border border-outline-variant/15 overflow-hidden">
              <button
                onClick={() => setScriptOpen(!scriptOpen)}
                className="w-full flex items-center justify-between p-4 text-on-surface hover:bg-surface-container-highest transition-colors"
              >
                <span className="font-bold text-sm">View Full Script</span>
                <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${scriptOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>
              {scriptOpen && (
                <div className="px-4 pb-4">
                  <pre className="bg-surface-container-lowest rounded-xl p-4 text-on-surface text-sm leading-relaxed whitespace-pre-wrap font-sans border border-outline-variant/10">
                    {result.output.fullScript}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
