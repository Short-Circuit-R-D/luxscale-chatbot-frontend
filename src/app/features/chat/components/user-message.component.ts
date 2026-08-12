import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-user-message',
  templateUrl: './user-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessage {
  readonly content = input.required<string>();
  readonly timestamp = input<string>();
}
