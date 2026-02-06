import { sideNavCollapsedSize, sideNavPanelSize } from "@rte-ds/core/components/side-nav/side-nav.constants";
import { BaseSideNavProps as CoreSideNavProps } from "@rte-ds/core/components/side-nav/side-nav.interface";
import { forwardRef, ReactNode, useRef } from "react";

import Icon from "../../icon/Icon";

import style from "./BaseSideNav.module.scss";
import useContentHeight from "./hooks/useContentHeight";

interface TeamDataItem {
  label: string;
  value: string;
}

interface BaseSideNavProps
  extends Partial<Omit<CoreSideNavProps, "items">>, Omit<React.HTMLAttributes<HTMLDivElement>, "content"> {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  showProfile?: boolean;
  profile?: string;
  onProfileClick?: () => void;
  showTeamData?: boolean;
  teamData?: TeamDataItem[];
}

const BaseSideNav = forwardRef<HTMLElement | HTMLDivElement, BaseSideNavProps>(
  (
    {
      size = "m",
      header,
      body,
      footer,
      showHeader = true,
      showFooter = true,
      showProfile = false,
      profile,
      onProfileClick,
      showTeamData = false,
      teamData,
      children,
      appearance = "brand",
      collapsed,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useContentHeight(containerRef, contentRef, children);

    return (
      <div ref={containerRef} className={style.sideNavContainer} {...props}>
        <nav
          ref={ref}
          className={style.sideNav}
          data-collapsed={collapsed}
          data-appearance={appearance}
          style={{
            minWidth: collapsed ? sideNavCollapsedSize : sideNavPanelSize[size],
          }}
        >
          {showHeader && header && <div className={style.sideNavHeader}>{header}</div>}

          {showProfile && profile && (
            <div
              className={style.sideNavProfile}
              data-collapsed={collapsed}
              data-clickable={!!onProfileClick}
              onClick={onProfileClick}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onProfileClick) {
                  e.preventDefault();
                  onProfileClick();
                }
              }}
              role={onProfileClick ? "button" : undefined}
              tabIndex={onProfileClick ? 0 : undefined}
            >
              <Icon name="user-circle" appearance="filled" size={20} />
              {!collapsed && <span className={style.profileName}>{profile}</span>}
            </div>
          )}

          {showTeamData && teamData && teamData.length > 0 && !collapsed && (
            <div className={style.sideNavTeamData}>
              {teamData.map((item, index) => (
                <div key={index} className={style.teamDataItem}>
                  <span className={style.teamDataLabel}>{item.label} :</span>
                  <span className={style.teamDataValue}>{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {body && <div className={style.sideNavBody}>{body}</div>}
          {showFooter && footer && <div className={style.sideNavFooter}>{footer}</div>}
        </nav>

        {children && (
          <div ref={contentRef} className={style.sideNavContent}>
            {children}
          </div>
        )}
      </div>
    );
  },
);

export default BaseSideNav;
