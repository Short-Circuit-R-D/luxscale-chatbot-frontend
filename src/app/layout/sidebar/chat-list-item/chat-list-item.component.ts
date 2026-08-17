import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMessageCircle, LucidePin, LucidePinOff } from '@lucide/angular';

import { ChatHistoryStore } from '../../../stores/chat-history.store';

@Component({
  selector: 'app-chat-list-item',
  imports: [RouterLink, RouterLinkActive, LucideMessageCircle, LucidePin, LucidePinOff],
  templateUrl: './chat-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatListItem {
  private readonly chatHistoryStore = inject(ChatHistoryStore);

  readonly id = input.required<string>();
  readonly pinned = input(false);
  readonly collapsed = input(false);

  protected readonly shortId = computed(() => this.id().slice(0, 8));

  protected togglePin(): void {
    if (this.pinned()) {
      this.chatHistoryStore.unpinChat(this.id());
    } else {
      this.chatHistoryStore.pinChat(this.id());
    }
  }
}
