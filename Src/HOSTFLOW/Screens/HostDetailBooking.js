import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Modal as RNModal,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
  imageHeight: Math.min(height * 0.25, 200),
  cardMargin: Math.max(width * 0.04, 16),
};

const HostDetailBookingContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const artist = route.params?.artist;
  const eventId = route.params?.eventId;
  const artistId = artist?.artistId || '68641f1d26e2a247e8d12780';
  const [bookingDetails, setBookingDetails] = useState({
    subtotal: '0.00',
    platformFees: '0.00',
    tax: '0.00',
    total: '0.00',
  });
  const [loading, setLoading] = useState(true);
  const [isNegotiationAvailable, setIsNegotiationAvailable] = useState(false);
  const [customAlert, setCustomAlert] = useState({ visible: false, title: '', message: '', onPress: null });

  console.log('HostDetailBookingContent initialized', {
    timestamp: new Date().toISOString(),
    artistId,
    eventId,
    hasToken: !!token,
    artistData: artist,
  });

  useEffect(() => {
    console.log('useEffect triggered for fetching booking data', {
      timestamp: new Date().toISOString(),
      token,
      artistId,
      eventId,
    });

    const fetchBookingData = async () => {
      console.log('Starting fetchBookingData', {
        timestamp: new Date().toISOString(),
        artistId,
        eventId,
      });
      setLoading(true);
      try {
        console.log('Fetching artist profile', {
          url: `https://api.thescenezone.com/api/artist/get-profile/${artistId}`,
          headers: { Authorization: `Bearer ${token}` },
        });
        const artistResponse = await axios.get(
          `https://api.thescenezone.com/api/artist/get-profile/${artistId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Artist profile API response received', artistResponse.data.data);

        console.log('Fetching invoices', {
          url: 'https://api.thescenezone.com/api/invoices',
          headers: { Authorization: `Bearer ${token}` },
        });
        const invoicesResponse = await axios.get('https://api.thescenezone.com/api/invoices', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Invoices API response received', invoicesResponse);

        if (
          artistResponse.data.success &&
          invoicesResponse.data.success &&
          invoicesResponse.data.data.length > 0
        ) {
          const artistData = artistResponse.data.data;
          const invoiceData = invoicesResponse.data.data[0];

          const subtotal = (artist?.approvedPrice || artistData.budget || 0).toFixed(2);
          const platformFees = (invoiceData.platform_fees?.amount || 0).toFixed(2);
          const tax = (invoiceData.taxes?.amount || 0).toFixed(2);
          const total = (
            parseFloat(subtotal) +
            parseFloat(platformFees) +
            parseFloat(tax)
          ).toFixed(2);

          console.log('Calculated booking details', {
            timestamp: new Date().toISOString(),
            subtotal,
            platformFees,
            tax,
            total,
          });

          setBookingDetails({
            subtotal,
            platformFees,
            tax,
            total,
          }); 
          console.log("artistttttttttttdwtttt",artistData)
          setIsNegotiationAvailable(artistData.isNegotiaitonAvailable || false);

          console.log('Updated bookingDetails state', {
            timestamp: new Date().toISOString(),
            bookingDetails: { subtotal, platformFees, tax, total },
            isNegotiationAvailable: artistData.isNegotiationAvailable,
          });
        } else {
          console.error('Failed to fetch valid data', {
            timestamp: new Date().toISOString(),
            artistSuccess: artistResponse.data.success,
            invoicesSuccess: invoicesResponse.data.success,
            invoicesLength: invoicesResponse.data.data.length,
            artistMessage: artistResponse.data.message,
            invoicesMessage: invoicesResponse.data.message,
          });
        }
      } catch (error) {
        console.error('API fetch error', {
          timestamp: new Date().toISOString(),
          error: error.response?.data?.message || error.message,
          status: error.response?.status,
          url: error.config?.url,
        });
      } finally {
        console.log('fetchBookingData completed', {
          timestamp: new Date().toISOString(),
          loading: false,
        });
        setLoading(false);
      }
    };

    if (token) {
      console.log('Token available, proceeding with fetchBookingData', {
        timestamp: new Date().toISOString(),
        token,
      });
      fetchBookingData();
    } else {
      console.warn('No token available, using default booking details', {
        timestamp: new Date().toISOString(),
      });
      setLoading(false);
    }
  }, [token, artistId]);

  console.log('Rendering HostDetailBookingContent', {
    timestamp: new Date().toISOString(),
    loading,
    bookingDetails,
    artistImage: artist?.profileImageUrl || 'default',
    isNegotiationAvailable,
    eventId,
  });

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 0),
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom + 30, 50),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(dimensions.spacing.lg, 16),
              paddingBottom: Math.max(dimensions.spacing.sm, 8),
              marginTop: Math.max(dimensions.spacing.sm, 8),
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.backButton,
              {
                minWidth: Math.max(dimensions.buttonHeight * 0.7, 44),
                minHeight: Math.max(dimensions.buttonHeight * 0.7, 44),
              },
            ]}
            onPress={() => {
              console.log('Back button pressed', {
                timestamp: new Date().toISOString(),
                navigation: 'goBack',
              });
              navigation.goBack();
            }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={Math.max(dimensions.iconSize, 24)} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Payment</Text>
          <View style={{ width: Math.max(dimensions.iconSize, 24) }} />
        </View>

        <View
          style={[
            styles.separator,
            {
              marginVertical: Math.max(dimensions.spacing.xs, 5),
            },
          ]}
        />

        {loading ? (
          <Text style={styles.loadingText}>Loading booking details...</Text>
        ) : (
          <>
            <View
              style={[
                styles.imageCard,
                {
                  marginHorizontal: dimensions.cardMargin,
                  marginTop: Math.max(dimensions.spacing.lg, 16),
                  marginBottom: Math.max(dimensions.spacing.md, 12),
                },
              ]}
            >
              <Image
                source={
                  artist?.profileImageUrl
                    ? { uri: artist.profileImageUrl }
                    : require('../assets/Images/fff.jpg')
                }
                style={[
                  styles.eventImage,
                  {
                    height: dimensions.imageHeight,
                  },
                ]}
                resizeMode="cover"
                onLoad={() =>
                  console.log('Event image loaded', {
                    timestamp: new Date().toISOString(),
                    imageUri: artist?.profileImageUrl || 'default',
                  })
                }
                onError={(e) =>
                  console.error('Event image load error', {
                    timestamp: new Date().toISOString(),
                    error: e.nativeEvent.error,
                    imageUri: artist?.profileImageUrl || 'default',
                  })
                }
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.eventTitle}>Sounds of Celebration</Text>
              </View>
            </View>

            <View
              style={[
                styles.detailsCard,
                {
                  marginHorizontal: dimensions.cardMargin,
                  marginTop: Math.max(dimensions.spacing.lg, 16),
                  marginBottom: Math.max(dimensions.spacing.md, 12),
                  padding: Math.max(dimensions.spacing.lg, 16),
                },
              ]}
            >
              <View
                style={[
                  styles.detailRow,
                  {
                    marginBottom: Math.max(dimensions.spacing.sm, 8),
                  },
                ]}
              >
                <Text style={styles.detailLabel}>Subtotal</Text>
                <Text style={styles.detailValue}>₹{bookingDetails.subtotal}</Text>
              </View>
              <View
                style={[
                  styles.detailRow,
                  {
                    marginBottom: Math.max(dimensions.spacing.sm, 8),
                  },
                ]}
              >
                <Text style={styles.detailLabel}>Platform Fees</Text>
                <Text style={styles.detailValue}>₹{bookingDetails.platformFees}</Text>
              </View>
              <View
                style={[
                  styles.detailRow,
                  {
                    marginBottom: Math.max(dimensions.spacing.sm, 8),
                  },
                ]}
              >
                <Text style={styles.detailLabel}>Tax (4%)</Text>
                <Text style={styles.detailValue}>₹{bookingDetails.tax}</Text>
              </View>
              <View
                style={[
                  styles.totalSeparator,
                  {
                    marginVertical: Math.max(dimensions.spacing.md, 10),
                  },
                ]}
              />
              <View style={styles.detailRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>₹{bookingDetails.total}</Text>
              </View>
            </View>

            {isNegotiationAvailable && (
           <TouchableOpacity
           onPress={async () => {
             console.log('Negotiation button pressed', {
               timestamp: new Date().toISOString(),
               navigation: 'NegotiationScreen',
               participantId: artist.artistId,
               participantRole: 'artist',
               eventId,
             });
         
             try {
               // Call the create-chat API
               const response = await axios.post(
                 'https://api.thescenezone.com/api/chat/create-chat',
                 {
                   eventId,
                   artistId: artist.artistId,
                 },
                 {
                   headers: {
                     Authorization: `Bearer ${token}`,
                     'Content-Type': 'application/json',
                   },
                 }
               );
         
               console.log('Chat created successfully', {
                 timestamp: new Date().toISOString(),
                 response: response.data,
               });
         
               if (response.data && response.data._id) {
                 const chatId = response.data._id;
                 // Navigate to NegotiationScreen with chatId and eventId
                 navigation.navigate('HostNegotiationAvailable', {
                   chatId,
                   eventId,
                   participantId: artist.artistId,
                   participantRole: 'artist',
                 });
               } else if (response.data && response.data.message && response.data.message.toLowerCase().includes('already exists')) {
                 setCustomAlert({
                   visible: true,
                   title: 'Negotiation Ongoing',
                   message: 'Negotiation is already going on for this event.',
                   onPress: null,
                 });
               } else {
                 console.error('Failed to create chat: Invalid response data', {
                   timestamp: new Date().toISOString(),
                   response: response.data,
                 });
                 setCustomAlert({
                   visible: true,
                   title: 'Error',
                   message: 'Failed to create chat. Please try again.',
                   onPress: null,
                 });
               }
             } catch (error) {
               console.error('Error creating chat', {
                 timestamp: new Date().toISOString(),
                 error: error.response?.data?.message || error.message,
                 status: error.response?.status,
               });
               const errMsg = error.response?.data?.message || error.message || '';
               if (typeof errMsg === 'string' && errMsg.toLowerCase().includes('already exists')) {
                 setCustomAlert({
                   visible: true,
                   title: 'Negotiation Ongoing',
                   message: 'Negotiation is already going on for this event.',
                   onPress: null,
                 });
               } else {
                 setCustomAlert({
                   visible: true,
                   title: 'Error',
                   message: 'Failed to initiate negotiation. Please try again.',
                   onPress: null,
                 });
               }
             }
           }}
           style={[
             styles.negotiationButton,
             {
               marginHorizontal: dimensions.cardMargin,
               marginTop: Math.max(dimensions.spacing.lg, 16),
               marginBottom: Math.max(dimensions.spacing.md, 12),
               padding: Math.max(dimensions.spacing.lg, 16),
               minHeight: Math.max(dimensions.buttonHeight * 0.8, 48),
             },
           ]}
           activeOpacity={0.8}
         >
           <Text style={styles.negotiationButtonText}>Negotiation Available</Text>
           <Feather
             name="chevron-right"
             size={Math.max(dimensions.iconSize * 0.8, 20)}
             color="#999"
           />
         </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => {
                console.log('Confirm Booking button pressed', {
                  timestamp: new Date().toISOString(),
                  navigation: 'HostShortBookPaymentMethod',
                  bookingDetails,
                  eventId,
                });
                navigation.navigate('HostShortBookPaymentMethod', {
                  bookingDetails,
                  eventId,
                  artistId: artist?.artistId,
                });
              }}
              style={{
                marginHorizontal: dimensions.cardMargin,
                marginTop: Math.max(dimensions.spacing.xl, 24),
                marginBottom: Math.max(dimensions.spacing.lg, 16),
              }}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.confirmButtonGradient,
                  {
                    paddingVertical: Math.max(dimensions.spacing.lg, 16),
                    minHeight: Math.max(dimensions.buttonHeight, 54),
                    backgroundColor: '#7952FC',
                  },
                ]}
              >
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      {/* Custom Alert Modal */}
      <RNModal
        visible={customAlert.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: '#1a1a1a', borderRadius: 20, padding: 28, width: '85%', maxWidth: 320, alignItems: 'center', borderWidth: 1, borderColor: '#333' }}>
            <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : customAlert.title === 'Negotiation Ongoing' ? 'alert-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#a95eff', marginBottom: 8, textAlign: 'center' }}>{customAlert.title}</Text>
            <Text style={{ fontSize: 15, color: '#fff', textAlign: 'center', lineHeight: 22, marginBottom: 24 }}>{customAlert.message}</Text>
            <TouchableOpacity
              style={{ width: '100%', borderRadius: 12, overflow: 'hidden' }}
              onPress={() => {
                if (typeof customAlert.onPress === 'function') {
                  customAlert.onPress();
                } else {
                  setCustomAlert({ ...customAlert, visible: false });
                }
              }}
            >
              <LinearGradient
                colors={["#B15CDE", "#7952FC"]}
                style={{ paddingVertical: 14, alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}
              >
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
    </View>
  );
};

const HostDetailBookingScreen = ({ navigation, route }) => {
  console.log('HostDetailBookingScreen rendered', {
    timestamp: new Date().toISOString(),
    routeParams: route.params,
  });

  return (
    <SafeAreaProvider>
      <HostDetailBookingContent navigation={navigation} route={route} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.cardMargin,
  },
  backButton: {
    padding: Math.max(dimensions.spacing.sm, 8),
    borderRadius: dimensions.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Math.max(dimensions.fontSize.header, 18),
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginHorizontal: dimensions.cardMargin,
  },
  imageCard: {
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#282828',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  eventImage: {
    width: '100%',
    backgroundColor: '#333',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Math.max(dimensions.spacing.md, 12),
    backgroundImage: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
  },
  eventTitle: {
    fontSize: Math.max(dimensions.fontSize.header, 18),
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  detailsCard: {
    borderRadius: dimensions.borderRadius.lg,
    backgroundColor: '#282828',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: Math.max(dimensions.fontSize.body, 16),
    color: '#ccc',
    fontWeight: '400',
  },
  detailValue: {
    fontSize: Math.max(dimensions.fontSize.body, 16),
    color: '#fff',
    fontWeight: '600',
  },
  totalSeparator: {
    height: 1,
    backgroundColor: '#444',
  },
  totalLabel: {
    fontSize: Math.max(dimensions.fontSize.header, 18),
    fontWeight: '700',
    color: '#fff',
  },
  totalValue: {
    fontSize: Math.max(dimensions.fontSize.header, 18),
    fontWeight: '700',
    color: '#fff',
  },
  negotiationButton: {
    backgroundColor: '#282828',
    borderRadius: dimensions.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  negotiationButtonText: {
    fontSize: Math.max(dimensions.fontSize.body, 16),
    color: '#fff',
    fontWeight: '500',
  },
  confirmButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dimensions.borderRadius.lg,
    shadowColor: '#7952FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: {
    fontSize: Math.max(dimensions.fontSize.body, 16),
    color: '#fff',
    textAlign: 'center',
    marginTop: Math.max(dimensions.spacing.xl, 20),
  },
});

export default HostDetailBookingScreen;