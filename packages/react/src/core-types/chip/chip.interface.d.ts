type ChipType = "single" | "multi" | "input";
type ChipSize = "s" | "m";

export interface ChipProps {
  id: string;
  label: string;
  selected?: boolean;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  onClose?: (event: MouseEvent | KeyboardEvent) => void;
  disabled?: boolean;
  type?: ChipType;
  size?: ChipSize;
  clickable?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  textColor?: string;
  backgroundColor?: string;
}
