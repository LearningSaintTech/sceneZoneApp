import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../Redux/slices/notificationSlice';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';

const notificationsData = [
  {
    id: '1',
    type: 'booking',
    budget: '$500',
    genre: 'Rock',
    date: '06 Feb 2025',
    rating: 4,
  },
  {
    id: '2',
    type: 'guest_list',
    user: 'User 23',
    date: '06 Feb 2025',
    rating: 4,
  },
  // Add more placeholder notification data here
  { id: '3', type: 'placeholder', text: 'Notifications' },
  { id: '4', type: 'placeholder', text: 'Notifications' },
  { id: '5', type: 'placeholder', text: 'Notifications' },
  { id: '6', type: 'placeholder', text: 'Notifications' },
  { id: '7', type: 'placeholder', text: 'Notifications' },
  { id: '8', type: 'placeholder', text: 'Notifications' },
  { id: '9', type: 'placeholder', text: 'Notifications' },
  { id: '10', type: 'placeholder', text: 'Notifications' },
];

const AVATAR = require('../assets/Images/frame1.png'); // Adjust path as needed

const ArtistNotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, loading, hasMore, currentPage } = useSelector(state => state.notifications);
  const token = useSelector(state => state.auth.token);
  const [actionLoading, setActionLoading] = useState({}); // { notificationId: true/false }

  useEffect(() => {
    // Fetch notifications on component mount
    console.log('🔔 [ArtistNotificationScreen] useEffect: Fetching notifications on mount');
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleRefresh = () => {
    console.log('🔔 [ArtistNotificationScreen] handleRefresh: Refreshing notifications');
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      console.log('🔔 [ArtistNotificationScreen] handleLoadMore: Loading more notifications', { nextPage: currentPage + 1 });
      dispatch(fetchNotifications({ page: currentPage + 1, limit: 20 }));
    }
  };

  const handleMarkAsRead = (notificationId) => {
    console.log('🔔 [ArtistNotificationScreen] handleMarkAsRead:', { notificationId });
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    console.log('🔔 [ArtistNotificationScreen] handleMarkAllAsRead');
    dispatch(markAllNotificationsAsRead());
  };

  useEffect(() => {
    console.log('🔔 [ArtistNotificationScreen] Notifications updated:', notifications);
  }, [notifications]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        return 'message-circle';
      case 'event_invitation':
        return 'calendar';
      case 'booking_confirmed':
      case 'payment_received':
        return 'check-circle';
      case 'guest_list_request':
        return 'users';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        return '#a95eff';
      case 'event_invitation':
        return '#FF9500';
      case 'booking_confirmed':
      case 'payment_received':
        return '#34C759';
      case 'guest_list_request':
        return '#FF6B35';
      default:
        return '#A6A6A6';
    }
  };

  const handleNotificationPress = (notification) => {
    console.log('🔔 [ArtistNotificationScreen] Notification pressed:', notification);
    
    // Mark as read first
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Handle different notification types
    switch (notification.type) {
      case 'guest_list_request':
        // Navigate directly to ArtistGuestList for the event
        if (notification.data?.eventId) {
          navigation.navigate('ArtistGuestList', { eventId: notification.data.eventId });
        }
        break;
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        // Navigate to chat
        if (notification.data?.chatId) {
          navigation.navigate('Chat', {
            chatId: notification.data.chatId,
            eventId: notification.data.eventId
          });
        }
        break;
      case 'event_invitation':
        // Navigate to event details
        if (notification.data?.eventId) {
          navigation.navigate('Event', {
            eventId: notification.data.eventId
          });
        }
        break;
      default:
        // Default: just mark as read
        break;
    }
  };

  const handleAcceptGuestList = async (notification) => {
    // Navigate to AssignGuestDiscountScreen with eventId and userId
    navigation.navigate('AssignGuestDiscount', {
      eventId: notification.data?.eventId,
      userId: notification.data?.userId,
      eventName: notification.data?.eventName,
      notificationId: notification._id,
    });
  };

  const handleRejectGuestList = async (notification) => {
    if (!token) return;
    setActionLoading(prev => ({ ...prev, [notification._id]: true }));
    try {
      await axios.post(
        `${API_BASE_URL}/guest-list/events/${notification.data?.eventId}/reject`,
        { userId: notification.data?.userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Optionally show a toast/snackbar
      dispatch(fetchNotifications({ page: 1, limit: 20 })); // Refresh notifications
    } catch (err) {
      // Optionally show error
    } finally {
      setActionLoading(prev => ({ ...prev, [notification._id]: false }));
    }
  };

  const renderNotificationItem = ({ item }) => {
    const isGuestListRequest = item.type === 'guest_list_request';
    return (
      <View
        style={[
          styles.notificationItem,
          !item.isRead && styles.unreadNotification
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <View style={styles.notificationIconContainer}>
            <Icon
              name={getNotificationIcon(item.type)}
              size={20}
              color={getNotificationColor(item.type)}
            />
          </View>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => handleNotificationPress(item)}
          >
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationBody}>{item.body}</Text>
              <Text style={styles.notificationTime}>{formatDate(item.createdAt)}</Text>
            </View>
            {!item.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {loading && currentPage === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a95eff" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="bell-off" size={48} color="#A6A6A6" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>You'll see notifications here when you receive them</Text>
        </View>
      ) : (
      <FlatList
          data={notifications}
        renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id || item.id}
        contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading && currentPage === 1} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading && currentPage > 1 ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#a95eff" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
      />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  markAllReadText: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#34344A',
    backgroundColor: '#18171D',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardRowMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarBorder: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#34344A',
    overflow: 'hidden',
  },
  avatarInner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContentMain: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  budgetLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  budgetValue: {
    color: '#C6C5ED',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  genreRow: {
    marginBottom: 2,
  },
  genreLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '400',
  },
  genreValue: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
  },
  guestListLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '400',
  },
  guestUser: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#A084E8',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  starRating: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rejectButtonGuest: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#A084E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins',
  },
  rejectButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  rejectButtonTextGuest: {
    color: '#A084E8',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  placeholderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  notificationItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#18171D',
    borderWidth: 1,
    borderColor: '#34344A',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: 'rgba(169, 94, 255, 0.1)',
    borderColor: '#a95eff',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(169, 94, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    color: '#C6C5ED',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationBody: {
    color: '#A6A6A6',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#666',
    fontSize: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#a95eff',
    marginLeft: 8,
    alignSelf: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#A6A6A6',
    fontSize: 14,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#C6C5ED',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#A6A6A6',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    color: '#A6A6A6',
    fontSize: 12,
    marginLeft: 8,
  },
  buttonRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 6,
    marginBottom: 0,
  },
  acceptButtonCompact: {
    flex: 1,
    height: 28,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 6,
  },
  rejectButtonCompact: {
    flex: 1,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonGradientCompact: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  buttonTextCompact: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  rejectButtonTextCompact: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 13,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});

export default ArtistNotificationScreen; 