export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: {
    id: number;
    username: string;
    profile_picture: string;
  };
  track?: {
    track_id: number;
    track_title: string;
    artist_name: string;
    album_image: string;
    audio_url: string;
  };
}
