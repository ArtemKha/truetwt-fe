import { apiClient } from '@/shared/api/client'
import type {
  ApiResponse,
  PaginatedResponse,
  TimelineResponse,
} from '@/shared/api/types'
import type {
  Post,
  CreatePostRequest,
  Comment,
  CreateCommentRequest,
} from '../model/types'

export const postApi = {
  getTimeline: (params?: { page?: number; limit?: number }): Promise<
    TimelineResponse<Post>
  > => apiClient.get('/timeline', { params }).then((res) => res.data),

  createPost: (data: CreatePostRequest): Promise<ApiResponse<Post>> =>
    apiClient.post('/posts', data).then((res) => res.data),

  getPost: (id: string): Promise<ApiResponse<Post>> =>
    apiClient.get(`/posts/${id}`).then((res) => res.data),

  deletePost: (id: string): Promise<void> =>
    apiClient.delete(`/posts/${id}`).then((res) => res.data),

  getUserPosts: (
    userId: string,
    params?: { page?: number; limit?: number }
  ): Promise<TimelineResponse<Post>> =>
    apiClient.get(`/posts/user/${userId}`, { params }).then((res) => res.data),

  getPostComments: (postId: string): Promise<PaginatedResponse<Comment>> =>
    apiClient.get(`/posts/${postId}/comments`).then((res) => res.data),

  createComment: (
    postId: string,
    data: CreateCommentRequest
  ): Promise<ApiResponse<Comment>> =>
    apiClient.post(`/posts/${postId}/comments`, data).then((res) => res.data),
}
