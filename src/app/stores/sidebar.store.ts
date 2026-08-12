import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStore {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly smallScreenQuery =
    this.document.defaultView?.matchMedia('(max-width: 767px)') ?? null;

  readonly smallScreen = signal(this.smallScreenQuery?.matches ?? false);
  readonly desktopCollapsed = signal(false);
  readonly mobileOpen = signal(false);

  constructor() {
    const handleScreenChange = (event: MediaQueryListEvent): void => {
      this.smallScreen.set(event.matches);
      this.mobileOpen.set(false);
    };

    this.smallScreenQuery?.addEventListener('change', handleScreenChange);
    this.destroyRef.onDestroy(() => {
      this.smallScreenQuery?.removeEventListener('change', handleScreenChange);
    });
  }

  toggle(): void {
    if (this.smallScreen()) {
      this.mobileOpen.update((open) => !open);
      return;
    }

    this.desktopCollapsed.update((collapsed) => !collapsed);
  }

  close(): void {
    if (this.smallScreen()) {
      this.mobileOpen.set(false);
      return;
    }

    this.desktopCollapsed.set(true);
  }
}
