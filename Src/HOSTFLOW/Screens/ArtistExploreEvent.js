
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
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";
import api from "../Config/api";

const { width, height } = Dimensions.get('window');

const ArtistExploreEvent = ({ navigation }) => {
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
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventImageWrapper}>
          {eventDetails?.posterUrl ? (
            <Image
              source={{ uri: eventDetails.posterUrl }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../assets/Images/ffff.jpg")}
              style={styles.eventImage}
              resizeMode="cover"
            />
          )}

          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(24,21,31,0.8)", "#18151f"]}
            locations={[0, 0.6, 1]}
            style={styles.eventImageGradient}
          />

          <TouchableOpacity
            style={styles.fabLeft}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#C6C5ED" />
          </TouchableOpacity>

          {/* Removed share button */}
        </View>

        {/* Organizer Section */}
        <View style={styles.organizerRow}>
          <Image
            source={require("../assets/Images/Avatar.png")}
            style={styles.organizerAvatar}
          />
          <View style={styles.organizerInfo}>
            <Text style={styles.organizerName}>Michael De Santa</Text>
            <Text style={styles.organizerSubtitle}>Organizer</Text>
          </View>
          <View style={styles.upcomingPillContainer}>
            <LinearGradient
              colors={["#7952FC", "#B15CDE"]}
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
              <Text style={styles.upcomingPillText}>Upcoming</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Timing and Price Row */}
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
              {eventDetails?.eventTime || "8:00 PM"}
            </Text>
          </View>
          <Text style={styles.priceText}>{eventDetails?.budget || "$400-$500"}</Text>
        </View>

        {/* Event Title */}
        <Text style={styles.eventTitle}>
          {eventDetails?.eventName || "Sounds of Celebration"}
        </Text>

        {/* Category Pills */}
        <View style={styles.categoryPillsRow}>
          {(eventDetails?.genre || ["Rock", "Metal", "Live Music"]).map((tag, index) => (
            <View key={index} style={styles.categoryPill}>
              <Text style={styles.categoryPillText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Event Details Card */}
        <View style={styles.eventDetailsCard}>
          <View style={styles.eventDetailsCol}>
            <Ionicons name="calendar-outline" size={14} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Date</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.eventDate?.[0]
                ? new Date(eventDetails.eventDate[0]).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                : "May 20"}
            </Text>
          </View>
          <View style={styles.eventDetailsDivider} />
          <View style={styles.eventDetailsCol}>
            <Ionicons name="location-outline" size={14} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Location</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.venue || "Yogyakarta"}
            </Text>
          </View>
          <View style={styles.eventDetailsDivider} />
          <View style={styles.eventDetailsCol}>
            <Ionicons name="people-outline" size={18} color="#a95eff" style={styles.eventDetailsIcon} />
            <Text style={styles.eventDetailsLabel}>Crowd Capacity</Text>
            <Text style={styles.eventDetailsValue}>
              {eventDetails?.assignedArtists?.length || "500"}
            </Text>
          </View>
        </View>

        {/* Sound System Section */}
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
                !soundSystemAvailable && styles.customCheckboxChecked,
              ]}
            >
              {!soundSystemAvailable && (
                <Text style={styles.checkmark}>✓</Text>
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

        {/* Apply Button (scrolls with content) */}
        
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
  applyButtonContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 24,
  },
  applyButton: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 0,
  },
  applyButtonGradient: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
    textAlign: 'center',
  },
});

export default ArtistExploreEvent;

