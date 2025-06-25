import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { loginHost } from '../Redux/slices/authSlice';
import LinearGradient from 'react-native-linear-gradient';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MobileIcon from '../assets/icons/mobile';
import LockIcon from '../assets/icons/lock';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const SignInScreen = ({ navigation }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const scheme = useColorScheme();
  const isDark = true; // force dark mode
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const background = '#000';
  const cardBg = '#1a1a1a';
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
      if (!mobileNumber.trim() || isNaN(mobileNumber) || mobileNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid mobile number (at least 10 digits)');
        return;
      }

      if (!password.trim()) {
        Alert.alert('Error', 'Please enter your password');
        return;
      }

      setIsLoading(true);

      const loginData = {
        mobileNumber: parseInt(mobileNumber),
        password: password.trim()
      };

      console.log("Login Data:", loginData); // Debug log

      const response = await api.post('/host/auth/loginFromPassword', loginData);

      console.log("Login Response:", response.data); // Debug log

      if (response.data) {
        // Dispatch login action with user data
        dispatch(loginHost({
          id: response.data.data.user.id || 'host123',
          name: response.data.data.user.fullName || 'Kevin Richards',
          email: response.data.data.user.email || 'host@example.com',
          phone: response.data.data.user.mobileNumber || '+91 412-123-4215',
          token: response.data.data.token // Store the token from the response
        }));
        
        // Navigate to OTP verification screen
        navigation.navigate('MainTabs', { mobileNumber: mobileNumber });
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      console.error("Error Response:", error.response?.data);
      
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
      if (!mobileNumber.trim() || isNaN(mobileNumber) || mobileNumber.length < 10) {
        Alert.alert('Error', 'Please enter a valid mobile number (at least 10 digits)');
        return;
      }

      setIsLoading(true);

      const loginData = {
        mobileNumber: mobileNumber
      };

      console.log("OTP Login Data:", loginData); // Debug log

      const response = await api.post('/host/auth/login', loginData);

      console.log("OTP Login Response:", response.data); // Debug log

      if (response.data) {
        // Navigate to OTP verification screen with mobile number
        navigation.navigate('OtpVerify', { mobileNumber: mobileNumber });
      }
    } catch (error) {
      console.error("OTP Login Error:", error.message);
      console.error("Error Response:", error.response?.data);
      
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to initiate OTP login. Please try again.'
      );
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
      <SignUpBackground 
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          contentContainerStyle={[styles.inner, dynamicPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: text }]}>
            Sign in to{'\n'}your account
          </Text>

          <Text style={[styles.subtitle, { color: placeholder }]}>
            Don't have an account?{' '}
            <Text style={styles.signup} onPress={() => navigation.navigate('Signup')}>
              Sign Up
            </Text>
          </Text>

          {/* Phone Input */}
          <View style={[styles.inputContainer, { marginTop: 0 }, { backgroundColor: cardBg, borderColor: border }]}>
            <MobileIcon width={20} height={20} style={styles.inputIcon} />
            <TextInput
              placeholder="Mobile Number"
              placeholderTextColor={placeholder}
              style={[styles.input, { color: text }]}
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
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
                <Text style={[styles.rememberText, { color: text }]}> Remember me</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
                <Text style={styles.forgot}>Forgot Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sign In Button */}
          <TouchableOpacity 
            onPress={isOtpLogin ? handleOtpLogin : handleSignIn} 
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
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
              {isOtpLogin ? 'Login with Password' : 'Login With OTP'}
            </Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity style={styles.socialButton}>
            <GoogleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          {/* Apple Sign In */}
          <TouchableOpacity style={styles.socialButton}>
            <AppleIcon style={styles.socialIcon} width={24} height={24} />
            <Text style={styles.socialButtonText}>Sign in with Apple</Text>
          </TouchableOpacity>
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
    color: '#a95eff' 
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
  inputIcon: { marginRight: 8 },
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
    width: width * 0.95, // 95% of screen width
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
});

export default SignInScreen;
