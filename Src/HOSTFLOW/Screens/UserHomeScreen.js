import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  Easing,
  Modal,
  TextInput,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, setFavorites, setLoading, setError } from '../Redux/slices/favoritesSlice';
import { selectIsLoggedIn, selectUserData } from '../Redux/slices/authSlice';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaskedView from '@react-native-masked-view/masked-view';
import Scenezone from '../assets/icons/Scenezone';
import Spotlight from '../assets/icons/Spotlight';
import Sports from '../assets/icons/Sports';
import Party from '../assets/icons/Party';
import Events from '../assets/icons/Events';
import Comedy from '../assets/icons/Comedy';
import Workshop from '../assets/icons/Workshop';
import SportsBanner from '../assets/Banners/Sports';
import MusicBanner from '../assets/Banners/Music';
import EventsBanner from '../assets/Banners/Events';
import ComedyBanner from '../assets/Banners/Comdy';
import WorkshopBanner from '../assets/Banners/Workshop';
import Plan1 from '../assets/Banners/plan1';
import Plan2 from '../assets/Banners/plan2';
import Plan3 from '../assets/Banners/plan3';
import SearchIcon from '../assets/icons/search';
import NotiIcon from '../assets/icons/Noti';
import ArrowIcon from '../assets/icons/arrow';
import HapticFeedback from 'react-native-haptic-feedback';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
const isTablet = width >= 768;
const isSmallPhone = width < 350;
const scale = width / 375;

