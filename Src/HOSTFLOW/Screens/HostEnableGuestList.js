import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';

const DISCOUNT_LEVELS = [
  { label: 'All', value: 'all' },
  { label: 'Level 1', value: 'level1' },
  { label: 'Level 2', value: 'level2' },
  { label: 'Level 3', value: 'level3' },
];

const HostEnableGuestListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [guestList, setGuestList] = useState([]);
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState(null);
  const [eventDiscount, setEventDiscount] = useState(null);
  const [discountFilter, setDiscountFilter] = useState('all');

  // Fetch events with refresh capability
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/guest-list/host/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        setEvents(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchEvents();
  }, [fetchEvents]);

  // Fetch guest list for selected event
  const handleEventPress = async (event) => {
    setSelectedEvent(event);
    setGuestLoading(true);
    setGuestError(null);
    setGuestList([]);
    setEventDiscount(null);
    setDiscountFilter('all');
    try {
      const response = await axios.get(`${API_BASE_URL}/guest-list/host/${event.eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setGuestList(response.data.guestList || []);
        setEventDiscount(response.data.discount || null);
      } else {
        setGuestError(response.data.message || 'Failed to fetch guest list');
      }
    } catch (err) {
      setGuestError(err.response?.data?.message || err.message || 'Failed to fetch guest list');
    } finally {
      setGuestLoading(false);
    }
  };

  // Back to event list
  const handleBack = () => {
    setSelectedEvent(null);
    setGuestList([]);
    setEventDiscount(null);
    setGuestError(null);
    setDiscountFilter('all');
  };

  // Filter guest list by discount level
  const filteredGuestList =
    discountFilter === 'all'
      ? guestList
      : guestList.filter(g => g.discountLevel === discountFilter);

  // Render event item (only event name, clean UI)
  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventItem}
      onPress={() => handleEventPress(item)}
      activeOpacity={0.8}
      accessibilityLabel={`Select event ${item.eventName}`}
    >
      <Text style={styles.eventName}>{item.eventName}</Text>
    </TouchableOpacity>
  );

  // Render guest item (clean UI)
  const renderGuestItem = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={styles.guestName}>{item.fullName}</Text>
      <Text style={styles.ticketId}>User ID: {item.userId}</Text>
      <Text style={styles.discountLevel}>Discount: {item.discountLevel || 'Pending'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => selectedEvent ? handleBack() : navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={28} color="#C6C5ED" />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>
            {selectedEvent ? 'Guest List' : 'Your Events'}
          </Text>
        </View>
        <View style={{ width: 28 }} />
      </View>
      {/* Separator line below header */}
      <View style={{ height: 1, backgroundColor: '#34344A', width: '100%' }} />
      {/* Main Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#7B4FFF" />
          <Text style={styles.loaderText}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={24} color="#FF4D4D" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvents}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : selectedEvent ? (
        guestLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#7B4FFF" />
            <Text style={styles.loaderText}>Loading guest list...</Text>
          </View>
        ) : guestError ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={24} color="#FF4D4D" />
            <Text style={styles.errorText}>{guestError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleEventPress(selectedEvent)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.selectedEventTitle}>{selectedEvent.eventName}</Text>
            {eventDiscount && (
              <View style={styles.discountBox}>
                <Text style={styles.discountTitle}>Discount Levels:</Text>
                <Text style={styles.discountText}>Level 1: {eventDiscount.level1}%</Text>
                <Text style={styles.discountText}>Level 2: {eventDiscount.level2}%</Text>
                <Text style={styles.discountText}>Level 3: {eventDiscount.level3}%</Text>
              </View>
            )}
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Filter by Discount:</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={discountFilter}
                  onValueChange={setDiscountFilter}
                  style={styles.picker}
                  dropdownIconColor="#7B4FFF"
                  mode="dropdown"
                  accessibilityLabel="Filter discount level"
                >
                  {DISCOUNT_LEVELS.map(level => (
                    <Picker.Item
                      key={level.value}
                      label={level.label}
                      value={level.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            <FlatList
              data={filteredGuestList}
              renderItem={renderGuestItem}
              keyExtractor={(item) => item.userId}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => handleEventPress(selectedEvent)}
                  colors={['#7B4FFF']}
                  tintColor="#7B4FFF"
                />
              }
              ListEmptyComponent={
                <Text style={styles.emptyText}>No guests found for this event.</Text>
              }
            />
          </>
        )
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.eventId}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#7B4FFF']}
              tintColor="#7B4FFF"
            />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No events available.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1F',
  },
  header: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loaderText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#7B4FFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    marginTop: 16, // Add space below the separator line
  },
  eventItem: {
    backgroundColor: '#2A2A3A',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(123, 79, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    color: '#7B4FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  selectedEventTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 16,
    letterSpacing: 0.3,
  },
  guestItem: {
    backgroundColor: '#2A2A3A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(123, 79, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  guestName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ticketId: {
    fontSize: 14,
    color: '#A0A0CC',
    marginBottom: 4,
  },
  discountLevel: {
    fontSize: 14,
    color: '#7B4FFF',
    fontWeight: '500',
  },
  discountBox: {
    backgroundColor: '#2A2A3A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(123, 79, 255, 0.2)',
  },
  discountTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
  },
  discountText: {
    color: '#7B4FFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dropdownLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 12,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(123, 79, 255, 0.3)',
    borderRadius: 8,
    backgroundColor: '#232336', // Ensure a dark background
    overflow: 'hidden',
    minHeight: 44, // Ensures the picker is visible
    justifyContent: 'center',
  },
  picker: {
    color: '#FFFFFF', // Text color for picker
    width: '100%',
    minHeight: 44, // Ensures the picker is visible
    fontSize: 15,
  },
  emptyText: {
    color: '#A0A0CC',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
});

export default HostEnableGuestListScreen;