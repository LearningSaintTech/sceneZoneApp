import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import RazorpayCheckout from "react-native-razorpay";
import { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } from "@env";
const UserDetailBookingScreen = ({ navigation, route }) => {
  const razorpayID = RAZORPAY_KEY_ID;
  const razorpaySecret = RAZORPAY_SECRET_KEY;
  const amount = 5000;
  const currency = "INR";
  console.log("Razorpay Key ID:", RAZORPAY_KEY_ID);
  console.log("Razorpay Secret Key:", RAZORPAY_SECRET_KEY);
  const insets = useSafeAreaInsets();
  
  const { numberOfTickets, selectedGuestType, eventDetails } = route.params || {};
  const subtotal = 50.0;
  const platformFees = 1.5;
  const taxRate = 0.04;
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + platformFees + taxAmount;
  const ticketId = "#8954673009";
  const userName = "Franklin Clinton";
  const handleConfirmBooking = () => {
    var options = {
      description: "I am Buying Tickets",
      image: "../assets/Images/fff.jpg",
      currency: currency,
      key: razorpayID,
      amount: amount * 100,
      name: "KD",
      order_id: "",
      prefill: {
        email: "kd@gmail.com",
        contact: "9170412775",
        name: "Sonu Kumar",
      },
      theme: { color: "#53a20e" },
    };
    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch((error) => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
    // Implement booking confirmation logic here
    console.log("Confirming booking");
    // Navigate to the ticket download screen
    navigation.navigate("UserTicketDownload", {
      bookingDetails: {
        numberOfTickets,
        selectedGuestType,
        eventDetails,
        totalAmount,
        ticketId,
      },
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top, 20),
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={styles.backButtonContainer}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Booking Payment </Text>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Event Image and Date */}
        <View style={styles.eventImageContainer}>
          <Image
            source={eventDetails?.image || require("../assets/Images/fff.jpg")}
            style={styles.eventImage}
            resizeMode="cover"
          />
          {/* Date Overlay */}
          <View style={styles.dateOverlay}>
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateMonth}>May</Text>
              <Text style={styles.dateDay}>20</Text>
            </View>
          </View>
        </View>

        {/* Event Title and Ticket ID */}
        <View style={styles.eventInfoContainer}>
          <View style={styles.eventTitleContainer}>
            <Text
              style={styles.eventTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {eventDetails?.title || "Event Title"}
            </Text>
          </View>
          <View style={styles.ticketIdContainer}>
            <Text style={styles.ticketId}>Ticket ID: {ticketId}</Text>
          </View>
        </View>
        {/* Separator line below Ticket ID */}
        <View style={styles.ticketIdSeparator} />

        {/* Booking Details Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRowColumn}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{userName}</Text>
          </View>
          <View style={styles.detailRowColumn}>
            <Text style={styles.detailLabel}>Detail Location</Text>
            <Text style={styles.detailValue}>
              {eventDetails?.location || "Location"}
            </Text>
          </View>
          <View style={styles.detailRowTwoCol}>
            <View style={styles.detailRowColumnFlex}>
              <Text style={styles.detailLabel}>Number of Ticket</Text>
              <Text style={styles.detailValue}>x{numberOfTickets || "1"}</Text>
            </View>
            <View style={styles.detailRowColumnFlex}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>May 20, 2024</Text>
            </View>
          </View>
        </View>

        {/* Payment Breakdown Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailRowPayment}>
            <Text style={styles.detailLabel}>Subtotal</Text>
            <Text style={styles.detailValuePayment}>
              ${subtotal.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRowPayment}>
            <Text style={styles.detailLabel}>Platform Fees</Text>
            <Text style={styles.detailValuePayment}>
              ${platformFees.toFixed(2)}
            </Text>
          </View>
          <View style={styles.detailRowPayment}>
            <Text style={styles.detailLabel}>Tax ({taxRate * 100}%)</Text>
            <Text style={styles.detailValuePayment}>
              ${taxAmount.toFixed(2)}
            </Text>
          </View>
          <View style={styles.paymentSeparator} />
          <View style={styles.detailRowPayment}>
            <Text style={styles.detailLabel}>Total</Text>
            <Text style={styles.totalAmountTextPayment}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Confirm Booking Button (now scrollable) */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmButtonGradient}
          >
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmBooking}
            >
              <View style={styles.confirmButtonTextContainer}>
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </View>
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
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  backButtonContainer: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 150,
  },
  scrollView: {
    flex: 1,
  },
  eventImageContainer: {
    margin: 16,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: 170,
  },
  dateOverlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  dateTextContainer: {
    alignItems: "center",
  },
  dateMonth: {
    fontSize: 12,
    color: "#fff",
  },
  dateDay: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  eventInfoContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  eventTitleContainer: {
    marginBottom: 4,
  },
  eventTitle: {
    overflow: "hidden",
    color: "#BB71E2",
    textOverflow: "ellipsis",
    fontFamily: "Nunito Sans",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "700",
    lineHeight: 24,
  },
  ticketIdContainer: {
    marginBottom: 4,
  },
  ticketId: {
    fontSize: 14,
    color: "#aaa",
  },
  ticketIdSeparator: {
    height: 1,
    backgroundColor: "#7A7A90",
    opacity: 0.4,
    marginHorizontal: 16,
    marginBottom: 18,
  },
  detailCard: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "flex-start",
    rowGap: 12,
    alignSelf: "stretch",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#34344A",
    backgroundColor: "#1A1A1F",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailRowColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
    width: "100%",
  },
  detailRowTwoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 24,
  },
  detailRowColumnFlex: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  detailLabelContainer: {
    flex: 1,
  },
  detailValueContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  detailLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  detailValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  separator: {
    height: 1,
    backgroundColor: "#333",
    marginVertical: 10,
  },
  totalAmountText: {
    fontSize: 16,
    color: "#a95eff",
  },
  buttonContainer: {
    padding: 16,
  },
  confirmButtonGradient: {
    borderRadius: 10,
    overflow: "hidden",
  },
  confirmButton: {
    paddingVertical: 15,
  },
  confirmButtonTextContainer: {
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: 21,
  },
  detailRowPayment: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  detailValuePayment: {
    fontSize: 14,
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
    fontWeight: "400",
  },
  paymentSeparator: {
    height: 1,
    backgroundColor: "#7A7A90",
    opacity: 0.4,
    width: "100%",
    marginVertical: 2,
  },
  totalAmountTextPayment: {
    fontSize: 14,
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
    fontWeight: "700",
  },
});

export default UserDetailBookingScreen;
