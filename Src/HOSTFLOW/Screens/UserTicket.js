import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal as RNModal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticFeedback from 'react-native-haptic-feedback';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { width: screenWidth } = Dimensions.get('window');

const hapticOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const triggerHaptic = (type) => {
  try {
    HapticFeedback.trigger(type, hapticOptions);
  } catch (error) {
    console.log('Haptic feedback error:', error.message);
  }
};

const UserTicketScreen = ({ navigation }) => {
  console.log('UserTicketScreen: Component mounted');
  const [activeTab, setActiveTab] = useState('active');
  const [activeTickets, setActiveTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });
  const insets = useSafeAreaInsets();

  const baseUrl = 'https://api.thescenezone.com/api';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    console.log('UserTicketScreen: useEffect triggered');
    const fetchTickets = async () => {
      if (!token) {
      //  console.log('UserTicketScreen: No auth token found');
       // setCustomAlert({ visible: true, title: 'Error', message: 'Please log in to view tickets' });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('UserTicketScreen: Fetching tickets from:', `${baseUrl}/eventhost/tickets/user-tickets`);
        const response = await axios.get(`${baseUrl}/eventhost/tickets/user-tickets`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });

        console.log('UserTicketScreen: API response:', JSON.stringify(response.data, null, 2));
        const { tickets } = response.data.data || { tickets: [] };

        const currentDate = new Date();

        const active = tickets.filter(
          (ticket) =>
            ticket &&
            ticket.status === 'paid' &&
            ticket.selectedEventDate &&
            new Date(ticket.selectedEventDate) >= currentDate
        );
        const past = tickets.filter(
          (ticket) =>
            ticket &&
            (ticket.status === 'cancelled' ||
              (ticket.selectedEventDate && new Date(ticket.selectedEventDate) < currentDate))
        );

        setActiveTickets(
          active.map((ticket) => {
            const eventDate = ticket.selectedEventDate
              ? new Date(ticket.selectedEventDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).replace(' ', '\n')
              : 'N/A';
            console.log(`UserTicketScreen: Processing active ticket: ${ticket.ticketId}, date: ${eventDate}`);
            return {
              id: ticket._id || `temp-${Math.random()}`,
              image: ticket.eventId?.posterUrl
                ? { uri: ticket.eventId.posterUrl }
                : require('../assets/Images/fff.jpg'),
              date: eventDate,
              title: ticket.eventId?.eventName || 'Unknown Event',
              ticketId: ticket.ticketId || 'N/A',
              rawTicket: ticket, // Store raw ticket data for navigation
            };
          })
        );

        setPastTickets(
          past.map((ticket) => {
            const eventDate = ticket.selectedEventDate
              ? new Date(ticket.selectedEventDate).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).replace(' ', '\n')
              : 'N/A';
            console.log(`UserTicketScreen: Processing past ticket: ${ticket.ticketId}, date: ${eventDate}`);
            return {
              id: ticket._id || `temp-${Math.random()}`,
              image: ticket.eventId?.posterUrl
                ? { uri: ticket.eventId.posterUrl }
                : require('../assets/Images/Cover.png'),
              date: eventDate,
              title: ticket.eventId?.eventName || 'Unknown Event',
              ticketId: ticket.ticketId || 'N/A',
              rawTicket: ticket, // Store raw ticket data for navigation
            };
          })
        );
      } catch (error) {
        console.error('UserTicketScreen: Error fetching tickets:', error.message);
        setCustomAlert({ visible: true, title: 'Error', message: 'Failed to fetch tickets' });
      } finally {
        setLoading(false);
        console.log('UserTicketScreen: Loading set to false');
      }
    };

    fetchTickets();
  }, [token]);

  useEffect(() => {
    console.log('UserTicketScreen: activeTab changed:', activeTab);
  }, [activeTab]);

  useEffect(() => {
    console.log('UserTicketScreen: activeTickets updated:', activeTickets);
  }, [activeTickets]);

  useEffect(() => {
    console.log('UserTicketScreen: pastTickets updated:', pastTickets);
  }, [pastTickets]);

  useEffect(() => {
    console.log('UserTicketScreen: loading state changed:', loading);
  }, [loading]);

  useEffect(() => {
    console.log('UserTicketScreen: customAlert state changed:', customAlert);
  }, [customAlert]);

  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={styles.shortlistModalOverlay}>
        <View style={styles.shortlistModalContent}>
          <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : customAlert.title === 'Already Shortlisted' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
          <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
          <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
          <TouchableOpacity
            style={styles.shortlistModalButton}
            onPress={() => setCustomAlert({ ...customAlert, visible: false })}
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              style={styles.shortlistModalButtonGradient}
            >
              <Text style={styles.shortlistModalButtonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      <View style={styles.backgroundSvgContainer} pointerEvents="none">
        <SignUpBackground style={styles.backgroundSvg} width={screenWidth} height="100%" />
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => { console.log('UserTicketScreen: Back button pressed'); navigation.goBack(); }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Ticket</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.ticketTypeButtonsContainer}>
        <TouchableOpacity
          style={[styles.ticketTypeButton, { marginRight: 12 }]}
          onPress={() => {
            triggerHaptic('impactLight');
            setActiveTab('active');
            console.log('UserTicketScreen: Switched to active tab');
          }}
        >
          {activeTab === 'active' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.ticketTypeButtonActiveBg}
            >
              <Text style={styles.ticketTypeButtonTextActive}>Active Ticket</Text>
            </LinearGradient>
          ) : (
            <View style={styles.ticketTypeButtonInactiveBg}>
              <Text style={styles.ticketTypeButtonTextInactive}>Active Ticket</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ticketTypeButton}
          onPress={() => {
            triggerHaptic('impactLight');
            setActiveTab('past');
            console.log('UserTicketScreen: Switched to past tab');
          }}
        >
          {activeTab === 'past' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={styles.ticketTypeButtonActiveBg}
            >
              <Text style={styles.ticketTypeButtonTextActive}>Past Ticket</Text>
            </LinearGradient>
          ) : (
            <View style={styles.ticketTypeButtonInactiveBg}>
              <Text style={styles.ticketTypeButtonTextInactive}>Past Ticket</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B15CDE" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingBottom: Math.max(insets.bottom + 110, 130) }
          ]}
        >
          {(activeTab === 'active' ? activeTickets : pastTickets).length > 0 ? (
            (activeTab === 'active' ? activeTickets : pastTickets).map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  console.log('UserTicketScreen: Navigating to UserTicketDownload with ticket:', JSON.stringify(ticket.rawTicket, null, 2));
                  navigation.navigate('UserTicketDownload', { ticket: ticket.rawTicket });
                }}
                activeOpacity={0.85}
              >
                <Image
                  source={ticket.image}
                  style={styles.ticketImage}
                  resizeMode="cover"
                  onError={() => console.log(`UserTicketScreen: Failed to load image for ticket: ${ticket.ticketId}`)}
                />
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{ticket.date || 'N/A'}</Text>
                </View>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketTitle}>{ticket.title || 'Unknown Event'}</Text>
                  <Text style={styles.ticketIdText}>Ticket ID: {ticket.ticketId || 'N/A'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.ticketArrowButton}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    console.log('UserTicketScreen: Chevron pressed for ticket:', ticket.ticketId);
                    navigation.navigate('UserTicketDownload', { ticket: ticket.rawTicket });
                  }}
                >
                  <MaterialIcons name="chevron-right" size={24} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTicketsText}>
              No {activeTab === 'active' ? 'active' : 'past'} tickets available
            </Text>
          )}
        </ScrollView>
      )}
      <CustomAlertModal />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'left',
    marginLeft: 20,
  },
  ticketTypeButtonsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'visible',
    borderWidth: 0,
    padding: 0,
  },
  ticketTypeButton: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    alignSelf: 'stretch',
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  ticketTypeButtonActiveBg: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 16,
    shadowColor: '#B15CDE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ticketTypeButtonInactiveBg: {
    flex: 1,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1A1A1F',
    borderRadius: 16,
  },
  ticketTypeButtonTextActive: {
    color: '#18151f',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 21,
    textAlign: 'center',
  },
  ticketTypeButtonTextInactive: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'normal',
    lineHeight: 21,
    textAlign: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  ticketCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
    width: Math.min(screenWidth * 0.9, 400),
    alignSelf: 'center',
  },
  ticketImage: {
    width: '100%',
    height: Math.max(screenWidth * 0.4, 120),
    resizeMode: 'cover',
  },
  dateContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heartIconPlaceholder: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  ticketInfo: {
    padding: 10,
  },
  ticketTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 4,
  },
  ticketIdText: {
    fontSize: 12,
    color: '#aaa',
  },
  ticketArrowButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 5,
    borderRadius: 15,
    zIndex: 1,
  },
  backgroundSvgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTicketsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  shortlistModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  shortlistModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  shortlistModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  shortlistModalMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  shortlistModalButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistModalButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Nunito Sans',
  },
});

export default UserTicketScreen;