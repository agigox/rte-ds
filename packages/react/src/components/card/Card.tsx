import { ENTER_KEY, SPACE_KEY } from "@rte-ds/core/constants/keyboard/keyboard.constants";
import React, { HTMLAttributes, forwardRef, KeyboardEvent } from "react";

import { cardSize } from "../../core-types/card/card.constats";
import { CardProps as CardPropsCore } from "../../core-types/card/card.interface";
import { useActiveKeyboard } from "../../hooks/useActiveKeyboard";

import styles from "./Card.module.scss";

interface CardProps extends CardPropsCore, Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  onClick?: () => void;
  disableHover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      size = "m",
      cardType = "default",
      clickable = false,
      disabled = false,
      selected = false,
      pressed = false,
      disableHover = false,
      children,
      onClick,
      style,
      className,
      ...props
    },
    ref,
  ) => {
    const keyboardHandler = (event: KeyboardEvent<HTMLDivElement>) => {
      if (!disabled && clickable && (event.key === SPACE_KEY || event.key === ENTER_KEY)) {
        event.preventDefault();
        onClick?.();
      }
    };

    const handleOnClick = () => {
      if (!disabled && clickable) {
        onClick?.();
      }
    };

    const { onKeyDown, onKeyUp, onBlur } = useActiveKeyboard<HTMLDivElement>(
      { onKeyUp: keyboardHandler },
      {
        interactiveKeyCodes: [SPACE_KEY, ENTER_KEY],
      },
    );

    const { backgroundColor, background, ...restStyle } = style ?? {};
    const bgVar = backgroundColor ?? background;

    return (
      <div
        ref={ref}
        className={`${styles.card}${className ? ` ${className}` : ""}`}
        style={{
          width: cardSize[size],
          ...(bgVar ? ({ "--card-background": bgVar } as React.CSSProperties) : {}),
          ...restStyle,
        }}
        data-card-type={cardType}
        data-clickable={clickable}
        data-disabled={disabled}
        data-selected={selected}
        data-pressed={pressed}
        data-disable-hover={disableHover}
        tabIndex={clickable ? 0 : -1}
        onClick={handleOnClick}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={onBlur}
        {...props}
      >
        {children}
      </div>
    );
  },
);

export default Card;
