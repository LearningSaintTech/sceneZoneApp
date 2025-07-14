import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import api from '../Config/api';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import VisaIcon from '../assets/icons/Visa';
 
const UserBookingPaymentScreen = ({ navigation, route }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('googlepay');
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const { bookingDetails } = route.params || {};
  console.log('Booking details:', bookingDetails);

  const handleConfirmPayment = async () => {
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing.');
      return;
    }

    if (!bookingDetails.eventId || !bookingDetails.numberOfTickets || !bookingDetails.guestType || !bookingDetails.selectedEventDate) {
      Alert.alert('Error', 'Missing required booking details.');
      return;
    }

    try {
      const response = await api.post(
        'http://10.0.2.2:3000/api/eventhost/tickets/book',
        {
          eventId: bookingDetails.eventId,
          numberOfTickets: bookingDetails.numberOfTickets,
          guestType: bookingDetails.guestType,
          selectedEventDate: bookingDetails.selectedEventDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Ticket booking response:', response.data);

      if (response.data.success) {
        navigation.navigate('UserConfirmBookingScreen', {
          ticketBooking: response.data.data.ticketBooking,
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to book ticket');
      }
    } catch (error) {
      console.error('Error booking ticket:', error);
      Alert.alert('Error', 'Failed to book ticket. Please try again.');
    }
  };

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
          <Text style={styles.headerTitle}>Payment Method</Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.paymentMethodsContainer}>
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === 'googlepay' && styles.paymentMethodCardSelected]}
          onPress={() => setSelectedPaymentMethod('googlepay')}
        >
          <LinearGradient
            colors={selectedPaymentMethod === 'googlepay' ? ['#B15CDE', '#7952FC'] : ['#1a1a1a', '#1a1a1a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.paymentMethodGradient}
          />
          <View style={styles.paymentMethodContent}>
            <View style={styles.paymentIconContainer}>
              <GoogleIcon style={styles.paymentIcon} width={32} height={32} />
            </View>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentMethodTitleContainer}>
                <Text style={styles.paymentMethodTitle}>Google Pay</Text>
              </View>
              <View style={styles.paymentMethodInfoContainer}>
                <Text style={styles.paymentMethodInfo}>f************n@gmail.com</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text style={styles.paymentMethodBalance}>Balance: $1,234.00</Text>
              </View>
            </View>
            {selectedPaymentMethod === 'googlepay' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === 'applepay' && styles.paymentMethodCardSelected]}
          onPress={() => setSelectedPaymentMethod('applepay')}
        >
          <LinearGradient
            colors={selectedPaymentMethod === 'applepay' ? ['#B15CDE', '#7952FC'] : ['#1a1a1a', '#1a1a1a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.paymentMethodGradient}
          />
          <View style={styles.paymentMethodContent}>
            <View style={styles.paymentIconContainer}>
              <AppleIcon style={styles.paymentIcon} width={32} height={32} />
            </View>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentMethodTitleContainer}>
                <Text style={styles.paymentMethodTitle}>Apple Pay</Text>
              </View>
              <View style={styles.paymentMethodInfoContainer}>
                <Text style={styles.paymentMethodInfo}>f************n@gmail.com</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text style={styles.paymentMethodBalance}>Balance: $2,766.00</Text>
              </View>
            </View>
            {selectedPaymentMethod === 'applepay' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === 'visa' && styles.paymentMethodCardSelected]}
          onPress={() => setSelectedPaymentMethod('visa')}
        >
          <LinearGradient
            colors={selectedPaymentMethod === 'visa' ? ['#B15CDE', '#7952FC'] : ['#1a1a1a', '#1a1a1a']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.paymentMethodGradient}
          />
          <View style={styles.paymentMethodContent}>
            <View style={styles.paymentIconContainer}>
              <VisaIcon style={styles.paymentIcon} width={40} height={20} />
            </View>
            <View style={styles.paymentDetails}>
              <View style={styles.paymentMethodTitleContainer}>
                <Text style={styles.paymentMethodTitle}>Visa</Text>
              </View>
              <View style={styles.paymentMethodInfoContainer}>
                <Text style={styles.paymentMethodInfo}>**** **** **** 1234</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text style={styles.paymentMethodBalance}>Balance: $1,876,766.00</Text>
              </View>
            </View>
            {selectedPaymentMethod === 'visa' && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
 
      </ScrollView>

      <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom + 16, 16) }]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButtonGradient}
        >
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
            <View style={styles.confirmButtonTextContainer}>
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
  paymentMethodsContainer: {
    flex: 1,
    padding: 16,
  },
  paymentMethodCard: {
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333',
  },
  paymentMethodCardSelected: {
    borderColor: '#a95eff',
  },
  paymentMethodGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.7,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    zIndex: 1,
  },
  paymentIconContainer: {
    marginRight: 15,
  },
  paymentIcon: {
    width: 40,
    height: 40,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethodTitleContainer: {
    marginBottom: 2,
  },
  paymentMethodTitle: {
    overflow: 'hidden',
    color: '#C6C5ED',
    textOverflow: 'ellipsis',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
  },
  paymentMethodInfoContainer: {
    marginBottom: 2,
  },
  paymentMethodInfo: {
    fontSize: 14,
    color: '#aaa',
  },
  paymentMethodBalanceContainer: {
    marginBottom: 2,
  },
  paymentMethodBalance: {
    fontSize: 14,
    color: '#a95eff',
  },
  checkmarkContainer: {
    marginLeft: 10,
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

export default UserBookingPaymentScreen;