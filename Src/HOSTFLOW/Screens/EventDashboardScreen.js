import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Share,
  SafeAreaView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RegisteredIcon from '../assets/icons/registered';
import ViewedIcon from '../assets/icons/viewed';
import LikedIcon from '../assets/icons/liked';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const EventDashboardScreen = ({ navigation, route }) => {
  const [isGuestListEnabled, setIsGuestListEnabled] = useState(
    route.params?.eventData?.eventGuestEnabled || false
  );
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(
    route.params?.eventData?.isSoundSystem || true
  );
  const [isEventActive, setIsEventActive] = useState(
    route.params?.eventData?.status === 'pending' || route.params?.eventData?.status === 'active'
  );
  const insets = useSafeAreaInsets();
  const eventData = route.params?.eventData; // Extract eventData from route.params
  const token = useSelector(state => state.auth.token); // Get token from Redux

  const textColor = '#fff';
  const subColor = '#ccc';

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Invalid Date';
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date)
      ? `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`
      : 'Invalid Date';
  };

  // Share event functionality
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this event: ${eventData?.eventName || 'Summer Beatcxvcbvsggggffffff'} on ${
          eventData?.eventDateTime?.[0] ? formatDate(eventData.eventDateTime[0]) : 'Jul 1'
        } at ${eventData?.venue || 'Central Park, New York'}! 🎶`,
        url: eventData?.guestLinkUrl || eventData?.posterUrl || 'https://example.com/event/summer-beat',
        title: eventData?.eventName || 'Summer Beatcxvcbvsggggffffff',
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

  // Toggle guest list API call
  const toggleGuestList = async () => {
    const eventId = eventData?._id;
    if (!eventId) {
      Alert.alert('Error', 'No event ID provided.');
      return;
    }

    try {
      console.log(`Making POST request to https://api.thescenezone.com/api/host/events/toggle-guest-list/${eventId}`);
      const response = await axios.patch(
        `https://api.thescenezone.com/api/host/events/toggle-guest-list/${eventId}`,
        { eventGuestEnabled: !isGuestListEnabled },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Toggle Guest List API Response:', response.data);

      if (response.data.success) {
        setIsGuestListEnabled(!isGuestListEnabled);
        Alert.alert('Success', `Guest list ${!isGuestListEnabled ? 'enabled' : 'disabled'} successfully.`);
      } else {
        console.log('API success is false, message:', response.data.message);
        Alert.alert('Error', response.data.message || 'Failed to toggle guest list.');
      }
    } catch (error) {
      console.error('Error toggling guest list:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to toggle guest list.');
    }
  };

  // Custom Toggle Component
  const CustomToggle = ({ value, onValueChange }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onValueChange}
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
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            Event Dashboard
          </Text>
          <TouchableOpacity onPress={onShare}>
            <Feather name="share-2" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Profile Card and Stats Cards Row */}
          <View style={styles.topCardsRow}>
            {/* Left Column: Profile Card + Event Card */}
            <View style={styles.leftColumn}>
              <View style={styles.profileCardNew}>
                <Image
                  source={
                    eventData?.hostId?.hostProfileImageUrl
                      ? { uri: eventData.hostId.hostProfileImageUrl }
                      : require('../assets/Images/frame1.png')
                  }
                  style={styles.profileImageFill}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.profileGradientOverlay}
                />
                <View style={styles.profileTextOverlay}>
                  <Text style={styles.profileGreetingNew}>
                    Hello {eventData?.hostId?.fullName || 'Host'}!
                  </Text>
                  <Text style={styles.profileLocationNew}>
                    {eventData?.venue || 'Central Park, New York'}
                  </Text>
                </View>
              </View>
              <View style={styles.eventCardNew}>
                <Image
                  source={
                    eventData?.posterUrl
                      ? { uri: eventData.posterUrl }
                      : require('../assets/Images/evendas.jpg')
                  }
                  style={styles.eventImageNew}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.eventGradientOverlay}
                />
                <View style={styles.eventCardContent}>
                  <Text style={styles.eventTitleNew}>
                    {eventData?.eventName || 'Summer Beatcxvcbvsggggffffff'}
                  </Text>
                  <Text style={styles.eventLocationNew}>
                    {eventData?.venue || 'Central Park, New York'}
                  </Text>
                </View>
              </  View>
            </View>
            {/* Right Column: Stats Cards */}
            <View style={styles.statsColumn}>
              <View style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  <RegisteredIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Registered</Text>
                </View>
                <Text style={styles.statValue}>
                  {eventData?.totalRegistered || '0'}
                </Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statLabelRow}>
                  <ViewedIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Viewed</Text>
                </View>
                <Text style={styles.statValue}>
                  {eventData?.totalViewed || '0'}
                </Text>
              </View>
              <View style={[styles.statCard, { marginBottom: 16 }]}>
                <View style={styles.statLabelRow}>
                  <LikedIcon style={styles.statIcon} />
                  <Text style={styles.statLabel}>Liked</Text>
                </View>
                <Text style={styles.statValue}>
                  {eventData?.totalLikes || '0'}
                </Text>
              </View>
            </View>
          </View>

          {/* Toggle Switch for Guest List */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <Text style={styles.toggleLabelNew}>Enable Guest List</Text>
            <CustomToggle
              value={isGuestListEnabled}
              onValueChange={toggleGuestList}
            />
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
    elevation: 8,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 24,
    paddingRight: 230,
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
    backgroundColor: '#121212',
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
    fontWeight: '600',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  profileLocationNew: {
    color: '#fff',
    fontSize: 9,
    paddingLeft: 10,
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
    marginBottom: 25,
    shadowColor: 'rgba(177, 92, 222, 0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
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
    backgroundColor: '#121212',
    marginBottom: 16,
    shadowColor: 'rgba(177, 92, 222, 0.10)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 32,
    elevation: 8,
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
    paddingLeft: 14,
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
});

export default EventDashboardScreen;