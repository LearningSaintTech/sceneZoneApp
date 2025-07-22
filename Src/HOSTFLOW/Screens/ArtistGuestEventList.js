import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';

const ArtistGuestEventList = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistGuestEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/guest-list/artist/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setEvents(response.data.data);
        } else {
          setEvents([]);
          setError('No guest list events found.');
        }
      } catch (err) {
        setError('Failed to fetch guest list events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchArtistGuestEvents();
  }, [token]);

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigation.navigate('ArtistGuestList', { eventId: item.eventId })}
    >
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventDate}>{Array.isArray(item.eventDateTime) && item.eventDateTime.length > 0 ? new Date(item.eventDateTime[0]).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'No Date'}</Text>
      <Text style={styles.guestCount}>{item.guestList.length} Guests</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={32} color="#C6C5ED" />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>Select Event</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#B15CDE" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={item => item.eventId}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 31, 1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: 4,
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#23233a',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2d2d3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    color: '#7952FC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#b3b3cc',
  },
  guestCount: {
    fontSize: 13,
    color: '#B15CDE',
    marginTop: 4,
  },
});

export default ArtistGuestEventList; 