import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, toggleFavorite, setFavorites, setLoading, setError } from '../Redux/slices/favoritesSlice';
import { selectIsLoggedIn, selectUserData } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native/Libraries/Animated/Animated';
import HapticFeedback from 'react-native-haptic-feedback';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

// Responsive dimensions system for all Android devices
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
    xxxl: Math.max(width * 0.08, 32),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  navIconSize: Math.max(width * 0.065, 24),
  emptyIconSize: Math.max(width * 0.16, 64),
  cardImageHeight: Math.max(height * 0.25, 200),
  headerHeight: Math.max(height * 0.08, 60),
};

// MusicBeatsLoader: Animated music bars loader
const MusicBeatsLoader = () => {
  const barAnims = [useRef(new Animated.Value(1)).current, useRef(new Animated.Value(1)).current, useRef(new Animated.Value(1)).current];

  useEffect(() => {
    console.log('MusicBeatsLoader: Starting animations');
    const animations = barAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.8,
            duration: 300,
            useNativeDriver: false,
            delay: i * 100,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
            delay: 0,
          }),
        ])
      )
    );
    animations.forEach(anim => anim.start());
    return () => {
      console.log('MusicBeatsLoader: Stopping animations');
      animations.forEach(anim => anim.stop());
    };
  }, [barAnims]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 28, marginVertical: 8 }}>
      {barAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: anim.interpolate({ inputRange: [1, 1.8], outputRange: [14, 24] }),
            backgroundColor: '#a95eff',
            borderRadius: 3,
            marginHorizontal: 3,
          }}
        />
      ))}
    </View>
  );
};

