import { shouldDisplayBadge } from "@rte-ds/core/components/badge/badge.utils";
import { SegmentedTabsProps as CoreSegmentedTabsProps } from "@rte-ds/core/components/segmented-tabs/segmented-tabs.interface";
import {
  ARROW_LEFT_KEY,
  ARROW_RIGHT_KEY,
  ENTER_KEY,
  SPACE_KEY,
} from "@rte-ds/core/constants/keyboard/keyboard.constants";
import { forwardRef, useRef, useState } from "react";

import Badge from "../badge/Badge";
import Icon from "../icon/Icon";
import { concatClassNames } from "../utils";

import style from "./SegmentedTabs.module.scss";

interface SegmentedTabsProps extends CoreSegmentedTabsProps, Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {}

const getTabPosition = (index: number, total: number): "left" | "middle" | "right" => {
  if (total === 2) return index === 0 ? "left" : "right";
  if (index === 0) return "left";
  if (index === total - 1) return "right";
  return "middle";
};

const SegmentedTabs = forwardRef<HTMLDivElement, SegmentedTabsProps>(
  ({ tabs, selectedTab, defaultSelectedTab, onChange, size = "l", width, className, ...props }, ref) => {
    const [internalTab, setInternalTab] = useState(defaultSelectedTab ?? tabs[0]?.id ?? "");
    const isControlled = selectedTab !== undefined;
    const activeTabId = isControlled ? selectedTab : internalTab;

    const barRef = useRef<HTMLDivElement>(null);
    const iconSize = size === "s" ? 16 : 24;

    const handleSelect = (id: string) => {
      if (!isControlled) {
        setInternalTab(id);
      }
      onChange?.(id);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const id = e.currentTarget.getAttribute("id") || "";
      handleSelect(id);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === SPACE_KEY || e.key === ENTER_KEY) {
        e.preventDefault();
        const id = e.currentTarget.getAttribute("id") || "";
        handleSelect(id);
      } else if (e.key === ARROW_RIGHT_KEY || e.key === ARROW_LEFT_KEY) {
        e.preventDefault();
        const allTabs = Array.from(barRef.current?.querySelectorAll("." + style.tab) ?? []) as HTMLElement[];
        const currentIndex = allTabs.findIndex((el) => el === document.activeElement);
        let nextIndex: number;
        if (e.key === ARROW_RIGHT_KEY) {
          nextIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
        } else {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
        }
        allTabs[nextIndex]?.focus();
      }
    };

    const activeTab = tabs.find((tab) => tab.id === activeTabId);

    return (
      <div ref={ref} className={concatClassNames(style["segmented-tabs"], className)} {...props}>
        <div ref={barRef} role="tablist" className={style["tab-bar"]} data-size={size} style={{ width }}>
          {tabs.map((tab, index) => {
            const isSelected = activeTabId === tab.id;
            const position = getTabPosition(index, tabs.length);
            return (
              <div key={tab.id} className={style["tab-container"]} data-position={position} data-size={size}>
                <div
                  id={tab.id}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${tab.id}`}
                  aria-label={tab.label}
                  className={style.tab}
                  data-tab-type={tab.icon ? "icon" : "label"}
                  data-selected={isSelected}
                  data-size={size}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={handleClick}
                  onKeyDown={handleKeyDown}
                >
                  {isSelected && (
                    <Icon name="check-small" appearance="filled" size={iconSize} className={style["selected-icon"]} />
                  )}
                  <div className={style["tab-content"]}>
                    {tab.icon ? (
                      <Icon name={tab.icon} appearance={isSelected ? "filled" : "outlined"} size={iconSize} />
                    ) : (
                      <span className={style["tab-label"]}>{tab.label}</span>
                    )}
                  </div>
                  {shouldDisplayBadge({
                    showBadge: !!tab.showBadge,
                    badgeContent: tab.badgeContent,
                    badgeCount: tab.badgeCount,
                    badgeIcon: tab.badgeIcon,
                  }) && (
                    <Badge
                      count={tab.badgeCount}
                      content={tab.badgeContent}
                      icon={tab.badgeIcon}
                      badgeType={tab.badgeType}
                      size={tab.badgeSize}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div id={`panel-${activeTabId}`} role="tabpanel" aria-labelledby={activeTabId} className={style["tab-panel"]}>
          {activeTab?.content}
        </div>
      </div>
    );
  },
);

export default SegmentedTabs;
