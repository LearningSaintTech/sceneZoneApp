import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../Redux/slices/notificationSlice';

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, loading, hasMore, currentPage } = useSelector(state => state.notifications);

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
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        return '#683BFC';
      case 'event_invitation':
        return '#FF9500';
      case 'booking_confirmed':
      case 'payment_received':
        return '#34C759';
      default:
        return '#A6A6A6';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">Notification</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Notifications List */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
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
        {loading && currentPage === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#683BFC" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={48} color="#A6A6A6" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You'll see notifications here when you receive them</Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification._id || index}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification
              ]}
              onPress={() => handleMarkAsRead(notification._id)}
            >
              <View style={styles.notificationIconContainer}>
                <Icon 
                  name={getNotificationIcon(notification.type)} 
                  size={20} 
                  color={getNotificationColor(notification.type)} 
                />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationBody}>{notification.body}</Text>
                <Text style={styles.notificationTime}>{formatDate(notification.createdAt)}</Text>
            </View>
              {!notification.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
          ))
        )}

        {loading && currentPage > 1 && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#683BFC" />
            <Text style={styles.loadingMoreText}>Loading more...</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    marginLeft: 16,
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
  },
  markAllReadText: {
    color: '#683BFC',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  notificationCard: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 16,
    backgroundColor: '#F6F8FA',
    marginBottom: 16,
    marginTop:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  budget: {
    color: '#A6A6A6',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  genre: {
    color: '#A6A6A6',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
  },
  bold: {
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 6,
  },
  date: {
    color: '#ccc',
    fontSize: 11,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  acceptedButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34C759',
    backgroundColor: '#34C759',
    marginTop: 10,
    flexDirection: 'row',
  },
  acceptedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(252,252,253,0.04)',
    borderWidth: 1,
    borderColor: '#34344A',
  },
  unreadNotification: {
    backgroundColor: 'rgba(104, 59, 252, 0.1)',
    borderColor: '#683BFC',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(104, 59, 252, 0.1)',
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
    backgroundColor: '#683BFC',
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
});

export default NotificationScreen;
