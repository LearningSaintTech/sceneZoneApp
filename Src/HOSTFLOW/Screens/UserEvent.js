import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const UserEvent = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [eventDetails, setEventDetails] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const route = useRoute();
  const { eventId } = route.params || {};
  console.log('UserEvent received eventId:', eventId);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !token) {
        console.error('Missing eventId or token');
        Alert.alert('Error', 'Unable to fetch event details. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.get(`/host/events/get-event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Fetched Event by ID:', response.data);
        setEventDetails(response.data.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        Alert.alert(
          'Error',
          err.response?.data?.message || 'Failed to fetch event details. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId && token) {
      fetchEventDetails();
    } else {
      setIsLoading(false);
    }
  }, [eventId, token]);

  const handleGuestListRequest = async () => {
    if (!eventId || !token) {
      Alert.alert('Error', 'Event ID or authentication token is missing.');
      return;
    }

    try {
      const response = await api.post(
        `http://10.0.2.2:3000/api/guest-list/apply/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Guest List Request Response:', response.data);
      Alert.alert('Success', response.data.message || 'Your guest list request has been submitted!');
    } catch (err) {
      console.error('Error submitting guest list request:', err);
      let errorMessage = 'Failed to submit guest list request. Please try again.';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = 'Guest list apply endpoint not found. Please check the server configuration.';
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      Alert.alert('Error', errorMessage);
    }
  };

  const formatEventDate = (dateTimeArray) => {
    if (!Array.isArray(dateTimeArray) || dateTimeArray.length === 0) {
      return 'N/A';
    }
    const date = new Date(dateTimeArray[0]);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatEventTime = (dateTimeArray) => {
    if (!Array.isArray(dateTimeArray) || dateTimeArray.length === 0) {
      return 'N/A';
    }
    const date = new Date(dateTimeArray[0]);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const formatBudget = (budget) => {
    if (!budget) return 'N/A';
    return `₹${budget.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#18151f', paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#18151f' }}>
          <Text style={{ color: '#C6C5ED', fontSize: 16, fontFamily: 'Nunito Sans' }}>Loading event details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#18151f',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#18151f' }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', height: 320, position: 'relative', marginBottom: 0 }}>
          {eventDetails?.posterUrl ? (
            <Image
              source={{ uri: eventDetails.posterUrl }}
              style={{ width: '100%', height: 320, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../assets/Images/ffff.jpg')}
              style={{ width: '100%', height: 320, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
              resizeMode="cover"
            />
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(24,21,31,0.8)', '#18151f']}
            locations={[0, 0.6, 1]}
            style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 200, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
          />

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              left: 20,
              width: 44,
              height: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(198,197,237,0.3)',
              backgroundColor: 'rgba(24,21,31,0.8)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#C6C5ED" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 44,
              height: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(198,197,237,0.3)',
              backgroundColor: 'rgba(24,21,31,0.8)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <Ionicons name="share-social-outline" size={20} color="#C6C5ED" />
          </TouchableOpacity>

          {eventDetails?.eventGuestEnabled && (
            <View style={{ position: 'absolute', top: 20, left: 0, right: 0, alignItems: 'center', zIndex: 9 }}>
              <TouchableOpacity
                onPress={handleGuestListRequest}
                style={{
                  borderWidth: 1,
                  borderColor: '#fff',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 24,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 160,
                }}
              >
                <Text style={{ color: '#000', fontSize: 14, fontWeight: '600', fontFamily: 'Nunito Sans' }}>
                  Apply For Guest List
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24, marginBottom: 16, paddingHorizontal: 20 }}>
          <Image
            source={
              eventDetails?.hostId?.profileImageUrl
                ? { uri: eventDetails.hostId.profileImageUrl }
                : require('../assets/Images/Avatar.png')
            }
            style={{ width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff' }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#C6C5ED', fontFamily: 'Nunito Sans' }}>
              {eventDetails?.hostId?.fullName || 'Unknown Organizer'}
            </Text>
            <Text style={{ fontSize: 12, color: '#b3b3cc', marginTop: 2, fontFamily: 'Nunito Sans' }}>
              Organizer
            </Text>
          </View>
          <View style={{ marginLeft: 'auto' }}>
            <LinearGradient
              colors={['#7952FC', '#B15CDE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 28, paddingHorizontal: 12, borderRadius: 14 }}
            >
              <Ionicons
                name="musical-notes-outline"
                size={14}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={{ color: '#fff', fontFamily: 'Nunito Sans', fontWeight: '600', fontSize: 12 }}>
                {eventDetails?.showStatus?.[0]?.status || 'Upcoming'}
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 28, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: '#7952FC', backgroundColor: 'transparent' }}>
            <Ionicons
              name="time-outline"
              size={14}
              color="#a95eff"
              style={{ marginRight: 6 }}
            />
            <Text style={{ fontFamily: 'Nunito Sans', fontSize: 10, fontWeight: '400', color: '#B15CDE', marginRight: 4 }}>
              Timing:
            </Text>
            <Text style={{ color: '#D9D8F3', fontFamily: 'Nunito Sans', fontSize: 10, fontWeight: '400' }}>
              {formatEventTime(eventDetails?.eventDateTime)}
            </Text>
          </View>
          <Text style={{ color: '#B15CDE', fontSize: 16, fontWeight: '600', fontFamily: 'Nunito Sans' }}>
            {eventDetails?.ticketSetting?.ticketType === 'free' ? 'Free' : formatBudget(eventDetails?.budget)}
          </Text>
        </View>

        <Text style={{ color: '#C6C5ED', fontFamily: 'Nunito Sans', fontSize: 18, fontWeight: '700', lineHeight: 24, paddingHorizontal: 20, marginBottom: 16 }}>
          {eventDetails?.eventName || 'Event Name'}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, marginBottom: 24 }}>
          {(eventDetails?.genre || ['Rock']).map((tag, index) => (
            <View
              key={index}
              style={{ borderWidth: 1, borderColor: '#b3b3cc', backgroundColor: 'transparent', borderRadius: 12, marginRight: 8, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 6 }}
            >
              <Text style={{ color: '#C6C5ED', fontFamily: 'Nunito Sans', fontSize: 11, fontWeight: '500' }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'stretch', backgroundColor: 'rgba(30,30,40,0.85)', borderWidth: 1, borderColor: '#7952FC', borderRadius: 24, marginHorizontal: 16, marginBottom: 24, paddingVertical: 18, paddingHorizontal: 0 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }}>
            <Ionicons name="calendar-outline" size={14} color="#a95eff" style={{ marginBottom: 2 }} />
            <Text style={{ color: '#b3b3cc', fontSize: 8, fontWeight: '400', marginTop: 4, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              Date
            </Text>
            <Text style={{ color: '#a95eff', fontSize: 14, fontWeight: '700', marginTop: 2, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              {formatEventDate(eventDetails?.eventDateTime)}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(198,197,237,0.12)', marginVertical: 8 }} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }}>
            <Ionicons name="location-outline" size={14} color="#a95eff" style={{ marginBottom: 2 }} />
            <Text style={{ color: '#b3b3cc', fontSize: 8, fontWeight: '400', marginTop: 4, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              Location
            </Text>
            <Text style={{ color: '#a95eff', fontSize: 14, fontWeight: '700', marginTop: 2, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              {eventDetails?.venue || 'N/A'}
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: 'rgba(198,197,237,0.12)', marginVertical: 8 }} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 0 }}>
            <Ionicons name="people-outline" size={18} color="#a95eff" style={{ marginBottom: 2 }} />
            <Text style={{ color: '#b3b3cc', fontSize: 8, fontWeight: '400', marginTop: 4, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              Crowd Capacity
            </Text>
            <Text style={{ color: '#a95eff', fontSize: 14, fontWeight: '700', marginTop: 2, fontFamily: 'Nunito Sans', textAlign: 'center' }}>
              {eventDetails?.ticketSetting?.totalQuantity || 'N/A'}
            </Text>
          </View>
        </View>

        <Text style={{ color: '#C6C5ED', fontSize: 16, fontWeight: '600', marginHorizontal: 20, marginBottom: 12, fontFamily: 'Nunito Sans' }}>
          Sound System Availability
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0,
              borderColor: 'transparent',
              borderRadius: 8,
              paddingHorizontal: 0,
              paddingVertical: 0,
              marginRight: 24,
              backgroundColor: 'transparent',
              ...(eventDetails?.isSoundSystem && { backgroundColor: 'transparent', borderColor: 'transparent' }),
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#a95eff',
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                ...(eventDetails?.isSoundSystem && { backgroundColor: '#a95eff' }),
              }}
            >
              {eventDetails?.isSoundSystem && <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
            </View>
            <Text
              style={{
                color: '#C6C5ED',
                fontSize: 14,
                fontWeight: '500',
                fontFamily: 'Nunito Sans',
                ...(eventDetails?.isSoundSystem && { color: '#a95eff', fontWeight: '700' }),
              }}
            >
              Yes
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 0,
              borderColor: 'transparent',
              borderRadius: 8,
              paddingHorizontal: 0,
              paddingVertical: 0,
              marginRight: 24,
              backgroundColor: 'transparent',
              ...(!eventDetails?.isSoundSystem && { backgroundColor: 'transparent', borderColor: 'transparent' }),
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: '#a95eff',
                backgroundColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
                ...(!eventDetails?.isSoundSystem && { backgroundColor: 'transparent' }),
              }}
            >
              {!eventDetails?.isSoundSystem && <Text style={{ color: 'transparent' }}></Text>}
            </View>
            <Text
              style={{
                color: '#C6C5ED',
                fontSize: 14,
                fontWeight: '500',
                fontFamily: 'Nunito Sans',
                ...(!eventDetails?.isSoundSystem && { color: '#a95eff', fontWeight: '700' }),
              }}
            >
              No
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 20, gap: 12, marginTop: 20 }}>
          <TouchableOpacity
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: '#fff',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="heart-outline" size={24} color="#a95eff" />
          </TouchableOpacity>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
          >
            <TouchableOpacity
              style={{ flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' }}
              onPress={() =>
                navigation.navigate('UserFormBookingScreen', {
                  eventDetails: {
                    title: eventDetails?.eventName || 'Event Name',
                    price: eventDetails?.ticketSetting?.ticketType === 'free' ? 'Free' : formatBudget(eventDetails?.ticketSetting?.price || 0),                    location: eventDetails?.venue || 'N/A',
                    image: eventDetails?.posterUrl ? { uri: eventDetails.posterUrl } : require('../assets/Images/ffff.jpg'),
                    eventId:eventId,
                    eventDate:eventDetails?.eventDateTime
                  },
                })
              }
            >
              <Text style={{ color: '#fff', fontFamily: 'Nunito Sans', fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                Continue
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18151f",
  },
  eventImageWrapper: {
    width: "100%",
    height: 320,
    position: "relative",
    marginBottom: 0,
  },
  eventImage: {
    width: "100%",
    height: 320,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  eventImageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  fabLeft: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(198,197,237,0.3)",
    backgroundColor: "rgba(24,21,31,0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  fabRight: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(198,197,237,0.3)",
    backgroundColor: "rgba(24,21,31,0.8)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  guestListButtonWrapper: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9,
  },
  guestListButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  },
  guestListText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito Sans",
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
  },
  organizerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
  },
  organizerSubtitle: {
    fontSize: 12,
    color: "#b3b3cc",
    marginTop: 2,
    fontFamily: "Nunito Sans",
  },
  upcomingPillContainer: {
    marginLeft: "auto",
  },
  upcomingPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  upcomingPillText: {
    color: "#fff",
    fontFamily: "Nunito Sans",
    fontWeight: "600",
    fontSize: 12,
  },
  timingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  timingPill: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#7952FC",
    backgroundColor: "transparent",
  },
  timingPillLabel: {
    fontFamily: "Nunito Sans",
    fontSize: 10,
    fontWeight: "400",
    color: "#B15CDE",
    marginRight: 4,
  },
  timingPillTime: {
    color: "#D9D8F3",
    fontFamily: "Nunito Sans",
    fontSize: 10,
    fontWeight: "400",
  },
  priceText: {
    color: "#B15CDE",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Nunito Sans",
  },
  eventTitle: {
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: "#b3b3cc",
    backgroundColor: "transparent",
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  categoryPillText: {
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
    fontSize: 11,
    fontWeight: "500",
  },
  eventDetailsCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "rgba(30,30,40,0.85)",
    borderWidth: 1,
    borderColor: "#7952FC",
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 18,
    paddingHorizontal: 0,
    shadowColor: '#B15CDE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  eventDetailsCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  eventDetailsLabel: {
    color: "#b3b3cc",
    fontSize: 8,
    fontWeight: "400",
    marginTop: 4,
    fontFamily: "Nunito Sans",
    textAlign: 'center',
  },
  eventDetailsValue: {
    color: "#a95eff",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 2,
    fontFamily: "Nunito Sans",
    textAlign: 'center',
  },
  eventDetailsIcon: {
    marginBottom: 2,
  },
  eventDetailsDivider: {
    width: 1,
    backgroundColor: 'rgba(198,197,237,0.12)',
    marginVertical: 8,
  },
  sectionTitle: {
    color: "#C6C5ED",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 12,
    fontFamily: "Nunito Sans",
  },
  soundSystemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#a95eff",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: "#a95eff",
  },
  customCheckboxCheckedNo: {
    backgroundColor: "transparent",
  },
  checkmark: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkmarkNo: {
    color: "transparent",
  },
  checkboxPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginRight: 24,
    backgroundColor: "transparent",
  },
  checkboxPillActive: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  checkboxPillText: {
    color: "#C6C5ED",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Nunito Sans",
  },
  checkboxPillTextActive: {
    color: "#a95eff",
    fontWeight: "700",
  },
  fixedBottomButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    marginTop: 20,
  },
  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonText: {
    color: "#fff",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  continueButtonInner: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#18151f',
  },
  loadingText: {
    color: '#C6C5ED',
    fontSize: 16,
    fontFamily: 'Nunito Sans',
  },
});

export default UserEvent;