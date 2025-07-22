import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  Modal as RNModal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/slices/authSlice';
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
import Ionicons from 'react-native-vector-icons/Ionicons';

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

const UserSigninScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '', onPress: null });

  // Input refs for focus control
  const mobileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // On mount, check AsyncStorage for saved credentials
  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const saved = await AsyncStorage.getItem('userRememberMe');
        if (saved) {
          const { mobileNumber, password } = JSON.parse(saved);
          setMobileNumber(mobileNumber);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('[UserSigninScreen] Error loading remembered credentials:', e);
      }
    };
    loadRemembered();
  }, []);

  // Save or clear credentials when rememberMe changes
  useEffect(() => {
    const updateRemembered = async () => {
      if (rememberMe) {
        if (mobileNumber && password) {
          await AsyncStorage.setItem('userRememberMe', JSON.stringify({ mobileNumber, password }));
        }
      } else {
        await AsyncStorage.removeItem('userRememberMe');
      }
    };
    updateRemembered();
  }, [rememberMe]);

  // Update storage if user changes credentials while rememberMe is checked
  useEffect(() => {
    const updateIfRemembered = async () => {
      if (rememberMe && mobileNumber && password) {
        await AsyncStorage.setItem('userRememberMe', JSON.stringify({ mobileNumber, password }));
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
      if (!mobileNumber || mobileNumber.length !== 10) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Please enter a valid 10-digit mobile number' });
        return;
      }

      if (!password.trim()) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Please enter your password' });
        console.log('[UserSigninScreen] Validation failed: Password is empty');
        return;
      }

      setIsLoading(true);

      const loginData = {
        mobileNumber: '+91' + mobileNumber.trim(),
        password: password.trim(),
      };

      console.log('[UserSigninScreen] Login Data:', loginData);

      const response = await api.post('/user/auth/loginFromPassword', loginData);
      console.log('[UserSigninScreen] Login Response:', response.data);

      if (response.data?.success) {
        const token = response.headers['authorization']?.replace('Bearer ', '');
        if (!token) {
          console.warn('[UserSigninScreen] No token found in response headers');
          setCustomAlert({ visible: true, title: 'Error', message: 'Authentication failed: No token received.' });
          return;
        }

        console.log('[UserSigninScreen] Sign-in successful with token:', token);
        await AsyncStorage.setItem('token', token);
        dispatch(
          loginUser({
            id: response.data.data.user._id || response.data.data.user.id,
            fullName: response.data.data.user.fullName || 'User',
            mobileNumber: response.data.data.user.mobileNumber || mobileNumber,
            email: response.data.data.user.email || null,
            phone: response.data.data.user.mobileNumber || mobileNumber,
            location: null,
            role: response.data.data.user.role || 'user',
            token,
          })
        );
        navigation.navigate('UserHome');
      }
    } catch (error) {
      console.error('[UserSigninScreen] Login Error:', {
        message: error.message,
        response: error.response?.data,
      });
      setCustomAlert({ visible: true, title: 'Error', message: error.response?.data?.message || 'Failed to sign in. Please check your credentials and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpLogin = async () => {
    try {
      if (!mobileNumber || mobileNumber.length !== 10) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Please enter a valid 10-digit mobile number', onPress: null });
        return;
      }
      setIsLoading(true);
      const loginData = { mobileNumber: '+91' + mobileNumber.trim() };
      console.log('[UserSigninScreen] OTP Login Data:', loginData);
      const response = await api.post('/user/firebase-auth/firebase-login', loginData);
      console.log('[UserSigninScreen] OTP Login Response:', response.data);
      if (response.data.success) {
        console.log('[UserSigninScreen] Initiating Firebase phone auth for:', loginData.mobileNumber);
        const confirmationResult = await auth().signInWithPhoneNumber(loginData.mobileNumber);
        console.log('[UserSigninScreen] Firebase OTP sent successfully:', confirmationResult);
        setCustomAlert({
          visible: true,
          title: 'Success',
          message: 'OTP sent to your mobile number',
          onPress: () => {
            setCustomAlert(a => ({ ...a, visible: false }));
            navigation.navigate('UserOtpVerification', {
              mobileNumber: mobileNumber,
              confirmation: confirmationResult,
              fullName: response.data.data.user?.fullName || '',
            });
          }
        });
        return;
      }
    } catch (error) {
      console.error('[UserSigninScreen] OTP Login Error:', {
        message: error.message,
        response: error.response?.data,
      });
      let errorMessage = error.response?.data?.message || 'Failed to initiate OTP login. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      setCustomAlert({ visible: true, title: 'Error', message: errorMessage, onPress: null });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMode = () => {
    setIsOtpLogin(!isOtpLogin);
    setPassword('');
    console.log('[UserSigninScreen] Toggled login mode to:', isOtpLogin ? 'Password' : 'OTP');
  };

  // Move CustomAlertModal here so it can access customAlert/setCustomAlert
  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={styles.shortlistModalOverlay}>
        <View style={styles.shortlistModalContent}>
          <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : customAlert.title === 'Already Shortlisted' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
          <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
          <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
          <TouchableOpacity
            style={styles.shortlistModalButton}
            onPress={() => {
              if (typeof customAlert.onPress === 'function') {
                customAlert.onPress();
              } else {
                setCustomAlert({ ...customAlert, visible: false });
              }
            }}
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              style={styles.shortlistModalButtonGradient}
            >
              <Text style={styles.shortlistModalButtonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          contentContainerStyle={[styles.inner, dynamicPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: text }]}>Sign in to{'\n'}your account</Text>

          <Text style={[styles.subtitle, { color: placeholder }]}>
            Don't have an account?{' '}
            <Text style={styles.signup} onPress={() => navigation.navigate('UserSignup')}>
              Sign Up
            </Text>
          </Text>

          {/* Mobile Number Input */}
          <View style={[styles.inputContainer, { backgroundColor: cardBg, borderColor: border }]}>
            <MobileIcon width={20} height={20} style={styles.inputIcon} />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={placeholder}
              style={[styles.input, { color: text, marginLeft: 8 }]}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={text => setMobileNumber(text.replace(/\D/g, '').slice(0, 10))}
              ref={mobileInputRef}
              autoCapitalize="none"
              editable={!isLoading}
              maxLength={10}
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
                editable={!isLoading}
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
              <TouchableOpacity onPress={() => navigation.navigate('UserForgotPassword')}>
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
                {isLoading ? 'Processing...' : isOtpLogin ? 'Send OTP' : 'Sign In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View> */}
          <TouchableOpacity onPress={toggleLoginMode}>
            <Text style={styles.loginOtp}>
              {isOtpLogin ? 'Login with Password' : 'Login with OTP'}
            </Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          {/*
          <TouchableOpacity style={styles.socialButton}>
            <GoogleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>
          */}

          {/* Apple Sign In */}
          {/*
          <TouchableOpacity style={styles.socialButton}>
            <AppleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>
          */}
        </ScrollView>
      </SafeAreaView>
      <CustomAlertModal />
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
  shortlistModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  shortlistModalContent: {
    backgroundColor: '#121212',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
  },
  shortlistModalTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  shortlistModalMessage: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#C6C5ED',
    textAlign: 'center',
    marginBottom: 20,
  },
  shortlistModalButton: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
  },
  shortlistModalButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistModalButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: 'rgba(255, 255, 255, 1)',
  },
});

export default UserSigninScreen;