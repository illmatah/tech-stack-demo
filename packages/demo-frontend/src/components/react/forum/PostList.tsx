import * as React from 'react'

import { Alert, AlertDescription, AlertTitle } from '../../reui/alert'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card'
import { Input } from '../../ui/input'
import { Textarea } from '../../ui/textarea'
import type { Post } from './types'


type PostListProps = {
  posts: Post[]
  listPending: boolean
  listError: string | null
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  onSearch: (event: React.SyntheticEvent<HTMLFormElement>) => void
  userId?: string
  editingId: string | null
  editTitle: string
  setEditTitle: React.Dispatch<React.SetStateAction<string>>
  editContent: string
  setEditContent: React.Dispatch<React.SetStateAction<string>>
  actionPending: boolean
  onStartEdit: (post: Post) => void
  onCancelEdit: () => void
  onUpdate: () => Promise<void>
  onDelete: (postId: string) => Promise<void>
  page: number
  canNext: boolean
  onPagePrev: () => void
  onPageNext: () => void
}

export function PostList({
  posts,
  listPending,
  listError,
  searchInput,
  setSearchInput,
  onSearch,
  userId,
  editingId,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  actionPending,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  page,
  canNext,
  onPagePrev,
  onPageNext
}: PostListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Latest posts</CardTitle>
            <CardDescription>
              Jump into a post or edit your own.
            </CardDescription>
          </div>
          <form className="flex items-center gap-2" onSubmit={onSearch}>
            <Input
              value={searchInput}
              onChange={event => setSearchInput(event.target.value)}
              placeholder="Search titles"
            />
            <Button variant="outline" type="submit">
              Filter
            </Button>
          </form>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {listPending ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            Loading posts...
          </div>
        ) : null}
        {!listPending && listError ? (
          <Alert variant="destructive">
            <AlertTitle>Unable to load posts</AlertTitle>
            <AlertDescription>{listError}</AlertDescription>
          </Alert>
        ) : null}
        {!listPending && !listError && posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
            No posts yet. Be the first to share an idea.
          </div>
        ) : null}
        <div className="grid gap-4">
          {posts.map(post => {
            const isOwner = userId === post.authorId
            const isEditing = editingId === post.id

            return (
              <div
                key={post.id}
                className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{isOwner ? 'Your post' : 'Community'}</Badge>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{post.createdAt}</div>
                </div>
                {isEditing ? (
                  <div className="mt-3 grid gap-3">
                    <Input
                      value={editTitle}
                      onChange={event => setEditTitle(event.target.value)}
                    />
                    <Textarea
                      value={editContent}
                      onChange={event => setEditContent(event.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={onUpdate} disabled={actionPending}>
                        Save changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancelEdit}
                        disabled={actionPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 space-y-2">
                    <a
                      className="text-lg font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-200"
                      href={`/forum/${post.id}`}
                    >
                      {post.title}
                    </a>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{post.content}</p>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Updated {post.updatedAt}</span>
                </div>
                {isOwner && !isEditing ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onStartEdit(post)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onDelete(post.id)}
                      disabled={actionPending}
                    >
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between">
          <Button type="button" variant="ghost" onClick={onPagePrev} disabled={page === 1}>
            Previous
          </Button>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Page {page}
          </div>
          <Button type="button" variant="ghost" onClick={onPageNext} disabled={!canNext}>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
