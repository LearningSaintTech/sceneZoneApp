import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { removeAppliedEvent } from '../Redux/slices/appliedSlice';
import { selectToken } from '../Redux/slices/authSlice';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for trash icon
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome for star icon
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import LinearGradient from 'react-native-linear-gradient';
import AppliedIcon from '../assets/icons/Applied';
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

const ArtistAppliedScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('applied');
  const [appliedEvents, setAppliedEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);

  // Fetch applied events from API
  const fetchAppliedEvents = async () => {
    if (!token) {
      console.log('No token available for fetching applied events');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching applied events...');
      const response = await api.get('/artist/event/applied', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Applied events API response:', response.data);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Transform API data to match expected format
        const transformedEvents = response.data.data.map((application, index) => {
          const event = application.eventId; // Event data is nested in eventId
          
          // Get the first date from eventDateTime array
          const eventDate = event.eventDateTime && event.eventDateTime.length > 0 
            ? new Date(event.eventDateTime[0]) 
            : new Date();
          
          return {
            id: application._id || index.toString(),
            image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
            location: event.venue || 'Unknown Venue',
            budget: event.budget ? `$${event.budget}` : 'Budget Not Specified',
            time: eventDate.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            }),
            genres: Array.isArray(event.genre) ? event.genre : [event.genre || 'General'],
            rating: event.Rating || 4,
            status: application.status || 'pending', // Application status from the application object
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            guestLink: event.guestLinkUrl || '',
            eventName: event.eventName || 'Event',
            eventId: event._id,
            applicationId: application._id,
          };
        });

        setAppliedEvents(transformedEvents);
        console.log('Applied events set:', transformedEvents.length);
      } else {
        console.log('No applied events found or invalid response format');
        setAppliedEvents([]);
      }
    } catch (err) {
      console.error('Error fetching applied events:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError('Failed to load applied events');
      setAppliedEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch saved events from API
  const fetchSavedEvents = async () => {
    if (!token) {
      console.log('No token available for fetching saved events');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching saved events...');
      const response = await api.get('/artist/event/saved', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Saved events API response:', response.data);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // Transform API data to match expected format
        const transformedEvents = response.data.data.map((savedEvent, index) => {
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
          
          return {
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
          };
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

  // Fetch events when component mounts or when tab changes
  useEffect(() => {
    if (activeTab === 'applied') {
      fetchAppliedEvents();
    } else if (activeTab === 'saved') {
      fetchSavedEvents();
    }
  }, [activeTab, token]);

  const renderAppliedItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{item.dateMonth}</Text>
            <Text style={styles.dateText}>{item.dateDay}</Text>
          </View>
          <TouchableOpacity style={styles.heartIcon}>
             <Icon name="heart" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#fff" />
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
              <TouchableOpacity style={styles.savedEventButton}>
                <Text style={styles.savedEventText}>Saved Event</Text>
              </TouchableOpacity>
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
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const handleDelete = (id) => {
    const isAppliedTab = activeTab === 'applied';
    const actionText = isAppliedTab ? 'Remove Application' : 'Remove from Saved';
    const messageText = isAppliedTab ? 
      'Are you sure you want to remove this application?' : 
      'Are you sure you want to remove this event from saved?';
    
    Alert.alert(
      actionText,
      messageText,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (isAppliedTab) {
              // Remove from applied events
              setAppliedEvents(prev => prev.filter(event => event.id !== id));
              dispatch(removeAppliedEvent(id));
            } else {
              // Remove from saved events
              setSavedEvents(prev => prev.filter(event => event.id !== id));
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
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
          <ActivityIndicator size="large" color="#B15CDE" />
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
      />
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
    borderBottomColor: '#333',
    minHeight: dimensions.headerHeight,
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#C6C5ED',
    marginRight:220,
    
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
    width: 42,
    height: 42,
    borderRadius: 10,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
});

export default ArtistAppliedScreen; 