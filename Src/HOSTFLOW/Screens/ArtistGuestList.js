import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';

const DISCOUNT_LEVELS = [
  { label: 'All', value: 'all' },
  { label: 'Level 1', value: 'level1' },
  { label: 'Level 2', value: 'level2' },
  { label: 'Level 3', value: 'level3' },
];
const STATUS_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const ArtistGuestListScreen = ({ navigation, route }) => {
  const eventId = route?.params?.eventId || null;
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const [guestList, setGuestList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discountFilter, setDiscountFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState({});
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveUserId, setApproveUserId] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState('level1');

  // Log initial props and state
  console.log('ArtistGuestListScreen mounted', { eventId, token });

  useEffect(() => {
    const fetchGuestList = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/guest-list/artist/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('All events API response:', response.data);
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          const event = response.data.data.find(e => e.eventId === eventId);
          if (event && Array.isArray(event.guestList)) {
            setGuestList(event.guestList);
            console.log('Guest list for event:', eventId, event.guestList);
          } else {
            setGuestList([]);
            setError('No guests found for this event.');
            console.log('No guests found for event:', eventId);
          }
        } else {
          setGuestList([]);
          setError('No events found.');
          console.log('No events found in response');
        }
      } catch (err) {
        setError('Failed to fetch guest list.');
        setGuestList([]);
        console.log('Error fetching guest list:', err.message, err.response?.data); // Log error details
      } finally {
        setLoading(false);
        console.log('Loading state set to false'); // Log loading state change
      }
    };
    if (token && eventId) {
      console.log('Triggering fetchGuestList with token and eventId'); // Log condition check
      fetchGuestList();
    } else {
      console.log('Missing token or eventId, skipping fetch', { token, eventId }); // Log missing dependencies
    }
  }, [token, eventId]);

  // Helper: get status for a guest
  const getStatus = (guest) => {
    if (guest.discountLevel === null) return 'pending';
    if (guest.discountLevel === 'rejected') return 'rejected';
    return 'approved';
  };

  // Filter guest list
  const filteredGuestList = guestList.filter(g => {
    const discountMatch = discountFilter === 'all' || g.discountLevel === discountFilter;
    const status = getStatus(g);
    const statusMatch = statusFilter === 'all' || status === statusFilter;
    return discountMatch && statusMatch;
  });
  console.log('Filtered guest list:', filteredGuestList); // Log filtered guest list

  // Approve guest (show modal to select discount level)
  const handleApprove = (userId) => {
    console.log('handleApprove called for userId:', userId); // Log approve action
    setApproveUserId(userId);
    setSelectedDiscount('level1');
    setShowApproveModal(true);
    console.log('Approve modal state:', { approveUserId: userId, selectedDiscount: 'level1', showApproveModal: true }); // Log modal state
  };

  const confirmApprove = async () => {
    if (!approveUserId) {
      console.log('No approveUserId, aborting confirmApprove'); // Log missing userId
      return;
    }
    setActionLoading(prev => ({ ...prev, [approveUserId]: true }));
    console.log('Starting approve action for userId:', approveUserId, 'with discount:', selectedDiscount); // Log approve action start
    try {
      const response = await axios.post(
        `${API_BASE_URL}/guest-list/events/${eventId}/approve`,
        { userId: approveUserId, discountLevel: selectedDiscount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Approve API response:', response.data); // Log approve API response
      // Refresh guest list
      setShowApproveModal(false);
      setApproveUserId(null);
      setSelectedDiscount('level1');
      console.log('Approve modal closed and states reset'); // Log modal close
      const refreshResponse = await axios.get(`${API_BASE_URL}/guest-list/artist/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuestList(refreshResponse.data.data.guestList || []);
      console.log('Guest list refreshed after approve:', refreshResponse.data.data.guestList); // Log refreshed guest list
    } catch (err) {
      console.log('Error approving guest:', err.message, err.response?.data); // Log error
    } finally {
      setActionLoading(prev => ({ ...prev, [approveUserId]: false }));
      console.log('Action loading reset for userId:', approveUserId); // Log loading reset
    }
  };

  // Reject guest
  const handleReject = async (userId) => {
    console.log('handleReject called for userId:', userId); // Log reject action
    setActionLoading(prev => ({ ...prev, [userId]: true }));
    try {
      const response = await axios.post(
        `${API_BASE_URL}/guest-list/events/${eventId}/reject`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Reject API response:', response.data); // Log reject API response
      const refreshResponse = await axios.get(`${API_BASE_URL}/guest-list/artist/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuestList(refreshResponse.data.data.guestList || []);
      console.log('Guest list refreshed after reject:', refreshResponse.data.data.guestList); // Log refreshed guest list
    } catch (err) {
      console.log('Error rejecting guest:', err.message, err.response?.data); // Log error
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
      console.log('Action loading reset for userId:', userId); // Log loading reset
    }
  };

  const renderGuestItem = ({ item }) => {
    const status = getStatus(item);
    console.log('Rendering guest item:', { id: item.userId || item.id, status }); // Log guest item render
    return (
      <View style={styles.guestItem}>
        <Text style={styles.guestName}>{item.fullName || item.name}</Text>
        <Text style={styles.ticketId}>User ID: {item.userId || item.id}</Text>
        <Text style={styles.discountLevel}>Discount: {item.discountLevel || 'Pending'}</Text>
        <Text style={styles.statusText}>Status: {status.charAt(0).toUpperCase() + status.slice(1)}</Text>
        {status === 'pending' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleApprove(item.userId || item.id)}
              disabled={actionLoading[item.userId || item.id]}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleReject(item.userId || item.id)}
              disabled={actionLoading[item.userId || item.id]}
            >
              <Text style={styles.rejectButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          console.log('Back button pressed'); // Log back navigation
          navigation.goBack();
        }} style={styles.backButton}>
          <Feather name="arrow-left" size={32} color="#C6C5ED" />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>Guest List</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      {/* Filters */}
      <View style={styles.filterBarWrapper}>
        <View style={styles.filterBarGroupColumn}>
          <Text style={styles.filterBarLabel}>Discount Level:</Text>
          <View style={styles.filterBarOptionsRow}>
            {DISCOUNT_LEVELS.map(level => (
              <TouchableOpacity
                key={level.value}
                style={[styles.filterBarPill, discountFilter === level.value && styles.filterBarPillSelected]}
                onPress={() => {
                  console.log('Discount filter changed to:', level.value);
                  setDiscountFilter(level.value);
                }}
              >
                <Text style={[styles.filterBarPillText, discountFilter === level.value && styles.filterBarPillTextSelected]}>{level.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.filterBarGroupColumn}>
          <Text style={styles.filterBarLabel}>Status:</Text>
          <View style={styles.filterBarOptionsRow}>
            {STATUS_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[styles.filterBarPill, statusFilter === option.value && styles.filterBarPillSelected]}
                onPress={() => {
                  console.log('Status filter changed to:', option.value);
                  setStatusFilter(option.value);
                }}
              >
                <Text style={[styles.filterBarPillText, statusFilter === option.value && styles.filterBarPillTextSelected]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      {/* Guest List */}
      {loading ? (
        <ActivityIndicator size="large" color="#B15CDE" style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : (
        <FlatList
          data={filteredGuestList}
          renderItem={renderGuestItem}
          keyExtractor={item => item.userId || item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
      {/* Approve Modal */}
      <Modal
        visible={showApproveModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          console.log('Modal closed via onRequestClose'); // Log modal close
          setShowApproveModal(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Discount Level</Text>
            {DISCOUNT_LEVELS.filter(l => l.value !== 'all').map(level => (
              <TouchableOpacity
                key={level.value}
                style={[styles.modalOption, selectedDiscount === level.value && styles.modalOptionSelected]}
                onPress={() => {
                  console.log('Modal discount selected:', level.value); // Log modal discount selection
                  setSelectedDiscount(level.value);
                }}
              >
                <Text style={[styles.modalOptionText, selectedDiscount === level.value && styles.modalOptionTextSelected]}>{level.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtonRow}>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                console.log('Confirm approve button pressed'); // Log confirm button
                confirmApprove();
              }}>
                <Text style={styles.modalButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {
                console.log('Cancel modal button pressed'); // Log cancel button
                setShowApproveModal(false);
              }}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    width: '100%',
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
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
    marginLeft: 0,
    padding: 0,
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 90,
    lineHeight: 24,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  filterCol: {
    flex: 1,
    marginRight: 8,
  },
  filterLabel: {
    color: '#B15CDE',
    fontWeight: '600',
    marginBottom: 4,
  },
  filterDropdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#232336',
    marginRight: 6,
    marginBottom: 6,
  },
  filterOptionSelected: {
    backgroundColor: '#B15CDE',
    borderColor: '#B15CDE',
  },
  filterOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  filterOptionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  guestItem: {
    backgroundColor: '#1a1a1a',
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
  guestName: {
    color: '#7952FC',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ticketId: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '400',
    color: '#b3b3cc',
  },
  discountLevel: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
    color: '#B15CDE',
  },
  statusText: {
    fontSize: 13,
    color: '#A0A0CC',
    marginTop: 2,
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#B15CDE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  rejectButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 15,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#232336',
    borderRadius: 16,
    padding: 24,
    width: 280,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#232336',
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalOptionSelected: {
    backgroundColor: '#B15CDE',
    borderColor: '#B15CDE',
  },
  modalOptionText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 15,
  },
  modalOptionTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#B15CDE',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  filterBarWrapper: {
    backgroundColor: '#18171D',
    borderBottomWidth: 1,
    borderBottomColor: '#232336',
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 4,
    zIndex: 10,
  },
  filterBarScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 16,
  },
  filterBarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  filterBarLabel: {
    color: '#B15CDE',
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  },
  filterBarOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterBarPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#232336',
    marginRight: 6,
    marginBottom: 2,
  },
  filterBarPillSelected: {
    backgroundColor: '#B15CDE',
    borderColor: '#B15CDE',
  },
  filterBarPillText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  filterBarPillTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  filterBarGroupColumn: {
    marginBottom: 8,
  },
  filterBarOptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});

export default ArtistGuestListScreen;