// app/types/profileSetup.ts
export type ProfileData = {

  username: string;
  country: string;
  profileImage?: string;
  favoritePets: string[];
};

export type Step = 1 | 2 | 3;