export interface SelectOption {
  id: number;
  value: string;
  label: string;
  img?: string;
}

export interface SelectionChangeEvent {
  selectedOption: SelectOption;
}
