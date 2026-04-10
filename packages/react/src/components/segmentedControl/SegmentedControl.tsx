import { forwardRef } from "react";

import { getSegmentPosition } from "../../core-types/segmented-control/segmented-control-utils";
import { SegmentedControlProps as CoreSegmentedControlProps } from "../../core-types/segmented-control/segmented-control.interface";

import Segment from "./Segment";
import style from "./SegmentedControl.module.scss";

export type SegmentedControlSize = "s" | "l";

interface SegmentedControlProps
  extends CoreSegmentedControlProps, Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  onChange: (id: string) => void;
  size?: SegmentedControlSize;
}

const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ options, onChange, selectedSegment, size = "l", ...props }, ref) => {
    const handleOnClick = (event: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => {
      const target = event.currentTarget as HTMLDivElement;
      const id = target.getAttribute("id") || "";
      onChange(id);
    };

    return (
      <div ref={ref} role="radiogroup" className={style["segmented-control"]} data-size={size} {...props}>
        {options.map((option, index) => (
          <Segment
            key={`${option.id}-${index}`}
            position={getSegmentPosition(index, options.length)}
            onClick={handleOnClick}
            isSelected={selectedSegment === option.id}
            size={size}
            {...option}
          />
        ))}
      </div>
    );
  },
);

export default SegmentedControl;
