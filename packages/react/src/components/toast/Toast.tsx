import { forwardRef, useCallback, useEffect, useState } from "react";

import { IconSize, IconTypeMap } from "../../core-types/icon/icon.constants";
import { ToastProps as coreToastProps } from "../../core-types/toast/toast.interface";
import useAnimatedMount from "../../hooks/useAnimatedMount";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import { isValidIconName } from "../icon/IconMap";
import IconButton from "../iconButton/IconButton";
import { Overlay } from "../overlay/Overlay";
import { concatClassNames } from "../utils";

import useHandleQueueChanges from "./hooks/useHandleQueueChanges";
import useHandleTimer from "./hooks/useHandleTimer";
import styles from "./Toast.module.scss";
import useToastQueueContext from "./toastQueue/useToastQueueContext";

interface ToastProps extends coreToastProps, React.HTMLAttributes<HTMLDivElement> {
  showActionButton?: boolean;
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      message,
      type = "error",
      closable = false,
      placement = "bottom-right",
      isOpen = true,
      autoDismiss = true,
      actionButtonLabel,
      onActionButtonClick,
      duration = "medium",
      onClose,
      iconName,
      showLeftIcon = true,
      showActionButton = true,
      ...props
    },
    ref,
  ) => {
    const hasActionButton = !!actionButtonLabel && showActionButton;

    const isAutoDismiss = autoDismiss && !hasActionButton;

    const [internalId] = useState<string>(() => id || crypto.randomUUID());

    const { isInternalOpen, hideToast } = useHandleQueueChanges(internalId, isOpen);
    const { addToQueue, removeFromQueue } = useToastQueueContext();
    const { shouldRender, isAnimating } = useAnimatedMount(isInternalOpen, 300);
    const { initializeTimer, removeTimer } = useHandleTimer(
      { shouldStartTimer: isAutoDismiss && isInternalOpen, duration },
      () => {
        handleOnClose();
      },
    );

    const [position, alignment] = placement.split("-");

    const handleOnClose = useCallback(() => {
      hideToast();
      removeTimer();
      removeFromQueue(internalId);
      onClose?.();
    }, [hideToast, removeTimer, removeFromQueue, internalId, onClose]);

    useEffect(() => {
      if (isOpen) {
        addToQueue({ id: internalId, hasActionButton: hasActionButton, type });
      } else {
        handleOnClose();
      }
    }, [isOpen, hasActionButton, type, isAutoDismiss, internalId, addToQueue, handleOnClose]);

    const handleOnMouseEnter = useCallback(() => {
      if (isAutoDismiss && isOpen) {
        removeTimer();
      }
    }, [isAutoDismiss, isOpen, removeTimer]);

    const handleOnMouseLeave = useCallback(() => {
      if (isAutoDismiss) {
        initializeTimer();
      }
    }, [isAutoDismiss, initializeTimer]);

    const displayDefaultIcon = showLeftIcon && type !== "neutral";
    const displayCustomIcon = showLeftIcon && iconName && isValidIconName(iconName);

    const toastRole = type === "error" ? "alert" : "status";
    const ariaLive = type === "error" ? "assertive" : "polite";

    return (
      shouldRender && (
        <Overlay>
          <div
            role={toastRole}
            aria-live={ariaLive}
            className={concatClassNames(styles["toast"], props.className)}
            data-type={type}
            data-position={position}
            data-alignment={alignment}
            data-open={isAnimating || undefined}
            ref={ref}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            {...props}
          >
            <div className={styles["toast-content"]}>
              {displayDefaultIcon ? (
                <Icon
                  name={IconTypeMap[type]}
                  size={IconSize["xl"]}
                  className={styles["toast-icon"]}
                  aria-hidden="true"
                />
              ) : (
                displayCustomIcon && (
                  <Icon name={iconName} size={IconSize["xl"]} className={styles["toast-icon"]} aria-hidden="true" />
                )
              )}
              <span className={styles["toast-message"]}>{message}</span>
            </div>
            {hasActionButton && (
              <Button
                variant={type === "neutral" ? "reverse" : "transparent"}
                onClick={onActionButtonClick}
                label={actionButtonLabel}
              />
            )}
            {closable && (
              <IconButton
                data-testid="toast-close-button"
                name="close"
                variant={type === "neutral" ? "reverse" : "neutral"}
                onClick={handleOnClose}
              />
            )}
          </div>
        </Overlay>
      )
    );
  },
);

export default Toast;
