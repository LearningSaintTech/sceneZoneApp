import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  selectToken,
  selectFullName,
  selectMobileNumber,
  selectUserEmail,
  selectUserData,
} from "../Redux/slices/authSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignUpBackground from "../assets/Banners/SignUp";
import api from "../Config/api";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const { width, height } = Dimensions.get("window");

const UserCreateProfileScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  console.log("User Data create profile xxx:", userData);
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (userData?.fullName || userData?.mobileNumber) {
      setIsEditing(true);
    }
    setFullName(userData?.fullName || userData?.name || "");
    setPhoneNumber(userData?.mobileNumber ? String(userData.mobileNumber) : "");
    setEmail(userData?.email || "");
    setLocation(userData?.location || "");
    if (userData?.dateOfBirth) {
      setDateOfBirth(userData.dateOfBirth);
      // Parse existing DOB (assuming DD-MM-YYYY) to set initial date for picker
      const [day, month, year] = userData.dateOfBirth.split("-").map(Number);
      if (day && month && year) {
        setSelectedDate(new Date(year, month - 1, day));
      }
    }
    if (userData?.profileImageUrl) {
      setProfileImage({ uri: userData.profileImageUrl });
    }
  }, [userData]);

  const validateImage = (image) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!image.uri) {
      Alert.alert("Error", "Invalid image selected");
      return false;
    }
    if (image.fileSize && image.fileSize > maxSize) {
      Alert.alert("Error", "Image size must be less than 5MB");
      return false;
    }
    if (!image.type || !["image/jpeg", "image/png"].includes(image.type)) {
      Alert.alert("Error", "Only JPEG and PNG images are supported");
      return false;
    }
    return true;
  };

  const handleImagePicker = () => {
    Alert.alert("Choose Image Source", "Select image from", [
      {
        text: "Camera",
        onPress: () =>
          ImagePicker.launchCamera(
            { mediaType: "photo", quality: 0.8, includeBase64: false },
            handleImageResponse
          ),
      },
      {
        text: "Gallery",
        onPress: () =>
          ImagePicker.launchImageLibrary(
            { mediaType: "photo", quality: 0.8, includeBase64: false },
            handleImageResponse
          ),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log("Image picker cancelled");
      return;
    }
    if (response.errorCode) {
      console.error("Image picker error:", response.errorMessage);
      Alert.alert("Error", response.errorMessage || "Failed to select image");
      return;
    }
    const selectedImage = response.assets?.[0];
    console.log("Selected image:", selectedImage);
    if (selectedImage && validateImage(selectedImage)) {
      setProfileImage(selectedImage);
    }
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const serverFormatDate = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`; // Convert DD-MM-YYYY to YYYY-MM-DD
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setDateOfBirth(formatDate(date));
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleContinue = async () => {
    if (!fullName || !dateOfBirth || !phoneNumber || !email || !location) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return;
    }

    // Validate date format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      Alert.alert("Error", "Please select a valid date of birth");
      return;
    }

    if (!token) {
      Alert.alert(
        "Error",
        "Authentication token is missing. Please log in again."
      );
      navigation.navigate("UserSignin");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("dob", serverFormatDate(dateOfBirth)); // Send YYYY-MM-DD to backend
      formData.append("email", email);
      formData.append("address", location);

      if (
        profileImage &&
        profileImage.uri &&
        !profileImage.uri.startsWith("http")
      ) {
        if (!validateImage(profileImage)) {
          setLoading(false);
          return;
        }
        formData.append("profileImageUrl", {
          uri:
            Platform.OS === "ios"
              ? profileImage.uri.replace("file://", "")
              : profileImage.uri,
          type: profileImage.type || "image/jpeg",
          name: profileImage.fileName || `profile_${Date.now()}.jpg`,
        });
      }

      const endpoint = "/user/create-profile";
      const response = await api.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response create profile:", response.data);
      if (response.data && response.data.data) {
        const profileData = response.data.data;

        dispatch(
          loginUser({
            fullName: profileData.fullName,
            mobileNumber: profileData.mobileNumber,
            email: profileData.email,
            location: profileData.address,
            dob: profileData.dob,
            profileImageUrl: profileData.profileImageUrl,
            token,
          })
        );

      
        navigation.reset({
          index: 0,
          routes: [{ name: "UserHome", params: { isLoggedIn: true } }],
        });
      }

      if (response.data.success) {
        Alert.alert(
          "Success",
          response.data.message ||
            `Profile ${isEditing ? "updated" : "created"} successfully!`
        );
        navigation.reset({
          index: 0,
          routes: [{ name: "UserHome", params: { isLoggedIn: true } }],
        });
      } else {
        throw new Error(
          response.data.message ||
            `Failed to ${isEditing ? "update" : "create"} profile`
        );
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      let errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong.";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        navigation.navigate("UserSignin");
      } else if (error.response?.status === 400) {
        errorMessage =
          error.response?.data?.message ||
          "Invalid data provided. Please check your inputs.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SignUpBackground
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <View style={[styles.overlay, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Profile</Text>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.profileImageContainer}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage.uri }
                    : require("../assets/Images/frame1.png")
                }
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.cameraIconContainer}
                onPress={handleImagePicker}
              >
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Full name</Text>
            <View style={styles.fullNameInputContainer}>
              <TextInput
                style={styles.fullNameInput}
                placeholder="Franklin Clinton"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={showDatePickerModal}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#aaa" />
              </View>
              <Text
                style={[
                  styles.dateText,
                  dateOfBirth ? { color: "#fff" } : { color: "#aaa" },
                ]}
              >
                {dateOfBirth || "DD-MM-YYYY"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={handleDateChange}
                maximumDate={new Date()} // Prevent future dates
                textColor="#fff"
              />
            )}
            {Platform.OS === "ios" && showDatePicker && (
              <View style={styles.datePickerButtons}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.datePickerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDateOfBirth(formatDate(selectedDate));
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={styles.datePickerButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.label}>Phone number</Text>
            <View style={styles.input}>
              <View style={styles.iconWrapper}>
                <Ionicons name="call-outline" size={20} color="#aaa" />
              </View>
              <TextInput
                placeholder="1234567890"
                placeholderTextColor="#aaa"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={{ flex: 1, color: "#fff", fontSize: 16 }}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.input}>
              <View style={styles.iconWrapper}>
                <Ionicons name="mail-outline" size={20} color="#aaa" />
              </View>
              <TextInput
                placeholder="scenezone@gmail.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ flex: 1, color: "#fff", fontSize: 16 }}
              />
            </View>

            <Text style={styles.label}>Location</Text>
            <View style={styles.input}>
              <View style={styles.iconWrapper}>
                <Ionicons name="location-outline" size={20} color="#aaa" />
              </View>
              <TextInput
                placeholder="City, Country"
                placeholderTextColor="#aaa"
                value={location}
                onChangeText={setLocation}
                style={{ flex: 1, color: "#fff", fontSize: 16 }}
              />
            </View>
          </ScrollView>
          <View
            style={[
              styles.buttonContainer,
              { paddingBottom: insets.bottom + 16 },
            ]}
          >
            <TouchableOpacity onPress={handleContinue} disabled={loading}>
              <LinearGradient
                colors={["#B15CDE", "#7952FC"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={styles.continueButton}
              >
                <Text style={styles.continueButtonText}>
                  {loading
                    ? "Processing..."
                    : isEditing
                    ? "Update"
                    : "Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100,
  },
  buttonContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#333",
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#a95eff",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#000",
    marginRight: 120,
  },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#24242D",
    backgroundColor: "#121212",
  },
  dateText: {
    flex: 1,
    fontSize: 16,
  },
  iconWrapper: {
    marginRight: 12,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  continueButtonText: {
    color: "#FFF",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
    textAlign: "center",
  },
  fullNameInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8D6BFC",
    backgroundColor: "#121212",
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: "center",
  },
  fullNameInput: {
    color: "#fff",
    fontSize: 16,
    flex: 1,
  },
  datePickerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#121212",
  },
  datePickerButtonText: {
    color: "#a95eff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default UserCreateProfileScreen;
