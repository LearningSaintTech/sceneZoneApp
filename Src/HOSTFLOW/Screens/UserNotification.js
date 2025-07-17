import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../Redux/slices/notificationSlice';

const notificationsToday = [
  {
    id: '1',
    title: 'Event Booked Successfully',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '25 Oct 2024',
    time: '11:31 AM',
  },
   {
    id: '2',
    title: '3 more days until WJNC #9 starts!',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '15 Oct 2024',
    time: '9:30 AM',
  },
   {
    id: '3',
    title: 'Event Review Request',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '10 Oct 2024',
    time: '09:43 AM',
  },
    {
    id: '4',
    title: 'Event Booked Successfully',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '9 Oct 2024',
    time: '10:10 AM',
  },
];

const notificationsYesterday = [
   {
    id: '5',
    title: 'Event Review Request',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '10 Oct 2024',
    time: '09:43 AM',
  },
    {
    id: '6',
    title: 'Event Booked Successfully',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '9 Oct 2024',
    time: '10:10 AM',
  },
];

const NotificationItem = ({ title, description, date, time }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationIconContainer}>
      <Ionicons name="notifications-outline" size={24} color="#a95eff" />
    </View>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
      <Text style={styles.notificationTimestamp}>{date} • {time}</Text>
    </View>
  </View>
);

const UserNotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, loading, hasMore, currentPage, unreadCount } = useSelector(state => state.notifications);

  useEffect(() => {
    // Fetch notifications on component mount
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchNotifications({ page: currentPage + 1, limit: 20 }));
    }
  };

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'TODAY';
    } else if (diffDays === 2) {
      return 'YESTERDAY';
    } else {
      return date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        return 'chatbubble-outline';
      case 'event_invitation':
        return 'calendar-outline';
      case 'booking_confirmed':
      case 'payment_received':
        return 'checkmark-circle-outline';
      default:
        return 'notifications-outline';
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
      default:
        return '#a95eff';
    }
  };

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const dateGroup = formatDate(notification.createdAt);
    if (!groups[dateGroup]) {
      groups[dateGroup] = [];
    }
    groups[dateGroup].push(notification);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.newButton}>
            <Text style={styles.newButtonText}>{unreadCount} NEW</Text>
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
          <Ionicons name="notifications-off-outline" size={48} color="#A6A6A6" />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>You'll see notifications here when you receive them</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading && currentPage === 1} onRefresh={handleRefresh} />
          }
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const paddingToBottom = 20;
            if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
            <View key={dateGroup}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{dateGroup}</Text>
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text style={styles.markAsReadText}>Mark all as read</Text>
                </TouchableOpacity>
              </View>
              {groupNotifications.map((notification, index) => (
                <TouchableOpacity
                  key={notification._id || index}
                  style={[
                    styles.notificationItem,
                    !notification.isRead && styles.unreadNotification
                  ]}
                  onPress={() => handleMarkAsRead(notification._id)}
                >
                  <View style={styles.notificationIconContainer}>
                    <Ionicons 
                      name={getNotificationIcon(notification.type)} 
                      size={24} 
                      color={getNotificationColor(notification.type)} 
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationDescription}>{notification.body}</Text>
                    <Text style={styles.notificationTimestamp}>
                      {new Date(notification.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                  {!notification.isRead && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          {loading && currentPage > 1 && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#a95eff" />
              <Text style={styles.loadingMoreText}>Loading more...</Text>
            </View>
          )}
        </ScrollView>
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
    paddingTop:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  newButton: {
    backgroundColor: '#a95eff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  newButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a', // Slightly lighter dark for section header
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  markAsReadText: {
    fontSize: 14,
    color: '#a95eff',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333', // Dark circle background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
  },
  unreadNotification: {
    backgroundColor: 'rgba(169, 94, 255, 0.1)',
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
    color: '#fff',
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
});

export default UserNotificationScreen; 