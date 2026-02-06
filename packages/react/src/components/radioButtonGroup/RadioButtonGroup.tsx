import { RadioButtonGroupProps as CoreRadioButtonGroupProps } from "@rte-ds/core/components/radio-button-group/radio-button-group.interface";
import React, { forwardRef, useState } from "react";

import RadioButton from "../radioButton/RadioButton";
import Tooltip from "../tooltip/Tooltip";
import { concatClassNames } from "../utils";

import style from "./RadioButtonGroup.module.scss";

interface RadioButtonGroupProps
  extends CoreRadioButtonGroupProps, Omit<React.InputHTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  tooltipTextLabel?: string;
}

const RadioButtonGroup = forwardRef<HTMLDivElement, RadioButtonGroupProps>(
  (
    {
      groupName,
      items,
      direction = "horizontal",
      showItemsLabel = true,
      groupTitle = "",
      showGroupTitle = false,
      groupHelpText = "",
      showHelpText = false,
      errorMessage = "",
      error = false,
      disabled = false,
      readOnly = false,
      className = "",
      value,
      defaultValue,
      onChange,
      tooltipTextLabel,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const isControlled = value !== undefined;
    const selectedValue = isControlled ? value : internalValue;

    const handleChange = (itemValue: string) => {
      if (!isControlled) {
        setInternalValue(itemValue);
      }
      onChange?.(itemValue);
    };

    if (disabled && error) {
      return;
    }

    const content = (
      <div ref={ref} className={concatClassNames(style.radioButtonGroupContainer, className)} {...props}>
        <div
          className={style.radioButtonGroupHeader}
          data-error={error}
          data-disabled={disabled}
          data-read-only={readOnly}
        >
          {groupTitle && showGroupTitle && <h3 className={style.groupTitle}>{groupTitle}</h3>}
          {groupHelpText && showHelpText && <p className={style.groupHelpText}>{groupHelpText}</p>}
          {errorMessage && error && <p className={style.errorMessage}>{errorMessage}</p>}
        </div>
        <div className={style.radioButtonGroup} data-direction={direction}>
          {items.map((item, index) => (
            <RadioButton
              key={index}
              label={item}
              groupName={groupName}
              showLabel={showItemsLabel}
              disabled={disabled}
              error={error}
              readOnly={readOnly}
              checked={selectedValue === item}
              onChange={() => handleChange(item)}
            />
          ))}
        </div>
      </div>
    );

    return (
      <>
        {tooltipTextLabel ? (
          <Tooltip alignment="start" arrow label={tooltipTextLabel} position="bottom">
            {content}
          </Tooltip>
        ) : (
          content
        )}
      </>
    );
  },
);

export default RadioButtonGroup;
