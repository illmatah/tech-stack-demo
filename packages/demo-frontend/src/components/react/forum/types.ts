export type SessionPayload = {
  user: {
    id: string
    email?: string
    name?: string
  }
  session: {
    id: string
  }
}

export type Post = {
  id: string
  title: string
  content: string
  authorId: string
  createdAt: string
  updatedAt: string
}

export type AuthMode = 'sign-in' | 'sign-up'
