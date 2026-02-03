import { IconName } from "../../icons/icon.type";
import { InputProps } from "../common/input-props";

export interface SelectOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface SelectProps extends InputProps {
  onClear?: () => void;
  options: SelectOption[];
  showResetButton?: boolean;
  width?: number;
  multiple?: boolean;
  multipleValue?: string[];
  onMultipleChange?: (values: string[]) => void;
}
