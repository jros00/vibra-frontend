import { Participant } from "./Participant";
import { Message } from "./Message";

export interface Chat {
    id: number;
    group_picture: string;
    group_name: string;  // Add the group_name field here
    participants: Participant[];
    latest_message: Message;
}