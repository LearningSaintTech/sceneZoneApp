import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import SignUpBackground from "../assets/Banners/SignUp";
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
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import EditProfileIcon from '../assets/icons/EditProfile';
import GuestListIcon from '../assets/icons/GuestList';
import PaymentIcon from '../assets/icons/Payment';
import GeneralSettingIcon from '../assets/icons/Generalsetting';
import HelpCentreIcon from '../assets/icons/HelpCentre';

const { width, height } = Dimensions.get("window");

const UserProfileScreen = ({ navigation }) => {
  const userData = useSelector(selectUserData);
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

  console.log("User Data for profile:", userData);

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

      console.log("Profile fetch response:", response);
      if (response.data && response.data.data) {
          setProfileData(response.data.data);
      }
    } catch (error) {
      // console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate("Onboard1");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
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
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={true}
      >
        {/* Profile Card */}
        <ImageBackground
          source={require("../assets/Images/Profile1.png")}
          style={styles.profileCardBackground}
          imageStyle={styles.profileCardImage}
        >
          <View style={styles.profileCardContent}>
            <View style={styles.profileImagePlaceholder}>
              <Image
                source={
                  profileData?.profileImageUrl
                    ? { uri: profileData.profileImageUrl }
                    : require("../assets/Images/frame1.png")
                }
                style={styles.profileImage}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profileData?.fullName || fullName || userName || "N/A"}</Text>
              <Text style={styles.userContact}>{profileData?.email || userEmail || "N/A"}</Text>
            </View>
            <View style={styles.iconPlaceholder} />
          </View>
        </ImageBackground>

        {/* Menu Items */}
        <View style={styles.menuContainerArtistStyle}>
          <TouchableOpacity
            style={styles.menuItemArtistStyle}
            onPress={() => navigation.navigate("UserEditProfileScreen")}
          >
            <EditProfileIcon width={24} height={24} style={{marginLeft: 28, marginRight: 20, alignSelf: 'center'}} color="#A58AFF" />
            <Text style={styles.menuItemTextArtistStyle}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItemArtistStyle}
            onPress={() => navigation.navigate("UserAccountSecurityScreen")}
          >
            <GuestListIcon width={24} height={24} style={{marginLeft: 28, marginRight: 20, alignSelf: 'center'}} color="#A58AFF" />
            <Text style={styles.menuItemTextArtistStyle}>Account Security</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItemArtistStyle}
            onPress={() => navigation.navigate("UserPaymentSettingsScreen")}
          >
            <PaymentIcon width={24} height={24} style={{marginLeft: 28, marginRight: 20, alignSelf: 'center'}} color="#A58AFF" />
            <Text style={styles.menuItemTextArtistStyle}>Payment Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItemArtistStyle}
            onPress={() => navigation.navigate("UserGeneralSettingsScreen")}
          >
            <GeneralSettingIcon width={24} height={24} style={{marginLeft: 28, marginRight: 20, alignSelf: 'center'}} color="#A58AFF" />
            <Text style={styles.menuItemTextArtistStyle}>General Settings</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItemArtistStyle}
            onPress={() => navigation.navigate("UserHelpCentreScreen")}
          >
            <HelpCentreIcon width={24} height={24} style={{marginLeft: 28, marginRight: 20, alignSelf: 'center'}} color="#A58AFF" />
            <Text style={styles.menuItemTextArtistStyle}>Help Centre</Text>
            <MaterialIcons name="chevron-right" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        <Text style={styles.appVersionTextArtistStyle}>App version 1.0.0.1</Text>

        {/* Logout Button */}
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.logoutButtonGradientArtistStyle}
        >
          <TouchableOpacity style={styles.logoutButtonArtistStyle} onPress={handleLogout}>
            <MaskedView
              maskElement={
                <Text style={styles.logoutButtonTextArtistStyle}>Log Out</Text>
              }
            >
              <LinearGradient
                colors={["#B15CDE", "#7952FC"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{ height: 24 }}
              >
                <Text style={[styles.logoutButtonTextArtistStyle, { opacity: 0 }]}>Log Out</Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "left",
    justifyContent: "space-between",
    paddingHorizontal: 17,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#333",
    backgroundColor: "#000",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "left",
    marginLeft:10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
    paddingTop: 20,
  },
  profileCardBackground: {
    marginVertical: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 16,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 9.4,
    elevation: 8,
    backgroundColor: '#18171D',
  },
  profileCardImage: {
    borderRadius: 16,
  },
  profileCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImagePlaceholder: {
    aspectRatio: 1,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 16,
    marginLeft: 4,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#222',
  },
  profileImage: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    paddingRight: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  userContact: {
    fontSize: 13,
    color: '#eee',
  },
  iconPlaceholder: {
    aspectRatio: 1,
    width: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 8,
    marginLeft: 8,
  },
  menuContainerArtistStyle: {
    marginHorizontal: 16,
    marginBottom: 30,
  },
  menuItemArtistStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18171D',
    borderRadius: 20,
    marginVertical: 6,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 72,
    borderWidth: 1.5,
    borderColor: '#39355B',
    width: '100%',
    alignSelf: 'center',
    shadowColor: 'transparent',
  },
  menuItemTextArtistStyle: {
    flex: 1,
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 15,
  },
  appVersionTextArtistStyle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButtonGradientArtistStyle: {
    borderRadius: 20,
    padding: 1,
    width: '90%',
    alignSelf: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  logoutButtonArtistStyle: {
    backgroundColor: '#18171D',
    borderRadius: 20,
    height: 54,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonTextArtistStyle: {
    color: '#B15CDE',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default UserProfileScreen;