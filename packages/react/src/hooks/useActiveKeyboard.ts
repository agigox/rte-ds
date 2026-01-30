import { ENTER_KEY, SPACE_KEY } from "@rte-ds/core/constants/keyboard/keyboard.constants";
import { KeyboardEvent, useRef } from "react";

type OptionsActiveKeyboard = {
  id?: string;
  interactiveKeyCodes?: string[];
};

type handlersActiveKeyboard<T extends HTMLElement> = {
  onKeyDown?: (e: KeyboardEvent<T>) => void;
  onKeyUp?: (e: KeyboardEvent<T>) => void;
  onBlur?: () => void;
  onFocus?: () => void;
};

const noop = () => {};

/**
 * Check if the event target is an input element where keyboard events should not be intercepted
 */
const isInputElement = (target: EventTarget | null): boolean => {
  if (!target || !(target instanceof HTMLElement)) return false;
  const tagName = target.tagName.toLowerCase();
  return tagName === "input" || tagName === "textarea" || tagName === "select" || target.isContentEditable;
};

export const useActiveKeyboard = <T extends HTMLElement>(
  handlerFunctions: handlersActiveKeyboard<T> = {},
  options: OptionsActiveKeyboard = {},
) => {
  const { id, interactiveKeyCodes } = options;
  const {
    onKeyDown: handlerOnKeyDown = noop,
    onKeyUp: handlerOnKeyUp = noop,
    onBlur: handlerOnBlur = noop,
    onFocus: handlerOnFocus = noop,
  } = handlerFunctions;
  const interactiveKeysRef = useRef<string[]>(interactiveKeyCodes ?? [SPACE_KEY, ENTER_KEY]);

  const onKeyDown = (e: KeyboardEvent<T>) => {
    // Don't intercept keyboard events from input elements
    if (isInputElement(e.target)) return;

    if (interactiveKeysRef.current?.includes(e.key) && (!id || (e.target as T).id === id)) {
      e.preventDefault();
      handlerOnKeyDown(e);
    }
  };

  const onKeyUp = (e: KeyboardEvent<T>) => {
    if (interactiveKeysRef.current?.includes(e.key) && (!id || (e.target as T).id === id)) {
      handlerOnKeyUp(e);
    }
  };

  const onBlur = () => {
    handlerOnBlur();
  };

  const onFocus = () => {
    handlerOnFocus();
  };

  return { onKeyDown, onKeyUp, onBlur, onFocus };
};
