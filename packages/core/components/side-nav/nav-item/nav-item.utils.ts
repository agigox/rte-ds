import { IconSize } from "@rte-ds/core/components/icon/icon.constants";

export function getNavItemLabelIconSize(isNested = false, collapsed = false): number {
  if (isNested) {
    return IconSize.s;
  }
  return collapsed ? IconSize.l : IconSize.m;
}
