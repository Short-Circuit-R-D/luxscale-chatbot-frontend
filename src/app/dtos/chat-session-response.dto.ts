import { ChatTurn } from '../models/chat-turn.model';

export interface ChatSessionResponse {
  session_id: string;
  messages: ChatTurn[];
}