const UserFavoriteScreen = ({ navigation }) => {
  console.log('UserFavoriteScreen: Component mounted');
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const favoritesLoading = useSelector(state => state.favorites.loading);
  const favoritesError = useSelector(state => state.favorites.error);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector(state => state.auth.token);
  const userData = useSelector(selectUserData);
  const insets = useSafeAreaInsets();

  // State for fetched favorite events
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  console.log('UserFavoriteScreen: Initial state', { favoriteEvents, favorites, isLoggedIn, token: !!token });

  // Fetch favorite events from API
  useEffect(() => {
    console.log('UserFavoriteScreen: useEffect for fetching favorites triggered', { isLoggedIn, token });
    const fetchFavorites = async () => {
      if (!isLoggedIn || !token) {
        console.log('UserFavoriteScreen: User not logged in or no token, clearing favorites');
        setFavoriteEvents([]);
        dispatch(setFavorites({}));
        return;
      }

      console.log('UserFavoriteScreen: Fetching favorite events from API');
      dispatch(setLoading(true));
      try {
        const response = await api.get('/user/get-favourite-events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('UserFavoriteScreen: Fetch favorites response', {
          status: response.status,
          data: response.data,
        });

        if (response.data && response.data.success && response.data.data) {
          const events = response.data.data.map(item => ({
            id: item.eventId._id, // Adjusted to use _id from nested eventId object
            title: item.eventId.eventName || 'Untitled Event',
            location: item.eventId.location || 'Unknown Location',
            image: item.eventId.posterUrl ? { uri: item.eventId.posterUrl } : require('../assets/Images/fff.jpg'),
            price: item.eventId.ticketSetting?.ticketType === 'free'
              ? 'Free'
              : item.eventId.ticketSetting?.price
                ? `₹${item.eventId.ticketSetting.price} - ₹${item.eventId.ticketSetting.price + 100}`
                : 'Price TBD',
          }));
          console.log('UserFavoriteScreen: Mapped favorite events', events);
          setFavoriteEvents(events);

          const favoriteMap = response.data.data.reduce((acc, item) => {
            acc[item.eventId._id] = true;
            return acc;
          }, {});
          console.log('UserFavoriteScreen: Updating Redux favorites', favoriteMap);
          dispatch(setFavorites(favoriteMap));
        } else {
          console.error('UserFavoriteScreen: Invalid response data from favorites API', response.data);
          dispatch(setError('Invalid response data from favorites API'));
        }
      } catch (err) {
        console.error('UserFavoriteScreen: Error fetching favorite events', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        dispatch(setError(err.message || 'Failed to fetch favorite events'));
      } finally {
        console.log('UserFavoriteScreen: Setting loading to false');
        dispatch(setLoading(false));
      }
    };
    fetchFavorites();
  }, [isLoggedIn, token, dispatch]);

  // Handle favorite toggle with API
  const handleFavoriteToggle = async (eventId) => {
    console.log('UserFavoriteScreen: handleFavoriteToggle called', { eventId, isFavorite: favorites[eventId] });
    if (!isLoggedIn) {
      console.log('UserFavoriteScreen: User not logged in, navigating to UserSignup');
      try {
        HapticFeedback.trigger('impactMedium', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      } catch (e) {
        console.error('UserFavoriteScreen: Haptic feedback error', e);
      }
      navigation.navigate('UserSignup');
      return;
    }

    try {
      HapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
      console.log('UserFavoriteScreen: Haptic feedback triggered');
      dispatch(setLoading(true));
      const isFavorite = favorites[eventId];
      if (isFavorite) {
        console.log('UserFavoriteScreen: Removing favorite event', eventId);
        const response = await api.delete(`/user/remove-favourite-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('UserFavoriteScreen: Remove favorite response', {
          status: response.status,
          data: response.data,
        });
        if (response.data.success) {
          console.log('UserFavoriteScreen: Dispatching toggleFavorite for removal', eventId);
          dispatch(toggleFavorite(eventId));
          console.log('UserFavoriteScreen: Updating favoriteEvents state after removal');
          setFavoriteEvents(prev => prev.filter(event => event.id !== eventId));
        } else {
          console.error('UserFavoriteScreen: Failed to remove favorite event', response.data);
          dispatch(setError(response.data.message || 'Failed to remove favorite event'));
        }
      } else {
        console.log('UserFavoriteScreen: Adding favorite event', eventId);
        const response = await api.post(
          '/user/add-favourite-event',
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('UserFavoriteScreen: Add favorite response', {
          status: response.status,
          data: response.data,
        });
        if (response.data.success) {
          console.log('UserFavoriteScreen: Dispatching toggleFavorite for addition', eventId);
          dispatch(toggleFavorite(eventId));
          console.log('UserFavoriteScreen: Fetching event details for addition');
          const event = response.data.data;
          const newEvent = {
            id: event.eventId._id,
            title: event.eventId.eventName || 'Untitled Event',
            location: event.eventId.location || 'Unknown Location',
            image: event.eventId.posterUrl ? { uri: event.eventId.posterUrl } : require('../assets/Images/fff.jpg'),
            price: event.eventId.ticketSetting?.ticketType === 'free'
              ? 'Free'
              : event.eventId.ticketSetting?.price
                ? `₹${event.eventId.ticketSetting.price} - ₹${event.eventId.ticketSetting.price + 100}`
                : 'Price TBD',
          };
          console.log('UserFavoriteScreen: Adding new event to favoriteEvents', newEvent);
          setFavoriteEvents(prev => [...prev, newEvent]);
        } else {
          console.error('UserFavoriteScreen: Failed to add favorite event', response.data);
          dispatch(setError(response.data.message || 'Failed to add favorite event'));
        }
      }
    } catch (error) {
      console.error('UserFavoriteScreen: Error updating favorite', {
        eventId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      dispatch(setError(error.message || 'Failed to update favorite'));
    } finally {
      console.log('UserFavoriteScreen: Setting loading to false after toggle');
      dispatch(setLoading(false));
    }
  };

  // Log state changes
  useEffect(() => {
    console.log('UserFavoriteScreen: favorites state changed', favorites);
  }, [favorites]);

  useEffect(() => {
    console.log('UserFavoriteScreen: favoriteEvents state changed', favoriteEvents);
  }, [favoriteEvents]);

  useEffect(() => {
    console.log('UserFavoriteScreen: favoritesLoading state changed', favoritesLoading);
  }, [favoritesLoading]);

  useEffect(() => {
    console.log('UserFavoriteScreen: favoritesError state changed', favoritesError);
  }, [favoritesError]);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('UserFavoriteScreen: Back button pressed');
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={dimensions.navIconSize} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={{ width: dimensions.navIconSize }} />
      </View>

      {favoritesLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MusicBeatsLoader />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading favorites...</Text>
        </View>
      ) : favoritesError ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ff4444', marginTop: 10, fontSize: dimensions.fontSize.body }}>
            Error: {favoritesError}
          </Text>
        </View>
      ) : favoriteEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIconContainer}>
            <Ionicons name="heart-outline" size={dimensions.emptyIconSize} color="#555" />
          </View>
          <View style={styles.emptyStateTextContainer}>
            <Text style={styles.emptyStateText}>No favorites yet</Text>
            <Text style={styles.emptyStateSubText}>
              Add events to your favorites by tapping the heart icon
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView 
          style={styles.content}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
          showsVerticalScrollIndicator={false}
        >
          {favoriteEvents.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <LinearGradient
                colors={['#B15CDE', '#7952FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.eventCardGradient}
              />
              <View style={styles.eventCardContent}>
                <Image
                  source={event.image}
                  style={styles.eventImage}
                  resizeMode="cover"
                  onLoad={() => console.log('UserFavoriteScreen: Image loaded for event', event.id)}
                  onError={(e) => console.error('UserFavoriteScreen: Image load error', { eventId: event.id, error: e.nativeEvent.error })}
                />
                <View style={styles.imageOverlay} />
                <View style={styles.heartIconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('UserFavoriteScreen: Heart icon pressed for event', event.id);
                      handleFavoriteToggle(event.id);
                    }}
                    style={styles.heartIconButton}
                  >
                    <Ionicons name="heart" size={dimensions.navIconSize} color="#ff4444" />
                  </TouchableOpacity>
                </View>
                <View style={styles.eventDetails}>
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('UserFavoriteScreen: Navigating to UserFormBookingScreen with event', event);
                      navigation.navigate('UserFormBookingScreen', { eventDetails: event });
                    }}
                    style={styles.eventDetailsTouchable}
                  >
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.price && (
                      <Text style={styles.eventPrice}>{event.price}</Text>
                    )}
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
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
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: '#333',
    minHeight: dimensions.headerHeight,
  },
  backButton: {
    minWidth: dimensions.buttonHeight,
    minHeight: dimensions.buttonHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: dimensions.spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Math.max(height * 0.15, 100),
    paddingHorizontal: dimensions.spacing.xl,
  },
  emptyStateIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensions.spacing.xl,
  },
  emptyStateTextContainer: {
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: dimensions.fontSize.large,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: dimensions.spacing.sm,
  },
  emptyStateSubText: {
    fontSize: dimensions.fontSize.body,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: Math.max(dimensions.fontSize.body + 4, 18),
    paddingHorizontal: dimensions.spacing.xl,
  },
  eventCard: {
    marginBottom: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventCardContent: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: dimensions.cardImageHeight,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  heartIconContainer: {
    position: 'absolute',
    top: dimensions.spacing.lg,
    right: dimensions.spacing.lg,
    zIndex: 2,
  },
  heartIconButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.sm,
    minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: dimensions.spacing.lg,
    zIndex: 2,
  },
  eventDetailsTouchable: {
    width: '100%',
    minHeight: Math.max(dimensions.buttonHeight * 1.5, 60),
    justifyContent: 'flex-end',
  },
  eventTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: dimensions.spacing.xs,
    lineHeight: Math.max(dimensions.fontSize.header + 2, 20),
  },
  eventPrice: {
    fontSize: dimensions.fontSize.body,
    color: '#a95eff',
    marginBottom: dimensions.spacing.xs,
    fontWeight: '600',
  },
  eventLocation: {
    fontSize: dimensions.fontSize.body,
    color: '#aaa',
    lineHeight: Math.max(dimensions.fontSize.body + 2, 16),
  },
});

export default UserFavoriteScreen; 