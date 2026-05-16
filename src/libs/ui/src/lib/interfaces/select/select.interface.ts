export interface SelectOption {
  id: number;
  value: string;
  label: string;
}

export interface SelectionChangeEvent {
  selectedOption: SelectOption;
}
