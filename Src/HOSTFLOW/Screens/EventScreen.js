import React, { useState, useEffect, useCallback } from 'react'; // Explicitly import useState and useEffect
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeleteIcon from '../assets/icons/delete';
import Calender from '../assets/icons/Calender';
import RingIcon from '../assets/icons/ring';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

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
    large: Math.max(width * 0.07, 28),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.06, 25),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.min(width * 0.55, height * 0.3),
  cardPadding: Math.max(width * 0.04, 16),
  headerHeight: Math.max(height * 0.1, 80),
};

const EventScreen = ({ navigation }) => {
  console.log('EventScreen component loaded');
  const isDark = useColorScheme() === 'dark';
  const [events, setEvents] = useState([]);
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);

  const textColor = '#fff';
  const subText = '#aaa';

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.1.52:3000/api/host/events/get-all-events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        const apiEvents = response.data.data.map(event => {
          const firstDate = event.eventDateTime?.[0] ? new Date(event.eventDateTime[0]) : new Date();
          const nearestStatus = event.showStatus?.length > 0 
            ? event.showStatus.reduce((nearest, current) => {
                const currentDate = new Date(current.date);
                const nearestDate = new Date(nearest.date);
                return currentDate > new Date() && currentDate < nearestDate ? current : nearest;
              }, event.showStatus[0])
            : { date: new Date().toISOString().split('T')[0], status: 'upcoming' };

          return {
            id: event._id || '',
            title: event.eventName || 'Untitled Event',
            location: event.venue || 'Unknown Location',
            date: { 
              month: firstDate.toLocaleString('en-US', { month: 'short' }),
              day: firstDate.getDate().toString().padStart(2, '0'), // Ensure two digits
            },
            tags: event.genre || [],
            description: event.about || 'Join us for an unforgettable evening filled with live music! Feel the beat and excitement!',
            image: { uri: event.posterUrl || 'https://via.placeholder.com/150' },
            status: nearestStatus.status || 'upcoming',
          };
        });
        console.log('Mapped Events:', apiEvents);
        setEvents(apiEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch events. Check network or API URL.');
    }
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const addEvent = () => {
    navigation.navigate('NewEvent');
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`http://192.168.1.52:3000/api/host/events/delete-event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        Alert.alert('Success', 'Event deleted successfully');
        fetchEvents();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete event.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event</Text>
        <TouchableOpacity style={styles.headerIconButton}>
          <Calender width={32} height={32} />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['rgba(252,252,253,0.04)', 'rgba(252,252,253,0.03)']}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 0.98, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingTop: 84,
              paddingBottom: Math.max(insets.bottom + 120, 140),
              paddingHorizontal: dimensions.spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event) => (
            <View key={event.id} style={styles.outerCardContainer}>
              <View style={styles.card}>
                <View style={styles.imageWrapper}>
                  <Image source={event.image} style={styles.cardImage} resizeMode="cover" />
                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{event.date.month}</Text>
                    <Text style={styles.dateDay}>{event.date.day}</Text>
                  </View>
                  <View style={styles.statusTag}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.location}>{event.location}</Text>
                  <View style={styles.tags}>
                    {event.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.description}>{event.description}</Text>
                  <View style={styles.actionRow}>
                    <View style={{ flex: 1 }}>
                      <LinearGradient
                        colors={['#B15CDE', '#7952FC']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.exploreButton}
                      >
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Explore', { eventId: event.id })}
                          style={{ width: '100%' }}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.exploreText}>Explore</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <Feather name="trash-2" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <TouchableOpacity
        style={[
          styles.floatingPlus,
          {
            bottom: Math.max(insets.bottom + 80, 100),
            right: dimensions.spacing.xxl,
          },
        ]}
        onPress={addEvent}
        activeOpacity={0.8}
      >
        <RingIcon style={styles.floatingPlusRing} width={54} height={54} />
        <View style={styles.floatingPlusInnerCircle}>
          <Feather name="plus" size={32} color="#fff" style={styles.floatingPlusIcon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: 0.5,
    flex: 1,
    marginTop: 10,
  },
  headerIconButton: {
    borderWidth: 1,
    borderColor: '#a095c4',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    backgroundColor: '#111',
    minWidth: Math.max(width * 0.1, 40),
    minHeight: Math.max(width * 0.1, 40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#181828',
    borderWidth: 1,
    borderColor: 'rgba(252,252,253,0.10)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  imageWrapper: {
    position: 'relative',
    backgroundColor: '#222',
  },
  cardImage: {
    width: '100%',
    height: dimensions.imageHeight,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dateBox: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#23233B',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  dateDay: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  statusTag: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#A95EFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  cardContent: {
    padding: 20,
  },
  location: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#23233B',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
    color: '#bbb',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  exploreButton: {
    width: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  exploreText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  deleteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#a95eff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  floatingPlus: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 27,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  floatingPlusRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  floatingPlusIcon: {
    zIndex: 1,
  },
  floatingPlusInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B15CDE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outerCardContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    marginBottom: dimensions.spacing.xxl,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});

export default EventScreen;