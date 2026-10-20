// happy-dom ainda não implementa a Popover API; os overlays (F4) usam estes stubs nos testes.
const proto = HTMLElement.prototype as HTMLElement & Record<string, unknown>;

if (typeof proto['showPopover'] !== 'function') {
  proto['showPopover'] = function (this: HTMLElement) {
    this.setAttribute('data-popover-open', '');
  };
  proto['hidePopover'] = function (this: HTMLElement) {
    this.removeAttribute('data-popover-open');
  };
  proto['togglePopover'] = function (this: HTMLElement) {
    return this.toggleAttribute('data-popover-open');
  };
}
