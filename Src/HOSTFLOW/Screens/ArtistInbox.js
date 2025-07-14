import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackHandler } from 'react-native';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import CustomToggle from '../Components/CustomToggle';
import SignUpBackground from '../assets/Banners/SignUp';
import debounce from 'lodash.debounce';

const API_BASE_URL = 'http://10.0.2.2:3000';
const { width } = Dimensions.get('window');

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

const ArtistInboxScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isNegotiationEnabled, setIsNegotiationEnabled] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const insets = useSafeAreaInsets();
  const { token } = useSelector((state) => state.auth);

  const logDebug = (message, data) => {
    console.log(`[${new Date().toISOString()}] ${message}`, JSON.stringify(data, null, 2));
  };

  // Fetch events for the artist
  const fetchEvents = async () => {
    if (!token) {
      logDebug('No authentication token found', { token });
      setError('Please log in to view events');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      logDebug('Fetching events for artist', { token });
      const response = await axios.get(`${API_BASE_URL}/api/chat/get-events`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logDebug('Events API response', { response: response.data });
      // Handle array response directly
      if (Array.isArray(response.data)) {
        setEvents(response.data);
        setFilteredEvents(response.data);
        setError(null);
      } else {
        throw new Error('Unexpected response format: Expected an array of events');
      }
    } catch (err) {
      logDebug('Error fetching events', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.status === 401
          ? 'Authentication failed. Please log in again.'
          : 'Failed to load events. Tap to retry.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  // Debounced search filtering
  const handleSearch = useCallback(
    debounce((text) => {
      const filtered = events.filter(event =>
        event.eventName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredEvents(filtered);
    }, 300),
    [events]
  );

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText, handleSearch]);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ArtistHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  // Handle event selection to fetch chat and navigate
  const handleEventPress = async (eventId) => {
    if (!isNegotiationEnabled) {
      alert('Negotiation is disabled. Enable it to view chats.');
      return;
    }

    try {
      logDebug('Fetching chat for event', { eventId });
      const response = await axios.get(`${API_BASE_URL}/api/chat/get-chats/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logDebug('Chat API response', { response: response.data });
      const chat = response.data._id;
console.log("chat",chat)
      if (!chat ) {
        logDebug('No chat found for event', { eventId });
        alert('No chat found for this event');
        return;
      }

      logDebug('Navigating to ChatScreen', { chatId: chat, eventId });
      navigation.navigate('Chat', { chatId: chat, eventId });
    } catch (err) {
      logDebug('Error fetching chat for event', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      alert(
        err.response?.status === 401
          ? 'Authentication failed. Please log in again.'
          : 'Failed to load chat for this event'
      );
    }
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item._id)}
      accessibilityLabel={`View chat for ${item.eventName}`}
      accessibilityRole="button"
    >
      <Image
        source={item.posterUrl ? { uri: item.posterUrl } : require('../assets/Images/profile.png')}
        style={styles.eventImage}
        defaultSource={require('../assets/Images/profile.png')}
      />
      <View style={styles.eventContent}>
        <Text style={styles.eventDate}>
          {new Date(item.eventDateTime instanceof Array ? item.eventDateTime[0] : item.eventDateTime).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
        <Text style={styles.eventName}>{item.eventName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SignUpBackground width="100%" height="100%" />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ArtistHome')}
            style={styles.backButton}
            accessibilityLabel="Go back to home"
            accessibilityRole="button"
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.negotiationToggleContainer}>
          <Text style={styles.negotiationToggleText}>Enable Negotiation</Text>
          <CustomToggle
            value={isNegotiationEnabled}
            onValueChange={setIsNegotiationEnabled}
            accessibilityLabel="Toggle negotiation"
            accessibilityRole="switch"
          />
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#aaa" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Events"
            placeholderTextColor="#aaa"
            value={searchText}
            onChangeText={setSearchText}
            accessibilityLabel="Search events"
            accessibilityRole="search"
          />
        </View>
        <View style={styles.searchSeparator} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <MusicBeatsLoader />
            <Text style={styles.loadingText}>Loading events...</Text>
          </View>
        ) : error ? (
          <TouchableOpacity onPress={fetchEvents} accessibilityLabel="Retry loading events" accessibilityRole="button">
            <Text style={styles.errorText}>{error}</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <Text style={styles.noMessagesText}>No events to display</Text>
            }
          />
        )}
        <ArtistBottomNavBar navigation={navigation} insets={insets} isLoading={false} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
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
    backgroundColor: '#2a2a2a',
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
  negotiationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  negotiationToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
  },
  searchContainer: {
    flexDirection: 'row',
    width: '90%',
    height: 52,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
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
    fontFamily: 'Nunito Sans',
  },
  searchSeparator: {
    width: '90%',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Nunito Sans',
  },
  errorText: {
    fontSize: 16,
    color: '#ff5555',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Nunito Sans',
  },
  noMessagesText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Nunito Sans',
  },
});

export default ArtistInboxScreen;