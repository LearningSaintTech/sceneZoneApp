import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import api from '../Config/api';
import TicketIcon from '../assets/icons/Ticket';

const { width } = Dimensions.get('window');

const UserFormBookingScreen = ({ navigation, route }) => {
  const [numberOfTickets, setNumberOfTickets] = useState('1');
  const [discountData, setDiscountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);

  // Get event details from navigation parameters
  const { eventDetails } = route.params || {};
  const eventId = eventDetails?.eventId;
  const isFreeEvent = eventDetails?.ticketSetting?.ticketType === 'free';
console.log("eventDetails",eventDetails)
  // Fetch discount data
  useEffect(() => {
    const fetchDiscountData = async () => {
      if (!eventId || !token) {
        Alert.alert('Error', 'Event ID or authentication token is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`http://10.0.2.2:3000/api/guest-list/events/${eventId}/discount`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Discount data fetched:', response.data);
        setDiscountData(response.data);
      } catch (err) {
        console.error('Error fetching discount data:', err);
        Alert.alert(
          'Error',
          err.response?.data?.message || 'Failed to fetch discount information.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscountData();
  }, [eventId, token]);

  const handleContinueBooking = () => {
    if (!discountData) {
      Alert.alert('Error', 'Discount information not available.');
      return;
    }
    if (!isFreeEvent) {
      const tickets = parseInt(numberOfTickets, 10);
      if (!numberOfTickets || isNaN(tickets) || tickets < 1) {
        Alert.alert('Error', 'Please enter at least 1 ticket.');
        return;
      }
      if (eventDetails?.ticketSetting?.totalQuantity && tickets > eventDetails.ticketSetting.totalQuantity) {
        Alert.alert('Error', `Only ${eventDetails.ticketSetting.totalQuantity} tickets available.`);
        return;
      }
      console.log('Continue booking with:', tickets, discountData);
      navigation.navigate('UserDetailBookingScreen', {
        numberOfTickets: tickets,
        discountData,
        eventDetails,
      });
    } else {   
      console.log('Continue booking for free event:', discountData);
      navigation.navigate('UserDetailBookingScreen', {
        numberOfTickets: 1, // Default to 1 for free events
        discountData,
        eventDetails,
      });
    }
  };

  // Format price display
  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, {
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Loading discount information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Booking Ticket</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Event Details Card */}
        <View style={styles.eventCard}>
          <Image
            source={eventDetails?.image || require('../assets/Images/ffff.jpg')}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.eventInfo}>
            <View style={styles.eventTitleContainer}>
              <Text style={styles.eventTitle}>{eventDetails?.title || 'Event Name'}</Text>
            </View>
            <View style={styles.eventPriceContainer}>
              <Text style={styles.eventPriceRange}>
                {isFreeEvent ? 'Free' : eventDetails?.price || formatPrice(eventDetails?.ticketSetting?.price || 0)}
              </Text>
            </View>
            <View style={styles.eventLocationContainer}>
              <Text style={styles.eventLocation}>{eventDetails?.location || 'N/A'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />

        {/* Number of Tickets (Hidden for Free Events) */}
        {!isFreeEvent && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Number of tickets</Text>
            </View>
            <View style={styles.ticketInputContainer}>
              <View style={styles.ticketIconContainer}>
                <Icon name="book" size={20} color="#fff" />
              </View>
              <TextInput
                style={styles.ticketInput}
                keyboardType="number-pad"
                value={numberOfTickets}
                onChangeText={(text) => {
                  // Allow empty string or positive integers up to max
                  if (/^\d*$/.test(text) && (text === '' || parseInt(text, 10) <= (eventDetails?.ticketSetting?.totalQuantity || 100))) {
                    setNumberOfTickets(text);
                  }
                }}
                placeholder="1"
                placeholderTextColor="#888"
              />
            </View>
          </View>
        )}

        {/* Guest Type */}
        {discountData && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Guest Type</Text>
            </View>
            <TouchableOpacity
              style={[styles.guestTypeCard]}
              disabled
            >
              <LinearGradient
                colors={['#B15CDE', '#7952FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.guestTypeGradient}
              />
              <View style={styles.guestTypeContent}>
                <View style={styles.guestTypeIconContainer}>
                  <TicketIcon width={30} height={30} />
                </View>
                <View style={styles.guestTypeTextContainer}>
                  <View style={styles.guestTypeTitleContainer}>
                    <Text style={styles.guestTypeTitle}>
                      {discountData.discountLevel ? discountData.discountLevel.toUpperCase() : 'Guest'}
                    </Text>
                  </View>
                  <View style={styles.guestTypeSubtitleContainer}>
                    <Text style={styles.guestTypeSubtitle}>
                      {discountData.isFreeEvent
                        ? 'Free Event'
                        : `${discountData.discountValue}% Discount, ${formatPrice(discountData.discountedPrice)}`}
                    </Text>
                  </View>
                  <View style={styles.guestTypeStatusContainer}>
                    <Text style={styles.guestTypeStatus}>Accepted</Text>
                  </View>
                </View>
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom + 16, 16) }]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.continueButtonGradient}
        >
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueBooking}>
            <View style={styles.continueButtonTextContainer}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderRadius: 10,
    margin: 16,
    overflow: 'hidden',
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  eventTitleContainer: {
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventPriceContainer: {
    marginBottom: 4,
  },
  eventPriceRange: {
    fontSize: 14,
    color: '#a95eff',
  },
  eventLocationContainer: {
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#aaa',
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitleContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ticketInputContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
  },
  ticketIconContainer: {
    marginRight: 10,
  },
  ticketInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
  },
  guestTypeCard: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#a95eff',
  },
  guestTypeGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  guestTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    zIndex: 1,
  },
  guestTypeIconContainer: {
    marginRight: 15,
  },
  guestTypeTextContainer: {
    flex: 1,
  },
  guestTypeTitleContainer: {
    marginBottom: 2,
  },
  guestTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  guestTypeSubtitleContainer: {
    marginBottom: 2,
  },
  guestTypeSubtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  guestTypeStatusContainer: {
    marginBottom: 2,
  },
  guestTypeStatus: {
    fontSize: 14,
    color: '#a95eff',
  },
  checkmarkContainer: {
    marginLeft: 10,
  },
  buttonContainer: {
    padding: 16,
  },
  continueButtonGradient: {
    margin: 16,
    borderRadius: 14,
    overflow: 'hidden',
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  continueButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingVertical: 0,
  },
  continueButtonTextContainer: {
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
  scrollView: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#222',
    marginHorizontal: 16,
    marginBottom: 16,
  },
});

export default UserFormBookingScreen;