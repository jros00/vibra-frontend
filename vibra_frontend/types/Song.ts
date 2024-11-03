export interface Song {
  sender: unknown;
  id: number;
  track_id: number;
  album_image: string;
  album_image_palette: Array<Array<number>>;
  album_image_dominant_color: Array<number>;
  album_name: string;
  audio_url: string;
  track_title: string;
  artist_name: string;
}