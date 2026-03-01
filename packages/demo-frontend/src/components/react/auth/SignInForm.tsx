import * as React from 'react'

import { authClient } from '../../../api/auth'
import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'


export function SignInForm() {
  const [ email, setEmail ] = React.useState('')
  const [ password, setPassword ] = React.useState('')
  const [ error, setError ] = React.useState<string | null>(null)
  const [ pending, setPending ] = React.useState(false)

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const { error: signInError } = await authClient.signIn.email({
        email,
        password
      })
      if (signInError) {
        setError(signInError.message || 'Sign in failed')

        return
      }

      globalThis.location.href = '/forum'
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Sign in failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Sign in to keep posting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
            placeholder="Email address"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={event => setPassword(event.target.value)}
            placeholder="Password"
            required
          />
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Sign in failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
