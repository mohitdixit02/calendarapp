import React, { createContext, useContext } from 'react';
import { notification } from 'antd';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();

    const popNotification = (type, message, description) => {
        api[type]({
            message: message,
            description: description
        });
    };

    return (
        <NotificationContext.Provider value={popNotification}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);