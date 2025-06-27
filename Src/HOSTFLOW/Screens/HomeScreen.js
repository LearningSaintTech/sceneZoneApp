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
  }
};

const HomeScreen = ({ navigation }) => {
  const [showFilter, setShowFilter] = React.useState(false);
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const fullName = useSelector(selectFullName);
  const location = useSelector(selectLocation);
console.log("token",token)
  // For selected pills in each section
  const [selected, setSelected] = React.useState({
    filter: 'Today',
    price: 'Low - High',
    instrument: 'Acoustic Guitar',
    genre: 'Soul Queen',
  });

  const [artistData, setArtistData] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await axios.get('http://192.168.1.8:3000/api/artist/get-all-artists', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success) {
          setArtistData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching artists:', error);
        setArtistData([]);
      }
    };
    fetchArtists();
  }, [token]);

  const handleShortlist = async () => {
    console.log('--- Shortlist Button Pressed ---');

    if (!artistData || artistData.length === 0) {
      console.log('No artist data available to shortlist.');
      Alert.alert('No Artists', 'There are no artists to shortlist.');
      return;
    }
    console.log(`Current artist index: ${currentIndex}`);

    const artist = artistData[currentIndex];
    if (!artist || !artist.artistId) {
      console.log('Could not find artist or artistId at the current index.');
      Alert.alert('Error', 'Could not find artist to shortlist.');
      return;
    }
    console.log('Artist object to shortlist:', artist);

    const artistId = artist.artistId;
    const url = 'http://192.168.1.8:3000/api/host/shortlistArtist';
    const body = { artistId };
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    console.log(`Preparing to shortlist artist with ID: ${artistId}`);
    console.log('API Endpoint:', url);
    console.log('Request Body:', JSON.stringify(body, null, 2));
    console.log('Request Headers:', JSON.stringify(config.headers, null, 2));

    try {
      const response = await axios.post(url, body, config);

      console.log('--- API Response Received ---');
      console.log('Response Status:', response.status);
      console.log('Response Data:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        console.log('Successfully shortlisted artist.');
        Alert.alert('Success', 'Artist shortlisted successfully!');
      } else {
        console.log(`API returned success=false. Message: ${response.data.message}`);
        Alert.alert('Error', response.data.message || 'Could not shortlist the artist.');
      }
    } catch (error) {
      // Check for "Artist already shortlisted." error
      if (
        error.response &&
        error.response.data &&
        error.response.data.message === 'Artist already shortlisted.'
      ) {
        Alert.alert('Already Shortlisted', 'Artist already in shortlist.');
      } else {
        console.log('--- API Call Failed ---');
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
          console.error('Error Response Status:', error.response.status);
          console.error('Error Response Headers:', JSON.stringify(error.response.headers, null, 2));
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error Request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error Message:', error.message);
        }
        console.error('Full Error Object:', error);
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

  const filterOptions = {
    filter: ['Near - Far', 'Far - Near', 'Today', 'This Week' ,'This Weekend','Next Weekend','1km-3km','3km-5km','5km+'],
    price: ['Low - High', 'High - Low', 'Tickets under ₹1000','₹1000-₹2000','₹2000-₹3000','₹3000+'],
    instrument: ['Electric Guitar', 'Saxophone', 'Acoustic Guitar', 'Synthesizer','Drum Machine','Banjo','Trumpet','Turntables'],
    type: ['Musician', 'Comedian', 'Magician', 'Anchor','Dancer','Poet','Dj','Other'],
  };

  // Enhanced responsive dimensions with comprehensive safe area considerations
  const responsiveDimensions = {
    ...dimensions,
    safeAreaTop: Math.max(insets.top, 0),
    safeAreaBottom: Math.max(insets.bottom, 0),
    safeAreaLeft: Math.max(insets.left, 0),
    safeAreaRight: Math.max(insets.right, 0),
    // Dynamic header height based on device and safe areas
    headerHeight: Math.max(
      dimensions.headerHeight + insets.top * 0.3, 
      width >= 768 ? 100 : 80
    ),
    // Enhanced container padding that adapts to safe areas and device type
    containerPadding: {
      horizontal: Math.max(
        insets.left + insets.right + dimensions.spacing.md, 
        width >= 768 ? dimensions.spacing.lg : dimensions.spacing.md
      ),
      vertical: Math.max(
        insets.top + insets.bottom + dimensions.spacing.sm, 
        dimensions.spacing.sm
      ),
    },
    // Device-specific spacing adjustments
    spacing: {
      xs: Math.max(dimensions.spacing.xs, width >= 768 ? 6 : 4),
      sm: Math.max(dimensions.spacing.sm, width >= 768 ? 12 : 8),
      md: Math.max(dimensions.spacing.md, width >= 768 ? 18 : 12),
      lg: Math.max(dimensions.spacing.lg, width >= 768 ? 24 : 16),
      xl: Math.max(dimensions.spacing.xl, width >= 768 ? 30 : 20),
    },
    // Responsive font sizes
    fontSize: {
      small: Math.max(dimensions.fontSize.small, width >= 768 ? 14 : 12),
      medium: Math.max(dimensions.fontSize.medium, width >= 768 ? 16 : 14),
      large: Math.max(dimensions.fontSize.large, width >= 768 ? 18 : 16),
      xlarge: Math.max(dimensions.fontSize.xlarge, width >= 768 ? 26 : 22),
    },
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
          colors={['#B15CDE', '#7952FC']}
          style={styles.modalContainer}
        >
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setShowFilter(false)}
          >
            <Ionicons name="close" size={24} color="#7952FC" />
          </TouchableOpacity>

          {/* Filter Content - No Scroll, Compact Layout */}
          <View style={styles.filterContent}>
            {/* FILTER Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>FILTER</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('filter')}
            </View>

            {/* PRICE Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>PRICE</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('price')}
            </View>

            {/* INSTRUMENT Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>INSTRUMENT</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('instrument')}
            </View>

            {/* GENRE Section */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>GENRE</Text>
                <Icon name="chevron-right" size={20} color="#fff" />
              </View>
              {renderPills('type')}
            </View>
          </View>

          {/* Fixed Continue Button */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity 
              style={styles.continueButton} 
              onPress={() => setShowFilter(false)}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );

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

    // Use artist data for image, genre, and price
    const imageSource = item.profileImageUrl ? { uri: item.profileImageUrl } : require('../assets/Videos/Video.mp4');
    const genre = Array.isArray(item.genre) && item.genre.length > 0 ? item.genre[0] : 'PERFORMANCE';
    const price = item.budget ? `$${item.budget}` : '$0';

    return (
      <Animated.View style={[
        styles.eventCard, 
        { 
          transform: [{ scale }], 
          opacity,
          width: dimensions.cardWidth,
          height: 540,
        }
      ]}>
        <TouchableOpacity onPress={() => {
          console.log('Navigating to HostPerfomanceDetails with artistId:', item.artistId);
          navigation.navigate('HostPerfomanceDetails');
        }} style={styles.eventCardTouchable}>
          <View style={styles.videoContainer}>
            {/* If image is a video, use Video component, else use Image */}
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

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradientOverlay}
        />

        <View style={styles.crowdGuaranteeContainer}>
          <Text style={styles.crowdGuaranteeText}>Crowd Guarante</Text>
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

  // Calculate snap interval for FlatList swiper effect with safe area considerations
  // Event card sizing to match the design - main card prominent with side peeking
  const availableWidth = width - (responsiveDimensions.safeAreaLeft + responsiveDimensions.safeAreaRight);
  const availableHeight = height - (responsiveDimensions.safeAreaTop + responsiveDimensions.safeAreaBottom);
  
  // Enhanced responsive card width calculation
  const baseCardWidthPercentage = width >= 768 ? 0.7 : 0.8; // Different percentages for tablets vs phones
  const eventCardWidth = 235; // Thin rectangle
  const eventCardHeight = 430; // Long height
  
  // Responsive margin based on screen size and safe areas
  const eventCardMarginRight = Math.max(
    Math.min(dimensions.spacing.sm, availableWidth * 0.02), // 2% of available width or minimum spacing
    8
  );
  
  // Enhanced peeking distance calculation with safe area consideration
  const basePeekingDistance = (availableWidth - eventCardWidth) / 2;
  const peekingDistance = Math.max(
    basePeekingDistance,
    Math.max(responsiveDimensions.safeAreaLeft, responsiveDimensions.safeAreaRight) + dimensions.spacing.sm
  );
  
  const snapToInterval = eventCardWidth + eventCardMarginRight;

  const scrollX = React.useRef(new Animated.Value(0)).current;

  // Dropdown/Accordion state and data
  const [showDropdowns, setShowDropdowns] = React.useState(false);
  const dropdownButtons = [
    { key: 'openmic', label: 'Open mic' },
    { key: 'launchpad', label: 'Launchpad' },
    { key: 'proposal', label: 'proposal curation' },
  ];

  const dropdownAnimations = React.useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  const animateDropdowns = (show) => {
    // Reset animations if hiding
    if (!show) {
      dropdownAnimations.forEach(anim => anim.setValue(0));
      setShowDropdowns(false);
      return;
    }

    setShowDropdowns(true);
    // Animate each dropdown item with a delay
    dropdownAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * 150, // 150ms delay between each item
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic)
      }).start();
    });
  };

  // Update the button press handler
  const handleCuratedPress = () => {
    animateDropdowns(!showDropdowns);
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: responsiveDimensions.safeAreaTop,
        paddingLeft: responsiveDimensions.safeAreaLeft,
        paddingRight: responsiveDimensions.safeAreaRight,
        paddingBottom: responsiveDimensions.safeAreaBottom,
      }
    ]}>
      {/* Background SVG */}
      <View style={styles.backgroundContainer}>
        <SignUpBackground 
          width={width} 
          height={height}
          preserveAspectRatio="xMidYMid slice"
        />
      </View>
      
      {/* Header */}
      <View style={[
        styles.header, 
        { 
          paddingTop: Math.max(dimensions.spacing.md, 15),
          paddingHorizontal: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.md),
          paddingLeft: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.md),
          paddingRight: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.md),
        }
      ]}>
        <View>
          <Text style={styles.greeting}>Hello {fullName || 'User'}!</Text>
          <Text style={styles.location}>📍 {location || 'Location'}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Notification')} 
          style={{ 
            padding: dimensions.spacing.sm, // Add touch area
          }}
        >
          <NotificationIcon width={28} height={36} />
        </TouchableOpacity>
      </View>

      {/* Button Container with Dropdown */}
      <View style={[
        styles.buttonWithDropdownContainer,
        {
          marginLeft: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.md),
          marginRight: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.md),
        }
      ]}>
        {showDropdowns ? (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            style={styles.curatedButton}
          >
            <TouchableOpacity 
              style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}} 
              onPress={handleCuratedPress}
              activeOpacity={0.8}
            >
              <Text style={[styles.curatedButtonText, { color: '#fff' }]}>Personalised Curated Events by Scenezone</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity 
            style={styles.curatedButton} 
            onPress={handleCuratedPress}
            activeOpacity={0.8}
          >
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
                    transform: [{
                      translateY: dropdownAnimations[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0]
                      })
                    }],
                    opacity: dropdownAnimations[index],
                    marginBottom: index === dropdownButtons.length - 1 ? 0 : 4
                  }
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

      {/* Horizontal Event List */}
      <Animated.FlatList
        data={artistData}
        renderItem={renderEventCard}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={snapToInterval}
        decelerationRate={"fast"}
        pagingEnabled
        contentContainerStyle={[
          styles.eventListContainer, 
          { 
            paddingHorizontal: Math.max(peekingDistance + responsiveDimensions.safeAreaLeft, peekingDistance),
            paddingTop: 8,
            paddingBottom: 8,
            paddingLeft: Math.max(peekingDistance + responsiveDimensions.safeAreaLeft, peekingDistance),
            paddingRight: Math.max(peekingDistance + responsiveDimensions.safeAreaRight, peekingDistance),
          }
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />

      {/* Middle Icons */}
      <View style={[
        styles.middleIconsContainer,
        {
          marginTop: Math.max(dimensions.spacing.xl + 20, 40), // Increased margin to shift buttons down
          marginBottom: Math.max(dimensions.spacing.lg + 60, 90), // Increased from 80 to 100 and 110 to 130
          paddingBottom: Math.max(dimensions.spacing.md, 10),
          paddingHorizontal: Math.max(dimensions.spacing.md, dimensions.spacing.md),
          paddingLeft: Math.max(dimensions.spacing.md, dimensions.spacing.md),
          paddingRight: Math.max(dimensions.spacing.md, dimensions.spacing.md),
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }
      ]}>
        <TouchableOpacity
          style={[styles.middleIconButton, styles.middleIconButtonBorder]}
          onPress={() => setShowFilter(true)}
        >
          <Icon name="sliders" size={20} color="#a95eff" />
        </TouchableOpacity>

        {/* New button with MiddleButton icon */}
        <TouchableOpacity
          style={[styles.middleIconButton, { backgroundColor: '#B15CDE', padding: 1 }]}
          onPress={handleShortlist}
        >
          <View style={{ 
            width: 45,
            height: 45,
            justifyContent: 'center', 
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: '#B15CDE'
          }}>
            <MiddleButton width={28} height={28} />
          </View>
        </TouchableOpacity>

      </View>

      {/* Bottom Navigation Bar */}

      <FilterModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
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

  // Middle Icons styles
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
  middleIconButtonActive: {
    backgroundColor: '#a95eff',
  },

  // Bottom Navigation Bar styles
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingVertical: 4,
    paddingBottom: Platform.OS === 'ios' ? 45 : 25,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 4,
  },
  navButtonActive: {
    backgroundColor: 'rgba(169, 94, 255, 0.2)',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa',
    marginTop: 4,
  },
  navButtonTextActive: {
    color: '#a95eff',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 3,
    backgroundColor: '#a95eff',
    borderRadius: 1.5,
    marginBottom: 5,
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
    height: 400,
    maxHeight: 450,
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
    width: '100%',
    maxWidth: 361,
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
  dropdownContent: {
    backgroundColor: '#f3eaff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1,
    borderColor: '#a95eff',
    marginHorizontal: 8,
    marginTop: -8,
    marginBottom: 8,
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  actionButton: {
    borderRadius: 16,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollContent: {
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
  },
  filterContent: {
    flex: 0,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
    marginBottom: 0,
  },
  sectionContainer: {
    marginBottom: 0,
    width: '100%',
    paddingVertical: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterScrollContent: {
    flex: 1,
  },
  filterContentContainer: {
    paddingHorizontal: 0,
    paddingTop: 50,
    paddingBottom: 10,
  },
  fixedButtonContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;

