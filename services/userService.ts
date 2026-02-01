import api from "./api";

// Define the structure based on the user's provided JSON
export interface PetPal {
  id: string;
  name: string;
  username?: string;
  avatarUrl: string | null;
  bio?: string;
  lastSeenAt?: string | null;
}

export interface PetPalsResponse {
  success: boolean;
  data: PetPal[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  bio: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  address: string;
  location: {
    city: string;
    country: string;
  };
  isVerified: boolean;
  isPhoneVerified: boolean;
  favorites: any[];
  pets: any[]; // Define specific pet type if needed, leveraging existing types
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchUsersResponse {
  success: boolean;
  data: PetPal[]; // The data structure for users in search is same as PetPal
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

class UserService {
  /**
   * Get Pet Pals list
   * @param page Page number
   * @param limit Items per page
   */
  async getPetPals(
    page: number = 1,
    limit: number = 20,
    search: string = "",
  ): Promise<PetPalsResponse> {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (search) {
      query.append("search", search);
    }
    return await api.get<PetPalsResponse>(
      `/users/pet-pals?${query.toString()}`,
    );
  }

  /**
   * Get User Profile details
   * @param id User ID
   */
  async getUserProfile(id: string): Promise<UserProfileResponse> {
    return await api.get<UserProfileResponse>(`/users/${id}`);
  }

  /**
   * Search Users
   * @param query Search query string
   */
  async searchUsers(query: string): Promise<SearchUsersResponse> {
    return await api.get<SearchUsersResponse>(`/users/search?query=${query}`);
  }
}

export const userService = new UserService();
export default userService;
