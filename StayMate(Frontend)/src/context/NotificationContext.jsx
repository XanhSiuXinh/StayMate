import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [connection, setConnection] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  // Initialize SignalR connection
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5000/notificationhub', {
          accessTokenFactory: () => user.token,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      newConnection.on('ReceiveNotification', (notification) => {
        console.log('New notification received:', notification);
        setNotifications(prev => [notification, ...prev]);
      });

      newConnection.onreconnected(() => {
        console.log('SignalR reconnected');
        fetchNotifications(); // Refetch notifications on reconnect
      });

      setConnection(newConnection);

      // Start connection
      const startConnection = async () => {
        try {
          setIsLoading(true);
          await newConnection.start();
          console.log('SignalR connected');
          fetchNotifications(); // Fetch initial notifications
        } catch (err) {
          console.error('SignalR connection error:', err);
          setTimeout(startConnection, 5000); // Retry after 5 seconds
        } finally {
          setIsLoading(false);
        }
      };

      startConnection();

      return () => {
        if (newConnection.state === signalR.HubConnectionState.Connected) {
          newConnection.stop();
        }
      };
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
      setUnreadCount(0);
      if (connection) {
        connection.stop();
        setConnection(null);
      }
    }
  }, [isAuthenticated, user?.token]);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?.token) return;

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [isAuthenticated, user?.token]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!user?.token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [user?.token]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.token) return;

    try {
      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.token]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    connection,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
