import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ICONS } from './icons';

@Component({
  selector: 'shy-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent implements AfterViewInit {
  @Input() hoverFill = false;
  @Input() hoverFillDelay = 0;

  @ViewChild('iconName') private iconNameRef!: ElementRef<HTMLElement>;

  svgContent?: SafeHtml;
  svgHoverContent?: SafeHtml;
  isHovered = false;

  constructor(
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const name = this.iconNameRef.nativeElement.textContent?.trim() ?? '';
    const svg = ICONS[name] ?? ICONS['help'];
    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svg);

    if (this.hoverFill) {
      const filledSvg = ICONS[`${name}-filled`];
      if (filledSvg) {
        this.svgHoverContent = this.sanitizer.bypassSecurityTrustHtml(filledSvg);
      }
    }

    this.cdr.detectChanges();
  }

  onMouseEnter(): void {
    if (this.hoverFill && this.svgHoverContent) {
      this.isHovered = true;
    }
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }
}
