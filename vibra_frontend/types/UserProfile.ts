import { Song } from "./Song";

export interface UserProfile {
    id: number;
    first_name?: string;
    last_name?: string;
    username: string;
    profile_picture: string;
    biography: string;
    followers: number;
    following: number;
    liked_tracks: Song[];

    
}