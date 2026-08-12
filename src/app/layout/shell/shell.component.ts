import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LucidePanelLeftOpen } from '@lucide/angular';

import { SidebarStore } from '../../stores/sidebar.store';
import { Sidebar } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, LucidePanelLeftOpen, Sidebar],
  templateUrl: './shell.component.html',
  host: { class: 'block h-full min-h-0 overflow-hidden' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly sidebarStore = inject(SidebarStore);

  protected readonly smallScreen = this.sidebarStore.smallScreen;
  protected readonly mobileOpen = this.sidebarStore.mobileOpen;
  protected readonly sidebarOverlayOpen = computed(
    () => this.sidebarStore.smallScreen() && this.sidebarStore.mobileOpen(),
  );

  protected openSidebar(): void {
    this.sidebarStore.toggle();
  }

  protected closeSidebar(): void {
    this.sidebarStore.close();
  }
}
