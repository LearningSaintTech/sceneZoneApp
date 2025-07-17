import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { loginArtist } from '../Redux/slices/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileIcon from '../assets/icons/mobile';
import LockIcon from '../assets/icons/lock';
import api from '../Config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
const isTablet = width >= 768;
const isSmallPhone = width < 350;

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
    large: Math.max(width * 0.065, 28),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
  },
  buttonHeight: Math.max(height * 0.06, 50),
  inputHeight: Math.max(height * 0.06, 50),
  iconSize: Math.max(width * 0.05, 20),
  socialIconSize: Math.max(width * 0.05, 20),
  marginHorizontal: Math.max(width * 0.04, 14),
};

const ArtistSigninScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const scheme = useColorScheme();
  const isDark = true; // Force dark mode
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  // Input refs for focus control
  const mobileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleMobileChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleanedText.length <= 10) {
      setMobileNumber(cleanedText);
    }
  };

  const getFullMobileNumber = () => {
    return mobileNumber ? `+91${mobileNumber}` : '';
  };

  // On mount, check AsyncStorage for saved credentials
  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const saved = await AsyncStorage.getItem('artistRememberMe');
        if (saved) {
          const { mobileNumber, password } = JSON.parse(saved);
          // Extract 10-digit number if stored with +91
          const cleanMobile = mobileNumber.startsWith('+91') ? mobileNumber.slice(3) : mobileNumber;
          setMobileNumber(cleanMobile);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (e) {
        // Ignore errors
      }
    };
    loadRemembered();
  }, []);

  // Save or clear credentials when rememberMe changes
  useEffect(() => {
    const updateRemembered = async () => {
      if (rememberMe) {
        if (mobileNumber && password) {
          await AsyncStorage.setItem('artistRememberMe', JSON.stringify({ mobileNumber, password }));
        }
      } else {
        await AsyncStorage.removeItem('artistRememberMe');
      }
    };
    updateRemembered();
  }, [rememberMe]);

  // Also update storage if user changes credentials while rememberMe is checked
  useEffect(() => {
    const updateIfRemembered = async () => {
      if (rememberMe && mobileNumber && password) {
        await AsyncStorage.setItem('artistRememberMe', JSON.stringify({ mobileNumber, password }));
      }
    };
    updateIfRemembered();
  }, [mobileNumber, password]);

  const background = '#121212';
  const cardBg = '#000';
  const text = '#fff';
  const border = '#333';
  const placeholder = '#aaa';

  // Responsive padding for the inner container
  const dynamicPadding = {
    paddingTop: insets.top + height * 0.04,
    paddingBottom: insets.bottom + height * 0.04,
    paddingLeft: insets.left + width * 0.05,
    paddingRight: insets.right + width * 0.05,
  };

  const handleSignIn = async () => {
    try {
      // Input validation
      if (!mobileNumber.trim() || mobileNumber.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }

      setIsLoading(true);

      const fullMobileNumber = getFullMobileNumber();
      const loginData = {
        mobileNumber: fullMobileNumber,
        password: password.trim(),
      };

      // If rememberMe is checked, save credentials (store 10-digit format)
      if (rememberMe) {
        await AsyncStorage.setItem('artistRememberMe', JSON.stringify({ mobileNumber, password }));
      } else {
        await AsyncStorage.removeItem('artistRememberMe');
      }

      console.log('Artist Login Data:', loginData);

      const response = await api.post('/artist/auth/loginFromPassword', loginData);

      console.log('Artist Login Response:', response.data);

      if (response.data && response.data.success) {
        // Get token from response headers
        const token = response.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
          console.warn('No token found in response headers');
          Alert.alert('Error', 'Authentication failed: No token received.');
          return;
        }

        console.log('Sign-in successful, dispatching login action with token:', token);

        // Dispatch login action with user data
        dispatch(loginArtist({
          id: response.data.data.user._id || response.data.data.user.id,
          name: response.data.data.user.fullName || 'Artist User',
          email: response.data.data.user.email || 'artist@example.com',
          phone: response.data.data.user.mobileNumber || fullMobileNumber,
          mobileNumber: fullMobileNumber,
          location: null,
          role: response.data.data.user.role || 'artist',
          token: token,
        }));

        // Navigate directly to ArtistHome
        navigation.navigate('ArtistHome');
      }
    } catch (error) {
      console.error('Artist Login Error:', error.message);
      console.error('Error Response:', error.response?.data);

      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to sign in. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    try {
      // Input validation
      if (!mobileNumber.trim() || mobileNumber.length !== 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
        return;
      }

      setIsLoading(true);

      const fullMobileNumber = getFullMobileNumber();
      const loginData = { mobileNumber: fullMobileNumber };

      console.log('Artist OTP Login Data:', loginData);

      const response = await api.post('/artist/firebase-auth/firebase-login', loginData);
      console.log('Artist OTP Login Response:', response.data);

      if (response.data.success) {
        console.log('Initiating Firebase phone auth for:', fullMobileNumber);
        const confirmationResult = await auth().signInWithPhoneNumber(fullMobileNumber);
        console.log('Firebase OTP sent successfully:', confirmationResult);

        Alert.alert('Success', 'OTP sent to your mobile number', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('ArtistOtpVerificationScreen', {
                mobileNumber: fullMobileNumber,
                confirmation: confirmationResult,
                isFirebase: true,
                fullName: response.data.data.user?.fullName || '',
              }),
          },
        ]);
      }
    } catch (error) {
      console.error('Artist OTP Login Error:', error.message);
      console.error('Error Response:', error.response?.data);
      let errorMessage = error.response?.data?.message || 'Failed to initiate OTP login. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMode = () => {
    setIsOtpLogin(!isOtpLogin);
    setPassword(''); // Clear password when switching modes
  };

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          contentContainerStyle={[styles.inner, dynamicPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: text }]}>Sign in to{"\n"}your account</Text>

          <Text style={[styles.subtitle, { color: placeholder }]}>
            Don't have an account?{' '}
            <Text style={styles.signup} onPress={() => navigation.navigate('ArtistSignup')}>
              Sign Up
            </Text>
          </Text>

          {/* Phone Input */}
          <View style={[styles.inputContainer, { backgroundColor: cardBg, borderColor: border }]}>
            <MobileIcon width={20} height={20} style={styles.inputIcon} />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={placeholder}
              style={[styles.input, { color: text, marginLeft: 8 }]}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={handleMobileChange}
              maxLength={10}
              ref={mobileInputRef}
            />
          </View>

          {/* Password Input - Only show in password login mode */}
          {!isOtpLogin && (
            <View style={[styles.inputContainer, styles.passwordContainer, { backgroundColor: cardBg }]}>
              <LockIcon width={20} height={20} style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor={placeholder}
                secureTextEntry={!passwordVisible}
                style={[styles.input, { color: text, flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                ref={passwordInputRef}
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Feather name={passwordVisible ? 'eye' : 'eye-off'} size={20} color={placeholder} />
              </TouchableOpacity>
            </View>
          )}

          {/* Remember / Forgot Row - Only show in password login mode */}
          {!isOtpLogin && (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <TouchableOpacity
                  onPress={() => setRememberMe(!rememberMe)}
                  style={{
                    width: 18,
                    height: 18,
                    borderWidth: 1.5,
                    borderColor: '#8D6BFC',
                    borderRadius: 4,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 8,
                    backgroundColor: rememberMe ? '#8D6BFC' : 'transparent',
                  }}
                >
                  {rememberMe && (
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', lineHeight: 16 }}>✓</Text>
                  )}
                </TouchableOpacity>
                <Text style={[styles.rememberText, { color: text }]}>Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ArtistForgotPasswordScreen')}>
                <Text style={styles.forgot}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sign In Button */}
          <TouchableOpacity onPress={isOtpLogin ? handleOtpLogin : handleSignIn} disabled={isLoading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.primaryButton, { borderRadius: 14, opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? 'Processing...' : (isOtpLogin ? 'Send OTP' : 'Sign In')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>
          <TouchableOpacity onPress={toggleLoginMode}>
            <Text style={styles.loginOtp}>
              {isOtpLogin ? 'Login with Password' : 'Login with OTP'}
            </Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          {/* <TouchableOpacity style={styles.socialButton}>
            <GoogleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity> */}

          {/* Apple Sign In */}
          {/* <TouchableOpacity style={styles.socialButton}>
            <AppleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </TouchableOpacity> */}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '800',
    fontSize: 26,
    lineHeight: 40,
    letterSpacing: 0,
    marginBottom: 5,
    textAlign: 'left',
    alignSelf: 'stretch',
    color: '#C6C5ED',
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    marginBottom: 30,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  signup: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#a95eff',
  },
  inputContainer: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 40,
    marginBottom: 16,
    backgroundColor: '#000',
  },
  passwordContainer: {
    borderColor: 'rgba(141, 107, 252, 1)',
    backgroundColor: '#000',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    fontSize: 13,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  rememberText: {
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    color: '#C6C5ED',
  },
  forgot: {
    color: '#8D6BFC',
    fontSize: 13,
    fontWeight: '700',
    alignSelf: 'flex-end',
  },
  primaryButton: {
    display: 'flex',
    height: 46,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    width: width * 0.95,
    alignSelf: 'center',
    marginBottom: 60,
  },
  primaryButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 65,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#aaa',
  },
  orText: {
    marginHorizontal: 10,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
  socialButton: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#000',
    height: 44,
  },
  socialButtonText: {
    marginLeft: 10,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  loginOtp: {
    color: '#8D6BFC',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 18,
  },
  countryCode: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default ArtistSigninScreen;