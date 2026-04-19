'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import api from '@/lib/api'
import { FiPlayCircle, FiEye, FiEyeOff, FiLoader } from 'react-icons/fi'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined
      toast.error(msg || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background bg-grid-pattern bg-grid">
      {/* Ambient gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background pointer-events-none z-0" />

      {/* Purple glow blobs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-dim/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 py-12">
        <div className="glass-panel rounded-3xl border border-outline-variant/15 shadow-ambient p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 mb-4 shadow-[0_0_15px_rgba(189,157,255,0.2)]">
              <FiPlayCircle className="text-primary text-2xl fill-current" />
            </div>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-gradient-primary mb-1">AIVidGen</h1>
            <p className="text-sm text-on-surface-variant text-center">Generate AI-powered video scripts in seconds</p>
          </div>

          <div className="w-full h-px bg-outline-variant/30 mb-8" />

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@studio.com"
                className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary-dim focus:border-primary-dim transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] placeholder:text-on-surface-variant/50 text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-on-surface" htmlFor="password">Password</label>
                <a href="#" className="text-xs font-medium text-primary hover:text-primary-dim transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-1 focus:ring-primary-dim focus:border-primary-dim transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] placeholder:text-on-surface-variant/50 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <FiEye className="text-lg" /> : <FiEyeOff className="text-lg" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-3 px-4 rounded-xl shadow-primary-glow hover:shadow-[0_6px_20px_rgba(189,157,255,0.4)] transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && (
                <FiLoader className="text-lg animate-spin" />
              )}
              {loading ? 'Signing In...' : 'Sign In to Workspace'}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dim transition-colors">Register</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
