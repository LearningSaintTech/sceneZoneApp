import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserTicketDownload = ({ route, navigation }) => {
  const { ticket } = route.params || {};

  if (!ticket) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#18151f' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#C6C5ED" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Ticket</Text>
          <Ionicons name="information-circle-outline" size={24} color="#C6C5ED" />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No ticket data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userName = ticket.barcodeText ? ticket.barcodeText.split('|')[2] || 'Unknown User' : 'Unknown User';
  const eventDate = ticket.selectedEventDate
    ? new Date(ticket.selectedEventDate).toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18151f' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#C6C5ED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Ticket</Text>
        <Ionicons name="information-circle-outline" size={24} color="#C6C5ED" />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.ticketCard}>
          <View style={styles.eventImageCard}>
            <Image
              source={ticket.eventId?.posterUrl ? { uri: ticket.eventId.posterUrl } : require('../assets/Images/ffff.jpg')}
              style={styles.eventImage}
              resizeMode="cover"
              onError={() => console.log(`Failed to load image for ticket: ${ticket.ticketId}`)}
            />
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeMonth}>
                {ticket.selectedEventDate
                  ? new Date(ticket.selectedEventDate).toLocaleString('en-US', { month: 'short' })
                  : 'N/A'}
              </Text>
              <Text style={styles.dateBadgeDay}>
                {ticket.selectedEventDate
                  ? new Date(ticket.selectedEventDate).toLocaleString('en-US', { day: 'numeric' })
                  : 'N/A'}
              </Text>
            </View>
            <View style={styles.eventImageOverlay}>
              <Text style={styles.eventTitle}>{ticket.eventId?.eventName || 'Unknown Event'}</Text>
              <Text style={styles.ticketId}>Ticket ID: {ticket.ticketId || 'N/A'}</Text>
            </View>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Name</Text>
            <Text style={styles.detailValueName}>{userName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Location</Text>
            <Text style={styles.detailValueLocation}>{ticket.eventId?.venue || 'Unknown Venue'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Guest Type</Text>
            <Text style={styles.detailValueName}>{ticket.guestType || 'N/A'}</Text>
          </View>
          <View style={styles.detailRowTwoCol}>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Number of Tickets</Text>
              <Text style={styles.detailValueName}>x{ticket.numberOfTickets || 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Date</Text>
              <Text style={styles.detailValueName}>{eventDate}</Text>
            </View>
          </View>
          <View style={styles.barcodeContainer}>
            {ticket.barcodeImage ? (
              <Image
                source={{ uri: ticket.barcodeImage }}
                style={styles.barcodeImage}
                resizeMode="contain"
                onError={() => console.log(`Failed to load barcode for ticket: ${ticket.ticketId}`)}
              />
            ) : (
              <Text style={styles.errorText}>Barcode unavailable</Text>
            )}
          </View>
        </View>
        <View style={styles.paymentCardContainer}>
          <View style={styles.paymentCard}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Subtotal</Text>
              <Text style={styles.paymentValue}>${(ticket.subtotal || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Fees</Text>
              <Text style={styles.paymentValue}>${(ticket.fees || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Tax (4%)</Text>
              <Text style={styles.paymentValue}>${(ticket.tax || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Discount Applied</Text>
              <Text style={styles.paymentValue}>${(ticket.discountApplied || 0).toFixed(2)}</Text>
            </View>
            <View style={styles.paymentSeparator} />
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Total</Text>
              <Text style={styles.paymentValueTotal}>${(ticket.totalAmount || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.paymentMethodCard}>
          <View style={styles.paymentMethodRow}>
            <Text style={styles.paymentMethodLabel}>Payment Method</Text>
            <View style={styles.paymentMethodValue}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
              <Text style={styles.paymentMethodText}>Apple Pay</Text>
            </View>
          </View>
        </View>
        <LinearGradient
          colors={['#7952FC', '#B15CDE']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.downloadButtonCard}
        >
          <TouchableOpacity
            style={styles.downloadButtonContent}
            onPress={() => {
              console.log('Download ticket pressed for:', ticket.ticketId);
              Alert.alert('Download', 'Ticket download initiated');
            }}
          >
            <View style={styles.downloadButtonRow}>
              <View style={styles.downloadButtonInner}>
                <Ionicons name="download-outline" size={24} color="#FFFFFF" />
                <Text style={[styles.downloadButtonText, { color: '#FFFFFF' }]}>Download Ticket</Text>
              </View>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    width: 393,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 160,
  },
  ticketCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#0D0D0D',
    margin: 16,
    padding: 16,
    marginBottom: 18,
  },
  eventImageCard: {
    display: 'flex',
    height: 200,
    minWidth: 200,
    paddingTop: 8,
    paddingRight: 8,
    paddingBottom: 136,
    paddingLeft: 8,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 16,
    backgroundColor: '#121212',
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '220%',
    borderRadius: 16,
  },
  dateBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#18151f',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
  },
  dateBadgeMonth: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '400',
  },
  dateBadgeDay: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  eventImageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'flex-start',
  },
  eventTitle: {
    color: '#B2B2E7',
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  ticketId: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 0,
  },
  detailRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 8,
    width: '100%',
  },
  detailLabel: {
    overflow: 'hidden',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    textOverflow: 'ellipsis',
    marginBottom: 2,
  },
  detailValueName: {
    overflow: 'hidden',
    color: '#BB71E2',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    textOverflow: 'ellipsis',
    marginBottom: 2,
  },
  detailValueLocation: {
    overflow: 'hidden',
    color: '#BB71E2',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    textOverflow: 'ellipsis',
    textDecorationLine: 'none',
  },
  detailRowTwoCol: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  barcodeContainer: {
    width: '100%',
    height: 100, // Increased from 64 to 100
    backgroundColor: '#18151f',
    borderRadius: 8,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeImage: {
    width: '95%', // Increased from 90% to 95%
    height: '90%', // Increased from 80% to 90%
  },
  paymentCardContainer: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  paymentCard: {
    backgroundColor: '#0D0D0D',
    borderRadius: 20,
    padding: 20,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: '#34344A',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentLabel: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.8,
  },
  paymentValue: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '500',
  },
  paymentValueTotal: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: '#34344A',
    width: '100%',
    marginTop: 16,
    marginBottom: 12,
  },
  paymentMethodCard: {
    display: 'flex',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 20,
    backgroundColor: '#0D0D0D',
    borderWidth: 1,
    borderColor: '#34344A',
    marginHorizontal: 16,
    marginTop: 20,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  paymentMethodLabel: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '400',
  },
  paymentMethodValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  paymentMethodText: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadButtonCard: {
    display: 'flex',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'column',
    alignSelf: 'stretch',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 24,
  },
  downloadButtonContent: {
    width: '100%',
  },
  downloadButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  downloadButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  downloadButtonText: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserTicketDownload;