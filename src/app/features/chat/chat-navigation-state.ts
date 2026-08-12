import { ChatTurn } from '../../services/chatbot.service';

export interface ChatNavigationState {
  sessionId: string;
  initialMessages: ChatTurn[];
}
