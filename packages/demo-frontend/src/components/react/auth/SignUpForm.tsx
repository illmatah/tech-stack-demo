import * as React from 'react'

import { authClient } from '../../../api/auth'
import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'


export function SignUpForm() {
  const [ name, setName ] = React.useState('')
  const [ email, setEmail ] = React.useState('')
  const [ password, setPassword ] = React.useState('')
  const [ error, setError ] = React.useState<string | null>(null)
  const [ pending, setPending ] = React.useState(false)

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPending(true)
    setError(null)

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name
      })
      if (signUpError) {
        setError(signUpError.message || 'Sign up failed')

        return
      }

      globalThis.location.href = '/forum'
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'Sign up failed')
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Set up your profile and start posting.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <Input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Display name"
            required
          />
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
              <AlertTitle>Sign up failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={pending}>
            Create account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
