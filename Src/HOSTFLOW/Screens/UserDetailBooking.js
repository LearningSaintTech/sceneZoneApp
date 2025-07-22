import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import HapticFeedback from 'react-native-haptic-feedback';
import api from '../Config/api';
import RazorpayCheckout from 'react-native-razorpay';

const UserDetailBookingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const { numberOfTickets, discountData, eventDetails } = route.params || {};
  console.log("eventDetails",eventDetails)
  // Calculate event type and payable amount
  console.log('eventDetails.price:', eventDetails?.price, 'ticketType:', eventDetails?.ticketSetting?.ticketType);
  const isFreeEvent =
    eventDetails?.ticketSetting?.ticketType === 'free' ||
    eventDetails?.price === 'Free' ||
    eventDetails?.price === 0 ||
    eventDetails?.price === '0' ||
    discountData?.isFreeEvent;
  let basePriceRaw = eventDetails?.ticketSetting?.price ?? (eventDetails?.price === 'Free' ? 0 : eventDetails?.price ?? 0);
  // If basePriceRaw is a string with currency, extract the number
  if (typeof basePriceRaw === 'string') {
    basePriceRaw = basePriceRaw.replace(/[^0-9.]/g, '');
  }
  const basePrice = Number(basePriceRaw) || 0;

  let guestDiscount = 0;
  if (
    eventDetails?.Discount &&
    discountData?.guestType &&
    eventDetails.Discount[discountData.guestType] != null
  ) {
    guestDiscount = Number(eventDetails.Discount[discountData.guestType]) || 0;
  }
  const price = isFreeEvent ? 0 : Math.max(basePrice - guestDiscount, 0);
  const subtotal = isFreeEvent ? 0 : Number(numberOfTickets) * price;
  console.log('basePrice:', basePrice, 'guestDiscount:', guestDiscount, 'price:', price, 'subtotal:', subtotal);
  console.log('eventDetails', eventDetails);

  const [userName, setUserName] = useState('Guest');
  const [invoiceSettings, setInvoiceSettings] = useState({ platformFees: 0, taxRate: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const hapticOptions = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };

  const triggerHaptic = (type) => {
    try {
      HapticFeedback.trigger(type, hapticOptions);
    } catch (error) {
      // Silently fail
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const userResponse = await api.get('https://api.thescenezone.com/api/user/auth/get-user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('User data fetched:', userResponse.data);
        setUserName(userResponse.data.data.user.fullName || 'Guest');

        const invoiceResponse = await api.get('https://api.thescenezone.com/api/eventhost/invoices/getInvoices', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Invoice settings fetched:', invoiceResponse.data);
        const settings = invoiceResponse.data.data[0] || { platformFees: 0, taxRate: 0 };
        setInvoiceSettings(settings);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to fetch user or invoice data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const platformFees = isFreeEvent ? 0 : invoiceSettings.platformFees;
  const taxRate = isFreeEvent ? 0 : invoiceSettings.taxRate / 100;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + platformFees + taxAmount;

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `₹${price.toFixed(2)}`;
  };

  const formatEventDate = () => {
    console.log('Raw eventDateTime:', eventDetails?.eventDateTime);
    const currentDate = new Date();

    if (!eventDetails?.eventDateTime || !Array.isArray(eventDetails.eventDateTime) || eventDetails.eventDateTime.length === 0) {
      console.log('No valid eventDateTime array, returning N/A');
      return { month: 'N/A', day: 'N/A', year: 'N/A', time: 'N/A', selectedEventDate: null };
    }

    const parsedDates = eventDetails.eventDateTime.map((dateItem) => {
      const dateStr = typeof dateItem === 'object' && dateItem.$date ? dateItem.$date : dateItem;
      const parsedDate = new Date(dateStr);
      return { parsedDate, isValid: !isNaN(parsedDate.getTime()) };
    });

    const upcomingDate = parsedDates.find(({ parsedDate, isValid }) => isValid && parsedDate >= currentDate);
    const selectedDateObj = upcomingDate || parsedDates.find(({ isValid }) => isValid);

    if (!selectedDateObj || !selectedDateObj.isValid) {
      return { month: 'N/A', day: 'N/A', year: 'N/A', time: 'N/A', selectedEventDate: null };
    }

    const selectedDate = selectedDateObj.parsedDate;
    return {
      month: selectedDate.toLocaleString('default', { month: 'short' }),
      day: selectedDate.getDate().toString(),
      year: selectedDate.getFullYear().toString(),
      time: selectedDate.toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true }),
      selectedEventDate: selectedDate.toISOString(),
    };
  };
  const { month, day, year, time, selectedEventDate } = formatEventDate();
  console.log('Formatted date:', { month, day, year, time, selectedEventDate });

  const handleConfirmBooking = async () => {
    triggerHaptic('impactMedium');
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing.');
      return;
    }
    if (!selectedEventDate) {
      Alert.alert('Error', 'Please select a valid event date.');
      return;
    }
    const guestType = discountData?.guestType || 'level1';
    if (!eventDetails.id || !numberOfTickets) {
      Alert.alert('Error', 'Missing required booking details.');
      return;
    }
    try {
      if (isFreeEvent) {
        // Scenario 1: Free, No Discount
        const bookingPayload = {
          eventId: eventDetails.id,
          numberOfTickets: Number(numberOfTickets),
          selectedEventDate,
          guestType,
        };
        console.log('Booking payload:', bookingPayload);
        const response = await api.post(
          'https://api.thescenezone.com/api/eventhost/tickets/book',
          bookingPayload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Booking API response:', response.data);
        if (response.data.success) {
          navigation.navigate('UserConfirmBookingScreen', {
            ticketBooking: response.data.data.ticketBooking,
          });
        } else {
          Alert.alert('Error', response.data.message || 'Failed to book ticket');
        }
      } else {
        // Scenario 2 & 3: Paid (with or without discount)
        const orderResponse = await api.post(
          'https://api.thescenezone.com/api/eventhost/tickets/create-order',
          {
            eventId: eventDetails.id,
            numberOfTickets: Number(numberOfTickets),
            guestType,
            selectedEventDate,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!orderResponse.data.success) {
          Alert.alert('Error', orderResponse.data.message || 'Failed to create payment order');
          return;
        }
        const { orderId, amount: orderAmount, currency } = orderResponse.data.data;
        if (!orderId) {
          Alert.alert('Error', 'No payment required for free event');
          return;
        }
        const options = {
          key: process.env.RAZORPAY_KEY_ID || 'rzp_live_BWOUs1FhlzOLO7',
          amount: orderAmount,
          currency: currency,
          name: 'Event Booking',
          description: `Ticket booking for event ${eventDetails.eventId}`,
          image: 'https://your-app-logo.png',
          order_id: orderId,
          handler: (response) => {
            console.log('Razorpay handler response:', response);
          },
          prefill: {
            name: user?.fullName || 'Guest',
            email: user?.email || 'guest@example.com',
            contact: user?.contact || '9999999999',
          },
          theme: {
            color: '#7952FC',
          },
        };
        const data = await RazorpayCheckout.open(options);
        // Verify payment and book ticket
        const response = await api.post(
          'https://api.thescenezone.com/api/eventhost/tickets/book',
          {
            eventId: eventDetails.eventId,
            numberOfTickets: Number(numberOfTickets),
            guestType,
            selectedEventDate,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_order_id: data.razorpay_order_id,
            razorpay_signature: data.razorpay_signature,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          navigation.navigate('UserConfirmBookingScreen', {
            ticketBooking: response.data.data.ticketBooking,
          });
        } else {
          Alert.alert('Error', response.data.message || 'Failed to book ticket');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to book ticket. Please try again.');
    }
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
          <Text style={styles.headerTitle}>Loading booking details...</Text>
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
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButtonContainer}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Booking Payment</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.eventImageContainer}>
          <Image
            source={eventDetails?.image || require('../assets/Images/fff.jpg')}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.dateOverlay}>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateMonth}>{month}</Text>
              <Text style={styles.dateDay}>{day}</Text>
            </View>
          </View>
        </View>

        <View style={styles.eventInfoContainer}>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventTitle}>{eventDetails?.title || 'Event Title'}</Text>
          </View>
          <View style={styles.sectionSeparator} />
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Name</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{userName}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Detail Location</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{eventDetails?.location || 'Location'}</Text>
            </View>
          </View>
          <View style={[styles.detailRow, { marginBottom: 0 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel}>Number of Tickets</Text>
              <Text style={styles.detailValue}>x{numberOfTickets || '1'}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {month === 'N/A' ? 'N/A' : `${month} ${day}, ${year}, ${time}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Subtotal</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{formatPrice(subtotal)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Platform Fees</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{formatPrice(platformFees)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Tax ({(taxRate * 100).toFixed(0)}%)</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>{formatPrice(taxAmount)}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Total</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, styles.totalAmountText]}>{formatPrice(totalAmount)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom + 16, 16) }]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButtonGradient}
        >
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <View style={styles.confirmButtonTextContainer}>
              <Text style={styles.confirmButtonText}>
                {isFreeEvent ? 'Book Now' : 'Confirm Payment'}
              </Text>
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
  backButtonContainer: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  eventImageContainer: {
    margin: 16,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  dateOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateTextContainer: {
    alignItems: 'center',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventInfoContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  eventTitleContainer: {
    marginBottom: 4,
  },
  eventTitle: {
    overflow: 'hidden',
    color: '#BB71E2',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
  },
  detailCard: {
    backgroundColor: '#181828',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabelContainer: {
    flex: 1,
  },
  detailValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  detailLabel: {
    fontSize: 15,
    color: '#aaa',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  sectionSeparator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
    marginHorizontal: 0,
  },
  totalAmountText: {
    fontSize: 16,
    color: '#a95eff',
  },
  buttonContainer: {
    padding: 16,
  },
  confirmButtonGradient: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  confirmButton: {
    paddingVertical: 15,
  },
  confirmButtonTextContainer: {
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default UserDetailBookingScreen;