import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { ChatSimulator } from '../../../../models/chat-simulator.model';
import { CopyContentButton } from '../copy-content-button/copy-content-button.component';
import { SimulatorWindow } from '../simulator-window/simulator-window.component';

@Component({
  selector: 'app-assistant-response',
  imports: [CopyContentButton, SimulatorWindow],
  templateUrl: './assistant-response.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantResponse {
  readonly content = input('');
  readonly timestamp = input<string>();
  readonly loading = input(false);
  readonly error = input<string>();
  readonly simulator = input<ChatSimulator | null>();

  protected readonly simulatorOpen = signal(false);
  private readonly simulatorTrigger =
    viewChild<ElementRef<HTMLButtonElement>>('simulatorTrigger');

  protected readonly renderedContent = computed(() => {
    const html = marked.parse(this.content(), { async: false });
    return DOMPurify.sanitize(html);
  });

  protected openSimulator(): void {
    if (!this.simulator()) {
      return;
    }

    this.simulatorOpen.set(true);
  }

  protected closeSimulator(): void {
    this.simulatorOpen.set(false);
    this.simulatorTrigger()?.nativeElement.focus();
  }
}