const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 6),
    md: Math.max(width * 0.03, 10),
    lg: Math.max(width * 0.04, 14),
    xl: Math.max(width * 0.05, 18),
    xxl: Math.max(width * 0.06, 20),
    xxxl: Math.max(width * 0.08, 28),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.06, 22),
  },
  borderRadius: {
    xs: Math.max(width * 0.005, 2),
    sm: Math.max(width * 0.01, 4),
    md: Math.max(width * 0.02, 8),
    lg: Math.max(width * 0.03, 12),
    xl: Math.max(width * 0.04, 16),
    xxl: Math.max(width * 0.05, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  navIconSize: Math.max(width * 0.055, 20),
  cardWidth: Math.min(width * 0.8, isTablet ? 400 : 320),
  imageHeight: Math.max(height * 0.25, 180),
  categoryCardHeight: Math.max(height * 0.12, 100),
  exploreCardHeight: Math.min(height * 0.65, 520),
  logoHeight: Math.max(height * 0.06, 40),
  bottomNavHeight: 48,
};

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const triggerHaptic = (type) => {
  try {
    HapticFeedback.trigger(type, hapticOptions);
  } catch (error) {
    // Silently fail
  }
};

// MusicBeatsLoader: Animated music bars loader
const MusicBeatsLoader = () => {
  const barAnims = [useRef(new Animated.Value(1)).current, useRef(new Animated.Value(1)).current, useRef(new Animated.Value(1)).current];

  useEffect(() => {
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
    return () => animations.forEach(anim => anim.stop());
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

// Custom Plan For Button Component
const PlanForButton = ({ type, onPress, isActive }) => {
  const getButtonConfig = () => {
    switch (type) {
      case 'today':
        return {
          text: 'TODAY',
          indicatorColor: '#8B5CF6',
          borderColor: '#8B5CF6'
        };
      case 'thisWeek':
        return {
          text: 'THIS WEEK',
          indicatorColor: '#06B6D4',
          borderColor: '#06B6D4'
        };
      case 'weekend':
        return {
          text: 'WEEKEND',
          indicatorColor: '#10B981',
          borderColor: '#10B981'
        };
      default:
        return {
          text: 'Events',
          indicatorColor: '#4A90E2',
          borderColor: '#4A90E2'
        };
    }
  };

  const config = getButtonConfig();

  return (
    <TouchableOpacity
      style={[styles.calendarPlanForButton, {
        borderColor: config.borderColor,
        backgroundColor: isActive ? config.indicatorColor : '#1a1a1a'
      }]}
      onPress={onPress}
    >
      <View style={styles.calendarIndicators}>
        <View style={[styles.calendarDot, { backgroundColor: config.indicatorColor }]} />
        <View style={[styles.calendarDot, { backgroundColor: config.indicatorColor }]} />
      </View>
      <View style={styles.calendarButtonContent}>
        <Text style={[styles.calendarPlanForButtonText, { color: isActive ? '#fff' : '#C6C5ED' }]}>{config.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Custom Category Nav Icon Component
const CategoryNavIcon = ({ type, isActive = false }) => {
  const getIconConfig = () => {
    switch (type) {
      case 'spotlight':
        return { component: Spotlight };
      case 'sports':
        return { component: Sports };
      case 'party':
        return { component: Party };
      case 'events':
        return { component: Events };
      case 'comedy':
        return { component: Comedy };
      case 'workshop':
        return { component: Workshop };
      default:
        return { component: Events };
    }
  };

  const config = getIconConfig();
  const IconComponent = config.component;

  return (
    <IconComponent
      width={24}
      height={24}
      fill={isActive ? '#B15CDE' : '#fff'}
    />
  );
};

const UserHomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scrollX = useRef(new Animated.Value(0)).current;
  const snapToInterval = dimensions.cardWidth + dimensions.spacing.lg;
  const insets = useSafeAreaInsets();

  // State for loading and events
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [events, setEvents] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [exploreEvents, setExploreEvents] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);

  // Get isLoggedIn, userData, and token from Redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUserData);
  const token = useSelector(state => state.auth.token);
  const favorites = useSelector(state => state.favorites.favorites);
  const favoritesLoading = useSelector(state => state.favorites.loading);
  const favoritesError = useSelector(state => state.favorites.error);

  // State for fetched profile
  const [profile, setProfile] = useState({ name: 'Guest User', location: 'Noida' });

  // Fetch user profile from API (requires token)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setProfile({ name: 'Guest User', location: 'Noida' });
        return;
      }
      try {
        const response = await api.get('/user/get-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success && response.data.data) {
          const data = response.data.data;
          setProfile({
            name: data.fullName || data.name || 'Guest User',
            location: data.address || data.location || 'Noida',
          });
        } else {
          console.error('Error fetching profile: Invalid response data', response.data);
          setProfile({ name: 'Guest User', location: 'Noida' });
        }
      } catch (err) {
        console.error('Error fetching profile:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setProfile({ name: 'Guest User', location: 'Noida' });
      }
    };
    fetchProfile();
  }, [token]);

  // Fetch favorite events from API (no token required, but still check isLoggedIn for consistency)
  useEffect(() => {
    const fetchFavorites = async () => {
      dispatch(setLoading(true));
      try {
        const config = isLoggedIn && token ? {
          headers: { Authorization: `Bearer ${token}` },
        } : {};
        const response = await api.get('/user/get-favourite-events', config);
        if (response.data && response.data.success && response.data.data) {
          const favoriteEvents = response.data.data.reduce((acc, item) => {
            acc[item.eventId] = true;
            return acc;
          }, {});
          dispatch(setFavorites(favoriteEvents));
        } else {
          dispatch(setFavorites({})); // Set empty favorites if no data
        }
      } catch (err) {
        // console.error('Error fetching favorite events:', {
        //   status: err.response?.status,
        //   data: err.response?.data,
        //   message: err.message,
        // });
        dispatch(setFavorites({})); // Set empty favorites on error
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchFavorites();
  }, [dispatch, isLoggedIn, token]);

  // Fetch events from search API (no token required)
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const response = await api.post('/user/event/search', { keyword: searchKeyword }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        console.log('response.data.dataaaaaaaaa', response.data.data)
        if (response.data && response.data.success && response.data.data) {
          const formattedEvents = response.data.data.map(event => ({
            ...event,
            isFavorite: !!favorites[event._id],
          }));
          setEvents(formattedEvents);
        } else {
          console.error('Error fetching events: Invalid response data', response.data);
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        setEvents([]);
      }
      setIsLoadingEvents(false);
    };
    fetchEvents();
  }, [searchKeyword, favorites]);

  // Fetch latest events from API (no token required)
  useEffect(() => {
    const fetchLatestEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const response = await api.post('/user/event/latest', { limit: 10 }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (response.data && response.data.success && response.data.data) {
          const formattedEvents = response.data.data.map((event) => {
            const earliestDate = event.eventDateTime && event.eventDateTime.length > 0
              ? new Date(event.eventDateTime.reduce((earliest, curr) =>
                new Date(curr) < new Date(earliest) ? curr : earliest
              ))
              : null;
            const dateMonth = earliestDate ? earliestDate.toLocaleString('en-US', { month: 'short' }) : 'N/A';
            const dateDay = earliestDate ? earliestDate.getDate().toString().padStart(2, '0') : 'N/A';
            const price = event.ticketSetting.ticketType === 'free'
              ? 'Free'
              : `₹${event.ticketSetting.price || 0} - ₹${(event.ticketSetting.price || 0) + 100}`;
            return {
              id: event._id,
              image: { uri: event.posterUrl },
              dateMonth,
              dateDay,
              title: event.eventName,
              price,
              location: event.location,
              eventId: event._id,
              isFavorite: !!favorites[event._id],
              hasGuestListButton: false,
            };
          });
          setLatestEvents(formattedEvents);
        } else {
          console.error('Error fetching latest events: Invalid response data', response.data);
          setLatestEvents([]);
        }
      } catch (err) {
        console.error('Error fetching latest events:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        setLatestEvents([]);
      }
      setIsLoadingEvents(false);
    };
    fetchLatestEvents();
  }, [favorites]);

  // Fetch explore events from filter API (no token required)
  useEffect(() => {
    const fetchExploreEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const payload = {};
        if (activeFilter) {
          const filterMap = {
            'Nearby': 'nearby',
            'Today': 'today',
            'This Week': 'this week',
            'This Weekend': 'this weekend',
            'Next Weekend': 'next weekend',
            'Tickets less than ₹1000': 'ticket less than 1000',
            '₹1000 - ₹5000': '1000-5000',
            '₹5000+': '5000+',
          };
          payload.dateFilter = filterMap[activeFilter] || activeFilter.toLowerCase();
          if (activeFilter.includes('km') || activeFilter === 'Nearby') {
            payload.location = profile.location;
            const radiusMap = {
              '1km-3km': 3,
              '3km-5km': 5,
              '5km+': 10,
              'Nearby': 50,
            };
            payload.radius = radiusMap[activeFilter] || 50;
          }
        }
        if (activeCategory) {
          payload.genre = activeCategory.toLowerCase();
        }
        const response = await api.post('/user/event/filter', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        if (response.data && response.data.success && response.data.data) {
          const formattedEvents = response.data.data.map((event) => {
            const earliestDate = event.eventDateTime && event.eventDateTime.length > 0
              ? new Date(event.eventDateTime.reduce((earliest, curr) =>
                new Date(curr) < new Date(earliest) ? curr : earliest
              ))
              : null;
            const dateMonth = earliestDate ? earliestDate.toLocaleString('en-US', { month: 'short' }) : 'N/A';
            const dateDay = earliestDate ? earliestDate.getDate().toString().padStart(2, '0') : 'N/A';
            const price = event.ticketSetting.ticketType === 'free'
              ? 'Free'
              : `₹${event.ticketSetting.price || 0} - ₹${(event.ticketSetting.price || 0) + 100}`;
            return {
              id: event._id,
              image: { uri: event.posterUrl },
              dateMonth,
              dateDay,
              title: event.eventName,
              price,
              location: event.location,
              eventId: event._id,
              isFavorite: !!favorites[event._id],
              hasGuestListButton: false,
            };
          });
          setExploreEvents(formattedEvents);
        } else {
          console.error('Error fetching explore events: Invalid response data', response.data);
          setExploreEvents([]);
        }
      } catch (err) {
        console.error('Error fetching explore events:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        setExploreEvents([]);
      }
      setIsLoadingEvents(false);
    };
    fetchExploreEvents();
  }, [activeFilter, activeCategory, favorites, profile.location]);

  // Handle search submission
  const handleSearch = async () => {
    setIsLoadingEvents(true);
    setShowSearchBar(false);
    Keyboard.dismiss();
    try {
      const response = await api.post(
        '/user/event/search',
        { keyword: searchKeyword.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );
      if (response.data && response.data.success && response.data.data) {
        const formattedEvents = response.data.data.map(event => ({
          ...event,
          isFavorite: !!favorites[event._id],
        }));
        setEvents(formattedEvents);
      } else {
        console.error('Error searching events: Invalid response data', response.data);
        setEvents([]);
      }
    } catch (err) {
      console.error('Error searching events:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config,
      });
      setEvents([]);
    }
    setIsLoadingEvents(false);
  };

  // Handle filter submission
  const handleFilter = async () => {
    setIsLoadingEvents(true);
    try {
      const payload = {};
      if (selected.filter) {
        const filterMap = {
          'Near - Far': 'nearby',
          'Far - Near': 'nearby',
          'Today': 'today',
          'This Week': 'this week',
          'This Weekend': 'this weekend',
          'Next Weekend': 'next weekend',
          '1km-3km': 'nearby',
          '3km-5km': 'nearby',
          '5km+': 'nearby',
        };
        payload.dateFilter = filterMap[selected.filter] || selected.filter.toLowerCase();
      }
      if (selected.price) {
        const priceMap = {
          'Tickets under ₹1000': 'ticket less than 1000',
          '₹1000-₹2000': '1000-5000',
          '₹2000-₹3000': '1000-5000',
          '₹3000+': '5000+',
        };
        payload.priceRange = priceMap[selected.price] || selected.price.toLowerCase();
      }
      if (selected.instrument) {
        payload.genre = selected.instrument.toLowerCase();
      }
      if (selected.type) {
        payload.genre = selected.type.toLowerCase();
      }
      if (profile.location && (selected.filter.includes('km') || selected.filter === 'Near - Far' || selected.filter === 'Far - Near')) {
        payload.location = profile.location;
        const radiusMap = {
          '1km-3km': 3,
          '3km-5km': 5,
          '5km+': 10,
        };
        payload.radius = radiusMap[selected.filter] || 50;
      } else if (profile.location) {
        payload.location = profile.location;
      }
      const response = await api.post('/user/event/filter', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.data && response.data.success && response.data.data) {
        const formattedEvents = response.data.data.map((event) => {
          const earliestDate = event.eventDateTime && event.eventDateTime.length > 0
            ? new Date(event.eventDateTime.reduce((earliest, curr) =>
              new Date(curr) < new Date(earliest) ? curr : earliest
            ))
            : null;
          const dateMonth = earliestDate ? earliestDate.toLocaleString('en-US', { month: 'short' }) : 'N/A';
          const dateDay = earliestDate ? earliestDate.getDate().toString().padStart(2, '0') : 'N/A';
          const price = event.ticketSetting.ticketType === 'free'
            ? 'Free'
            : `₹${event.ticketSetting.price || 0} - ₹${(event.ticketSetting.price || 0) + 100}`;
          return {
            id: event._id,
            image: { uri: event.posterUrl },
            dateMonth,
            dateDay,
            title: event.eventName,
            price,
            location: event.location,
            eventId: event._id,
            isFavorite: !!favorites[event._id],
            hasGuestListButton: false,
          };
        });
        setExploreEvents(formattedEvents);
      } else {
        console.error('Error filtering events: Invalid response data', response.data);
        setExploreEvents([]);
      }
    } catch (err) {
      console.error('Error filtering events:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config,
      });
      setExploreEvents([]);
    }
    setIsLoadingEvents(false);
    setShowFilter(false);
  };

  // Clear filters
  const clearFilters = () => {
    setSelected({
      filter: 'Today',
      price: 'Low - High',
      instrument: 'Acoustic Guitar',
      type: 'Musician',
    });
    setActiveFilter('');
    setActiveCategory('');
    setShowFilter(false);
  };

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    setActiveFilter('');
  };

  // Handle time filter
  const handleTimeFilter = (filter) => {
    setActiveFilter(filter);
    setActiveCategory('');
  };

  // Handle favorite toggle with API
  const handleFavoriteToggle = async (eventId) => {
    if (!isLoggedIn || !token) {
      triggerHaptic('impactMedium');
      navigation.navigate('UserSignup');
      return;
    }

    try {
      triggerHaptic('impactMedium');
      dispatch(setLoading(true));
      const isFavorite = favorites[eventId];
      if (isFavorite) {
        // Remove from favorites
        const response = await api.delete(`/user/remove-favourite-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          dispatch(toggleFavorite(eventId));
        } else {
          dispatch(setError('Failed to remove favorite event'));
        }
      } else {
        // Add to favorites
        const response = await api.post(
          '/user/add-favourite-event',
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          dispatch(toggleFavorite(eventId));
        } else {
          dispatch(setError('Failed to add favorite event'));
        }
      }
      if (typeof jitterFavoriteTab === 'function') {
        jitterFavoriteTab();
      }
    } catch (error) {
      console.error('Error updating favorite:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Notification animation state
  const [hasNotification, setHasNotification] = useState(true);
  const notificationAnim = useRef(new Animated.Value(0)).current;

  // Jiggle animation effect for notification button
  useEffect(() => {
    if (hasNotification) {
      const timer = setTimeout(() => {
        const jitterAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(notificationAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: 0.8, duration: 40, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: -0.8, duration: 40, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: 0.6, duration: 30, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: -0.6, duration: 30, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: 0.4, duration: 25, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: -0.4, duration: 25, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: 0.2, duration: 20, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: -0.2, duration: 20, useNativeDriver: true }),
            Animated.timing(notificationAnim, { toValue: 0, duration: 15, useNativeDriver: true }),
            Animated.delay(2000),
          ]),
          { iterations: -1 }
        );
        jitterAnimation.start();
      }, 5000);
      return () => {
        clearTimeout(timer);
        notificationAnim.stopAnimation();
      };
    }
  }, [hasNotification]);

  const handleFeatureNavigation = (screenName) => {
    if (isLoggedIn) {
      if (screenName === 'ArtistBooking') {
        navigation.navigate('Home');
      } else {
        navigation.navigate(screenName);
      }
    } else {
      navigation.navigate('UserSignup');
    }
  };

  const renderEventCard = ({ item, index }) => {
    const inputRange = [
      (index - 1) * snapToInterval,
      index * snapToInterval,
      (index + 1) * snapToInterval,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const renderMedia = () => {
      if (item.posterUrl) {
        return (
          <Image
            source={{ uri: item.posterUrl }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        );
      }
      return null;
    };

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => navigation.navigate('UserEvent', { eventId: item._id })}>
        <Animated.View
          style={[
            styles.eventCardContainerHorizontalScroll,
            {
              transform: [{ scale }],
              opacity,
            }
          ]}
        >
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.eventCardGradientBackground}
          />
          {renderMedia()}
          <View style={styles.imageOverlay} />
          <TouchableOpacity
            style={styles.heartIconPlaceholder}
            onPress={() => handleFavoriteToggle(item._id)}
          >
            <Ionicons
              name={item.isFavorite ? "heart" : "heart-outline"}
              size={dimensions.navIconSize * 1.25}
              color={item.isFavorite ? "#ff4444" : "#7A7A90"}
            />
          </TouchableOpacity>

          <View style={styles.featuredEventDetailsBottomContainer}>
            <View style={styles.featuredEventTextContainer}>
              <Text style={styles.featuredEventTitle} numberOfLines={1} ellipsizeMode="tail">{item.eventName}</Text>
              <Text style={styles.featuredEventLocationText} numberOfLines={1} ellipsizeMode="tail">{item.venue}</Text>
            </View>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredEventArrowGradientBorder}
            >
              <TouchableOpacity
                style={styles.featuredEventArrowButton}
                onPress={() => navigation.navigate('UserEvent', { eventId: item._id })}
                activeOpacity={0.8}
              >
                <ArrowIcon width={16} height={26} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const featuredEventsScrollRef = useRef(null);

  // Plan For Section Animation
  const planTodayAnim = useRef(new Animated.Value(-200)).current;
  const planWeekendAnim = useRef(new Animated.Value(200)).current;
  const [planSectionY, setPlanSectionY] = useState(0);
  const [planSectionHeight, setPlanSectionHeight] = useState(0);
  const [planAnimated, setPlanAnimated] = useState(false);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    const windowHeight = Dimensions.get('window').height;
    const inView = planSectionY < scrollY + windowHeight - 100 && (planSectionY + planSectionHeight) > scrollY + 100;
    if (inView && !planAnimated) {
      setPlanAnimated(true);
      Animated.parallel([
        Animated.timing(planTodayAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(planWeekendAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!inView && planAnimated) {
      setPlanAnimated(false);
      planTodayAnim.setValue(-200);
      planWeekendAnim.setValue(200);
    }
  };

  const latestEventsScrollRef = useRef(null);
  const latestScrollAnim = useRef(new Animated.Value(0)).current;
  const latestAutoScrollTimeout = useRef(null);
  const latestAutoScrollPaused = useRef(false);

  const startLatestAutoScroll = () => {
    if (latestAutoScrollPaused.current) return;
    const cardWidth = 267;
    const maxScroll = (latestEvents.length * cardWidth) - width;
    if (maxScroll > 0) {
      Animated.loop(
        Animated.timing(latestScrollAnim, {
          toValue: maxScroll,
          duration: 20000,
          useNativeDriver: false,
          easing: Easing.linear,
        })
      ).start();
    }
  };

  const stopLatestAutoScroll = () => {
    latestScrollAnim.stopAnimation();
  };

  const pauseLatestAutoScroll = () => {
    stopLatestAutoScroll();
    latestAutoScrollPaused.current = true;
    if (latestAutoScrollTimeout.current) clearTimeout(latestAutoScrollTimeout.current);
    latestAutoScrollTimeout.current = setTimeout(() => {
      latestAutoScrollPaused.current = false;
      startLatestAutoScroll();
    }, 10000);
  };

  useEffect(() => {
    const id = latestScrollAnim.addListener(({ value }) => {
      if (latestEventsScrollRef.current) {
        latestEventsScrollRef.current.scrollTo({ x: value, animated: false });
      }
    });
    return () => latestScrollAnim.removeListener(id);
  }, [latestScrollAnim]);

  useEffect(() => {
    startLatestAutoScroll();
    return () => {
      stopLatestAutoScroll();
      if (latestAutoScrollTimeout.current) clearTimeout(latestAutoScrollTimeout.current);
    };
  }, [latestEvents.length, width, latestScrollAnim]);

  // Filter modal logic
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState({
    filter: 'Today',
    price: 'Low - High',
    instrument: 'Acoustic Guitar',
    type: 'Musician',
  });
  const filterOptions = {
    filter: ['Near - Far', 'Far - Near', 'Today', 'This Week', 'This Weekend', 'Next Weekend', '1km-3km', '3km-5km', '5km+'],
    price: ['Low - High', 'High - Low', 'Tickets under ₹1000', '₹1000-₹2000', '₹2000-₹3000', '₹3000+'],
    instrument: ['Electric Guitar', 'Saxophone', 'Acoustic Guitar', 'Synthesizer', 'Drum Machine', 'Banjo', 'Trumpet', 'Turntables'],
    type: ['Musician', 'Comedian', 'Magician', 'Anchor', 'Dancer', 'Poet', 'Dj', 'Other'],
  };
  const renderPills = (section) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {filterOptions[section].map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.pillOption,
            selected[section] === option && styles.pillOptionActive,
          ]}
          onPress={() => setSelected((prev) => ({ ...prev, [section]: option }))}
        >
          <Text
            style={[
              styles.pillOptionText,
              selected[section] === option && styles.pillOptionTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const FilterModal = () => (
    <Modal visible={showFilter} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={["#7952FC", "#B15CDE"]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFilter(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#7952FC" />
          </TouchableOpacity>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 0 }}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>FILTER</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('filter')}
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('price')}
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSTRUMENT</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('instrument')}
              </View>
            </View>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>GENRE</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('type')}
              </View>
            </View>
          </ScrollView>
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity
              style={[styles.continueButton, { marginBottom: dimensions.spacing.sm }]}
              onPress={handleFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
              activeOpacity={0.8}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  const LatestEventCard = ({ item, navigation }) => {
    return (
      <TouchableOpacity
        style={styles.latestEventCardContainer}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('UserEvent', { eventId: item.id })}
      >
        <View style={{ flex: 1 }}>
          <Image
            source={item.image}
            style={styles.latestEventImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["rgba(0,0,0,0)", "#000"]}
            locations={[0.5734, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>
        <View style={styles.latestEventDateOverlay}>
          <Text style={styles.latestEventDateMonth}>{item.dateMonth}</Text>
          <Text style={styles.latestEventDateDay}>{item.dateDay}</Text>
        </View>
        <LinearGradient
          colors={['rgba(18,18,18,0.95)', 'rgba(177,92,222,0.85)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.latestEventDetailsContainer}
        >
          <Text style={styles.latestEventTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
          {item.price && <Text style={styles.latestEventPrice} numberOfLines={1} ellipsizeMode="tail">{item.price}</Text>}
          <Text style={styles.latestEventLocation} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      {/* Search Bar Overlay */}
      {showSearchBar && (
        <View style={styles.searchOverlay}>
          <View style={styles.searchOverlayBackground} />
          <View style={styles.searchInputBarAtTop}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              placeholderTextColor="#7A7A90"
              value={searchKeyword}
              onChangeText={setSearchKeyword}
              autoFocus
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={() => { setShowSearchBar(false); Keyboard.dismiss(); }} style={styles.closeSearchButton}>
              <Ionicons name="close" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isLoadingEvents || favoritesLoading ? (
        <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <MusicBeatsLoader />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading events...</Text>
        </View>
      ) : favoritesError ? (
        <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ color: '#ff4444', marginTop: 10 }}>Error: {favoritesError}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentArea}
          stickyHeaderIndices={[3, 7]}
          contentContainerStyle={{ paddingBottom: 120 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#B15CDE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.gradientBackground, { marginBottom: 0 }]}
          >
            <View style={styles.sceneLogoContainer}>
              <Scenezone />
            </View>
            <View style={styles.headerContentBelowLogo}>
              <View>
                <MaskedView
                  maskElement={
                    <Text
                      style={[
                        styles.greeting,
                        {
                          fontFamily: 'Poppins',
                          fontSize: 22,
                          fontWeight: '700',
                          lineHeight: 28,
                          backgroundColor: 'transparent',
                        },
                      ]}
                    >
                      Hello {profile.name}!
                    </Text>
                  }
                >
                  <LinearGradient
                    colors={["#B15CDE", "#7952FC"]}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 0 }}
                    style={{ height: 28 }}
                  >
                    <Text
                      style={[
                        styles.greeting,
                        {
                          opacity: 0,
                          fontFamily: 'Poppins',
                          fontSize: 24,
                          fontWeight: '700',
                          lineHeight: 28,
                        },
                      ]}
                    >
                      Hello {profile.name}!
                    </Text>
                  </LinearGradient>
                </MaskedView>
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={dimensions.iconSize} color="#a95eff" />
                  <Text style={styles.locationText}>{profile.location}</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => setShowSearchBar(true)} style={styles.headerIconButton}>
                  <SearchIcon width={dimensions.navIconSize} height={dimensions.navIconSize} />
                </TouchableOpacity>
                <Animated.View style={{
                  transform: [{ rotate: notificationAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-15deg', '15deg'] }) }]
                }}>
                  <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.navigate('UserNotificationScreen')}>
                    <NotiIcon width={dimensions.navIconSize * 1.25} height={dimensions.navIconSize * 1.25} />
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
            <View style={styles.sectionNoPadding}>
              <Animated.ScrollView
                ref={featuredEventsScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalEventList}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={dimensions.cardWidth + dimensions.spacing.lg}
                snapToAlignment="center"
              >
                {events.map((item, index) => (
                  <View key={item._id}>
                    {renderEventCard({ item, index })}
                  </View>
                ))}
              </Animated.ScrollView>
            </View>
          </LinearGradient>
          <View style={{height: 80}} />
          <View style={[styles.section, { marginBottom: dimensions.spacing.xxxl }]}>
            <Text style={styles.sectionTitle}>Get Your Vibe</Text>
            <View>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Spotlight');
                  handleFeatureNavigation('SpotlightEvents');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner0.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Sports');
                  handleFeatureNavigation('SportsScreening');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner1.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Party');
                  handleFeatureNavigation('MusicParty');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner2.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Events');
                  handleFeatureNavigation('TrendingEvents');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner3.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Comedy');
                  handleFeatureNavigation('Comedy');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner4.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => {
                  handleCategoryFilter('Workshop');
                  handleFeatureNavigation('Workshop');
                }}
              >
                <Image
                  source={require('../assets/Images/Banner5.png')}
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoryNavbarContainer}>
            <View style={styles.categoryNavbarScroll}>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Spotlight');
                  handleFeatureNavigation('SpotlightEvents');
                }}
              >
                <CategoryNavIcon type="spotlight" isActive={activeCategory === 'Spotlight'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Spotlight' ? '#B15CDE' : '#fff' }]}>Spotlight</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Sports');
                  handleFeatureNavigation('Sports');
                }}
              >
                <CategoryNavIcon type="sports" isActive={activeCategory === 'Sports'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Sports' ? '#B15CDE' : '#fff' }]}>Sports</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Party');
                  handleFeatureNavigation('Party');
                }}
              >
                <CategoryNavIcon type="party" isActive={activeCategory === 'Party'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Party' ? '#B15CDE' : '#fff' }]}>Party</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Events');
                  handleFeatureNavigation('Events');
                }}
              >
                <CategoryNavIcon type="events" isActive={activeCategory === 'Events'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Events' ? '#B15CDE' : '#fff' }]}>#Events</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Comedy');
                  handleFeatureNavigation('Comedy');
                }}
              >
                <CategoryNavIcon type="comedy" isActive={activeCategory === 'Comedy'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Comedy' ? '#B15CDE' : '#fff' }]}>Comedy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.categoryNavItem}
                onPress={() => {
                  handleCategoryFilter('Workshop');
                  handleFeatureNavigation('Workshop');
                }}
              >
                <CategoryNavIcon type="workshop" isActive={activeCategory === 'Workshop'} />
                <Text style={[styles.categoryNavText, { color: activeCategory === 'Workshop' ? '#B15CDE' : '#fff' }]}>Workshop</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{
            height: 1,
            backgroundColor: '#fff',
            opacity: 0.12,
            width: '100%',
          }} />
          <View style={[styles.section, { marginBottom: 0, marginTop: dimensions.spacing.xxxl }]}>
            <Text style={[styles.sectionTitle, { marginBottom: dimensions.spacing.lg }]}>Latest Events</Text>
            <ScrollView
              ref={latestEventsScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalEventListContent}
              decelerationRate="fast"
              scrollEventThrottle={16}
              onTouchStart={pauseLatestAutoScroll}
              onScrollBeginDrag={pauseLatestAutoScroll}
            >
              {latestEvents.map((item) => (
                <LatestEventCard key={item.id} item={item} navigation={navigation} />
              ))}
            </ScrollView>
          </View>
          <View
            style={[styles.section, { marginTop: dimensions.spacing.md, marginBottom: 0 }]}
            onLayout={e => {
              setPlanSectionY(e.nativeEvent.layout.y);
              setPlanSectionHeight(e.nativeEvent.layout.height);
            }}
          >
            <Text style={styles.sectionTitle}>Plan for</Text>
            <View style={styles.planForButtonsContainer}>
              <Animated.View style={{ transform: [{ translateX: planTodayAnim }] }}>
                <TouchableOpacity onPress={() => handleFeatureNavigation('TodayEvents')} style={{ marginLeft: -16 }}>
                  <Plan1 width={140} height={139} />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity onPress={() => handleFeatureNavigation('WeeklyEvents')} style={{ marginLeft: -56 }}>
                <Plan2 width={140} height={139} />
              </TouchableOpacity>
              <Animated.View style={{ transform: [{ translateX: planWeekendAnim }] }}>
                <TouchableOpacity onPress={() => handleFeatureNavigation('WeekendEvents')} style={{ marginLeft: -56 }}>
                  <Plan3 width={140} height={139} />
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
          <View style={[
            styles.categoryFilterContainer,
            {
              marginTop: 0,
              backgroundColor: '#121212',
              zIndex: 100,
            }
          ]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryFilterScroll}>
              <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
                <Text style={styles.filterButtonText}>Filter</Text>
                <Ionicons name="options-outline" size={dimensions.iconSize} color="#fff" style={{ marginLeft: dimensions.spacing.sm }} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'Nearby' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('Nearby')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'Nearby' && styles.categoryFilterButtonTextActive]}>Nearby</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'Today' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('Today')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'Today' && styles.categoryFilterButtonTextActive]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'This Week' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('This Week')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'This Week' && styles.categoryFilterButtonTextActive]}>This Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'This Weekend' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('This Weekend')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'This Weekend' && styles.categoryFilterButtonTextActive]}>This Weekend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'Next Weekend' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('Next Weekend')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'Next Weekend' && styles.categoryFilterButtonTextActive]}>Next Weekend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === 'Tickets less than ₹1000' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('Tickets less than ₹1000')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === 'Tickets less than ₹1000' && styles.categoryFilterButtonTextActive]}>Tickets less than ₹1000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === '₹1000 - ₹5000' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('₹1000 - ₹5000')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === '₹1000 - ₹5000' && styles.categoryFilterButtonTextActive]}>₹1000 - ₹5000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.categoryFilterButton, activeFilter === '₹5000+' && styles.categoryFilterButtonActive]}
                onPress={() => handleTimeFilter('₹5000+')}
              >
                <Text style={[styles.categoryFilterButtonText, activeFilter === '₹5000+' && styles.categoryFilterButtonTextActive]}>₹5000+</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          <View style={[styles.section, { marginTop: dimensions.spacing.xxxl }]}>
            <Text style={[styles.sectionTitle, { marginBottom: dimensions.spacing.lg }]}>
              Explore {exploreEvents.length} events around you
            </Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.exploreEventsListContent}>
              {exploreEvents.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.exploreEventCardContainer}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('UserEvent', { eventId: item.id })}
                >
                  <Image
                    source={item.image}
                    style={styles.exploreEventImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.exploreEventHeartIcon}
                    onPress={() => handleFavoriteToggle(item.eventId)}
                  >
                    <Ionicons
                      name={item.isFavorite ? "heart" : "heart-outline"}
                      size={dimensions.navIconSize * 1.25}
                      color={item.isFavorite ? "#ff4444" : "#7A7A90"}
                    />
                  </TouchableOpacity>
                  <View style={styles.exploreEventDetailsOverlay}>
                    <View style={styles.exploreEventDetailsRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.exploreEventTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                        <Text style={styles.exploreEventAddress} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                        <Text style={styles.exploreEventCity} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
                      </View>
                      <MaskedView
                        maskElement={
                          <Ionicons
                            name="arrow-forward"
                            size={20}
                            color="black"
                            style={{ marginLeft: 10 }}
                          />
                        }
                      >
                        <LinearGradient
                          colors={['#B15CDE', '#7952FC']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{ width: 30, height: 20, marginLeft: 10 }}
                        />
                      </MaskedView>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      )}
      {FilterModal()}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  greeting: {
    fontSize: dimensions.fontSize.large,
    fontWeight: 'bold',
    color: '#B15CDE',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.spacing.xs,
  },
  locationText: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: dimensions.spacing.xs,
  },
  iconContainer: {
    flexDirection: 'row',
    width: Math.max(dimensions.navIconSize * 3, 80),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconButton: {
    minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius.md,
  },
  sceneLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.md,
  },
  sceneZoneLogo: {
    width: Math.min(width * 0.9, 400),
    height: dimensions.logoHeight,
    alignSelf: 'center',
  },
  headerContentBelowLogo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.xl,
    minHeight: dimensions.buttonHeight,
  },
  headerText: {
    fontSize: dimensions.fontSize.xlarge,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventCardContainer: {
    marginHorizontal: dimensions.spacing.xl,
    marginBottom: dimensions.spacing.xxxl,
    borderRadius: dimensions.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  eventCardGradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
  },
  eventCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  eventImage: {
    width: '100%',
    height: Math.min(width * 1.0, height * 0.5),
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: dimensions.borderRadius.lg,
  },
  heartIconPlaceholder: {
    position: 'absolute',
    top: dimensions.spacing.lg,
    right: dimensions.spacing.lg,
    padding: dimensions.spacing.sm,
    zIndex: 1,
    minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius.lg,
  },
  eventTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: dimensions.spacing.lg,
    zIndex: 2,
  },
  eventTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: dimensions.spacing.xs,
  },
  eventLocationText: {
    overflow: 'hidden',
    color: '#7A7A90',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  eventArrowButton: {
    position: 'absolute',
    bottom: dimensions.spacing.lg,
    right: dimensions.spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.xxl,
    zIndex: 3,
    minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: dimensions.spacing.xl,
    marginBottom: dimensions.spacing.xl,
    marginTop: dimensions.spacing.xxxl,
    gap: dimensions.spacing.md,
  },
  bookingButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#1A1A1F',
    minHeight: dimensions.buttonHeight,
    shadowColor: '#B15CDE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 8,
  },
  bookingButtonText: {
    overflow: 'hidden',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
    textOverflow: 'ellipsis',
  },
  contentArea: {
    flex: 1,
  },
  section: {
    paddingTop: dimensions.spacing.xxxl,
    paddingHorizontal: dimensions.spacing.xl,
    marginBottom: 1,

  },
  sectionNoPadding: {
    marginBottom: 0,
  },
  sectionTitle: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.2,

  },
  placeholderText: {
    color: '#aaa',
    fontSize: dimensions.fontSize.title,
  },
  eventCardContainerHorizontalScroll: {
    width: dimensions.cardWidth,
    marginRight: 0,
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: dimensions.spacing.md,
  },
  categoryCard: {
    width: '100%',
    height: dimensions.categoryCardHeight,
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.xl,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  categoryText: {
    position: 'absolute',
    bottom: dimensions.spacing.lg,
    left: dimensions.spacing.lg,
    zIndex: 2,
    color: '#fff',
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    marginBottom: 0,
    borderBottomLeftRadius: Math.max(width * 0.08, 25),
    borderBottomRightRadius: Math.max(width * 0.08, 25),
    overflow: 'hidden',
    paddingBottom: dimensions.spacing.xl,
  },
  categoryNavbarContainer: {
    paddingVertical: dimensions.spacing.lg,
    marginBottom: 0,
    paddingHorizontal: 0,
    width: '100%',
    zIndex: 200,
    backgroundColor: '#121212',
    position: 'sticky',
    top: 0,
  },
  categoryNavbarScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.md,
    backgroundColor: 'transparent',
  },
  categoryNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: dimensions.spacing.lg,
    marginHorizontal: dimensions.spacing.xs,
    minWidth: Math.max(width / 7, 45),
    minHeight: Math.max(dimensions.buttonHeight, 44),
    justifyContent: 'center',
    //backgroundColor: 'transparent',
  },
  categoryNavIcon: {
    width: Math.max(width * 0.1, 40),
    height: Math.max(width * 0.065, 26),
    marginBottom: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryNavText: {
    fontSize: 9,
    color: '#fff',
    marginTop: dimensions.spacing.xs,
    textAlign: 'center',
  },
  planForButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: 22,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 0,
  },
  calendarPlanForButton: {
    flex: 1,
    height: Math.max(height * 0.1, 80),
    borderRadius: dimensions.borderRadius.lg,
    backgroundColor: '#1a1a1a',
    borderWidth: 0.7,
    paddingTop: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingBottom: dimensions.spacing.md,

  },
  calendarIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dimensions.spacing.sm,
    gap: 8,
  },
  calendarDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  calendarButtonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarPlanForButtonText: {
    fontSize: dimensions.fontSize.header,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  categoryNavIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customCategoryNavIcon: {
    width: Math.max(width * 0.12, 48),
    height: Math.max(width * 0.08, 32),
    marginBottom: dimensions.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planForButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    height: Math.max(height * 0.1, 80),
  },
  planForButtonImage: {
    width: '100%',
    height: '100%',
  },
  categoryFilterContainer: {
    backgroundColor: '#121212',
    paddingVertical: dimensions.spacing.md,
    marginBottom: 0,
    marginTop: 0,
    paddingHorizontal: 0,
    width: '100%',
    zIndex: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  categoryFilterScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
  },
  filterButton: {
    display: 'flex',
    flexDirection: 'row',
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 360,
    backgroundColor: '#7952FC',
    marginRight: dimensions.spacing.lg,
  },
  filterButtonText: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
    marginRight: dimensions.spacing.sm,
  },
  categoryFilterButton: {
    display: 'flex',
    height: 38,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: '#2D2D38',
    marginRight: dimensions.spacing.lg,
  },
  categoryFilterButtonText: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
  },
  eventVideo: {
    width: '100%',
    height: Math.min(width * 1.0, height * 0.5),
  },
  horizontalEventList: {
    paddingHorizontal: Math.max((width - dimensions.cardWidth) / 4, 20),
  },
  latestEventCardContainer: {
    width: 267,
    flexShrink: 0,
    marginRight: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    backgroundColor: '#1a1a1a',
    position: 'relative',
  },
  latestEventImage: {
    width: '100%',
    height: 184,
  },
  latestEventDateOverlay: {
    position: 'absolute',
    top: dimensions.spacing.lg,
    left: dimensions.spacing.lg,
    backgroundColor: '#000000aa',
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.md,
    alignItems: 'center',
    minWidth: Math.max(width * 0.1, 40),
  },
  latestEventDateMonth: {
    fontSize: dimensions.fontSize.small,
    color: '#fff',
    fontWeight: 'bold',
  },
  latestEventDateDay: {
    fontSize: dimensions.fontSize.title,
    color: '#fff',
    fontWeight: 'bold',
  },
  latestEventGuestListButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    display: 'flex',
    paddingVertical: 3,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.02)',
    zIndex: 2,
    minHeight: Math.max(dimensions.buttonHeight * 0.6, 32),
  },
  latestEventGuestListButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
  latestEventHeartIcon: {
    position: 'absolute',
    bottom: 2,
    right: 6,
    padding: dimensions.spacing.sm,
    zIndex: 2,
    minWidth: Math.max(dimensions.buttonHeight * 0.6, 32),
    minHeight: Math.max(dimensions.buttonHeight * 0.6, 32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius.md,
  },
  latestEventDetailsContainer: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  latestEventTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20.22,
    marginBottom: 4,
  },
  latestEventPrice: {
    overflow: 'hidden',
    color: '#8D6BFC',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: dimensions.spacing.xs,
  },
  latestEventLocation: {
    overflow: 'hidden',
    color: '#7A7A90',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  horizontalEventListContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingRight: dimensions.spacing.xl,
  },
  featuredEventDetailsBottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 62,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    flexShrink: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 0.963,
    borderColor: '#34344A',
    backgroundColor: '#24242D',
  },
  featuredEventTextContainer: {
    flex: 1,
    marginRight: dimensions.spacing.md,
  },
  featuredEventTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20.22,
    marginBottom: dimensions.spacing.xs,
    textOverflow: 'ellipsis',
  },
  featuredEventLocationText: {
    overflow: 'hidden',
    color: '#919191',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20.22,
    textOverflow: 'ellipsis',
  },
  featuredEventArrowGradientBorder: {
    padding: 1, // thickness of the border
    borderRadius: 13.5, // match the button's borderRadius
  },
  featuredEventArrowButton: {
    display: 'flex',
    height: 42,
    width: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13.5,
    backgroundColor: '#24242D', // or 'transparent' if you want no fill
  },
  exploreEventsListContent: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  exploreEventCardContainer: {
    width: width - 32, // 16px margin on each side
    height: 500,
    marginBottom: 22,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#222',
    position: 'relative',
    alignSelf: 'center',
  },
  exploreEventImage: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  exploreEventDetailsOverlay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 18,
    paddingBottom: 10,
    paddingLeft: 12,
    gap: 29,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 197, 237, 0.20)',
    backgroundColor: '#24242D',
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  exploreEventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exploreEventTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 20.22,
    marginBottom: 4,
  },
  exploreEventAddress: {
    overflow: 'hidden',
    color: '#919191',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: undefined,
    marginBottom: 2,
  },
  exploreEventCity: {
    fontSize: 14,
    color: '#aaa',
  },
  exploreEventHeartIcon: {
    position: 'absolute',
    top: dimensions.spacing.lg,
    right: dimensions.spacing.lg,
    padding: dimensions.spacing.sm,
    zIndex: 2,
    minWidth: Math.max(dimensions.buttonHeight * 0.6, 32),
    minHeight: Math.max(dimensions.buttonHeight * 0.6, 32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dimensions.borderRadius.md,
  },
  customSceneLogoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.md,
  },
  sceneLogoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneLogoText: {
    fontSize: dimensions.fontSize.xlarge,
    fontWeight: 'bold',
    color: '#fff',
  },
  zoneLogoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoneLogoText: {
    fontSize: dimensions.fontSize.xlarge,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    width: 393,
    maxWidth: '100%',
    height: 498,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: 'transparent',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.4,
    shadowRadius: 34,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  filterContent: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 24,
  },
  sectionContainer: {
    marginBottom: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFF',
    textAlign: 'left',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 26,
  },
  pillOption: {
    display: 'flex',
    height: 26,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 360,
    backgroundColor: 'rgba(255,255,255,0.20)',
    marginRight: 6,
    marginBottom: 6,
  },
  pillOptionActive: {
    backgroundColor: '#fff',
  },
  pillOptionText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    fontWeight: '600',
  },
  pillOptionTextActive: {
    color: '#7952FC',
    fontWeight: '700',
  },
  fixedButtonContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  continueButton: {
    width: '100%',
    maxWidth: 361,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
  },
  bookingButtonGradientBorder: {
    padding: 1, // thickness of the border
    borderRadius: 16, // match bookingButton borderRadius
    flex: 1,
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  searchOverlayBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  searchInputBarAtTop: {
    position: 'absolute',
    top: 40, // Move a little below the very top
    left: 0,
    right: 0,
    backgroundColor: '#18181C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.md,
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#2D2D38',
    borderRadius: 12,
    paddingHorizontal: dimensions.spacing.sm,
    color: '#fff',
    fontSize: dimensions.fontSize.small,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    lineHeight: 21,
  },
  closeSearchButton: {
    padding: dimensions.spacing.sm,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});


export default UserHomeScreen;