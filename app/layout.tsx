import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'AIVidGen — AI Video Script Generator',
  description: 'Generate professional AI-powered video scripts in seconds. Built for creators, marketers, and educators.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1f1f26',
              color: '#f9f5fd',
              border: '1px solid rgba(72,71,77,0.3)',
              borderRadius: '0.75rem',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: { primary: '#bd9dff', secondary: '#0e0e13' },
            },
            error: {
              iconTheme: { primary: '#ff6e84', secondary: '#0e0e13' },
            },
          }}
        />
      </body>
    </html>
  )
}
