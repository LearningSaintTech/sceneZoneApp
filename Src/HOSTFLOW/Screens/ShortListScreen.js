import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FluentIcon from '../assets/icons/fluent';
import MaskedView from '@react-native-masked-view/masked-view';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

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
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 5),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.03, 12),
    xl: Math.max(width * 0.06, 20),
    xxl: Math.max(width * 0.08, 30),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.min(width * 0.55, height * 0.3),
  cardPadding: Math.max(width * 0.03, 12),
};

const ShortlistScreen = ({ navigation }) => {
  const [theme, setTheme] = useState('dark'); // Theme state ('dark' or 'light')
  const [shortlistedItems, setShortlistedItems] = useState({}); // Track shortlisted status
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Shortlist'); // Track which tab is active
  const [isAddOptionsModalVisible, setAddOptionsModalVisible] = useState(false); // State for modal visibility
  const [isContractDetailsModalVisible, setContractDetailsModalVisible] = useState(false); // New state for Contract Details modal
  const [isAddToExistingEventsModalVisible, setAddToExistingEventsModalVisible] = useState(false); // New state for Add To Existing Events modal
  // New state for manage events
  const [manageEvents, setManageEvents] = useState([]);
  const [manageEventsLoading, setManageEventsLoading] = useState(false);
  const [existingEvents, setExistingEvents] = useState([]);
  const [existingEventsLoading, setExistingEventsLoading] = useState(false);

  const token = useSelector(state => state.auth.token);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      const fetchShortlistedArtists = async () => {
        if (!token) {
          console.log("No token available.");
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const response = await axios.get('http://192.168.1.37:3000/api/host/getShortlistedArtists', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.data.success && Array.isArray(response.data.data)) {
            setApiData(response.data.data);
            const initialStatus = {};
            response.data.data.forEach(item => {
              initialStatus[item._id] = true;
            });
            setShortlistedItems(initialStatus);
          } else {
            console.error("Failed to fetch shortlisted artists:", response.data.message);
            setApiData([]);
          }
        } catch (error) {
          console.error("API error fetching shortlisted artists:", error.response?.data || error.message);
          setApiData([]);
        } finally {
          setLoading(false);
        }
      };
      if (activeTab === 'Shortlist') {
        fetchShortlistedArtists();
      }
    }, [token, activeTab])
  );

  // Helper to format date as 'May 20'
  const formatEventDate = (dateArr) => {
    if (!Array.isArray(dateArr) || !dateArr[0]) return '';
    const date = new Date(dateArr[0]);
    if (isNaN(date)) return '';
    return `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`;
  };

  // Helper to format time as '8:30 PM' (if eventTime is in '06:00 PM' format, just return it)
  const formatEventTime = (eventTime) => {
    if (!eventTime) return '';
    // If already in 'HH:MM AM/PM' just return
    return eventTime;
  };

  // Fetch manage events when Manage Event tab is active
  useFocusEffect(
    React.useCallback(() => {
      const fetchManageEvents = async () => {
        if (!token) {
          setManageEvents([]);
          setManageEventsLoading(false);
          return;
        }
        if (activeTab !== 'Manage Event') return;
        setManageEventsLoading(true);
        try {
          const response = await axios.get('http://192.168.1.37:3000/api/host/events/get-all-events', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          console.log('API response:', response.data);
          if (response.data.success && Array.isArray(response.data.data)) {
            const mappedEvents = response.data.data.map(event => ({
              ...event,
              formattedDate: formatEventDate(event.eventDate),
              formattedTime: formatEventTime(event.eventTime),
            }));
            console.log('Mapped events:', mappedEvents);
            setManageEvents(mappedEvents);
          } else {
            setManageEvents([]);
          }
        } catch (error) {
          console.log('Fetch error:', error);
          setManageEvents([]);
        } finally {
          setManageEventsLoading(false);
        }
      };
      fetchManageEvents();
    }, [token, activeTab])
  );

  // Enhanced responsive dimensions with safe area considerations
  const responsiveDimensions = {
    ...dimensions,
    safeAreaTop: Math.max(insets.top, 0),
    safeAreaBottom: Math.max(insets.bottom, 0),
    safeAreaLeft: Math.max(insets.left, 0),
    safeAreaRight: Math.max(insets.right, 0),
    containerPadding: {
      horizontal: Math.max(insets.left + dimensions.spacing.md, dimensions.spacing.md),
      vertical: Math.max(insets.top + dimensions.spacing.sm, dimensions.spacing.sm),
    },
  };

  // Sample data for shortlisted events (using local assets for the modal)
  const shortlistData = [
    {
      id: '1',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '2',
      genre: 'ROCK',
      budget: '$50,000',
      image: require('../assets/Images/ffff.jpg'),
    },
    {
      id: '3',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/shortlist1.png'),
    },
  ];

  // Theme colors
  const themes = {
    dark: {
      backgroundColor: '#000',
      textColor: '#fff',
      subColor: '#ccc',
      cardBackground: '#1a1a1a',
      activeTabBackground: '#a95eff',
      navBackground: '#1a1a1a',
    },
    light: {
      backgroundColor: '#fff',
      textColor: '#000',
      subColor: '#666',
      cardBackground: '#f0f0f0',
      activeTabBackground: '#a95eff',
      navBackground: '#e0e0e0',
    },
  };

  const currentTheme = themes[theme];

  // Toggle shortlist status for an event
  const toggleShortlist = (id) => {
    setShortlistedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Render each shortlist item (for Shortlist tab)
  const renderShortlistItem = ({ item }) => {
    const isShortlisted = shortlistedItems[item._id] || false;

    console.log(`Attempting to render image for item ${item._id} with URI: ${item.profileImageUrl}`);

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => {
          toggleShortlist(item._id);
          console.log(' HostPerfomanceDetails with artistId:', item.artistId);
          navigation.navigate('HostPerfomanceDetails', { artistId: item.artistId });
        }}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.profileImageUrl }}
            style={styles.eventImage}
            resizeMode="cover"
            onLoad={() => console.log(`Image successfully loaded for item ${item._id}`)}
            onError={(e) => console.error(`Failed to load image for item ${item._id}. URI: ${item.profileImageUrl}. Error:`, e.nativeEvent.error)}
          />
          {/* Overlay row at the bottom of the image */}
          <View style={styles.overlayRow}>
            <FluentIcon width={24} height={24} />
            <View style={[styles.overlayButton, styles.overlayButtonFirst]}>
              <Text style={styles.overlayButtonText}>{(item.genre && item.genre[0])?.toUpperCase() || 'N/A'}</Text>
            </View>
            <View style={styles.overlayButton}>
              <Text style={styles.overlayButtonText}>{`$${item.budget}`}</Text>
            </View>
            {isShortlisted ? (
              <TouchableOpacity style={styles.overlayPlus} onPress={() => toggleShortlist(item._id)}>
                <Feather name="minus" size={18} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.overlayPlus} onPress={() => setAddOptionsModalVisible(true)}>
                <Feather name="plus" size={12} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render the Manage Event card (for Manage Event tab)
  const renderManageEventCard = (event) => (
    <View style={styles.manageEventCardContainer} key={event._id}>
      <View style={styles.manageEventImageWrapper}>
        <Image
          source={event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg')}
          style={styles.manageEventImage}
          resizeMode="cover"
        />
        <View style={styles.manageEventDateBadge}>
          <Text style={styles.manageEventDateMonth}>{event.formattedDate.split(' ')[0]}</Text>
          <Text style={styles.manageEventDateDay}>{event.formattedDate.split(' ')[1]}</Text>
        </View>
      </View>
      <Text style={styles.manageEventTitle}>{event.eventName || 'Event Name'}</Text>
      {/* Show event time below or wherever your UI expects */}
      <Text style={{ color: '#fff', textAlign: 'center', marginBottom: 4 }}>{event.formattedTime}</Text>
      <View style={styles.manageEventButtonRow}>
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.manageEventButtonPurple}
        >
          <TouchableOpacity onPress={() => navigation.navigate('HostManageEvent')}
            style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={styles.manageEventButtonTextWhite}>Manage Event</Text>
          </TouchableOpacity>
        </LinearGradient>
        <TouchableOpacity
          style={styles.manageEventTrashButton}
          onPress={async () => {
            if (!event._id) return;
            try {
              setManageEventsLoading(true);
              await axios.delete(
                `http://192.168.1.37:3000/api/host/events/delete-event/${event._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                }
              );
              setManageEvents(prev => prev.filter(e => e._id !== event._id));
              Alert.alert('Success', 'Event deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete event');
            } finally {
              setManageEventsLoading(false);
            }
          }}
        >
          <Feather name="trash-2" size={dimensions.iconSize} color="#a95eff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const fetchExistingEvents = async () => {
    if (!token) return;
    setExistingEventsLoading(true);
    try {
      const response = await axios.get('http://192.168.1.37:3000/api/host/events/get-all-events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setExistingEvents(response.data.data);
      } else {
        setExistingEvents([]);
      }
    } catch (error) {
      setExistingEvents([]);
    } finally {
      setExistingEventsLoading(false);
    }
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: '#121212',
        paddingLeft: responsiveDimensions.safeAreaLeft,
        paddingRight: responsiveDimensions.safeAreaRight,
      }
    ]}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: Math.max(responsiveDimensions.safeAreaTop + dimensions.spacing.lg, 30),
            paddingBottom: Math.max(responsiveDimensions.safeAreaBottom + 100, 120),
            paddingHorizontal: responsiveDimensions.containerPadding.horizontal,
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section - dynamic heading with line below */}
        <Text style={[styles.screenTitle, { color: currentTheme.textColor }]}>
          {activeTab === 'Shortlist' ? 'Shortlists' : 'Manage Event'}
        </Text>
        <View style={styles.dividerLine} />
        
        {/* Header with Tabs */}
        <View style={styles.header}>
          {/* Shortlist Tab */}
          {activeTab === 'Shortlist' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.tab, styles.activeTab]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setActiveTab('Shortlist')}
                activeOpacity={1}
              >
                <Text style={[styles.tabText, { color: '#FFF' }]}>Shortlist</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              style={[styles.tab, styles.inactiveTab]}
              onPress={() => setActiveTab('Shortlist')}
            >
              <Text style={[styles.tabText, { color: '#B15CDE' }]}>Shortlist</Text>
            </TouchableOpacity>
          )}
          {/* Manage Event Tab */}
          {activeTab === 'Manage Event' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.tab, styles.activeTab]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setActiveTab('Manage Event')}
                activeOpacity={1}
              >
                <Text style={[styles.tabText, { color: '#FFF' }]}>Manage Event</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <TouchableOpacity
              style={[styles.tab, styles.inactiveTab]}
              onPress={() => setActiveTab('Manage Event')}
            >
              <Text style={[styles.tabText, { color: '#FFF' }]}>Manage Event</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content based on tab */}
        {activeTab === 'Shortlist' ? (
          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#a95eff" style={{ marginTop: 20 }} />
            ) : (
              apiData.map((item) => (
                <View key={item._id}>
                  {renderShortlistItem({ item })}
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.manageEventTabContent}>
            {manageEventsLoading ? (
              <ActivityIndicator size="large" color="#a95eff" style={{ marginTop: 20 }} />
            ) : (
              manageEvents.length > 0 ? (
                manageEvents.map(event => renderManageEventCard(event))
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No events found.</Text>
              )
            )}
          </View>
        )}
      </ScrollView>

      {/* Add Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddOptionsModalVisible}
        onRequestClose={() => setAddOptionsModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={["#7952FC", "#B15CDE"]}
            start={{ x: 0.85, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.modalContent}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={[
                styles.modalCloseButton,
                {
                  top: dimensions.spacing.lg,
                  right: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.lg, dimensions.spacing.lg),
                }
              ]}
              onPress={() => setAddOptionsModalVisible(false)}
            >
              <Feather name="x" size={dimensions.iconSize} color="#fff" />
            </TouchableOpacity>

            {/* Buttons */}
            <TouchableOpacity style={styles.modalButton} onPress={() => { setAddOptionsModalVisible(false); setContractDetailsModalVisible(true); }}>
              <Text style={styles.modalButtonTextWhite}>On Salary Basis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setAddOptionsModalVisible(false);
                setAddToExistingEventsModalVisible(true);
                fetchExistingEvents();
              }}
            >
              <Text style={styles.modalButtonTextWhite}>Add To Existing Events</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> {navigation.navigate('ShortlistCreateNewEvent'); setAddOptionsModalVisible(false);}} style={styles.modalButton}>
              <Text style={styles.modalButtonTextWhite}>Create a New Event</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Contract Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isContractDetailsModalVisible}
        onRequestClose={() => setContractDetailsModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.contractDetailsModalContent, 
            { 
              paddingTop: Math.max(responsiveDimensions.safeAreaTop + 20, 50),
              paddingLeft: responsiveDimensions.safeAreaLeft,
              paddingRight: responsiveDimensions.safeAreaRight,
            }
          ]}>
            {/* Header */}
            <View style={[
              styles.contractDetailsHeader,
              {
                paddingHorizontal: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.lg, dimensions.spacing.lg),
                marginLeft: responsiveDimensions.safeAreaLeft,
                marginRight: responsiveDimensions.safeAreaRight,
              }
            ]}>
              <TouchableOpacity onPress={() => setContractDetailsModalVisible(false)} style={styles.backButtonContainer}>
                <Feather name="arrow-left" size={dimensions.iconSize} color="#fff" />
              </TouchableOpacity>
              <Text style={[
                styles.contractDetailsHeaderTitle,
                {
                  marginRight: 180,
                }
              ]}>Contract Details</Text>
              <View style={{ width: dimensions.iconSize }} />
            </View>

            {/* Contract Details Content */}
            <ScrollView contentContainerStyle={[
              styles.contractDetailsScrollViewContent, 
              { 
                paddingBottom: Math.max(responsiveDimensions.safeAreaBottom + 40, 60),
                paddingHorizontal: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.lg, dimensions.spacing.lg),
              }
            ]}>
              <Text style={styles.contractDetailsSectionTitle}>Working Hours:</Text>
              <Text style={styles.contractDetailsText}>You will be working from the Restaurant for 6 days a week. However, we may occasionally schedule additional sales events, seminars, or meetings during the holidays.</Text>

              <Text style={styles.contractDetailsText}>The regular working hours will be 1:00 p.m. to 11:00 p.m with 1 hour of break.</Text>

              <Text style={styles.contractDetailsText}>All employees will be required to work in shifts and/or extended hours as permitted by law.</Text>

              <Text style={styles.contractDetailsText}>You may be required to work beyond your existing working hours depending upon the business requirements/exigencies from time to time. However, For, overtime work charges can be determined by involved parties.</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add To Existing Events Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddToExistingEventsModalVisible}
        onRequestClose={() => setAddToExistingEventsModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.addToExistingModalOverlay}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[
              styles.addToExistingModalGradient, 
              { 
                marginTop: Math.max(responsiveDimensions.safeAreaTop + height * 0.15, 120),
                paddingBottom: Math.max(responsiveDimensions.safeAreaBottom + 30, 50),
                paddingLeft: responsiveDimensions.safeAreaLeft,
                paddingRight: responsiveDimensions.safeAreaRight,
              }
            ]}
          >
            {/* Close Button */}
            <TouchableOpacity
              style={[
                styles.addToExistingModalCloseButton,
                {
                  top: Math.max(responsiveDimensions.safeAreaTop + dimensions.spacing.md, dimensions.spacing.md),
                  right: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.md),
                }
              ]}
              onPress={() => setAddToExistingEventsModalVisible(false)}
            >
              <Feather name="x" size={dimensions.iconSize} color="#000" />
            </TouchableOpacity>
            {/* Event List */}
            {existingEventsLoading ? (
              <ActivityIndicator size="large" color="#a95eff" style={{ marginTop: 20 }} />
            ) : (
              existingEvents.length > 0 ? (
                existingEvents.map((item) => (
                  <View key={item._id} style={styles.existingEventCard}>
                    <Image source={item.posterUrl ? { uri: item.posterUrl } : require('../assets/Images/fff.jpg')} style={styles.existingEventImage} />
                    <View style={styles.existingEventDetails}>
                      <Text style={styles.existingEventTitle}>{item.eventName}</Text>
                      <Text style={styles.existingEventDescription}>Join us for an unforgettable evening filled with live music! Feel the beat and excitement!</Text>
                      <Text style={{ color: '#a95eff', fontSize: 10 }}>
                        {item.eventDate && item.eventDate[0] ? new Date(item.eventDate[0]).toLocaleString('en-US', { month: 'short', day: '2-digit' }) : ''} | {item.eventTime}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>No events found.</Text>
              )
            )}
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  screenTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#2d2d3a', // Dark line color
    width: '100%',
    marginBottom: dimensions.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Left-aligned as in the image
    paddingVertical: dimensions.spacing.md,
    marginBottom: 4,
    gap: 0, // Remove gap for manual spacing
  },
  tab: {
    flex: 1,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    shadowColor: 'rgba(177, 92, 222, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeTab: {
    flex: 1,
    borderWidth: 0,
  },
  inactiveTab: {
    flex: 1,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
  },
  tabText: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  title: {
    fontSize: dimensions.fontSize.large,
    fontWeight: '600',
    marginVertical: dimensions.spacing.lg,
  },
  listContainer: {
    paddingBottom: dimensions.spacing.md,
  },
  eventCard: {
    marginBottom: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: dimensions.imageHeight,
  },
  overlayRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 8,
  },
  overlayButton: {
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayButtonFirst: {},
  overlayButtonText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 15,
    textTransform: 'uppercase',
  },
  overlayPlus: {
    backgroundColor: '#a95eff',
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  manageEventTabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: dimensions.spacing.xxl,
  },
  manageEventCardContainer: {
    display: 'flex',
    width: 320,
    minWidth: 200,
    maxWidth: 400,
    padding: 12,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(252, 252, 253, 0.12)',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 6,
    marginTop: 0,
  },
  manageEventImageWrapper: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  manageEventImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  manageEventDateBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#181828',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
    zIndex: 2,
  },
  manageEventDateMonth: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 12,
  },
  manageEventDateDay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  manageEventTitle: {
    color: '#FCFCFD',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 2,
    marginBottom: 10,
    alignSelf: 'center',
    paddingRight:80,
  },
  manageEventButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
  },
  manageEventButtonPurple: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    minHeight: 36,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  manageEventButtonTextWhite: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    //lineHeight: 18,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  manageEventTrashButton: {
    borderWidth: 1.2,
    borderColor: '#a95eff',
    borderRadius: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: 393,
    height: 272,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    alignItems: 'center',
    position: 'relative',
    padding: 24,
    backgroundColor: '#8D6BFC', // fallback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -15 },
    shadowOpacity: 0.4,
    shadowRadius: 34,
    elevation: 10,
    alignSelf: 'center',
    maxWidth: '100%',
    marginHorizontal: 0,
  },
  modalCloseButton: {
    position: 'absolute',
    backgroundColor: '#a95eff',
    borderRadius: dimensions.borderRadius.xl,
    width: Math.max(width * 0.1, 40),
    height: Math.max(width * 0.1, 40),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalButton: {
    width: '95%',
    paddingVertical: dimensions.spacing.lg,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: dimensions.spacing.lg,
    backgroundColor: 'transparent',
    minHeight: dimensions.buttonHeight,
    justifyContent: 'center',
    borderColor: '#FFF',
    borderWidth: 1,
  },
  modalButtonWhite: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  modalButtonTextWhite: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  modalButtonTextPurple: {
    color: '#a95eff',
    fontSize: dimensions.fontSize.header,
    fontWeight: '600',
  },
  contractDetailsModalContent: {
    flex: 1,
    backgroundColor: '#111018',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  contractDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: '#2d2d3a',
    minHeight: Math.max(height * 0.08, 60),
  },
  backButtonContainer: {
    minWidth: dimensions.iconSize,
    minHeight: dimensions.iconSize,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contractDetailsHeaderTitle: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 15,
    fontStyle: 'normal',
    fontWeight: '680',
    lineHeight: 24,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'left',
    marginLeft: 12,
  },
  contractDetailsScrollViewContent: {
    paddingVertical: dimensions.spacing.xl,
  },
  contractDetailsSectionTitle: {
    color: '#C1C1C1',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 25,
    marginBottom: dimensions.spacing.sm,
    marginTop: dimensions.spacing.lg,
  },
  contractDetailsText: {
    color: '#838383',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 25,
    marginBottom: dimensions.spacing.md,
  },
  addToExistingModalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  addToExistingModalGradient: {
    flex: 1,
    borderTopLeftRadius: dimensions.borderRadius.xl,
    borderTopRightRadius: dimensions.borderRadius.xl,
    overflow: 'hidden',
    marginHorizontal: 0,
    paddingTop: Math.max(height * 0.08, 60),
    position: 'relative',
    minHeight: Math.max(height * 0.5, 400),
  },
  addToExistingModalCloseButton: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: dimensions.borderRadius.xl,
    width: Math.max(width * 0.1, 40),
    height: Math.max(width * 0.1, 40),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  existingEventListContainer: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  existingEventCard: {
    display: 'flex',
    flexDirection: 'row',
    height: 92,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 6,
    paddingRight: 13,
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
    borderRadius: 8,
    backgroundColor: '#F6F8FA',
    marginBottom: dimensions.spacing.md,
    overflow: 'hidden',
    borderWidth: 0,
  },
  existingEventImage: {
    width: 78,
    height: 80,
    borderRadius: 4,
    marginRight: dimensions.spacing.md,
    backgroundColor: '#9A1E25',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4.8 },
    shadowOpacity: 0.10,
    shadowRadius: 28.8,
  },
  existingEventDetails: {
    flex: 1,
    padding: dimensions.spacing.md,
    justifyContent: 'space-between',
  },
  existingEventTitle: {
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: undefined,
    marginTop: 9,
    marginBottom: dimensions.spacing.xs,
  },
  existingEventDescription: {
    color: '#646465',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 15,
    marginBottom: dimensions.spacing.sm,
  },
  headerFixed: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
    width: 393,
    height: 112,
    padding: 16,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#121212',
    marginBottom: 0,
  },
});

export default ShortlistScreen;