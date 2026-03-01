import * as React from 'react'

import { authClient } from '../../api/auth'
import { Button } from '../ui/button'


type SessionPayload = {
  user: {
    id: string
    email?: string
    name?: string
  }
}

const toSession = (data: unknown) => {
  if (!data || typeof data !== 'object') return null
  if (!('user' in data)) return null

  return data as SessionPayload
}

export function HeaderNav() {
  const [ session, setSession ] = React.useState<SessionPayload | null>(null)
  const [ pending, setPending ] = React.useState(false)

  const refreshSession = React.useCallback(async () => {
    try {
      const { data } = await authClient.getSession()
      setSession(toSession(data))
    } catch {
      setSession(null)
    }
  }, [])

  React.useEffect(() => {
    void refreshSession()
  }, [ refreshSession ])

  const handleSignOut = async () => {
    setPending(true)

    try {
      await authClient.signOut()
      setSession(null)
    } finally {
      setPending(false)
    }
  }

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
      <a className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100" href="/">
        Overview
      </a>
      <a className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100" href="/forum">
        Posts
      </a>
      <a className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100" href="/auth">
        Account
      </a>
      {session ? (
        <Button variant="outline" onClick={handleSignOut} disabled={pending}>
          Sign out
        </Button>
      ) : (
        <div className="flex flex-wrap gap-2">
          <a className="rounded-full px-4 py-2 text-slate-600 hover:bg-slate-100" href="/auth/sign-in">
            Sign in
          </a>
          <a className="rounded-full bg-slate-900 px-4 py-2 text-white" href="/auth/sign-up">
            Sign up
          </a>
        </div>
      )}
    </nav>
  )
}
