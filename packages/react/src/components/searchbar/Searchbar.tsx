import {
  APPEARANCE_CONFIG,
  DROPDOWN_OFFSET,
  SEARCHBAR_BORDER_RADIUS,
  SEARCHBAR_BUTTON_HEIGHT_COMPACT,
  SEARCHBAR_BUTTON_WIDTH,
  SEARCHBAR_PADDING_LEFT,
} from "@rte-ds/core/components/searchbar/searchbar.constants";
import {
  SearchBarProps as CoreSearchBarProps,
  SearchBarAppearance,
} from "@rte-ds/core/components/searchbar/searchbar.interface";
import { ENTER_KEY } from "@rte-ds/core/constants/keyboard/keyboard.constants";
import {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Dropdown } from "../dropdown/Dropdown";
import { DropdownItem } from "../dropdown/dropdownItem/DropdownItem";
import IconButton from "../iconButton/IconButton";
import BaseTextInput from "../textInput/baseTextuInput/BaseTextInput";

import styles from "./Searchbar.module.scss";

interface SearchbarProps
  extends
    CoreSearchBarProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "onChange" | "value" | "defaultValue" | "placeholder"> {
  onSearch?: (input: string | undefined) => void;
  onChange?: (input: string | undefined) => void;
  onClear?: () => void;
}

function getTextInputStyles(appearance: SearchBarAppearance, hasLeftIcon: boolean): CSSProperties {
  const baseStyles: CSSProperties = {};

  if (appearance === "primary") {
    baseStyles.borderRight = "none";
    baseStyles.borderRadius = `${SEARCHBAR_BORDER_RADIUS} 0 0 ${SEARCHBAR_BORDER_RADIUS}`;
    if (!hasLeftIcon) {
      baseStyles.paddingLeft = SEARCHBAR_PADDING_LEFT;
    }
  } else if (appearance === "secondary") {
    baseStyles.borderRadius = SEARCHBAR_BORDER_RADIUS;
  }

  return baseStyles;
}

function getSearchButtonStyles(hasCompactSpacing?: boolean): CSSProperties {
  return {
    width: SEARCHBAR_BUTTON_WIDTH,
    borderRadius: `0 ${SEARCHBAR_BORDER_RADIUS} ${SEARCHBAR_BORDER_RADIUS} 0`,
    height: hasCompactSpacing ? SEARCHBAR_BUTTON_HEIGHT_COMPACT : undefined,
  };
}

const Searchbar = forwardRef<HTMLInputElement, SearchbarProps>(
  (
    {
      onSearch,
      onChange,
      onClear,
      onOptionSelect,
      id,
      label = "Rechercher",
      disabled = false,
      showResetButton = true,
      appearance = "primary",
      compactSpacing,
      value,
      assistiveText,
      style: customInputStyle,
      fullWidth,
      options,
      maxDisplayedItems,
      ...props
    }: SearchbarProps,
    ref,
  ) => {
    const appearanceConfig = APPEARANCE_CONFIG[appearance];

    const [hasFocusWithin, setHasFocusWithin] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const hasOptions = options && options.length > 0;

    const displayedOptions = useMemo(() => {
      if (!options) return [];
      if (maxDisplayedItems !== undefined) return options.slice(0, maxDisplayedItems);
      return options;
    }, [options, maxDisplayedItems]);

    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const handleFocusIn = () => {
        setHasFocusWithin(true);
        if (hasOptions) {
          setIsDropdownOpen(true);
        }
      };

      const handleFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (next && wrapper.contains(next)) {
          return;
        }
        setHasFocusWithin(false);
      };

      wrapper.addEventListener("focusin", handleFocusIn);
      wrapper.addEventListener("focusout", handleFocusOut);

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn);
        wrapper.removeEventListener("focusout", handleFocusOut);
      };
    }, [hasOptions]);

    useEffect(() => {
      if (wrapperRef.current && hasOptions) {
        setDropdownWidth(wrapperRef.current.offsetWidth);
      }
    }, [hasOptions]);

    const handleChange = useCallback(
      (newValue: string) => {
        onChange?.(newValue);
        if (hasOptions) {
          setIsDropdownOpen(true);
        }
      },
      [onChange, hasOptions],
    );

    const handleClick = useCallback(() => {
      onSearch?.(value);
    }, [onSearch, value]);

    const handleEnter = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ENTER_KEY) {
          onSearch?.(value);
        }
      },
      [onSearch, value],
    );

    const handleClear = useCallback(() => {
      onChange?.("");
      onClear?.();
    }, [onChange, onClear]);

    const handleOptionClick = useCallback(
      (option: string) => {
        onChange?.(option);
        onOptionSelect?.(option);
        setIsDropdownOpen(false);
      },
      [onChange, onOptionSelect],
    );

    const handleDropdownClose = useCallback(() => {
      setIsDropdownOpen(false);
    }, []);

    const placeholder = useMemo(() => (disabled ? "Recherche indisponible" : label), [disabled, label]);

    const textInputProps = useMemo(
      () => ({
        disabled,
        value,
        onChange: handleChange,
        onKeyUp: onSearch ? handleEnter : undefined,
        showRightIcon: showResetButton,
        rightIconAction: "clean" as const,
        onRightIconClick: handleClear,
        assistiveTextLabel: assistiveText,
        compactSpacing,
        placeholder,
        leftIcon: appearanceConfig.showLeftIcon ? "search" : undefined,
        width: fullWidth ? "100%" : undefined,
        ...props,
      }),
      [
        disabled,
        value,
        handleChange,
        onSearch,
        handleEnter,
        showResetButton,
        handleClear,
        assistiveText,
        compactSpacing,
        placeholder,
        appearanceConfig.showLeftIcon,
        fullWidth,
        props,
      ],
    );

    const textInputStyles = useMemo(
      () => ({
        ...getTextInputStyles(appearance, appearanceConfig.showLeftIcon),
        ...(customInputStyle ?? {}),
      }),
      [appearance, appearanceConfig.showLeftIcon, customInputStyle],
    );

    const searchButtonStyles = useMemo(() => getSearchButtonStyles(compactSpacing), [compactSpacing]);

    const searchbarContent = (
      <div ref={wrapperRef} className={styles.textInputWrapper} data-disabled={disabled}>
        <BaseTextInput
          id={id ?? ""}
          {...textInputProps}
          style={textInputStyles}
          highlighted={hasFocusWithin}
          ref={ref}
          rightSlot={
            appearanceConfig.showSearchButton && (
              <IconButton
                name="search"
                size="m"
                variant="primary"
                appearance="filled"
                onClick={handleClick}
                disabled={disabled}
                aria-label={label}
                className={styles.searchButton}
                compactSpacing={compactSpacing}
                style={searchButtonStyles}
              />
            )
          }
        />
      </div>
    );

    return (
      <div
        className={styles.searchbarContainer}
        role="search"
        data-appearance={appearance}
        style={fullWidth ? { width: "100%" } : undefined}
      >
        {hasOptions ? (
          <Dropdown
            dropdownId={`${id ?? "searchbar"}-autocomplete`}
            trigger={searchbarContent}
            isOpen={isDropdownOpen}
            onClose={handleDropdownClose}
            position="bottom"
            alignment="start"
            offset={DROPDOWN_OFFSET}
            autofocus={false}
            style={dropdownWidth ? { width: dropdownWidth } : undefined}
          >
            {displayedOptions.map((option) => (
              <DropdownItem key={option} label={option} onClick={() => handleOptionClick(option)} />
            ))}
          </Dropdown>
        ) : (
          searchbarContent
        )}
      </div>
    );
  },
);

export default Searchbar;
