import api from "./api";

export interface CreatePostData {
  text: string;
  files?: any[];
}

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
  text: string;
  media: {
    url: string;
    type: string;
  }[];
  postType: string;
  shareText?: string;
  sharedPost?: any;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isLikedByMe?: boolean;
  createdAt: string;
  updatedAt: string;
  timeAgo: string;
}

export interface Photo {
  id: string | number;
  url: string;
  postId: string | number;
  createdAt: string;
}

export interface MyPhotosResponse {
  success: boolean;
  data: Photo[];
}

export interface PostResponse {
  success: boolean;
  data: Post;
}

export interface MyPostsResponse {
  success: boolean;
  data: Post[];
}

export interface UserPostsResponse {
  success: boolean;
  data: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserPhotosResponse {
  success: boolean;
  data: string[];
}

export interface Comment {
  id: string | number;
  postId: string | number;
  author: {
    id: string | number;
    name: string;
    username: string;
    avatarUrl: string | null;
  };
  text: string;
  createdAt: string;
  timeAgo: string;
  parentId?: string | number | null;
  replies?: any[];
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comment: Comment;
    replies?: any[];
  }[];
}

export interface AddCommentResponse {
  success: boolean;
  data: Comment;
}

class CommunityService {
  async createPost(formData: FormData): Promise<PostResponse> {
    const response = await api.post<PostResponse>(
      "/community/posts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // Increase timeout for file uploads
      },
    );
    return response;
  }

  async getMyPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<MyPostsResponse> {
    return await api.get<MyPostsResponse>(
      `/community/posts/me?page=${page}&limit=${limit}`,
    );
  }

  async getMyPhotos(): Promise<MyPhotosResponse> {
    return await api.get<MyPhotosResponse>(`/community/posts/me/photos`);
  }

  async getAllPosts(
    page: number = 1,
    limit: number = 10,
  ): Promise<MyPostsResponse> {
    return await api.get<MyPostsResponse>(
      `/community/posts?page=${page}&limit=${limit}`,
    );
  }

  async getPostById(postId: string | number): Promise<PostResponse> {
    return await api.get<PostResponse>(`/community/posts/${postId}`);
  }

  async likePost(postId: string | number): Promise<PostResponse> {
    return await api.post<PostResponse>(`/community/posts/${postId}/like`, {});
  }

  async deletePost(postId: string | number): Promise<{ success: boolean }> {
    return await api.delete<{ success: boolean }>(`/community/posts/${postId}`);
  }

  async reportPost(
    postId: string | number,
    reason: string,
  ): Promise<{ success: boolean; data?: any }> {
    return await api.post<{ success: boolean; data?: any }>(
      `/community/posts/${postId}/report`,
      { reason },
    );
  }

  async likeComment(commentId: string | number): Promise<{
    success: boolean;
    data: {
      id: string;
      postId: string;
      likesCount: number;
      isLikedByMe: boolean;
    };
    message: string;
  }> {
    return await api.post(`/community/comments/${commentId}/like`, {});
  }

  async updateComment(
    commentId: string | number,
    text: string,
  ): Promise<{
    success: boolean;
    data: Comment;
    message: string;
  }> {
    return await api.patch<{
      success: boolean;
      data: Comment;
      message: string;
    }>(`/community/comments/${commentId}`, { text });
  }

  async deleteComment(commentId: string | number): Promise<{
    success: boolean;
    message: string;
  }> {
    return await api.delete<{ success: boolean; message: string }>(
      `/community/comments/${commentId}`,
    );
  }

  async reportComment(
    commentId: string | number,
    reason: string,
  ): Promise<{ success: boolean; message: string }> {
    return await api.post<{ success: boolean; message: string }>(
      `/community/comments/${commentId}/report`,
      { reason },
    );
  }

  async getPostComments(postId: string | number): Promise<CommentsResponse> {
    return await api.get<CommentsResponse>(
      `/community/posts/${postId}/comments`,
    );
  }

  async createComment(data: {
    postId: string | number;
    text: string;
    parentId?: string | number | null;
  }): Promise<AddCommentResponse> {
    const url = data.parentId
      ? `/community/comments/${data.parentId}/replies`
      : `/community/posts/${data.postId}/comments`;

    return await api.post<AddCommentResponse>(url, {
      text: data.text,
    });
  }

  async sharePost(postId: string | number, text?: string): Promise<any> {
    return await api.post(`/community/posts/${postId}/share`, {
      text,
    });
  }

  async getUserPosts(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<UserPostsResponse> {
    return await api.get<UserPostsResponse>(
      `/community/posts/user/${userId}?page=${page}&limit=${limit}`,
    );
  }

  async getUserPhotos(userId: string): Promise<UserPhotosResponse> {
    return await api.get<UserPhotosResponse>(
      `/community/posts/user/${userId}/photos`,
    );
  }
}

export const communityService = new CommunityService();
export default communityService;
