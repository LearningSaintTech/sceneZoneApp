import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventDashIcon from '../assets/icons/evendash';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

const ExploreEventScreen = ({ navigation, route }) => {
  console.log('ExploreEventScreen component mounted');
  const isDark = useColorScheme() === 'dark';
  const textColor = '#C6C5ED';
  const subColor = '#b3b3cc';
  const insets = useSafeAreaInsets();
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(true);
  const [eventData, setEventData] = useState(null);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    console.log('useEffect triggered, checking route.params');
    const fetchEventDetails = async () => {
      const { eventId } = route.params || {};
      console.log('Route params:', route.params);
      console.log('Extracted eventId:', eventId);

      if (!eventId) {
        console.log('No eventId provided, exiting fetch');
        Alert.alert('Error', 'No event ID provided.');
        return;
      }

      try {
        console.log(`Making GET request to http://192.168.1.8:3000/api/host/events/get-event/${eventId}`);
        const response = await axios.get(`http://192.168.1.8:3000/api/host/events/get-event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('API Response:', response.data);

        if (response.data.success) {
          console.log('API call successful, setting eventData:', response.data.data);
          setEventData(response.data.data);
          setSoundSystemAvailable(response.data.data.isSoundSystem || false);
        } else {
          console.log('API success is false, message:', response.data.message);
          Alert.alert('Error', response.data.message || 'Failed to fetch event details');
        }
      } catch (error) {
        console.error('Error fetching event details:', error.response?.data || error.message);
        Alert.alert('Error', 'Failed to fetch event details.');
      }
    };

    fetchEventDetails();
  }, [route.params, token]);

  const formatDate = (dateStr) => {
    console.log('formatDate called with:', dateStr);
    if (!dateStr) return 'Invalid Date';
    const date = new Date(dateStr);
    console.log('Parsed date:', date);
    return date instanceof Date && !isNaN(date) ? `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}` : 'Invalid Date';
  };

  console.log('Rendering ExploreEventScreen with eventData:', eventData);
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Background image with gradient overlay */}
      <View style={{ position: 'absolute', width: '100%', height: 320 }}>
        {eventData && eventData.posterUrl ? (
          <Image
            source={{ uri: eventData.posterUrl }}
            style={{ width: '100%', height: 320, position: 'absolute' }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require('../assets/Images/ffff.jpg')}
            style={{ width: '100%', height: 320, position: 'absolute' }}
            resizeMode="cover"
          />
        )}
        <LinearGradient
          colors={['transparent', '#000']}
          style={{ position: 'absolute', width: '100%', height: 320 }}
        />
      </View>

      {/* Header and Event Dashboard button */}
      <View style={{ position: 'absolute', width: '100%', top: insets.top + 12, zIndex: 2, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={styles.dashboardButtonWrapper}>
            <TouchableOpacity
  style={styles.dashboardButton}
  onPress={() => navigation.navigate('Event', { eventData })} // Pass eventData here
>
  <EventDashIcon width={20} height={20} style={{ marginRight: 12 }} />
  <Text style={styles.dashboardButtonText} numberOfLines={1} ellipsizeMode="tail">
    Event Dashboard
  </Text>
</TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.iconCircle}>
            <Feather name="share-2" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: 320, paddingBottom: Math.max(insets.bottom + 40, 40), paddingHorizontal: 0 }} showsVerticalScrollIndicator={false}>
        {/* Organizer Section */}
        <View style={styles.organizerRowNew}>
          {eventData && eventData.hostId && eventData.hostId.hostProfileImageUrl ? (
            <Image source={{ uri: eventData.hostId.hostProfileImageUrl }} style={styles.profilePicNew} />
          ) : (
            <Image source={require('../assets/Images/Avatar.png')} style={styles.profilePicNew} />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.organizerName}>
              {eventData && eventData.hostId ? eventData.hostId.fullName : 'Michael De Santa'}
            </Text>
            <Text style={styles.organizerRole}>Organizer</Text>
          </View>
          <LinearGradient
            colors={["#7952FC", "#B15CDE"]}
            start={{ x: 0.85, y: 0 }}
            end={{ x: 0.15, y: 1 }}
            style={styles.upcomingPill}
          >
            <MaterialIcons name="music-note" size={18} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.upcomingText}>
              {eventData && eventData.eventTime ? `${eventData.eventTime} ${new Date(eventData.eventDate[0]) > new Date('2025-06-21T12:39:00Z') ? 'Upcoming' : 'Past'}` : 'Upcoming'}
            </Text>
          </LinearGradient>
        </View>

        {/* Timing Pill */}
        <View style={styles.timeRowNew}>
          <View style={styles.timingPillOutlinedNew}>
            <MaterialIcons name="access-time" size={16} color="#a95eff" style={{ marginRight: 6 }} />
            <Text style={styles.timingPillTextLabelOutlinedNew}>Timing :</Text>
            <Text style={styles.timingPillTextTimeOutlinedNew}>
              {eventData ? eventData.eventTime : '08:30PM'}
            </Text>
          </View>
        </View>

        {/* Event Title */}
        <Text style={styles.eventTitleNew}>
          {eventData ? eventData.eventName : 'Sounds of Celebration'}
        </Text>

        {/* Tags */}
        <View style={styles.tagsRowNew}>
          {eventData && eventData.genre && Array.isArray(eventData.genre) ? (
            eventData.genre.map(tag => (
              <View key={tag} style={styles.tagOutlinedNew}>
                <Text style={styles.tagTextOutlinedNew}>{tag}</Text>
              </View>
            ))
          ) : (
            ['Rock', 'Classical', 'Jazz', 'Piano', 'Guitar'].map(tag => (
              <View key={tag} style={styles.tagOutlinedNew}>
                <Text style={styles.tagTextOutlinedNew}>{tag}</Text>
              </View>
            ))
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCardNew}>
          <View style={styles.infoItemNew}>
            <View style={styles.infoLabelRow}>
              <MaterialIcons name="date-range" size={14} color="#a95eff" style={{ marginRight: 4 }} />
              <Text style={styles.infoLabelNew}>Date</Text>
            </View>
            <Text style={styles.infoValueNew}>
              {eventData && eventData.eventDate && eventData.eventDate[0] ? formatDate(eventData.eventDate[0]) : 'May 20'}
            </Text>
          </View>
          <View style={styles.infoDividerNew} />
          <View style={styles.infoItemNew}>
            <View style={styles.infoLabelRow}>
              <MaterialIcons name="location-pin" size={14} color="#a95eff" style={{ marginRight: 4 }} />
              <Text style={styles.infoLabelNew}>Location</Text>
            </View>
            <Text style={styles.infoValueNew}>{eventData ? eventData.venue : 'Yogyakarta'}</Text>
          </View>
          <View style={styles.infoDividerNew} />
          <View style={styles.infoItemNew}>
            <View style={styles.infoLabelRow}>
              <MaterialIcons name="attach-money" size={14} color="#a95eff" style={{ marginRight: 4 }} />
              <Text style={styles.infoLabelNew}>Budget</Text>
            </View>
            <Text style={styles.infoValueNew}>{eventData ? `$${eventData.budget}` : '$400'}</Text>
          </View>
        </View>

        {/* Sound System */}
        <Text style={styles.sectionTitleNew}>Sound System Availability</Text>
        <View style={styles.checkboxRowNew}>
          <TouchableOpacity
            style={styles.checkboxOutlinedNew}
            onPress={() => setSoundSystemAvailable(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkboxBox, soundSystemAvailable && styles.checkboxBoxChecked]}>
              {soundSystemAvailable && <Feather name="check" size={16} color="#000" />}
            </View>
            <Text style={styles.checkboxTextOutlinedNew}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkboxOutlinedNew}
            onPress={() => setSoundSystemAvailable(false)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkboxBox, !soundSystemAvailable && styles.checkboxBoxChecked]}>
              {!soundSystemAvailable && <Feather name="check" size={16} color="#000" />}
            </View>
            <Text style={styles.checkboxTextOutlinedNew}>No</Text>
          </TouchableOpacity>
        </View>

        {/* About Event */}
        <Text style={styles.sectionTitleNew}>About this event:</Text>
        <Text style={styles.aboutTextNew}>
          {eventData ? eventData.about : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec lorem a justo pulvinar suscipit.'}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    backdropFilter: 'blur(8px)',
  },
  dashboardButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
    flex: 1,
    width: 200,
    backdropFilter: 'blur(8px)',
  },
  dashboardButtonText: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    overflow: 'hidden',
    textAlign: 'center',
  },
  organizerRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 18,
    zIndex: 1,
  },
  profilePicNew: {
    width: 42,
    height: 42,
    borderRadius: 28,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  organizerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
  },
  organizerRole: {
    fontSize: 14,
    color: '#b3b3cc',
    marginTop: 2,
    fontFamily: 'Nunito Sans',
  },
  upcomingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    paddingLeft: 12,
    paddingRight: 18,
    borderRadius: 360,
  },
  upcomingText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    fontSize: 10,
  },
  timeRowNew: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  timingPillOutlinedNew: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a95eff',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 7,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  timingPillTextLabelOutlinedNew: {
    color: '#a95eff',
    fontWeight: '500',
    fontSize: 10,
    marginRight: 6,
    fontFamily: 'Nunito Sans',
  },
  timingPillTextTimeOutlinedNew: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 10,
    fontFamily: 'Nunito Sans',
  },
  eventTitleNew: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
  },
  tagsRowNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  tagOutlinedNew: {
    borderWidth: 0.8,
    borderColor: '#b3b3cc',
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 6,
    marginTop: 16,
  },
  tagTextOutlinedNew: {
    color: '#C6C5ED',
    fontSize: 10,
    fontWeight: '500',
    fontFamily: 'Nunito Sans',
  },
  infoCardNew: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'rgba(13,13,13,1)',
    borderWidth: 0.8,
    borderColor: '#b3b3cc',
    borderRadius: 24,
    marginHorizontal: 14,
    marginBottom: 18,
    marginTop: 2,
    paddingVertical: 18,
    paddingHorizontal: 0,
    height: 80,
  },
  infoItemNew: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  infoDividerNew: {
    width: 1,
    backgroundColor: '#2d2d3a',
    marginVertical: 8,
    borderRadius: 1,
  },
  infoLabelNew: {
    color: '#b3b3cc',
    fontSize: 9,
    fontWeight: '400',
    marginTop: 2,
    fontFamily: 'Nunito Sans',
  },
  infoValueNew: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
    fontFamily: 'Nunito Sans',
  },
  sectionTitleNew: {
    color: '#C6C5ED',
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
    fontFamily: 'Nunito Sans',
  },
  checkboxRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    gap: 32,
  },
  checkboxOutlinedNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: 18,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 0,
  },
  checkboxBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#864FF4',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxBoxChecked: {
    backgroundColor: '#864FF4',
    borderColor: '#864FF4',
  },
  checkboxTextOutlinedNew: {
    color: '#C6C5ED',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
    marginLeft: 0,
  },
  aboutTextNew: {
    color: '#b3b3cc',
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 40,
    fontWeight: '400',
    lineHeight: 20,
    fontFamily: 'Nunito Sans',
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

export default ExploreEventScreen;