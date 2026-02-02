import { LinkProps as CoreLinkProps } from "@rte-ds/core/components/link/link.interface";
import { forwardRef } from "react";

import Icon from "../icon/Icon";
import { concatClassNames } from "../utils";

import style from "./Link.module.scss";

type IconPosition = "left" | "right";

interface LinkProps extends CoreLinkProps, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: string;
  iconPosition?: IconPosition;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      label,
      href,
      subtle = false,
      externalLink = false,
      className = "",
      reverse,
      icon,
      iconPosition = "left",
      ...props
    },
    ref,
  ) => {
    const renderIcon = icon && <Icon name={icon} size={16} className={style.icon} />;

    return (
      <a
        ref={ref}
        href={href}
        role="link"
        aria-label={label}
        className={concatClassNames(style.link, className)}
        data-subtle={subtle}
        target={externalLink ? "_blank" : undefined}
        rel={externalLink ? "noopener noreferrer" : undefined}
        data-reverse={reverse}
        {...props}
      >
        {icon && iconPosition === "left" && renderIcon}
        <span className={style.label}>{label}</span>
        {icon && iconPosition === "right" && renderIcon}
        {externalLink && <Icon name="external-link" size={12} className={style["external-link-icon"]} />}
      </a>
    );
  },
);

export default Link;
