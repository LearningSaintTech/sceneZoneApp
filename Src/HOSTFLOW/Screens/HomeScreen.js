import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Modal,
  Animated,
  Platform,
  Easing,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiddleButton from '../assets/icons/MiddleButton';
import NotificationIcon from '../assets/icons/NotificationIcon';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectFullName, selectLocation } from '../Redux/slices/authSlice';

const { width, height } = Dimensions.get('window');
const isBigScreen = width >= 600;

// Even bigger card for big screens
const cardWidth = isBigScreen ? Math.min(width * 0.7, 520) : Math.min(width * 0.85, 235);
const cardHeight = isBigScreen ? Math.round(cardWidth * 1.7) : 540;
const buttonHeight = isBigScreen ? 60 : 52;

// All fixed values for pixel-perfect design
const dimensions = {
  cardWidth,
  cardHeight,
  headerHeight: 80,
  buttonHeight,
  iconSize: 24,
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
    xlarge: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  fontSize: {
    small: 12,
    medium: 14,
    large: 16,
    xlarge: 22,
  },
};

const HomeScreen = ({ navigation }) => {
  const [showFilter, setShowFilter] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector(selectFullName);
  const location = useSelector(selectLocation);

  // Updated selected state to match server payload structure
  const [selected, setSelected] = React.useState({
    price: { ranges: [], sort: 'low-high' }, // e.g., { ranges: ["1000-2000"], sort: "low-high" }
    instruments: [], // e.g., ["Guitar", "Piano"]
    genres: [], // e.g., ["Rock", "Jazz"]
  });

  const [artistData, setArtistData] = React.useState([]);
  const [filteredArtistData, setFilteredArtistData] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const limit = 10;

  // Filter options aligned with server expectations
  const filterOptions = {
    priceRanges: ['under-1000', '1000-2000', '2000-3000', '3000-above'],
    priceSort: ['low-high', 'high-low'],
    instruments: ['Guitar', 'Saxophone', 'Piano', 'Drums', 'Trumpet', 'Banjo', 'Synthesizer'],
    genres: ['Rock', 'Jazz', 'Pop', 'Classical', 'Hip-Hop', 'Soul'],
  };

  // Fetch artists using the filter API
  React.useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          console.error('No token provided for artist fetch');
          Alert.alert('Error', 'Authentication token is missing');
          return;
        }

        // Construct filter payload
        const filterPayload = {
          price: selected.price.ranges.length > 0 || selected.price.sort ? selected.price : undefined,
          instruments: selected.instruments.length > 0 ? selected.instruments : undefined,
          genres: selected.genres.length > 0 ? selected.genres : undefined,
          page: page,
          limit: limit,
        };

        console.log('Fetching artists from:', 'http://192.168.1.52:3000/api/host/filter');
        console.log('Request Headers:', JSON.stringify({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }, null, 2));
        console.log('Request Body:', JSON.stringify(filterPayload, null, 2));
        console.log('Token:', token);

        const response = await axios.post('http://192.168.1.52:3000/api/host/filter', filterPayload, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });

        console.log('API Response:', JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          setArtistData(response.data.data.artists || []);
          setFilteredArtistData(response.data.data.artists || []);
          console.log('Fetched Artist Data:', JSON.stringify(response.data.data.artists, null, 2));
        } else {
          console.log('API returned success=false:', response.data.message);
          setArtistData([]);
          setFilteredArtistData([]);
          Alert.alert('Error', response.data.message || 'Failed to fetch artists.');
        }
      } catch (error) {
        console.error('Error fetching artists:', {
          message: error.message,
          status: error.response?.status,
          response: error.response ? JSON.stringify(error.response.data, null, 2) : null,
          request: error.request ? JSON.stringify(error.request, null, 2) : null,
        });
        setArtistData([]);
        setFilteredArtistData([]);
        Alert.alert('Error', error.response?.status === 404
          ? 'Artist filter endpoint not found. Please check if the server is running and the endpoint is correctly configured.'
          : error.message === 'Network Error'
            ? 'Unable to connect to the server. Please ensure the server is running at http://192.168.1.52:3000.'
            : 'Failed to fetch artists. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, [token, selected, page]);

  // Log state updates for debugging
  React.useEffect(() => {
    console.log('Updated artistData:', JSON.stringify(artistData, null, 2));
    console.log('Updated filteredArtistData:', JSON.stringify(filteredArtistData, null, 2));
  }, [artistData, filteredArtistData]);

  const handleShortlist = async () => {
    console.log('--- Shortlist Button Pressed ---');

    if (!filteredArtistData || filteredArtistData.length === 0) {
      console.log('No artist data available to shortlist.');
      Alert.alert('No Artists', 'There are no artists to shortlist.');
      return;
    }

    console.log('Filtered Artist Data:', JSON.stringify(filteredArtistData, null, 2));
    console.log('Current Index:', currentIndex);

    const artist = filteredArtistData[currentIndex];
    if (!artist || !artist.artistId) {
      console.log('Could not find artist or artistId at the current index.');
      Alert.alert('Error', 'Could not find artist to shortlist.');
      return;
    }

    const artistId = artist.artistId;
    if (!artistId) {
      console.error('Invalid artistId:', artistId);
      Alert.alert('Error', 'Invalid artist ID.');
      return;
    }
    if (!token) {
      console.error('No token provided for shortlist');
      Alert.alert('Error', 'Authentication token is missing');
      return;
    }

    const url = 'http://192.168.1.52:3000/api/host/shortlistArtist';
    const body = { artistId };
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    console.log('Artist object to shortlist:', JSON.stringify(artist, null, 2));
    console.log(`Preparing to shortlist artist with ID: ${artistId}`);
    console.log('API Endpoint:', url);
    console.log('Request Body:', JSON.stringify(body, null, 2));
    console.log('Request Headers:', JSON.stringify(config.headers, null, 2));

    try {
      const response = await axios.post(url, body, config);

      console.log('--- API Response Received ---');
      console.log('Response Status:', response.status);
      console.log('Shortlist Success Response:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        console.log('Successfully shortlisted artist.');
        Alert.alert('Success', 'Artist shortlisted successfully!');
        setFilteredArtistData((prev) =>
          prev.map((item, index) =>
            index === currentIndex ? { ...item, isShortlisted: true } : item
          )
        );
      } else {
        console.log(`API returned success=false. Message: ${response.data.message}`);
        Alert.alert('Error', response.data.message || 'Could not shortlist the artist.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === 'Artist already shortlisted.') {
        console.log('Artist already shortlisted.');
        Alert.alert('Already Shortlisted', 'Artist already in shortlist.');
      } else {
        console.error('Shortlist API Error:', {
          message: error.message,
          response: error.response ? JSON.stringify(error.response.data, null, 2) : null,
          request: error.request ? error.request : null,
        });
        Alert.alert('Error', 'An error occurred while shortlisting. Please try again.');
      }
    }
  };

  const onViewableItemsChanged = React.useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== null && newIndex !== undefined) {
        setCurrentIndex(newIndex);
      }
    }
  }, []);

  const viewabilityConfig = React.useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  // Handle filter selection
  const handleFilterSelect = (category, value) => {
    setSelected((prev) => {
      if (category === 'priceRanges') {
        return {
          ...prev,
          price: { ...prev.price, ranges: prev.price.ranges.includes(value)
            ? prev.price.ranges.filter((r) => r !== value) // Toggle off
            : [...prev.price.ranges, value] // Toggle on
          },
        };
      } else if (category === 'priceSort') {
        return {
          ...prev,
          price: { ...prev.price, sort: value },
        };
      } else if (category === 'instruments') {
        return {
          ...prev,
          instruments: prev.instruments.includes(value)
            ? prev.instruments.filter((i) => i !== value) // Toggle off
            : [...prev.instruments, value] // Toggle on
        };
      } else if (category === 'genres') {
        return {
          ...prev,
          genres: prev.genres.includes(value)
            ? prev.genres.filter((g) => g !== value) // Toggle off
            : [...prev.genres, value] // Toggle on
        };
      }
      return prev;
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelected({
      price: { ranges: [], sort: 'low-high' },
      instruments: [],
      genres: [],
    });
    setPage(1); // Reset page for new fetch
  };

  // Render filter pills
  const renderPills = (category, options) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map((option) => {
        const isSelected = category === 'priceSort'
          ? selected.price.sort === option
          : category === 'priceRanges'
            ? selected.price.ranges.includes(option)
            : selected[category].includes(option);
        return (
          <TouchableOpacity
            key={option}
            style={[styles.pillOption, isSelected && styles.pillOptionActive]}
            onPress={() => handleFilterSelect(category, option)}
          >
            <Text style={[styles.pillOptionText, isSelected && styles.pillOptionTextActive]}>
              {option.replace('under-1000', 'Under $1000').replace('1000-2000', '$1000-$2000').replace('2000-3000', '$2000-$3000').replace('3000-above', '$3000+').replace('low-high', 'Low - High').replace('high-low', 'High - Low')}
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
    headerHeight: Math.max(dimensions.headerHeight + insets.top * 0.3, width >= 768 ? 100 : 80),
    containerPadding: {
      horizontal: Math.max(insets.left + insets.right + dimensions.spacing.md, width >= 768 ? dimensions.spacing.lg : dimensions.spacing.md),
      vertical: Math.max(insets.top + insets.bottom + dimensions.spacing.sm, dimensions.spacing.sm),
    },
    spacing: {
      xs: Math.max(dimensions.spacing.xs, width >= 768 ? 6 : 4),
      sm: Math.max(dimensions.spacing.sm, width >= 768 ? 12 : 8),
      md: Math.max(dimensions.spacing.md, width >= 768 ? 18 : 12),
      lg: Math.max(dimensions.spacing.lg, width >= 768 ? 24 : 16),
      xl: Math.max(dimensions.spacing.xl, width >= 768 ? 30 : 20),
    },
    fontSize: {
      small: Math.max(dimensions.fontSize.small, width >= 768 ? 14 : 12),
      medium: Math.max(dimensions.fontSize.medium, width >= 768 ? 16 : 14),
      large: Math.max(dimensions.fontSize.large, width >= 768 ? 18 : 16),
      xlarge: Math.max(dimensions.fontSize.xlarge, width >= 768 ? 26 : 22),
    },
  };

  const FilterModal = () => (
    <Modal visible={showFilter} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <LinearGradient colors={['#B15CDE', '#7952FC']} style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowFilter(false)}>
            <Ionicons name="close" size={24} color="#7952FC" />
          </TouchableOpacity>

          <View style={styles.filterContent}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE RANGE</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('priceRanges', filterOptions.priceRanges)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE SORT</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('priceSort', filterOptions.priceSort)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSTRUMENTS</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('instruments', filterOptions.instruments)}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>GENRES</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('genres', filterOptions.genres)}
            </View>
          </View>

          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.continueButtonText}>Reset Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.continueButton} onPress={() => setShowFilter(false)}>
              <Text style={styles.continueButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

  const renderEventCard = ({ item, index }) => {
    const inputRange = [(index - 1) * snapToInterval, index * snapToInterval, (index + 1) * snapToInterval];
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

    const imageSource = item.profileImageUrl ? { uri: item.profileImageUrl } : require('../assets/Videos/Video.mp4');
    const genre = item.artistType || 'PERFORMANCE';
    const price = item.budget ? `$${item.budget}` : '$0';

    return (
      <Animated.View
        style={[styles.eventCard, { transform: [{ scale }], opacity, width: dimensions.cardWidth, height: 540 }]}
      >
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to HostPerfomanceDetails with artist:', item);
            navigation.navigate('HostPerfomanceDetails', { artist: item });
          }}
          style={styles.eventCardTouchable}
        >
          <View style={styles.videoContainer}>
            {item.profileImageUrl ? (
              <Image source={imageSource} style={styles.eventVideo} resizeMode="cover" />
            ) : (
              <Video
                source={require('../assets/Videos/Video.mp4')}
                style={styles.eventVideo}
                resizeMode="cover"
                repeat={true}
                muted={true}
                paused={false}
                playInBackground={false}
                playWhenInactive={false}
                onError={(error) => console.log('Video Error:', error)}
                onLoad={(data) => console.log('Video Loaded:', data)}
              />
            )}
          </View>

          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.gradientOverlay} />

          <View style={styles.crowdGuaranteeContainer}>
            <Text style={styles.crowdGuaranteeText}>{item.isCrowdGuarantee ? 'Crowd Guarantee' : ''}</Text>
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

  const availableWidth = width - (responsiveDimensions.safeAreaLeft + responsiveDimensions.safeAreaRight);
  const eventCardWidth = 235;
  const eventCardMarginRight = Math.max(Math.min(dimensions.spacing.sm, availableWidth * 0.02), 8);
  const peekingDistance = Math.max(
    (availableWidth - eventCardWidth) / 2,
    Math.max(responsiveDimensions.safeAreaLeft, responsiveDimensions.safeAreaRight) + dimensions.spacing.sm
  );
  const snapToInterval = eventCardWidth + eventCardMarginRight;

  const scrollX = React.useRef(new Animated.Value(0)).current;

  const [showDropdowns, setShowDropdowns] = React.useState(false);
  const dropdownButtons = [
    { key: 'openmic', label: 'Open mic' },
    { key: 'launchpad', label: 'Launchpad' },
    { key: 'proposal', label: 'Proposal Curation' },
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

  if (filteredArtistData.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>No artists available</Text>
      </View>
    );
  }

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
        <SignUpBackground width={width} height={height} preserveAspectRatio="xMidYMid slice" />
      </View>

      <View
  style={[
    styles.header,
    {
      paddingTop: Math.max(dimensions.spacing.md, 15),
      paddingHorizontal: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.md),
    },
  ]}
