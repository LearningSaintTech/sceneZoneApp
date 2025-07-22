import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator, Animated, BackHandler, Modal as RNModal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken, removeAppliedEvent } from '../Redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for trash icon
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome for star icon
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import LinearGradient from 'react-native-linear-gradient';
import HapticFeedback from 'react-native-haptic-feedback';
import AppliedIcon from '../assets/icons/Applied';
import SignUpBackground from '../assets/Banners/SignUp';
import api from '../Config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaskedView from '@react-native-masked-view/masked-view';
import ArtistExploreEvent from './ArtistExploreEvent';

const { width, height } = Dimensions.get('window');

// Haptic feedback options
const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

// Safe haptic feedback function
const triggerHaptic = (type) => {
  try {
    HapticFeedback.trigger(type, hapticOptions);
  } catch (error) {
    console.log('Haptic feedback not available:', error);
    // Silently fail - don't show error to user
  }
};

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
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 5),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  cardImageHeight: Math.max(height * 0.18, 150),
  cardPadding: Math.max(width * 0.03, 12),
  headerHeight: Math.max(height * 0.08, 60),
};

// MusicBeatsLoader: Animated music bars loader
const MusicBeatsLoader = () => {
  const barAnims = [React.useRef(new Animated.Value(1)).current, React.useRef(new Animated.Value(1)).current, React.useRef(new Animated.Value(1)).current];

  React.useEffect(() => {
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

const ArtistAppliedScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('applied');
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locallyAppliedFromSaved, setLocallyAppliedFromSaved] = useState(new Set());
  const [likedEventIds, setLikedEventIds] = useState(new Set());
  const [likingEventId, setLikingEventId] = useState(null);
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userData = useSelector(state => state.auth.userData);

  // Debug function to test API connectivity
  const testAPIConnectivity = async () => {
    console.log('🧪 Testing API connectivity...');
    console.log('📍 API Base URL:', api.defaults.baseURL);
    console.log('🔑 Token available:', !!token);
    
    try {
      // Test with a simple GET request to see if API is accessible
      const testResponse = await api.get('/artist/event/applied', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      console.log('✅ API connectivity test successful, status:', testResponse.status);
      return true;
    } catch (error) {
      console.error('❌ API connectivity test failed:', error.message);
      return false;
    }
  };

  // Fetch applied events from API
  const fetchAppliedEvents = async () => {
    if (!token) {
      console.log('No token available for fetching applied events');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching applied events from API endpoint: /artist/event/applied');
      console.log('🔑 Using token:', token ? 'Present' : 'Missing');
      
      const response = await api.get('/artist/event/applied', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Applied events API response:', response.data);
      console.log('Applied events raw data structure:', JSON.stringify(response.data.data?.[0], null, 2));

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        console.log('Processing applied events data, total items:', response.data.data.length);
        
        // Transform API data to match expected format
        const transformedEvents = response.data.data
          .filter(application => {
            // Filter out applications where eventId is null or missing
            if (!application || !application.eventId) {
              console.warn('Skipping application with missing eventId:', {
                applicationId: application?._id,
                hasEventId: !!application?.eventId,
                application: application
              });
              return false;
            }
            return true;
          })
          .map((application, index) => {
            const event = application.eventId; // Event data is nested in eventId
            
            console.log(`Processing event ${index + 1}:`, {
              eventId: event._id,
              eventName: event.eventName,
              hasEventDateTime: !!event.eventDateTime,
              hasEventDate: !!event.eventDate,
              hasDate: !!event.date,
            });
            
            // Handle different possible date field structures
            let eventDate = new Date();
            
            // Try different possible date field names from the API
            if (event.eventDateTime && Array.isArray(event.eventDateTime) && event.eventDateTime.length > 0) {
              eventDate = new Date(event.eventDateTime[0]);
            } else if (event.eventDate && Array.isArray(event.eventDate) && event.eventDate.length > 0) {
              eventDate = new Date(event.eventDate[0]);
            } else if (event.date) {
              eventDate = new Date(event.date);
            } else if (event.eventTime) {
              // If only time is available, use today's date with that time
              eventDate = new Date();
            }
            
            // Handle event time
            let timeString = eventDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            });
            
            if (event.eventTime) {
              timeString = event.eventTime;
            } else if (event.time) {
              timeString = event.time;
            }
            
            // Handle genres - try different possible field names
            let genresList = ['General'];
            if (Array.isArray(event.genre)) {
              genresList = event.genre;
            } else if (event.genre) {
              genresList = [event.genre];
            } else if (Array.isArray(event.genres)) {
              genresList = event.genres;
            } else if (event.genres) {
              genresList = [event.genres];
            }
            
            // Handle budget
            let budgetString = 'Budget Not Specified';
            if (event.budget) {
              budgetString = `₹${event.budget}`;
            } else if (event.budgetRange) {
              budgetString = event.budgetRange;
            }
            
            const finalEvent = {
              id: application._id || index.toString(),
              image: event.posterUrl ? { uri: event.posterUrl } : 
                     event.poster ? { uri: event.poster } :
                     event.image ? { uri: event.image } :
                     event.imageUrl ? { uri: event.imageUrl } :
                     require('../assets/Images/fff.jpg'),
              location: event.venue || event.venueName || event.location || 'Unknown Venue',
              budget: budgetString,
              time: timeString,
              genres: genresList,
              rating: event.Rating || event.rating || 4,
              status: application.status || 'pending', // Application status from the application object
              dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
              dateDay: eventDate.getDate().toString(),
              guestLink: event.guestLinkUrl || event.guestLink || '',
              eventName: event.eventName || event.name || event.title || 'Event',
              eventId: event._id,
              applicationId: application._id,
            };
            
            console.log(`📋 Event ${index + 1} transformed:`, {
              id: finalEvent.id,
              eventId: finalEvent.eventId,
              eventName: finalEvent.eventName,
              eventIdType: typeof finalEvent.eventId,
              eventIdValue: finalEvent.eventId
            });
            
            return finalEvent;
          });

        setAppliedEvents(transformedEvents);
        console.log('✅ Applied events successfully processed:', transformedEvents.length);
        
        if (transformedEvents.length > 0) {
          console.log('Sample transformed event:', transformedEvents[0]);
        } else {
          console.log('⚠️ No valid applied events found after filtering');
        }
      } else {
        console.log('No applied events found or invalid response format');
        setAppliedEvents([]);
      }
    } catch (err) {
      console.error('Error fetching applied events:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: err.config?.url,
        method: err.config?.method,
      });
      
      // More specific error messages
      let errorMessage = 'Failed to load applied events';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Applied events endpoint not found.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      setAppliedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved events from API and check applied status
  const fetchSavedEvents = async () => {
    if (!token) {
      console.log('No token available for fetching saved events');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching saved events and applied events...');
      
      // Fetch both saved events and applied events to cross-reference
      const [savedResponse, appliedResponse] = await Promise.all([
        api.get('/artist/event/saved', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }),
        api.get('/artist/event/applied', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        })
      ]);

      console.log('Saved events API response:', savedResponse.data);
      console.log('Applied events API response  1 for cross-reference:', appliedResponse.data);

      // Get set of applied event IDs
      let appliedEventIds = new Set();
      if (appliedResponse.data && appliedResponse.data.success && Array.isArray(appliedResponse.data.data)) {
        appliedEventIds = new Set(
          appliedResponse.data.data
            .filter(application => application && application.eventId && application.eventId._id)
            .map(application => application.eventId._id)
        );
        console.log('🎯 Applied Event IDs  for cross-reference:', Array.from(appliedEventIds));
      }

      if (savedResponse.data && savedResponse.data.success && Array.isArray(savedResponse.data.data)) {
        // Filter out any savedEvent where eventId is null
        const filteredSavedEvents = savedResponse.data.data.filter(savedEvent => savedEvent && savedEvent.eventId);
        // Transform API data to match expected format
        const transformedEvents = filteredSavedEvents.map((savedEvent, index) => {
          const event = savedEvent.eventId; // Event data is nested in eventId
          
          console.log('Saved event data:', event); // Debug log to see backend structure
          
          // Handle different possible date field names from backend
          let eventDate = new Date();
          if (event.eventDateTime && event.eventDateTime.length > 0) {
            eventDate = new Date(event.eventDateTime[0]);
          } else if (event.eventDate && event.eventDate.length > 0) {
            eventDate = new Date(event.eventDate[0]);
          } else if (event.date) {
            eventDate = new Date(event.date);
          }
          
          // Handle different possible time field names
          let timeString = eventDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          });
          if (event.eventTime) {
            timeString = event.eventTime;
          } else if (event.time) {
            timeString = event.time;
          }
          
          // Handle different possible genre field structures
          let genresList = ['General'];
          if (Array.isArray(event.genre)) {
            genresList = event.genre;
          } else if (event.genre) {
            genresList = [event.genre];
          } else if (Array.isArray(event.genres)) {
            genresList = event.genres;
          } else if (event.genres) {
            genresList = [event.genres];
          }
          
          // Check if this saved event is also applied
          const isAlreadyApplied = appliedEventIds.has(event._id) || locallyAppliedFromSaved.has(event._id);
          
          const finalSavedEvent = {
            id: savedEvent._id || index.toString(),
            // Image: Handle different possible image field names
            image: event.posterUrl ? { uri: event.posterUrl } : 
                   event.poster ? { uri: event.poster } :
                   event.image ? { uri: event.image } :
                   event.imageUrl ? { uri: event.imageUrl } :
                   require('../assets/Images/fff.jpg'),
            // Venue Name: Handle different possible venue field names  
            location: event.venue || event.venueName || event.location || 'Unknown Venue',
            // Budget: Handle different budget formats
            budget: event.budget ? `$${event.budget}` : 
                    event.budgetRange ? event.budgetRange :
                    'Budget Not Specified',
            // Time: Use processed time string
            time: timeString,
            // Genres: Use processed genres list
            genres: genresList,
            rating: event.Rating || event.rating || 4,
            status: 'saved', // Status for saved events
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            guestLink: event.guestLinkUrl || event.guestLink || '',
            eventName: event.eventName || event.name || event.title || 'Event',
            eventId: event._id,
            savedId: savedEvent._id,
            isApplied: isAlreadyApplied, // Track if this saved event is already applied
          };
          
          console.log(`💾 Saved Event ${index + 1} transformed:`, {
            id: finalSavedEvent.id,
            eventId: finalSavedEvent.eventId,
            savedId: finalSavedEvent.savedId,
            eventName: finalSavedEvent.eventName,
            eventIdType: typeof finalSavedEvent.eventId,
            eventIdValue: finalSavedEvent.eventId
          });
          
          return finalSavedEvent;
        });

        setSavedEvents(transformedEvents);
        console.log('Saved events set:', transformedEvents.length);
      } else {
        console.log('No saved events found or invalid response format');
        setSavedEvents([]);
      }
    } catch (err) {
      console.error('Error fetching saved events:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError('Failed to load saved events');
      setSavedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch liked events from API
  const fetchLikedEvents = async () => {
    if (!token) {
      console.log('No token available for fetching liked events');
      return;
    }

    try {
      console.log('Fetching liked events...');
      
      const response = await api.get('/artist/event/liked', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Liked Events API Response:', response.data);

      if (response.data && response.data.success && response.data.data) {
        const likedEventIdsSet = new Set(response.data.data.map(likeRecord => likeRecord.eventId));
        setLikedEventIds(likedEventIdsSet);
        console.log('🔥 Current Liked Event IDs:', Array.from(likedEventIdsSet));
      }
    } catch (error) {
      console.error('Error fetching liked events:', error);
    }
  };

  // Fetch events when component mounts or when tab changes
  useEffect(() => {
    if (activeTab === 'applied') {
      fetchAppliedEvents();
    } else if (activeTab === 'saved') {
      fetchSavedEvents();
    }
    // Also fetch liked events
    fetchLikedEvents();
  }, [activeTab, token]);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ArtistHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Add focus listener to refresh liked events when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 ArtistAppliedScreen focused - refreshing liked events');
      if (token) {
        fetchLikedEvents();
      }
    });

    return unsubscribe;
  }, [navigation, token]);

  const renderAppliedItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('ArtistExploreEvent', { eventId: item.eventId })}>
            <Image source={item.image} style={styles.cardImage} />
          </TouchableOpacity>
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{item.dateMonth}</Text>
            <Text style={styles.dateText}>{item.dateDay}</Text>
          </View>
          <TouchableOpacity 
            style={styles.heartIcon}
            onPress={() => handleLikePress(item.eventId)}
            disabled={likingEventId === item.eventId}
            activeOpacity={0.7}
          >
            {likingEventId === item.eventId ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons 
                name={likedEventIds.has(item.eventId) ? "heart" : "heart-outline"} 
                size={Math.max(dimensions.iconSize * 0.8, 18)} 
                color={likedEventIds.has(item.eventId) ? "#FF0844" : "#fff"} 
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.budgetText}>{item.budget}</Text>
          <View style={styles.genresContainer}>
            {item.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
          <View style={styles.starRating}>
            {[...Array(5)].map((_, i) => (
              <FontAwesome
                key={i}
                name={i < item.rating ? 'star' : 'star-o'}
                size={Math.max(dimensions.iconSize * 0.7, 14)}
                color={i < item.rating ? '#ffc107' : '#aaa'}
                style={{ marginRight: dimensions.spacing.xs }}
              />
            ))}
          </View>
          <View style={styles.buttonRow}>
            {item.status === 'saved' ? (
              item.isApplied ? (
                <View style={styles.appliedButtonWrapper}>
                  <LinearGradient
                    colors={['#B15CDE', '#7952FC']}
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    style={styles.appliedButtonGradientBorder}
                  >
                    <View style={styles.appliedButtonInner}>
                      <MaskedView
                        maskElement={
                          <Text style={styles.appliedButtonTextMask}>Applied</Text>
                        }
                      >
                        <LinearGradient
                          colors={['#B15CDE', '#7952FC']}
                          start={{x: 1, y: 0}}
                          end={{x: 0, y: 0}}
                          style={styles.appliedButtonTextGradient}
                        >
                          <Text style={styles.appliedButtonTextMask}>Applied</Text>
                        </LinearGradient>
                      </MaskedView>
                    </View>
                  </LinearGradient>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.applyButton} 
                  onPress={() => handleApplyForEvent(item.eventId)}
                  activeOpacity={0.7}
                >
                  <LinearGradient 
                    colors={['#B15CDE', '#7952FC']} 
                    start={{x: 1, y: 0}} 
                    end={{x: 0, y: 0}} 
                    style={styles.applyButtonGradient}
                  >
                    <Text style={styles.applyButtonText}>Apply</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )
            ) : (
              <>
                {item.status === 'pending' && (
                  <TouchableOpacity style={styles.requestPendingButton}>
                    <Text style={styles.requestPendingText}>Request Pending</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'approved' && (
                  <TouchableOpacity style={styles.requestApprovedButton}>
                    <Text style={styles.requestApprovedText}>Request Approved</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'canceled' && (
                  <TouchableOpacity style={styles.requestCanceledButton}>
                    <Text style={styles.requestCanceledText}>Request Canceled</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.deleteButtonGradient}
            >
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.eventId, item.id)}>
                <Ionicons name="trash-outline" size={16} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const handleDelete = async (eventId, itemId) => {
    console.log('🎯 Delete button clicked with:', {
      eventId: eventId,
      itemId: itemId,
      eventIdType: typeof eventId,
      eventIdValid: !!eventId,
      eventIdLength: eventId ? eventId.length : 0,
      activeTab: activeTab
    });
    
    const isAppliedTab = activeTab === 'applied';
    
    // Add haptic feedback for delete action
    triggerHaptic('impactMedium');
    
    if (isAppliedTab) {
      // Remove from applied events using backend API with eventId
      console.log("qwqwqwqwqwqwqw",eventId)
      await handleRemoveAppliedEvent(eventId);
    } else {
      // Remove from saved events using backend API
      await handleUnsaveEvent(eventId);
    }
  };

  // Handle remove applied event from backend using API
  const handleRemoveAppliedEvent = async (eventId) => {
    console.log("inside handleRemoveAppliedEvent",eventId)
    if (!token) {
      setCustomAlert({ visible: true, title: 'Error', message: 'Authentication required to remove application.' });
      return;
    }

    // Enhanced validation for eventId
    if (!eventId ) {
      console.error('❌ Invalid eventId provided:', {
        eventId: eventId,
        type: typeof eventId,
        length: eventId ? eventId.length : 0,
        valid: false
      });
      setCustomAlert({ visible: true, title: 'Error', message: 'Invalid Event ID. Please try again.' });
      return;
    }

    try {
      setLoading(true);
      
      // Test API connectivity first
      const isAPIReachable = await testAPIConnectivity();
      if (!isAPIReachable) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Cannot connect to server. Please check your internet connection.' });
        return;
      }
      
      console.log('🗑️ Attempting to remove applied event:', {
        eventId: eventId,
        eventIdType: typeof eventId,
        eventIdLength: eventId.length,
        token: token ? 'Present' : 'Missing',
        apiBaseURL: api.defaults.baseURL
      });

      const requestData = { eventId: eventId };
      console.log('📤 Sending request with data:', requestData);

      console.log('🌐 Making API call to remove applied event...');
      console.log('📍 Full API URL will be:', api.defaults.baseURL + '/artist/remove-event');
      
      const response = await api.delete('/artist/remove-event', {
        data: requestData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Remove Applied Event API Response Status:', response.status);
      console.log('✅ Remove Applied Event API Response Data:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.success) {
        // Add haptic feedback for successful removal
        triggerHaptic('notificationSuccess');
        
        // Remove from Redux store using the eventId
        dispatch(removeAppliedEvent(eventId));
        console.log('🔄 Removed event from Redux:', eventId);
        
        // Alert.alert('Success', 'Application removed successfully!');
        
        // Add a small delay to ensure backend processing is complete
        console.log('⏳ Waiting 1 second before refreshing data...');
        console.log('📊 Current applied events count before refresh:', appliedEvents.length);
        
        setTimeout(async () => {
          console.log('🔄 Refreshing applied events from backend...');
          await fetchAppliedEvents();
          console.log('📊 Applied events count after refresh:', appliedEvents.length);
        }, 1000);
      } else {
        console.error('❌ API returned unsuccessful response:', response.data);
        setCustomAlert({ visible: true, title: 'Failed', message: response.data?.message || 'Failed to remove application.' });
      }
    } catch (error) {
      console.error('❌ Error removing applied event:', error);
      console.error('📊 Detailed error information:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        requestData: error.config?.data,
        headers: error.config?.headers,
      });
      
      let errorMessage = 'Failed to remove application. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid request. Please check the event ID.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Event not found or already removed.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setCustomAlert({ visible: true, title: 'Error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Handle like/unlike event with haptic feedback
  const handleLikePress = async (eventId) => {
    console.log('❤️ Heart button pressed!');
    console.log('   - Event ID:', eventId);
    
    if (!token) {
      setCustomAlert({ visible: true, title: 'Not Authenticated', message: 'Please login to like/unlike events.' });
      return;
    }
    
    // Check if event is currently liked
    const isCurrentlyLiked = likedEventIds.has(eventId);
    const newLikedStatus = !isCurrentlyLiked;
    
    console.log(`   - Current liked status: ${isCurrentlyLiked}`);
    console.log(`   - Action: ${isCurrentlyLiked ? 'UNLIKE' : 'LIKE'}`);
    console.log(`   - New status will be: ${newLikedStatus}`);
    
    // Add haptic feedback for the action
    triggerHaptic('impactMedium');
    
    // Set loading state for this specific event
    setLikingEventId(eventId);
    
    try {
      let response;
      
      if (isCurrentlyLiked) {
        // Event is currently liked - call UNLIKE API
        console.log('💔 Making API call to UNLIKE event (POST /artist/event/unlike)...');
        
        response = await api.post('/artist/event/unlike', {
          eventId: eventId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('✅ Unlike API Response:', response.data);
      } else {
        // Event is not liked - call LIKE API
        console.log('❤️ Making API call to LIKE event (POST /artist/event/like)...');
        
        response = await api.post('/artist/event/like', {
          eventId: eventId
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('✅ Like API Response:', response.data);
      }

      if (response.data && response.data.success) {
        console.log('🎉 API SUCCESS - Heart status updated!');
        console.log(`   - Heart is now: ${newLikedStatus ? 'RED (liked)' : 'WHITE (not liked)'}`);
        
        // Add haptic feedback for successful action
        triggerHaptic('notificationSuccess');
        
        // Update the liked events set
        if (newLikedStatus) {
          // Event was liked - add to liked events set
          setLikedEventIds(prev => {
            const updated = new Set([...prev, eventId]);
            console.log('✅ Added event to liked set. Total liked:', updated.size);
            return updated;
          });
        } else {
          // Event was unliked - remove from liked events set
          setLikedEventIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(eventId);
            console.log('✅ Removed event from liked set. Total liked:', newSet.size);
            return newSet;
          });
        }
      } else {
        console.log('❌ API FAILED - Reverting heart status');
        // Add haptic feedback for failure
        triggerHaptic('impactHeavy');
        const action = isCurrentlyLiked ? 'unlike' : 'like';
        setCustomAlert({ visible: true, title: 'Failed', message: response.data?.message || `Failed to ${action} event.` });
      }
    } catch (error) {
      console.error('🚨 API ERROR:', error);
      console.log('   - Reverting heart to original status');
      
      // Add haptic feedback for error
      triggerHaptic('impactHeavy');
      const action = isCurrentlyLiked ? 'unlike' : 'like';
      const errorMessage = error.response?.data?.message || `Failed to ${action} event.`;
      setCustomAlert({ visible: true, title: 'Error', message: errorMessage });
    } finally {
      setLikingEventId(null);
    }
  };

  // Handle apply for event from saved events
  const handleApplyForEvent = async (eventId) => {
    if (!token) {
      setCustomAlert({ visible: true, title: 'Not Authenticated', message: 'Please login to apply for events.' });
      return;
    }

    console.log('🎯 Applying for event from saved list:', eventId);
    
    // Add haptic feedback for apply action
    triggerHaptic('impactMedium');
    
    setLoading(true);
    
    try {
      console.log('✅ Making API call to apply for event:', eventId);
      
      const response = await api.post(
        '/artist/applyEvent',
        { eventId: eventId },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ Apply API Response:', response.data);
      
      if (response.data && response.data.success) {
        console.log('🎉 Application successful');
        
        // Add haptic feedback for successful application
        triggerHaptic('notificationSuccess');
        
        // Add to locally applied from saved set for immediate UI update
        setLocallyAppliedFromSaved(prev => new Set([...prev, eventId]));
        
        // Refresh the saved events list to update UI
        console.log('🔄 Refreshing saved events after successful application...');
        await fetchSavedEvents();
      } else {
        console.log('❌ API returned unsuccessful response:', response.data);
        setCustomAlert({ visible: true, title: 'Failed', message: response.data?.message || 'Failed to apply for event.' });
      }
    } catch (error) {
      console.error('❌ Error applying for event:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to apply for event.';
      
      // Check if error indicates already applied
      if (errorMessage.toLowerCase().includes('already applied') || 
          errorMessage.toLowerCase().includes('duplicate')) {
        console.log('✅ Event was already applied');
        triggerHaptic('impactLight');
        setCustomAlert({ visible: true, title: 'Already Applied', message: 'You have already applied for this event.' });
      } else {
        console.log('🚨 Showing error alert to user:', errorMessage);
        setCustomAlert({ visible: true, title: 'Error', message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle unsave event from backend using API - same as ArtistHomeScreen
  const handleUnsaveEvent = async (eventId) => {
    if (!token) {
      setCustomAlert({ visible: true, title: 'Not Authenticated', message: 'Please login to unsave events.' });
      return;
    }

    console.log('🗑️ Starting unsave process for eventId:', eventId);
    setLoading(true);
    
    try {
      console.log('📤 Making unsave API call with eventId:', eventId);
      console.log('📍 API URL:', api.defaults.baseURL + '/artist/event/unsave');
      
      // Use the exact same API call pattern as ArtistHomeScreen
      const response = await api.delete(
        '/artist/event/unsave',
        {
          data: { eventId: eventId },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Unsave API Response:', response.data);

      if (response.data && response.data.success) {
        // Add haptic feedback for successful unsave
        triggerHaptic('impactLight');
        
        // Alert.alert('Success', 'Event removed from saved list!');
        
        // Update AsyncStorage to sync with ArtistHomeScreen
        try {
          const userId = userData?.id || 'default';
          const SAVED_EVENTS_KEY = `saved_events_${userId}`;
          const savedEventsData = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
          
          if (savedEventsData) {
            const savedEventsArray = JSON.parse(savedEventsData);
            const updatedSavedEvents = savedEventsArray.filter(id => id !== eventId);
            await AsyncStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(updatedSavedEvents));
            console.log('✅ Updated AsyncStorage - removed eventId:', eventId);
          }
        } catch (storageError) {
          console.error('Error updating saved events storage:', storageError);
        }
        
        // Refresh the saved events list immediately
        console.log('🔄 Refreshing saved events after successful unsave...');
        await fetchSavedEvents();
      } else {
        setCustomAlert({ visible: true, title: 'Failed', message: response.data?.message || 'Failed to unsave event.' });
      }
    } catch (error) {
      console.error('❌ Error unsaving event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to unsave event.';
      setCustomAlert({ visible: true, title: 'Error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={styles.shortlistModalOverlay}>
        <View style={styles.shortlistModalContent}>
          <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
          <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
          <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
          <TouchableOpacity
            style={styles.shortlistModalButton}
            onPress={() => setCustomAlert({ ...customAlert, visible: false })}
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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <SignUpBackground width="100%" height="100%" />
      </View>
      
              <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('ArtistHome')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={dimensions.iconSize} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Applied</Text>
          <View style={{ width: dimensions.iconSize }} />
        </View>
      {/* Tab Buttons for Applied and Saved */}
      <View style={styles.tabHeader}>
        {activeTab === 'applied' ? (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.tabButton, styles.activeTabButton]}
          >
            <TouchableOpacity
              style={styles.tabTouchable}
              onPress={() => setActiveTab('applied')}
              activeOpacity={1}
            >
              <Text style={styles.tabButtonTextActive}>Applied</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.tabButton, styles.inactiveTabButton]}
            onPress={() => setActiveTab('applied')}
          >
            <Text style={styles.tabButtonTextInactive}>Applied</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'saved' ? (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.tabButton, styles.activeTabButton]}
          >
            <TouchableOpacity
              style={styles.tabTouchable}
              onPress={() => setActiveTab('saved')}
              activeOpacity={1}
            >
              <Text style={styles.tabButtonTextActive}>Saved</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.tabButton, styles.inactiveTabButton]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={styles.tabButtonTextInactive}>Saved</Text>
          </TouchableOpacity>
        )}
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <MusicBeatsLoader />
          <Text style={styles.loadingText}>Loading applied events...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'applied' ? appliedEvents : savedEvents}
          renderItem={renderAppliedItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => {
            if (activeTab === 'applied') {
              fetchAppliedEvents();
            } else if (activeTab === 'saved') {
              fetchSavedEvents();
            }
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <AppliedIcon width={60} height={60} />
              </View>
              <Text style={styles.emptyTitle}>
                {error ? 'Failed to Load Events' : 
                 activeTab === 'applied' ? 'No Applied Events' : 'No Saved Events'}
              </Text>
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => {
                  if (error) {
                    if (activeTab === 'applied') {
                      fetchAppliedEvents();
                    } else {
                      fetchSavedEvents();
                    }
                  } else {
                    navigation.navigate('ArtistHome');
                  }
                }}
              >
                <LinearGradient
                  colors={['#B15CDE', '#7952FC']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={styles.exploreButtonGradient}
                >
                  <Text style={styles.exploreButtonText}>
                    {error ? 'Retry' : 'Explore Events'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
        />
     )}
      <ArtistBottomNavBar
        navigation={navigation}
        insets={insets}
        isLoading={loading}
      />
      <CustomAlertModal />
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
    zIndex: -1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: dimensions.headerHeight,
  },
  backButton: {
    padding: dimensions.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: dimensions.spacing.sm,
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#C6C5ED',
    flex: 1,
    textAlign: 'left',
  },
  listContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginBottom: dimensions.spacing.md,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardImageContainer: {
    width: '92%',
    height: dimensions.cardImageHeight,
    backgroundColor: '#333',
    justifyContent: 'flex-end',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 13,
    marginTop: 20,
    marginBottom: 18,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: dimensions.cardPadding,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.xs,
  },
  locationText: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeText: {
    color: '#7952FC',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    fontFeatureSettings: "'salt' on",
  },
  budgetText: {
    fontSize: dimensions.fontSize.title,
    color: '#a95eff',
    marginBottom: dimensions.spacing.sm,
    fontWeight: '400',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: dimensions.spacing.sm,
    gap: dimensions.spacing.xs,
  },
  genreTag: {
    display: 'flex',
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
    backgroundColor: 'transparent',
    marginRight: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.xs,
  },
  genreText: {
    fontSize: dimensions.fontSize.small,
    color: '#fff',
    fontWeight: '500',
  },
  starRating: {
    flexDirection: 'row',
    marginBottom: dimensions.spacing.md,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacing.sm,
    justifyContent: 'space-between',
  },
  requestPendingButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  requestPendingText: {
    color: '#FF9500',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  requestApprovedButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  requestApprovedText: {
    color: '#00C853',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  requestCanceledButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  requestCanceledText: {
    color: '#FF3B30',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  applyButton: {
    display: 'flex',
    flex: 1,
    height: 46,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
    marginRight: dimensions.spacing.sm,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  appliedButtonWrapper: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: dimensions.spacing.sm,
  },
  appliedButtonGradientBorder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    padding: 1, // This creates the border thickness
  },
  appliedButtonInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 13, // Slightly smaller than the outer border radius
  },
  appliedButton: {
    display: 'flex',
    flex: 1,
    height: 46,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 13,
    backgroundColor: '#1a1a1a',
    alignSelf: 'stretch',
    marginRight: dimensions.spacing.sm,
    margin: 1,
  },
  appliedButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: '100%',
  },
  appliedButtonText: {
    color: '#B15CDE',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  appliedButtonTextGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  appliedButtonTextMask: {
    color: '#B15CDE',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop:9,
  },
  savedEventButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B15CDE',
  },
  savedEventText: {
    color: '#B15CDE',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  deleteButtonGradient: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  dateBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: dimensions.borderRadius.sm,
    padding: dimensions.spacing.xs,
    position: 'absolute',
    bottom: dimensions.spacing.md,
    left: dimensions.spacing.md,
    minWidth: Math.max(width * 0.12, 45),
    alignItems: 'center',
  },
  dateText: {
    fontSize: dimensions.fontSize.small,
    color: '#fff',
    fontWeight: 'bold',
  },
  heartIcon: {
    backgroundColor: 'transparent',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    position: 'absolute',
    top: dimensions.spacing.md,
    right: dimensions.spacing.md,
    minWidth: Math.max(width * 0.08, 32),
    minHeight: Math.max(width * 0.08, 32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: dimensions.spacing.md,
  },
  emptyTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: dimensions.spacing.sm,
  },
  emptySubtitle: {
    fontSize: dimensions.fontSize.body,
    color: '#aaa',
  },
  exploreButton: {
    display: 'flex',
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    marginTop: dimensions.spacing.lg,
  },
  exploreButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  exploreButtonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
    gap: 12, // gap between buttons
  },
  tabButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: 'rgba(177, 92, 222, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeTabButton: {
    borderWidth: 0,
  },
  inactiveTabButton: {
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
  },
  tabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonTextActive: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  tabButtonTextInactive: {
    color: '#B15CDE',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xxl,
  },
  loadingText: {
    fontSize: dimensions.fontSize.body,
    color: '#aaa',
    marginTop: dimensions.spacing.md,
  },
  errorText: {
    fontSize: dimensions.fontSize.body,
    color: '#FF3B30',
    marginBottom: dimensions.spacing.md,
    textAlign: 'center',
  },
  shortlistModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  shortlistModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#333',
  },
  shortlistModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  shortlistModalMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  shortlistModalButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistModalButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  shortlistModalButtonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
});

export default ArtistAppliedScreen; 