import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LucideMessageSquare } from '@lucide/angular';

import { ChatNavigationState } from '../../../models/chat-navigation-state.model';
import { ChatbotService } from '../../../services/chatbot.service';
import { ChatHistoryStore } from '../../../stores/chat-history.store';
import { AssistantResponse } from '../../chat/components/assistant-response/assistant-response.component';
import { ChatComposer } from '../../chat/components/chat-composer/chat-composer.component';
import { UserMessage } from '../../chat/components/user-message/user-message.component';

@Component({
  selector: 'app-new-chat-page',
  imports: [LucideMessageSquare, AssistantResponse, ChatComposer, UserMessage],
  templateUrl: './new-chat-page.component.html',
  host: { class: 'block h-full min-h-0 overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewChatPage {
  private readonly chatbotService = inject(ChatbotService);
  private readonly chatHistoryStore = inject(ChatHistoryStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly draft = signal('');
  protected readonly submittedMessage = signal<string | null>(null);
  protected readonly pending = signal(false);
  protected readonly error = signal<string | undefined>(undefined);

  protected send(message: string): void {
    if (this.pending()) {
      return;
    }

    const timestamp = new Date().toISOString();
    this.submittedMessage.set(message);
    this.draft.set('');
    this.error.set(undefined);
    this.pending.set(true);

    this.chatbotService
      .sendMessage({ message })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.pending.set(false);
          this.chatHistoryStore.addChat(result.session_id);

          const navigationState: ChatNavigationState = {
            sessionId: result.session_id,
            initialMessages: [
              { role: 'user', content: message, timestamp },
              {
                role: 'assistant',
                content: result.response,
                timestamp: new Date().toISOString(),
                simulator: result.simulator,
              },
            ],
          };

          void this.router.navigate(['/chat', result.session_id], { state: navigationState });
        },
        error: () => {
          this.pending.set(false);
          this.error.set('The response could not be loaded. Check your connection and try again.');
          this.draft.set(message);
        },
      });
  }
}
