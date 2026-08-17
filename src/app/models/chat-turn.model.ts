import { ChatRole } from './chat-role.model';
import { ChatSimulator } from './chat-simulator.model';

export interface ChatTurn {
  role: ChatRole;
  content: string;
  timestamp: string;
  simulator?: ChatSimulator | null;
}
