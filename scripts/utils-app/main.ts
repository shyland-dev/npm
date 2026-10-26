// App mínimo do check-utils-bundle: usa o logger e os helpers de dev. No build de produção nenhum marcador abaixo
// pode sobrar no bundle (o código de dev sai via guard de ngDevMode); no build de desenvolvimento todos aparecem.
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { createShyLogger, shyDeprecated, shyDevOnly, shyInvariant, shyMeasure } from '@shyland-dev/utils';

@Component({ selector: 'app-root', template: 'utils' })
class App {
  private readonly log = createShyLogger('UtilsCheck');

  constructor() {
    this.log.debug('marcador-log');
    shyInvariant(true, 'marcador-invariant');
    shyDeprecated('marcador-deprecated', 'novo');
    shyDevOnly(() => console.log('marcador-devonly'));
    shyMeasure('marcador-measure', () => 1);
  }
}

bootstrapApplication(App);
