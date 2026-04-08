import { getToastPriority } from "@rte-ds/core/components/toast/toast.utils";
import { useCallback, useMemo, useState } from "react";

import { InputToast, ToastQueueContext, ToastQueueItem } from "./ToastQueueContext";

const ToastQueueProvider = ({ children }: { children: React.ReactNode }) => {
  const [queue, setQueue] = useState<ToastQueueItem[]>([]);

  const addToQueue = useCallback((toast: InputToast) => {
    const priority = getToastPriority(toast);

    setQueue((prevQueue) => {
      return [...prevQueue, { id: toast.id, priority, isOpen: false }].sort((a, b) => a.priority - b.priority);
    });
  }, []);

  const removeFromQueue = useCallback((id: string) => {
    setQueue((prevQueue) => prevQueue.filter((toast) => toast.id !== id));
  }, []);

  const isFirstInQueue = useCallback(
    (id: string) => {
      return queue.length > 0 && queue[0].id === id;
    },
    [queue],
  );

  const isInQueue = useCallback(
    (id: string) => {
      return queue.findIndex((toast) => toast.id === id) !== -1;
    },
    [queue],
  );

  const contextValue = useMemo(
    () => ({ addToQueue, removeFromQueue, isFirstInQueue, isInQueue, queue }),
    [addToQueue, removeFromQueue, isFirstInQueue, isInQueue, queue],
  );

  return (
    <ToastQueueContext.Provider value={contextValue}>
      {children}
    </ToastQueueContext.Provider>
  );
};

export default ToastQueueProvider;
