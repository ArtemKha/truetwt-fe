export interface Mention {
  id: number
  username: string
}

export interface UserSummary {
  id: number
  username: string
}

export interface Post {
  id: number
  userId: number
  content: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  user: {
    id: number
    username: string
  }
  mentions: Mention[]
}

export interface TimelinePost {
  id: number
  userId: number
  username: string
  content: string
  createdAt: string
  mentions: UserSummary[]
}

export interface CreatePostRequest {
  content: string
}

export interface Comment {
  id: number
  postId: number
  userId: number
  content: string
  createdAt: string
  updatedAt: string
  isDeleted: boolean
  user: {
    id: number
    username: string
  }
}

export interface CreateCommentRequest {
  content: string
}
