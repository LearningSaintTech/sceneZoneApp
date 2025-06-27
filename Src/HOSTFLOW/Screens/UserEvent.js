// 



import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import api from "../Config/api";

const UserEvent = ({ navigation }) => {
  const [soundSystemAvailable, setSoundSystemAvailable] = React.useState(true);
  const insets = useSafeAreaInsets();
  const [eventDetails, setEventDetails] = React.useState(null);

  const route = useRoute();
  const { eventId } = route.params || {};
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId || !token) {
        console.error("Missing eventId or token");
        Alert.alert("Error", "Unable to fetch event details. Please try again.");
        return;
      }

      try {
        const response = await api.get(`/host/events/get-event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched Event by ID:", response.data);
        setEventDetails(response.data.data); // Save the full event data

        if (response.data.data?.isSoundSystem !== undefined) {
          setSoundSystemAvailable(response.data.data.isSoundSystem);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        Alert.alert(
          "Error",
          err.response?.data?.message || "Failed to fetch event details. Please try again."
        );
      }
    };

    if (eventId && token) {
      fetchEventDetails();
    }
  }, [eventId, token, navigation]);

  const handleGuestListRequest = async () => {
    if (!eventId || !token) {
      Alert.alert("Error", "Event ID or authentication token is missing.");
      return;
    }

    try {
      const response = await api.post(
        "/user/guest-request",
        { eventId: eventId || "6846d3761d717cc2cffa67d1" }, // Fallback eventId
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Guest List Request Response:", response.data);
      Alert.alert("Success", "Your guest list request has been submitted!");
    } catch (err) {
      console.error("Error submitting guest list request:", err);
      let errorMessage = "Failed to submit guest list request. Please try again.";
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage = "Guest list request endpoint not found. Please check the server configuration.";
        } else {
          errorMessage = err.response.data?.message || errorMessage;
        }
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#18151f",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.eventImageWrapper}>
          {eventDetails?.posterUrl && (
            <Image
              source={{ uri: eventDetails.posterUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}

          <LinearGradient
            colors={["rgba(0,0,0,0)", "#18151f"]}
            style={styles.eventImageGradient}
          />
          <TouchableOpacity
            style={styles.fabLeft}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={26} color="#C6C5ED" />
          </TouchableOpacity>

          <View style={styles.guestListButtonWrapper}>
            <TouchableOpacity
              onPress={handleGuestListRequest}
              style={styles.guestListButton}
            >
              <Text style={styles.guestListText}>Apply For Guest List </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.fabRight}>
            <Ionicons name="share-social-outline" size={22} color="#C6C5ED" />
          </TouchableOpacity>
        </View>

        <View style={styles.organizerRow}>
          <Image
            source={require("../assets/Images/Avatar.png")}
            style={styles.organizerAvatar}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.organizerName}>Michael De Santa</Text>
            <Text style={styles.organizerSubtitle}>Organizer</Text>
          </View>
          <View style={styles.upcomingPill}>
            <LinearGradient
              colors={["#7952FC", "#B15CDE"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.upcomingPill}
            >
              <Ionicons
                name="musical-notes-outline"
                size={16}
                color="#fff"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.upcomingPillText}>Upcoming</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.timingPriceRow}>
          <View style={styles.timingPill}>
            <Ionicons
              name="musical-notes-outline"
              size={16}
              color="#a95eff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.timingPillLabel}>Timing :</Text>

            <Text style={styles.timingPillTime}>
              {eventDetails?.eventTime || "N/A"}
            </Text>
          </View>
          <Text style={styles.priceText}>{eventDetails?.budget}</Text>
        </View>

        <Text style={styles.eventTitle}>
          {eventDetails?.eventName || "Loading..."}
        </Text>

        <View style={styles.categoryPillsRow}>
          {(eventDetails?.genre || []).map((tag) => (
            <View key={tag} style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Event Details Card */}
        <View style={styles.eventDetailsCard}>
          <View style={styles.eventDetailsCol}>
            <Ionicons name="calendar-outline" size={18} color="#a95eff" />
            <Text style={styles.eventDetailsLabel}>Date</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.eventDate?.[0]
                ? new Date(eventDetails.eventDate[0]).toLocaleDateString()
                : "--"}
            </Text>
          </View>
          <View style={styles.eventDetailsCol}>
            <Ionicons name="location-outline" size={18} color="#a95eff" />
            <Text style={styles.eventDetailsLabel}>Location</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.venue || "--"}
            </Text>
          </View>
          <View style={styles.eventDetailsCol}>
            <Ionicons name="people-outline" size={18} color="#a95eff" />
            <Text style={styles.eventDetailsLabel}>Crowd Capacity</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.assignedArtists?.length || "0"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sound System Availability</Text>
        <View style={styles.soundSystemRow}>
          <TouchableOpacity
            style={[
              styles.checkboxPill,
              soundSystemAvailable && styles.checkboxPillActive,
            ]}
            onPress={() => setSoundSystemAvailable(true)}
          >
            <View
              style={[
                styles.customCheckbox,
                soundSystemAvailable && styles.customCheckboxChecked,
              ]}
            >
              {soundSystemAvailable && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text
              style={[
                styles.checkboxPillText,
                soundSystemAvailable && styles.checkboxPillTextActive,
              ]}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.checkboxPill,
              !soundSystemAvailable && styles.checkboxPillActive,
            ]}
            onPress={() => setSoundSystemAvailable(false)}
          >
            <View
              style={[
                styles.customCheckbox,
                !soundSystemAvailable && styles.customCheckboxCheckedNo,
              ]}
            >
              {!soundSystemAvailable && (
                <Text style={styles.checkmarkNo}></Text>
              )}
            </View>
            <Text
              style={[
                styles.checkboxPillText,
                !soundSystemAvailable && styles.checkboxPillTextActive,
              ]}
            >
              No
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fixedBottomButtonsContainer}>
          <View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={32} color="#a95eff" />
            </TouchableOpacity>
          </View>
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.soldOutButton}
          >
            <TouchableOpacity
              style={styles.soldOutButtonInner}
              onPress={() =>
                navigation.navigate("UserFormBookingScreen", {
                  eventDetails: {
                    title: "Sounds of Celebration",
                    price: "$400-$500",
                    location: "Yogyakarta",
                    image: require("../assets/Images/ffff.jpg"),
                  },
                })
              }
            >
              <Text style={styles.soldOutButtonText}>Continue</Text>
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
  guestListButtonWrapper: {
    position: "absolute",
    top: 36,
    left: "25%",
    right: "25%",
    zIndex: 9,
  },
  guestListButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  guestListText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito Sans",
  },
  eventImageWrapper: {
    width: "100%",
    height: 320,
    position: "relative",
    marginBottom: -30,
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
    height: 180,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  fabLeft: {
    position: "absolute",
    top: 36,
    left: 18,
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C6C5ED",
    backgroundColor: "rgba(24,21,31,0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  fabRight: {
    position: "absolute",
    top: 36,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C6C5ED",
    backgroundColor: "rgba(24,21,31,0.25)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  organizerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 0,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  organizerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 0,
    borderWidth: 2,
    borderColor: "#fff",
  },
  organizerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
  },
  organizerSubtitle: {
    fontSize: 14,
    color: "#b3b3cc",
    marginTop: 2,
    fontFamily: "Nunito Sans",
  },
  upcomingPill: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    paddingTop: 0,
    paddingRight: 18,
    paddingBottom: 0,
    paddingLeft: 12,
    gap: 4,
    borderRadius: 360,
    marginLeft: "auto",
    overflow: "hidden",
  },
  upcomingPillText: {
    color: "#fff",
    fontFamily: "Nunito Sans",
    fontWeight: "600",
    fontSize: 14,
  },
  timingPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  timingPill: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    paddingTop: 0,
    paddingRight: 18,
    paddingBottom: 0,
    paddingLeft: 12,
    gap: 4,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: "#7952FC",
    backgroundColor: "transparent",
    alignSelf: "flex-start",
  },
  timingPillLabel: {
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 21,
    color: "#B15CDE",
  },
  timingPillTime: {
    color: "#D9D8F3",
    fontFamily: "Nunito Sans",
    fontSize: 10,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 21,
    textAlign: "center",
  },
  priceText: {
    color: "#B15CDE",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Nunito Sans",
  },
  eventTitle: {
    overflow: "hidden",
    color: "#C6C5ED",
    textOverflow: "ellipsis",
    fontFamily: "Nunito Sans",
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 30,
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  categoryPillsRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingHorizontal: 20,
    marginBottom: 18,
    display: "flex",
    alignItems: "flex-start",
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: "#b3b3cc",
    backgroundColor: "transparent",
    borderRadius: 16,
    marginRight: 12,
    marginBottom: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryPillText: {
    color: "#C6C5ED",
    fontFamily: "Inter",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 16,
  },
  eventDetailsCard: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "rgba(30,30,40,0.95)",
    borderWidth: 1.5,
    borderColor: "#b3b3cc",
    borderRadius: 24,
    marginHorizontal: 14,
    marginBottom: 18,
    marginTop: 2,
    paddingVertical: 18,
    paddingHorizontal: 0,
  },
  eventDetailsCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  eventDetailsLabel: {
    color: "#b3b3cc",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
    fontFamily: "Nunito Sans",
  },
  eventDetailsValue: {
    color: "#a95eff",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
    fontFamily: "Nunito Sans",
  },
  sectionTitle: {
    color: "#C6C5ED",
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
    fontFamily: "Nunito Sans",
  },
  soundSystemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 10,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
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
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 20,
  },
  checkmarkNo: {
    color: "transparent",
  },
  checkboxPill: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "transparent",
    borderRadius: 10,
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
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Nunito Sans",
    marginLeft: 2,
  },
  checkboxPillTextActive: {
    color: "#a95eff",
    fontWeight: "700",
  },
  fixedBottomButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: "transparent",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    gap: 16,
    marginTop: 24,
  },
  heartButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "transparent",
    elevation: 0,
  },
  soldOutButton: {
    flex: 2,
    height: 56,
    borderRadius: 14,
    borderWidth: 0,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 0,
    marginRight: 0,
    paddingHorizontal: 0,
    shadowColor: "transparent",
    elevation: 0,
  },
  soldOutButtonText: {
    color: "#fff",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },
  soldOutButtonInner: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserEvent;