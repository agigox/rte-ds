import { Fragment, ReactNode, useCallback, useRef, useState } from "react";

import { NavItemProps } from "../../../core-types/side-nav/nav-item/nav-item.interface";
import { dividerAppearanceBySideNavAppearance } from "../../../core-types/side-nav/side-nav.constants";
import { SideNavAppearance, SideNavHeaderConfig } from "../../../core-types/side-nav/side-nav.interface";
import useAnimatedMount from "../../../hooks/useAnimatedMount";
import { useFocusTrap } from "../../../hooks/useFocusTrap";
import { useKeydownEscape } from "../../../hooks/useKeydownEscape";
import Divider from "../../divider/Divider";
import Icon from "../../icon/Icon";
import { Overlay } from "../../overlay/Overlay";
import NavItem from "../navItem/NavItem";
import NavMenu from "../navMenu/NavMenu";

import style from "./MobileSideNav.module.scss";

interface MobileSideNavProps {
  headerConfig: SideNavHeaderConfig;
  items: NavItemProps[];
  footerItems?: NavItemProps[];
  activeItem?: string;
  appearance?: SideNavAppearance;
  middleItem?: ReactNode;
  rightItem?: ReactNode;
  children?: ReactNode;
}

const MobileSideNav = ({
  headerConfig,
  items,
  footerItems,
  activeItem,
  appearance = "brand",
  middleItem,
  rightItem,
  children,
}: MobileSideNavProps) => {
  const drawerRef = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const dividerAppearance = dividerAppearanceBySideNavAppearance[appearance];

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  useKeydownEscape(isDrawerOpen ? closeDrawer : () => {});
  useFocusTrap(drawerRef.current ?? undefined, isDrawerOpen);

  const { shouldRender: shouldRenderDrawer, isAnimating: isDrawerAnimating } = useAnimatedMount(isDrawerOpen);

  function handleNavItemClick(item: NavItemProps) {
    if (item.onClick) {
      item.onClick();
    }
    closeDrawer();
  }

  function renderDrawerNavItems(itemsToRender: NavItemProps[] | undefined) {
    if (!itemsToRender?.length) {
      return null;
    }

    return (
      <ul>
        {itemsToRender.map((item: NavItemProps) => {
          const hasNestedItems = item.items?.length;
          if (hasNestedItems) {
            return (
              <NavMenu
                key={item.id}
                badge={item.badge}
                label={item.label}
                icon={item.icon}
                showIcon={item.showIcon}
                collapsed={false}
                link={item.link}
                onClick={item.onClick}
                items={item.items || []}
                appearance={appearance}
                showDivider={item.showDivider}
              />
            );
          }
          return (
            <Fragment key={item.id}>
              <li>
                <NavItem
                  id={item.id}
                  badge={item.badge}
                  label={item.label}
                  icon={item.icon}
                  showIcon={item.showIcon}
                  collapsed={false}
                  link={item.link}
                  onClick={item.onClick ? () => handleNavItemClick(item) : undefined}
                  appearance={appearance}
                  active={item.id === activeItem && !!activeItem}
                />
              </li>
              {item.showDivider && <Divider appearance={dividerAppearance} />}
            </Fragment>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={style.mobileContainer}>
      <header className={style.mobileBar}>
        <div className={style.logoBox}>
          <div className={style.logoInner}>{headerConfig?.identifier}</div>
        </div>
        <button
          ref={hamburgerRef}
          className={style.hamburgerButton}
          onClick={toggleDrawer}
          aria-label={isDrawerOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isDrawerOpen}
        >
          <Icon name="menu" size={24} />
        </button>
        {middleItem && <div className={style.middleSlot}>{middleItem}</div>}
        {rightItem && <div className={style.rightSlot}>{rightItem}</div>}
      </header>

      <div className={style.mobileContent}>{children}</div>

      {shouldRenderDrawer && (
        <Overlay freezeNavigation>
          <div
            className={style.drawerBackdrop}
            data-visible={isDrawerAnimating}
            onClick={closeDrawer}
            aria-hidden="true"
          />
          <nav ref={drawerRef} className={style.mobileDrawer} data-open={isDrawerAnimating} aria-label="Navigation">
            <div className={style.drawerHeader}>
              <div className={style.drawerHeaderLeft}>
                <div className={style.drawerLogoInner}>{headerConfig?.identifier}</div>
                <h1 className={style.drawerTitle}>{headerConfig?.title}</h1>
              </div>
              <button className={style.closeButton} onClick={closeDrawer} aria-label="Fermer le menu">
                <Icon name="close" size={24} />
              </button>
            </div>
            <Divider appearance={dividerAppearance} />
            <div className={style.drawerBody}>{renderDrawerNavItems(items)}</div>
            {footerItems && footerItems.length > 0 && (
              <>
                <Divider appearance={dividerAppearance} />
                <div className={style.drawerFooter}>{renderDrawerNavItems(footerItems)}</div>
              </>
            )}
          </nav>
        </Overlay>
      )}
    </div>
  );
};

export default MobileSideNav;
