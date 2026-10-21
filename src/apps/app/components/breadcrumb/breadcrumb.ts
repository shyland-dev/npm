import { Component } from '@angular/core';
import { BreadcrumbComponent, BreadcrumbItemComponent } from '@shyland-dev/ui';

@Component({
  selector: 'app-breadcrumb-page',
  imports: [BreadcrumbComponent, BreadcrumbItemComponent],
  templateUrl: './breadcrumb.html',
})
export class BreadcrumbPage {}
