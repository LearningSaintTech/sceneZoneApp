import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Share,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RegisteredIcon from '../assets/icons/registered';
import ViewedIcon from '../assets/icons/viewed';
import LikedIcon from '../assets/icons/liked';

const { width } = Dimensions.get('window');

const EventDashboardScreen = ({ navigation }) => {
  const [isGuestListEnabled, setIsGuestListEnabled] = useState(false);
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(true);
  const [isEventActive, setIsEventActive] = useState(true); // New state for event status
  const insets = useSafeAreaInsets();

  const textColor = '#fff';
  const subColor = '#ccc';

  // Share event functionality
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Check out this event: Sounds of Celebration on May 20 at Yogyakarta! 🎶',
        url: 'https://example.com/event/sounds-of-celebration', // Replace with actual event URL
        title: 'Sounds of Celebration',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing event:', error.message);
    }
  };

  // Custom Toggle Component
  const CustomToggle = ({ value, onValueChange }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={{
        width: 36,
        height: 20,
        borderRadius: 10,
        backgroundColor: value ? '#A95EFF' : '#C6C5ED',
        justifyContent: 'center',
        paddingHorizontal: 2,
      }}
    >
      <View
        style={{
          width: 14.5,
          height: 14.5,
          borderRadius: 7.25,
          backgroundColor: '#0D0D0D',
          position: 'absolute',
          left: value ? 36 - 14.5 - 2 : 2,
          top: 2.75,
          // For smooth animation, you can use Animated.View in a real app
        }}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingHorizontal: 16,
        }}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: 20 }]}> 
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">Event Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.discountButton} onPress={() => navigation.navigate('HostDiscount')}>
            <Text style={styles.discountButtonText}>Discounts</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}> 
          {/* Profile Card and Stats Cards Row */}
          <View style={styles.topCardsRow}>
            {/* Left Column: Profile Card + Event Card */}
            <View style={styles.leftColumn}>
              <View style={styles.profileCardNew}>
                <Image
                  source={require('../assets/Images/frame1.png')}
                  style={styles.profileImageFill}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.profileGradientOverlay}
                />
                <View style={styles.profileTextOverlay}>
                  <Text style={styles.profileGreetingNew}>Hello Brandon!</Text>
                  <Text style={styles.profileLocationNew}>H-70, Sector 63, Noida</Text>
                </View>
              </View>
              <View style={styles.eventCardNew}>
                <Image
                  source={require('../assets/Images/evendas.jpg')}
                  style={styles.eventImageNew}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.eventGradientOverlay}
                />
                <View style={styles.eventCardContent}>
                  <Text style={styles.eventTitleNew}>Sounds of Celebration</Text>
                  <Text style={styles.eventLocationNew}>H-70, Sector 63, Noida</Text>
                </View>
              </View>
            </View>
            {/* Right Column: Stats Cards */}
            <View style={styles.statsColumn}>
              <View style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  <RegisteredIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Registered</Text>
                </View>
                <Text style={styles.statValue}>1.2k</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  <ViewedIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Viewed</Text>
                </View>
                <Text style={styles.statValue}>12.6k</Text>
              </View>
              <View style={[styles.statCard, { marginBottom: 16 }]}>
                <View style={styles.statLabelRow}>
                  <LikedIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Liked</Text>
                </View>
                <Text style={styles.statValue}>752</Text>
              </View>
            </View>
          </View>

          {/* Toggle Switch for Guest List */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={styles.toggleLabelNew}>Enable Guest List</Text>
            <CustomToggle value={isGuestListEnabled} onValueChange={setIsGuestListEnabled} />
          </View>
          {isGuestListEnabled && (
            <TouchableOpacity
              style={styles.guestListBox}
              onPress={() => navigation.navigate('HostEnableGuestList')}
              activeOpacity={0.8}
            >
              <MaterialIcons name="people" size={20} color="#27FEF0" style={{ marginRight: 10 }} />
              <Text style={styles.guestListBoxText}>Guest List</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 393,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8, // for Android shadow
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
  },
  scrollViewContent: {
    paddingTop: 16,
  },
  topCardsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  leftColumn: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 12,
  },
  profileCardNew: {
    width: 173,
    height: 264,
    borderRadius: 16,
    backgroundColor: '#121212', // fallback color
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  profileImageFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  profileGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  profileTextOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  profileGreetingNew: {
    color: '#27FEF0',
    fontSize: 16,
   // fontFamily: Poppins,
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileLocationNew: {
    color: '#fff',
    fontSize: 9,
    paddingLeft:10,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statsColumn: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  statCard: {
    width: '100%',
    minWidth: 0,
    height: 124,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#0D0D0D',
    marginBottom: 25, // for gap between cards
    shadowColor: 'rgba(177, 92, 222, 0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8, // for Android shadow
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    marginRight: 8,
  },
  statLabel: {
    color: '#b3b3cc',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  statValue: {
    color: '#a95eff',
    fontSize: 32,
    fontWeight: '700',
    
  },
  eventCardNew: {
    width: 173,
    height: 124,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#121212', // fallback color
    marginBottom: 16,
    shadowColor: 'rgba(177, 92, 222, 0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8, // for Android shadow
    overflow: 'hidden',
  },
  eventImageNew: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    width: '100%',
    height: '100%',
  },
  eventGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
  },
  eventCardContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    zIndex: 1,
  },
  eventTitleNew: {
    color: '#27FEF0',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventLocationNew: {
    color: '#fff',
    fontSize: 9,
    paddingLeft:14,
  },
  toggleLabelNew: {
    color: '#C6C5ED',
    fontSize: 12,
    fontWeight: '600',
  },
  guestListBox: {
    marginTop: 0,
    backgroundColor: '#000',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#34344A',
  },
  guestListBoxText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  discountButton: {
  marginRight:50,
    display: 'flex',
    height: 32,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    borderRadius: 10,
    backgroundColor: '#B15CDE',
    marginLeft: 12,
  },
  discountButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
});

export default EventDashboardScreen;