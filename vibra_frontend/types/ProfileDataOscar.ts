// types.ts
export interface ProfileData {
    username: string;
    bio: string;
    profileImage: string;
    followerCount: number;
    isFollowing: boolean;
    activities?: string[]; // Adjust type based on the structure of activities
  }
  