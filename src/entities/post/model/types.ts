export interface Post {
  id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  user: {
    id: string
    username: string
  }
}

export interface CreatePostRequest {
  content: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  is_deleted: boolean
  user: {
    id: string
    username: string
  }
}

export interface CreateCommentRequest {
  content: string
}
