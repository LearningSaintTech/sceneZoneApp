import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground, Dimensions, ActivityIndicator, Alert, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectToken, selectUserData, selectLocation, selectFullName, selectMobileNumber } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaskedView from '@react-native-masked-view/masked-view';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import api from '../Config/api';
import EditProfileIcon from '../assets/icons/EditProfile';
import GuestListIcon from '../assets/icons/GuestList';
import PaymentIcon from '../assets/icons/Payment';
import GeneralSettingIcon from '../assets/icons/Generalsetting';
import HelpCentreIcon from '../assets/icons/HelpCentre';
import notificationService from '../services/notificationService';

const { width } = Dimensions.get('window');

// Responsive design system using react-native-responsive-screen
const isTablet = width >= 768;

const design = {
  // Responsive spacing using width percentages
  spacing: {
    xs: wp('1%'),   // 1% of screen width
    sm: wp('2%'),   // 2% of screen width
    md: wp('3%'),   // 3% of screen width
    lg: wp('4%'),   // 4% of screen width
    xl: wp('5%'),   // 5% of screen width
    xxl: wp('6%'),  // 6% of screen width
  },
  // Responsive font sizes using width percentages
  fontSize: {
    small: wp('3%'),   // 3% of screen width
    body: wp('3.5%'),  // 3.5% of screen width
    title: wp('4%'),   // 4% of screen width
    header: wp('4.5%'), // 4.5% of screen width
    large: wp('5%'),   // 5% of screen width
  },
  // Responsive border radius
  borderRadius: {
    sm: wp('1.5%'),  // 1.5% of screen width
    md: wp('2.5%'),  // 2.5% of screen width
    lg: wp('4%'),    // 4% of screen width
    xl: wp('8%'),    // 8% of screen width
  },
  // Responsive icon size
  iconSize: wp('6%'), // 6% of screen width
  // Responsive heights using height percentages
  buttonHeight: hp('6%'), // 6% of screen height
  profileCardHeight: hp('12%'), // 12% of screen height
  // Profile image will use aspect ratio instead of fixed size
  profileImageAspect: 1, // 1:1 aspect ratio
};

const ArtistProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

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

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ArtistHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const fetchProfile = async () => {
    try {
      if (!token) {
        console.error('No token available in Redux store');
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        setLoading(false);
        return;
      }

      const artistId = userData?.id;
      if (!artistId) {
        console.error('No artist ID available in Redux store');
        Alert.alert('Error', 'Artist ID not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Making API request with token:', token, 'and artistId:', artistId);

      const response = await api.get(`/artist/get-profile/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile API Response:', response.data);
      
      if (response.data.success) {
        setProfileData(response.data.data);
        setImageError(false); // Reset image error when new data is loaded
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

  const handleLogout = async () => {
    await notificationService.removeTokenFromBackend();
    dispatch(logout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboard1' }],
    });
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.delete('/artist/auth/deleteAccount', {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (response.data && response.data.success) {
                await notificationService.removeTokenFromBackend();
                dispatch(logout());
                navigation.reset({ index: 0, routes: [{ name: 'Onboard1' }] });
              } else {
                Alert.alert('Error', response.data?.message || 'Failed to delete account');
              }
            } catch (error) {
              Alert.alert('Error', error.response?.data?.message || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8D6BFC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with safe area top padding */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => navigation.navigate('ArtistHome')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={design.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      {/* ScrollView with content and safe area bottom padding */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: Math.max(insets.bottom, design.spacing.xl) }]}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Profile Card with Background Image */}
        <ImageBackground
          source={require('../assets/Images/Profile1.png')} // Use Profile1.png as background
          style={styles.profileCardBackground}
          imageStyle={styles.profileCardImage}
        >
          <View style={styles.profileCardContent}>
            <View style={styles.profileImagePlaceholder}>
              {profileData?.profileImageUrl ? (
                <Image 
                  source={{ uri: profileData.profileImageUrl }}
                  style={styles.profileImage}
                  onError={(error) => {
                    console.log('Image loading error:', error.nativeEvent);
                    setImageError(true);
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully');
                  }}
                />
              ) : (
                <Image 
                  source={require('../assets/Images/frame1.png')}
                  style={styles.profileImage}
                />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{profileData?.fullName || fullName || userData?.name || 'Loading...'}</Text>
              <Text style={styles.userContact}>{profileData?.email || userData?.email || 'No email provided'}</Text>
            </View>
            {/* Placeholder for waveform or icon */}
            <View style={styles.iconPlaceholder} />
          </View>
        </ImageBackground>

        {/* Settings Options */}
        <TouchableOpacity style={styles.optionItem}
          onPress={() => navigation.navigate('ArtistEditProfile')}
        >
          <EditProfileIcon width={24} height={24} style={styles.optionIcon} color="#A58AFF" />
          <Text style={styles.optionText}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}
          onPress={() => navigation.navigate('ArtistGuestEventList')}
        >
          <GuestListIcon width={24} height={24} style={styles.optionIcon} color="#A58AFF" />
          <Text style={styles.optionText}>Guest List</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}
          onPress={() => navigation.navigate('ArtistGeneralSettings')}
        >
          <GeneralSettingIcon width={24} height={24} style={styles.optionIcon} color="#A58AFF" />
          <Text style={styles.optionText}>General Settings</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem}
          onPress={() => navigation.navigate('ArtistHelpCentre')}
        >
          <HelpCentreIcon width={24} height={24} style={styles.optionIcon} color="#A58AFF" />
          <Text style={styles.optionText}>Help Centre</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

         <Text style={styles.appVersionText}>App version 1.0.0.1</Text>

        {/* Log Out Button - Updated to match UserProfile style */}
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{
            borderRadius: 20,
            padding: 1,
            width: '100%',
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: '#18171D',
              borderRadius: 20,
              height: 54,
              width: '100%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={handleLogout}
          >
            <MaskedView
              maskElement={
                <Text style={{
                  fontFamily: 'Nunito Sans',
                  fontSize: 14,
                  fontWeight: '400',
                  textAlign: 'center',
                  color: 'black',
                }}>
                  Log Out
                </Text>
              }
            >
              <LinearGradient
                colors={["#B15CDE", "#7952FC"]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 0 }}
                style={{ height: 24 }}
              >
                <Text style={{
                  opacity: 0,
                  fontFamily: 'Nunito Sans',
                  fontSize: 16,
                  fontWeight: '400',
                  textAlign: 'center',
                }}>
                  Log Out
                </Text>
              </LinearGradient>
            </MaskedView>
          </TouchableOpacity>
        </LinearGradient>
        {/* Delete Account Button */}
        <TouchableOpacity style={[styles.logoutButtonArtistStyle, { borderColor: '#ff4d4f', borderWidth: 1, marginTop: 10 }]} onPress={handleDeleteAccount}>
          <Text style={[styles.logoutButtonTextArtistStyle, { color: '#ff4d4f' }]}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>
      <ArtistBottomNavBar
        navigation={navigation}
        insets={insets}
        isLoading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: design.spacing.md,
  },
  header: {
    paddingHorizontal: design.spacing.lg,
    paddingVertical: design.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    minHeight: hp('8%'), // 8% of screen height
  },
  headerTitle: {
    fontSize: design.fontSize.header,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'left',
    
  },
  backButton: {
    padding: design.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: design.spacing.sm,
  },
  profileCardBackground: {
    marginVertical: design.spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    padding: design.spacing.lg,
    minHeight: design.profileCardHeight,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 9.4,
    elevation: 8, // For Android shadow
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
    width: wp('17%'), // Increased from 15% to 20% of screen width
    borderRadius: design.borderRadius.xl,
    overflow: 'hidden',
    marginRight: design.spacing.lg,
    marginLeft:10,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  profileImage: {
    flex: 1,
    aspectRatio: 1,
  },
  profileInfo: {
    flex: 1,
    paddingRight: design.spacing.md,
  },
  userName: {
    fontSize: wp('3.5%'), // Reduced from design.fontSize.header to 3.5% of screen width
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: design.spacing.xs,
  },
  userContact: {
    fontSize: wp('3%'), // Reduced from design.fontSize.body to 3% of screen width
    color: '#eee',
  },
  iconPlaceholder: {
    aspectRatio: 1,
    width: wp('10%'), // 10% of screen width
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: design.borderRadius.md,
  },
  optionItem: {
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
  optionIcon: {
    marginLeft: 28,
    marginRight: 20,
    alignSelf: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  chevronIcon: {
    marginRight: 28,
    alignSelf: 'center',
  },
  appVersionText: {
    fontSize: design.fontSize.small,
    color: '#aaa',
    textAlign: 'center',
    marginTop: design.spacing.xl,
    marginBottom: design.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonGradientArtistStyle: {
    borderRadius: 20,
    padding: 1,
    width: '100%',
    marginTop: 24,
    marginBottom: 24,
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
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});

export default ArtistProfileScreen; 