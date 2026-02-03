import {
  MIN_SELECT_WIDTH,
  SELECT_DROPDOWN_OFFSET,
  THRESHOLD_BOTTOM_POSITION,
} from "@rte-ds/core/components/select/select.constants";
import { SelectProps as coreSelectProps } from "@rte-ds/core/components/select/select.interface";
import { ENTER_KEY, SPACE_KEY } from "@rte-ds/core/constants/keyboard/keyboard.constants";
import { forwardRef, useEffect, useRef, useState } from "react";

import AssistiveText from "../assistivetext/AssistiveText";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownItem } from "../dropdown/dropdownItem/DropdownItem";
import Icon from "../icon/Icon";
import IconButton from "../iconButton/IconButton";
import RequiredIndicator from "../requiredindicator/RequiredIndicator";
import { concatClassNames } from "../utils";

import styles from "./Select.module.scss";

const Select = forwardRef<HTMLDivElement, coreSelectProps>(
  (
    {
      id,
      label,
      labelPosition = "top",
      required = false,
      value,
      showLabel = true,
      isError,
      assistiveAppearance = "description",
      showAssistiveIcon = false,
      assistiveTextLink,
      showLabelRequirement = false,
      assistiveTextLabel,
      onClear,
      onChange,
      options = [],
      disabled,
      readonly,
      showResetButton,
      width = MIN_SELECT_WIDTH,
      multiple = false,
      multipleValue,
      onMultipleChange,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value || "");
    const [internalMultipleValue, setInternalMultipleValue] = useState<string[]>(multipleValue || []);

    const [isActive, setIsActive] = useState(false);

    const selectRef = useRef<HTMLDivElement | null>(null);

    const selectRefCallback = (node: HTMLDivElement | null) => {
      selectRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const hasValue = multiple ? internalMultipleValue.length > 0 : !!internalValue;
    const shouldDisplayClearButton = showResetButton && hasValue && !readonly && !disabled;

    const currentOption = options.find((option) => option.value === internalValue);
    const currentOptionLabel = currentOption?.label;
    const currentOptionIcon = currentOption?.icon;

    const getMultipleDisplayValue = () => {
      if (internalMultipleValue.length === 0) return "";
      if (internalMultipleValue.length === 1) {
        return options.find((opt) => opt.value === internalMultipleValue[0])?.label || "";
      }
      return `${internalMultipleValue.length} sélectionnés`;
    };

    const isOptionSelected = (optionValue: string) => {
      return internalMultipleValue.includes(optionValue);
    };

    const handleMultipleSelect = (optionValue: string) => {
      const newValues = isOptionSelected(optionValue)
        ? internalMultipleValue.filter((v) => v !== optionValue)
        : [...internalMultipleValue, optionValue];
      setInternalMultipleValue(newValues);
      onMultipleChange?.(newValues);
    };

    const shouldDisplayErrorIcon = isError && !disabled && !readonly;

    const computeDropdownPosition = () => {
      const selectElement = selectRef.current;
      if (selectElement) {
        const rect = selectElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        return spaceBelow >= THRESHOLD_BOTTOM_POSITION ? "bottom" : "top";
      }
      return "bottom";
    };

    const handleOnClick = () => {
      if (selectRef.current) {
        if (disabled || readonly) {
          return;
        }
        selectRef.current.focus();
        setIsActive(!isActive);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (document.activeElement === selectRef.current) {
        if (e.key === SPACE_KEY || e.key === ENTER_KEY) {
          e.preventDefault();
          handleOnClick();
        }
      }
    };

    const handleOnClear = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (multiple) {
        setInternalMultipleValue([]);
        onMultipleChange?.([]);
      } else {
        handleOnChange("");
      }
      onClear?.();
      selectRef.current?.focus();
    };

    const handleOnChange = (newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);
      setIsActive(false);
    };

    useEffect(() => {
      setInternalValue(value || "");
    }, [value]);

    useEffect(() => {
      setInternalMultipleValue(multipleValue || []);
    }, [multipleValue]);

    return (
      <>
        <div className={styles["select-container"]} data-label-position={labelPosition}>
          {showLabel && labelPosition === "side" && (
            <label htmlFor={id} id={label} className={styles["select-label"]}>
              {label}
              <RequiredIndicator required={required} showLabelRequirement={showLabelRequirement} />
            </label>
          )}
          <div className={styles["select-header"]}>
            {showLabel && labelPosition === "top" && (
              <label htmlFor={id} id={label} className={styles["select-label"]}>
                {label}
                <RequiredIndicator required={required} showLabelRequirement={showLabelRequirement} />
              </label>
            )}
            <Dropdown
              style={{ width: selectRef.current?.offsetWidth }}
              dropdownId={id + "-dropdown"}
              onClose={() => {
                setIsActive(false);
              }}
              offset={SELECT_DROPDOWN_OFFSET}
              trigger={
                <div
                  ref={selectRefCallback}
                  aria-expanded={isActive}
                  aria-labelledby={label}
                  data-error={isError ? "true" : "false"}
                  data-active={isActive ? "true" : "false"}
                  data-disabled={disabled ? "true" : "false"}
                  data-read-only={readonly ? "true" : "false"}
                  id={id}
                  className={styles["select-wrapper"]}
                  role="combobox"
                  tabIndex={disabled || readonly ? -1 : 0}
                  onClick={handleOnClick}
                  onKeyDown={handleKeyDown}
                  style={{ width: width }}
                >
                  <div className={styles["select-content"]}>
                    {shouldDisplayErrorIcon && <Icon name="error" className={styles["error-icon"]} />}
                    <div className={styles["select-value"]}>
                      {!multiple && currentOptionIcon && (
                        <Icon name={currentOptionIcon} className={styles["select-value-icon"]} />
                      )}
                      <span>{multiple ? getMultipleDisplayValue() : currentOptionLabel}</span>
                    </div>
                    <div className={styles["select-right-icons"]}>
                      {shouldDisplayClearButton && (
                        <IconButton
                          name="cancel"
                          variant="neutral"
                          className={concatClassNames(styles["icon-button"], styles["clear-icon"])}
                          onClick={handleOnClear}
                          disabled={disabled}
                        />
                      )}
                      <Icon
                        name={isActive ? "arrow-chevron-up" : "arrow-chevron-down"}
                        data-testid="trigger-icon"
                        className={styles["trigger-icon"]}
                      />
                    </div>
                  </div>
                </div>
              }
              isOpen={isActive}
              position={computeDropdownPosition()}
            >
              {options.length === 0 && <DropdownItem label="No options available" onClick={() => {}} />}
              {multiple
                ? options.map(({ value, label, icon }, index) => (
                    <li
                      key={index + value}
                      className={styles["dropdown-item-multiple"]}
                      role="option"
                      aria-selected={isOptionSelected(value)}
                      onClick={() => handleMultipleSelect(value)}
                      tabIndex={0}
                    >
                      <Icon
                        name={isOptionSelected(value) ? "checkbox" : "checkbox-empty"}
                        appearance={isOptionSelected(value) ? "filled" : "outlined"}
                        className={styles["checkbox-icon"]}
                      />
                      {icon && <Icon name={icon} className={styles["option-icon"]} />}
                      <span>{label}</span>
                    </li>
                  ))
                : options.map(({ value, label, icon }, index) => (
                    <DropdownItem
                      key={index + value}
                      label={label}
                      leftIcon={icon}
                      isSelected={value === internalValue}
                      onClick={() => {
                        handleOnChange(value);
                      }}
                    />
                  ))}
            </Dropdown>

            {assistiveTextLabel && (
              <AssistiveText
                label={assistiveTextLabel}
                appearance={isError ? "error" : assistiveAppearance}
                showIcon={showAssistiveIcon}
                href={assistiveTextLink}
                width={width}
              />
            )}
          </div>
        </div>
      </>
    );
  },
);

export default Select;
