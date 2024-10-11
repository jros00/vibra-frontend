export interface Message {
    id: number;
    content: string;
    timestamp: string;
    sender: {
      username: string;
      profile_picture: string;
    };
  }