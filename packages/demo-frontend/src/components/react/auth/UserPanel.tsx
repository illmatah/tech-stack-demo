import * as React from 'react'

import { authClient } from '../../../api/auth'
import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'


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

export function UserPanel() {
  const [ session, setSession ] = React.useState<SessionPayload | null>(null)
  const [ error, setError ] = React.useState<string | null>(null)
  const [ pending, setPending ] = React.useState(true)

  const refreshSession = React.useCallback(async () => {
    setPending(true)
    setError(null)

    try {
      const { data, error: sessionError } = await authClient.getSession()
      if (sessionError) {
        setError(sessionError.message || 'Unable to load session')
      }

      setSession(toSession(data))
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Unable to load session')
      setSession(null)
    } finally {
      setPending(false)
    }
  }, [])

  React.useEffect(() => {
    void refreshSession()
  }, [ refreshSession ])

  const handleSignOut = async () => {
    setPending(true)
    setError(null)

    try {
      await authClient.signOut()
      setSession(null)
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Sign out failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your account</CardTitle>
        <CardDescription>Account and session controls.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pending ? (
          <div className="text-sm text-slate-500 dark:text-slate-400">Loading session...</div>
        ) : null}
        {!pending && error ? (
          <Alert variant="destructive">
            <AlertTitle>Account unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!pending && !error ? (
          <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
            <div className="text-sm text-slate-500 dark:text-slate-400">Signed in as</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {session?.user?.name || session?.user?.email || 'Guest'}
            </div>
          </div>
        ) : null}
        {session ? (
          <Button variant="outline" onClick={handleSignOut} disabled={pending}>
            Sign out
          </Button>
        ) : (
          <div className="flex flex-wrap gap-3 text-sm">
            <a className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" href="/auth/sign-in">
              Sign in
            </a>
            <a className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" href="/auth/sign-up">
              Sign up
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
