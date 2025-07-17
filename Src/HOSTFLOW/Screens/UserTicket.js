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
  const [activeTab, setActiveTab] = useState('active');
  const [activeTickets, setActiveTickets] = useState([]);
  const [pastTickets, setPastTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  const baseUrl = 'https://api.thescenezone.com';
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        console.log('No auth token found');
        Alert.alert('Error', 'Please log in to view tickets');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching tickets from:', `${baseUrl}/api/eventhost/tickets/user-tickets`);
        const response = await axios.get(`${baseUrl}/api/eventhost/tickets/user-tickets`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { page: 1, limit: 10 },
        });

        console.log('API response:', JSON.stringify(response.data, null, 2));
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
            console.log(`Processing active ticket: ${ticket.ticketId}, date: ${eventDate}`);
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
            console.log(`Processing past ticket: ${ticket.ticketId}, date: ${eventDate}`);
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
        console.error('Error fetching tickets:', error.message);
        Alert.alert('Error', 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [token]);

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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
          {(activeTab === 'active' ? activeTickets : pastTickets).length > 0 ? (
            (activeTab === 'active' ? activeTickets : pastTickets).map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => {
                  triggerHaptic('impactMedium');
                  console.log('Navigating to UserTicketDownload with ticket:', JSON.stringify(ticket.rawTicket, null, 2));
                  navigation.navigate('UserTicketDownload', { ticket: ticket.rawTicket });
                }}
                activeOpacity={0.85}
              >
                <Image
                  source={ticket.image}
                  style={styles.ticketImage}
                  resizeMode="cover"
                  onError={() => console.log(`Failed to load image for ticket: ${ticket.ticketId}`)}
                />
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{ticket.date || 'N/A'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.heartIconPlaceholder}
                  onPress={() => {
                    triggerHaptic('impactMedium');
                    console.log('Heart icon pressed for ticket:', ticket.ticketId);
                  }}
                >
                  <Ionicons name="heart-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketTitle}>{ticket.title || 'Unknown Event'}</Text>
                  <Text style={styles.ticketIdText}>Ticket ID: {ticket.ticketId || 'N/A'}</Text>
                </View>
                <TouchableOpacity style={styles.ticketArrowButton}>
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
});

export default UserTicketScreen;