import { ChatSimulator } from '../models/chat-simulator.model';

export interface SendMessageResponse {
  session_id: string;
  response: string;
  intent: string;
  simulator: ChatSimulator | null;
}
