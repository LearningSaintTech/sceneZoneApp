import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FullNameIcon from '../assets/icons/fullname';
import MobileIcon from '../assets/icons/mobile';
import LockIcon from '../assets/icons/lock';
import api from '../Config/api';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/slices/authSlice';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

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

const UserSignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Input refs for focus control
  const fullNameInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // On mount, check AsyncStorage for saved credentials
  useEffect(() => {
    const loadRemembered = async () => {
      try {
        const saved = await AsyncStorage.getItem('userSignupRememberMe');
        if (saved) {
          const { fullName, mobile, password } = JSON.parse(saved);
          setFullName(fullName);
          setMobile(mobile);
          setPassword(password);
          setRememberMe(true);
        }
      } catch (e) {
        console.error('[UserSignupScreen] Error loading remembered credentials:', e);
      }
    };
    loadRemembered();
  }, []);

  // Save or clear credentials when rememberMe changes
  useEffect(() => {
    const updateRemembered = async () => {
      if (rememberMe) {
        if (fullName && mobile && password) {
          await AsyncStorage.setItem('userSignupRememberMe', JSON.stringify({ fullName, mobile, password }));
        }
      } else {
        await AsyncStorage.removeItem('userSignupRememberMe');
      }
    };
    updateRemembered();
  }, [rememberMe]);

  // Update storage if user changes credentials while rememberMe is checked
  useEffect(() => {
    const updateIfRemembered = async () => {
      if (rememberMe && fullName && mobile && password) {
        await AsyncStorage.setItem('userSignupRememberMe', JSON.stringify({ fullName, mobile, password }));
      }
    };
    updateIfRemembered();
  }, [fullName, mobile, password]);

  const dynamicPadding = {
    paddingTop: insets.top + height * 0.04,
    paddingBottom: insets.bottom + height * 0.04,
    paddingLeft: insets.left + width * 0.05,
    paddingRight: insets.right + width * 0.05,
  };

  const validateInputs = () => {
    // Sanitize fullName
    const sanitizedFullName = fullName.trim().replace(/[^a-zA-Z\s]/g, '');
    if (!sanitizedFullName || sanitizedFullName.length < 2) {
      Alert.alert('Error', 'Please enter a valid full name (at least 2 characters, letters only)');
      console.log('[UserSignupScreen] Validation failed: Invalid full name', fullName);
      return false;
    }

    // Validate mobile number with country code
    const phoneRegex = /^\+\d{1,3}\d{9,15}$/;
    if (!phoneRegex.test(mobile)) {
      Alert.alert('Error', 'Please enter a valid mobile number with country code (e.g., +91XXXXXXXXXX)');
      console.log('[UserSignupScreen] Validation failed: Invalid mobile number', mobile);
      return false;
    }

    // Validate password
    if (!password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      console.log('[UserSignupScreen] Validation failed: Password is empty');
      return false;
    }

    return { sanitizedFullName };
  };

  const handleSignUp = async () => {
    console.log('[UserSignupScreen] Sign Up button pressed');
    const validated = validateInputs();
    if (!validated) return;

    const { sanitizedFullName } = validated;
    const signupData = {
      fullName: sanitizedFullName,
      mobileNumber: mobile.trim(),
      password: password.trim(),
      isRemember: rememberMe,
    };

    try {
      setIsLoading(true);
      console.log('[UserSignupScreen] Signup Data:', signupData);

      const response = await api.post('/user/auth/signup', signupData);
      console.log('[UserSignupScreen] API Response:', response.data);

      if (response.data?.success) {
        let confirmationResult;
        try {
          console.log('[UserSignupScreen] Initiating Firebase OTP for:', mobile);
          confirmationResult = await auth().signInWithPhoneNumber(mobile.trim());
          console.log('[UserSignupScreen] Firebase OTP sent successfully:', confirmationResult);
        } catch (error) {
          console.error('[UserSignupScreen] Firebase OTP Error:', {
            message: error.message,
            firebaseCode: error.code,
          });
          let errorMessage = 'Failed to initiate OTP verification. Please try again.';
          if (error.code === 'auth/invalid-phone-number') {
            errorMessage = 'Invalid phone number format';
          } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Too many requests. Please try again later';
          }
          Alert.alert('Error', errorMessage);
          setIsLoading(false);
          return;
        }

        const otpResponse = await api.post('/user/email-number-send-otp', { mobileNumber: mobile.trim() });
        console.log('[UserSignupScreen] OTP Response:', otpResponse.data);

        if (otpResponse.data) {
          Alert.alert('Success', 'Account created successfully! Please verify your mobile number.', [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('UserOtpVerification', {
                  mobileNumber: mobile.trim(),
                  confirmation: confirmationResult,
                  userId: response.data.data.userId,
                  fullName: sanitizedFullName,
                }),
            },
          ]);
        }
      }
    } catch (error) {
      console.error('[UserSignupScreen] Signup Error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to sign up. Please check your network or try again later.');
    } finally {
      setIsLoading(false);
    }
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
          <Text style={[styles.header, { color: '#fff' }]}>Create new{'\n'}user account</Text>

          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text style={styles.signinLink} onPress={() => navigation.navigate('UserSignin')}>
              Sign In
            </Text>
          </Text>

          <View style={styles.inputContainer}>
            <FullNameIcon width={dimensions.iconSize} height={dimensions.iconSize} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              ref={fullNameInputRef}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputContainer}>
            <MobileIcon width={dimensions.iconSize} height={dimensions.iconSize} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              placeholder="Mobile Number (e.g., +91XXXXXXXXXX)"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={setMobile}
              ref={mobileInputRef}
              editable={!isLoading}
            />
          </View>

          <View style={[styles.inputContainer, styles.passwordContainer]}>
            <LockIcon width={dimensions.iconSize} height={dimensions.iconSize} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff', flex: 1 }]}
              placeholder="Create Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              ref={passwordInputRef}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={dimensions.iconSize} color="#aaa" />
            </TouchableOpacity>
          </View>

          <View style={styles.rememberMeRow}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              thumbColor={rememberMe ? '#8A2BE2' : '#888'}
            />
            <Text style={{ color: '#fff' }}> Remember me</Text>
          </View>

          <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.signupButton, isLoading && { opacity: 0.7 }]}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={[styles.orText, { color: '#ccc' }]}>or sign up with</Text>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}>
            <GoogleIcon style={styles.socialIcon} width={dimensions.socialIconSize} height={dimensions.socialIconSize} />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}>
            <AppleIcon style={styles.socialIcon} width={dimensions.socialIconSize} height={dimensions.socialIconSize} />
            <Text style={styles.socialButtonText}>Sign up with Apple</Text>
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: '#aaa' }]}>
            By clicking "Sign Up" you agree to Recognotes{' '}
            <Text style={styles.linkText}>Terms of Use</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
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
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'Nunito Sans',
    fontWeight: '800',
    fontSize: dimensions.fontSize.large,
    lineHeight: 40,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 20,
    color: '#C6C5ED',
    alignSelf: 'stretch',
  },
  signinText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: dimensions.fontSize.body,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#aaa',
    marginBottom: 25,
  },
  signinLink: {
    fontFamily: 'Nunito Sans',
    fontWeight: '900',
    fontSize: dimensions.fontSize.body,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#A020F0',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: dimensions.borderRadius.sm,
    paddingHorizontal: 8,
    marginBottom: 15,
    height: dimensions.inputHeight,
    backgroundColor: '#000',
  },
  passwordContainer: {
    borderColor: '#8D6BFC',
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: dimensions.fontSize.body,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButton: {
    width: '100%',
    height: dimensions.buttonHeight,
    gap: 10,
    borderRadius: dimensions.borderRadius.lg,
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signupButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: dimensions.fontSize.small,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  orText: {
    fontFamily: 'Nunito Sans',
    fontSize: dimensions.fontSize.small,
    textAlign: 'center',
    marginBottom: 25,
    color: '#ccc',
  },
  socialButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#3F3F46',
    borderWidth: 1,
    borderRadius: dimensions.borderRadius.lg,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#000',
    height: dimensions.buttonHeight,
  },
  socialButtonText: {
    marginLeft: 10,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: dimensions.fontSize.body,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
  socialIcon: {
    width: dimensions.socialIconSize,
    height: dimensions.socialIconSize,
    resizeMode: 'contain',
  },
  termsText: {
    fontFamily: 'Nunito Sans',
    fontSize: dimensions.fontSize.small,
    textAlign: 'center',
    marginTop: 10,
    color: '#aaa',
  },
  linkText: {
    color: '#A020F0',
    fontWeight: '700',
  },
});

export default UserSignupScreen;