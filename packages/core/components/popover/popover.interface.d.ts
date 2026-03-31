export type PopoverPosition = "auto" | "top" | "bottom" | "left" | "right";
export type PopoverAlignment = "start" | "center" | "end";

export interface PopoverProps {
  primaryButtonLabel?: string;
  content: string | unknown;
  position?: PopoverPosition;
  alignment?: PopoverAlignment;
  arrow?: boolean;
  title?: string | unknown;
  secondaryButtonLabel?: string;
  closeOnClickOutside?: boolean;
  closeOnEscape?: boolean;
  onClickPrimaryButton?: () => void;
  onClickSecondaryButton?: () => void;
  showCloseIcon?: boolean;
}
