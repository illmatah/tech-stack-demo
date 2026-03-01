import * as React from 'react'

import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle
} from '../../reui/frame'


type ForumStatsProps = {
  postCount: number
  searchQuery: string
  userEmail?: string
}

export function ForumStats({ postCount, searchQuery, userEmail }: ForumStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Frame>
        <FramePanel>
          <FrameHeader>
            <FrameTitle>Active posts</FrameTitle>
            <FrameDescription>{`${postCount} on this page`}</FrameDescription>
          </FrameHeader>
        </FramePanel>
      </Frame>
      <Frame>
        <FramePanel>
          <FrameHeader>
            <FrameTitle>Search filter</FrameTitle>
            <FrameDescription>
              {searchQuery ? `Query: ${searchQuery}` : 'All posts visible'}
            </FrameDescription>
          </FrameHeader>
        </FramePanel>
      </Frame>
      <Frame>
        <FramePanel>
          <FrameHeader>
            <FrameTitle>Session</FrameTitle>
            <FrameDescription>
              {userEmail || 'Authenticate to post'}
            </FrameDescription>
          </FrameHeader>
        </FramePanel>
      </Frame>
    </div>
  )
}
