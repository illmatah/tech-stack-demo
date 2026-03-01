import * as React from 'react'

import { client } from '../../../api/client'
import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'


type PostDetailProps = {
  postId: string
}

type Post = {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export function PostDetail({ postId }: PostDetailProps) {
  const [ post, setPost ] = React.useState<Post | null>(null)
  const [ pending, setPending ] = React.useState(true)
  const [ error, setError ] = React.useState<string | null>(null)

  React.useEffect(() => {
    let active = true
    const load = async () => {
      setPending(true)
      setError(null)

      try {
        const data = await client.getPost.query(postId)
        if (active) {
          setPost(data)
        }
      } catch (error_) {
        if (active) {
          setError(error_ instanceof Error ? error_.message : 'Unable to load post')
          setPost(null)
        }
      } finally {
        if (active) {
          setPending(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [ postId ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post detail</CardTitle>
        <CardDescription>Everything about this post.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {pending ? <div className="text-sm text-slate-500">Loading post...</div> : null}
        {!pending && error ? (
          <Alert variant="destructive">
            <AlertTitle>Post unavailable</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {!pending && !error && post ? (
          <div className="space-y-2">
            <div className="text-xl font-semibold text-slate-900">{post.title}</div>
            <p className="text-sm text-slate-600">{post.content}</p>
            <div className="text-xs text-slate-500">Updated {post.updatedAt}</div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
