import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { loginHost } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignUpBackground from '../assets/Banners/SignUp';
import OtpIcon from '../assets/icons/otp';
import LinearGradient from 'react-native-linear-gradient';
import api from '../Config/api';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

// Responsive dimensions system for all Android devices
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
    xxxl: Math.max(width * 0.08, 32),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.06, 24),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  otpBoxSize: Math.max(width * 0.1, 40),
  imageSize: Math.max(width * 0.25, 100),
};

const OtpVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputs = useRef([]);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { mobileNumber, confirmation, userId, fullName } = route.params;

  // Enhanced responsive dimensions with safe area considerations
  const responsiveDimensions = {
    ...dimensions,
    safeAreaTop: Math.max(insets.top, 0),
    safeAreaBottom: Math.max(insets.bottom, 0),
    safeAreaLeft: Math.max(insets.left, 0),
    safeAreaRight: Math.max(insets.right, 0),
    containerPadding: {
      horizontal: Math.max(insets.left + dimensions.spacing.md, dimensions.spacing.md),
      vertical: Math.max(insets.top + dimensions.spacing.sm, dimensions.spacing.sm),
    },
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      const chars = text.replace(/[^0-9]/g, '').split('').slice(0, 6);
      chars.forEach((char, idx) => {
        if (idx < 6) {
          newOtp[idx] = char;
          if (inputs.current[idx]) inputs.current[idx].setNativeProps({ text: char });
        }
      });
      setOtp(newOtp);
      inputs.current[Math.min(chars.length - 1, 5)]?.focus();
      return;
    }
    if (/^[0-9]*$/.test(text)) {
      newOtp[index] = text;
      setOtp(newOtp);
      if (text && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerify = async () => {
    try {
      if (otp.some(digit => !digit)) {
        Alert.alert('Error', 'Please enter the complete 6-digit OTP');
        return;
      }

      setIsLoading(true);

      console.log('Verifying Firebase OTP with code:', otp.join(''));
      const credential = await confirmation.confirm(otp.join(''));
      const idToken = await credential.user.getIdToken();
      console.log('Firebase OTP verified, ID token:', idToken);

      const response = await api.post('/host/firebase-auth/firebase-verify-otp', {
        mobileNumber,
        idToken,
        fullName,
      });

      console.log('Firebase Host OTP Verification Response:', response.data);

      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.headers['authorization']?.replace('Bearer ', '');

        if (!token) {
          throw new Error('No token received from server');
        }

        dispatch(loginHost({
          id: userData._id || userId,
          name: userData.fullName || fullName || 'Host User',
          email: userData.email || '',
          phone: userData.mobileNumber || mobileNumber,
          mobileNumber: mobileNumber,
          role: userData.role || 'host',
          token,
        }));

        navigation.navigate('HostVerifiedScreen');
      }
    } catch (error) {
      console.error('Firebase OTP Verification Error:', error);
      let errorMessage = 'Failed to verify OTP. Please try again.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please resend OTP.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);

      console.log('Resending Firebase OTP for:', mobileNumber);
      const confirmationResult = await auth().signInWithPhoneNumber(mobileNumber);
      console.log('Firebase OTP resent successfully:', confirmationResult);
      Alert.alert('Success', 'OTP has been resent successfully!');
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } catch (error) {
      console.error('Resend Firebase OTP Error:', error);
      let errorMessage = 'Failed to resend OTP. Please try again.';
      if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait and try again later.';
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <View style={[styles.overlay, {
        paddingTop: responsiveDimensions.safeAreaTop,
        paddingBottom: responsiveDimensions.safeAreaBottom,
        paddingLeft: responsiveDimensions.safeAreaLeft,
        paddingRight: responsiveDimensions.safeAreaRight,
      }]}>
        <TouchableOpacity style={[styles.backIcon, {
          paddingLeft: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.xl),
          paddingRight: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.xl),
        }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <OtpIcon width={52} height={52} style={styles.iconImage} />
          <Text style={styles.title}>OTP{"\n"}Verification</Text>
          <Text style={styles.emailVerifyText}>We need to verify your mobile number</Text>
          <Text style={styles.subtitle}>To verify your host account, enter the 6-digit OTP code that we sent to your mobile number ({mobileNumber}).</Text>

          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                textAlign="center"
                autoFocus={index === 0}
                selectionColor="#a95eff"
                returnKeyType="done"
                blurOnSubmit={false}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleVerify} disabled={isLoading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
            >
              <Text style={styles.primaryButtonText}>{isLoading ? 'Verifying...' : 'Verify'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.resendButton, isResending && { opacity: 0.7 }]} onPress={handleResendOtp} disabled={isResending}>
            <Text style={styles.resendText}>{isResending ? 'Resending...' : 'Resend OTP'}</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  backIcon: { 
    paddingBottom: dimensions.spacing.md,
    minWidth: Math.max(dimensions.iconSize + 16, 44),
    minHeight: Math.max(dimensions.iconSize + 16, 44),
    justifyContent: 'center',
  },
  content: { 
    padding: dimensions.spacing.xxl,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: dimensions.spacing.xxxl * 2,
  },
  iconImage: {
    width: 52,
    height: 52,
    resizeMode: 'contain',
    marginBottom: dimensions.spacing.md,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    color: 'rgb(255, 255, 255)',
    textAlign: 'center',
    alignSelf: 'stretch',
    letterSpacing: 0,
    marginBottom: 8,
  },
  emailVerifyText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#fff',
    marginBottom: dimensions.spacing.xxl,
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 21,
    color: '#fff',
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    marginTop: 12,
    paddingHorizontal: isSmallPhone ? dimensions.spacing.sm : dimensions.spacing.md,
    gap: isSmallPhone ? dimensions.spacing.xs : dimensions.spacing.sm,
  },
  otpInput: {
    width: dimensions.otpBoxSize,
    height: dimensions.otpBoxSize,
    borderRadius: dimensions.borderRadius.md,
    fontSize: dimensions.fontSize.large,
    fontWeight: 'bold',
    borderWidth: 2,
    borderColor: '#333',
    color: '#fff',
    backgroundColor: '#1a1a1a',
    textAlign: 'center',
    minWidth: 40,
    minHeight: 40,
  },
  primaryButton: {
    width: 325,
    height: 44,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: dimensions.spacing.xl,
    shadowColor: '#a95eff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  resendButton: {
    width: 325,
    height: 44,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
  },
  resendText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 13,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
});

export default OtpVerificationScreen;