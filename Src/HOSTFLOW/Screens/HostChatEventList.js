import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image, Animated, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSelector } from 'react-redux';
import { ErrorBoundary } from 'react-error-boundary';

// Animated loader component
const MusicBeatsLoader = () => {
  const barAnims = [
    React.useRef(new Animated.Value(1)).current,
    React.useRef(new Animated.Value(1)).current,
    React.useRef(new Animated.Value(1)).current,
  ];

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
          }),
        ])
      )
    );
    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [barAnims]);

  return (
    <View style={styles.loaderContainer}>
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

// Error boundary fallback
const ErrorFallback = ({ error }) => {
  console.error('ErrorBoundary caught:', error.message, error.stack);
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>Error: {error.message}</Text>
    </View>
  );
};

const HostChatEventList = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const BASE_URL = 'http://192.168.1.52:3000';

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Token:', token);
      if (!token) {
        setError('No authentication token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/chat/get-events`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
          const errorMessage = typeof data.message === 'string' ? data.message : `HTTP error! Status: ${response.status}`;
          throw new Error(errorMessage);
        }

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: Expected an array of events');
        }

        const validEvents = data
          .filter(event => 
            event && 
            typeof event === 'object' && 
            event._id && 
            typeof event.eventName === 'string' && 
            Array.isArray(event.eventDateTime) && 
            event.eventDateTime.length > 0
          )
          .map(event => ({
            _id: event._id,
            eventName: event.eventName,
            eventDateTime: event.eventDateTime,
            posterUrl: event.posterUrl || null,
            venue: event.venue || 'N/A',
            status: event.status || 'pending',
          }));

        if (validEvents.length === 0 && data.length > 0) {
          console.warn('No valid events found in response');
        }

        console.log('Valid Events:', JSON.stringify(validEvents, null, 2));
        setEvents(validEvents);
        setFilteredEvents(validEvents);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err.message);
        setError(typeof err.message === 'string' ? err.message : 'Failed to fetch events');
        setLoading(false);
      }
    };

    // Uncomment for static data testing
    /*
    const staticEvents = [
      {
        _id: '6867c7a54673f1d9a6bf4ef6',
        eventName: 'Event1',
        eventDateTime: ['2025-07-31T12:22:00.000Z'],
        posterUrl: null,
        venue: 'Venue1',
        status: 'pending',
      },
    ];
    setEvents(staticEvents);
    setFilteredEvents(staticEvents);
    setLoading(false);
    */

    fetchEvents();
  }, [token]);

  // Search filtering
  useEffect(() => {
    console.log('Filtered Events:', JSON.stringify(filteredEvents, null, 2));
    if (searchText.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event =>
        event.eventName.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchText, events]);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MainTabs');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Format date (e.g., "31 Jul 2025")
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Render event item
  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => {
        try {
          navigation.navigate('HostChatList', { eventId: item._id });
        } catch (navError) {
          console.error('Navigation Error:', navError.message);
          setError('Failed to navigate to event details');
        }
      }}
    >
      <Image
        source={item.posterUrl ? { uri: item.posterUrl } : require('../assets/Images/fff.jpg')}
        style={styles.eventImage}
        defaultSource={require('../assets/Images/fff.jpg')}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventDate}>{formatDate(item.eventDateTime[0])}</Text>
        <Text style={styles.eventName}>{item.eventName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <SignUpBackground width="100%" height="100%" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('MainTabs')}
            >
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Messages</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#aaa" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Events"
              placeholderTextColor="#aaa"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <View style={styles.searchSeparator} />

          {loading ? (
            <View style={styles.loadingContainer}>
              <MusicBeatsLoader />
              <Text style={styles.loadingText}>Loading events...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : filteredEvents.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {searchText ? 'No events match your search' : 'No events found'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredEvents}
              renderItem={renderEventItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.listContent}
            />
          )}

         </View>
      </ErrorBoundary>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
    flex: 1,
    textAlign: 'left',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    height: 52,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#24242D',
    backgroundColor: '#121212',
    marginHorizontal: 16,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
  },
  searchSeparator: {
    width: 361,
    height: 1,
    backgroundColor: '#24242D',
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 20,
    marginBottom: 20,
    padding: 0,
    borderWidth: 0,
    minHeight: 90,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    margin: 12,
    backgroundColor: '#333',
  },
  eventContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingLeft: 0,
  },
  eventDate: {
    color: '#A084E8',
    fontSize: 12,
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    marginBottom: 2,
  },
  eventName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 28,
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HostChatEventList;