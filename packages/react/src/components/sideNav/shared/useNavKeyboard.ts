import {
  ARROW_DOWN_KEY,
  ARROW_UP_KEY,
  ENTER_KEY,
  ESCAPE_KEY,
  SPACE_KEY,
} from "@rte-ds/core/constants/keyboard/keyboard.constants";
import { KeyboardEvent, useCallback } from "react";

import { useActiveKeyboard } from "../../../hooks/useActiveKeyboard";

interface UseNavKeyboardOptions {
  onEnterOrSpace?: () => void;
  onEscape?: () => void;
  includeArrowKeys?: boolean;
  includeEscape?: boolean;
}

/**
 * Check if the event target is an input element where keyboard events should not be intercepted
 */
const isInputElement = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
};

function useNavKeyboard<T extends HTMLElement = HTMLElement>({
  onEnterOrSpace,
  onEscape,
  includeArrowKeys = false,
  includeEscape = false,
}: UseNavKeyboardOptions = {}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<T>) => {
      // Don't intercept keyboard events from input elements
      if (isInputElement(e.target)) return;

      if ([SPACE_KEY, ENTER_KEY].includes(e.key)) {
        e.preventDefault();
        onEnterOrSpace?.();
      }
      if (e.key === ESCAPE_KEY && includeEscape) {
        e.preventDefault();
        onEscape?.();
      }
    },
    [onEnterOrSpace, onEscape, includeEscape],
  );

  const interactiveKeyCodes = [
    SPACE_KEY,
    ENTER_KEY,
    ...(includeEscape ? [ESCAPE_KEY] : []),
    ...(includeArrowKeys ? [ARROW_DOWN_KEY, ARROW_UP_KEY] : []),
  ];

  const { onKeyDown } = useActiveKeyboard<T>({ onKeyDown: handleKeyDown }, { interactiveKeyCodes });

  return { onKeyDown };
}

export default useNavKeyboard;
