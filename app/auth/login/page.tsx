'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        <p className="text-slate-400">Sign in to your NexusCluster account</p>
      </div>
      <SignIn
        afterSignInUrl="/"
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-lg shadow-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton:
              'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white',
            formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
            formFieldInput: 'bg-slate-800 border-slate-700 text-white',
            footerActionLink: 'text-purple-400 hover:text-purple-300',
          },
        }}
      />
    </div>
  )
}
