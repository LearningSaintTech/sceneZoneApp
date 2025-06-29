import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SignUpBackground from "../assets/Banners/SignUp";
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "../Config/api";
import {
  selectToken,
  selectUserId,
  selectUserName,
  selectUserPhone,
  selectUserRole,
  selectUserEmail,
  selectFullName,
  selectMobileNumber,
  logout,
  selectUserData,
} from "../Redux/slices/authSlice";

const UserProfileScreen = ({ navigation }) => {
  const userData = useSelector(selectUserData);
  console.log("User Data for profile:", userData);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const userId = useSelector(selectUserId);
  const userName = useSelector(selectUserName);
  const userPhone = useSelector(selectUserPhone);
  const userRole = useSelector(selectUserRole);
  const userEmail = useSelector(selectUserEmail);
  const fullName = useSelector(selectFullName);
  const mobileNumber = useSelector(selectMobileNumber);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
  if (!token) {
    navigation.navigate("UserSignin");
    return;
  }

  const fetchProfile = async () => {
    try {
      const response = await api.get("/user/get-profile", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      console.log("ttt", response.data.data);
      if (response?.data && response?.data?.data) {
        setProfileData(response?.data?.data); 
        setLoading(false);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
     
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token]);

  const handleLogout = async() => {
     await AsyncStorage.removeItem('token');
  
     dispatch(logout());
    navigation.navigate("Onboard1");
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}>
        <ActivityIndicator size="large" color="#a95eff" />
      </View>
    );
  }

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
      <View style={styles.backgroundSvgContainer} pointerEvents="none">
        <SignUpBackground
          style={styles.backgroundSvg}
          width="100%"
          height="100%"
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile </Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Image
            source={require("../assets/Images/Profile1.png")}
            style={styles.profileBg}
            resizeMode="cover"
          />
          <View style={styles.profileContent}>
            <Image
              source={
                profileData?.profileImageUrl
                  ? { uri: profileData.profileImageUrl }
                  : require("../assets/Images/frame1.png")
              }
              style={styles.avatar}
            />
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.profileName}>
                {profileData?.fullName || fullName || userName || "N/A"}
              </Text>
              <Text style={styles.profileEmail}>
                {profileData?.email || userEmail || "N/A"}
              </Text>
              <Text style={styles.profileDetail}>
                Phone:{" "}
                {profileData?.mobileNumber ||
                  mobileNumber ||
                  userPhone ||
                  "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("UserEditProfileScreen")}>
            <MaterialIcons name="person-outline" size={24} color="#a95eff" />
            <Text style={styles.menuItemText}>Edit Profile </Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={24}
              color="#a95eff"
            />
            <Text style={styles.menuItemText}>Account Security</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="payment" size={24} color="#a95eff" />
            <Text style={styles.menuItemText}>Payment Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#a95eff" />
            <Text style={styles.menuItemText}>General Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="help-outline" size={24} color="#a95eff" />
            <Text style={styles.menuItemText}>Help Centre</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.appVersionText}>App version 1.0.0.1</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    paddingTop: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: "hidden",
    height: 100,
    justifyContent: "flex-end",
  },
  profileBg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  profileEmail: {
    fontSize: 14,
    color: "#ccc",
  },
  profileDetail: {
    fontSize: 14,
    color: "#ccc",
  },
  menuContainer: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1,
    color: "#C6C5ED",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 15,
  },
  appVersionText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  logoutButton: {
    marginHorizontal: 16,
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#a95eff",
  },
  logoutButtonText: {
    color: "#B15CDE",
    fontFamily: "Nunito Sans",
    fontSize: 14,
    fontWeight: "400",
  },
  backgroundSvgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default UserProfileScreen;
