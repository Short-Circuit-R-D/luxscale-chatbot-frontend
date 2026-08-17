import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { LucideArrowUp } from '@lucide/angular';

@Component({
  selector: 'app-chat-composer',
  imports: [LucideArrowUp],
  templateUrl: './chat-composer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComposer {
  readonly draft = model('');
  readonly pending = input(false);
  readonly placeholder = input('Ask anything');
  readonly submitted = output<string>();

  protected readonly canSend = computed(
    () => !this.pending() && this.draft().trim().length > 0,
  );

  protected onInput(textarea: HTMLTextAreaElement): void {
    this.draft.set(textarea.value);
    this.resize(textarea);
  }

  protected onEnter(event: Event, textarea: HTMLTextAreaElement): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.shiftKey || keyboardEvent.isComposing) {
      return;
    }

    event.preventDefault();
    this.submit(textarea);
  }

  protected submit(textarea: HTMLTextAreaElement): void {
    if (!this.canSend()) {
      return;
    }

    this.submitted.emit(this.draft().trim());
    textarea.style.height = 'auto';
  }

  private resize(textarea: HTMLTextAreaElement): void {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }
}
