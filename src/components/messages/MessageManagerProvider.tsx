import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@saleor/config";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  checkmarkCircle,
  closeCircle,
  informationCircle,
  alertCircle
} from "ionicons/icons";
import { INotification, ITimer, MessageContext } from ".";
import { IonToast } from "@ionic/react";
import React from "react";

const MessageManagerProvider = ({ children }) => {
  const timersArr = useRef<ITimer[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const timersArrRef = timersArr.current;

    return () => {
      timersArrRef.forEach(timer => clearTimeout(timer.timeoutId));
    };
  }, []);

  const timerCallback = (notification: INotification) => {
    remove(notification.id);
    timersArr.current = timersArr.current.filter(
      timer => timer.id !== notification.id
    );
  };

  const remove = useCallback(notificationId => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId)
    );
  }, []);

  const show = useCallback(
    (message = {}, timeout = DEFAULT_NOTIFICATION_SHOW_TIME) => {
      const id = Date.now();
      const notification = {
        close: () => remove(id),
        id,
        message,
        timeout
      };
      if (timeout !== null) {
        const timeoutId = window.setTimeout(() => {
          timerCallback(notification);
        }, timeout);

        timersArr.current.push({
          id: notification.id,
          notification,
          remaining: timeout,
          start: new Date().getTime(),
          timeoutId
        });
      }

      setNotifications(state => [notification, ...state]);

      return notification;
    },
    []
  );

  const getIcon = (notification: INotification) => {
    if (notification.message.status === "success") {
      return checkmarkCircle;
    }
    if (notification.message.status === "error") {
      return closeCircle;
    }
    if (notification.message.status === "info") {
      return informationCircle;
    }
    if (notification.message.status === "warning") {
      return alertCircle;
    }
  };
  return (
    <>
      <MessageContext.Provider value={{ remove, show }}>
        {children}
      </MessageContext.Provider>
      {!!notifications.length &&
        notifications.map(notification => (
          <IonToast
            key={notification.id}
            isOpen={true}
            position="top"
            icon={getIcon(notification)}
            message={String(notification.message.text)}
            duration={notification.timeout}
          />
        ))}
    </>
  );
};

export default MessageManagerProvider;
