import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  Animated,
  Platform,
  Easing,
  Alert,
  BackHandler,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import Video from "react-native-video";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MiddleButton from "../assets/icons/MiddleButton";
import NotificationIcon from "../assets/icons/NotificationIcon";
import SignUpBackground from "../assets/Banners/SignUp";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Modal as RNModal } from "react-native";
import {
  selectFullName,
  selectLocation,
  selectUserData,
} from "../Redux/slices/authSlice";
import { API_BASE_URL } from "../Config/env";
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid } from 'react-native';

const { width, height } = Dimensions.get("window");
const isBigScreen = width >= 600;

// Responsive dimensions with dynamic scaling
const dimensions = {
  cardWidth: isBigScreen ? Math.min(width * 0.77, 582) : Math.min(width * 0.945, 288.5), 
  cardHeight: isBigScreen ? Math.round((width * 0.77) * 1.7) : 470,
  headerHeight: isBigScreen ? 100 : 80,
  buttonHeight: isBigScreen ? 60 : 52,
  iconSize: isBigScreen ? 28 : 24,
  borderRadius: {
    small: isBigScreen ? 6 : 4,
    medium: isBigScreen ? 12 : 8,
    large: isBigScreen ? 24 : 16,
    xlarge: isBigScreen ? 36 : 24,
    nose: isBigScreen ? 40 : 32, 
  },
  spacing: {
    xs: isBigScreen ? 6 : 4,
    sm: isBigScreen ? 12 : 8,
    md: isBigScreen ? 18 : 12,
    lg: isBigScreen ? 24 : 16,
    xl: isBigScreen ? 30 : 20,
    xxl: isBigScreen ? 36 : 24,
  },
  fontSize: {
    small: isBigScreen ? 14 : 12,
    medium: isBigScreen ? 16 : 14,
    large: isBigScreen ? 18 : 16,
    xlarge: isBigScreen ? 26 : 22,
  },
};

