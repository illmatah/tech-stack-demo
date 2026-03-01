import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import type { AuthMode, SessionPayload } from './types'


type AuthPanelProps = {
  authMode: AuthMode
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>
  authEmail: string
  setAuthEmail: React.Dispatch<React.SetStateAction<string>>
  authPassword: string
  setAuthPassword: React.Dispatch<React.SetStateAction<string>>
  authName: string
  setAuthName: React.Dispatch<React.SetStateAction<string>>
  authError: string | null
  authPending: boolean
  session: SessionPayload | null
  onSignIn: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
  onSignUp: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
  onSignOut: () => Promise<void>
}

export function AuthPanel({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authName,
  setAuthName,
  authError,
  authPending,
  session,
  onSignIn,
  onSignUp,
  onSignOut
}: AuthPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forum access</CardTitle>
        <CardDescription>
          Use Better Auth email + password flow to create or sign in to an account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {session ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-slate-600">Signed in as</div>
              <div className="text-lg font-semibold text-slate-900">
                {session.user.name || session.user.email || 'Member'}
              </div>
            </div>
            <Button variant="outline" onClick={onSignOut} disabled={authPending}>
              Sign out
            </Button>
          </div>
        ) : (
          <form
            className="grid gap-4 sm:grid-cols-[1fr_auto]"
            onSubmit={authMode === 'sign-in' ? onSignIn : onSignUp}
          >
            <div className="grid gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                <button
                  type="button"
                  onClick={() => setAuthMode('sign-in')}
                  className={
                    authMode === 'sign-in'
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-700'
                  }
                >
                  Sign in
                </button>
                <span className="text-slate-300">/</span>
                <button
                  type="button"
                  onClick={() => setAuthMode('sign-up')}
                  className={
                    authMode === 'sign-up'
                      ? 'text-slate-900'
                      : 'text-slate-400 hover:text-slate-700'
                  }
                >
                  Sign up
                </button>
              </div>
              {authMode === 'sign-up' ? (
                <Input
                  value={authName}
                  onChange={event => setAuthName(event.target.value)}
                  placeholder="Display name"
                  required
                />
              ) : null}
              <Input
                type="email"
                value={authEmail}
                onChange={event => setAuthEmail(event.target.value)}
                placeholder="Email address"
                required
              />
              <Input
                type="password"
                value={authPassword}
                onChange={event => setAuthPassword(event.target.value)}
                placeholder="Password"
                required
              />
              {authError ? (
                <Alert variant="destructive">
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              ) : null}
            </div>
            <Button className="self-start" disabled={authPending}>
              {authMode === 'sign-in' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
