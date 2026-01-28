import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { BadgeProps } from "@rte-ds/core/components/badge/badge.interface";
import { shouldDisplayBadge as coreShouldDisplayBadge } from "@rte-ds/core/components/badge/badge.utils";
import { BREADCRUMBS_DEFAULT_ARIA_LABEL } from "@rte-ds/core/components/breadcrumbs/breadcrumbs.constants";
import {
  BreadcrumbItemProps,
  BreadcrumbsTruncatedItems,
} from "@rte-ds/core/components/breadcrumbs/breadcrumbs.interface";
import {
  getBreadcrumbsTruncatedItems,
  shouldTruncateBreadcrumbs,
} from "@rte-ds/core/components/breadcrumbs/breadcrumbs.utils";

import { BadgeComponent } from "../badge/badge.component";
import { DropdownModule } from "../dropdown";
import { IconButtonComponent } from "../icon-button/icon-button.component";

import { BreadcrumbItemComponent } from "./breadcrumb-item/breadcrumb-item.component";

@Component({
  selector: "rte-breadcrumbs",
  imports: [CommonModule, DropdownModule, IconButtonComponent, BreadcrumbItemComponent, BadgeComponent],
  standalone: true,
  templateUrl: "./breadcrumbs.component.html",
  styleUrl: "./breadcrumbs.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbsComponent {
  readonly items = input<BreadcrumbItemProps[]>([]);
  readonly ariaLabel = input<string>(BREADCRUMBS_DEFAULT_ARIA_LABEL);
  readonly breadcrumbItemMaxWidth = input<number>(150);
  readonly badgeContent = input<BadgeProps["content"]>();
  readonly badgeCount = input<number>();
  readonly badgeIcon = input<string>();
  readonly badgeType = input<BadgeProps["badgeType"]>();
  readonly showBadge = input<boolean>(false);
  readonly badgeSize = input<BadgeProps["size"]>("s");

  readonly truncatedItems = computed<BreadcrumbsTruncatedItems | null>(() => {
    if (shouldTruncateBreadcrumbs(this.items())) {
      return getBreadcrumbsTruncatedItems(this.items());
    }
    return null;
  });

  readonly shouldDisplayBadge = computed((): boolean => {
    return coreShouldDisplayBadge({
      showBadge: !!this.showBadge(),
      badgeContent: this.badgeContent(),
      badgeCount: this.badgeCount(),
      badgeIcon: this.badgeIcon(),
    });
  });
}