const HomeScreen = ({ navigation }) => {
  const [showFilter, setShowFilter] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector(selectFullName);
  const location = useSelector(selectLocation);
  const userData = useSelector(selectUserData);
  const { unreadCount, unreadChatCount } = useSelector((state) => state.notifications);
  const [selected, setSelected] = React.useState({
    price: { ranges: [], sort: "low-high" },
    instruments: [],
    genres: [],
  });
  const [artistData, setArtistData] = React.useState([]);
  const [filteredArtistData, setFilteredArtistData] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [alreadyShortlistedVisible, setAlreadyShortlistedVisible] = React.useState(false);
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });
  const [deviceLocation, setDeviceLocation] = React.useState('Fetching location...');
  const [showExitAlert, setShowExitAlert] = React.useState(false);

  // Reset exit alert on mount
  React.useEffect(() => {
    setShowExitAlert(false);
  }, []);

  // Handle Android back button to show exit modal
  React.useEffect(() => {
    const backAction = () => {
      // Only show exit alert if on HomeScreen
      const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
      if (currentRoute === 'Home') {
        setShowExitAlert(true);
        return true; // Prevent default back action
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const filterOptions = {
    priceRanges: ["under-1000", "1000-2000", "2000-3000", "3000-above"],
    priceSort: ["low-high", "high-low"],
    instruments: [
      "Guitar",
      "Saxophone",
      "Piano",
      "Drums",
      "Trumpet",
      "Banjo",
      "Synthesizer",
    ],
    genres: ["Rock", "Jazz", "Pop", "Classical", "Hip-Hop", "Soul"],
  };

  // Fetch artists
  React.useEffect(() => {
    const fetchArtists = async () => {
      // Close filter modal before loading
      if (showFilter) setShowFilter(false);
      setIsLoading(true);
      // Fade out before loading
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      try {
        if (!token) {
          setCustomAlert({ visible: true, title: 'Error', message: 'Authentication token is missing' });
          return;
        }
        const filterPayload = {
          price:
            selected.price.ranges.length > 0 || selected.price.sort
              ? selected.price
              : undefined,
          instruments:
            selected.instruments.length > 0 ? selected.instruments : undefined,
          genres: selected.genres.length > 0 ? selected.genres : undefined,
          page: page,
          limit: limit,
        };
        const response = await axios.post(
          `${API_BASE_URL}/host/filter`,
          filterPayload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          }
        );
        if (response.data.success) {
          setArtistData(response.data.data.artists || []);
          setFilteredArtistData(response.data.data.artists || []);
        } else {
          setArtistData([]);
          setFilteredArtistData([]);
          setCustomAlert({ visible: true, title: 'Error', message: response.data.message || 'Failed to fetch artists.' });
        }
      } catch (error) {
        setArtistData([]);
        setFilteredArtistData([]);
        setCustomAlert({ visible: true, title: 'Error', message: error.response?.status === 404 ? 'Artist filter endpoint not found.' : error.message === 'Network Error' ? 'Unable to connect to the server.' : 'Failed to fetch artists.' });
      } finally {
        setIsLoading(false);
        // Fade in after loading
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }
    };
    fetchArtists();
  }, [token, selected, page]);

  // Fetch device location on mount
  React.useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show your city.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log('[Location] Android permission result:', granted);
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            setDeviceLocation('Permission denied');
            setCustomAlert({ visible: true, title: 'Error', message: 'Location permission denied.' });
            return;
          }
        }
        Geolocation.getCurrentPosition(
          async (position) => {
            console.log('[Location] Got position:', position);
            const { latitude, longitude } = position.coords;
            // Optionally, reverse geocode to get city name
            try {
              const apiKey = 'pk.bbae5b128a235f16723bac232aa283eb';
              const response = await fetch(`https://us1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`);
              const data = await response.json();
              console.log('[Location] LocationIQ response:', data);
              const city = data.address?.city || data.address?.town || data.address?.village;
              const state = data.address?.state;
              const country = data.address?.country;
              let locationText = '';
              if (city && state) {
                locationText = `${capitalize(city)}, ${capitalize(state)}`;
              } else if (city) {
                locationText = capitalize(city);
              } else if (state) {
                locationText = capitalize(state);
              } else if (country) {
                locationText = capitalize(country);
              } else {
                locationText = 'Unknown location';
              }
              setDeviceLocation(locationText);
              console.log('[Location] Final location text:', locationText);
            } catch (e) {
              setDeviceLocation('Unknown location');
              console.log('[Location] Reverse geocoding failed:', e);
            }
          },
          (error) => {
            setDeviceLocation('Location unavailable');
            setCustomAlert({ visible: true, title: 'Error', message: 'Failed to fetch device location.' });
            console.log('[Location] Geolocation error:', error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      } catch (err) {
        setDeviceLocation('Location unavailable');
        setCustomAlert({ visible: true, title: 'Error', message: 'Failed to fetch device location.' });
        console.log('[Location] Exception in requestLocationPermission:', err);
      }
    };
    requestLocationPermission();
  }, []);

  const handleShortlist = async () => {
    if (!filteredArtistData || filteredArtistData.length === 0) {
      setCustomAlert({ visible: true, title: 'No Artists', message: 'There are no artists to shortlist.' });
      return;
    }
    const artist = filteredArtistData[currentIndex];
    if (!artist || !artist.artistId) {
      setCustomAlert({ visible: true, title: 'Error', message: 'Could not find artist to shortlist.' });
      return;
    }
    const artistId = artist.artistId;
    if (!token) {
      setCustomAlert({ visible: true, title: 'Error', message: 'Authentication token is missing' });
      return;
    }
    try {
      const response = await axios.post(
        `${API_BASE_URL}/host/shortlistArtist`,
        { artistId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setCustomAlert({ visible: true, title: 'Success', message: 'Artist shortlisted successfully!' });
        setFilteredArtistData((prev) =>
          prev.map((item, index) =>
            index === currentIndex ? { ...item, isShortlisted: true } : item
          )
        );
      } else {
        setCustomAlert({ visible: true, title: 'Error', message: response.data.message || 'Could not shortlist the artist.' });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === "Artist already shortlisted."
      ) {
        setCustomAlert({ visible: true, title: 'Already Shortlisted', message: 'Artist already in shortlist.' });
      } else {
        setCustomAlert({ visible: true, title: 'Error', message: 'An error occurred while shortlisting. Please try again.' });
      }
    }
  };

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef(null);

  // Handle scroll to update current index
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(offsetX / snapToInterval);
        if (index >= 0 && index < filteredArtistData.length) {
          setCurrentIndex(index);
        }
      },
    }
  );

  // Handle filter selection
  const handleFilterSelect = (category, value) => {
    setSelected((prev) => {
      if (category === "priceRanges") {
        return {
          ...prev,
          price: {
            ...prev.price,
            ranges: prev.price.ranges.includes(value)
              ? prev.price.ranges.filter((r) => r !== value)
              : [...prev.price.ranges, value],
          },
        };
      } else if (category === "priceSort") {
        return {
          ...prev,
          price: { ...prev.price, sort: value },
        };
      } else if (category === "instruments") {
        return {
          ...prev,
          instruments: prev.instruments.includes(value)
            ? prev.instruments.filter((i) => i !== value)
            : [...prev.instruments, value],
        };
      } else if (category === "genres") {
        return {
          ...prev,
          genres: prev.genres.includes(value)
            ? prev.genres.filter((g) => g !== value)
            : [...prev.genres, value],
        };
      }
      return prev;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelected({
      price: { ranges: [], sort: "low-high" },
      instruments: [],
      genres: [],
    });
    setPage(1);
  };

  // Render filter pills
  const renderPills = (category, options) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const isSelected =
          category === "priceSort"
            ? selected.price.sort === option
            : category === "priceRanges"
            ? selected.price.ranges.includes(option)
            : selected[category].includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.pillOption, isSelected && styles.pillOptionActive]}
            onPress={() => handleFilterSelect(category, option)}
          >
            <Text
              style={[
                styles.pillOptionText,
                isSelected && styles.pillOptionTextActive,
              ]}
            >
              {option
                .replace("under-1000", "Under $1000")
                .replace("1000-2000", "$1000-$2000")
                .replace("2000-3000", "$2000-$3000")
                .replace("3000-above", "$3000+")
                .replace("low-high", "Low - High")
                .replace("high-low", "High - Low")}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // Enhanced responsive dimensions
  const responsiveDimensions = {
    ...dimensions,
    safeAreaTop: Math.max(insets.top, 0),
    safeAreaBottom: Math.max(insets.bottom, 0),
    safeAreaLeft: Math.max(insets.left, 0),
    safeAreaRight: Math.max(insets.right, 0),
    headerHeight: Math.max(
      dimensions.headerHeight + insets.top * 0.3,
      isBigScreen ? 100 : 80
    ),
    containerPadding: {
      horizontal: Math.max(
        insets.left + insets.right + dimensions.spacing.md,
        isBigScreen ? dimensions.spacing.lg : dimensions.spacing.md
      ),
      vertical: Math.max(
        insets.top + insets.bottom + dimensions.spacing.sm,
        dimensions.spacing.sm
      ),
    },
    spacing: {
      xs: Math.max(dimensions.spacing.xs, isBigScreen ? 6 : 4),
      sm: Math.max(dimensions.spacing.sm, isBigScreen ? 12 : 8),
      md: Math.max(dimensions.spacing.md, isBigScreen ? 18 : 12),
      lg: Math.max(dimensions.spacing.lg, isBigScreen ? 24 : 16),
      xl: Math.max(dimensions.spacing.xl, isBigScreen ? 30 : 20),
    },
    fontSize: {
      small: Math.max(dimensions.fontSize.small, isBigScreen ? 14 : 12),
      medium: Math.max(dimensions.fontSize.medium, isBigScreen ? 16 : 14),
      large: Math.max(dimensions.fontSize.large, isBigScreen ? 18 : 16),
      xlarge: Math.max(dimensions.fontSize.xlarge, isBigScreen ? 26 : 22),
    },
  };

  const FilterModal = () => (
    <Modal visible={showFilter && !isLoading} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          style={styles.modalContainer}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFilter(false)}
          >
            <Ionicons name="close" size={responsiveDimensions.iconSize} color="#7952FC" />
          </TouchableOpacity>

          <View style={styles.filterContent}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE RANGE</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills("priceRanges", filterOptions.priceRanges)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE SORT</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills("priceSort", filterOptions.priceSort)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSTRUMENTS</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills("instruments", filterOptions.instruments)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>GENRES</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills("genres", filterOptions.genres)}
            </View>
          </View>

          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.continueButtonText}>Reset Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.continueButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

 const renderEventCard = (item, index) => {
  const inputRange = [
    (index - 1) * snapToInterval,
    index * snapToInterval,
    (index + 1) * snapToInterval,
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: "clamp",
  });
  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.5, 1, 0.5],
    extrapolate: "clamp",
  });

  const imageSource = item.profileImageUrl
    ? { uri: item.profileImageUrl }
    : require("../assets/Videos/Video.mp4");
  const genre = item.artistType || "PERFORMANCE";
  const price = item.budget ? `₹${item.budget}` : "₹0";

  return (
    <Animated.View
      key={item._id}
      style={[
        styles.eventCard,
        {
          transform: [{ scale }],
          opacity,
          width: responsiveDimensions.cardWidth,
          height: responsiveDimensions.cardHeight,
          marginRight: eventCardMarginRight,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("HostPerfomanceDetails", { artist: item });
        }}
        style={styles.eventCardTouchable}
      >
        <View style={styles.videoContainer}>
          {item.profileImageUrl ? (
            <Image
              source={imageSource}
              style={styles.eventVideo}
              resizeMode="cover"
            />
          ) : (
            <Video
              source={require("../assets/Videos/Video.mp4")}
              style={styles.eventVideo}
              resizeMode="cover"
              repeat={true}
              muted={true}
              paused={false}
              playInBackground={false}
              playWhenInactive={false}
            />
          )}
        </View>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.gradientOverlay}
        />

        <View style={styles.crowdGuaranteeContainer}>
          <Text style={styles.crowdGuaranteeText}>
            {item.isCrowdGuarantee ? "Crowd Guarantee" : ""}
          </Text>
        </View>

        <View style={styles.cardBottomPills}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{genre}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

  const availableWidth =
    width -
    (responsiveDimensions.safeAreaLeft + responsiveDimensions.safeAreaRight);
  const eventCardWidth = responsiveDimensions.cardWidth;
  const eventCardMarginRight = Math.max(
    Math.min(responsiveDimensions.spacing.sm, availableWidth * 0.02),
    8
  );
  const peekingDistance = Math.max(
    (availableWidth - eventCardWidth) / 2,
    Math.max(
      responsiveDimensions.safeAreaLeft,
      responsiveDimensions.safeAreaRight
    ) + responsiveDimensions.spacing.sm
  );
  const snapToInterval = eventCardWidth + eventCardMarginRight;

  const [showDropdowns, setShowDropdowns] = React.useState(false);
  const dropdownButtons = [
    { key: "openmic", label: "Open mic" },
    { key: "launchpad", label: "Launchpad" },
    { key: "proposal", label: "Proposal Curation" },
  ];

  const dropdownAnimations = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const animateDropdowns = (show) => {
    if (!show) {
      dropdownAnimations.forEach((anim) => anim.setValue(0));
      setShowDropdowns(false);
      return;
    }

    setShowDropdowns(true);
    dropdownAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 150,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start();
    });
  };

  const handleCuratedPress = () => {
    animateDropdowns(!showDropdowns);
  };

  // Fallback UI for empty or loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Loading artists...</Text>
      </View>
    );
  }

  // Custom Modal for Alerts
  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={styles.shortlistModalOverlay}>
        <View style={styles.shortlistModalContent}>
          <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : customAlert.title === 'Already Shortlisted' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
          <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
          <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
          <TouchableOpacity
            style={styles.shortlistModalButton}
            onPress={() => {
              if (typeof customAlert.onPress === 'function') {
                customAlert.onPress();
              } else {
                setCustomAlert({ ...customAlert, visible: false });
              }
            }}
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              style={styles.shortlistModalButtonGradient}
            >
              <Text style={styles.shortlistModalButtonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: responsiveDimensions.safeAreaTop,
          paddingLeft: responsiveDimensions.safeAreaLeft,
          paddingRight: responsiveDimensions.safeAreaRight,
          paddingBottom: responsiveDimensions.safeAreaBottom,
        },
      ]}
    >
      <View style={styles.backgroundContainer}>
        <SignUpBackground
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>

      <View
        style={[
          styles.header,
          {
            paddingTop: responsiveDimensions.spacing.md,
            paddingHorizontal: Math.max(
              responsiveDimensions.safeAreaLeft + responsiveDimensions.spacing.md,
              responsiveDimensions.spacing.md
            ),
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, { fontSize: responsiveDimensions.fontSize.xlarge }]}>
            Hello {userData.name || "User"}!
          </Text>
          <Text style={[styles.location, { fontSize: responsiveDimensions.fontSize.medium }]}>
            📍 {deviceLocation}
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => navigation.navigate("HostChatEventList")}
            style={{
              padding: responsiveDimensions.spacing.sm,
              marginRight: responsiveDimensions.spacing.sm,
            }}
          >
            <View style={{ position: 'relative' }}>
              <Icon name="message-circle" size={responsiveDimensions.iconSize} color="#a95eff" />
              {unreadChatCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadChatCount > 99 ? '99+' : unreadChatCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={{ padding: responsiveDimensions.spacing.sm }}
          >
            <View style={{ position: 'relative' }}>
            <NotificationIcon
              width={responsiveDimensions.iconSize}
              height={responsiveDimensions.iconSize + 8}
            />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.buttonWithDropdownContainer,
          {
            marginLeft: Math.max(
              responsiveDimensions.safeAreaLeft + responsiveDimensions.spacing.md,
              responsiveDimensions.spacing.md
            ),
            marginRight: Math.max(
              responsiveDimensions.safeAreaRight + responsiveDimensions.spacing.md,
              responsiveDimensions.spacing.md
            ),
          },
        ]}
      >
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          style={styles.curatedButton}
        >
          <View style={{
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <Text style={[styles.curatedButtonText, { color: "#fff", fontSize: responsiveDimensions.fontSize.medium }]}> 
              Personalised Curated Events by Scenezone 
            </Text>
          </View>
        </LinearGradient>

        {/* {showDropdowns && (
          <View style={styles.dropdownContainer}>
            {dropdownButtons.map((btn, index) => (
              <Animated.View
                key={btn.key}
                style={[
                  styles.dropdownButton,
                  {
                    transform: [
                      {
                        translateY: dropdownAnimations[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                    ],
                    opacity: dropdownAnimations[index],
                    marginBottom: index === dropdownButtons.length - 1 ? 0 : 4,
                  },
                ]}
              >
                <TouchableOpacity style={styles.dropdownButtonTouchable}>
                  <Text style={[styles.dropdownButtonText, { fontSize: responsiveDimensions.fontSize.medium }]}>
                    {btn.label}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )} */}
      </View>

      <View style={{ minHeight: 470, maxHeight: 470, width: '100%', position: 'relative' }}>
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={snapToInterval}
          decelerationRate="fast"
          contentContainerStyle={[
            styles.eventListContainer,
            {
              paddingHorizontal: Math.max(
                peekingDistance + responsiveDimensions.safeAreaLeft,
                peekingDistance
              ),
              paddingTop: responsiveDimensions.spacing.sm,
              paddingBottom: responsiveDimensions.spacing.sm,
            },
          ]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={{ opacity: fadeAnim }}
        >
          {isLoading ? (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
              <Text style={styles.noDataText}>Loading artists...</Text>
            </View>
          ) : filteredArtistData.length === 0 ? null : (
            filteredArtistData.map((item, index) => renderEventCard(item, index))
          )}
        </Animated.ScrollView>
        {(!isLoading && filteredArtistData.length === 0) && (
          <View style={{ position: 'absolute', top: '40%', left: 0, right: 0, alignItems: 'center', zIndex: 10 }}>
            <View style={{
              backgroundColor: 'rgba(30,30,40,0.95)',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 28,
              borderWidth: 1,
              borderColor: '#a95eff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <Text style={[styles.noDataText, { marginTop: 0, fontSize: 16 }]}>No artists available</Text>
            </View>
          </View>
        )}
      </View>

      <View
        style={[
          styles.middleIconsContainer,
          {
            marginTop: responsiveDimensions.spacing.xl + 20,
            marginBottom: responsiveDimensions.spacing.lg + 60,
            paddingBottom: responsiveDimensions.spacing.md,
            paddingHorizontal: responsiveDimensions.spacing.md,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.middleIconButton, styles.middleIconButtonBorder]}
          onPress={() => setShowFilter(true)}
        >
          <Icon name="sliders" size={responsiveDimensions.iconSize} color="#a95eff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.middleIconButton,
            { backgroundColor: "#B15CDE", padding: 1 },
          ]}
          onPress={handleShortlist}
        >
          <View
            style={{
              width: isBigScreen ? 50 : 45,
              height: isBigScreen ? 50 : 45,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: isBigScreen ? 25 : 20,
              backgroundColor: "#B15CDE",
            }}
          >
            <MiddleButton
              width={responsiveDimensions.iconSize}
              height={responsiveDimensions.iconSize}
            />
          </View>
        </TouchableOpacity>
      </View>

      <FilterModal />
      <CustomAlertModal />

      {/* Custom Exit Alert Modal */}
      <Modal
        visible={showExitAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitAlert(false)}
      >
        <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
          <View style={{backgroundColor: '#1a1a1a', borderRadius: 20, padding: 24, width: '100%', maxWidth: 280, alignItems: 'center', borderWidth: 1, borderColor: '#333', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 10}}>
            <View style={{width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255, 107, 107, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 16}}>
              <Ionicons name="exit-outline" size={32} color="#FF6B6B" />
            </View>
            <Text style={{fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 8, textAlign: 'center'}}>Exit App</Text>
            <Text style={{fontSize: 14, color: '#aaa', textAlign: 'center', lineHeight: 22, marginBottom: 24}}>
              Are you sure you want to exit the application?
            </Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', gap: 12}}>
              <TouchableOpacity 
                style={{flex: 1, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#333', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center'}}
                onPress={() => setShowExitAlert(false)}
              >
                <Text style={{color: '#aaa', fontSize: 14, fontWeight: '600'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={{flex: 1, borderRadius: 12, overflow: 'hidden'}}
                onPress={() => {
                  setShowExitAlert(false);
                  BackHandler.exitApp();
                }}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF5252']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{paddingVertical: 14, alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: '#fff', fontSize: 14, fontWeight: '600'}}>Exit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  filterContent: {
    flex: 1,
    paddingTop: dimensions.spacing.lg,
  },
  fixedButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.md,
  },
  noDataText: {
    color: "#fff",
    fontSize: dimensions.fontSize.large,
    textAlign: "center",
    marginTop: dimensions.spacing.xl,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    width: "100%",
    height: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.sm,
    minHeight: dimensions.headerHeight,
    zIndex: 1,
    
  },
  headerContent: {
    flexDirection: "column",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: dimensions.spacing.sm,
  },
  greeting: {
    fontWeight: "bold",
    color: "#a95eff",
  },
  location: {
    color: "#aaa",
    marginTop: dimensions.spacing.xs,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonWithDropdownContainer: {
    position: "relative",
    zIndex: 1,
  },
  curatedButton: {
    backgroundColor: "transparent",
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.large,
    alignItems: "center",
    borderColor: "#B15CDE",
    borderWidth: 1,
    marginBottom: 0,
    minHeight: dimensions.buttonHeight,
    justifyContent: "center",
  },
  curatedButtonText: {
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontWeight: "500",
    lineHeight: dimensions.fontSize.large,
    color: "#B15CDE",
  },
  eventListContainer: {
    paddingVertical: dimensions.spacing.sm,
  },
  eventCard: {
    borderRadius: dimensions.borderRadius.large,
    overflow: "hidden",
    backgroundColor: "#000",
    flexShrink: 0,
  },
  eventCardTouchable: {
    flex: 1,
    position: "relative",
  },
  videoContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    borderRadius: dimensions.borderRadius.nose, 
    overflow: "hidden", 
  },
  eventVideo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    borderRadius: dimensions.borderRadius.nose, // Rounded corners for iPhone-like effect
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%",
  },
  crowdGuaranteeContainer: {
    position: "absolute",
    top: 0,
    alignSelf: "center",
    // backgroundColor: "",
    paddingVertical: dimensions.spacing.xs,
    paddingHorizontal: dimensions.spacing.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: dimensions.borderRadius.xlarge,
    borderBottomRightRadius: dimensions.borderRadius.xlarge,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 1,
  },
  crowdGuaranteeText: {
    color: "#a95eff",
    fontSize: dimensions.fontSize.small,
    fontWeight: "bold",
    marginRight: dimensions.spacing.xs,
  },
  cardBottomPills: {
    position: "absolute",
    bottom: dimensions.spacing.xl,
    left: dimensions.spacing.md,
    right: dimensions.spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 100,
    minHeight: dimensions.spacing.lg,
  },
  pill: {
    backgroundColor: "rgba(25, 25, 25, 0.95)",
    borderRadius: dimensions.borderRadius.medium,
    paddingVertical: dimensions.spacing.xs,
    paddingHorizontal: dimensions.spacing.sm,
    minWidth: 60,
    minHeight: dimensions.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(169, 94, 255, 0.3)",
  },
  pillText: {
    color: "#fff",
    fontSize: dimensions.fontSize.small,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: dimensions.fontSize.medium,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  middleIconsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: dimensions.spacing.md,
  },
  middleIconButton: {
    borderRadius: isBigScreen ? 56 : 32,
    padding: isBigScreen ? dimensions.spacing.xl : dimensions.spacing.md,
    marginHorizontal: dimensions.spacing.md,
    backgroundColor: "transparent",
    minWidth: isBigScreen ? 96 : 56,
    minHeight: isBigScreen ? 96 : 56,
    justifyContent: "center",
    alignItems: "center",
  },
  middleIconButtonBorder: {
    borderColor: "#a95eff",
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: dimensions.borderRadius.xlarge,
    borderTopRightRadius: dimensions.borderRadius.xlarge,
    width: "100%",
    maxWidth: isBigScreen ? 500 : 393,
    height: isBigScreen ? 500 : 450,
    paddingTop: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingBottom: dimensions.spacing.sm,
    alignSelf: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: -15,
    right: 30,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: dimensions.borderRadius.medium,
    padding: dimensions.spacing.sm,
    width: isBigScreen ? 48 : 40,
    height: isBigScreen ? 48 : 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: dimensions.fontSize.medium,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: dimensions.spacing.sm,
  },
  pillOption: {
    height: dimensions.buttonHeight * 0.8,
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: dimensions.borderRadius.xlarge,
    marginRight: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.sm,
    flexShrink: 1,
    minWidth: 60,
  },
  pillOptionActive: {
    backgroundColor: "#fff",
  },
  pillOptionText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: dimensions.fontSize.small,
    fontFamily: "Nunito Sans",
    textAlign: "center",
    flexShrink: 1,
  },
  pillOptionTextActive: {
    color: "#7952FC",
  },
  continueButton: {
    width: "48%",
    maxWidth: 180,
    height: dimensions.buttonHeight,
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: dimensions.borderRadius.medium,
    backgroundColor: "transparent",
  },
  resetButton: {
    width: "48%",
    maxWidth: 180,
    height: dimensions.buttonHeight,
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: dimensions.borderRadius.medium,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: dimensions.fontSize.medium,
    fontFamily: "Nunito Sans",
  },
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: dimensions.spacing.xs,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  dropdownButton: {
    backgroundColor: "#fff",
    borderRadius: dimensions.borderRadius.large,
    borderWidth: 1,
    borderColor: "#B15CDE",
    overflow: "hidden",
  },
  dropdownButtonTouchable: {
    paddingVertical: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: dimensions.buttonHeight,
  },
  dropdownButtonText: {
    color: "#a95eff",
    fontSize: dimensions.fontSize.medium,
    fontWeight: "500",
    fontFamily: "Nunito Sans",
  },
  shortlistModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  shortlistModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 28,
    width: '85%',
    maxWidth: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  shortlistModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#a95eff',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
  },
  shortlistModalMessage: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: 'Nunito Sans',
  },
  shortlistModalButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  shortlistModalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  shortlistModalButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
  },
});
export default HomeScreen;



