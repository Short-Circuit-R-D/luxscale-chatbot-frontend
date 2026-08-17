import { DOCUMENT, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';

import { ChatbotService, ChatTurn } from '../../services/chatbot.service';
import { ChatHistoryStore } from '../../stores/chat-history.store';
import { ChatNavigationState } from './chat-navigation-state';
import { AssistantResponse } from './components/assistant-response.component';
import { ChatComposer } from './components/chat-composer.component';
import { UserMessage } from './components/user-message.component';

@Component({
  selector: 'app-chat-page',
  imports: [RouterLink, AssistantResponse, ChatComposer, UserMessage],
  templateUrl: './chat-page.component.html',
  host: { class: 'block h-full min-h-0 overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatPage {
  private readonly chatbotService = inject(ChatbotService);
  private readonly chatHistoryStore = inject(ChatHistoryStore);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');
  private initialNavigationState = this.readNavigationState();

  protected readonly sessionId = signal<string | null>(null);
  protected readonly messages = signal<ChatTurn[]>([]);
  protected readonly draft = signal('');
  protected readonly loading = signal(false);
  protected readonly pending = signal(false);
  protected readonly loadError = signal<string | undefined>(undefined);
  protected readonly sendError = signal<string | undefined>(undefined);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((sessionId) => this.openSession(sessionId));

    effect((onCleanup) => {
      this.messages();
      this.pending();

      const view = this.document.defaultView;
      const container = this.scrollContainer()?.nativeElement;
      if (!view || !container) {
        return;
      }

      const animationFrame = view.requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      });
      onCleanup(() => view.cancelAnimationFrame(animationFrame));
    });
  }

  protected send(message: string): void {
    const sessionId = this.sessionId();
    if (!sessionId || this.pending() || this.loading()) {
      return;
    }

    const userTurn: ChatTurn = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    this.messages.update((messages) => [...messages, userTurn]);
    this.draft.set('');
    this.sendError.set(undefined);
    this.pending.set(true);

    this.chatbotService
      .sendMessage({ session_id: sessionId, message })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.messages.update((messages) => [
            ...messages,
            {
              role: 'assistant',
              content: result.response,
              timestamp: new Date().toISOString(),
            },
          ]);
          this.chatHistoryStore.addChat(result.session_id);
          this.pending.set(false);
        },
        error: () => {
          this.pending.set(false);
          this.sendError.set('The response could not be loaded. Your message was not sent.');
          this.draft.set(message);
        },
      });
  }

  private openSession(sessionId: string | null): void {
    this.sessionId.set(sessionId);
    this.messages.set([]);
    this.loadError.set(undefined);
    this.sendError.set(undefined);

    if (!sessionId) {
      this.loading.set(false);
      return;
    }

    const initialState = this.initialNavigationState;
    this.initialNavigationState = null;
    if (initialState?.sessionId === sessionId) {
      this.messages.set(initialState.initialMessages);
      this.chatHistoryStore.addChat(sessionId);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.chatbotService
      .getChat(sessionId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (chat) => {
          if (this.sessionId() !== sessionId) {
            return;
          }
          this.messages.set(chat.messages);
          this.chatHistoryStore.addChat(chat.session_id);
          this.loading.set(false);
        },
        error: () => {
          if (this.sessionId() !== sessionId) {
            return;
          }
          this.loading.set(false);
          this.loadError.set('This conversation could not be loaded. Please try again later.');
        },
      });
  }

  private readNavigationState(): ChatNavigationState | null {
    const state = this.location.getState() as Partial<ChatNavigationState>;
    if (typeof state.sessionId !== 'string' || !Array.isArray(state.initialMessages)) {
      return null;
    }

    return {
      sessionId: state.sessionId,
      initialMessages: state.initialMessages,
    };
  }
}
