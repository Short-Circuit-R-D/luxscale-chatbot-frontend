import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

@Component({
  selector: 'app-assistant-response',
  templateUrl: './assistant-response.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssistantResponse {
  readonly content = input('');
  readonly timestamp = input<string>();
  readonly loading = input(false);
  readonly error = input<string>();

  protected readonly renderedContent = computed(() => {
    const html = marked.parse(this.content(), { async: false });
    return DOMPurify.sanitize(html);
  });
}
