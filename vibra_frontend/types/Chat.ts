import { Participant } from "./Participant";

export interface Chat {
    id: number;
    group_name: string;  // Add the group_name field here
    participants: Participant[];
    last_message: string;
    last_message_timestamp: string;
  }