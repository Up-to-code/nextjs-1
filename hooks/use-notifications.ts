"use client";

import { useState, useEffect } from 'react';
import { Notification } from '@/types';
import { MOCK_NOTIFICATIONS } from '@/services/mock-data';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        setNotifications(MOCK_NOTIFICATIONS);
    }, []);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    // Simulate real-time notifications
    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.85) { // 15% chance
                const newNotification: Notification = {
                    id: Date.now().toString(),
                    type: 'info',
                    title: 'تحديث النظام',
                    message: 'تم تحديث النظام بنجاح',
                    read: false,
                    createdAt: new Date().toISOString(),
                };
                setNotifications(prev => [newNotification, ...prev]);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    return {
        notifications,
        markAsRead,
        markAllAsRead,
        clearAll
    };
}
