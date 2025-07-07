import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HapticFeedback from 'react-native-haptic-feedback';

const UserDetailBookingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  
  // Haptic feedback options
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
  
  // Get booking details from navigation parameters
  const { numberOfTickets, selectedGuestType, eventDetails } = route.params || {};

  // Placeholder data for display (replace with actual calculated values)
  const subtotal = 50.00; // Example value
  const platformFees = 1.50; // Example value
  const taxRate = 0.04; // 4%
  const taxAmount = subtotal * taxRate; // Example calculation
  const totalAmount = subtotal + platformFees + taxAmount; // Example calculation

  // Placeholder ticket ID (replace with generated ID)
  const ticketId = '#8954673009';

  // Placeholder user details (replace with actual user data)
  const userName = 'Franklin Clinton';

  const handleConfirmBooking = () => {
    // Add haptic feedback
    triggerHaptic('impactMedium');
    
    // Implement booking confirmation logic here
    console.log('Confirming booking');
    // Navigate to the next screen, e.g., payment processing or confirmation
    navigation.navigate('UserBookingPaymentScreen', { bookingDetails: { numberOfTickets, selectedGuestType, eventDetails, totalAmount, ticketId } });
  };

  return (
    <SafeAreaView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    }]}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top, 20),
        }
      ]}>
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
        {/* Event Image and Date */}
        <View style={styles.eventImageContainer}>
          <Image
            source={eventDetails?.image || require('../assets/Images/fff.jpg')}
            style={styles.eventImage}
            resizeMode="cover"
          />
          {/* Date Overlay */}
          <View style={styles.dateOverlay}>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateMonth}>May</Text>
              <Text style={styles.dateDay}>20</Text>
            </View>
          </View>
        </View>

        {/* Event Title and Ticket ID */}
        <View style={styles.eventInfoContainer}>
          <View style={styles.eventTitleContainer}>
            <Text style={styles.eventTitle}>{eventDetails?.title || 'Event Title'}</Text>
          </View>
          <View style={styles.ticketIdContainer}>
            <Text style={styles.ticketId}>Ticket ID: {ticketId}</Text>
          </View>
          <View style={styles.sectionSeparator} />
        </View>

        {/* Booking Details Card */}
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
          <View style={[styles.detailRow, {marginBottom: 0}]}> 
            <View style={{flex: 1}}>
              <Text style={styles.detailLabel}>Number of Ticket</Text>
              <Text style={styles.detailValue}>x{numberOfTickets || '1'}</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>May 20, 2024</Text>
            </View>
          </View>
        </View>

        {/* Payment Breakdown Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Subtotal</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Platform Fees</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${platformFees.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Tax ({taxRate * 100}%)</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={styles.detailValue}>${taxAmount.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.separator} />
          <View style={styles.detailRow}>
            <View style={styles.detailLabelContainer}>
              <Text style={styles.detailLabel}>Total</Text>
            </View>
            <View style={styles.detailValueContainer}>
              <Text style={[styles.detailValue, styles.totalAmountText]}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Booking Button */}
      <View style={[
        styles.buttonContainer,
        {
          paddingBottom: Math.max(insets.bottom + 16, 16),
        }
      ]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButtonGradient}
        >
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <View style={styles.confirmButtonTextContainer}>
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
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
  ticketIdContainer: {
    marginBottom: 4,
  },
  ticketId: {
    fontSize: 14,
    color: '#aaa',
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