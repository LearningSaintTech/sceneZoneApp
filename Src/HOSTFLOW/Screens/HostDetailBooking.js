import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const HostDetailBookingScreen = ({ navigation }) => {
  // Sample data for booking details
  const bookingDetails = {
    subtotal: '50.00',
    platformFees: '1.50',
    tax: '2.00', // Assuming 4% tax on subtotal
    total: '53.50', // subtotal + platformFees + tax
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Payment</Text>
        <View style={{ width: 24 }} />{/* Placeholder to balance header */}
      </View>

      {/* Event Image Section */}
      <View style={styles.imageCard}>
        <Image
          source={require('../assets/Images/fff.jpg')} // Replace with actual image source if available
          style={styles.eventImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <Text style={styles.eventTitle}>Sounds of Celebration</Text>
        </View>
      </View>

      {/* Payment Details Section */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Subtotal</Text>
          <Text style={styles.detailValue}>${bookingDetails.subtotal}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Platform Fees</Text>
          <Text style={styles.detailValue}>${bookingDetails.platformFees}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tax (4%)</Text>
          <Text style={styles.detailValue}>${bookingDetails.tax}</Text>
        </View>
        {/* Total Line */}
        <View style={styles.totalSeparator} />
        <View style={styles.detailRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${bookingDetails.total}</Text>
        </View>
      </View>

      {/* Re-added Negotiation Available Button */}
      <TouchableOpacity style={styles.negotiationButton} activeOpacity={1} onPress={() => navigation.navigate('HostNegotiationAvailable')}>
        <Text
          style={styles.negotiationButtonText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
        Negotiation Unavailable                                
        </Text>
      </TouchableOpacity>

      {/* Confirm Booking Button */}
      <TouchableOpacity onPress={()=>navigation.navigate('HostShortBookPaymentMethod')} style={styles.confirmButton}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.confirmButtonGradient}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    display: 'flex',
    width: 393,
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle:'normal',
    color: '#fff',
    fontFamily:'Nunito Sans',
    marginRight:85,
  },
  imageCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    gap: 26,
    alignSelf: 'stretch',
  },
  eventImage: {
    width: '100%',
    height: 150,
    marginBottom:50,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 10,
  },
  eventTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
    overflow: 'hidden',
    marginBottom:10,
    marginLeft:10,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 4,
    alignSelf: 'stretch',
    height:170,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'left',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#C6C5ED',
    textAlign: 'right',
    fontWeight: '700',
  },
  totalSeparator: {
    width: 313,
    height: 1,
    backgroundColor: '#4F4F59',
    alignSelf: 'center',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ccc',
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButton: {
    display: 'flex',
    width: 361,
    height: 52,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    overflow: 'hidden', // Clip gradient to border radius
    alignSelf: 'center',
    marginTop: 20,
  },
  confirmButtonGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
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
  negotiationButton: {
    display: 'flex',
    width: 330,
    height: 52,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginTop: 70,
    alignSelf: 'center',
  },
  negotiationButtonText: {
    fontSize: 14,
    color: '#4D4D6B',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
    textAlign: 'left',
    paddingTop:15,
    marginRight:140
  },
});

export default HostDetailBookingScreen;