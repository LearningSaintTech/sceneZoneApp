

//  code by sonu :::




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
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  selectToken,
  selectUserData,
  loginUser,
} from "../Redux/slices/authSlice";
import api from "../Config/api";
import * as ImagePicker from "react-native-image-picker";
import SignUpBackground from "../assets/Banners/SignUp";

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
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState('fullName');
  const insets = useSafeAreaInsets();

  console.log("UserEditProfileScreen mounted", userData);

  useEffect(() => {
    if (!token) {
      Alert.alert("Error", "Session expired. Please log in again.");
      navigation.navigate("UserSignin");
      return;
    }
    setFullName(userData?.fullName || userData?.name || "");
    setEmail(userData?.email || "");
    setLocation(userData?.address || userData?.location || "");
    setPhoneNumber(userData?.mobileNumber ? String(userData.mobileNumber) : "");
    setProfileImage(
      userData?.profileImageUrl ? { uri: userData.profileImageUrl } : null
    );
    fetchProfileData();
  }, [token]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.success) {
        const data = response?.data?.data;
        setFullName(data.fullName || data.name || "");
        setEmail(data.email || "");
        setLocation(data.address || data.location || "");
        setPhoneNumber(data.mobileNumber ? String(data.mobileNumber) : "");
        setProfileImage(
          data?.profileImageUrl ? { uri: data.profileImageUrl } : null
        );
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch profile data"
        );
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to fetch profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  const validateInputs = () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Full name is required");
      return false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }
    if (phoneNumber && !/^\d{10}$/.test(phoneNumber)) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const validateImage = (image) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.fileSize > maxSize) {
      Alert.alert("Error", "Image size must be less than 5MB");
      return false;
    }
    if (!["image/jpeg", "image/png"].includes(image.type)) {
      Alert.alert("Error", "Only JPEG and PNG images are supported");
      return false;
    }
    return true;
  };

  const handleImagePicker = () => {
    Alert.alert("Choose Image Source", "Select image from", [
      { text: "Camera", onPress: launchCamera },
      { text: "Gallery", onPress: launchGallery },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const launchCamera = () => {
    ImagePicker.launchCamera(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false, // Removed includeBase64 to reduce memory usage
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            "Error",
            response.errorMessage || "Failed to capture image"
          );
          return;
        }
        if (validateImage(response.assets[0])) {
          setProfileImage(response.assets[0]);
        }
      }
    );
  };

  const launchGallery = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false, // Removed includeBase64 to reduce memory usage
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert(
            "Error",
            response.errorMessage || "Failed to select image"
          );
          return;
        }
        if (validateImage(response.assets[0])) {
          setProfileImage(response.assets[0]);
        }
      }
    );
  };

  const handleSaveChanges = async () => {
    if (!validateInputs()) return;

    // Store previous data outside try block
    const previousData = {
      fullName,
      email,
      location,
      phoneNumber,
      profileImage,
    };

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("address", location);
      formData.append("mobileNumber", phoneNumber);

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
          uri: profileImage.uri,
          type: profileImage.type || "image/jpeg",
          name: profileImage.fileName || "profile.jpg",
        });
      }

      const response = await api.patch("/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        dispatch(
          loginUser({
            id: userData?.id || response.data.data?._id,
            name: fullName,
            fullName: fullName,
            email: email,
            phone: phoneNumber,
            mobileNumber: phoneNumber,
            address: location,
            role: userData?.role,
            profileImageUrl:
              response.data.data?.profileImageUrl || userData?.profileImageUrl,
            token: token,
          })
        );

        Alert.alert("Success", "Profile updated successfully");
        navigation.navigate("UserProfileScreen");
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Revert to previous data
      setFullName(previousData.fullName);
      setEmail(previousData.email);
      setLocation(previousData.location);
      setPhoneNumber(previousData.phoneNumber);
      setProfileImage(previousData.profileImage);

      let errorMessage = "Failed to update profile";
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Session expired. Please log in again.";
          navigation.navigate("UserSignin");
        } else if (error.response.status === 413) {
          errorMessage = "Image size too large. Please choose a smaller image.";
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
      } else {
        errorMessage = error.message || errorMessage;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !fullName) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#a95eff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SignUpBackground
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: Math.max(insets.top + 10, 20),
            },
          ]}
        >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: dimensions.iconSize }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingBottom: Math.max(insets.bottom + 120, 140),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View
          style={[
            styles.profileImageContainer,
            {
              marginTop: Math.max(dimensions.spacing.xl, 15),
            },
          ]}
        >
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
            <MaterialIcons name="camera-alt" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full name </Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'fullName' ? styles.inputFocused : styles.inputUnfocused
            ]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#888"
            onFocus={() => setFocusedInput('fullName')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'email' ? styles.inputFocused : styles.inputUnfocused
            ]}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedInput('email')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === 'location' ? styles.inputFocused : styles.inputUnfocused
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#888"
            onFocus={() => setFocusedInput('location')}
            onBlur={() => setFocusedInput(null)}
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <View style={[
            styles.phoneInputContainer,
            focusedInput === 'phoneNumber' ? styles.phoneInputContainerFocused : styles.phoneInputContainerUnfocused
          ]}>
            <View style={styles.countryCodePicker}>
              <Text style={styles.countryCodeText}>+91</Text>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={dimensions.iconSize}
                color="#fff"
              />
            </View>
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              onFocus={() => setFocusedInput('phoneNumber')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Changes Button */}
      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            marginBottom: Math.max(insets.bottom + 20, 30),
          },
        ]}
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