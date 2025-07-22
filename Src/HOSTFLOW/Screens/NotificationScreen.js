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
  Dimensions,   
  Platform,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../Redux/slices/notificationSlice';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 8),
    md: Math.max(width * 0.03, 12),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  fontSize: {
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.055, 22),
  },
  iconSize: Math.max(width * 0.06, 20),
  cardRadius: Math.max(width * 0.04, 16),
};

const NotificationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { notifications, loading, hasMore, currentPage } = useSelector(state => state.notifications);
  const unreadDotAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
    Animated.loop(
      Animated.sequence([
        Animated.timing(unreadDotAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(unreadDotAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ])
    ).start();
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

  // Add this function to handle notification press and navigation
  const handleNotificationPress = (notification) => {
    // Mark as read first
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Handle different notification types
    switch (notification.type) {
      case 'chat_message':
      case 'price_proposal':
      case 'price_approved':
        // Navigate to negotiation/chat screen
        if (notification.data?.chatId) {
          navigation.navigate('HostNegotiationAvailable', {
            chatId: notification.data.chatId,
            eventId: notification.data.eventId,
          });
        }
        break;
      case 'event_invitation':
        // Optionally, navigate to event details if needed
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
      {/* Gradient Background */}
      <LinearGradient
        colors={["#181828", "#23233a", "#B15CDE11"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Sticky Header */}
      <View style={[styles.header, {
        paddingTop: Platform.OS === 'ios' ? dimensions.spacing.xl : dimensions.spacing.lg,
        paddingBottom: dimensions.spacing.lg,
        paddingHorizontal: dimensions.spacing.lg,
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(18,18,18,0.98)',
        borderBottomWidth: 1,
        borderBottomColor: '#C6C5ED',
      }]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: dimensions.spacing.sm }}>
          <Icon name="arrow-left" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { fontSize: dimensions.fontSize.header }]}
          numberOfLines={2} ellipsizeMode="tail">Notification</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} style={{ padding: dimensions.spacing.sm }}>
            <Text style={styles.markAllReadText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>
      {/* Notifications List */}
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: Math.max(dimensions.spacing.lg, 16),
          paddingBottom: dimensions.spacing.xl * 2,
          paddingTop: 8,
        }}
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
        showsVerticalScrollIndicator={false}
      >
        {loading && currentPage === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#683BFC" />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="bell-off" size={dimensions.iconSize * 2.2} color="#A6A6A6" />
            <Text style={[styles.emptyText, { fontSize: dimensions.fontSize.large }]}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>You'll see notifications here when you receive them</Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <TouchableOpacity
              key={notification._id || index}
              activeOpacity={0.88}
              style={[
                styles.notificationItem,
                {
                  borderRadius: dimensions.cardRadius,
                  padding: Math.max(dimensions.spacing.lg, 16),
                  marginBottom: Math.max(dimensions.spacing.md, 10),
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.13,
                  shadowRadius: 12,
                  elevation: 4,
                  backgroundColor: notification.isRead ? 'rgba(252,252,253,0.04)' : 'rgba(177,92,222,0.08)',
                  borderColor: notification.isRead ? '#34344A' : '#B15CDE',
                },
              ]}
              onPress={() => handleNotificationPress(notification)}
            >
              <LinearGradient
                colors={notification.isRead ? ["#181828", "#23233a"] : ["#B15CDE33", "#7952FC33"]}
                style={{
                  borderRadius: 32,
                  padding: 2,
                  marginRight: Math.max(dimensions.spacing.md, 10),
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: dimensions.iconSize * 2.1,
                  height: dimensions.iconSize * 2.1,
                  alignSelf: 'flex-start',
                }}
              >
                <View style={styles.notificationIconContainer}>
                  <Icon
                    name={getNotificationIcon(notification.type)}
                    size={dimensions.iconSize}
                    color={getNotificationColor(notification.type)}
                  />
                </View>
              </LinearGradient>
              <View style={styles.notificationContent}>
                <Text style={[styles.notificationTitle, { fontSize: dimensions.fontSize.title, marginBottom: 2 }]} numberOfLines={2}>{notification.title}</Text>
                <Text style={[styles.notificationBody, { fontSize: dimensions.fontSize.body, marginBottom: 2 }]} numberOfLines={3}>{notification.body}</Text>
                <Text style={[styles.notificationTime, { fontSize: dimensions.fontSize.small }]}>{formatDate(notification.createdAt)}</Text>
              </View>
              {!notification.isRead && (
                <Animated.View
                  style={[
                    styles.unreadDot,
                    {
                      opacity: unreadDotAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
                      transform: [{ scale: unreadDotAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.3] }) }],
                    },
                  ]}
                />
              )}
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
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(18,18,18,0.98)',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    zIndex: 10,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
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
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(252,252,253,0.04)',
    borderWidth: 1,
    borderColor: '#34344A',
  },
  unreadNotification: {
    backgroundColor: 'rgba(104, 59, 252, 0.1)',
    borderColor: '#683BFC',
  },
  notificationIconContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    backgroundColor: 'rgba(104, 59, 252, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 8,
  },
  notificationTitle: {
    color: '#C6C5ED',
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationBody: {
    color: '#A6A6A6',
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    color: '#666',
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
