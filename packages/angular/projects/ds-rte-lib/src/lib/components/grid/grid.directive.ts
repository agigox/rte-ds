import { Directive, HostBinding, input } from "@angular/core";
import { GridType } from "@rte-ds/core/components/grid/grid.interface";

@Directive({
  selector: "[rteGrid]",
  standalone: true,
})
export class GridDirective {
  readonly gridType = input<GridType>("fluid");

  @HostBinding("class")
  get hostClasses(): string {
    return "grid";
  }

  @HostBinding("attr.data-gridtype")
  get hostDataClasses(): string {
    const variation = this.gridType();
    return `${variation}`;
  }
  constructor() {}
}
