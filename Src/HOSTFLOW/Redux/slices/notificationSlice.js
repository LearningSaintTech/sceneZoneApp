import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 20 }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log('🔔 [fetchNotifications] Start:', { 
      page, 
      limit, 
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      timestamp: new Date().toISOString() 
    });
    try {
      console.log('🔔 [fetchNotifications] API GET /notifications', { page, limit });
      const response = await api.get(`/notifications?page=${page}&limit=${limit}`);
      console.log('🔔 [fetchNotifications] API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('🔔 [fetchNotifications] Error:', error.message, error.response?.data);
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log('🔔 [markNotificationAsRead] Start:', { 
      notificationId, 
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      timestamp: new Date().toISOString() 
    });
    try {
      console.log('🔔 [markNotificationAsRead] API PATCH /notifications/' + notificationId + '/read');
      const response = await api.patch(`/notifications/${notificationId}/read`);
      console.log('🔔 [markNotificationAsRead] API response:', response.data);
      return { notificationId, notification: response.data.notification };
    } catch (error) {
      console.error('🔔 [markNotificationAsRead] Error:', error.message, error.response?.data);
      return rejectWithValue(error.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log('🔔 [markAllNotificationsAsRead] Start:', { 
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      timestamp: new Date().toISOString() 
    });
    try {
      console.log('🔔 [markAllNotificationsAsRead] API PATCH /notifications/mark-all-read');
      const response = await api.patch('/notifications/mark-all-read');
      console.log('🔔 [markAllNotificationsAsRead] API response:', response.data);
      return true;
    } catch (error) {
      console.error('🔔 [markAllNotificationsAsRead] Error:', error.message, error.response?.data);
      return rejectWithValue(error.message);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log('🔔 [getUnreadCount] Start:', { 
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      timestamp: new Date().toISOString() 
    });
    try {
      console.log('🔔 [getUnreadCount] API GET /notifications/unread-count');
      const response = await api.get('/notifications/unread-count');
      console.log('🔔 [getUnreadCount] API response:', response.data);
      return response.data.count;
    } catch (error) {
      console.error('🔔 [getUnreadCount] Error:', error.message, error.response?.data);
      return rejectWithValue(error.message);
    }
  }
);

export const saveFCMToken = createAsyncThunk(
  'notifications/saveFCMToken',
  async ({ fcmToken, deviceId }, { rejectWithValue, getState }) => {
    const state = getState();
    const token = state.auth.token;
    console.log('🔔 [saveFCMToken] Start:', { 
      fcmToken: fcmToken ? `${fcmToken.substring(0, 20)}...` : 'No FCM token',
      deviceId, 
      hasToken: !!token,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token',
      timestamp: new Date().toISOString() 
    });
    try {
      console.log('🔔 [saveFCMToken] API POST /notifications/save-fcm-token');
      const response = await api.post('/notifications/save-fcm-token', { fcmToken, deviceId });
      console.log('🔔 [saveFCMToken] API response:', response.data);
      return { fcmToken, deviceId };
    } catch (error) {
      console.error('🔔 [saveFCMToken] Error:', error.message, error.response?.data);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  fcmToken: null,
  deviceId: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    setFCMToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.notifications = action.payload.notifications;
        } else {
          state.notifications.push(...action.payload.notifications);
        }
        state.currentPage = action.payload.page;
        state.hasMore = action.payload.notifications.length === action.payload.limit;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const { notificationId, notification } = action.payload;
        const index = state.notifications.findIndex(n => n._id === notificationId);
        if (index !== -1) {
          state.notifications[index] = notification;
        }
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          isRead: true
        }));
        state.unreadCount = 0;
      })
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      // Save FCM token
      .addCase(saveFCMToken.fulfilled, (state, action) => {
        state.fcmToken = action.payload.fcmToken;
        state.deviceId = action.payload.deviceId;
      });
  },
});

export const {
  clearNotifications,
  addNotification,
  setUnreadCount,
  setFCMToken,
  setDeviceId,
  clearError,
} = notificationSlice.actions;

export default notificationSlice.reducer; 