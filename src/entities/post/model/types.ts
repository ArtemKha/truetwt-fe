export interface Mention {
  id: number
  username: string
}

export interface Post {
  id: number
  userId: number
  username: string
  content: string
  createdAt: string
  mentions: Mention[]
}

export interface CreatePostRequest {
  content: string
}

export interface Comment {
  id: number
  postId: number
  userId: number
  username: string
  content: string
  createdAt: string
}

export interface CreateCommentRequest {
  content: string
}
