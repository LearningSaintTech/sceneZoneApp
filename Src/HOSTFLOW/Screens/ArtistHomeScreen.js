import React, { useState, useEffect, useCallback, useRef, useRef as RNRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Switch,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Animated, // <-- Add Animated import
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { selectLocation, selectToken, selectAppliedEvents, addAppliedEvent, removeAppliedEvent, setAppliedEvents } from '../Redux/slices/authSlice';
import AppliedIcon from '../assets/icons/Applied';
import InboxIcon from '../assets/icons/inbox';
import SignUpBackground from '../assets/Banners/SignUp';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomToggle from '../Components/CustomToggle'; // Adjust path as needed
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import HapticFeedback from 'react-native-haptic-feedback';
import api from '../Config/api';

const { width } = Dimensions.get('window');

// Genre options for dropdown
const GENRE_OPTIONS = [
  'Rock Star',
  'Soul Queen', 
  'Indie Dreamer',
  'Pop Icon',
  'Electro Vibe',
  'Folk Rebel',
  'Jazz Innovator',
  'Hip Hop Heroine'
];

// Responsive dimensions
const scale = width / 375; // Base iPhone X width
const dimensions = {
  cardWidth: width * 0.9,
  imageHeight: 150 * scale,
  headerFontSize: Math.max(18 * scale, 16),
  bodyFontSize: Math.max(14 * scale, 12),
  smallFontSize: Math.max(12 * scale, 10),
  spacing: {
    xs: Math.max(4 * scale, 4),
    sm: Math.max(8 * scale, 6),
    md: Math.max(12 * scale, 10),
    lg: Math.max(16 * scale, 14),
    xl: Math.max(20 * scale, 18),
  },
  borderRadius: {
    sm: Math.max(5 * scale, 4),
    md: Math.max(10 * scale, 8),
    lg: Math.max(15 * scale, 12),
  }
};

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

// Separate SearchBar component to prevent re-renders
const SearchBar = React.memo(({ searchText, onSearchChange, onSearchSubmit, onClear }) => {
  return (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#aaa" />
      <TextInput
        style={styles.searchInput}
        placeholder="Search Event"
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={onSearchChange}
        returnKeyType="search"
        onSubmitEditing={onSearchSubmit}
        autoCorrect={false}
        autoCapitalize="none"
        blurOnSubmit={true}
        enablesReturnKeyAutomatically={true}
        keyboardType="default"
        textContentType="none"
        autoComplete="off"
        selectTextOnFocus={false}
        clearButtonMode="never"
        spellCheck={false}
        autoFocus={false}
      />
      {searchText.length > 0 && (
        <TouchableOpacity 
          onPress={onClear}
          style={styles.searchClearButton}
        >
          <Ionicons name="close-circle" size={20} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
});

// New component for individual event cards
const ArtistEventCard = ({ item, navigation, onEventApplied, onEventSaved, savedEvents, likedEvents, setLikedEventIds, appliedEventsFromRedux }) => {
  const [showGuestListInput, setShowGuestListInput] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [localAppliedStatus, setLocalAppliedStatus] = useState(false);
  const [localSavedStatus, setLocalSavedStatus] = useState(savedEvents.has(item.id) || false);
  const [localLikedStatus, setLocalLikedStatus] = useState(item.isLiked || false);
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  
  // Set initial applied status - check multiple sources
  useEffect(() => {
    const isApplied = item.isApplied || 
                     appliedEventsFromRedux?.includes(item.id) ||
                     false;
    setLocalAppliedStatus(isApplied);
    console.log(`🎯 Initial apply state for event ${item.id}: ${isApplied}`);
    console.log(`   - From item.isApplied: ${item.isApplied}`);
    console.log(`   - From Redux: ${appliedEventsFromRedux?.includes(item.id)}`);
  }, [item.isApplied, item.id, appliedEventsFromRedux]);

  // Update local saved status when savedEvents prop changes
  useEffect(() => {
    setLocalSavedStatus(savedEvents.has(item.id) || false);
  }, [savedEvents, item.id]);

  // Update local liked status when likedEvents prop changes
  useEffect(() => {
    const isLikedFromProp = (likedEvents && likedEvents.has(item.id)) || item.isLiked || false;
    setLocalLikedStatus(isLikedFromProp);
    console.log(`💖 Event ${item.id}: Heart status sync - ${isLikedFromProp ? 'RED (liked)' : 'WHITE (not liked)'}`);
    console.log(`   - From likedEvents set: ${likedEvents && likedEvents.has(item.id)}`);
    console.log(`   - From item.isLiked: ${item.isLiked}`);
  }, [likedEvents, item.id, item.isLiked]);
  
  // Check if this event is already applied (prioritize local state for immediate updates)
  const isAlreadyApplied = localAppliedStatus;
  
  // Debug: Track button state
  console.log(`🎯 Event ${item.id} - Button shows: ${isAlreadyApplied ? 'APPLIED' : 'APPLY'}`);

  const handleApplyPress = async () => {
    console.log('🎯 Apply button pressed!');
    console.log('   - Current applied status:', isAlreadyApplied);
    console.log('   - Event ID:', item.id);
    console.log('   - Action:', isAlreadyApplied ? 'REMOVE APPLICATION' : 'APPLY FOR EVENT');
    
    if (!token) {
      Alert.alert('Not Authenticated', 'Please login to apply/remove applications.');
      return;
    }
    
    setIsApplying(true);
    
    try {
      if (isAlreadyApplied) {
        // If already applied, remove the application
        console.log('🗑️ Removing application for event:', item.id);
        
        const response = await api.delete(
          '/artist/remove-event',
          {
            data: { eventId: item.id },
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('✅ Remove API Response:', response.data);
        
        if (response.data && response.data.success) {
          console.log('🎉 Application removal successful - updating UI state');
          
          // Add haptic feedback for successful removal
          triggerHaptic('impactLight'); // Light impact for removal
          
          // Update local applied status to false
          setLocalAppliedStatus(false);
          
          // Call parent callback to update the main events list (remove from applied)
          if (onEventApplied) {
            onEventApplied(item.id, true); // Pass true to indicate removal
          }
          
          // Alert.alert('Success', 'Application removed successfully!');
        } else {
          console.log('❌ API returned unsuccessful response:', response.data);
          Alert.alert('Failed', response.data?.message || 'Failed to remove application.');
        }
      } else {
        // If not applied, apply for the event
        console.log('✅ Applying for event:', item.id);
        
        const response = await api.post(
          '/artist/applyEvent',
          { eventId: item.id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        
        console.log('✅ Apply API Response:', response.data);
        
        if (response.data && response.data.success) {
          console.log('🎉 Application successful - updating UI state');
          
          // Add haptic feedback for successful application
          triggerHaptic('notificationSuccess'); // Success notification for application
          
          // Update local applied status to true
          setLocalAppliedStatus(true);
          
          // Call parent callback to update the main events list
          if (onEventApplied) {
            onEventApplied(item.id);
          }
          
          // Alert.alert('Success', 'Application submitted successfully!');
        } else {
          console.log('❌ API returned unsuccessful response:', response.data);
          Alert.alert('Failed', response.data?.message || 'Failed to apply for event.');
        }
      }
    } catch (error) {
      console.error('❌ Error with apply/remove:', error);
      console.log('🔍 Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
      
      const action = isAlreadyApplied ? 'remove application' : 'apply for event';
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${action}.`;
      
      // Check if it's a network timeout or connection issue
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.log('⏰ Network timeout detected - checking if operation might have succeeded...');
        Alert.alert(
          'Network Timeout', 
          'The request timed out, but it might have been processed. Please check your applied events.',
          [
            { text: 'OK', onPress: () => {
              // Optionally refresh the events list to check current status
              console.log('🔄 User acknowledged timeout - consider refreshing events');
            }}
          ]
        );
        return;
      }
      
      // Check if error indicates already applied (for apply action)
      if (!isAlreadyApplied && (errorMessage.toLowerCase().includes('already applied') || 
          errorMessage.toLowerCase().includes('duplicate'))) {
        console.log('✅ Event was already applied - updating UI state');
        setLocalAppliedStatus(true);
        if (onEventApplied) {
          onEventApplied(item.id);
        }
        Alert.alert('Already Applied', 'You have already applied for this event.');
      } else {
        console.log('🚨 Showing error alert to user:', errorMessage);
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsApplying(false);
    }
  };

  const handleSavePress = async () => {
    if (!token) {
      Alert.alert('Not Authenticated', 'Please login to save events.');
      return;
    }
    setIsSaving(true);
    const prevSavedStatus = localSavedStatus;
    try {
      let response;
      const newSavedStatus = !localSavedStatus;
      
      if (localSavedStatus) {
        // If currently saved, unsave it using DELETE API
        response = await api.delete(
          '/artist/event/unsave',
          {
            data: { eventId: item.id },
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        // If not saved, save it using POST API
        response = await api.post(
          '/artist/event/save',
          { eventId: item.id },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      if (response.data && response.data.success) {
        // Add haptic feedback for save/unsave actions
        if (newSavedStatus) {
          // Saved - medium impact for positive action
          triggerHaptic('impactMedium');
        } else {
          // Unsaved - light impact for removal
          triggerHaptic('impactLight');
        }
        
        // Only update local state if backend confirms success
        setLocalSavedStatus(newSavedStatus);
        
        // Call parent callback to update the main saved events list
        if (onEventSaved) {
          onEventSaved(item.id, newSavedStatus);
        }
        
        // Alert.alert('Success', newSavedStatus ? 'Event saved successfully!' : 'Event removed from saved list!');
      } else {
        // Backend did not save/unsave, revert state and show error
        setLocalSavedStatus(prevSavedStatus); // revert to previous state
        Alert.alert('Failed', response.data?.message || (localSavedStatus ? 'Failed to unsave event.' : 'Failed to save event.'));
      }
    } catch (error) {
      // On error, revert state and show error
      setLocalSavedStatus(prevSavedStatus); // revert to previous state
      console.error('Error saving/unsaving event:', error);
      const errorMessage = error.response?.data?.message || (localSavedStatus ? 'Failed to unsave event.' : 'Failed to save event.');
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLikePress = async () => {
    console.log('❤️ Heart button pressed!');
    console.log('   - Current liked status:', localLikedStatus);
    console.log('   - Event ID:', item.id);
    
    if (!token) {
      Alert.alert('Not Authenticated', 'Please login to like/unlike events.');
      return;
    }
    
    // Determine if this is a like or unlike operation
    const isCurrentlyLiked = localLikedStatus;
    const newLikedStatus = !isCurrentlyLiked;
    
    console.log(`   - Action: ${isCurrentlyLiked ? 'UNLIKE' : 'LIKE'}`);
    console.log(`   - New status will be: ${newLikedStatus}`);
    
    // Add haptic feedback for the action
    triggerHaptic('impactMedium');
    
    // Immediately toggle the visual state for instant feedback
    setLocalLikedStatus(newLikedStatus);
    setIsLiking(true);
    
    try {
      let response;
      
      if (isCurrentlyLiked) {
        // Event is currently liked - call UNLIKE API
        console.log('💔 Making API call to UNLIKE event (POST /artist/event/unlike)...');
        
        response = await api.post('/artist/event/unlike', {
          eventId: item.id
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
          eventId: item.id
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
        
        // Update the global liked events set to keep in sync
        if (newLikedStatus) {
          // Event was liked - add to liked events set
          setLikedEventIds(prev => {
            const updated = new Set([...prev, item.id]);
            console.log('✅ Added event to global liked set. Total liked:', updated.size);
            return updated;
          });
        } else {
          // Event was unliked - remove from liked events set
          setLikedEventIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            console.log('✅ Removed event from global liked set. Total liked:', newSet.size);
            return newSet;
          });
        }
        
        // Optional: Show success feedback
        // Alert.alert('Success', `Event ${newLikedStatus ? 'liked' : 'unliked'} successfully!`);
      } else {
        console.log('❌ API FAILED - Reverting heart status');
        // Add haptic feedback for failure
        triggerHaptic('impactHeavy');
        // Revert the status if API failed
        setLocalLikedStatus(isCurrentlyLiked);
        const action = isCurrentlyLiked ? 'unlike' : 'like';
        Alert.alert('Failed', response.data?.message || `Failed to ${action} event.`);
      }
    } catch (error) {
      console.error('🚨 API ERROR:', error);
      console.log('   - Reverting heart to original status');
      
      // Add haptic feedback for error
      triggerHaptic('impactHeavy');
      
      // Revert the status if API failed
      setLocalLikedStatus(isCurrentlyLiked);
      const action = isCurrentlyLiked ? 'unlike' : 'like';
      const errorMessage = error.response?.data?.message || `Failed to ${action} event.`;
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <LinearGradient
      colors={['rgba(252, 252, 253, 0.04)', 'rgba(252, 252, 253, 0.03)']}
      start={{ x: 0, y: 0.05 }}
      end={{ x: 1, y: 0 }}
      locations={[0.2658, 0.9098]}
      style={styles.eventCard}
    >
<TouchableOpacity
  onPress={() => {
    console.log(`[${new Date().toISOString()}] Navigating to ArtistExploreEvent for eventId=${item.id}`);
    navigation.navigate('ArtistExploreEvent', { eventId: item.id });
  }}
  activeOpacity={0.7}
>
  <Image source={item.image} style={styles.eventImage} />
</TouchableOpacity>
      <View style={styles.dateOverlay}>
        <Text style={styles.dateMonth}>{item.dateMonth}</Text>
        <Text style={styles.dateDay}>{item.dateDay}</Text>
      </View>
        {/* Heart Icon: 
            - First tap: Sends POST /artist/event/like → Heart becomes RED (filled)
            - Second tap: Sends POST /artist/event/unlike → Heart becomes WHITE (outline)
        */}
        <TouchableOpacity 
          style={styles.heartIcon}
          onPress={handleLikePress}
          disabled={isLiking}
          activeOpacity={0.7}
        >
          {isLiking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons 
              name={localLikedStatus ? "heart" : "heart-outline"} 
              size={24} 
              color={localLikedStatus ? "#FF0844" : "#fff"} 
            />
          )}
        </TouchableOpacity>
      <View style={styles.eventContent}>
        <View style={styles.eventDetailsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventBudget}>{item.budget}</Text>
          </View>
          <View style={styles.eventTimeAndRating}>
            <Text style={styles.eventTime}>{item.time}</Text>
          </View>
        </View>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.guestListRow}>
          <Text style={styles.guestListText}>Do You Have a Guest List?</Text>
          <CustomToggle
            value={showGuestListInput}
            onValueChange={setShowGuestListInput}
          />
        </View>

        {showGuestListInput && (
          <View style={styles.guestListInputContainer}>
            <TextInput
              style={styles.guestListInput}
              placeholder="https://copy-guestlist-link-artist-"
              placeholderTextColor="#888"
              value={item.guestLink || "https://copy-guestlist-link-artist-"}
              editable={false}
            />
            <TouchableOpacity onPress={() => console.log('Copy guest list link')}>
              <Ionicons name="copy-outline" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.applyButton, isAlreadyApplied && styles.appliedButton]} 
            onPress={() => {
              console.log(`🔄 Button pressed for event ${item.id}: Current state = ${isAlreadyApplied ? 'APPLIED' : 'APPLY'}`);
              handleApplyPress();
            }}
            disabled={isApplying}
            activeOpacity={0.7}
          >
            {isApplying ? (
              <ActivityIndicator size="small" color={isAlreadyApplied ? "#B15CDE" : "#fff"} />
            ) : isAlreadyApplied ? (
              <View style={styles.appliedButtonWrapper}>
                <LinearGradient
                  colors={['#B15CDE', '#7952FC']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={styles.appliedButtonGradientBorder}
                >
                  <View style={styles.appliedButtonInner}>
                    <Text style={styles.appliedButtonText}>Applied</Text>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <LinearGradient 
                colors={['#B15CDE', '#7952FC']} 
                start={{x: 1, y: 0}} 
                end={{x: 0, y: 0}} 
                style={styles.applyButtonGradient}
              >
                 <Text style={styles.applyButtonText}>Apply</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.bookmarkButton, localSavedStatus && styles.bookmarkButtonSaved]} 
             onPress={handleSavePress}
             disabled={isSaving}
           >
             {isSaving ? (
               <ActivityIndicator size="small" color="#a95eff" />
             ) : (
               <Icon 
                 name={localSavedStatus ? "bookmark" : "bookmark"} 
                 size={24} 
                 color={localSavedStatus ? "#fff" : "#a95eff"} 
               />
             )}
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
  );
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

const ArtistHomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [currentBudget, setCurrentBudget] = useState(50000);
  const [bubbleLeft, setBubbleLeft] = useState('50%');
  const [artistName, setArtistName] = useState('Artist');
  const [artistLocation, setArtistLocation] = useState('H-70, Sector 63, Noida');
  const [eventsData, setEventsData] = useState([]);
  const [filteredEventsData, setFilteredEventsData] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [isFilteringEvents, setIsFilteringEvents] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Add debounce timer ref
  const searchTimeoutRef = useRef(null);
  
  // Get token and auth data from Redux
  const token = useSelector(selectToken);
  const authName = useSelector(state => state.auth.userData?.name || state.auth.userData?.fullName);
  const authLocation = useSelector(selectLocation);
  const userData = useSelector(state => state.auth.userData);
  const appliedEventsFromRedux = useSelector(selectAppliedEvents);
  
  console.log('Redux Auth Data:', { authName, authLocation, userData });
  console.log('Redux Applied Events:', appliedEventsFromRedux);

  // Function to get first word from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'Artist';
    return fullName.split(' ')[0];
  };

  // Function to format budget in Indian currency format
  const formatBudgetINR = (amount) => {
    if (amount >= 100000) {
      const lakhs = (amount / 100000).toFixed(1);
      return `₹${lakhs} L`;
    } else if (amount >= 1000) {
      const thousands = (amount / 1000).toFixed(1);
      return `₹${thousands} K`;
    } else {
      return `₹${amount}`;
    }
  };

  // Function to format date for display
  const formatDateForDisplay = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  };

  // Function to check if event date matches selected date
  const isEventOnSelectedDate = (eventDate, selectedDate) => {
    if (!selectedDate) return true; // Show all events if no date selected
    
    const eventDateObj = new Date(eventDate);
    const selectedDateObj = new Date(selectedDate);
    
    return (
      eventDateObj.getDate() === selectedDateObj.getDate() &&
      eventDateObj.getMonth() === selectedDateObj.getMonth() &&
      eventDateObj.getFullYear() === selectedDateObj.getFullYear()
    );
  };



  // Fetch events data from API
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      setEventsError(null);
      
      console.log('Fetching events with token:', token);
      
      if (!token) {
        setEventsError('No authentication token found. Please login again.');
        return;
      }
      
      // Fetch events, liked events, and applied events simultaneously
      const [eventsResponse, likedEventsResponse, appliedEventsResponse] = await Promise.all([
        api.get('/artist/events/get-all-events-artist', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }),
        api.get('/artist/event/liked', {
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
      
      console.log('Events API Response:', eventsResponse.data);
      console.log('Liked Events API Response:', likedEventsResponse.data);
      console.log('Applied Events API Response:', appliedEventsResponse.data);
      
      // Process liked events
      let currentLikedEventIds = new Set();
      if (likedEventsResponse.data && likedEventsResponse.data.success && likedEventsResponse.data.data) {
        currentLikedEventIds = new Set(likedEventsResponse.data.data.map(likeRecord => likeRecord.eventId));
        console.log('🔥 Current Liked Event IDs:', Array.from(currentLikedEventIds));
        setLikedEventIds(currentLikedEventIds);
      }
      
      // Process applied events from API
      let currentAppliedEventIds = new Set();
      if (appliedEventsResponse.data && appliedEventsResponse.data.success && appliedEventsResponse.data.data) {
        // Extract eventIds from applied events API response
        currentAppliedEventIds = new Set(
          appliedEventsResponse.data.data
            .filter(application => application && application.eventId && application.eventId._id)
            .map(application => application.eventId._id)
        );
        console.log('🎯 Current Applied Event IDs from API:', Array.from(currentAppliedEventIds));
        
        // Update local applied events state
        setLocallyAppliedEvents(currentAppliedEventIds);
        
        // Also update Redux store
        const appliedEventsArray = Array.from(currentAppliedEventIds);
        dispatch(setAppliedEvents(appliedEventsArray));
        
        // Save to persistent storage
        await saveAppliedEvents(currentAppliedEventIds);
        
        console.log('✅ Synced applied events from API to local storage and Redux');
      }
      
      if (eventsResponse.data && eventsResponse.data.data) {
        // Transform API data to match our component structure
        const transformedEvents = eventsResponse.data.data.map((event, index) => {
          // Get the first date from the eventDate array
          const eventDate = event.eventDate && event.eventDate.length > 0 
            ? new Date(event.eventDate[0]) 
            : new Date();
          
          // Check if applied - prioritize API applied events data
          const isApplied = currentAppliedEventIds.has(event._id) || 
                           event.isAppliedByCurrentArtist || 
                           event.isApplied || 
                           false;
          
          // Check if liked from API using the fetched liked events
          const isLiked = currentLikedEventIds.has(event._id) || 
                         event.isLikedByCurrentArtist || 
                         event.isLiked || 
                         false;
          
          console.log(`🔍 Event ${event._id}: isLiked = ${isLiked}`);
          console.log(`   - In liked events API: ${currentLikedEventIds.has(event._id)}`);
          console.log(`   - isLikedByCurrentArtist: ${event.isLikedByCurrentArtist}`);
          console.log(`   - event.isLiked: ${event.isLiked}`);
          
          return {
            id: event._id,
            image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            location: event.venue || 'Noida',
            budget: `₹${event.budget || 40000}-${event.budget ? event.budget + 10000 : 50000}`,
            time: event.eventTime || '09:30 AM',
            rating: event.Rating || 4,
            tags: event.genre || ['Drums', 'Violin'],
            hasGuestList: !!event.guestLinkUrl,
            guestLink: event.guestLinkUrl,
            eventName: event.eventName,
            discount: event.Discount,
            status: event.status,
            isCompleted: event.isCompleted,
            isCancelled: event.isCancelled,
            showStatus: event.showStatus,
            isApplied: isApplied,
            isLiked: isLiked,
          };
        });
        
        setEventsData(transformedEvents);
        setFilteredEventsData(transformedEvents); // Initialize filtered data
        
        console.log('✅ FINAL RESULTS:');
        console.log('📋 Total Events:', transformedEvents.length);
        console.log('❤️ Liked Event IDs from API:', Array.from(currentLikedEventIds));
        console.log('🎯 Applied Event IDs from API:', Array.from(currentAppliedEventIds));
        console.log('❤️ Events with liked status:', transformedEvents.filter(event => event.isLiked).map(event => ({ 
          id: event.id, 
          eventName: event.eventName || 'Unknown',
          isLiked: event.isLiked 
        })));
        console.log('🎯 Events with applied status:', transformedEvents.filter(event => event.isApplied).map(event => ({ 
          id: event.id, 
          eventName: event.eventName || 'Unknown',
          isApplied: event.isApplied 
        })));
        
        // Check if any events match the liked IDs
        const matchingLikedEvents = transformedEvents.filter(event => currentLikedEventIds.has(event.id));
        console.log('🎯 Events that match liked IDs:', matchingLikedEvents.map(event => ({ 
          id: event.id, 
          eventName: event.eventName || 'Unknown' 
        })));
        
        // Check if any events match the applied IDs
        const matchingAppliedEvents = transformedEvents.filter(event => currentAppliedEventIds.has(event.id));
        console.log('🎯 Events that match applied IDs:', matchingAppliedEvents.map(event => ({ 
          id: event.id, 
          eventName: event.eventName || 'Unknown' 
        })));
      } else {
        setEventsError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        setEventsError('Authentication failed. Please login again.');
      } else {
        setEventsError(error.response?.data?.message || 'Failed to fetch events');
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Fetch artist profile to get the name and location
  const fetchArtistProfile = async () => {
    try {
      console.log('fetchArtistProfile called - Current state:', { 
        token: !!token, 
        artistId: userData?.id, 
        authName, 
        authLocation,
        currentArtistName: artistName,
        currentArtistLocation: artistLocation
      });
      
      if (!token) {
        console.log('No token available for profile fetch - using Redux fallback');
        return; // Don't override Redux values, they're already set
      }
      
      const artistId = userData?.id;
      if (!artistId) {
        console.log('No artist ID available for profile fetch - using Redux fallback');
        return; // Don't override Redux values, they're already set  
      }
      
      console.log('Fetching profile for artistId:', artistId);
      
      const response = await api.get(`/artist/get-profile/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Profile API Response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        const profile = response.data.data;
        const name = profile.fullName || profile.name;
        const location = profile.address || profile.location;
        
        console.log('API Profile data:', { name, location });
        
        // Only update if we got valid data from API
        if (name) {
          console.log('Updating artist name from API:', name);
          setArtistName(getFirstName(name));
        }
        if (location) {
          console.log('Updating artist location from API:', location);
          setArtistLocation(location);
        }
      } else {
        console.log('Profile API returned no valid data - keeping Redux values');
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error.response?.data || error.message);
      console.log('Keeping Redux values due to API error');
    }
  };

  // Filter events using backend API
  const filterEventsWithAPI = async (filters = {}) => {
    try {
      console.log('🔍 Applying filters with API:', filters);
      
      if (!token) {
        console.log('No token available for filtering');
        return;
      }

      // Show loading state
      setIsFilteringEvents(true);

      // Build filter data for backend API
      const filterData = {};

      // Genre filter - map frontend genre to backend format
      if (filters.genre) {
        const genreMapping = {
          'Rock Star': 'Rock',
          'Soul Queen': 'Soul', 
          'Indie Dreamer': 'Indie',
          'Pop Icon': 'Pop',
          'Electro Vibe': 'Electronic',
          'Folk Rebel': 'Folk',
          'Jazz Innovator': 'Jazz',
          'Hip Hop Heroine': 'Hip Hop'
        };
        const backendGenre = genreMapping[filters.genre] || filters.genre;
        filterData.genre = [backendGenre];
      }

      // Budget filter - convert to backend format
      if (filters.budget) {
        filterData.budget = [filters.budget];
      }

      // Location filter
      if (filters.location) {
        filterData.location = [filters.location];
      }

      // Keywords filter (from search text)
      if (filters.search && filters.search.trim()) {
        filterData.keywords = [filters.search.trim()];
      }

      console.log('📤 Sending filter data to backend:', filterData);

      // Call the filter API
      const response = await api.get('/artist/filter-events', filterData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Filter API Response:', response.data);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Process filtered events from API response
        const filteredEvents = response.data.data.map((event, index) => {
          const eventDate = event.eventDate && event.eventDate.length > 0 
            ? new Date(event.eventDate[0]) 
            : new Date();
          
          // Check if applied from current applied events
          const isApplied = locallyAppliedEvents.has(event._id) ||
                           appliedEventsFromRedux?.includes(event._id) ||
                           event.isAppliedByCurrentArtist || 
                           event.isApplied || 
                           false;
          
          // Check if liked from current liked events
          const isLiked = likedEventIds.has(event._id) || 
                         event.isLikedByCurrentArtist || 
                         event.isLiked || 
                         false;
          
          return {
            id: event._id,
            image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            location: event.venue || 'Noida',
            budget: `₹${event.budget || 40000}-${event.budget ? event.budget + 10000 : 50000}`,
            time: event.eventTime || '09:30 AM',
            rating: event.Rating || 4,
            tags: event.genre || ['Drums', 'Violin'],
            hasGuestList: !!event.guestLinkUrl,
            guestLink: event.guestLinkUrl,
            eventName: event.eventName,
            discount: event.Discount,
            status: event.status,
            isCompleted: event.isCompleted,
            isCancelled: event.isCancelled,
            showStatus: event.showStatus,
            isApplied: isApplied,
            isLiked: isLiked,
          };
        });

        console.log('🎯 Filtered events processed:', filteredEvents.length);
        setFilteredEventsData(filteredEvents);
      } else {
        console.log('No filtered events found or invalid response');
        setFilteredEventsData([]);
      }
    } catch (error) {
      console.error('❌ Error filtering events with API:', error);
      // Fallback to local filtering if API fails
      console.log('🔄 Falling back to local filtering...');
      const localFiltered = filterEventsLocally(filters);
      setFilteredEventsData(localFiltered);
    } finally {
      // Hide loading state
      setIsFilteringEvents(false);
    }
  };

  // Keep local filtering as fallback
  const filterEventsLocally = (filters = {}) => {
    // If no filters applied, show all events
    if (!filters.search && !filters.genre && !filters.budget && !filters.location && !filters.date) {
      return eventsData;
    }

    return eventsData.filter(event => {
      // Search filter
      if (filters.search && filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        const matchesSearch = 
          event.eventName?.toLowerCase().includes(searchTerm) ||
          event.location?.toLowerCase().includes(searchTerm) ||
          event.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          event.budget?.toLowerCase().includes(searchTerm) ||
          event.time?.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Genre filter
      if (filters.genre) {
        const hasGenre = event.tags?.some(tag => 
          tag.toLowerCase().includes(filters.genre.toLowerCase()) ||
          filters.genre.toLowerCase().includes(tag.toLowerCase())
        );
        if (!hasGenre) return false;
      }

      // Budget filter (simplified)
      if (filters.budget) {
        // Extract budget number from string like "₹50000-60000" or "$400-500"
        const budgetMatch = event.budget?.match(/[₹$](\d+)/);
        const eventBudget = budgetMatch ? parseInt(budgetMatch[1]) : 0;
        // Convert dollar amounts to approximate INR (assuming 1 USD = 83 INR)
        const eventBudgetINR = event.budget?.includes('$') ? eventBudget * 83 : eventBudget;
        if (eventBudgetINR < filters.budget) return false;
      }

      // Date filter
      if (filters.date) {
        // Assuming event has eventDate field
        const eventDate = event.eventDate || event.dateMonth + ' ' + event.dateDay;
        if (!isEventOnSelectedDate(eventDate, filters.date)) return false;
      }

      // Location filter
      if (filters.location) {
        const matchesLocation = event.location?.toLowerCase().includes(filters.location.toLowerCase());
        if (!matchesLocation) return false;
      }

      return true;
    });
  };

  // Keep track of locally applied events to persist state across refreshes
  const [locallyAppliedEvents, setLocallyAppliedEvents] = useState(new Set());
  
  // Keep track of locally saved events to persist state across refreshes
  const [locallySavedEvents, setLocallySavedEvents] = useState(new Set());
  
  // Keep track of liked events from API
  const [likedEventIds, setLikedEventIds] = useState(new Set());

  // Storage key for applied events
  const APPLIED_EVENTS_KEY = `applied_events_${userData?.id || 'default'}`;
  
  // Storage key for saved events
  const SAVED_EVENTS_KEY = `saved_events_${userData?.id || 'default'}`;

  // Load applied events from persistent storage
  const loadAppliedEvents = async () => {
    try {
      const appliedEventsData = await AsyncStorage.getItem(APPLIED_EVENTS_KEY);
      if (appliedEventsData) {
        const appliedEventsArray = JSON.parse(appliedEventsData);
        setLocallyAppliedEvents(new Set(appliedEventsArray));
        
        // Also load into Redux store
        dispatch(setAppliedEvents(appliedEventsArray));
        
        console.log('Loaded applied events from storage into local state and Redux:', appliedEventsArray);
      }
    } catch (error) {
      console.error('Error loading applied events:', error);
    }
  };

  // Save applied events to persistent storage
  const saveAppliedEvents = async (appliedEventsSet) => {
    const appliedEventsArray = Array.from(appliedEventsSet);
    await AsyncStorage.setItem(APPLIED_EVENTS_KEY, JSON.stringify(appliedEventsArray));
    
    // Also sync with Redux store
    dispatch(setAppliedEvents(appliedEventsArray));
  };

  // Clear applied events storage (useful for development/testing)
  const clearAppliedEventsStorage = async () => {
    try {
      await AsyncStorage.removeItem(APPLIED_EVENTS_KEY);
      setLocallyAppliedEvents(new Set());
      console.log('Cleared applied events storage');
    } catch (error) {
      console.error('Error clearing applied events storage:', error);
    }
  };

  // Load saved events from persistent storage
  const loadSavedEvents = async () => {
    try {
      const savedEventsData = await AsyncStorage.getItem(SAVED_EVENTS_KEY);
      if (savedEventsData) {
        const savedEventsArray = JSON.parse(savedEventsData);
        setLocallySavedEvents(new Set(savedEventsArray));
        console.log('Loaded saved events from storage:', savedEventsArray);
      }
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  // Save saved events to persistent storage
  const saveSavedEvents = async (savedEventsSet) => {
    try {
      const savedEventsArray = Array.from(savedEventsSet);
      await AsyncStorage.setItem(SAVED_EVENTS_KEY, JSON.stringify(savedEventsArray));
      console.log('Saved saved events to storage:', savedEventsArray);
    } catch (error) {
      console.error('Error saving saved events:', error);
    }
  };

  // Handle when an event is applied - ensures permanent applied state
  const handleEventApplied = (eventId, shouldRemove = false) => {
    if (shouldRemove) {
      // Remove from Redux store
      dispatch(removeAppliedEvent(eventId));
      
      // Remove from locally applied events set
      const newAppliedEvents = new Set(locallyAppliedEvents);
      newAppliedEvents.delete(eventId);
      setLocallyAppliedEvents(newAppliedEvents);
      
      // Save to persistent storage immediately
      saveAppliedEvents(newAppliedEvents);
      
      // Update the local events data to reflect removed applied status
      setEventsData(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isApplied: false }
            : event
        )
      );
      
      // Also update filtered events data
      setFilteredEventsData(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isApplied: false }
            : event
        )
      );
      
      console.log('Event application removed and updated in Redux + storage:', eventId);
    } else {
      // Add to Redux store for global state management
      dispatch(addAppliedEvent(eventId));
      
      // Add to locally applied events set for permanent tracking
      const newAppliedEvents = new Set([...locallyAppliedEvents, eventId]);
      setLocallyAppliedEvents(newAppliedEvents);
      
      // Save to persistent storage immediately
      saveAppliedEvents(newAppliedEvents);
      
      // Update the local events data to reflect applied status permanently
      setEventsData(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isApplied: true }
            : event
        )
      );
      
      // Also update filtered events data
      setFilteredEventsData(prevEvents => 
        prevEvents.map(event => 
          event.id === eventId 
            ? { ...event, isApplied: true }
            : event
        )
      );
      
      console.log('Event applied successfully and saved to Redux + storage:', eventId);
    }
  };

  // Handle when an event application is withdrawn/deleted
  const handleEventApplicationDeleted = (eventId) => {
    // Remove from Redux store
    dispatch(removeAppliedEvent(eventId));
    
    // Remove from locally applied events set
    const newAppliedEvents = new Set(locallyAppliedEvents);
    newAppliedEvents.delete(eventId);
    setLocallyAppliedEvents(newAppliedEvents);
    
    // Update persistent storage
    saveAppliedEvents(newAppliedEvents);
    
    // Update the local events data to reflect removed applied status
    setEventsData(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isApplied: false }
          : event
      )
    );
    
    // Also update filtered events data
    setFilteredEventsData(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId 
          ? { ...event, isApplied: false }
          : event
      )
    );
    
    console.log('Event application deleted and removed from Redux + storage:', eventId);
  };

  // Handle when an event is saved/unsaved - ensures permanent saved state
  const handleEventSaved = (eventId, isSaved) => {
    if (isSaved) {
      // Add to locally saved events set for permanent tracking
      const newSavedEvents = new Set([...locallySavedEvents, eventId]);
      setLocallySavedEvents(newSavedEvents);
      saveSavedEvents(newSavedEvents);
      console.log('Event saved successfully and saved to storage:', eventId);
    } else {
      // Remove from locally saved events set
      const newSavedEvents = new Set(locallySavedEvents);
      newSavedEvents.delete(eventId);
      setLocallySavedEvents(newSavedEvents);
      saveSavedEvents(newSavedEvents);
      console.log('Event unsaved and removed from storage:', eventId);
    }
  };

  // Function to manually refresh saved events (useful for external calls)
  const refreshSavedEventsFromStorage = async () => {
    console.log('🔄 Manually refreshing saved events from storage...');
    await loadSavedEvents();
  };

  // Function to fetch only applied events from API (for syncing)
  const fetchAppliedEventsOnly = async () => {
    try {
      console.log('🔄 Fetching applied events only for sync...');
      
      const appliedEventsResponse = await api.get('/artist/event/applied', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('✅ Applied Events Sync Response:', appliedEventsResponse.data);

      if (appliedEventsResponse.data && appliedEventsResponse.data.success && appliedEventsResponse.data.data) {
        // Extract eventIds from applied events API response
        const currentAppliedEventIds = new Set(
          appliedEventsResponse.data.data
            .filter(application => application && application.eventId && application.eventId._id)
            .map(application => application.eventId._id)
        );
        
        console.log('🎯 Synced Applied Event IDs:', Array.from(currentAppliedEventIds));
        
        // Update local applied events state
        setLocallyAppliedEvents(currentAppliedEventIds);
        
        // Also update Redux store
        const appliedEventsArray = Array.from(currentAppliedEventIds);
        dispatch(setAppliedEvents(appliedEventsArray));
        
        // Save to persistent storage
        await saveAppliedEvents(currentAppliedEventIds);
        
        // Update events data to reflect new applied status
        setEventsData(prevEvents => 
          prevEvents.map(event => ({
            ...event,
            isApplied: currentAppliedEventIds.has(event.id) || event.isApplied
          }))
        );
        
        // Also update filtered events data
        setFilteredEventsData(prevEvents => 
          prevEvents.map(event => ({
            ...event,
            isApplied: currentAppliedEventIds.has(event.id) || event.isApplied
          }))
        );
        
        console.log('✅ Applied events synced successfully');
      }
    } catch (error) {
      console.error('❌ Error fetching applied events for sync:', error);
    }
  };

  // Set name immediately from Redux when available
  useEffect(() => {
    if (authName) {
      console.log('Setting artist name from Redux:', authName);
      setArtistName(getFirstName(authName));
    }
    if (authLocation) {
      console.log('Setting artist location from Redux:', authLocation);
      setArtistLocation(authLocation);
    }
  }, [authName, authLocation]);

  // Load applied events and fetch data on component mount
  useEffect(() => {
    const initializeData = async () => {
      // Set name and location from Redux immediately if available
      if (authName) {
        setArtistName(getFirstName(authName));
      }
      if (authLocation) {
        setArtistLocation(authLocation);
      }
      
      await loadAppliedEvents(); // Load applied events first
      await loadSavedEvents(); // Load saved events
      fetchArtistProfile(); // This will override with API data if available
      // Small delay to ensure applied events are loaded before fetching events
      setTimeout(() => fetchEvents(), 100);
    };
    
    initializeData();
  }, []);

  // Add focus listener to reload saved events and refresh applied events when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 ArtistHomeScreen focused - reloading data from storage and API');
      loadSavedEvents(); // Reload saved events when screen comes into focus
      
      // Also refresh applied events from API to sync with ArtistAppliedScreen
      if (token) {
        console.log('🔄 Refreshing applied events from API...');
        fetchAppliedEventsOnly();
      }
    });

    return unsubscribe;
  }, [navigation, token]);

  // Load applied events when userData changes (user switches)
  useEffect(() => {
    if (userData?.id) {
      loadAppliedEvents();
      loadSavedEvents();
    }
  }, [userData?.id]);

  // Monitor Redux applied events changes
  useEffect(() => {
    console.log('🔄 Redux Applied Events Updated:', appliedEventsFromRedux);
    console.log('📊 Total Applied Events in Redux:', appliedEventsFromRedux?.length || 0);
  }, [appliedEventsFromRedux]);

  // Handle back button press to close app only on ArtistHomeScreen
  useEffect(() => {
    const backAction = () => {
      // Check if we're on the ArtistHomeScreen by checking navigation state
      const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
      
      if (currentRoute === 'ArtistHome') {
        // Only show exit dialog if we're on the ArtistHomeScreen
        setShowExitAlert(true);
        return true; // Prevent default back action
      }
      
      // For other screens, allow normal back navigation
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Update events data when Redux applied events change
  useEffect(() => {
    if (eventsData.length > 0 && appliedEventsFromRedux) {
      // Update events data to reflect current applied status from Redux
      const updatedEvents = eventsData.map(event => ({
        ...event,
        isApplied: event.isApplied || appliedEventsFromRedux.includes(event.id)
      }));
      
      if (JSON.stringify(updatedEvents) !== JSON.stringify(eventsData)) {
        setEventsData(updatedEvents);
        console.log('🔄 Updated events data with Redux applied status');
      }
    }
  }, [appliedEventsFromRedux]);

  // Debounce search input to prevent too many API calls
  useEffect(() => {
    if (eventsData.length > 0) {
      // If any filters are active, use API filtering
      if (searchText || selectedGenre || selectedBudget || selectedLocation || selectedDate) {
        // Clear existing timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
        
        // Set new timeout for debounced search
        searchTimeoutRef.current = setTimeout(() => {
          filterEventsWithAPI({
            search: searchText,
            genre: selectedGenre,
            budget: selectedBudget,
            location: selectedLocation,
            date: selectedDate,
          });
        }, searchText ? 800 : 0); // Increased debounce to 800ms for search, immediate for other filters
      } else {
        // No filters, show all events
        setFilteredEventsData(eventsData);
      }
    }
    
    // Cleanup function
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [eventsData, searchText, selectedGenre, selectedBudget, selectedLocation, selectedDate]);

  // Date picker handlers
  const handleDatePress = () => {
    setShowDatePicker(true);
    setShowGenreDropdown(false); // Close other modals
    setShowBudgetModal(false);
    setShowLocationModal(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
    
    if (selectedDate) {
      setDatePickerValue(selectedDate);
      setSelectedDate(selectedDate);
      
      // Apply date filter using API
      filterEventsWithAPI({
        search: searchText,
        genre: selectedGenre,
        budget: selectedBudget,
        location: selectedLocation,
        date: selectedDate,
      });
    }
  };

  const confirmDateSelection = () => {
    setShowDatePicker(false);
    setSelectedDate(datePickerValue);
    
    // Apply date filter using API
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location: selectedLocation,
      date: datePickerValue,
    });
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
    setDatePickerValue(selectedDate || new Date());
  };

  // Location modal handlers
  const handleLocationButtonPress = () => {
    setShowLocationModal(true);
    setShowGenreDropdown(false); // Close other modals
    setShowBudgetModal(false);
    setShowDatePicker(false);
    setLocationInput(selectedLocation || ''); // Pre-fill with current selection
  };

  const handleLocationSubmit = () => {
    const location = locationInput.trim();
    setSelectedLocation(location || null);
    setShowLocationModal(false);
    
    // Apply location filter using API
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location: location || null,
      date: selectedDate,
    });
  };

  const handleLocationCancel = () => {
    setShowLocationModal(false);
    setLocationInput(selectedLocation || '');
  };

  const handleLocationClear = () => {
    setLocationInput('');
    setSelectedLocation(null);
    setShowLocationModal(false);
    
    // Apply filter without location using API
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location: null,
      date: selectedDate,
    });
  };

  // Filter button handlers
  const handleAllPress = () => {
    setSelectedGenre(null);
    setSelectedBudget(null);
    setSelectedLocation(null);
    setSelectedDate(null);
    setSearchText('');
    setShowGenreDropdown(false);
    setShowBudgetModal(false);
    setShowDatePicker(false);
    setShowLocationModal(false);
    setLocationInput('');
    setFilteredEventsData(eventsData); // Show all events
  };
  
  const handleGenreButtonPress = () => {
    setShowGenreDropdown(!showGenreDropdown);
    setShowBudgetModal(false);
    setShowLocationModal(false);
    setShowDatePicker(false);
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setShowGenreDropdown(false);
    // Use API filtering instead of local filtering
    filterEventsWithAPI({
      search: searchText,
      genre,
      budget: selectedBudget,
      location: selectedLocation,
      date: selectedDate,
    });
  };
  
  const handleBudgetPress = (budget) => {
    setSelectedBudget(budget);
    setShowGenreDropdown(false); // Close genre dropdown
    // Use API filtering instead of local filtering
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget,
      location: selectedLocation,
      date: selectedDate,
    });
  };
  
  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    setShowGenreDropdown(false); // Close genre dropdown
    // Use API filtering instead of local filtering
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location,
      date: selectedDate,
    });
  };
  
  const handleSearchChange = useCallback((text) => {
    setSearchText(text);
    setShowGenreDropdown(false); // Close dropdowns when searching
    setShowBudgetModal(false);
    setShowLocationModal(false);
    setShowDatePicker(false);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setShowGenreDropdown(false); // Close dropdowns
    setShowBudgetModal(false);
    setShowLocationModal(false);
    setShowDatePicker(false);
    
    // Trigger immediate search when search button is pressed
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Apply filter immediately
    filterEventsWithAPI({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location: selectedLocation,
      date: selectedDate,
    });
  }, [searchText, selectedGenre, selectedBudget, selectedLocation, selectedDate]);

  const handleSearchClear = useCallback(() => {
    setSearchText('');
    setShowGenreDropdown(false);
    setShowBudgetModal(false);
    setShowLocationModal(false);
    setShowDatePicker(false);
  }, []);

  const [hasNotification, setHasNotification] = useState(true); // For demo, set to true
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const [showExitAlert, setShowExitAlert] = useState(false);

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

  const renderScrollableHeader = useCallback(() => (
    <>
      {/* Search Bar */}
      <SearchBar
        searchText={searchText}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onClear={handleSearchClear}
      />

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.allPillActive]} onPress={handleAllPress}>
           <Ionicons name="grid" size={18} color={'#fff'} style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, { color: '#fff' }]}>All</Text>
        </TouchableOpacity>
         <View style={styles.genreFilterContainer}>
           <TouchableOpacity 
             style={[
               styles.filterButton, 
               selectedGenre && styles.filterButtonActive,
               showGenreDropdown && styles.filterButtonActive
             ]} 
             onPress={handleGenreButtonPress}
           >
             <Ionicons name="musical-notes" size={18} color={selectedGenre || showGenreDropdown ? "#fff" : "#aaa"} style={styles.filterIcon} />
             <Text style={[
               styles.filterButtonText, 
               selectedGenre || showGenreDropdown ? styles.filterButtonTextActive : styles.filterButtonTextInactive
             ]}>
               {selectedGenre || 'Genre'}
             </Text>
             <Ionicons 
               name={showGenreDropdown ? "chevron-up" : "chevron-down"} 
               size={16} 
               color={selectedGenre || showGenreDropdown ? "#fff" : "#aaa"} 
             />
           </TouchableOpacity>

           {showGenreDropdown && (
             <Modal
               transparent={true}
               visible={showGenreDropdown}
               animationType="fade"
               onRequestClose={() => setShowGenreDropdown(false)}
             >
               <TouchableOpacity
                 style={styles.genreModalOverlay}
                 activeOpacity={1}
                 onPress={() => setShowGenreDropdown(false)}
               >
                 <View style={styles.genreDropdown}>
                   {GENRE_OPTIONS.map((genre, index) => (
                     <TouchableOpacity
                       key={index}
                       style={[
                         styles.genreDropdownItem,
                         selectedGenre === genre && styles.genreDropdownItemSelected,
                         index === GENRE_OPTIONS.length - 1 && styles.genreDropdownItemLast
                       ]}
                       onPress={() => handleGenreSelect(genre)}
                     >
                       <Text style={[
                         styles.genreDropdownItemText,
                         selectedGenre === genre && styles.genreDropdownItemTextSelected
                       ]}>
                         {genre}
                       </Text>
                     </TouchableOpacity>
                   ))}
                 </View>
               </TouchableOpacity>
             </Modal>
           )}
         </View>
         <TouchableOpacity 
           style={[
             styles.filterButton, 
             selectedBudget && styles.filterButtonActive
           ]} 
           onPress={() => {
             setShowBudgetModal(true);
             setShowGenreDropdown(false);
           }}
         >
            <FontAwesome name="dollar" size={18} color={selectedBudget ? "#fff" : "#aaa"} style={styles.filterIcon} />
          <Text style={[
            styles.filterButtonText, 
            selectedBudget ? styles.filterButtonTextActive : styles.filterButtonTextInactive
          ]}>
            {selectedBudget ? formatBudgetINR(selectedBudget) : 'Budget'}
          </Text>
        </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              selectedDate && styles.filterButtonActive
            ]} 
            onPress={handleDatePress}
          >
            <Icon name="calendar" size={18} color={selectedDate ? "#fff" : "#aaa"} style={styles.filterIcon} />
            <Text style={[
              styles.filterButtonText, 
              selectedDate ? styles.filterButtonTextActive : styles.filterButtonTextInactive
            ]}>
              {selectedDate ? formatDateForDisplay(selectedDate) : 'Date'}
            </Text>
          </TouchableOpacity>
           <TouchableOpacity 
             style={[
               styles.filterButton, 
               selectedLocation && styles.filterButtonActive
             ]} 
             onPress={handleLocationButtonPress}
           >
             <Icon name="map-pin" size={18} color={selectedLocation ? "#fff" : "#aaa"} style={styles.filterIcon} />
             <Text style={[
               styles.filterButtonText, 
               selectedLocation ? styles.filterButtonTextActive : styles.filterButtonTextInactive
             ]}>
               {selectedLocation || 'Location'}
             </Text>
           </TouchableOpacity>
      </ScrollView>

      {/* Separator Line */}
      <View style={styles.separatorLine} />

      {/* Latest Events */}
      <View style={styles.latestEventsContainer}>
        <Text
          style={[
            styles.latestEventsTitle,
            {
              color: '#404040',
              fontFamily: 'Roboto',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: undefined,
            },
          ]}
        >
          Latest Events
        </Text>
      </View>
    </>
  ), [searchText, handleSearchChange, handleSearchSubmit, handleSearchClear, selectedGenre, selectedBudget, selectedLocation, selectedDate, showGenreDropdown, showBudgetModal, showDatePicker, showLocationModal, locationInput, currentBudget, formatBudgetINR, formatDateForDisplay, handleDatePress, handleLocationButtonPress, handleAllPress, handleGenreButtonPress, handleGenreSelect, handleBudgetPress, handleLocationPress]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SignUpBackground
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        width={width}
        height={'100%'}
      />
      
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: Math.max(insets.top * 0.5, 10) }]}>
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
                Hello {artistName}!
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
                Hello {artistName}!
              </Text>
            </LinearGradient>
          </MaskedView>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#a95eff" />
            <Text style={styles.locationText}>{artistLocation}</Text>
          </View>
        </View>
        <Animated.View style={{
          transform: [{ rotate: notificationAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-15deg', '15deg'] }) }]
        }}>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('ArtistNotification')}>
            <Icon name="bell" size={24} color="#fff" />
            {/* Notification dot */}
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollableContent}>
        {/* Loading State for Events */}
        {isLoadingEvents ? (
          <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
            <MusicBeatsLoader />
            <Text style={{ color: '#fff', marginTop: 10 }}>Loading events...</Text>
          </View>
        ) : eventsError ? (
          <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#fff', marginBottom: 20, textAlign: 'center' }}>{eventsError}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchEvents}
            >
              <Text style={{ color: '#fff' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredEventsData}
            renderItem={({ item }) => (
              <ArtistEventCard 
                item={item} 
                navigation={navigation} 
                onEventApplied={handleEventApplied}
                onEventSaved={handleEventSaved}
                savedEvents={locallySavedEvents}
                likedEvents={likedEventIds}
                setLikedEventIds={setLikedEventIds}
                appliedEventsFromRedux={appliedEventsFromRedux}
              />
            )}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderScrollableHeader}
            ListFooterComponent={() => (
              isFilteringEvents ? (
                <View style={styles.filteringLoadingContainer}>
                  <ActivityIndicator size="small" color="#a95eff" />
                  <Text style={styles.filteringLoadingText}>Filtering events...</Text>
                </View>
              ) : null
            )}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ItemSeparatorComponent={() => <View style={{ height: 24 }} />} // Add more space between cards
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <ArtistBottomNavBar
        navigation={navigation}
        insets={insets}
        isLoading={isLoadingEvents || isFilteringEvents}
      />

      {/* Budget Selection Modal */}
      <Modal
        visible={showBudgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={styles.modalOverlayTop}>
          <View style={styles.budgetModalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowBudgetModal(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Budget Value Bubble */}
            <View style={[styles.budgetValueBubble, { left: bubbleLeft }]}>
              <Text style={styles.budgetValueText}>{formatBudgetINR(currentBudget)}</Text>
            </View>

            {/* Slider Implementation */}
            <Slider
              style={styles.actualSlider}
              minimumValue={0}
              maximumValue={500000}
              value={currentBudget}
              step={5000}
              onValueChange={value => {
                const roundedValue = Math.round(value);
                setCurrentBudget(roundedValue);
                const estimatedLeft = `${(roundedValue / 500000) * 90}%`;
                setBubbleLeft(estimatedLeft);
              }}
              onSlidingComplete={value => {
                const roundedValue = Math.round(value);
                handleBudgetPress(roundedValue);
                // Close modal after a brief delay
                setTimeout(() => {
                  setShowBudgetModal(false);
                }, 300);
              }}
              minimumTrackTintColor="#a95eff"
              maximumTrackTintColor="#3e3e3e"
              thumbTintColor="#a95eff"
            />

            {/* Budget Range Labels */}
            <View style={styles.budgetRangeLabels}>
              <Text style={styles.budgetRangeLabel}>₹0</Text>
              <Text style={styles.budgetRangeLabel}>₹5 L</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={datePickerValue}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "calendar"}
          onChange={handleDateChange}
          minimumDate={new Date()} // Prevent past dates for events
          textColor="#fff"
        />
      )}
      
      {/* iOS Date Picker Buttons */}
      {Platform.OS === "ios" && showDatePicker && (
        <View style={styles.datePickerButtons}>
          <TouchableOpacity onPress={cancelDateSelection}>
            <Text style={styles.datePickerButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmDateSelection}>
            <Text style={styles.datePickerButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Location Input Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={handleLocationCancel}
      >
        <View style={styles.locationModalOverlay}>
          <View style={styles.locationModalContent}>
            {/* Header */}
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalTitle}>Enter Location</Text>
              <TouchableOpacity onPress={handleLocationCancel}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Location Input */}
            <View style={styles.locationInputContainer}>
              <Icon name="map-pin" size={20} color="#a95eff" style={styles.locationInputIcon} />
              <TextInput
                style={styles.locationInput}
                value={locationInput}
                onChangeText={setLocationInput}
                placeholder="Enter city, area, or venue name"
                placeholderTextColor="#aaa"
                autoFocus={true}
                returnKeyType="done"
                onSubmitEditing={handleLocationSubmit}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.locationModalButtons}>
              <TouchableOpacity 
                style={styles.locationClearButton} 
                onPress={handleLocationClear}
              >
                <Text style={styles.locationClearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.locationSubmitButton} 
                onPress={handleLocationSubmit}
              >
                <LinearGradient 
                  colors={['#B15CDE', '#7952FC']} 
                  start={{x: 1, y: 0}} 
                  end={{x: 0, y: 0}} 
                  style={styles.locationSubmitButtonGradient}
                >
                  <Text style={styles.locationSubmitButtonText}>Apply</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Exit Alert Modal */}
      <Modal
        visible={showExitAlert}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowExitAlert(false)}
      >
        <View style={styles.exitAlertOverlay}>
          <View style={styles.exitAlertContainer}>
            <View style={styles.exitAlertIconContainer}>
              <Ionicons name="exit-outline" size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.exitAlertTitle}>Exit App</Text>
            <Text style={styles.exitAlertMessage}>
              Are you sure you want to exit the application?
            </Text>
            <View style={styles.exitAlertButtons}>
              <TouchableOpacity 
                style={styles.exitAlertCancelButton}
                onPress={() => setShowExitAlert(false)}
              >
                <Text style={styles.exitAlertCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.exitAlertExitButton}
                onPress={() => BackHandler.exitApp()}
              >
                <LinearGradient
                  colors={['#FF6B6B', '#FF5252']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.exitAlertExitGradient}
                >
                  <Text style={styles.exitAlertExitText}>Exit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
    paddingBottom: dimensions.spacing.md,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
    paddingBottom: dimensions.spacing.md,
  },
  greeting: {
    fontSize: dimensions.headerFontSize + 6,
    fontWeight: 'bold',
    color: '#a95eff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.spacing.xs,
  },
  locationText: {
    fontSize: dimensions.bodyFontSize,
    color: '#aaa',
    marginLeft: dimensions.spacing.xs,
  },
  notificationIcon: {
    padding: dimensions.spacing.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#C6C5ED',
    borderRadius: 20,
  },
    notificationDot: {
    position: 'absolute',
    top: dimensions.spacing.sm,
    right: dimensions.spacing.sm,
    width: dimensions.spacing.sm,
    height: dimensions.spacing.sm,
    borderRadius: dimensions.spacing.xs,
    backgroundColor: 'red',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(36,36,45,1)',
    backgroundColor: '#121212',
    marginHorizontal: dimensions.spacing.xl,
    marginTop: dimensions.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: dimensions.spacing.md,
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  searchClearButton: {
    padding: 2,
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    zIndex: 1000,
    elevation: 10,
  },
  filterButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 20,
    gap: 8,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: 'rgba(45,45,56,1)',
    backgroundColor: '#1a1a1a',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(198,197,237,1)',
    borderColor: 'rgba(45,45,56,1)',
  },
  filterIcon:{
    marginRight: 5,
  },
  filterButtonText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  filterButtonTextInactive: {
    color: '#aaa',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#24242D',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  latestEventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  latestEventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: width * 0.9, // Increased from 0.8 to 0.9 for wider cards
    marginBottom: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Minimalist faded border
  },
  eventImage: {
    width: '100%',
    height: 150, // Adjust image height as needed
    resizeMode: 'cover',
   
  },
   dateOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#000000aa',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  dateDay: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
        heartIcon: {
     position: 'absolute',
     top: 10,
     right: 10,
     zIndex: 10, // Ensure heart icon is above image
     backgroundColor: 'transparent',
     borderRadius: 20,
     padding: 8,
     minWidth: 40,
     minHeight: 40,
     justifyContent: 'center',
     alignItems: 'center',
     },
  eventContent: {
    padding: 12,
  },
  eventLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  eventTimeAndRating: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  eventBudget: {
    fontSize: 12,
    color: '#7952FC',
    fontWeight:600,
    marginTop:5,
    marginBottom:5,
  },
  eventTime: {
    fontSize: 12,
    color: '#7952FC',
    fontWeight:600,
    marginTop:5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },
    guestListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
    guestListText: {
     fontSize: 14,
    color: '#fff',
    },
    guestListInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
     borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a95eff',
  },
  guestListInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
    },
   actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
    applyButton: {
    display: 'flex',
    width: '80%',
    height: 46,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
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
  bookmarkButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#B15CDE',
    borderRadius: 14,
  },
  bookmarkButtonSaved: {
    backgroundColor: '#B15CDE',
  },

  // Updated styles for the budget modal to match image
  modalOverlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 280,
  },
  budgetModalContent: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    paddingTop: 25,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 4,
  },
  modalTitle: {
    // Removed as per image
  },
  budgetValueBubble: {
    position: 'absolute',
    top: -25,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 75,
  },
  budgetValueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  actualSlider: {
    width: '100%',
    height: 40,
    marginVertical: 8,
  },
  budgetRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
    marginBottom: 10,
  },
  budgetRangeLabel: {
    fontSize: 12,
    color: '#aaa',
    fontWeight: '500',
  },
  allPillActive: {
    backgroundColor: '#7952FC',
    borderWidth: 0,
  },
  appliedButton: {
    display: 'flex',
    width: '80%',
    height: 46,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderWidth: 0,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  appliedButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    height: '100%',
  },
  appliedButtonWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
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
    gap: 10,
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 13, // Slightly smaller than the outer border radius
  },
  appliedButtonText: {
    color: '#B15CDE',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 6,
  },
  appliedButtonTextGradient: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  retryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#a95eff',
    borderRadius: 8,
  },
  genreFilterContainer: {
    position: 'relative',
    marginRight: 10,
  },
  genreModalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingTop: 170, // Adjust this value to position the dropdown correctly
    paddingLeft: 20,
  },
  genreDropdown: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 140,
    maxWidth: 200,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 20,
  },
  genreDropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  genreDropdownItemLast: {
    borderBottomWidth: 0,
  },
  genreDropdownItemSelected: {
    backgroundColor: '#B15CDE',
  },
  genreDropdownItemText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  genreDropdownItemTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  datePickerButtonText: {
    color: '#a95eff',
    fontSize: 16,
    fontWeight: '600',
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    borderWidth: 1,
    borderColor: '#333',
  },
  locationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  locationInputIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
  },
  locationModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  locationClearButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  locationClearButtonText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '500',
  },
  locationSubmitButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationSubmitButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSubmitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  filteringLoadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
  },
  filteringLoadingText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '400',
  },
  // Custom Exit Alert Styles
  exitAlertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  exitAlertContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 280,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  exitAlertIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  exitAlertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  exitAlertMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  exitAlertButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  exitAlertCancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitAlertCancelText: {
    color: '#aaa',
    fontSize: 14,
    fontWeight: '600',
  },
  exitAlertExitButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  exitAlertExitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitAlertExitText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ArtistHomeScreen;