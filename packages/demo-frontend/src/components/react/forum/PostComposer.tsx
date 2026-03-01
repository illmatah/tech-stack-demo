import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'


type PostComposerProps = {
  title: string
  content: string
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setContent: React.Dispatch<React.SetStateAction<string>>
  actionError: string | null
  actionPending: boolean
  canPost: boolean
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
}

export function PostComposer({
  title,
  content,
  setTitle,
  setContent,
  actionError,
  actionPending,
  canPost,
  onSubmit
}: PostComposerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a post</CardTitle>
        <CardDescription>
          Share what is on your mind.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3" onSubmit={onSubmit}>
          <Input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Post title"
            disabled={!canPost}
            required
          />
          <Textarea
            value={content}
            onChange={event => setContent(event.target.value)}
            placeholder="Start the discussion..."
            disabled={!canPost}
            required
          />
          {actionError ? (
            <Alert variant="destructive">
              <AlertTitle>Post update failed</AlertTitle>
              <AlertDescription>{actionError}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" disabled={!canPost || actionPending}>
            Publish post
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
