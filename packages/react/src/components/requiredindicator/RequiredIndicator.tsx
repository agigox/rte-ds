import { REQUIREMENT_INDICATOR_VALUE } from "@rte-ds/core/components/required-indicator/required-indicator.constant";
import { RequiredIndicatorProps } from "@rte-ds/core/components/required-indicator/required-indicator.interface";

import styles from "./RequiredIndicator.module.scss";

const RequiredIndicator = ({ required, showLabelRequirement }: RequiredIndicatorProps) => {
  const computedRequirementIndicatorValue = required
    ? showLabelRequirement
      ? REQUIREMENT_INDICATOR_VALUE.required
      : REQUIREMENT_INDICATOR_VALUE.requiredIcon
    : REQUIREMENT_INDICATOR_VALUE.optional;

  return (
    <>
      {(showLabelRequirement || required) && (
        <span
          className={styles["requirement-indicator"]}
          data-required={required}
          data-show-label-requirement={showLabelRequirement}
          aria-hidden="true"
        >
          {computedRequirementIndicatorValue}
        </span>
      )}
    </>
  );
};

export default RequiredIndicator;
