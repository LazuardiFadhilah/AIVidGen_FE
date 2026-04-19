import { FiSettings } from 'react-icons/fi'

export default function SettingsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">Settings</h1>
        <p className="text-on-surface-variant text-sm">Manage your account preferences.</p>
        <div className="mt-8 bg-surface-container-low rounded-2xl border border-outline-variant/15 p-8 text-center">
          <FiSettings className="text-on-surface-variant text-5xl block mx-auto mb-3" />
          <p className="text-on-surface-variant">Settings coming soon.</p>
        </div>
      </div>
    </main>
  )
}
