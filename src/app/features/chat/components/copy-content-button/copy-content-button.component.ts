import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { LucideCheck, LucideCopy } from '@lucide/angular';

@Component({
  selector: 'app-copy-content-button',
  imports: [LucideCheck, LucideCopy],
  templateUrl: './copy-content-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyContentButton {
  readonly content = input.required<string>();
  readonly label = input('Copy content');

  private readonly document = inject(DOCUMENT);
  private resetTimer: number | undefined;

  protected readonly copied = signal(false);
  protected readonly status = signal('');

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.resetTimer !== undefined) {
        this.document.defaultView?.clearTimeout(this.resetTimer);
      }
    });
  }

  protected async copy(): Promise<void> {
    try {
      const view = this.document.defaultView;
      if (!view?.navigator.clipboard) {
        throw new Error('Clipboard API is unavailable');
      }

      await view.navigator.clipboard.writeText(this.content());
      this.copied.set(true);
      this.status.set('Copied to clipboard');

      if (this.resetTimer !== undefined) {
        view.clearTimeout(this.resetTimer);
      }
      this.resetTimer = view.setTimeout(() => {
        this.copied.set(false);
        this.status.set('');
      }, 2_000);
    } catch {
      this.copied.set(false);
      this.status.set('Unable to copy to clipboard');
    }
  }
}
