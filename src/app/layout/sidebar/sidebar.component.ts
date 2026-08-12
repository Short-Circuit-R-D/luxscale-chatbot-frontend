import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  LucideMessageCirclePlus,
  LucideMessagesSquare,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
} from '@lucide/angular';

import { ChatHistoryStore } from '../../stores/chat-history.store';
import { SidebarStore } from '../../stores/sidebar.store';
import { ChatListItem } from './chat-list-item.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterLinkActive,
    LucideMessageCirclePlus,
    LucideMessagesSquare,
    LucidePanelLeftClose,
    LucidePanelLeftOpen,
    ChatListItem,
  ],
  templateUrl: './sidebar.component.html',
  host: { class: 'block h-full min-h-0 shrink-0 overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  private readonly chatHistoryStore = inject(ChatHistoryStore);
  private readonly sidebarStore = inject(SidebarStore);

  protected readonly collapsed = computed(
    () => !this.sidebarStore.smallScreen() && this.sidebarStore.desktopCollapsed(),
  );
  protected readonly smallScreen = this.sidebarStore.smallScreen;
  protected readonly mobileOpen = this.sidebarStore.mobileOpen;
  protected readonly recentIds = this.chatHistoryStore.recentIds;
  protected readonly pinnedIds = this.chatHistoryStore.pinnedIds;

  protected toggleCollapsed(): void {
    this.sidebarStore.toggle();
  }
}
