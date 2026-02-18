import { switchHeight, switchWidth } from "@rte-ds/core/components/switch/switch.constants";
import { SwitchProps as CoreSwitchProps } from "@rte-ds/core/components/switch/switch.interface";
import { InputHTMLAttributes, useState, useEffect } from "react";

import Icon from "../icon/Icon";
import RequiredIndicator from "../requiredindicator/RequiredIndicator";
import Tooltip from "../tooltip/Tooltip";
import { concatClassNames } from "../utils";

import style from "./Switch.module.scss";

interface SwitchProps extends CoreSwitchProps, InputHTMLAttributes<HTMLInputElement> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tooltipTextLabel?: string;
}

const Switch = ({
  label,
  appearance = "brand",
  showLabel = true,
  showIcon = true,
  disabled = false,
  readOnly = false,
  checked = false,
  required = false,
  showLabelRequirement = false,
  onChange,
  tooltipTextLabel,
  ...props
}: SwitchProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || disabled) {
      e.stopPropagation();
    } else {
      const inputElement = e.currentTarget.querySelector('input[type="checkbox"]') as HTMLInputElement;
      if (inputElement) {
        inputElement.checked = !isChecked;
        const syntheticEvent = {
          target: inputElement,
          currentTarget: inputElement,
        } as React.ChangeEvent<HTMLInputElement>;
        handleChange(syntheticEvent);
      }
    }
  };

  const content = (
    <div
      className={style["switch-container"]}
      data-appearance={appearance}
      data-disabled={disabled}
      data-read-only={readOnly}
      data-checked={isChecked}
      onClick={handleClick}
    >
      <input
        aria-label={label}
        type="checkbox"
        role="switch"
        name={label}
        className={style["switch"]}
        disabled={disabled}
        checked={isChecked}
        onChange={handleChange}
        readOnly={readOnly}
        style={{
          minHeight: switchHeight,
          minWidth: switchWidth,
        }}
        {...props}
      />
      <div className={style["switch-icon-check"]} data-checked={isChecked}>
        {showIcon && isChecked && <Icon name="check" size={16} />}
        {showIcon && !isChecked && <Icon name="close" size={16} />}
      </div>
      {showLabel && label && (
        <div className={style["label-container"]}>
          <label htmlFor={label} className={concatClassNames(style["switch-label"])}>
            {label}
          </label>
          <RequiredIndicator required={required} showLabelRequirement={showLabelRequirement} />
        </div>
      )}
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
};

export default Switch;
