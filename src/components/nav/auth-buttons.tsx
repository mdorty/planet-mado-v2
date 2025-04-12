'use client'

import { useSession, signOut } from 'next-auth/react'

export function AuthButtons() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <a href="/login" className="btn btn-primary">
        Login
      </a>
    )
  }

  return (
    <div className="flex gap-4 items-center">
      <a href="/dashboard" className="btn btn-primary">
        Dashboard
      </a>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="btn btn-secondary"
      >
        Logout
      </button>
    </div>
  )
}
