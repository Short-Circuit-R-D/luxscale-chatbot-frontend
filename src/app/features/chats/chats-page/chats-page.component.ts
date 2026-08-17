import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ChatListItem } from '../../../layout/sidebar/chat-list-item/chat-list-item.component';
import { ChatHistoryStore } from '../../../stores/chat-history.store';

@Component({
  selector: 'app-chats-page',
  imports: [ChatListItem],
  templateUrl: './chats-page.component.html',
  host: { class: 'block h-full min-h-0 overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsPage {
  private readonly chatHistoryStore = inject(ChatHistoryStore);

  protected readonly recentIds = this.chatHistoryStore.recentIds;
  protected readonly pinnedIds = this.chatHistoryStore.pinnedIds;
}
