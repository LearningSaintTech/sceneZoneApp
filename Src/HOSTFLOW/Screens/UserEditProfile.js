import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUserData,
  loginUser,
} from "../Redux/slices/authSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SignUpBackground from "../assets/Banners/SignUp";
import api from "../Config/api";
import * as ImagePicker from "react-native-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

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
  profileImageSize: Math.max(width * 0.25, 100),
};

const UserEditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const insets = useSafeAreaInsets();

  console.log("[UserEditProfileScreen] Component mounted", { token, userData });

  useEffect(() => {
    console.log("[UserEditProfileScreen] useEffect triggered with userData:", userData);
    if (!token) {
      console.log("[UserEditProfileScreen] No token, redirecting to UserSignin");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Session expired. Please log in again.",
      });
      navigation.navigate("UserSignin");
      return;
    }
    setFullName(userData?.fullName || userData?.name || "");
    setEmail(userData?.email || "");
    setLocation(userData?.address || userData?.location || "");
    const phoneNum = userData?.mobileNumber ? String(userData.mobileNumber).replace(/^\+91/, "") : "";
    console.log("[UserEditProfileScreen] Setting phoneNumber:", phoneNum);
    setPhoneNumber(phoneNum);
    if (userData?.dob || userData?.dateOfBirth) {
      const dob = userData.dob || userData.dateOfBirth;
      setDateOfBirth(formatDate(new Date(dob)));
      setSelectedDate(new Date(dob));
    }
    if (userData?.profileImageUrl) {
      console.log("[UserEditProfileScreen] Setting profileImage:", userData.profileImageUrl);
      setProfileImage({ uri: userData.profileImageUrl });
    }
    fetchProfileData();
  }, [token, userData]);

  const fetchProfileData = async () => {
    console.log("[UserEditProfileScreen] Fetching profile data with token:", token);
    try {
      setLoading(true);
      const response = await api.get("/user/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("[UserEditProfileScreen] Fetch profile response:", response.data);

      if (response?.data?.success) {
        const data = response.data.data;
        console.log("[UserEditProfileScreen] Updating state with fetched data:", data);
        setFullName(data.fullName || data.name || "");
        setEmail(data.email || "");
        setLocation(data.address || data.location || "");
        setPhoneNumber(data.mobileNumber ? String(data.mobileNumber).replace(/^\+91/, "") : "");
        if (data.dob) {
          setDateOfBirth(formatDate(new Date(data.dob)));
          setSelectedDate(new Date(data.dob));
        }
        setProfileImage(data.profileImageUrl ? { uri: data.profileImageUrl } : null);
      } else {
        console.log("[UserEditProfileScreen] Fetch profile failed:", response.data.message);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: response.data.message || "Failed to fetch profile data",
        });
      }
    } catch (error) {
      console.error("[UserEditProfileScreen] Error fetching profile:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to fetch profile data",
      });
    } finally {
      setLoading(false);
      console.log("[UserEditProfileScreen] Fetch profile completed, loading:", false);
    }
  };

  const validateImage = (image) => {
    console.log("[UserEditProfileScreen] Validating image:", image);
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!image?.uri) {
      console.log("[UserEditProfileScreen] Image validation failed: No URI");
      Toast.show({ type: "error", text1: "Error", text2: "Invalid image selected" });
      return false;
    }
    if (image.fileSize && image.fileSize > maxSize) {
      console.log("[UserEditProfileScreen] Image validation failed: Size exceeds 5MB", image.fileSize);
      Toast.show({ type: "error", text1: "Error", text2: "Image size must be less than 5MB" });
      return false;
    }
    if (!image.type || !["image/jpeg", "image/png"].includes(image.type)) {
      console.log("[UserEditProfileScreen] Image validation failed: Invalid type", image.type);
      Toast.show({ type: "error", text1: "Error", text2: "Only JPEG and PNG images are supported" });
      return false;
    }
    console.log("[UserEditProfileScreen] Image validation passed");
    return true;
  };

  const handleImagePicker = () => {
    console.log("[UserEditProfileScreen] Opening image picker");
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      },
      (response) => {
        console.log("[UserEditProfileScreen] Image picker response:", response);
        if (response.didCancel) {
          console.log("[UserEditProfileScreen] Image picker cancelled");
          return;
        }
        if (response.errorCode) {
          console.log("[UserEditProfileScreen] Image picker error:", response.errorCode, response.errorMessage);
          Toast.show({
            type: "error",
            text1: "Error",
            text2: response.errorMessage || "Failed to select image",
          });
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const selectedImage = response.assets[0];
          if (validateImage(selectedImage)) {
            console.log("[UserEditProfileScreen] Setting profileImage:", selectedImage.uri);
            setProfileImage(selectedImage);
          }
        }
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const serverFormatDate = (date) => {
    if (!date) return '';
    // Accepts DD-MM-YYYY or Date object
    if (typeof date === 'string' && date.includes('-')) {
    const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    } else if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return '';
  };

  const handleDateChange = (event, date) => {
    console.log("[UserEditProfileScreen] Date picker change:", { event, date });
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
      setDateOfBirth(formatDate(date));
    }
  };

  const validateInputs = () => {
    console.log("[UserEditProfileScreen] Validating inputs:", { fullName, email, phoneNumber, location, dateOfBirth });
    if (!fullName.trim()) {
      console.log("[UserEditProfileScreen] Validation failed: Full name missing");
      Toast.show({ type: "error", text1: "Error", text2: "Full name is required" });
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log("[UserEditProfileScreen] Validation failed: Invalid email");
      Toast.show({ type: "error", text1: "Error", text2: "Please enter a valid email address" });
      return false;
    }
    // Accept either 10 digits or +91XXXXXXXXXX
    let cleanPhoneNumber = phoneNumber.replace(/\s/g, "");
    if (cleanPhoneNumber.startsWith('+91')) {
      cleanPhoneNumber = cleanPhoneNumber.replace(/^\+91/, '');
    }
    if (!/^\d{10}$/.test(cleanPhoneNumber)) {
      console.log("[UserEditProfileScreen] Validation failed: Invalid phone number", phoneNumber);
      Toast.show({ type: "error", text1: "Error", text2: "Please enter a valid 10-digit phone number" });
      return false;
    }
    const fullPhoneNumber = `+91${cleanPhoneNumber}`;
    if (!/^\+91\d{10}$/.test(fullPhoneNumber)) {
      console.log("[UserEditProfileScreen] Validation failed: Phone number is not in +91XXXXXXXXXX format", fullPhoneNumber);
      Toast.show({ type: "error", text1: "Error", text2: "Phone number must be in +91XXXXXXXXXX format" });
      return false;
    }
    if (!location.trim()) {
      console.log("[UserEditProfileScreen] Validation failed: Location missing");
      Toast.show({ type: "error", text1: "Error", text2: "Location is required" });
      return false;
    }
    if (dateOfBirth && !/^\d{2}-\d{2}-\d{4}$/.test(dateOfBirth)) {
      console.log("[UserEditProfileScreen] Validation failed: Invalid date of birth", dateOfBirth);
      Toast.show({ type: "error", text1: "Error", text2: "Please select a valid date of birth" });
      return false;
    }
    console.log("[UserEditProfileScreen] Input validation passed");
    return true;
  };

  const handleSaveChanges = async () => {
    console.log("[UserEditProfileScreen] Handling save changes");
    if (!validateInputs()) return;

    if (!token) {
      console.log("[UserEditProfileScreen] No token, redirecting to UserSignin");
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Authentication token is missing. Please log in again.",
      });
      navigation.navigate("UserSignin");
      return;
    }

    setLoading(true);
    console.log("[UserEditProfileScreen] Starting API request, loading:", true);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("email", email.trim());
      formData.append("address", location.trim());
      // Accept either 10 digits or +91XXXXXXXXXX
      let cleanPhoneNumber = phoneNumber.replace(/\s/g, "");
      if (cleanPhoneNumber.startsWith('+91')) {
        cleanPhoneNumber = cleanPhoneNumber.replace(/^\+91/, '');
      }
      formData.append("mobileNumber", `+91${cleanPhoneNumber}`);
      if (dateOfBirth) {
        formData.append("dob", serverFormatDate(dateOfBirth));
      }
      console.log("[UserEditProfileScreen] FormData prepared:", {
        fullName: fullName.trim(),
        email: email.trim(),
        address: location.trim(),
        mobileNumber: `+91${cleanPhoneNumber}`,
        dob: dateOfBirth ? serverFormatDate(dateOfBirth) : undefined,
      });

      if (profileImage && profileImage.uri && !profileImage.uri.startsWith("http")) {
        if (!validateImage(profileImage)) {
          console.log("[UserEditProfileScreen] Image validation failed in formData");
          setLoading(false);
          return;
        }
        console.log("[UserEditProfileScreen] Adding profileImage to formData:", profileImage.uri);
        formData.append("profileImageUrl", {
          uri: Platform.OS === "ios" ? profileImage.uri.replace("file://", "") : profileImage.uri,
          type: profileImage.type || "image/jpeg",
          name: profileImage.fileName || `profile_${Date.now()}.jpg`,
        });
      }

      const response = await api.patch("/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("[UserEditProfileScreen] API response:", response.data);

      if (response.data.success) {
        const profileData = response.data.data;
        console.log("[UserEditProfileScreen] Dispatching loginUser with:", profileData);
        dispatch(
          loginUser({
            id: userData?.id || profileData?._id,
            fullName: profileData.fullName || fullName,
            mobileNumber: profileData.mobileNumber || `+91${phoneNumber}`,
            email: profileData.email || email,
            address: profileData.address || location,
            dob: profileData.dob || dateOfBirth,
            profileImageUrl: profileData.profileImageUrl || (profileImage ? profileImage.uri : null),
            token,
          })
        );

        Toast.show({
          type: "success",
          text1: "Success",
          text2: response.data.message || "Profile updated successfully!",
          position: "top",
          visibilityTime: 4000,
          topOffset: 60,
        });

        console.log("[UserEditProfileScreen] Navigating to UserProfileScreen");
        navigation.navigate("UserProfileScreen");
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("[UserEditProfileScreen] Error updating profile:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      let errorMessage = error.response?.data?.message || error.message || "Something went wrong.";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
        console.log("[UserEditProfileScreen] 401 error, redirecting to UserSignin");
        navigation.navigate("UserSignin");
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || "Invalid data provided. Please check your inputs.";
      } else if (error.response?.status === 413) {
        errorMessage = "Image size too large. Please choose a smaller image.";
      }
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
    } finally {
      setLoading(false);
      console.log("[UserEditProfileScreen] Update completed, loading:", false);
    }
  };

  if (loading && !fullName) {
    console.log("[UserEditProfileScreen] Rendering loading state");
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#a95eff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { paddingTop: Math.max(insets.top + 10, 20) }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={dimensions.iconSize} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: dimensions.iconSize }} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: Math.max(insets.bottom + 120, 140) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.profileImageContainer, { marginTop: dimensions.spacing.xl }]}>
            <Image
              source={profileImage ? { uri: profileImage.uri } : require("../assets/Images/frame1.png")}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
              <MaterialIcons name="camera-alt" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full name</Text>
            <TextInput
              style={[styles.input, focusedInput === "fullName" ? styles.inputFocused : styles.inputUnfocused]}
              value={fullName}
              onChangeText={(text) => {
                console.log("[UserEditProfileScreen] Full name changed:", text);
                setFullName(text);
              }}
              placeholder="Full Name"
              placeholderTextColor="#888"
              onFocus={() => setFocusedInput("fullName")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, focusedInput === "email" ? styles.inputFocused : styles.inputUnfocused]}
              value={email}
              onChangeText={(text) => {
                console.log("[UserEditProfileScreen] Email changed:", text);
                setEmail(text);
              }}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedInput("email")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={[styles.input, focusedInput === "location" ? styles.inputFocused : styles.inputUnfocused]}
              value={location}
              onChangeText={(text) => {
                console.log("[UserEditProfileScreen] Location changed:", text);
                setLocation(text);
              }}
              placeholder="Location"
              placeholderTextColor="#888"
              onFocus={() => setFocusedInput("location")}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <View
              style={[
                styles.phoneInputContainer,
                focusedInput === "phoneNumber" ? styles.phoneInputContainerFocused : styles.phoneInputContainerUnfocused,
              ]}
            >
              <View style={styles.countryCodePicker}>
                <Text style={styles.countryCodeText}>+91</Text>
                <MaterialIcons name="keyboard-arrow-down" size={dimensions.iconSize} color="#fff" />
              </View>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={(text) => {
                  console.log("[UserEditProfileScreen] Phone number changed:", text);
                  setPhoneNumber(text);
                }}
                placeholder="Phone Number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                onFocus={() => setFocusedInput("phoneNumber")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={[styles.input, focusedInput === "dob" ? styles.inputFocused : styles.inputUnfocused]}
              onPress={() => {
                console.log("[UserEditProfileScreen] Opening date picker");
                setFocusedInput("dob");
                setShowDatePicker(true);
              }}
            >
              <Text style={[styles.dateText, dateOfBirth ? { color: "#fff" } : { color: "#888" }]}>
                {dateOfBirth || "DD-MM-YYYY"}
              </Text>
              <View style={styles.iconWrapper}>
                <Ionicons name="calendar-outline" size={dimensions.iconSize} color="#888" />
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor="#fff"
              />
            )}
            {Platform.OS === "ios" && showDatePicker && (
              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("[UserEditProfileScreen] Date picker cancelled");
                    setShowDatePicker(false);
                    setFocusedInput(null);
                  }}
                >
                  <Text style={styles.datePickerButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log("[UserEditProfileScreen] Date picker confirmed");
                    setDateOfBirth(formatDate(selectedDate));
                    setShowDatePicker(false);
                    setFocusedInput(null);
                  }}
                >
                  <Text style={styles.datePickerButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.saveButton, { marginBottom: Math.max(insets.bottom + 20, 30) }]}
          activeOpacity={0.85}
          onPress={handleSaveChanges}
          disabled={loading}
        >
          <LinearGradient
            colors={["#B15CDE", "#7952FC"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={{
              flex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 14,
              flexDirection: "row",
              gap: 10,
            }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
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
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: 393,
    alignSelf: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#121212",
    borderBottomWidth: 1,
    borderBottomColor: "#C6C5ED",
    shadowColor: "rgba(104, 59, 252, 0.05)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
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
    marginLeft: 16,
    flex: 1,
    textAlign: "center",
    marginRight: 170,
  },
  scrollViewContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.xl,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: dimensions.spacing.xxl,
    justifyContent: "center",
    position: "relative",
  },
  profileImage: {
    width: dimensions.profileImageSize,
    height: dimensions.profileImageSize,
    borderRadius: dimensions.profileImageSize / 2,
    backgroundColor: "#ddd",
  },
  cameraIconContainer: {
    marginRight: 110,
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#B15CDE",
    borderRadius: 32,
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    zIndex: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: dimensions.spacing.xl,
  },
  inputLabel: {
    color: "#7A7A90",
    fontFamily: "Nunito Sans",
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 18,
    marginBottom: dimensions.spacing.sm,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: "#121212",
    color: "#fff",
    fontSize: dimensions.fontSize.title,
    flexDirection: "row",
    alignItems: "center",
  },
  inputFocused: {
    borderColor: "#8D6BFC",
  },
  inputUnfocused: {
    borderColor: "#24242D",
  },
  phoneInputContainer: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: dimensions.borderRadius.md,
    alignItems: "center",
    minHeight: dimensions.inputHeight,
    borderWidth: 1,
  },
  phoneInputContainerFocused: {
    borderColor: "#8D6BFC",
  },
  phoneInputContainerUnfocused: {
    borderColor: "#24242D",
  },
  countryCodePicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dimensions.spacing.lg,
    borderRightWidth: 1,
    borderColor: "#333",
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    minHeight: dimensions.inputHeight,
    justifyContent: "center",
  },
  countryCodeText: {
    color: "#fff",
    marginRight: dimensions.spacing.xs,
    fontSize: dimensions.fontSize.title,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    paddingHorizontal: dimensions.spacing.lg,
    fontSize: dimensions.fontSize.title,
    minHeight: dimensions.inputHeight,
  },
  dateText: {
    flex: 1,
    fontSize: dimensions.fontSize.title,
  },
  iconWrapper: {
    marginRight: 12,
    width: 30,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
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
  saveButton: {
    width: "90%",
    maxWidth: 361,
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: dimensions.spacing.xl,
  },
  saveButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 21,
  },
});

export default UserEditProfileScreen;