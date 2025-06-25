import React, { useState } from 'react';
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
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FluentIcon from '../assets/icons/fluent';
import MaskedView from '@react-native-masked-view/masked-view';
import Tapicon from '../assets/icons/Tapicon';
import BlackRectangle from '../assets/icons/BlackRectangle';

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
  const [activeTab, setActiveTab] = useState('Shortlist'); // Track which tab is active
  const [isAddOptionsModalVisible, setAddOptionsModalVisible] = useState(false); // State for modal visibility
  const [isContractDetailsModalVisible, setContractDetailsModalVisible] = useState(false); // New state for Contract Details modal
  const [isAddToExistingEventsModalVisible, setAddToExistingEventsModalVisible] = useState(false); // New state for Add To Existing Events modal

  const insets = useSafeAreaInsets();

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

  // Sample data for shortlisted events (using local assets)
  const shortlistData = [
    {
      id: '1',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'), // Local asset for event image
    },
    {
      id: '2',
      genre: 'ROCK',
      budget: '$50,000',
      image: require('../assets/Images/ffff.jpg'), // Local asset for event image
    },
    {
      id: '3',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/shortlist1.png'), // Local asset for event image
    },
    // 10 more identical events for demo
    {
      id: '4',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '5',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '6',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '7',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '8',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '9',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '10',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '11',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '12',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
    },
    {
      id: '13',
      genre: 'PERFORMANCE',
      budget: '$50,000',
      image: require('../assets/Images/fff.jpg'),
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
    const isShortlisted = shortlistedItems[item.id] || false;
    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('HostPerfomanceDetails')}
        activeOpacity={0.8}
      >
        <View style={styles.imageContainer}>
          {/* BlackRectangle SVG at top center with overlay text */}
          <View style={styles.crowdGuaranteeContainer}>
            <BlackRectangle />
            <Text style={styles.crowdGuaranteeText}>Crowd Guarantee</Text>
          </View>
          {/* Tapicon at top right over the image */}
          <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
            <Tapicon width={32} height={32} />
          </View>
          <Image
            source={item.image}
            style={styles.eventImage}
            resizeMode="cover"
          />
          {/* Overlay row at the bottom of the image */}
          <View style={styles.overlayRow}>
            <FluentIcon width={24} height={24} />
            <View style={[styles.overlayButton, styles.overlayButtonFirst]}>
              <Text style={styles.overlayButtonText}>{item.genre}</Text>
            </View>
            <View style={styles.overlayButton}>
              <Text style={styles.overlayButtonText}>{item.budget}</Text>
            </View>
            {isShortlisted ? (
              <TouchableOpacity style={styles.overlayPlus} onPress={() => toggleShortlist(item.id)}>
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
  const renderManageEventCard = () => (
    <LinearGradient
      colors={['rgba(252, 252, 253, 0.04)', 'rgba(252, 252, 253, 0.03)']}
      start={{ x: 0.13, y: 0 }}
      end={{ x: 0.98, y: 1 }}
      style={styles.manageEventCardContainer}
    >
      <View style={{ flex: 1, width: '100%' }}>
        <View style={styles.manageEventImageWrapper}>
          <Image
            source={require('../assets/Images/fff.jpg')}
            style={styles.manageEventImage}
            resizeMode="cover"
          />
          <View style={styles.manageEventDateBadge}>
            <Text style={styles.manageEventDateMonth}>May</Text>
            <Text style={styles.manageEventDateDay}>20</Text>
          </View>
        </View>
        <Text style={styles.manageEventTitle}>Sounds of Celebration</Text>
        <View style={styles.manageEventButtonRow}>
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.manageEventButtonPurple}
          >
            <TouchableOpacity onPress={()=>navigation.navigate('HostManageEvent')}
              style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={styles.manageEventButtonTextWhite}>Manage Event</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity style={styles.manageEventTrashButton}>
            <Feather name="trash-2" size={dimensions.iconSize} color="#a95eff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

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
            {shortlistData.map((item) => (
              <View key={item.id}>
                {renderShortlistItem({ item })}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.manageEventTabContent}>
            {renderManageEventCard()}
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
              style={styles.modalCloseButtonEdge}
              onPress={() => setAddOptionsModalVisible(false)}
            >
              <Feather name="x" size={dimensions.iconSize} color="#B15CDE" />
            </TouchableOpacity>

            {/* Buttons */}
            <TouchableOpacity style={styles.modalButton} onPress={() => { setAddOptionsModalVisible(false); setContractDetailsModalVisible(true); }}>
              <Text style={styles.modalButtonTextWhite}>On Salary Basis</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => { setAddOptionsModalVisible(false); setAddToExistingEventsModalVisible(true); }}>
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
              style={styles.modalCloseButtonEdge}
              onPress={() => setAddToExistingEventsModalVisible(false)}
            >
              <Feather name="x" size={dimensions.iconSize} color="#B15CDE" />
            </TouchableOpacity>
            {/* Event List */}
            <ScrollView 
              contentContainerStyle={[
                styles.existingEventListContainer,
                {
                  paddingHorizontal: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.lg, dimensions.spacing.lg),
                  paddingTop: Math.max(responsiveDimensions.safeAreaTop + dimensions.spacing.xl, dimensions.spacing.xl),
                }
              ]}
              showsVerticalScrollIndicator={false}
            >
              {shortlistData.map((item) => (
                <View key={item.id} style={styles.existingEventCard}>
                  <Image source={require('../assets/Images/fff.jpg')} style={styles.existingEventImage} />
                  <View style={styles.existingEventDetails}>
                    <Text style={styles.existingEventTitle}>Sounds of Celebration</Text>
                    <Text style={styles.existingEventDescription}>Join us for an unforgettable evening filled with live music! Feel the beat and excitement!</Text>
                    <View style={styles.dateTimeBox}>
                      <Text style={styles.dateTextBox}>May 20</Text>
                      <View style={styles.dateTimeDivider} />
                      <Text style={styles.timeTextBox}>08:30PM</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
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
    paddingHorizontal: 0,
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
    paddingHorizontal: 14,
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
    justifyContent: 'space-between',
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
    height: 260,
    width: '96%',
    minWidth: 200,
    maxWidth: 440,
    padding: 12,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: 10,
    flexWrap: 'wrap',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(252, 252, 253, 0.12)',
    overflow: 'hidden',
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 6,
    marginTop: 0,
    alignSelf: 'center',
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
    overflow: 'visible',
  },
  modalCloseButtonEdge: {
    position: 'absolute',
    top: -28,
    right: -28,
    width: 42,
    height:42,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginRight:40,
    marginTop:7
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
    overflow: 'visible',
    marginHorizontal: 0,
    paddingTop: 0,
    marginTop: 0,
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
  crowdGuaranteeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 18,
    width: 128,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 11,
    marginTop: 0,
    marginLeft:100,
  },
  crowdGuaranteeText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#B15CDE',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 18,
    letterSpacing: 0.2,
    zIndex: 12,
  },
  dateTimeBox: {
    display: 'flex',
    flexDirection: 'row',
    width: 115,
    height: 24,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 12,
    paddingRight: 18,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#7952FC',
    marginBottom: 6,
  },
  dateTextBox: {
    color: '#7952FC',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontWeight: '500',
  },
  timeTextBox: {
    color: '#7952FC',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontWeight: '500',
  },
  dateTimeDivider: {
    width: 16,
    height: 0,
    borderBottomWidth: 1,
    borderColor: '#D0C1FF',
    transform: [{ rotate: '90deg' }],
    flexShrink: 0,
    marginHorizontal: 2,
  },
});

export default ShortlistScreen;