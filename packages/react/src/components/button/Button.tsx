import { ButtonProps as CoreButtonProps } from "@rte-ds/core/components/button/button.interface";
import { ButtonBadgeSizeMapping } from "@rte-ds/core/components/button/common/common-button.constants";
import { forwardRef } from "react";

import Badge from "../badge/Badge";
import Icon from "../icon/Icon";
import { concatClassNames } from "../utils";

import style from "./Button.module.scss";

interface ButtonProps
  extends Omit<CoreButtonProps, "disabled">, Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  icon?: string;
  iconColor?: string;
  iconAppearance?: "outlined" | "filled";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = "m",
      label,
      variant = "primary",
      className = "",
      onClick,
      type = "button",
      badgeContent,
      badgeCount,
      badgeType,
      badgeIcon,
      icon,
      iconPosition = "left",
      iconColor,
      iconAppearance,
      ...props
    },
    ref,
  ) => {
    const shouldDisplayBadge = (badgeCount > 0 && badgeContent === "number") || (badgeContent === "icon" && badgeIcon);

    const iconSize = size === "s" ? 16 : size === "m" ? 20 : 24;

    const buttonContent = (
      <>
        {icon && iconPosition === "left" && (
          <Icon name={icon} size={iconSize} color={iconColor} appearance={iconAppearance} />
        )}
        <span data-size={size} className={style.label}>
          {label}
        </span>
        {icon && iconPosition === "right" && (
          <Icon name={icon} size={iconSize} color={iconColor} appearance={iconAppearance} />
        )}
      </>
    );

    if (shouldDisplayBadge) {
      return (
        <Badge
          badgeType={badgeType}
          size={ButtonBadgeSizeMapping[size]}
          content={size === "s" ? "empty" : badgeContent}
          count={badgeCount}
          icon={badgeIcon}
        >
          <button
            ref={ref}
            type={type}
            className={concatClassNames(style.button, className)}
            data-size={size}
            data-variant={variant}
            onClick={onClick}
            {...props}
          >
            {buttonContent}
          </button>
        </Badge>
      );
    } else {
      return (
        <button
          ref={ref}
          type={type}
          className={concatClassNames(style.button, className)}
          data-size={size}
          data-variant={variant}
          onClick={onClick}
          {...props}
        >
          {buttonContent}
        </button>
      );
    }
  },
);

export default Button;
