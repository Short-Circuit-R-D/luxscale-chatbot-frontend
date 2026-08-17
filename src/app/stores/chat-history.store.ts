import { Injectable, computed, effect, signal } from '@angular/core';

import { ChatHistoryState } from '../models/chat-history-state.model';

const STORAGE_KEY = 'luxscale.chat-history';

const EMPTY_STATE: ChatHistoryState = {
  recentIds: [],
  pinnedIds: [],
};

function loadState(): ChatHistoryState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return EMPTY_STATE;
    }
    const parsed = JSON.parse(raw) as Partial<ChatHistoryState>;
    const recentIds = Array.isArray(parsed.recentIds)
      ? parsed.recentIds.filter((id): id is string => typeof id === 'string')
      : [];
    const pinnedIds = Array.isArray(parsed.pinnedIds)
      ? parsed.pinnedIds.filter((id): id is string => typeof id === 'string')
      : [];
    return {
      recentIds: [...new Set(recentIds)],
      pinnedIds: [...new Set(pinnedIds)],
    };
  } catch {
    return EMPTY_STATE;
  }
}

@Injectable({ providedIn: 'root' })
export class ChatHistoryStore {
  private readonly state = signal<ChatHistoryState>(loadState());

  readonly recentIds = computed(() => this.state().recentIds);
  readonly pinnedIds = computed(() => this.state().pinnedIds);
  readonly recentCount = computed(() => this.recentIds().length);
  readonly pinnedCount = computed(() => this.pinnedIds().length);

  constructor() {
    effect(() => {
      const { recentIds, pinnedIds } = this.state();
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ recentIds, pinnedIds }));
    });
  }

  addChat(id: string): void {
    this.state.update((s) => ({
      ...s,
      recentIds: [id, ...s.recentIds.filter((chatId) => chatId !== id)],
      pinnedIds: s.pinnedIds.filter((chatId) => chatId !== id),
    }));
  }

  pinChat(id: string): void {
    this.state.update((s) => ({
      recentIds: s.recentIds.filter((chatId) => chatId !== id),
      pinnedIds: [id, ...s.pinnedIds.filter((chatId) => chatId !== id)],
    }));
  }

  unpinChat(id: string): void {
    this.state.update((s) => ({
      recentIds: [id, ...s.recentIds.filter((chatId) => chatId !== id)],
      pinnedIds: s.pinnedIds.filter((chatId) => chatId !== id),
    }));
  }

  removeChat(id: string): void {
    this.state.update((s) => ({
      recentIds: s.recentIds.filter((chatId) => chatId !== id),
      pinnedIds: s.pinnedIds.filter((chatId) => chatId !== id),
    }));
  }
}
