import { Component, signal } from '@angular/core';
import { AlertComponent, ButtonComponent, ShyAlertIntent } from '@shyland-dev/ui';

@Component({
  selector: 'app-alert-page',
  imports: [AlertComponent, ButtonComponent],
  templateUrl: './alert.html',
})
export class AlertPage {
  protected readonly intents: ShyAlertIntent[] = ['info', 'success', 'warning', 'danger'];
  protected readonly dismissed = signal(0);
}
