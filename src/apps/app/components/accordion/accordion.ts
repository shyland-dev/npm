import { Component } from '@angular/core';
import { AccordionComponent, AccordionItemComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-accordion-page',
  imports: [AccordionComponent, AccordionItemComponent],
  templateUrl: './accordion.html',
})
export class AccordionPage {}
