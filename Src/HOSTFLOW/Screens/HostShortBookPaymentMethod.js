import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import { useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import BackButtonIcon from '../assets/icons/backbutton';
import ArrowIcon from '../assets/icons/arrow';

const { width, height } = Dimensions.get('window');

const isTablet = width >= 768;
const isSmallPhone = width < 350;

const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 8),
    md: Math.max(width * 0.03, 12),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.06, 20),
  cardMargin: Math.max(width * 0.04, 16),
  iconContainerSize: Math.max(width * 0.12, 40),
};

const HostShortBookPaymentMethodContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const { bookingDetails, eventId, artistId } = route.params || {};
  const token = useSelector(state => state.auth.token);
  const userName = useSelector(state => state.auth.user?.name) || 'Customer Name';
  const userEmail = useSelector(state => state.auth.user?.email) || 'customer@example.com';
  const userContact = useSelector(state => state.auth.user?.contact) || '9999999999';
  const backendUrl = process.env.BACKEND_URL || 'https://api.thescenezone.com';

  // Log input parameters for debugging
  console.log('Input parameters:', {
    bookingDetails,
    eventId,
    artistId,
    token: !!token,
    userName,
    userEmail,
    userContact,
    backendUrl,
    timestamp: new Date().toISOString(),
  });

  const handleConfirmPayment = async () => {
    console.log('Confirm Payment triggered:', {
      selectedPaymentMethod,
      timestamp: new Date().toISOString(),
    });

    // Validate inputs
    if (!bookingDetails?.total || !eventId || !artistId || !token) {
      console.error('Validation failed:', {
        hasTotal: !!bookingDetails?.total,
        total: bookingDetails?.total,
        hasEventId: !!eventId,
        hasArtistId: !!artistId,
        hasToken: !!token,
        timestamp: new Date().toISOString(),
      });
      alert('Missing payment details. Please ensure all details are provided.');
      return;
    }

    const amount = parseFloat(bookingDetails.total) * 100;
    if (isNaN(amount) || amount <= 0) {
      console.error('Invalid amount:', {
        total: bookingDetails.total,
        amount,
        timestamp: new Date().toISOString(),
      });
      alert('Invalid payment amount. Please try again.');
      return;
    }

    try {
      console.log('Event ID and amount before create-order:', {
        eventId,
        amount,
        timestamp: new Date().toISOString(),
      });

      // Step 1: Create an order on the backend
      const orderResponse = await fetch(`${backendUrl}/api/bookings/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          eventId,
          artistId,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        console.error('Error creating order:', {
          status: orderResponse.status,
          statusText: orderResponse.statusText,
          response: orderData,
          timestamp: new Date().toISOString(),
        });
        alert(`Failed to create order: ${orderData.message || 'Unknown error'}`);
        return;
      }

      const { orderId } = orderData.data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.RAZORPAY_KEY_ID || 'rzp_live_BWOUs1FhlzOLO7',
        amount,
        currency: 'INR',
        name: 'Event Booking',
        description: `Booking for event ${eventId}`,
        image: 'https://your-app-logo.png',
        order_id: orderId,
        handler: (response) => {
          // Log handler for debugging, but move verify logic to .then
          console.log('Handler callback triggered:', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            timestamp: new Date().toISOString(),
          });
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userContact,
        },
        theme: {
          color: '#7952FC',
        },
      };

      console.log('Opening Razorpay checkout with options:', {
        key: options.key,
        amount: options.amount,
        order_id: options.order_id,
        timestamp: new Date().toISOString(),
      });

      // Step 3: Verify payment after successful checkout
      const data = await RazorpayCheckout.open(options);
      console.log('Razorpay payment success:', data, {
        timestamp: new Date().toISOString(),
      });

      // Verify payment
      console.log('Preparing to fetch verify-payment:', {
        url: `${backendUrl}/api/bookings/verify-payment`,
        token: !!token,
        payload: {
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature,
          eventId,
          artistId,
          invoices: bookingDetails,
        },
        timestamp: new Date().toISOString(),
      });

      if (!token) {
        console.error('Token missing during verify-payment:', {
          timestamp: new Date().toISOString(),
        });
        alert('Authentication token missing. Please log in again.');
        return;
      }

      try {
        const verifyResponse = await fetch(`${backendUrl}/api/bookings/verify-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            razorpay_order_id: data.razorpay_order_id,
            razorpay_payment_id: data.razorpay_payment_id,
            razorpay_signature: data.razorpay_signature,
            eventId,
            artistId,
            invoices: bookingDetails,
          }),
        });

        console.log('Verify payment response status:', {
          status: verifyResponse.status,
          statusText: verifyResponse.statusText,
          timestamp: new Date().toISOString(),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok) {
          console.error('Payment verification failed:', {
            status: verifyResponse.status,
            statusText: verifyResponse.statusText,
            response: verifyData,
            timestamp: new Date().toISOString(),
          });
          alert(`Payment verification failed: ${verifyData.message || 'Unknown error'}`);
          return;
        }

        if (verifyData.success) {
          console.log('Payment verified and booking created:', {
            bookingId: verifyData.data._id,
            data: verifyData.data,
            timestamp: new Date().toISOString(),
          });
          navigation.navigate('HostShortConfirmBooking', { bookingId: verifyData.data._id });
        } else {
          console.error('Payment verification failed:', {
            message: verifyData.message,
            timestamp: new Date().toISOString(),
          });
          alert(`Payment verification failed: ${verifyData.message}`);
        }
      } catch (error) {
        console.error('Error during verify-payment fetch:', {
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
        });
        alert(`Error verifying payment: ${error.message || 'Network or server error'}`);
      }
    } catch (error) {
      console.error('Error initiating payment:', {
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
      alert('Error initiating payment. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 0) }]}>
      <View style={[styles.header, { paddingTop: Math.max(dimensions.spacing.xl, 20), paddingBottom: Math.max(dimensions.spacing.md, 12), marginTop: Math.max(dimensions.spacing.sm, 8) }]}>
        <TouchableOpacity style={[styles.backButtonContainer, { minWidth: 46, minHeight: 46, padding: 2 }]} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackButtonIcon width={28} height={28} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Payment Method</Text>
        </View>
        <View style={[styles.headerSpacer, { width: Math.max(dimensions.iconSize, 24) }]} />
      </View>

      <ScrollView
        style={styles.paymentMethodsContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 120, 140) }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <TouchableOpacity
          style={[styles.paymentMethodCard, selectedPaymentMethod === 'razorpay' && styles.paymentMethodCardSelected, { marginBottom: Math.max(dimensions.spacing.md, 12) }]}
          onPress={() => setSelectedPaymentMethod('razorpay')}
          activeOpacity={0.8}
        >
          <View style={[styles.paymentMethodContent, { padding: Math.max(dimensions.spacing.lg, 15) }]}>
            <View style={[styles.paymentIconContainer, { width: 34, height: 34, borderRadius: dimensions.iconContainerSize / 2, marginRight: Math.max(dimensions.spacing.lg, 15) }]}>
            </View>
            <View style={styles.paymentDetails}>
              <View style={[styles.paymentMethodTitleContainer, { marginBottom: Math.max(dimensions.spacing.xs, 4) }]}>
                <Text style={styles.paymentMethodTitle}>Razorpay</Text>
              </View>
              <View style={[styles.paymentMethodInfoContainer, { marginBottom: Math.max(dimensions.spacing.xs, 4) }]}>
                <Text style={styles.paymentMethodInfo}>Pay via UPI, Card, Netbanking</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text>
                  <Text style={styles.paymentMethodBalanceLabel}>Total </Text>
                  <Text style={styles.paymentMethodBalanceValue}>₹{bookingDetails?.total || '0.00'}</Text>
                </Text>
              </View>
            </View>
            <View style={[styles.checkmarkContainer, { marginLeft: Math.max(dimensions.spacing.sm, 10) }]}>
              <ArrowIcon width={14} height={15} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.buttonContainer, { padding: dimensions.cardMargin, marginBottom: Math.max(insets.bottom + 20, 30) }]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.confirmButtonGradient, { borderRadius: dimensions.borderRadius.lg }]}
        >
          <TouchableOpacity
            onPress={handleConfirmPayment}
            style={[styles.confirmButton, { paddingVertical: Math.max(dimensions.spacing.lg, 15), minHeight: Math.max(dimensions.buttonHeight, 54) }]}
            activeOpacity={0.9}
          >
            <View style={styles.confirmButtonTextContainer}>
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const HostShortBookPaymentMethodScreen = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <HostShortBookPaymentMethodContent navigation={navigation} route={route} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    display: 'flex',
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    padding: Math.max(dimensions.spacing.xs, 4),
    borderRadius: dimensions.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    // Dynamic width set in component
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
    marginRight: 120,
  },
  paymentMethodsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: dimensions.cardMargin,
    paddingTop: Math.max(dimensions.spacing.lg, 16),
  },
  paymentMethodCard: {
    display: 'flex',
    height: 110,
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    minHeight: 0,
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    overflow: 'hidden',
  },
  paymentMethodCardSelected: {
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: '#1A1A1F',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
  },
  paymentIconContainer: {
    backgroundColor: '#191919',
    width: 34,
    height: 34,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  paymentDetails: {
    flex: 2,
  },
  paymentMethodTitleContainer: {
    // Margin set in component
  },
  paymentMethodTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
  },
  paymentMethodInfoContainer: {
    // Margin set in component
  },
  paymentMethodInfo: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
  },
  paymentMethodBalanceContainer: {
    // No additional styling needed
  },
  paymentMethodBalanceLabel: {
    color: '#B4B4C1',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    overflow: 'hidden',
  },
  paymentMethodBalanceValue: {
    color: '#8D6BFC',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
  },
  checkmarkContainer: {
    // Margin set in component
  },
  buttonContainer: {
    // Padding and margin set in component
  },
  confirmButtonGradient: {
    overflow: 'hidden',
    shadowColor: '#7952FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonTextContainer: {
    // No additional styling needed
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

export default HostShortBookPaymentMethodScreen;