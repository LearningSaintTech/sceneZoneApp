import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignUpBackground from '../assets/Banners/SignUp';

const { width } = Dimensions.get('window');

const UserConfirmBookingScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { ticketBooking } = route.params || {};

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'N/A';
    return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}, ${date.toLocaleString('default', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  };

  const handleConfirm = () => {
    console.log('Booking confirmed:', ticketBooking);
    navigation.navigate('UserHome');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      {
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: Math.max(insets.bottom, 20),
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      <View style={styles.backgroundSvgContainer} pointerEvents="none">
        <SignUpBackground style={styles.backgroundSvg} width={width} height="100%" />
      </View>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBackground}
          >
            <Ionicons name="card" size={60} color="#fff" style={styles.cardIcon} />
            <View style={styles.checkmarkContainer}>
              <Ionicons name="checkmark-circle" size={30} color="#fff" />
            </View>
          </LinearGradient>
        </View>

        <Text style={styles.messageTitle}>Booked Successfully!</Text>
        <Text style={styles.messageSubtitle}>
          Please check your Booking in the Manage Event
        </Text>
        {ticketBooking && (
          <View style={styles.bookingDetails}>
            <Text style={styles.detailLabel}>Ticket ID: <Text style={styles.detailValue}>{ticketBooking.ticketId || 'N/A'}</Text></Text>
            <Text style={styles.detailLabel}>Event Date: <Text style={styles.detailValue}>{formatDateTime(ticketBooking.selectedEventDate)}</Text></Text>
            <Text style={styles.detailLabel}>Number of Tickets: <Text style={styles.detailValue}>{ticketBooking.numberOfTickets || 'N/A'}</Text></Text>
            <Text style={styles.detailLabel}>Guest Type: <Text style={styles.detailValue}>{ticketBooking.guestType || 'N/A'}</Text></Text>
            <Text style={styles.detailLabel}>Total Amount: <Text style={styles.detailValue}>₹{(ticketBooking.totalAmount || 0).toFixed(2)}</Text></Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleConfirm}
        style={{ alignSelf: 'center' }}
      >
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.confirmButtonGradient}
        >
          <View style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
  iconBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    zIndex: 1,
  },
  checkmarkContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#a95eff',
    borderRadius: 15,
    padding: 2,
    zIndex: 2,
  },
  messageTitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: 10,
  },
  messageSubtitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 20,
  },
  bookingDetails: {
    alignItems: 'center',
  },
  detailLabel: {
    color: '#aaa',
    fontSize: 14,
    fontFamily: 'Nunito Sans',
    marginBottom: 5,
  },
  detailValue: {
    color: '#fff',
    fontWeight: '700',
  },
  confirmButtonGradient: {
    borderRadius: 14,
    overflow: 'hidden',
    width: 320,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingVertical: 0,
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
});

export default UserConfirmBookingScreen;