import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { LucideRotateCw, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-simulator-window',
  imports: [LucideRotateCw, LucideX],
  templateUrl: './simulator-window.component.html',
  styleUrl: './simulator-window.component.css',
  host: {
    class:
      'fixed inset-0 z-[200] flex items-stretch justify-center md:items-center md:p-6',
    '(document:keydown.escape)': 'onEscape($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimulatorWindow {
  readonly title = input.required<string>();
  readonly iframeUrl = input.required<string>();
  readonly closed = output<void>();

  private readonly sanitizer = inject(DomSanitizer);
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly frame = viewChild<ElementRef<HTMLIFrameElement>>('frame');
  private readonly closeButton = viewChild<ElementRef<HTMLButtonElement>>('closeButton');

  protected readonly trustedUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeUrl()),
  );

  constructor() {
    afterNextRender(() => {
      this.document.body.appendChild(this.host.nativeElement);
      this.closeButton()?.nativeElement.focus();
    });

    inject(DestroyRef).onDestroy(() => {
      this.host.nativeElement.remove();
    });
  }

  protected reload(): void {
    const iframe = this.frame()?.nativeElement;
    if (!iframe) {
      return;
    }

    iframe.src = this.iframeUrl();
  }

  protected onEscape(event: Event): void {
    event.preventDefault();
    this.closed.emit();
  }
}