>
  <View>
    <Text style={styles.greeting}>Hello {fullName || 'User'}!</Text>
    <Text style={styles.location}>📍 {location || 'Location'}</Text>
  </View>
  <View style={styles.headerIcons}>
    <TouchableOpacity
      onPress={() => navigation.navigate('HostChatEventList')}
      style={{ padding: dimensions.spacing.sm, marginRight: dimensions.spacing.sm }}
    >
      <Icon name="message-circle" size={28} color="#a95eff" />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => navigation.navigate('Notification')}
      style={{ padding: dimensions.spacing.sm }}
    >
      <NotificationIcon width={28} height={36} />
    </TouchableOpacity>
  </View>
</View>

      <View
        style={[
          styles.buttonWithDropdownContainer,
          {
            marginLeft: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.md),
            marginRight: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.md),
          },
        ]}
      >
        {showDropdowns ? (
          <LinearGradient colors={['#B15CDE', '#7952FC']} style={styles.curatedButton}>
            <TouchableOpacity
              style={{ flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' }}
              onPress={handleCuratedPress}
              activeOpacity={0.8}
            >
              <Text style={[styles.curatedButtonText, { color: '#fff' }]}>
                Personalised Curated Events by Scenezone
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity style={styles.curatedButton} onPress={handleCuratedPress} activeOpacity={0.8}>
            <Text style={styles.curatedButtonText}>Personalised Curated Events by Scenezone</Text>
          </TouchableOpacity>
        )}

        {showDropdowns && (
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
                  <Text style={styles.dropdownButtonText}>{btn.label}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      <Animated.FlatList
        data={filteredArtistData}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapToInterval}
        decelerationRate={'fast'}
        pagingEnabled
        contentContainerStyle={[
          styles.eventListContainer,
          {
            paddingHorizontal: Math.max(peekingDistance + responsiveDimensions.safeAreaLeft, peekingDistance),
            paddingTop: 8,
            paddingBottom: 8,
          },
        ]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      <View
        style={[
          styles.middleIconsContainer,
          {
            marginTop: Math.max(dimensions.spacing.xl + 20, 40),
            marginBottom: Math.max(dimensions.spacing.lg + 60, 90),
            paddingBottom: Math.max(dimensions.spacing.md, 10),
            paddingHorizontal: Math.max(dimensions.spacing.md, dimensions.spacing.md),
            position: 'absolute',
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
          <Icon name="sliders" size={20} color="#a95eff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.middleIconButton, { backgroundColor: '#B15CDE', padding: 1 }]}
          onPress={handleShortlist}
        >
          <View
            style={{
              width: 45,
              height: 45,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 20,
              backgroundColor: '#B15CDE',
            }}
          >
            <MiddleButton width={28} height={28} />
          </View>
        </TouchableOpacity>
      </View>

      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 12,
    minHeight: 80,
    zIndex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#a95eff',
  },
  location: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  buttonWithDropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  curatedButton: {
    backgroundColor: 'transparent',
    padding: 12,
    borderRadius: 17,
    alignItems: 'center',
    borderColor: '#B15CDE',
    borderWidth: 1,
    marginBottom: 0,
    minHeight: 44,
    justifyContent: 'center',
  },
  curatedButtonText: {
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: '#B15CDE',
  },
  eventListContainer: {
    paddingVertical: 8,
  },
  eventCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    backgroundColor: '#000',
    width: dimensions.cardWidth,
    height: 540,
    flexShrink: 0,
  },
  eventCardTouchable: {
    flex: 1,
    position: 'relative',
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  eventVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
  },
  crowdGuaranteeContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 4,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  crowdGuaranteeText: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  cardBottomPills: {
    position: 'absolute',
    bottom: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 100,
    minHeight: 24,
  },
  pill: {
    backgroundColor: 'rgba(25, 25, 25, 0.95)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    minWidth: 60,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(169, 94, 255, 0.3)',
  },
  pillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  middleIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  middleIconButton: {
    borderRadius: isBigScreen ? 56 : 32,
    padding: isBigScreen ? 36 : 18,
    marginHorizontal: 18,
    backgroundColor: 'transparent',
    minWidth: isBigScreen ? 96 : 56,
    minHeight: isBigScreen ? 96 : 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleIconButtonBorder: {
    borderColor: '#a95eff',
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxWidth: 393,
    height: 450,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 8,
    alignSelf: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: 30,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 0,
    marginBottom: 8,
  },
  pillOption: {
    height: 32,
    paddingHorizontal: 12,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    marginRight: 8,
    marginBottom: 8,
    flexShrink: 1,
    minWidth: 60,
  },
  pillOptionActive: {
    backgroundColor: '#fff',
  },
  pillOptionText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
    fontFamily: 'Nunito Sans',
    textAlign: 'center',
    flexShrink: 1,
  },
  pillOptionTextActive: {
    color: '#7952FC',
  },
  continueButton: {
    width: '48%',
    maxWidth: 180,
    height: dimensions.buttonHeight,
    paddingHorizontal: 16,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  resetButton: {
    width: '48%',
    maxWidth: 180,
    height: dimensions.buttonHeight,
    paddingHorizontal: 16,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    fontFamily: 'Nunito Sans',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  dropdownButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B15CDE',
    overflow: 'hidden',
  },
  dropdownButtonTouchable: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  dropdownButtonText: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Nunito Sans',
  },
});

export default HomeScreen;