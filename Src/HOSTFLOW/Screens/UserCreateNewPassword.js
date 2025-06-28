import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import LinearGradient from "react-native-linear-gradient";
import SignUpBackground from "../assets/Banners/SignUp";
import api from "../Config/api";
import { useRoute } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

// Responsive dimensions for all screen sizes
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const responsiveDimensions = {
  buttonWidth: Math.min(width - 32, Math.max(width * 0.9, 300)),
  buttonHeight: Math.max(height * 0.065, 48),
  buttonMargin: Math.max(width * 0.04, 16),
  buttonBottom: Math.max(height * 0.08, 60),
  borderRadius: Math.max(width * 0.035, 12),
  paddingHorizontal: Math.max(width * 0.04, 16),
  inputWidth: Math.min(width - 32, Math.max(width * 0.9, 300)),
};

const UserCreateNewPasswordScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { inputType = "email", value = "" } = route.params || {};
  console.log(`[UserCreateNewPasswordScreen] ${inputType} from route params:`, value);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleResetPassword = async () => {
    if (!value) {
      Alert.alert("Error", "Contact information is missing.");
      console.log("[UserCreateNewPasswordScreen] Validation failed: No contact information");
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please enter and confirm your new password.");
      console.log("[UserCreateNewPasswordScreen] Validation failed: Password fields empty");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      console.log("[UserCreateNewPasswordScreen] Validation failed: Passwords do not match");
      return;
    }
    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      console.log("[UserCreateNewPasswordScreen] Validation failed: Password does not meet complexity requirements");
      return;
    }

    setIsLoading(true);
    try {
      const resetData = inputType === "email" ? { email: value, password } : { mobileNumber: value, password };
      console.log("[UserCreateNewPasswordScreen] Reset password request:", {
        endpoint: "/user/set-new-password",
        data: resetData,
      });

      const response = await api.post("/user/set-new-password", resetData);

      console.log("[UserCreateNewPasswordScreen] Reset password response:", response.data);

      if (response?.data?.success) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace("UserSignin");
        }, 2000); // Increased timeout for better UX
      } else {
        Alert.alert("Error", response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("[UserCreateNewPasswordScreen] Reset password error:", {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert("Error", error.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the email or mobile number for display
  const maskContact = (contact, type) => {
    if (type === "email" && contact) {
      const [localPart, domain] = contact.split("@");
      if (localPart.length > 3) {
        return `${localPart.slice(0, 2)}${"*".repeat(localPart.length - 2)}@${domain}`;
      }
      return contact;
    } else if (type === "mobile" && contact) {
      return contact.length > 4 ? `******${contact.slice(-4)}` : contact;
    }
    return "your contact";
  };

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity
          style={[styles.backIcon, { paddingHorizontal: responsiveDimensions.paddingHorizontal }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + responsiveDimensions.buttonBottom },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.title}>Create New Pasdcdssword</Text>
            <Text style={styles.subtitle}>
              Create a new strong password for {maskContact(value, inputType)}
            </Text>

            {/* New Password Field */}
            <View style={[styles.inputWrapper, { width: responsiveDimensions.inputWidth, alignSelf: "center" }]}>
              <Icon name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass1}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPass1(!showPass1)} disabled={isLoading}>
                <Icon name={showPass1 ? "eye" : "eye-off"} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <View style={[styles.inputWrapper, { width: responsiveDimensions.inputWidth, alignSelf: "center" }]}>
              <Icon name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPass2(!showPass2)} disabled={isLoading}>
                <Icon name={showPass2 ? "eye" : "eye-off"} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.button, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius, alignSelf: "center" }]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#B15CDE", "#7952FC"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.buttonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
              >
                <Text style={styles.buttonText}>{isLoading ? "Processing..." : "Confirm Reset Password"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal transparent visible={showSuccessModal} animationType="fade" statusBarTranslucent>
          <View style={styles.modalBackground}>
            <View style={[styles.modalContent, { width: responsiveDimensions.buttonWidth }]}>
              <Image source={require("../assets/Images/Reset.png")} style={styles.successImage} />
              <Text style={styles.successTitle}>Reset Password Success!</Text>
              <Text style={styles.successSubtitle}>Please login to Scene Zone again with your new password</Text>
              <TouchableOpacity
                style={[styles.modalButton, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius }]}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.replace("UserSignin");
                }}
              >
                <LinearGradient
                  colors={["#B15CDE", "#7952FC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.modalButtonGradient, { borderRadius: responsiveDimensions.borderRadius }]}
                >
                  <Text style={styles.buttonText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  backIcon: {
    paddingTop: 10,
  },
  title: {
    fontFamily: "Nunito Sans",
    fontWeight: "700",
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(198, 197, 237, 1)",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Nunito Sans",
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "center",
    color: "rgba(198, 197, 237, 0.8)",
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(141, 107, 252, 1)",
    backgroundColor: "#1a1a1a",
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    color: "#fff",
  },
  button: {
    marginTop: 30,
    marginBottom: 60,
    overflow: "hidden",
  },
  buttonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Nunito Sans",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(255, 255, 255, 1)",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "#000000cc",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  successImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: "Nunito Sans",
    fontWeight: "700",
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  successSubtitle: {
    fontFamily: "Nunito Sans",
    fontWeight: "400",
    fontSize: 13,
    color: "rgba(198, 197, 237, 0.8)",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    overflow: "hidden",
  },
  modalButtonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserCreateNewPasswordScreen;