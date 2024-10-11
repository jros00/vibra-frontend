export interface SongCardProps {
    image: any; // Accepts the image source (can be a local image using require or a URI string)
    palette?: Array<Array<number>>; // Optional array of arrays for colors
    dominantColor?: Array<number>; // Optional dominant color array
  }