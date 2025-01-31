import { useCallback, useEffect, type Dispatch } from 'react';

interface EventPayloadMap {
  appModal: {
    id: string;
    isOpen: boolean;
  };
}

type PayloadType<T extends keyof EventPayloadMap> = EventPayloadMap[T];

interface AppEvent<T extends keyof EventPayloadMap> extends Event {
  detail: PayloadType<T>;
}

export const useEvent = <T extends keyof EventPayloadMap>(
  eventName: T,
  callback?: Dispatch<PayloadType<T>> | VoidFunction
) => {
  useEffect(() => {
    if (!callback) {
      return;
    }

    const listener = ((event: AppEvent<T>) => {
      try {
        callback(event.detail);
      } catch (error) {
        console.error(`Error handling event ${eventName}:`, error);
      }
    }) as EventListener;

    window.addEventListener(eventName, listener);
    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [callback, eventName]);

  const dispatch = useCallback(
    (detail: PayloadType<T>) => {
      const event = new CustomEvent(eventName, { detail });
      window.dispatchEvent(event);
    },
    [eventName]
  );

  return { dispatch };
};
