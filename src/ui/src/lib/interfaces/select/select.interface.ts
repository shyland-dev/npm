export interface SelectOption {
  id: number | string;
  value: unknown;
  label: string;
}

export interface SelectionChangeEvent {
  selectedOption: SelectOption;
}
