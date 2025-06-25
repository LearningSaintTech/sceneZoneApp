import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectToken, selectUserData, selectLocation, selectFullName, selectMobileNumber } from '../Redux/slices/authSlice';
import HostEditProfileScreen from './HostEditProfile';
import api from '../Config/api';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

const settings = [
  { icon: 'user', label: 'Edit Profile', nav: 'HostEditProfile' },
  { icon: 'star', label: 'Ticket Settings', nav: 'HostTicketSetting' },
  { icon: 'shield', label: 'Account Security', nav: 'HostAccountSecurity' },
  { icon: 'credit-card', label: 'Payment Settings', nav: 'hostPaymentSetting' },
  { icon: 'settings', label: 'General Settings', nav: 'HostGeneralSetting' },
  { icon: 'message-square', label: 'Help Centre', nav: 'HostHelpCentre' },
];

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get data from Redux using selectors
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const location = useSelector(selectLocation);
  const fullName = useSelector(selectFullName);
  const mobileNumber = useSelector(selectMobileNumber);

  useEffect(() => {
    console.log('Current Redux State:', {
      token,
      userData,
      location,
      fullName,
      mobileNumber
    });
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      if (!token) {
        console.error('No token available in Redux store');
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Making API request with token:', token);

      const response = await api.get('/host/get-profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile API Response:', response.data);
      
      if (response.data.success) {
        setProfileData(response.data.data);
      } else {
        console.error('API returned success: false', response.data);
        Alert.alert('Error', response.data.message || 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        Alert.alert('Error', error.response.data?.message || 'Failed to fetch profile data');
      } else if (error.request) {
        console.error('Error request:', error.request);
        Alert.alert('Error', 'No response from server. Please check your internet connection.');
      } else {
        console.error('Error message:', error.message);
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboard1' }],
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8D6BFC" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1, paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={require('../assets/Images/Profile1.png')} style={styles.profileBg} resizeMode="cover" />
          <View style={styles.profileContent}>
            <Image source={require('../assets/Images/frame1.png')} style={styles.avatar} />
            <View style={{ marginLeft: 16 }}>
              <Text style={styles.profileName}>{profileData?.fullName || fullName || 'Loading...'}</Text>
              <Text style={styles.profileEmail}>{profileData?.email || userData?.email || 'No email provided'}</Text>
              <Text style={styles.profileLocation}>{location || 'No location provided'}</Text>
            </View>
          </View>
        </View>
        {/* Settings List */}
        <View style={styles.settingsList}>
          {settings.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={styles.settingsRow}
              activeOpacity={0.7}
              onPress={() => {
                if (item.nav) navigation.navigate(item.nav);
              }}
            >
              <View style={styles.settingsIconCircle}>
                <Feather name={item.icon} size={22} color="#a95eff" />
              </View>
              <Text style={styles.settingsLabel}>{item.label}</Text>
              <Feather name="chevron-right" size={22} color="#b3b3cc" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>
        {/* Version */}
        <Text style={styles.versionText}>App version 1.0.0.1</Text>
        {/* Log Out Button - scrolls with content */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <MaskedView maskElement={<Text style={[styles.logoutButtonText, { backgroundColor: 'transparent' }]}>Log Out</Text>}>
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{ height: 21 }}
            >
              <Text style={[styles.logoutButtonText, { opacity: 0 }]}>Log Out</Text>
            </LinearGradient>
          </MaskedView>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#111018',
  },
  container: {
    backgroundColor: '#111018',
  },
  header: {
    display: 'flex',
    width: 393,
    paddingTop: 40,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#d1cfff',
    fontSize: 22,
    fontWeight: '700',
  },
  profileCard: {
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 18,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    height: 110,
    marginTop: 20,
    alignSelf: 'center',
  },
  profileBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 110,
    paddingHorizontal: 14,
    zIndex: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  profileName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileEmail: {
    color: '#e0dfff',
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  profileLocation: {
    color: '#e0dfff',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  profileWaveIcon: {
    marginLeft: 'auto',
    opacity: 0.7,
  },
  settingsList: {
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 18,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(169,94,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsLabel: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  versionText: {
    color: '#44435a',
    fontSize: 12,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop:-10,
    fontWeight: '400',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#B15CDE',
    borderRadius: 16,
    backgroundColor: '#1A1A1F',
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;