import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { selectToken, selectUserData } from '../Redux/slices/authSlice';
import api from '../Config/api';
import * as ImagePicker from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
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

const HostEditProfileScreen = ({ navigation }) => {
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(userData?.mobileNumber ? String(userData.mobileNumber) : '');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setFullName(userData?.fullName || userData?.name || '');
    setEmail(userData?.email || '');
    setLocation(userData?.location || '');
    setPhoneNumber(userData?.mobileNumber ? String(userData.mobileNumber) : '');
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/host/get-profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        const data = response.data.data;
        setFullName(data.fullName || data.name || '');
        setEmail(data.email || '');
        setLocation(data.location || '');
        setProfileImageUri(data.profileImageUrl || null);
        if (!userData?.mobileNumber && data.mobileNumber) {
          setPhoneNumber(String(data.mobileNumber));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    }
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 0.8,
      saveToPhotos: false,
    };

    const cameraPermission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    const storagePermission = Platform.select({
      android: Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });

    Alert.alert(
      'Choose Image Source',
      'Select image from',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const cameraStatus = await check(cameraPermission);
            if (cameraStatus !== RESULTS.GRANTED) {
              const result = await request(cameraPermission);
              if (result !== RESULTS.GRANTED) {
                Alert.alert('Permission Error', 'Camera permission is required');
                return;
              }
            }
            launchCamera(options);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const storageStatus = await check(storagePermission);
            if (storageStatus !== RESULTS.GRANTED) {
              const result = await request(storagePermission);
              if (result !== RESULTS.GRANTED) {
                Alert.alert('Permission Error', 'Gallery permission is required');
                return;
              }
            }
            launchGallery(options);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const launchCamera = (options) => {
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage || 'Unknown error');
        return;
      }
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        setProfileImageUri(response.assets[0].uri);
      }
    });
  };

  const launchGallery = (options) => {
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Gallery Error', response.errorMessage || 'Unknown error');
        return;
      }
      if (response.assets && response.assets[0] && response.assets[0].uri) {
        setProfileImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSaveChanges = async () => {
    console.log('--- Starting Profile Update ---');
    try {
      setLoading(true);
      console.log('Loading state set to true');

      const formData = new FormData();
      console.log('FormData created');
      
      formData.append('fullName', fullName);
      console.log('Appended fullName:', fullName);
      
      formData.append('location', location);
      console.log('Appended location:', location);

      formData.append('email', email);
      console.log('Appended email:', email);

      // Only append image if it exists and has a uri
      if (profileImageUri && profileImageUri.startsWith('file:')) {
        console.log('New profile image found:', profileImageUri);
        const imagePayload = {
          uri: profileImageUri,
          type: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
        };
        console.log('Image payload for form data:', JSON.stringify(imagePayload, null, 2));
        formData.append('profileImageUrl', imagePayload);
        console.log('Appended image with key "profileImageUrl"');
      } else {
        console.log('No new profile image to upload.');
      }

      console.log('Sending request to /host/update-profile with token:', token);
      console.log('Form data being sent (cannot view content directly):', formData);

      const response = await api.patch('/host/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // Added 10-second timeout
      });
      console.log('Update profile response received:', JSON.stringify(response.data, null, 2));

      if (response.data.success) {
        console.log('Profile update successful.');
        Alert.alert('Success', 'Profile updated successfully');
        navigation.navigate('MainTabs');
      } else {
        console.log('Profile update failed:', response.data.message);
        Alert.alert('Error', response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('--- Error updating profile ---');
      if (error.response) {
        console.error('Error Response Data:', JSON.stringify(error.response.data, null, 2));
        console.error('Error Response Status:', error.response.status);
        console.error('Error Response Headers:', JSON.stringify(error.response.headers, null, 2));
      } else if (error.request) {
        console.error('Error Request:', error.request);
        console.error('Network Error Details:', error.code, error.message);
      } else {
        console.error('Error Message:', error.message);
      }
      console.error('Full Error Object:', JSON.stringify(error, null, 2));
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile. Ensure server is running at http://10.0.2.2:3000.');
    } finally {
      setLoading(false);
      console.log('Loading state set to false');
      console.log('--- Finished Profile Update ---');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          paddingTop: Math.max(insets.top + 10, 20),
        }
      ]}>
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
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image Section */}
        <View style={[
          styles.profileImageContainer,
          {
            marginTop: Math.max(dimensions.spacing.xl, 15),
          }
        ]}>
          <Image
            source={profileImageUri ? { uri: profileImageUri } : require('../assets/Images/frame1.png')}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.cameraIconContainer}
            onPress={handleImagePicker}>
            <MaterialIcons name="camera-alt" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full Name"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.emailInputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, borderColor: 'transparent', borderWidth: 0 }]}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.verifyButton}>
              <Text style={styles.verifyButtonText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Location</Text>
          <TextInput
            style={[styles.input, { borderColor: '#24242D' }]}
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#888"
          />
        </View>

        {/* Phone Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCodePicker}>
              <Text style={styles.countryCodeText}>+91</Text>
              <MaterialIcons name="keyboard-arrow-down" size={dimensions.iconSize} color="#fff" />
            </View>
            <TextInput
              style={[styles.phoneInput, { color: '#888' }]}
              value={phoneNumber}
              editable={false}
              placeholder="Phone Number"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
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
          }
        ]}
        activeOpacity={0.85}
        onPress={handleSaveChanges}
        disabled={loading}
      >
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 14,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 393,
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    // Box shadow for iOS
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Box shadow for Android
    elevation: 4,
    minHeight: undefined, // Remove minHeight to allow padding to control height
  },
  backButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    minWidth: dimensions.iconSize + 8,
    minHeight: dimensions.iconSize + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16, // gap between back button and title
    flex: 1,
    textAlign: 'center',
    marginRight:170,
  },
  scrollViewContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.xl,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: dimensions.spacing.xxl,
  },
  profileImage: {
    width: dimensions.profileImageSize,
    height: dimensions.profileImageSize,
    borderRadius: dimensions.profileImageSize / 2,
    backgroundColor: '#ddd',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: Math.max(dimensions.spacing.xs, 4),
    right: Math.max(dimensions.spacing.xs, 4),
    backgroundColor: '#a95eff',
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.sm,
    borderWidth: 2,
    borderColor: '#000',
    minWidth: Math.max(dimensions.iconSize * 1.5, 30),
    minHeight: Math.max(dimensions.iconSize * 1.5, 30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: dimensions.spacing.xl,
  },
  inputLabel: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: dimensions.spacing.sm,
  },
  input: {
    display: 'flex',
    height: 48,
    paddingVertical: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
    color: '#fff',
    fontSize: dimensions.fontSize.title,
  },
  emailInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
  },
  verifyButton: {
    paddingLeft: 8, // Adjust as needed for spacing
  },
  verifyButtonText: {
    color: '#B15CDE',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '400',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: dimensions.borderRadius.md,
    alignItems: 'center',
    minHeight: dimensions.inputHeight,
  },
  countryCodePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.lg,
    borderRightWidth: 1,
    borderColor: '#333',
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    minHeight: dimensions.inputHeight,
    justifyContent: 'center',
  },
  countryCodeText: {
    color: '#fff',
    marginRight: dimensions.spacing.xs,
    fontSize: dimensions.fontSize.title,
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    paddingHorizontal: dimensions.spacing.lg,
    fontSize: dimensions.fontSize.title,
    minHeight: dimensions.inputHeight,
  },
  saveButton: {
    display: 'flex',
    width: '90%',
    maxWidth: 361,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: dimensions.spacing.xl,
  },
  saveButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default HostEditProfileScreen;