import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  Alert,
  Linking,
  Modal,
  Image,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { useSelector } from "react-redux";
import Camera from "../assets/icons/Camera";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { API_BASE_URL } from "../Config/env";
import api from "../Config/api";

const requestPermission = async (permissionType) => {
  console.log(`Requesting ${permissionType} permission`);
  return true; // Placeholder
};

const { width, height } = Dimensions.get("window");

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
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  inputHeight: Math.max(height * 0.055, 40),
  iconSize: Math.max(width * 0.06, 20),
  uploadBoxHeight: Math.min(height * 0.12, 100),
};

const CustomToggle = ({ value, onValueChange }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => onValueChange(!value)}
    style={{
      width: 48,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: "#8D6BFC",
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
      padding: 2,
    }}
  >
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#C6C5ED",
        marginLeft: value ? 18 : 0,
        marginRight: value ? 0 : 18,
      }}
    />
  </TouchableOpacity>
);

const HostTicketSettingScreen = ({ navigation, route }) => {
  const [ticketType, setTicketType] = useState("paid");
  const [eventName, setEventName] = useState("");
  const [location, setLocation] = useState("");
  const [aboutEvent, setAboutEvent] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState("500");
  const [gstType, setGstType] = useState("inclusive");
  const [price, setPrice] = useState("100");
  const [uploadedImageName, setUploadedImageName] = useState("");
  const [ticketStatus, setTicketStatus] = useState({
    Live: false,
    ComingSoon: true,
    SoldOut: false,
  });
  const [isTicketEnabled, setIsTicketEnabled] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(null);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const token = useSelector((state) => state.auth.token) || "";
  const eventId = route.params?.eventId || null;
  const insets = useSafeAreaInsets();


console.log("Event id",eventId);


  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!token || !eventId) return;
      try {
        const url = `${API_BASE_URL}/host/events/get-event/${eventId}`;
        console.log("Fetching event details from:", url);
        const response = await api.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        });
        console.log("API response Get event details", response.data);
        if (response.data.success && response.data.data) {
          const event = response.data.data;
          setEventName(event.eventName || "");
          setLocation(event.location || "");
          setAboutEvent(event.about || "");
          setUploadedImageName(event.posterUrl || "");
          // Ticket settings
          if (event.ticketSetting) {
            setTicketType(event.ticketSetting.ticketType || "paid");
            setTicketQuantity(event.ticketSetting.totalQuantity ? String(event.ticketSetting.totalQuantity) : "");
            setGstType(event.ticketSetting.gstType || "inclusive");
            setPrice(event.ticketSetting.price ? String(event.ticketSetting.price) : "");
            setIsTicketEnabled(event.ticketSetting.isEnabled !== undefined ? event.ticketSetting.isEnabled : true);
            // Dates
            if (event.ticketSetting.salesStart && !isNaN(new Date(event.ticketSetting.salesStart).getTime())) {
              const start = new Date(event.ticketSetting.salesStart);
            setStartDate(start);
            setStartTime(start);
          }
            if (event.ticketSetting.salesEnd && !isNaN(new Date(event.ticketSetting.salesEnd).getTime())) {
              const end = new Date(event.ticketSetting.salesEnd);
            setEndDate(end);
            setEndTime(end);
          }
            // Ticket status
            const status = event.ticketSetting.ticketStatus?.toLowerCase();
          setTicketStatus({
            Live: status === "live",
            ComingSoon: status === "comingsoon" || !status,
            SoldOut: status === "soldout",
          });
          }
        }
      } catch (error) {
        console.log("Error fetching event details", {
          error: error.response?.data || error.message,
        });
        setError(
          error.response?.data?.message ||
            "Failed to fetch event details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [token, eventId]);




  const handleUploadPoster = async () => {
    console.log("Upload poster pressed", {
      timestamp: new Date().toISOString(),
    });
    const options = {
      mediaType: "photo",
      includeBase64: false,
      maxHeight: 232,
      maxWidth: 317,
      quality: 1,
    };

    const cameraPermission = await requestPermission("camera");
    const galleryPermission = await requestPermission("photo");
    if (!cameraPermission || !galleryPermission) {
      console.log("Permissions denied, showing alert");
      Alert.alert("Error", "Please grant camera and photo permissions");
      return;
    }

    Alert.alert(
      "Upload Poster",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: () =>
            launchCamera(options, (response) => {
              if (response.didCancel) {
                console.log("User cancelled camera");
              } else if (response.errorCode) {
                console.log("Camera Error", response.errorMessage);
              } else {
                const uri = response.assets[0].uri;
                const fileName =
                  response.assets[0].fileName || uri.split("/").pop();
                console.log("Photo taken", uri);
                setUploadedImageName(fileName);
              }
            }),
        },
        {
          text: "Choose from Gallery",
          onPress: () =>
            launchImageLibrary(options, (response) => {
              if (response.didCancel) {
                console.log("User cancelled gallery");
              } else if (response.errorCode) {
                console.log("Gallery Error", response.errorMessage);
              } else {
                const uri = response.assets[0].uri;
                const fileName =
                  response.assets[0].fileName || uri.split("/").pop();
                console.log("Photo selected", uri);
                setUploadedImageName(fileName);
              }
            }),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleDateSelect = (dateType, event, selectedDate) => {
    console.log(`Date selected for ${dateType}`, {
      timestamp: new Date().toISOString(),
      selectedDate,
    });
    const date =
      selectedDate ||
      (event?.nativeEvent?.timestamp
        ? new Date(event.nativeEvent.timestamp)
        : null);
    if (date) {
      if (dateType === "Start Date") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
    setShowDatePicker(null);
  };

  const handleTimeSelect = (timeType, event, selectedTime) => {
    console.log(`Time selected for ${timeType}`, {
      timestamp: new Date().toISOString(),
      selectedTime,
    });
    const time =
      selectedTime ||
      (event?.nativeEvent?.timestamp
        ? new Date(event.nativeEvent.timestamp)
        : null);
    if (time) {
      if (timeType === "Start Time") {
        setStartTime(time);
      } else {
        setEndTime(time);
      }
    }
    setShowTimePicker(null);
  };

  const handleGstTypeSelect = () => {
    const newGstType = gstType === "inclusive" ? "exclusive" : "inclusive";
    console.log("Select GST Type pressed", {
      timestamp: new Date().toISOString(),
      gstType: newGstType,
    });
    setGstType(newGstType);
  };

  const getTicketStatusValue = () => {
    return ticketStatus.Live
      ? "live"
      : ticketStatus.ComingSoon
      ? "comingsoon"
      : ticketStatus.SoldOut
      ? "soldout"
      : "comingsoon";
  };

  const handleSaveDetails = async () => {
    console.log("Save Details pressed", {
      ticketType,
      eventName,
      location,
      aboutEvent,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketQuantity,
      gstType,
      price,
      ticketStatus: getTicketStatusValue(),
      isTicketEnabled,
    });

    if (!token) {
      console.log("No token available, showing alert");
      Alert.alert("Error", "Please log in to save ticket settings");
      return;
    }

    if (!eventId) {
      console.log("No eventId provided, showing alert");
      Alert.alert("Error", "Event ID is missing");
      return;
    }

    if (!startDate || !endDate || !startTime || !endTime) {
      console.log("Missing date or time fields, showing alert");
      Alert.alert("Error", "Please select sales start and end dates and times");
      return;
    }

    if (!ticketQuantity || isNaN(parseInt(ticketQuantity, 10))) {
      console.log("Invalid ticket quantity, showing alert");
      Alert.alert("Error", "Please enter a valid ticket quantity");
      return;
    }

    if (ticketType === "paid" && (!price || isNaN(parseFloat(price)))) {
      console.log("Invalid price, showing alert");
      Alert.alert("Error", "Please enter a valid price");
      return;
    }

    const salesStart = new Date(startDate);
    salesStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

    const salesEnd = new Date(endDate);
    salesEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    const payload = {
      ticketType: ticketType.toLowerCase(),
      salesStart: salesStart.toISOString(),
      salesEnd: salesEnd.toISOString(),
      gstType: ticketType === "paid" ? gstType : undefined,
      price: ticketType === "paid" ? parseFloat(price) : 0,
      totalQuantity: parseInt(ticketQuantity, 10),
      ticketStatus: getTicketStatusValue(),
      isEnabled: isTicketEnabled,
    };

    try {
      const url = `${API_BASE_URL}/host/${eventId}/ticket-settings`;
      console.log("API URL:", url);
      const response = await api.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("API response received", response.data);
      if (response.data.success) {
        console.log("Success, showing alert and navigating back");
        Alert.alert("Success", "Ticket settings updated successfully");
        navigation.goBack();
      } else {
        console.log("Failure, showing error alert");
        Alert.alert(
          "Error",
          response.data.message || "Failed to update ticket settings"
        );
      }
    } catch (error) {
      console.log("Error caught", {
        error: error.response?.data || error.message,
      });
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to save ticket settings. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === "ios" ? 20 : Math.max(insets.top + 10, 20),
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets Settings</Text>
        <View style={{ width: dimensions.iconSize }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingBottom: Math.max(insets.bottom + 100, 120),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Paid / Free Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              ticketType === "paid"
                ? styles.toggleButtonActive
                : styles.toggleButtonInactive,
              { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            ]}
            onPress={() => {
              console.log("Ticket Type changed", { ticketType: "paid", timestamp: new Date().toISOString() });
              setTicketType("paid");
            }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                ticketType === "paid"
                  ? ["#B15CDE", "#7952FC"]
                  : ["#181828", "#181828"]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.toggleButtonGradient}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  ticketType === "paid"
                    ? styles.toggleButtonTextActive
                    : styles.toggleButtonTextInactive,
                ]}
              >
                Paid
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              ticketType === "free"
                ? styles.toggleButtonActive
                : styles.toggleButtonInactive,
              { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
            ]}
            onPress={() => {
              console.log("Ticket Type changed", { ticketType: "free", timestamp: new Date().toISOString() });
              setTicketType("free");
            }}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                ticketType === "free"
                  ? ["#B15CDE", "#7952FC"]
                  : ["#181828", "#181828"]
              }
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.toggleButtonGradient}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  ticketType === "free"
                    ? styles.toggleButtonTextActive
                    : styles.toggleButtonTextInactive,
                ]}
              >
                RSVP/Free
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Upload Event Poster */}
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handleUploadPoster}
        >
          <Camera width={25} height={24} style={{ marginBottom: 4 }} />
          <Text style={styles.uploadText}>Upload Event Poster</Text>
        </TouchableOpacity>

        <View style={styles.uploadHintBox}>
          <Text style={styles.uploadHint}>
            The image dimension should be ( 317 × 232 )px
          </Text>
          <Text style={styles.uploadHint}>Max Upload Size( 10mb )</Text>

          {uploadedImageName !== "" && (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            <Text style={styles.uploadHintImage}>
                Selected file: {uploadedImageName.split('/').pop()}
            </Text>
              <TouchableOpacity
                style={{ marginLeft: 8 }}
                onPress={() => setShowPosterModal(true)}
              >
                <Feather name="eye" size={20} color="#a95eff" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Poster Preview Modal */}
        <Modal
          visible={showPosterModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPosterModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ position: 'absolute', top: 60, right: 30, zIndex: 10 }}
              onPress={() => setShowPosterModal(false)}
            >
              <Feather name="x" size={32} color="#fff" />
            </TouchableOpacity>
            <Image
              source={{ uri: uploadedImageName.startsWith('http') ? uploadedImageName : `${API_BASE_URL}/${uploadedImageName.replace(/^\//, '')}` }}
              style={{ width: 320, height: 240, borderRadius: 16, resizeMode: 'contain', backgroundColor: '#222' }}
            />
          </View>
        </Modal>

        {/* Event Name */}
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={eventName}
          onChangeText={(text) => {
            console.log("Event Name changed", { eventName: text, timestamp: new Date().toISOString() });
            setEventName(text);
          }}
          placeholder="Enter event name"
          placeholderTextColor="#d1cfff"
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={(text) => {
            console.log("Location changed", { location: text, timestamp: new Date().toISOString() });
            setLocation(text);
          }}
          placeholder="Enter location"
          placeholderTextColor="#d1cfff"
        />

        {/* About Event */}
        <Text style={styles.label}>About Event</Text>
        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={aboutEvent}
          onChangeText={(text) => {
            console.log("About Event changed", { aboutEvent: text, timestamp: new Date().toISOString() });
            setAboutEvent(text);
          }}
          placeholder="Enter about event"
          placeholderTextColor="#d1cfff"
          multiline={true}
        />

        {/* Sales Start From */}
        <Text style={styles.label}>Sales Start From</Text>
        <View style={styles.datePickerRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker("Start Date")}
          >
            <Text style={styles.datePickerText}>
              {startDate
                ? startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "Start Date"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.datePickerDivider}>-</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker("End Date")}
          >
            <Text style={styles.datePickerText}>
              {endDate
                ? endDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "End Date"}
            </Text>
            <MaterialIcons
              name="calendar-today"
              size={Math.max(dimensions.iconSize * 0.8, 16)}
              color="#a95eff"
              style={styles.datePickerIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={showDatePicker === "Start Date" ? startDate : endDate}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            onChange={(event, selectedDate) =>
              handleDateSelect(showDatePicker, event, selectedDate)
            }
          />
        )}

        {/* Start and End Time */}
        <View style={styles.timePickerRow}>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker("Start Time")}
            >
              <Text style={styles.timePickerText}>
                {startTime
                  ? startTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "HH:mm"}
              </Text>
              <MaterialIcons
                name="access-time"
                size={Math.max(dimensions.iconSize * 0.8, 16)}
                color="#a95eff"
                style={styles.timePickerIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker("End Time")}
            >
              <Text style={styles.timePickerText}>
                {endTime
                  ? endTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "HH:mm"}
              </Text>
              <MaterialIcons
                name="access-time"
                size={Math.max(dimensions.iconSize * 0.8, 16)}
                color="#a95eff"
                style={styles.timePickerIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Pickers */}
        {showTimePicker && (
          <DateTimePicker
            value={
              showTimePicker === "Start Time"
                ? startTime || new Date()
                : endTime || new Date()
            }
            mode="time"
            display={Platform.OS === "ios" ? "inline" : "spinner"}
            onChange={(event, selectedTime) =>
              handleTimeSelect(showTimePicker, event, selectedTime)
            }
          />
        )}

        {/* Ticket Quantity (only if Paid or Free) */}
        {(ticketType === "paid" || ticketType === "free") && (
          <View>
            <Text style={styles.label}>Ticket Quantity</Text>
            <TextInput
              style={styles.input}
              value={ticketQuantity}
              onChangeText={(text) => {
                console.log("Ticket Quantity changed", { ticketQuantity: text, timestamp: new Date().toISOString() });
                // Only allow numeric input
                if (/^\d*$/.test(text)) {
                  setTicketQuantity(text);
                }
              }}
              placeholder="Enter quantity"
              placeholderTextColor="#d1cfff"
              keyboardType="number-pad"
            />
          </View>
        )}

        {/* GST Type (only if Paid) */}
        {ticketType === "paid" && (
          <View>
            <Text style={styles.label}>GST Type</Text>
            <TouchableOpacity
              style={styles.gstTypeButtonRow}
              onPress={handleGstTypeSelect}
            >
              <Text
                style={[
                  styles.inputText,
                  { color: gstType === "inclusive" ? "#a95eff" : "#d1cfff" },
                ]}
              >
                {gstType.charAt(0).toUpperCase() + gstType.slice(1)}
              </Text>
              <Feather
                name="chevron-down"
                size={Math.max(dimensions.iconSize * 0.8, 16)}
                color="#a95eff"
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Price (only if Paid) */}
        {ticketType === "paid" && (
          <View>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => {
                console.log("Price changed", { price: text, timestamp: new Date().toISOString() });
                // Only allow decimal numbers
                if (/^\d*\.?\d*$/.test(text)) {
                  setPrice(text);
                }
              }}
              placeholder="100"
              placeholderTextColor="#d1cfff"
              keyboardType="decimal-pad"
            />
          </View>
        )}

        {/* Ticket Status (only if Paid) */}
        {ticketType === "paid" && (
          <View>
            <Text style={styles.label}>Ticket Status</Text>
            <View style={styles.ticketStatusContainer}>
              <TouchableOpacity
                style={[
                  styles.ticketStatusButton,
                  ticketStatus.Live && styles.ticketStatusButtonActive,
                ]}
                onPress={() => {
                  console.log("Ticket Status changed", { ticketStatus: "live", timestamp: new Date().toISOString() });
                  setTicketStatus({
                    Live: true,
                    ComingSoon: false,
                    SoldOut: false,
                  });
                }}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    ticketStatus.Live && styles.customCheckboxChecked,
                  ]}
                >
                  {ticketStatus.Live && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.ticketStatusText,
                    ticketStatus.Live && styles.ticketStatusTextActive,
                  ]}
                >
                  Live
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ticketStatusButton,
                  ticketStatus.ComingSoon && styles.ticketStatusButtonActive,
                ]}
                onPress={() => {
                  console.log("Ticket Status changed", { ticketStatus: "comingsoon", timestamp: new Date().toISOString() });
                  setTicketStatus({
                    Live: false,
                    ComingSoon: true,
                    SoldOut: false,
                  });
                }}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    ticketStatus.ComingSoon && styles.customCheckboxChecked,
                  ]}
                >
                  {ticketStatus.ComingSoon && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.ticketStatusText,
                    ticketStatus.ComingSoon && styles.ticketStatusTextActive,
                  ]}
                >
                  Coming Soon
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ticketStatusButton,
                  ticketStatus.SoldOut && styles.ticketStatusButtonActive,
                ]}
                onPress={() => {
                  console.log("Ticket Status changed", { ticketStatus: "soldout", timestamp: new Date().toISOString() });
                  setTicketStatus({
                    Live: false,
                    ComingSoon: false,
                    SoldOut: true,
                  });
                }}
              >
                <View
                  style={[
                    styles.customCheckbox,
                    ticketStatus.SoldOut && styles.customCheckboxChecked,
                  ]}
                >
                  {ticketStatus.SoldOut && (
                    <Feather name="check" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    styles.ticketStatusText,
                    ticketStatus.SoldOut && styles.ticketStatusTextActive,
                  ]}
                >
                  Sold Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Enable Ticket (only if Paid or Free) */}
        {(ticketType === "paid" || ticketType === "free") && (
          <View style={styles.enableTicketContainer}>
            <Text style={styles.label}>{isTicketEnabled ? 'Disable Ticket' : 'Enable Ticket'}</Text>
            <CustomToggle
              value={isTicketEnabled}
              onValueChange={(value) => {
                console.log("Enable Ticket changed", { isTicketEnabled: value, timestamp: new Date().toISOString() });
                setIsTicketEnabled(value);
              }}
            />
          </View>
        )}

        {/* Save Details Button */}
        {(ticketType === "paid" || ticketType === "free") && (
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveDetailsButton}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleSaveDetails}
            >
              <Text style={styles.saveDetailsButtonText}>Save Details</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: "#2d2d3a",
    minHeight: Math.max(dimensions.buttonHeight * 1.2, 60),
  },
  backButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    minWidth: dimensions.iconSize + 8,
    minHeight: dimensions.iconSize + 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 150,
  },
  scrollViewContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.xl,
  },
  toggleContainer: {
    flexDirection: "row",
    width: "100%",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: dimensions.spacing.xl,
    backgroundColor: "transparent",
    borderWidth: 0,
    alignSelf: "center",
  },
  toggleButton: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    alignSelf: "stretch",
    flexDirection: "row",
    gap: 10,
    margin: 0,
    padding: 0,
  },
  toggleButtonActive: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleButtonInactive: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleButtonGradient: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Nunito Sans",
    textAlign: "center",
    letterSpacing: 0.1,
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
  toggleButtonTextInactive: {
    color: "#C6C5ED",
  },
  uploadContainer: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    alignSelf: "stretch",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C6C5ED",
    backgroundColor: "rgba(255,255,255,0.01)",
  },
  uploadText: {
    color: "#C6C5ED",
    textAlign: "center",
    fontFamily: "Poppins",
    fontSize: 16,
    fontStyle: "normal",
    fontWeight: "300",
    lineHeight: undefined,
    letterSpacing: -0.333,
    marginTop: dimensions.spacing.sm,
    paddingBottom: 10,
  },
  uploadHint: {
    color: "#7A7A90",
    fontFamily: "Nunito Sans",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 18,
    marginTop: dimensions.spacing.xs,
    textAlign: "center",
  },
  uploadHintImage: {
    color: "#B15CDE",
    fontFamily: "Nunito Sans",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 18,
    marginTop: dimensions.spacing.xs,
    textAlign: "center",
  },
  label: {
    fontSize: dimensions.fontSize.body,
    color: "#d1cfff",
    marginBottom: dimensions.spacing.sm,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#121212",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 48,
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#24242D",
    fontSize: dimensions.fontSize.title,
    color: "#d1cfff",
    marginBottom: dimensions.spacing.xl,
    textAlignVertical: "center",
  },
  aboutInput: {
    backgroundColor: "#121212",
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 12,
    alignSelf: "stretch",
    borderWidth: 1,
    borderColor: "#24242D",
    fontSize: dimensions.fontSize.title,
    color: "#d1cfff",
    marginBottom: dimensions.spacing.xl,
    textAlignVertical: "top",
    minHeight: 100, // Added for better multiline UX
  },
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 48,
    alignSelf: "stretch",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8D6BFC",
    backgroundColor: "#121212",
    marginBottom: dimensions.spacing.xl,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: "100%",
    minHeight: undefined,
    marginRight: 0,
  },
  datePickerText: {
    fontSize: dimensions.fontSize.title,
    color: "#d1cfff",
  },
  datePickerDivider: {
    fontSize: Math.max(dimensions.fontSize.header, 24),
    color: "#b3b3cc",
    marginHorizontal: dimensions.spacing.xs,
  },
  datePickerIcon: {
    marginLeft: dimensions.spacing.sm,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: dimensions.spacing.xl,
  },
  timePickerColumn: {
    flex: 1,
    marginRight: dimensions.spacing.md,
  },
  timePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 48,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    alignSelf: "stretch",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#24242D",
    backgroundColor: "#121212",
  },
  timePickerText: {
    fontSize: dimensions.fontSize.title,
    color: "#d1cfff",
  },
  timePickerIcon: {
    marginLeft: dimensions.spacing.sm,
  },
  dropdownIcon: {
    marginLeft: "auto",
  },
  inputText: {
    fontSize: dimensions.fontSize.title,
    flex: 1,
    textAlign: "left",
    marginRight: 0,
    marginTop: 0,
  },
  ticketStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2d2d3a",
    backgroundColor: "transparent",
    padding: 16,
    marginBottom: dimensions.spacing.xl,
  },
  ticketStatusButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    minHeight: 32,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7952FC",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: "#7952FC",
    borderColor: "#7952FC",
  },
  ticketStatusText: {
    fontSize: dimensions.fontSize.body,
    color: "#7A7A90",
    fontWeight: "400",
  },
  ticketStatusTextActive: {
    color: "#a95eff",
    fontWeight: "bold",
  },
  enableTicketContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 40),
  },
  saveDetailsButton: {
    borderRadius: 16,
    minHeight: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  saveDetailsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  uploadHintBox: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  gstTypeButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#8D6BFC",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#121212",
    height: 48,
    paddingHorizontal: 16,
    alignSelf: "stretch",
    marginBottom: dimensions.spacing.xl,
  },
});

export default HostTicketSettingScreen;