import { ChatTurn } from './chat-turn.model';

export interface ChatNavigationState {
  sessionId: string;
  initialMessages: ChatTurn[];
}
