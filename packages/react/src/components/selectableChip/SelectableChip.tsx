import { SelectableChipProps as CoreSelectableChipProps } from "@rte-ds/core/components/selectableChip/selectable-chip.interface";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";

import Icon from "../icon/Icon";
import { concatClassNames } from "../utils";

import styles from "./SelectableChip.module.scss";

interface SelectableChipProps
  extends CoreSelectableChipProps, Omit<React.HTMLAttributes<HTMLDivElement>, "id" | "onChange"> {}

const SelectableChip = forwardRef<HTMLDivElement, SelectableChipProps>(
  ({ id, label, icon, options, value, onChange, backgroundColor, disabled = false, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    const mergedRef = useCallback(
      (node: HTMLDivElement | null) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    const toggle = () => {
      if (!disabled) setIsOpen((prev) => !prev);
    };

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      triggerRef.current?.focus();
    };

    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleOptionKeyDown = (event: React.KeyboardEvent, optionValue: string) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleSelect(optionValue);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        const next = (event.currentTarget as HTMLElement).nextElementSibling as HTMLElement;
        next?.focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        const prev = (event.currentTarget as HTMLElement).previousElementSibling as HTMLElement;
        if (prev) prev.focus();
        else triggerRef.current?.focus();
      }
    };

    const bgStyle = backgroundColor ? { backgroundColor } : undefined;

    return (
      <div
        ref={mergedRef}
        id={id}
        className={concatClassNames(styles.selectableChip, className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {/* Hidden sizer: renders all options to determine the widest content */}
        <div className={styles.sizer} aria-hidden="true">
          {options.map((option) => (
            <span key={option.value} className={styles.sizerItem}>
              <span className={styles.triggerIcon}>
                <Icon name={option.icon || icon || "check"} size={16} />
              </span>
              <span className={styles.triggerLabel}>
                {option.label}
                <Icon name="arrow-chevron-down" size={20} />
              </span>
            </span>
          ))}
        </div>

        <button
          ref={triggerRef}
          type="button"
          className={styles.trigger}
          data-open={isOpen}
          data-disabled={disabled}
          onClick={toggle}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={disabled}
          style={bgStyle}
        >
          {icon && (
            <span className={styles.triggerIcon}>
              <Icon name={icon} size={16} />
            </span>
          )}
          <span className={styles.triggerLabel}>
            {label}
            <span className={styles.chevron} data-open={isOpen}>
              <Icon name="arrow-chevron-down" size={20} />
            </span>
          </span>
        </button>

        {isOpen && (
          <div className={styles.dropdown} role="listbox" aria-labelledby={id} style={bgStyle}>
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={styles.option}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
                  style={bgStyle}
                >
                  <span className={concatClassNames(styles.optionCheck, !isSelected && styles.optionCheckHidden)}>
                    <Icon name="check" size={16} />
                  </span>
                  <span className={styles.optionLabel}>{option.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

export default SelectableChip;
