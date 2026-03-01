import * as React from 'react'

import { authClient } from '../../../api/auth'
import { client } from '../../../api/client'
import type { AuthMode, Post, SessionPayload } from './types'


type UseForumData = {
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
  posts: Post[]
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  searchQuery: string
  listPending: boolean
  listError: string | null
  newTitle: string
  setNewTitle: React.Dispatch<React.SetStateAction<string>>
  newContent: string
  setNewContent: React.Dispatch<React.SetStateAction<string>>
  editingId: string | null
  editTitle: string
  setEditTitle: React.Dispatch<React.SetStateAction<string>>
  editContent: string
  setEditContent: React.Dispatch<React.SetStateAction<string>>
  actionError: string | null
  actionPending: boolean
  canNext: boolean
  handleSearch: (event: React.SyntheticEvent<HTMLFormElement>) => void
  handleSignIn: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
  handleSignUp: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
  handleSignOut: () => Promise<void>
  handleCreatePost: (event: React.SyntheticEvent<HTMLFormElement>) => Promise<void>
  startEdit: (post: Post) => void
  cancelEdit: () => void
  handleUpdate: () => Promise<void>
  handleDelete: (postId: string) => Promise<void>
}

const pageSize = 6

const toSession = (data: unknown) => {
  if (!data || typeof data !== 'object') return null
  if (!('user' in data) || !('session' in data)) return null

  return data as SessionPayload
}

export function useForumData(): UseForumData {
  const [ authMode, setAuthMode ] = React.useState<AuthMode>('sign-in')
  const [ authEmail, setAuthEmail ] = React.useState('')
  const [ authPassword, setAuthPassword ] = React.useState('')
  const [ authName, setAuthName ] = React.useState('')
  const [ authError, setAuthError ] = React.useState<string | null>(null)
  const [ authPending, setAuthPending ] = React.useState(false)
  const [ session, setSession ] = React.useState<SessionPayload | null>(null)

  const [ posts, setPosts ] = React.useState<Post[]>([])
  const [ page, setPage ] = React.useState(1)
  const [ searchInput, setSearchInput ] = React.useState('')
  const [ searchQuery, setSearchQuery ] = React.useState('')
  const [ listPending, setListPending ] = React.useState(true)
  const [ listError, setListError ] = React.useState<string | null>(null)

  const [ newTitle, setNewTitle ] = React.useState('')
  const [ newContent, setNewContent ] = React.useState('')
  const [ editingId, setEditingId ] = React.useState<string | null>(null)
  const [ editTitle, setEditTitle ] = React.useState('')
  const [ editContent, setEditContent ] = React.useState('')
  const [ actionError, setActionError ] = React.useState<string | null>(null)
  const [ actionPending, setActionPending ] = React.useState(false)

  const canNext = posts.length === pageSize

  const refreshSession = React.useCallback(async () => {
    setAuthPending(true)
    setAuthError(null)

    try {
      const { data, error } = await authClient.getSession()
      if (error) {
        setAuthError(error.message || 'Unable to load session')
      }

      setSession(toSession(data))
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Unable to load session')
      setSession(null)
    } finally {
      setAuthPending(false)
    }
  }, [])

  const refreshPosts = React.useCallback(async () => {
    setListPending(true)
    setListError(null)

    try {
      const data = await client.listPosts.query({
        page,
        pageSize,
        search: searchQuery || undefined
      })
      setPosts(data)
    } catch (error) {
      setListError(error instanceof Error ? error.message : 'Unable to load posts')
      setPosts([])
    } finally {
      setListPending(false)
    }
  }, [ page, searchQuery ])

  React.useEffect(() => {
    void refreshSession()
  }, [ refreshSession ])

  React.useEffect(() => {
    void refreshPosts()
  }, [ refreshPosts ])

  const handleSearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setSearchQuery(searchInput.trim())
  }

  const handleSignIn = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthPending(true)
    setAuthError(null)

    try {
      const { data, error } = await authClient.signIn.email({
        email: authEmail,
        password: authPassword
      })
      if (error) {
        setAuthError(error.message || 'Sign in failed')

        return
      }

      setSession(toSession(data))
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign in failed')
    } finally {
      setAuthPending(false)
    }
  }

  const handleSignUp = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthPending(true)
    setAuthError(null)

    try {
      const { data, error } = await authClient.signUp.email({
        email: authEmail,
        password: authPassword,
        name: authName
      })
      if (error) {
        setAuthError(error.message || 'Sign up failed')

        return
      }

      setSession(toSession(data))
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign up failed')
    } finally {
      setAuthPending(false)
    }
  }

  const handleSignOut = async () => {
    setAuthPending(true)
    setAuthError(null)

    try {
      await authClient.signOut()
      setSession(null)
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign out failed')
    } finally {
      setAuthPending(false)
    }
  }

  const handleCreatePost = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActionPending(true)
    setActionError(null)

    try {
      await client.createPost.mutate({
        title: newTitle,
        content: newContent
      })
      setNewTitle('')
      setNewContent('')
      await refreshPosts()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to create post')
    } finally {
      setActionPending(false)
    }
  }

  const startEdit = (post: Post) => {
    setEditingId(post.id)
    setEditTitle(post.title)
    setEditContent(post.content)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditContent('')
  }

  const handleUpdate = async () => {
    if (!editingId) return
    setActionPending(true)
    setActionError(null)

    try {
      await client.updatePost.mutate({
        id: editingId,
        title: editTitle,
        content: editContent
      })
      cancelEdit()
      await refreshPosts()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to update post')
    } finally {
      setActionPending(false)
    }
  }

  const handleDelete = async (postId: string) => {
    setActionPending(true)
    setActionError(null)

    try {
      await client.deletePost.mutate(postId)
      await refreshPosts()
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Unable to delete post')
    } finally {
      setActionPending(false)
    }
  }

  return {
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
    posts,
    page,
    setPage,
    searchInput,
    setSearchInput,
    searchQuery,
    listPending,
    listError,
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    editingId,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    actionError,
    actionPending,
    canNext,
    handleSearch,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    handleCreatePost,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleDelete
  }
}
