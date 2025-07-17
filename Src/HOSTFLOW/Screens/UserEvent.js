import React, { useEffect, useState } from 'react';
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
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, toggleFavorite, setLoading, setError } from '../Redux/slices/favoritesSlice';
import { selectIsLoggedIn } from '../Redux/slices/authSlice';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const UserEvent = ({ navigation }) => {
  console.log('UserEvent: Component mounted');
  const insets = useSafeAreaInsets();
  const [eventDetails, setEventDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const token = useSelector((state) => state.auth.token);

  const route = useRoute();
  const { eventId } = route.params || {};
  console.log('UserEvent: Received eventId', { eventId, isFavorite: !!favorites[eventId] });

  useEffect(() => {
    console.log('UserEvent: useEffect for fetching event details triggered', { eventId, token });
    const fetchEventDetails = async () => {
      if (!eventId || !token) {
        console.error('UserEvent: Missing eventId or token', { eventId, token });
        Alert.alert('Error', 'Unable to fetch event details. Please try again.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log('UserEvent: Fetching event details from API', { endpoint: `/host/events/get-event/${eventId}` });
        const response = await api.get(`/host/events/get-event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('UserEvent: Fetched event details', { status: response.status, data: response.data });
        setEventDetails(response.data.data);
      } catch (err) {
        console.error('UserEvent: Error fetching event details', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
          config: err.config,
        });
        Alert.alert(
          'Error',
          err.response?.data?.message || 'Failed to fetch event details. Please try again.'
        );
      } finally {
        console.log('UserEvent: Setting isLoading to false');
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
    console.log('UserEvent: handleGuestListRequest called', { eventId, token });
    if (!eventId || !token) {
      console.error('UserEvent: Missing eventId or token for guest list request', { eventId, token });
      Alert.alert('Error', 'Event ID or authentication token is missing.');
      return;
    }

    try {
      console.log('UserEvent: Submitting guest list request', { endpoint: `/guest-list/apply/${eventId}` });
      const response = await api.post(
        `/guest-list/apply/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('UserEvent: Guest list request response', { status: response.status, data: response.data });
      Alert.alert(
        'Success',
        'Your guest list request has been submitted! The event artists will be notified and can approve your request.'
      );
    } catch (err) {
      console.error('UserEvent: Error submitting guest list request', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        config: err.config,
      });
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

  const handleFavoriteToggle = async () => {
    console.log('UserEvent: handleFavoriteToggle called', { eventId, isFavorite: !!favorites[eventId] });
    if (!isLoggedIn || !token) {
      console.log('UserEvent: User not logged in, navigating to UserSignup');
      Alert.alert('Error', 'Please log in to add events to your favorites.');
      navigation.navigate('UserSignup');
      return;
    }

    try {
      dispatch(setLoading(true));
      const isFavorite = !!favorites[eventId];
      if (isFavorite) {
        console.log('UserEvent: Removing favorite event', eventId);
        const response = await api.delete(`/user/remove-favourite-event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('UserEvent: Remove favorite response', {
          status: response.status,
          data: response.data,
        });
        if (response.data.success) {
          console.log('UserEvent: Dispatching toggleFavorite for removal', eventId);
          dispatch(toggleFavorite(eventId));
        } else {
          console.error('UserEvent: Failed to remove favorite event', response.data);
          dispatch(setError(response.data.message || 'Failed to remove favorite event'));
          Alert.alert('Error', response.data.message || 'Failed to remove favorite event.');
        }
      } else {
        console.log('UserEvent: Adding favorite event', eventId);
        const response = await api.post(
          '/user/add-favourite-event',
          { eventId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('UserEvent: Add favorite response', {
          status: response.status,
          data: response.data,
        });
        if (response.data.success) {
          console.log('UserEvent: Dispatching toggleFavorite for addition', eventId);
          dispatch(toggleFavorite(eventId));
        } else {
          console.error('UserEvent: Failed to add favorite event', response.data);
          dispatch(setError(response.data.message || 'Failed to add favorite event'));
          Alert.alert('Error', response.data.message || 'Failed to add favorite event.');
        }
      }
    } catch (error) {
      console.error('UserEvent: Error updating favorite', {
        eventId,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config,
      });
      dispatch(setError(error.message || 'Failed to update favorite'));
      Alert.alert('Error', error.message || 'Failed to update favorite.');
    } finally {
      console.log('UserEvent: Setting loading to false after toggle');
      dispatch(setLoading(false));
    }
  };

  const formatEventDate = (dateTimeArray) => {
    console.log('UserEvent: Formatting event date', { dateTimeArray });
    if (!Array.isArray(dateTimeArray) || dateTimeArray.length === 0) {
      return 'N/A';
    }
    const date = new Date(dateTimeArray[0]);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatEventTime = (dateTimeArray) => {
    console.log('UserEvent: Formatting event time', { dateTimeArray });
    if (!Array.isArray(dateTimeArray) || dateTimeArray.length === 0) {
      return 'N/A';
    }
    const date = new Date(dateTimeArray[0]);
    return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  const formatBudget = (budget) => {
    console.log('UserEvent: Formatting budget', { budget });
    if (!budget) return 'N/A';
    return `₹${budget.toLocaleString('en-IN')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading event details...</Text>
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
        <View style={styles.eventImageWrapper}>
          {eventDetails?.posterUrl ? (
            <Image
              source={{ uri: eventDetails.posterUrl }}
              style={styles.eventImage}
              resizeMode="cover"
              onLoad={() => console.log('UserEvent: Image loaded for event', eventId)}
              onError={(e) => console.error('UserEvent: Image load error', { eventId, error: e.nativeEvent.error })}
            />
          ) : (
            <Image
              source={require('../assets/Images/ffff.jpg')}
              style={styles.eventImage}
              resizeMode="cover"
              onLoad={() => console.log('UserEvent: Fallback image loaded for event', eventId)}
              onError={(e) => console.error('UserEvent: Fallback image load error', { eventId, error: e.nativeEvent.error })}
            />
          )}

          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(24,21,31,0.8)', '#18151f']}
            locations={[0, 0.6, 1]}
            style={styles.eventImageGradient}
          />

          <TouchableOpacity
            style={styles.fabLeft}
            onPress={() => {
              console.log('UserEvent: Back button pressed');
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#C6C5ED" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fabRight}
            onPress={() => console.log('UserEvent: Share button pressed')}
          >
            <Ionicons name="share-social-outline" size={20} color="#C6C5ED" />
          </TouchableOpacity>

          {eventDetails?.eventGuestEnabled && (
            <View style={styles.guestListButtonWrapper}>
              <TouchableOpacity
                onPress={handleGuestListRequest}
                style={styles.guestListButton}
              >
                <Text style={styles.guestListText}>Apply For Guest List</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.organizerRow}>
          <Image
            source={
              eventDetails?.hostId?.profileImageUrl
                ? { uri: eventDetails.hostId.profileImageUrl }
                : require('../assets/Images/Avatar.png')
            }
            style={styles.organizerAvatar}
            onLoad={() => console.log('UserEvent: Organizer avatar loaded', eventDetails?.hostId?.profileImageUrl)}
            onError={(e) => console.error('UserEvent: Organizer avatar load error', { eventId, error: e.nativeEvent.error })}
          />
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerName}>
              {eventDetails?.hostId?.fullName || 'Unknown Organizer'}
            </Text>
            <Text style={styles.organizerSubtitle}>Organizer</Text>
          </View>
          <View style={styles.upcomingPillContainer}>
            <LinearGradient
              colors={['#7952FC', '#B15CDE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upcomingPill}
            >
              <Ionicons
                name="musical-notes-outline"
                size={14}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.upcomingPillText}>
                {eventDetails?.showStatus?.[0]?.status || 'Upcoming'}
              </Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.timingPriceRow}>
          <View style={styles.timingPill}>
            <Ionicons
              name="time-outline"
              size={14}
              color="#a95eff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.timingPillLabel}>Timing:</Text>
            <Text style={styles.timingPillTime}>
              {formatEventTime(eventDetails?.eventDateTime)}
            </Text>
          </View>
          <Text style={styles.priceText}>
            {eventDetails?.ticketSetting?.ticketType === 'free' ? 'Free' : formatBudget(eventDetails?.ticketSetting?.price || eventDetails?.budget)}
          </Text>
        </View>

        <Text style={styles.eventTitle}>
          {eventDetails?.eventName || 'Event Name'}
        </Text>

        <View style={styles.categoryPillsRow}>
          {(eventDetails?.genre || ['Rock']).map((tag, index) => (
            <View
              key={index}
              style={styles.categoryPill}
            >
              <Text style={styles.categoryPillText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.eventDetailsCard}>
          <View style={styles.eventDetailsCol}>
            <Ionicons name="calendar-outline" size={14} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Date</Text>
            <Text style={styles.eventDetailsValue}>
              {formatEventDate(eventDetails?.eventDateTime)}
            </Text>
          </View>
          <View style={styles.eventDetailsDivider} />
          <View style={styles.eventDetailsCol}>
            <Ionicons name="location-outline" size={14} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Location</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.venue || 'N/A'}
            </Text>
          </View>
          <View style={styles.eventDetailsDivider} />
          <View style={styles.eventDetailsCol}>
            <Ionicons name="people-outline" size={18} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Crowd Capacity</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.ticketSetting?.totalQuantity || 'N/A'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sound System Availability</Text>
        <View style={styles.soundSystemRow}>
          <View
            style={[
              styles.checkboxPill,
              eventDetails?.isSoundSystem && styles.checkboxPillActive
            ]}
          >
            <View
              style={[
                styles.customCheckbox,
                eventDetails?.isSoundSystem && styles.customCheckboxChecked
              ]}
            >
              {eventDetails?.isSoundSystem && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.checkboxPillText,
                eventDetails?.isSoundSystem && styles.checkboxPillTextActive
              ]}
            >
              Yes
            </Text>
          </View>
          <View
            style={[
              styles.checkboxPill,
              !eventDetails?.isSoundSystem && styles.checkboxPillActive
            ]}
          >
            <View
              style={[
                styles.customCheckbox,
                !eventDetails?.isSoundSystem && styles.customCheckboxCheckedNo
              ]}
            >
              {!eventDetails?.isSoundSystem && <Text style={styles.checkmarkNo}></Text>}
            </View>
            <Text
              style={[
                styles.checkboxPillText,
                !eventDetails?.isSoundSystem && styles.checkboxPillTextActive
              ]}
            >
              No
            </Text>
          </View>
        </View>

        <View style={styles.fixedBottomButtonsContainer}>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => {
              console.log('UserEvent: Like button pressed', { eventId, isFavorite: !!favorites[eventId] });
              handleFavoriteToggle();
            }}
          >
            <Ionicons
              name={favorites[eventId] ? 'heart' : 'heart-outline'}
              size={24}
              color="#a95eff"
            />
          </TouchableOpacity>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueButton}
          >
            <TouchableOpacity
              style={styles.continueButtonInner}
              onPress={() => {
                console.log('UserEvent: Continue button pressed', { eventId });
                navigation.navigate('UserFormBookingScreen', {
                  eventDetails: {
                    id: eventId,
                    title: eventDetails?.eventName || 'Event Name',
                    price: eventDetails?.ticketSetting?.ticketType === 'free'
                      ? 'Free'
                      : formatBudget(eventDetails?.ticketSetting?.price || eventDetails?.budget),
                    location: eventDetails?.venue || 'N/A',
                    image: eventDetails?.posterUrl ? { uri: eventDetails.posterUrl } : require('../assets/Images/ffff.jpg'),
                    eventDateTime: eventDetails?.eventDateTime,
                  },
                });
              }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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