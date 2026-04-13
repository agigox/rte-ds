import { ARROW_DOWN_KEY, ENTER_KEY, ESCAPE_KEY } from "@rte-ds/core/constants/keyboard/keyboard.constants";
import {
  CSSProperties,
  InputHTMLAttributes,
  KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  APPEARANCE_CONFIG,
  DROPDOWN_OFFSET,
  SEARCHBAR_BORDER_RADIUS,
  SEARCHBAR_BUTTON_HEIGHT_COMPACT,
  SEARCHBAR_BUTTON_WIDTH,
  SEARCHBAR_PADDING_LEFT,
} from "../../core-types/searchbar/searchbar.constants";
import {
  SearchBarProps as CoreSearchBarProps,
  SearchBarAppearance,
} from "../../core-types/searchbar/searchbar.interface";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownItem } from "../dropdown/dropdownItem/DropdownItem";
import { focusDropdownFirstElement } from "../dropdown/DropdownUtils";
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

function getTextInputStyles(appearance: SearchBarAppearance): CSSProperties {
  const baseStyles: CSSProperties = {};

  if (appearance === "primary") {
    baseStyles.borderRight = "none";
    baseStyles.borderRadius = `${SEARCHBAR_BORDER_RADIUS} 0 0 ${SEARCHBAR_BORDER_RADIUS}`;
    if (!APPEARANCE_CONFIG.primary.showLeftIcon) {
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

    // Fall back to a stable auto-generated id when the consumer doesn't
    // provide one — BaseTextInput requires a non-empty id, and aria-controls
    // below needs a real value to point at the listbox (FIX #11).
    const generatedId = useId();
    const resolvedId = id ?? generatedId;

    // `isAutocomplete` signals "consumer wants autocomplete" (they passed an
    // `options` prop, even if currently empty). `hasOptions` signals "the
    // dropdown has something to show right now". The distinction matters
    // because we ALWAYS keep the Dropdown mounted in autocomplete mode —
    // otherwise the JSX structure would flip between bare content and
    // <Dropdown>{content}</Dropdown> on every transition to/from an empty
    // options array, remounting the <input> and dropping focus mid-typing.
    const isAutocomplete = options !== undefined;
    const hasOptions = isAutocomplete && options.length > 0;
    // Track hasOptions via a ref so focus listeners can read the latest value
    // without the effect re-attaching on every toggle (FIX #4).
    const hasOptionsRef = useRef(hasOptions);
    hasOptionsRef.current = hasOptions;

    const displayedOptions = useMemo(() => {
      if (!options) return [];
      if (maxDisplayedItems !== undefined) return options.slice(0, maxDisplayedItems);
      return options;
    }, [options, maxDisplayedItems]);

    const autocompleteDropdownId = `${resolvedId}-autocomplete`;
    // Mirror the id into a ref so the mount-only focusout listener can look
    // up the current dropdown DOM node without re-attaching on every render.
    const autocompleteDropdownIdRef = useRef(autocompleteDropdownId);
    autocompleteDropdownIdRef.current = autocompleteDropdownId;

    // Attach focusin/focusout once on mount. The handlers read hasOptions
    // from a ref so they never go stale (FIX #4).
    useEffect(() => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      // A node counts as "still inside the Searchbar focus group" if it's
      // in the wrapper OR in the autocomplete dropdown. The Dropdown renders
      // in a React portal via <Overlay>, so wrapper.contains() alone would
      // miss DropdownItems and close the dropdown the instant the user
      // ArrowDown'd into it.
      const isInFocusGroup = (node: Node | null): boolean => {
        if (!node) return false;
        if (wrapper.contains(node)) return true;
        const id = autocompleteDropdownIdRef.current;
        const dropdownEl = document.querySelector(`[data-dropdown-id="${CSS.escape(id)}"]`);
        return !!(dropdownEl && dropdownEl.contains(node));
      };

      const handleFocusIn = () => {
        setHasFocusWithin(true);
        if (hasOptionsRef.current) {
          setIsDropdownOpen(true);
        }
      };

      const handleFocusOut = (event: FocusEvent) => {
        const next = event.relatedTarget as Node | null;
        if (isInFocusGroup(next)) {
          return;
        }
        setHasFocusWithin(false);
        // Close the dropdown when focus leaves the whole Searchbar group
        // (ARCH #14). The isInFocusGroup check above ensures keyboard nav
        // INTO the dropdown doesn't trigger this branch.
        setIsDropdownOpen(false);
      };

      wrapper.addEventListener("focusin", handleFocusIn);
      wrapper.addEventListener("focusout", handleFocusOut);

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn);
        wrapper.removeEventListener("focusout", handleFocusOut);
      };
    }, []);

    // Measure the trigger width once when autocomplete activates AND on every
    // resize so the dropdown always matches (FIX #5).
    useEffect(() => {
      const el = wrapperRef.current;
      if (!el || !hasOptions) return;

      setDropdownWidth(el.offsetWidth);

      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setDropdownWidth(entry.contentRect.width);
        }
      });
      observer.observe(el);
      return () => observer.disconnect();
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

    const handleInputKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        // Enter on keydown for responsive submit feel (FIX #6).
        if (e.key === ENTER_KEY && onSearch) {
          e.preventDefault();
          onSearch(value);
          return;
        }

        // Combobox-style keyboard nav: move focus into the dropdown (FIX #7).
        if (hasOptions && isDropdownOpen) {
          if (e.key === ARROW_DOWN_KEY) {
            e.preventDefault();
            focusDropdownFirstElement(autocompleteDropdownId);
          } else if (e.key === ESCAPE_KEY) {
            e.preventDefault();
            setIsDropdownOpen(false);
          }
        } else if (hasOptions && e.key === ARROW_DOWN_KEY) {
          // Dropdown is closed but options exist — open it first.
          e.preventDefault();
          setIsDropdownOpen(true);
        }
      },
      [onSearch, value, hasOptions, isDropdownOpen, autocompleteDropdownId],
    );

    const handleClear = useCallback(() => {
      onChange?.("");
      onClear?.();
    }, [onChange, onClear]);

    // Map each option to a stable click handler so we don't allocate a new
    // closure per option per render (FIX #2). Keyed by `${index}-${option}`
    // so duplicate strings are safe (FIX #3).
    const optionHandlers = useMemo(() => {
      const handlers = new Map<string, () => void>();
      displayedOptions.forEach((option, index) => {
        const key = `${index}-${option}`;
        handlers.set(key, () => {
          onChange?.(option);
          onOptionSelect?.(option);
          setIsDropdownOpen(false);
        });
      });
      return handlers;
    }, [displayedOptions, onChange, onOptionSelect]);

    const handleDropdownClose = useCallback(() => {
      setIsDropdownOpen(false);
    }, []);

    // Derivations cheap enough not to memo (FIX #8, FIX #9).
    const placeholder = disabled ? "Recherche indisponible" : label;
    const searchButtonStyles = getSearchButtonStyles(compactSpacing);

    // Drop `appearanceConfig.showLeftIcon` from deps — it's derived from
    // `appearance` and was redundant (FIX #10).
    const textInputStyles = useMemo(
      () => ({
        ...getTextInputStyles(appearance),
        ...(customInputStyle ?? {}),
      }),
      [appearance, customInputStyle],
    );

    const searchbarContent = (
      <div ref={wrapperRef} className={styles.textInputWrapper} data-disabled={disabled}>
        <BaseTextInput
          id={resolvedId}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onKeyDown={handleInputKeyDown}
          showRightIcon={showResetButton}
          rightIconAction="clean"
          onRightIconClick={handleClear}
          assistiveTextLabel={assistiveText}
          compactSpacing={compactSpacing}
          placeholder={placeholder}
          leftIcon={appearanceConfig.showLeftIcon ? "search" : undefined}
          width={fullWidth ? "100%" : undefined}
          style={textInputStyles}
          highlighted={hasFocusWithin}
          ref={ref}
          // ARIA combobox attributes for autocomplete mode (FIX #7).
          {...(hasOptions && {
            role: "combobox",
            "aria-autocomplete": "list" as const,
            "aria-expanded": isDropdownOpen,
            "aria-controls": autocompleteDropdownId,
            "aria-haspopup": "menu" as const,
          })}
          // `null` instead of `false` for the absent-slot case (FIX #12).
          rightSlot={
            appearanceConfig.showSearchButton ? (
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
            ) : null
          }
          {...props}
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
        {isAutocomplete ? (
          // Always render the Dropdown in autocomplete mode to keep the
          // <input>'s DOM parent stable. Gate actual opening on BOTH
          // hasOptions (there's something to show) AND isDropdownOpen (user
          // hasn't dismissed it). Without the always-render, a transition
          // from options=[] to options=[…] remounts the input and drops focus.
          <Dropdown
            dropdownId={autocompleteDropdownId}
            trigger={searchbarContent}
            isOpen={hasOptions && isDropdownOpen}
            onClose={handleDropdownClose}
            position="bottom"
            alignment="start"
            offset={DROPDOWN_OFFSET}
            autofocus={false}
            style={dropdownWidth ? { width: dropdownWidth } : undefined}
          >
            {displayedOptions.map((option, index) => {
              const key = `${index}-${option}`;
              return <DropdownItem key={key} label={option} onClick={optionHandlers.get(key)} />;
            })}
          </Dropdown>
        ) : (
          searchbarContent
        )}
      </div>
    );
  },
);

export default Searchbar;
