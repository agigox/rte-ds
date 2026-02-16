import { BadgeHolderProps } from "../badge/badge.interface";

export interface SegmentedTabItem extends BadgeHolderProps {
  id: string;
  label: string;
  icon?: string;
  content: React.ReactNode;
}

export interface SegmentedTabsProps {
  tabs: SegmentedTabItem[];
  selectedTab?: string;
  defaultSelectedTab?: string;
  onChange?: (id: string) => void;
  size?: "s" | "l";
  width?: string | number;
}
