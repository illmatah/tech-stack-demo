import * as React from 'react'

import { ForumStats } from './ForumStats'
import { PostComposer } from './PostComposer'
import { PostList } from './PostList'
import { useForumData } from './useForumData'


export default function ForumBoard() {
  const {
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
    handleCreatePost,
    startEdit,
    cancelEdit,
    handleUpdate,
    handleDelete
  } = useForumData()

  return (
    <div className="space-y-6">
      <ForumStats
        postCount={posts.length}
        searchQuery={searchQuery}
        userEmail={session?.user?.email}
      />
      <PostComposer
        title={newTitle}
        content={newContent}
        setTitle={setNewTitle}
        setContent={setNewContent}
        actionError={actionError}
        actionPending={actionPending}
        canPost={Boolean(session)}
        onSubmit={handleCreatePost}
      />
      <PostList
        posts={posts}
        listPending={listPending}
        listError={listError}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onSearch={handleSearch}
        userId={session?.user?.id}
        editingId={editingId}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        editContent={editContent}
        setEditContent={setEditContent}
        actionPending={actionPending}
        onStartEdit={startEdit}
        onCancelEdit={cancelEdit}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        page={page}
        canNext={canNext}
        onPagePrev={() => setPage(value => Math.max(1, value - 1))}
        onPageNext={() => setPage(value => value + 1)}
      />
    </div>
  )
}
