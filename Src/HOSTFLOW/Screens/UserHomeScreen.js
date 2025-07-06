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
  Modal
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../Redux/slices/favoritesSlice';
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
// import SlLogo from '../assets/icons/sl.svg';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
const isTablet = width >= 768;
const isSmallPhone = width < 350;
const scale = width / 375;

// Comprehensive responsive dimensions that work across all Android devices
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

const userData = {
  name: "Name Placeholder",
  email: "email@example.com",
  image: require('../assets/Images/frame1.png'),
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

// New component for individual Latest Event cards
const LatestEventCard = ({ item, navigation }) => {
  const [isGuestListApplied, setIsGuestListApplied] = useState(false);
  const dispatch = useDispatch();
  const isFavorite = useSelector(state => selectIsFavorite(state, item.eventId));

  const handleFavoriteToggle = (eventId) => {
    try {
      triggerHaptic('impactMedium');
      dispatch(toggleFavorite(eventId));
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const renderMedia = () => {
    if (item.image) {
      return (
        <View style={{flex: 1}}>
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
          {item.hasGuestListButton && (
            <TouchableOpacity style={styles.latestEventGuestListButton}>
              <Text style={styles.latestEventGuestListButtonText}>Apply For Guest List</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.latestEventHeartIcon} onPress={() => handleFavoriteToggle(item.eventId)}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={dimensions.navIconSize * 1.25}
              color={isFavorite ? "#ff4444" : "#7A7A90"}
            />
          </TouchableOpacity>
        </View>
      );
    } else if (item.video) {
      return (
        <Video
          source={item.video}
          style={styles.latestEventImage}
          resizeMode="cover"
          repeat={true}
          muted={true}
          paused={false}
          controls={false}
          onError={(error) => {
            console.log('Video playback error:', error);
          }}
          onLoad={() => {
            console.log('Video loaded successfully');
          }}
        />
      );
    }
    return null;
  };

  return (
    <TouchableOpacity style={styles.latestEventCardContainer} activeOpacity={0.85} onPress={() => navigation.navigate('UserEvent')}>
      {renderMedia()}

      <View style={styles.latestEventDateOverlay}>
        <Text style={styles.latestEventDateMonth}>{item.dateMonth}</Text>
        <Text style={styles.latestEventDateDay}>{item.dateDay}</Text>
      </View>

      {/* Details card below image with gradient background */}
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

// Custom Plan For Button Component
const PlanForButton = ({ type, onPress }) => {
  const getButtonConfig = () => {
    switch(type) {
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
    <TouchableOpacity style={[styles.calendarPlanForButton, { borderColor: config.borderColor }]} onPress={onPress}>
      {/* Calendar-style indicators at top */}
      <View style={styles.calendarIndicators}>
        <View style={[styles.calendarDot, { backgroundColor: config.indicatorColor }]} />
        <View style={[styles.calendarDot, { backgroundColor: config.indicatorColor }]} />
      </View>
      
      {/* Main button content */}
      <View style={styles.calendarButtonContent}>
        <Text style={styles.calendarPlanForButtonText}>{config.text}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Custom Category Nav Icon Component
const CategoryNavIcon = ({ type, isActive = false }) => {
  const getIconConfig = () => {
    switch(type) {
      case 'spotlight':
        return {
          component: Spotlight
        };
      case 'sports':
        return {
          component: Sports
        };
      case 'party':
        return {
          component: Party
        };
      case 'events':
        return {
          component: Events
        };
      case 'comedy':
        return {
          component: Comedy
        };
      case 'workshop':
        return {
          component: Workshop
        };
      default:
        return {
          component: Events
        };
    }
  };

  const config = getIconConfig();
  const IconComponent = config.component;

  return (
    <IconComponent 
      width={24} 
      height={24}
    />
  );
};

const UserHomeScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const scrollX = useRef(new Animated.Value(0)).current;
  const snapToInterval = dimensions.cardWidth + dimensions.spacing.lg;
  const insets = useSafeAreaInsets();
  
  // Add loading state
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  
  // Get isLoggedIn and userData from Redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userData = useSelector(selectUserData);
  
  // Function to get first word from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };
  
  // Get user name for greeting
  const userName = getFirstName(userData?.name || userData?.fullName);

  // Simulate loading for a brief moment when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingEvents(false);
    }, 1500); // Show loader for 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  // Add notification animation state
  const [hasNotification, setHasNotification] = useState(true); // For demo, set to true
  const notificationAnim = useRef(new Animated.Value(0)).current;

  // Jiggle animation effect for notification button
  useEffect(() => {
    if (hasNotification) {
      // Delay for 5 seconds before starting jitter animation
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
            Animated.delay(2000), // Pause for 2 seconds before next jitter cycle
          ]),
          { iterations: -1 } // Infinite loop
        );
        jitterAnimation.start();
      }, 5000); // 5 second delay

      return () => {
        clearTimeout(timer);
        notificationAnim.stopAnimation();
      };
    }
  }, [hasNotification]);

  const handleFeatureNavigation = (screenName) => {
    // If logged in, navigate directly to the feature
    // If not logged in, go to signup
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

  // Event IDs for each event in the home screen
  const eventIds = {
    featured: 'featured_event_1',
    upcoming1: 'upcoming_event_1',
    upcoming2: 'upcoming_event_2',
    upcoming3: 'upcoming_event_3',
    upcoming4: 'upcoming_event_4',
    upcoming5: 'upcoming_event_5',
    explore1: 'explore_event_1',
    explore2: 'explore_event_2',
    explore3: 'explore_event_3',
    explore4: 'explore_event_4'
  };

  // Get favorite status for each event
  const isFeaturedFavorite = useSelector(state => selectIsFavorite(state, eventIds.featured));
  const isUpcoming1Favorite = useSelector(state => selectIsFavorite(state, eventIds.upcoming1));
  const isUpcoming2Favorite = useSelector(state => selectIsFavorite(state, eventIds.upcoming2));
  const isUpcoming3Favorite = useSelector(state => selectIsFavorite(state, eventIds.upcoming3));
  const isUpcoming4Favorite = useSelector(state => selectIsFavorite(state, eventIds.upcoming4));
  const isUpcoming5Favorite = useSelector(state => selectIsFavorite(state, eventIds.upcoming5));
  const isExplore1Favorite = useSelector(state => selectIsFavorite(state, eventIds.explore1));
  const isExplore2Favorite = useSelector(state => selectIsFavorite(state, eventIds.explore2));
  const isExplore3Favorite = useSelector(state => selectIsFavorite(state, eventIds.explore3));
  const isExplore4Favorite = useSelector(state => selectIsFavorite(state, eventIds.explore4));

  const handleFavoriteToggle = (eventId) => {
    try {
      triggerHaptic('impactMedium');
      dispatch(toggleFavorite(eventId));
      navigation.navigate('UserFavoriteScreen');
    } catch (error) {
      console.error('Error updating favorite:', error);
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
      if (item.video) {
        return (
          <Video
            source={item.video}
            style={styles.eventVideo}
            resizeMode="cover"
            repeat={true}
            muted={true}
            paused={false}
            controls={false}
            rate={1.0}
            volume={0}
            playWhenInactive={false}
            playInBackground={false}
            ignoreSilentSwitch="ignore"
            onError={(error) => {
              console.log('Featured video playback error:', error);
            }}
            onLoad={() => {
              console.log('Featured video loaded successfully');
            }}
          />
        );
      } else {
        return (
          <Image
            source={item.image}
            style={styles.eventImage}
            resizeMode="cover"
          />
        );
      }
    };

    return (
      <TouchableOpacity activeOpacity={0.85} onPress={() => handleFeatureNavigation('UserEvent')}>
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
            onPress={() => {
              if (isLoggedIn) {
                handleFavoriteToggle(item.eventId);
              } else {
                triggerHaptic('impactMedium');
                handleFeatureNavigation('UserSignup');
              }
            }}
          >
            <Ionicons 
              name={item.isFavorite ? "heart" : "heart-outline"} 
              size={dimensions.navIconSize * 1.25} 
              color={item.isFavorite ? "#ff4444" : "#7A7A90"}
            />
          </TouchableOpacity>

          <View style={styles.featuredEventDetailsBottomContainer}>
            <View style={styles.featuredEventTextContainer}>
              <Text style={styles.featuredEventTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
              <Text style={styles.featuredEventLocationText} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
            </View>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.featuredEventArrowGradientBorder}
            >
              <TouchableOpacity
                style={styles.featuredEventArrowButton}
                onPress={() => handleFeatureNavigation('UserEvent')}
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

  const featuredEvents = [
    { 
      title: 'Another Music Festival', 
      price: '', 
      location: 'Some City, India',
      eventId: eventIds.featured,
      isFavorite: isFeaturedFavorite,
      video: require('../assets/Videos/Video.mp4')
    },
    { 
      title: 'Stand-up Comedy Night', 
      price: '', 
      location: 'Comedy Club, City',
      eventId: eventIds.upcoming1,
      isFavorite: isUpcoming1Favorite,
      video: require('../assets/Videos/Video.mp4')
    },
    { 
      title: 'Basketball Game', 
      price: '', 
      location: 'Sports Stadium, City',
      eventId: eventIds.upcoming2,
      isFavorite: isUpcoming2Favorite,
      video: require('../assets/Videos/Video.mp4')
    }
  ];

  const latestEvents = [
    {
      id: 'latest_1',
      image: require('../assets/Images/ffff.jpg'),
      dateMonth: 'May',
      dateDay: '20',
      title: 'Harmony Jam 2024',
      price: '₹25.00 - ₹125.00',
      location: 'Noida',
      eventId: eventIds.upcoming3,
      isFavorite: isUpcoming3Favorite,
      hasGuestListButton: true,
    },
    {
      id: 'latest_2',
      image: require('../assets/Images/fff.jpg'),
      dateMonth: 'Oct',
      dateDay: '7',
      title: 'Rhythm Rally 2024',
      price: '₹9.55 - ₹15.99',
      location: 'Noida',
      eventId: eventIds.upcoming4,
      isFavorite: isUpcoming4Favorite,
      hasGuestListButton: false,
    },
     {
      id: 'latest_3',
      image: require('../assets/Images/ffff.jpg'),
      dateMonth: 'Nov',
      dateDay: '15',
      title: 'Another Late Event',
      price: '₹25.00 - ₹125.00',
      location: 'Delhi',
      eventId: eventIds.upcoming5,
      isFavorite: isUpcoming5Favorite,
      hasGuestListButton: true,
    },
    {
      id: 'latest_4',
      image: require('../assets/Images/fff.jpg'),
      dateMonth: 'Dec',
      dateDay: '1',
      title: 'Fourth Event',
      price: '₹25.00 - ₹125.00',
      location: 'Gurgaon',
      eventId: 'upcoming_event_6',
      isFavorite: false,
      hasGuestListButton: true,
    },
  ];

  // Filter modal logic (copied from HomeScreen)
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState({
    filter: 'Today',
    price: 'Low - High',
    instrument: 'Acoustic Guitar',
    genre: 'Soul Queen',
  });
  const filterOptions = {
    filter: ['Near - Far', 'Far - Near', 'Today', 'This Week' ,'This Weekend','Next Weekend','1km-3km','3km-5km','5km+'],
    price: ['Low - High', 'High - Low', 'Tickets under ₹1000','₹1000-₹2000','₹2000-₹3000','₹3000+'],
    instrument: ['Electric Guitar', 'Saxophone', 'Acoustic Guitar', 'Synthesizer','Drum Machine','Banjo','Trumpet','Turntables'],
    type: ['Musician', 'Comedian', 'Magician', 'Anchor','Dancer','Poet','Dj','Other'],
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
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowFilter(false)}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#7952FC" />
          </TouchableOpacity>

          {/* Scrollable Filter Content */}
          <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 0}}>
            {/* FILTER Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>FILTER</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('filter')}
              </View>
            </View>
            {/* PRICE Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('price')}
              </View>
            </View>
            {/* INSTRUMENT Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSTRUMENT</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('instrument')}
              </View>
            </View>
            {/* GENRE Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>GENRE</Text>
              </View>
              <View style={styles.pillsRow}>
                {renderPills('type')}
              </View>
            </View>
          </ScrollView>

          {/* Fixed Continue Button */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => setShowFilter(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      {isLoadingEvents ? (
        <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
          <MusicBeatsLoader />
          <Text style={{ color: '#fff', marginTop: 10 }}>Loading events...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={styles.contentArea}
          stickyHeaderIndices={[3]}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Featured Events Section (Horizontal Scroll) - Now includes header */}
          <LinearGradient
            colors={['#000000', '#1a1a1a', '#B15CDE']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.gradientBackground, { marginBottom: 0 }]}
          >
            {/* Scene Logo and Rabbit GIF */}
            <View style={styles.sceneLogoContainer}>
              <Scenezone />
            </View>

            {/* Header content */}
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
                      Hello {userName}!
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
                      Hello {userName}!
                    </Text>
                  </LinearGradient>
                </MaskedView>
                <View style={styles.locationContainer}>
                  <MaterialIcons name="location-on" size={dimensions.iconSize} color="#a95eff" />
                  <Text style={styles.locationText}>H-70, Sector 63, Noida</Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity style={styles.headerIconButton}>
                  <SearchIcon width={dimensions.navIconSize * 1.25} height={dimensions.navIconSize * 1.25} />
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

            {/* Featured Events Section */}
            <View style={styles.sectionNoPadding}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalEventList}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={snapToInterval}
                snapToAlignment="center"
              >
                {featuredEvents.map((item, index) => (
                  <View key={item.eventId}>
                    {renderEventCard({ item, index })}
                  </View>
                ))}
              </Animated.ScrollView>
            </View>
          </LinearGradient>

          {/* Booking Buttons */}
          <View style={styles.bookingButtonsContainer}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bookingButtonGradientBorder}
            >
              <TouchableOpacity 
                style={styles.bookingButton}
                onPress={() => handleFeatureNavigation('Signup')}
                activeOpacity={0.85}
              >
                <Text style={styles.bookingButtonText} numberOfLines={1} ellipsizeMode="tail">Artist Booking</Text>
                <Icon name="chevron-right" size={dimensions.iconSize} color="#a95eff" />
              </TouchableOpacity>
            </LinearGradient>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bookingButtonGradientBorder}
            >
              <TouchableOpacity 
                style={styles.bookingButton}
                onPress={() => handleFeatureNavigation('UserVenueBookingScreen')}
                activeOpacity={0.85}
              >
                <Text style={styles.bookingButtonText} numberOfLines={1} ellipsizeMode="tail">Venue Booking</Text>
                <Icon name="chevron-right" size={dimensions.iconSize} color="#a95eff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Get Your Vibe Section */}
          <View style={[styles.section, { marginBottom: dimensions.spacing.xxxl }]}>
            <Text style={styles.sectionTitle}>Get Your Vibe</Text>
            <View>
              {/* Spotlight Card */}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('SpotlightEvents')}
              >
                <Image 
                  source={require('../assets/Images/Banner0.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
              {/* Sports Screening Card */}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('SportsScreening')}
              >
                <Image 
                  source={require('../assets/Images/Banner1.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
              {/* Music & Party Card */}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('MusicParty')}
              >
                <Image 
                  source={require('../assets/Images/Banner2.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
              {/* Trending Events Card */}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('TrendingEvents')}
              >
                <Image 
                  source={require('../assets/Images/Banner3.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
              {/* Comedy Card */}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('Comedy')}
              >
                <Image 
                  source={require('../assets/Images/Banner4.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
              {/* workshop card*/}
              <TouchableOpacity 
                style={styles.categoryCard} 
                onPress={() => handleFeatureNavigation('Workshop')}
              >
                <Image 
                  source={require('../assets/Images/Banner5.png')} 
                  style={styles.categoryImage}
                  resizeMode="cover"
                />
                {/* <View style={styles.categoryOverlay} /> */}
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Navbar - sticky below Get Your Vibe */}
          <View style={styles.categoryNavbarContainer}>
            <View style={styles.categoryNavbarScroll}>
              {/* Spotlight Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('SpotlightEvents')}
              >
                <CategoryNavIcon type="spotlight" />
                <Text style={styles.categoryNavText}>Spotlight</Text>
              </TouchableOpacity>
              {/* Sports Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('Sports')}
              >
                <CategoryNavIcon type="sports" />
                <Text style={styles.categoryNavText}>Sports</Text>
              </TouchableOpacity>
              {/* Party Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('Party')}
              >
                <CategoryNavIcon type="party" />
                <Text style={styles.categoryNavText}>Party</Text>
              </TouchableOpacity>
              {/* #Events Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('Events')}
              >
                <CategoryNavIcon type="events" />
                <Text style={styles.categoryNavText}>#Events</Text>
              </TouchableOpacity>
              {/* Comedy Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('Comedy')}
              >
                <CategoryNavIcon type="comedy" />
                <Text style={styles.categoryNavText}>Comedy</Text>
              </TouchableOpacity>
              {/* Workshop Button */}
              <TouchableOpacity 
                style={styles.categoryNavItem} 
                onPress={() => handleFeatureNavigation('Workshop')}
              >
                <CategoryNavIcon type="workshop" />
                <Text style={styles.categoryNavText}>Workshop</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* White divider line below category navbar */}
          <View style={{
            height: 1,
            backgroundColor: '#fff',
            opacity: 0.12,
            width: '100%',
          }} />

          {/* Latest Events Section */}
          <View style={[styles.section, { marginBottom: 0, marginTop: dimensions.spacing.xxxl }]}>
            <Text style={[styles.sectionTitle, { marginBottom: dimensions.spacing.lg }]}>Latest Events</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalEventListContent}>
              {latestEvents.map((item) => (
                <LatestEventCard key={item.id} item={item} navigation={navigation} />
              ))}
            </ScrollView>
          </View>

          {/* Plan for Section */}
          <View style={[styles.section, { marginTop: dimensions.spacing.md, marginBottom: 0 }]}>
            <Text style={styles.sectionTitle}>Plan for</Text>
            <View style={styles.planForButtonsContainer}>
              <TouchableOpacity onPress={() => handleFeatureNavigation('TodayEvents')} style={{marginLeft: -16}}>
                <Plan1 width={140} height={139} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeatureNavigation('WeeklyEvents')} style={{marginLeft: -56}}>
                <Plan2 width={140} height={139} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFeatureNavigation('WeekendEvents')} style={{marginLeft: -56}}>
                <Plan3 width={140} height={139} />
              </TouchableOpacity>
            </View>
          </View> 

          {/* Category Filter Buttons - Second Sticky Section */}
          <View style={[
            styles.categoryFilterContainer,
            {
              marginTop: 0,
            }
          ]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryFilterScroll}>
             {/* Filter Button */}
              
               <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilter(true)}>
                <Text style={styles.filterButtonText}>Filter</Text>
                <Ionicons name="options-outline" size={dimensions.iconSize} color="#fff" style={{marginLeft: dimensions.spacing.sm}} />
              </TouchableOpacity> 
              {/* Nearby Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>Nearby</Text>
              </TouchableOpacity>
              
              {/* Today Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>Today</Text>
              </TouchableOpacity>
              {/* This Week Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>This Week</Text>
              </TouchableOpacity>
              {/* This Weekend Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>This Weekend</Text>
              </TouchableOpacity>
              {/* Next Weekend Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>Next Weekend</Text>
              </TouchableOpacity>
              {/* Tickets less than ₹1000 Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>Tickets less than ₹1000</Text>
              </TouchableOpacity>
              {/* ₹1000 - ₹5000 Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>₹1000 - ₹5000</Text>
              </TouchableOpacity>
              {/* ₹5000+ Button */}
              <TouchableOpacity style={styles.categoryFilterButton}>
                <Text style={styles.categoryFilterButtonText}>₹5000+</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Explore 74 events around you Section */}
          <View style={[styles.section, { marginTop: dimensions.spacing.xxxl }]}>
            <Text style={[styles.sectionTitle, { marginBottom: dimensions.spacing.lg }]}>Explore 74 events around you</Text>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.exploreEventsListContent}>
              {[
                { id: 1, eventId: eventIds.explore1, isFavorite: isExplore1Favorite },
                { id: 2, eventId: eventIds.explore2, isFavorite: isExplore2Favorite },
                { id: 3, eventId: eventIds.explore3, isFavorite: isExplore3Favorite },
                { id: 4, eventId: eventIds.explore4, isFavorite: isExplore4Favorite }
              ].map((item, idx) => (
                <TouchableOpacity key={item.id} style={styles.exploreEventCardContainer} activeOpacity={0.85} onPress={() => navigation.navigate('UserEvent')}>
                  <Image
                    source={require('../assets/Images/fff.jpg')}
                    style={styles.exploreEventImage}
                    resizeMode="cover"
                  />
                  {/* Heart icon on all cards at top right */}
                  <TouchableOpacity 
                    style={styles.exploreEventHeartIcon}
                    onPress={() => {
                      if (isLoggedIn) {
                        handleFavoriteToggle(item.eventId);
                      } else {
                        triggerHaptic('impactMedium');
                        handleFeatureNavigation('UserSignup');
                      }
                    }}
                  >
                    <Ionicons 
                      name={item.isFavorite ? "heart" : "heart-outline"} 
                      size={dimensions.navIconSize * 1.25} 
                      color={item.isFavorite ? "#ff4444" : "#7A7A90"} 
                    />
                  </TouchableOpacity>
                  {/* Event details overlay */}
                  <View style={styles.exploreEventDetailsOverlay}>
                    <View style={styles.exploreEventDetailsRow}>
                      <View style={{flex: 1}}>
                        <Text style={styles.exploreEventTitle}>Thrash and Bash Metal Festival 2024</Text>
                        <Text style={styles.exploreEventAddress}>502, Palm Spring Apartments, Link Road</Text>
                        <Text style={styles.exploreEventCity}>Noida, India</Text>
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
});

export default UserHomeScreen; 