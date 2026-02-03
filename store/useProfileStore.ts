import communityService, { Post } from "@/services/communityService";
import petService from "@/services/petService";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

interface ProfileState {
  userPosts: Post[];
  userPhotos: any[];
  userPetsList: any[];
  isLoadingPosts: boolean;
  isLoadingPhotos: boolean;
  isLoadingPets: boolean;

  // Actions
  fetchUserPosts: () => Promise<void>;
  fetchUserPhotos: () => Promise<void>;
  fetchUserPets: () => Promise<void>;
  fetchAllProfileData: () => Promise<void>;
  resetProfileData: () => void;
  setUserPosts: (posts: Post[] | ((prev: Post[]) => Post[])) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  userPosts: [],
  userPhotos: [],
  userPetsList: [],
  isLoadingPosts: false,
  isLoadingPhotos: false,
  isLoadingPets: false,

  fetchUserPosts: async () => {
    set({ isLoadingPosts: true });
    try {
      const response = await communityService.getMyPosts();
      if (response.success) {
        set({ userPosts: response.data });
      }
    } catch (error) {
      console.error("Error loading user posts:", error);
    } finally {
      set({ isLoadingPosts: false });
    }
  },

  fetchUserPhotos: async () => {
    set({ isLoadingPhotos: true });
    try {
      const { user } = useAuthStore.getState();
      const response = await communityService.getMyPhotos();
      if (response.success) {
        const mappedPhotos = response.data
          .map((photo: any) => {
            const photoUrl =
              photo.url ||
              (photo.media && photo.media.length > 0
                ? photo.media[0].url
                : null) ||
              photo.image;

            return {
              uri: photoUrl,
              userName: user?.name || "Me",
              dateText: photo.createdAt
                ? new Date(photo.createdAt).toLocaleDateString()
                : "",
              caption: photo.text || "",
              likesCount: (photo.likesCount || 0).toString(),
              commentsCount: (photo.commentsCount || 0).toString(),
              sharesCount: (photo.sharesCount || 0).toString(),
            };
          })
          .filter((p: any) => p.uri);

        set({ userPhotos: mappedPhotos });
      }
    } catch (error) {
      console.error("Error loading photos:", error);
    } finally {
      set({ isLoadingPhotos: false });
    }
  },

  fetchUserPets: async () => {
    set({ isLoadingPets: true });
    try {
      const data = await petService.getPets();
      set({ userPetsList: data });
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      set({ isLoadingPets: false });
    }
  },

  fetchAllProfileData: async () => {
    await Promise.all([
      get().fetchUserPosts(),
      get().fetchUserPhotos(),
      get().fetchUserPets(),
    ]);
  },

  resetProfileData: () => {
    set({
      userPosts: [],
      userPhotos: [],
      userPetsList: [],
      isLoadingPosts: false,
      isLoadingPhotos: false,
      isLoadingPets: false,
    });
  },

  setUserPosts: (posts) => {
    if (typeof posts === "function") {
      set((state) => ({ userPosts: posts(state.userPosts) }));
    } else {
      set({ userPosts: posts });
    }
  },
}));
