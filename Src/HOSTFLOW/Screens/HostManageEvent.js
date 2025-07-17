import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import TrashIcon from "../assets/icons/trash";
import MaskedView from "@react-native-masked-view/masked-view";
import { useSelector } from "react-redux";
import api from "../Config/api";

const { width, height } = Dimensions.get("window");

// Enhanced responsive dimensions system for all Android devices
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
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.max(height * 0.25, 180),
  cardPadding: Math.max(width * 0.025, 10),
  marginHorizontal: Math.max(width * 0.04, 16),
  artistImageSize: Math.max(width * 0.15, 60),
  dateOverlaySize: Math.max(width * 0.12, 48),
};

// GradientText component for gradient text rendering
const GradientText = ({ text, style, colors = ["#B15CDE", "#7952FC"] }) => (
  <MaskedView
    maskElement={
      <Text style={[style, { backgroundColor: "transparent" }]}>{text}</Text>
    }
  >
    <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
      <Text style={[style, { opacity: 0 }]}>{text}</Text>
    </LinearGradient>
  </MaskedView>
);

const HostManageEventContent = ({ navigation, route }) => {
  const token = useSelector((state) => state.auth.token);
  const insets = useSafeAreaInsets();
  const eventId = route.params?.eventId;
  const [eventData, setEventData] = useState(null);
  const [bookedArtists, setBookedArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch event details
  useEffect(() => {
    const fetchEventById = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/host/events/get-event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEventData(response?.data?.data);
      } catch (error) {
        console.error("Fetch event error:", error);
        Alert.alert("Error", "Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) {
      fetchEventById();
    }
  }, [eventId, token]);

  // Fetch booked artists
  useEffect(() => {
    const fetchBookedArtists = async () => {
      try {
        setLoading(true);
        console.log("eventId",eventId)
        const response = await api.get(`/host/events/booked-artists/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBookedArtists(response?.data?.data || []);
      } catch (error) {
        console.error("Fetch booked artists error:", error);
        Alert.alert("Error", "Failed to fetch booked artists.");
      } finally {
        setLoading(false);
      }
    };
    if (eventId) {
      fetchBookedArtists();
    }
  }, [eventId, token]);

  // Handle Cancel Event
  const handleCancelEvent = async () => {
    Alert.alert(
      "Confirm Cancel",
      "Are you sure you want to cancel this event?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await api.patch(
                `/host/events/cancel-event/${eventId}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setEventData(response?.data?.data);
              Alert.alert("Success", "Event cancelled successfully.");
            } catch (error) {
              console.error("Cancel event error:", error);
              Alert.alert("Error", "Failed to cancel event.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle Mark Event Completed
  const handleMarkEventCompleted = async () => {
    Alert.alert(
      "Confirm Completion",
      "Are you sure you want to mark this event as completed?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await api.patch(
                `/host/events/mark-event-completed/${eventId}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              setEventData(response?.data?.data);
              Alert.alert("Success", "Event marked as completed successfully.");
            } catch (error) {
              console.error("Mark event completed error:", error);
              Alert.alert("Error", "Failed to mark event as completed.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Format date
  const rawDate = eventData?.eventDateTime?.[0];
  const dateObj = rawDate ? new Date(rawDate) : null;
  const month = dateObj
    ? dateObj.toLocaleString("en-US", { month: "short" })
    : "";
  const day = dateObj ? dateObj.getDate() : "";
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const renderArtistStatusCard = ({ item }) => {
    let statusButtonStyle = {};
    let statusButtonTextStyle = {};
    let showPlusButton = false;
    let statusText = item.paymentStatus;
    let gradientColors = ["#B15CDE", "#7952FC"];

    switch (item.paymentStatus) {
      case "pending":
        statusButtonStyle = styles.statusButtonPending;
        statusButtonTextStyle = styles.statusButtonTextPending;
        gradientColors = ["#FF9500", "#FFC371"];
        break;
      case "completed":
        statusButtonStyle = styles.statusButtonBooked;
        statusButtonTextStyle = styles.statusButtonTextBooked;
        gradientColors = ["#28a745", "#43e97b"];
        statusText = "Booked";
        break;
      case "failed":
        statusButtonStyle = styles.statusButtonRejected;
        statusButtonTextStyle = styles.statusButtonTextRejected;
        gradientColors = ["#FF3B30", "#FF3B30"];
        statusText = "Payment Failed";
        showPlusButton = true;
        break;
      default:
        break;
    }

    return (
      <View
        style={[
          styles.artistCard,
          {
            padding: dimensions.cardPadding,
            marginBottom: Math.max(dimensions.spacing.lg, 15),
            borderRadius: dimensions.borderRadius.md,
          },
        ]}
      >
        <Image
          source={{ uri: item.profileImageUrl || "https://via.placeholder.com/60" }}
          style={[
            styles.artistImage,
            {
              width: dimensions.artistImageSize,
              height: dimensions.artistImageSize,
              borderRadius: dimensions.borderRadius.sm,
              marginRight: Math.max(dimensions.spacing.md, 10),
            },
          ]}
        />
        <View style={styles.artistInfo}>
          <Text
            style={[
              styles.artistBudget,
              {
                fontSize: Math.max(dimensions.fontSize.body, 14),
              },
            ]}
          >
            Budget: ${eventData?.budget || "N/A"}
          </Text>
          <Text
            style={[
              styles.artistGenre,
              {
                color: "#A6A6A6",
                fontSize: Math.max(dimensions.fontSize.body, 14),
                marginVertical: Math.max(dimensions.spacing.xs, 2),
                fontWeight: "400",
                fontFamily: "Poppins",
              },
            ]}
          >
            Genre:{" "}
            <Text
              style={{
                color: "#000",
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: "600",
              }}
            >
              {item.artistType || "N/A"}
            </Text>
          </Text>
          <View
            style={[
              styles.artistStatusRow,
              {
                marginTop: Math.max(dimensions.spacing.xs, 5),
              },
            ]}
          >
            <Text
              style={[
                styles.artistStatusLabel,
                {
                  fontSize: Math.max(dimensions.fontSize.body, 14),
                },
              ]}
            >
              Status:
            </Text>
            <TouchableOpacity
              style={[statusButtonStyle]}
              onPress={() =>
                item.paymentStatus === "pending" &&
                navigation.navigate("HostManageEventDetailBooking", {
                  artistId: item.artistId,
                  eventId,
                })
              }
              activeOpacity={0.8}
            >
              <GradientText
                text={statusText}
                colors={gradientColors}
                style={[statusButtonTextStyle, { fontSize: Math.max(dimensions.fontSize.small, 10) }]}
              />
            </TouchableOpacity>
            {showPlusButton && (
              <TouchableOpacity
                style={[
                  styles.plusButton,
                  {
                    borderRadius: Math.max(dimensions.borderRadius.lg, 15),
                    width: Math.max(dimensions.spacing.xxl + 6, 30),
                    height: Math.max(dimensions.spacing.xxl + 6, 30),
                    marginLeft: Math.max(dimensions.spacing.md, 10),
                  },
                ]}
                activeOpacity={0.8}
              >
                <Feather
                  name="plus"
                  size={Math.max(dimensions.iconSize * 0.8, 18)}
                  color="#fff"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.artistActions}>
          <Text
            style={[
              styles.artistDate,
              {
                fontSize: Math.max(dimensions.fontSize.small, 12),
                marginBottom: Math.max(dimensions.spacing.xs, 5),
              },
            ]}
          >
            {formattedDate}
          </Text>
          <TouchableOpacity style={styles.trashButton} activeOpacity={0.7}>
            <TrashIcon width={14} height={14} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather
              name="arrow-left"
              size={Math.max(dimensions.iconSize + 4, 24)}
              color="#fff"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{eventData?.about || "Event Details"}</Text>
          <View style={{ width: Math.max(dimensions.iconSize + 4, 24) }} />
        </View>

        {/* Event Image with Date Overlay */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: eventData?.posterUrl || "https://via.placeholder.com/300" }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.dateOverlay}>
            <Text style={styles.dateMonth}>{month}</Text>
            <Text style={styles.dateDay}>{day}</Text>
          </View>
        </View>

        {/* Event Title */}
        <Text style={styles.eventTitle}>{eventData?.eventName || "Event Name"}</Text>
        <View style={styles.sectionSeparator} />

        {/* Artists Status Section */}
        <Text style={styles.sectionTitle}>Booked Artists:</Text>
        <View style={styles.artistStatusSection}>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : bookedArtists.length > 0 ? (
            <FlatList
              data={bookedArtists}
              renderItem={renderArtistStatusCard}
              keyExtractor={(item) => item.artistId.toString()}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.noArtistsText}>No booked artists found.</Text>
          )}
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Action Buttons */}
        <View style={styles.eventActionButtonsContainer}>
          <View style={styles.topActionButtonsContainer}>
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientBorderButton}
            >
              <LinearGradient
                colors={["#b33bf6", "#a95eff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cancelEventButton}
              >
                <TouchableOpacity
                  style={styles.buttonTouchableOpacity}
                  onPress={handleCancelEvent}
                  activeOpacity={0.8}
                  disabled={loading || eventData?.isCancelled}
                >
                  <Text style={styles.cancelEventButtonText}>
                    {eventData?.isCancelled ? "Event Cancelled" : "Cancel Event"}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
            <TouchableOpacity
              style={[
                styles.eventCompletedButton,
                eventData?.isCompleted && { opacity: 0.5 },
              ]}
              onPress={handleMarkEventCompleted}
              activeOpacity={0.8}
              disabled={loading || eventData?.isCompleted || eventData?.isCancelled}
            >
              <GradientText
                text={eventData?.isCompleted ? "Event Completed" : "Mark Event Completed"}
                colors={["#B15CDE", "#7952FC"]}
                style={styles.eventCompletedButtonText}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.ticketSettingsButton}
            onPress={() => navigation.navigate("HostTicketSetting", { eventId })}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.ticketSettingsButtonText}>Ticket Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const HostManageEventScreen = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <HostManageEventContent navigation={navigation} route={route} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: dimensions.marginHorizontal,
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#C6C5ED",
    backgroundColor: "#121212",
    shadowColor: "#683BFC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  backButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    flex: 1,
    fontSize: Math.max(dimensions.fontSize.header, 18),
  },
  imageContainer: {
    marginHorizontal: dimensions.marginHorizontal,
    marginTop: Math.max(dimensions.spacing.lg, 15),
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventImage: {
    width: "100%",
    height: dimensions.imageHeight,
    borderRadius: dimensions.borderRadius.lg,
  },
  dateOverlay: {
    position: "absolute",
    top: Math.max(dimensions.spacing.md, 10),
    left: Math.max(dimensions.spacing.md, 10),
    borderRadius: dimensions.borderRadius.sm,
    paddingHorizontal: Math.max(dimensions.spacing.sm, 8),
    paddingVertical: Math.max(dimensions.spacing.xs, 4),
    minWidth: dimensions.dateOverlaySize,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  dateMonth: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Math.max(dimensions.fontSize.small, 12),
  },
  dateDay: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: Math.max(dimensions.fontSize.header, 18),
  },
  eventTitle: {
    fontWeight: "500",
    color: "#fff",
    fontSize: Math.max(dimensions.fontSize.large, 20),
    marginHorizontal: dimensions.marginHorizontal,
    marginTop: Math.max(dimensions.spacing.md, 10),
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: Math.max(dimensions.fontSize.title, 16),
    marginBottom: Math.max(dimensions.spacing.md, 10),
    marginLeft: dimensions.marginHorizontal,
  },
  artistStatusSection: {
    marginTop: Math.max(dimensions.spacing.lg, 15),
    paddingHorizontal: dimensions.marginHorizontal,
  },
  artistCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: dimensions.cardPadding,
    marginBottom: Math.max(dimensions.spacing.lg, 15),
    borderRadius: dimensions.borderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artistImage: {
    width: dimensions.artistImageSize,
    height: dimensions.artistImageSize,
    borderRadius: dimensions.borderRadius.sm,
    marginRight: Math.max(dimensions.spacing.md, 10),
  },
  artistInfo: {
    flex: 1,
  },
  artistBudget: {
    color: "#6A6A6A",
    fontFamily: "Poppins",
    fontSize: Math.max(dimensions.fontSize.body, 14),
  },
  artistGenre: {
    color: "#A6A6A6",
    fontFamily: "Poppins",
    fontSize: Math.max(dimensions.fontSize.body, 14),
    marginVertical: Math.max(dimensions.spacing.xs, 2),
    fontWeight: "400",
  },
  artistStatusLabel: {
    color: "#888",
    fontSize: Math.max(dimensions.fontSize.body, 14),
  },
  artistStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Math.max(dimensions.spacing.xs, 5),
  },
  statusButtonPending: {
    width: 78,
    height: 20,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#FF9500",
    backgroundColor: "transparent",
  },
  statusButtonTextPending: {
    fontFamily: "Poppins",
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  statusButtonBooked: {
    height: 20,
    paddingHorizontal: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#28a745",
    backgroundColor: "transparent",
  },
  statusButtonTextBooked: {
    fontFamily: "Poppins",
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  statusButtonRejected: {
    height: 20,
    paddingHorizontal: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#FF3B30",
    backgroundColor: "transparent",
  },
  statusButtonTextRejected: {
    fontFamily: "Poppins",
    fontSize: 10,
    fontWeight: "400",
    textTransform: "capitalize",
  },
  plusButton: {
    backgroundColor: "#a95eff",
    justifyContent: "center",
    alignItems: "center",
  },
  artistActions: {
    alignItems: "flex-end",
  },
  artistDate: {
    color: "#a95eff",
    fontSize: Math.max(dimensions.fontSize.small, 12),
    marginBottom: Math.max(dimensions.spacing.xs, 5),
  },
  trashButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#FF3B30",
  },
  eventActionButtonsContainer: {
    marginTop: Math.max(dimensions.spacing.lg, 15),
    marginHorizontal: dimensions.marginHorizontal,
  },
  topActionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  gradientBorderButton: {
    flex: 1,
    borderRadius: 12,
    padding: 1.5,
    marginRight: 5,
  },
  cancelEventButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelEventButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  eventCompletedButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#A95EFF",
    justifyContent: "center",
    alignItems: "center",
  },
  eventCompletedButtonText: {
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 16,
  },
  ticketSettingsButton: {
    width: "100%",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#C6C5ED",
    backgroundColor: "transparent",
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketSettingsButtonText: {
    color: "#C6C5ED",
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 14,
  },
  buttonTouchableOpacity: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionSeparator: {
    width: 319,
    height: 1,
    backgroundColor: "#4F4F59",
    alignSelf: "center",
    marginVertical: 16,
  },
  loadingText: {
    color: "#fff",
    fontSize: Math.max(dimensions.fontSize.body, 14),
    textAlign: "center",
  },
  noArtistsText: {
    color: "#fff",
    fontSize: Math.max(dimensions.fontSize.body, 14),
    textAlign: "center",
  },
});

export default HostManageEventScreen;