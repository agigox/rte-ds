import { forwardRef, InputHTMLAttributes } from "react";

import { TextInputProps as CoreTextInputProps } from "../../core-types/text-input/text-input.interface";

import BaseTextInput from "./baseTextuInput/BaseTextInput";

interface TextInputProps
  extends
    CoreTextInputProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "value" | "defaultValue" | "placeholder"> {
  onChange?: (value: string) => void;
  unit?: string;
  tooltipTextLabel?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({ id, ...props }: TextInputProps, ref) => {
  return <BaseTextInput id={id} {...props} ref={ref} placeholder={undefined} />;
});

export default TextInput;
