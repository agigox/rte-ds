export interface DateTimePickerProps {
  id: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  showTime?: boolean;
  placeholder?: string;
  error?: boolean;
  assistiveText?: string;
}
