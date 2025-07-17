import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform } from 'react-native';
import { store } from '../Redux/store';
import { setFCMToken, setDeviceId, addNotification } from '../Redux/slices/notificationSlice';
import { saveFCMToken } from '../Redux/slices/notificationSlice';
import api from './api'; // Use the proper API service with token handling

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.fcmToken = null;
    this.deviceId = null;
    this.navigationRef = null;
  }

  // Set navigation reference for deep linking
  setNavigationRef(navigationRef) {
    this.navigationRef = navigationRef;
    console.log('[NotificationService] Navigation reference set');
  }

  // Handle notification tap and navigate to appropriate screen
  handleNotificationTap(notification) {
    console.log('[NotificationService] Handling notification tap:', notification);
    
    if (!this.navigationRef) {
      console.log('[NotificationService] Navigation reference not set, cannot navigate');
      return;
    }

    const data = notification.data || notification;
    
    // Handle chat notifications
    if (data.chatId) {
      console.log(`[NotificationService] Navigating to chat: ${data.chatId}`);
      this.navigationRef.current?.navigate('Chat', { 
        chatId: data.chatId, 
        eventId: data.eventId 
      });
      return;
    }

    // Handle other notification types
    if (data.type === 'event_invitation') {
      console.log(`[NotificationService] Navigating to event: ${data.eventId}`);
      this.navigationRef.current?.navigate('Event', { eventId: data.eventId });
      return;
    }

    // Default: navigate to notifications screen
    console.log('[NotificationService] Navigating to notifications screen');
    const userType = store.getState().auth.userType;
    switch (userType) {
      case 'artist':
        this.navigationRef.current?.navigate('ArtistNotification');
        break;
      case 'host':
        this.navigationRef.current?.navigate('Notification');
        break;
      case 'user':
        this.navigationRef.current?.navigate('UserNotificationScreen');
        break;
      default:
        console.log('[NotificationService] Unknown user type for navigation');
    }
  }

  // Create notification channel (Android)
  async createNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'chat_messages',
        name: 'Chat Messages',
        importance: AndroidImportance.HIGH,
      });
      console.log('[NotificationService] Android notification channel created');
    }
  }

  // Initialize notification service
  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('[NotificationService] Initializing notification service...');
      await this.createNotificationChannel();
      
      // Request permission
      await this.requestPermission();
      
      // Get FCM token
      await this.getFCMToken();
      
      // Set up message handlers
      this.setupMessageHandlers();
      
      this.isInitialized = true;
      console.log('[NotificationService] Notification service initialized successfully');
    } catch (error) {
      console.error('[NotificationService] Error initializing notification service:', error);
    }
  }

  // Request notification permission
  async requestPermission() {
    try {
      console.log('[NotificationService] Requesting notification permission (Notifee + FCM)...');
      // Notifee handles both Android and iOS
      const notifeeStatus = await notifee.requestPermission();
      console.log('[NotificationService] Notifee permission status:', notifeeStatus);

      // FCM (for completeness, but Notifee is usually enough)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('[NotificationService] FCM permission status:', authStatus);

      // Notifee: 1 = AUTHORIZED, 0 = DENIED
      if ((notifeeStatus.authorizationStatus === 1) || enabled) {
        console.log('[NotificationService] Notification permission granted');
        return true;
      } else {
        console.log('[NotificationService] Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('[NotificationService] Error requesting permission:', error);
      return false;
    }
  }

  // Get FCM token
  async getFCMToken() {
    try {
      console.log('[NotificationService] Getting FCM token...');
      const token = await messaging().getToken();
      if (token) {
        this.fcmToken = token;
        store.dispatch(setFCMToken(token));
        console.log('[NotificationService] FCM token obtained:', token);
        
        // Save token to backend if user is authenticated
        const authState = store.getState().auth;
        console.log('[NotificationService] Auth state check:', {
          isLoggedIn: authState.isLoggedIn,
          userType: authState.userType,
          hasToken: !!authState.token,
          hasUserData: !!authState.userData
        });
        
        if (authState.token) {
          console.log('[NotificationService] User authenticated, saving token to backend...');
          await this.saveTokenToBackend(token);
        } else {
          console.log('[NotificationService] User not authenticated, skipping token save');
        }
        
        return token;
      }
    } catch (error) {
      console.error('[NotificationService] Error getting FCM token:', error);
    }
    return null;
  }

  // Save FCM token to backend
  async saveTokenToBackend(token) {
    try {
      const deviceId = this.getDeviceId();
      console.log('[NotificationService] Saving FCM token to backend:', { 
        token: token ? `${token.substring(0, 20)}...` : 'No token',
        deviceId 
      });
      
      console.log('[NotificationService] Dispatching saveFCMToken action...');
      const result = await store.dispatch(saveFCMToken({ fcmToken: token, deviceId })).unwrap();
      console.log('[NotificationService] saveFCMToken action result:', result);
      
      // If you want to use api.js directly:
      // const response = await api.post('/notifications/save-fcm-token', { fcmToken: token, deviceId });
      // console.log('[NotificationService] API response:', response.data);
      
      console.log('[NotificationService] FCM token saved to backend successfully');
    } catch (error) {
      console.error('[NotificationService] Error saving FCM token to backend:', error);
      console.error('[NotificationService] Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  }

  // Get device ID
  getDeviceId() {
    if (!this.deviceId) {
      // Generate a simple device ID (in production, use a proper device ID library)
      this.deviceId = `${Platform.OS}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      store.dispatch(setDeviceId(this.deviceId));
      console.log('[NotificationService] Generated deviceId:', this.deviceId);
    }
    return this.deviceId;
  }

  // Helper to display notification using Notifee
  async displayNotification(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      await notifee.displayNotification({
        title: notification?.title || data?.title || 'Notification',
        body: notification?.body || data?.body || '',
        android: {
          channelId: 'chat_messages',
          pressAction: { id: 'default' },
        },
        data: data,
      });
      console.log('[NotificationService] Notifee notification displayed');
    } catch (err) {
      console.error('[NotificationService] Error displaying notification with Notifee:', err);
    }
  }

  // Set up message handlers
  setupMessageHandlers() {
    console.log('[NotificationService] Setting up message handlers...');
    
    // Handle foreground messages
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('[NotificationService] Foreground message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
      this.handleNotification(remoteMessage);
    });

    // Handle background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('[NotificationService] Background message received:', remoteMessage);
      await this.displayNotification(remoteMessage);
      this.handleNotification(remoteMessage);
    });

    // Handle notification open
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('[NotificationService] App opened from notification:', remoteMessage);
      this.handleNotificationOpen(remoteMessage);
    });

    // Handle initial notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
      if (remoteMessage) {
        console.log('[NotificationService] App opened from initial notification:', remoteMessage);
        this.handleNotificationOpen(remoteMessage);
      }
    });

    // Store unsubscribe function for cleanup
    this.unsubscribeForeground = unsubscribeForeground;
    console.log('[NotificationService] Message handlers setup successfully');
  }

  // Handle incoming notification
  handleNotification(remoteMessage) {
    try {
      const { notification, data } = remoteMessage;
      
      if (notification) {
        // Add notification to Redux store
        const notificationData = {
          _id: data?.notificationId || Date.now().toString(),
          title: notification.title,
          body: notification.body,
          type: data?.type || 'system_alert',
          data: data,
          isRead: false,
          createdAt: new Date().toISOString(),
          senderId: data?.senderId,
          senderType: data?.senderType,
          recipientId: data?.recipientId,
          recipientType: data?.recipientType,
        };

        store.dispatch(addNotification(notificationData));
        console.log('[NotificationService] Notification added to store:', notificationData);
      }
    } catch (error) {
      console.error('[NotificationService] Error handling notification:', error);
    }
  }

  // Handle notification open
  handleNotificationOpen(remoteMessage) {
    try {
      const { data } = remoteMessage;
      console.log('[NotificationService] Handling notification open:', data);
      
      if (!this.navigationRef) {
        console.log('[NotificationService] Navigation reference not set, cannot navigate');
        return;
      }
      
      // Navigate based on notification type
      if (data?.type === 'chat_message' || data?.type === 'price_proposal' || data?.type === 'price_approved') {
        // Navigate to chat screen
        this.navigateToChat(data);
      } else if (data?.type === 'event_invitation') {
        // Navigate to event details
        this.navigateToEvent(data);
      } else if (data?.type === 'booking_confirmed' || data?.type === 'payment_received') {
        // Navigate to booking details
        this.navigateToBooking(data);
      } else if (data?.type === 'guest_list_request') {
        // Navigate to guest list management
        this.navigateToGuestList(data);
      } else {
        // Default: navigate to notifications screen
        this.navigateToNotifications();
      }
    } catch (error) {
      console.error('[NotificationService] Error handling notification open:', error);
    }
  }

  // Navigate to chat screen
  navigateToChat(data) {
    if (data?.chatId) {
      this.navigationRef?.current?.navigate('Chat', {
        chatId: data.chatId,
        eventId: data.eventId,
      });
    }
  }

  // Navigate to event screen
  navigateToEvent(data) {
    if (data?.eventId) {
      this.navigationRef?.current?.navigate('Event', {
        eventId: data.eventId,
      });
    }
  }

  // Navigate to booking screen
  navigateToBooking(data) {
    if (data?.bookingId) {
      const userType = store.getState().auth.userType;
      switch (userType) {
        case 'artist':
          this.navigationRef?.current?.navigate('ArtistFormBooking', { bookingId: data.bookingId });
          break;
        case 'host':
          this.navigationRef?.current?.navigate('HostDetailBooking', { bookingId: data.bookingId });
          break;
        case 'user':
          this.navigationRef?.current?.navigate('UserDetailBookingScreen', { bookingId: data.bookingId });
          break;
        default:
          break;
      }
    }
  }

  // Navigate to notifications screen
  navigateToNotifications() {
    const userType = store.getState().auth.userType;
    switch (userType) {
      case 'artist':
        this.navigationRef?.current?.navigate('ArtistNotification');
        break;
      case 'host':
        this.navigationRef?.current?.navigate('Notification');
        break;
      case 'user':
        this.navigationRef?.current?.navigate('UserNotificationScreen');
        break;
      default:
        break;
    }
  }

  // Navigate to guest list management screen
  navigateToGuestList(data) {
    console.log('[NotificationService] Navigating to guest list:', data);
    if (data?.eventId) {
      const userType = store.getState().auth.userType;
      switch (userType) {
        case 'artist':
          this.navigationRef.current?.navigate('ArtistGuestList', {
            eventId: data.eventId,
            eventName: data.eventName,
            userId: data.userId
          });
          break;
        default:
          console.log('[NotificationService] Unknown user type for guest list navigation');
      }
    }
  }

  // Cleanup
  cleanup() {
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
    }
    this.isInitialized = false;
  }

  // Refresh FCM token
  async refreshToken() {
    try {
      const token = await this.getFCMToken();
      if (token) {
        await this.saveTokenToBackend(token);
      }
    } catch (error) {
      console.error('[NotificationService] Error refreshing FCM token:', error);
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 