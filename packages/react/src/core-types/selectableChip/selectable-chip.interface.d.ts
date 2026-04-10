export interface SelectableChipOption {
  label: string;
  value: string;
  icon?: string;
}

export interface SelectableChipProps {
  id: string;
  label: string;
  icon?: string;
  options: SelectableChipOption[];
  value?: string;
  onChange?: (value: string) => void;
  backgroundColor?: string;
  disabled?: boolean;
}
