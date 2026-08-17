import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { CopyContentButton } from '../copy-content-button/copy-content-button.component';

@Component({
  selector: 'app-user-message',
  imports: [CopyContentButton],
  templateUrl: './user-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessage {
  readonly content = input.required<string>();
  readonly timestamp = input<string>();
}
