import { DividerProps } from "@rte-ds/core/components/divider/divider.interface";
import { forwardRef } from "react";

import style from "./Divider.module.scss";

const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = "horizontal",
      thickness = "light",
      appearance = "default",
      endPoint = "round",
      text,
      borderColor,
      ...props
    },
    ref,
  ) => {
    if (orientation === "horizontal" && text) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="separator"
          className={style.horizontalWithText}
          data-thickness={thickness}
          data-appearance={appearance}
          data-end-point={endPoint}
          {...props}
        >
          <span className={style.textLabel}>{text}</span>
          <hr
            className={style.horizontal}
            data-thickness={thickness}
            data-appearance={appearance}
            data-end-point={endPoint}
            style={borderColor ? { borderTopColor: borderColor } : undefined}
          />
        </div>
      );
    }

    return orientation === "horizontal" ? (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        className={style.horizontal}
        data-thickness={thickness}
        data-appearance={appearance}
        data-end-point={endPoint}
        style={borderColor ? { borderTopColor: borderColor } : undefined}
        {...props}
      />
    ) : (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="separator"
        className={style.vertical}
        data-thickness={thickness}
        data-appearance={appearance}
        data-end-point={endPoint}
        style={borderColor ? { backgroundColor: borderColor } : undefined}
        {...props}
      />
    );
  },
);

export default Divider;
