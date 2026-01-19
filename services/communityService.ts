import api from './api';

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

class CommunityService {
    async createPost(formData: FormData): Promise<PostResponse> {
        const response = await api.post<PostResponse>('/community/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 60000, // Increase timeout for file uploads
        });
        return response;
    }

    async getMyPosts(page: number = 1, limit: number = 10): Promise<MyPostsResponse> {
        return await api.get<MyPostsResponse>(`/community/posts/me?page=${page}&limit=${limit}`);
    }

    async getMyPhotos(): Promise<MyPhotosResponse> {
        return await api.get<MyPhotosResponse>(`/community/posts/me/photos`);
    }

    async getAllPosts(page: number = 1, limit: number = 10): Promise<MyPostsResponse> {
        return await api.get<MyPostsResponse>(`/community/posts?page=${page}&limit=${limit}`);
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

    async reportPost(postId: string | number, reason: string): Promise<{ success: boolean; data?: any }> {
        return await api.post<{ success: boolean; data?: any }>(`/community/posts/${postId}/report`, { reason });
    }
}

export const communityService = new CommunityService();
export default communityService;
