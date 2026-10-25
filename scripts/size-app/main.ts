// App mínimo do check-icon-bundle: registra um ícone com provideShyIcons (import estático de /icons, o uso recomendado)
// e usa outro não registrado, que baixa o catálogo sob demanda.
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { EmptyStateComponent, IconComponent, provideShyIcons } from '@shyland-dev/ui';
import { iconCameraVideo } from '@shyland-dev/ui/icons';

@Component({
  selector: 'app-root',
  imports: [IconComponent, EmptyStateComponent],
  template: '<shy-icon name="camera-video" label="Vídeo" /><shy-icon name="home" label="Home" /><shy-empty-state icon="inbox" />',
})
class App {}

bootstrapApplication(App, { providers: [provideShyIcons(iconCameraVideo)] });
