import { InputHTMLAttributes, useId } from "react";

import { switchHeight, switchWidth } from "../../core-types/switch/switch.constants";
import { SwitchProps as CoreSwitchProps } from "../../core-types/switch/switch.interface";
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
  labelStyle,
  id,
  ...props
}: SwitchProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    onChange?.(e);
  };

  const content = (
    <label
      className={style["switch-container"]}
      data-appearance={appearance}
      data-disabled={disabled}
      data-read-only={readOnly}
      data-checked={checked}
      htmlFor={inputId}
    >
      <input
        id={inputId}
        aria-label={label}
        type="checkbox"
        role="switch"
        name={label}
        className={style["switch"]}
        disabled={disabled}
        checked={checked}
        onChange={handleChange}
        readOnly={readOnly}
        style={{
          minHeight: switchHeight,
          minWidth: switchWidth,
        }}
        {...props}
      />
      <div className={style["switch-icon-check"]} data-checked={checked}>
        {showIcon && checked && <Icon name="check" size={16} />}
        {showIcon && !checked && <Icon name="close" size={16} />}
      </div>
      {showLabel && label && (
        <div className={style["label-container"]}>
          <span className={concatClassNames(style["switch-label"])} style={labelStyle}>
            {label}
          </span>
          <RequiredIndicator required={required} showLabelRequirement={showLabelRequirement} />
        </div>
      )}
    </label>
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
