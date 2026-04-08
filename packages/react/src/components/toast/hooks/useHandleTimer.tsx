import { ToastDurationMap } from "@rte-ds/core/components/toast/toast.constants";
import { ToastDuration } from "@rte-ds/core/components/toast/toast.interface";
import { useCallback, useEffect, useRef } from "react";

type TimeoutProperties = {
  shouldStartTimer: boolean;
  duration: ToastDuration;
};

const useHandleTimer = ({ shouldStartTimer, duration }: TimeoutProperties, callback: () => void) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const initializeTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      callbackRef.current();
    }, ToastDurationMap[duration]);
  }, [duration]);

  const removeTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);

      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (shouldStartTimer) {
      removeTimer();
      initializeTimer();
    }
    return () => {
      removeTimer();
    };
  }, [initializeTimer, removeTimer, shouldStartTimer]);

  return { initializeTimer, removeTimer };
};

export default useHandleTimer;
