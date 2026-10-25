// App mínimo do check-icon-bundle: usa só o shy-icon e o shy-empty-state, sem registrar ícones.
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { EmptyStateComponent, IconComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-root',
  imports: [IconComponent, EmptyStateComponent],
  template: '<shy-icon name="home" label="Home" /><shy-empty-state icon="inbox" />',
})
class App {}

bootstrapApplication(App);
