import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import MailboxIcon from '../assets/icons/mailbox';
import api from '../Config/api';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

// Responsive dimensions for all screen sizes
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const responsiveDimensions = {
  buttonWidth: Math.min(width - 40, Math.max(width * 0.9, 300)),
  buttonHeight: Math.max(height * 0.065, 52),
  buttonMargin: Math.max(width * 0.05, 20),
  buttonBottom: Math.max(height * 0.05, 20),
  borderRadius: Math.max(width * 0.035, 14),
  paddingHorizontal: Math.max(width * 0.04, 16),
  gap: Math.max(width * 0.025, 10),
  otpBoxSize: Math.max(width * 0.1, 40),
  otpGap: Math.max(width * 0.015, 6),
  otpContainerWidth: Math.min(width * 0.9, 360),
  contentTopMargin: Math.max(height * 0.08, 60),
  contentBottomPadding: Math.max(height * 0.12, 100),
  iconSize: Math.max(width * 0.06, 24),
  titleFontSize: Math.max(width * 0.06, 24),
  descriptionFontSize: Math.max(width * 0.035, 14),
  inputFontSize: Math.max(width * 0.045, 18),
};

const UserCheckMailbox = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const { inputType = 'email', value = '', confirmation, isFirebase = false, fullName = '', isForgotPassword = false } = route?.params || {};

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    console.log('[UserCheckMailbox] OTP input updated:', { index, value: text, currentOtp: newOtp });

    if (text !== '' && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    if (text === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    if (newOtp.every(digit => digit !== '') && index === otp.length - 1) {
      console.log('[UserCheckMailbox] All OTP digits entered, triggering handleConfirm');
      handleConfirm(newOtp.join(''));
    }
  };

  const handleResendOTP = async () => {
    if (!value) {
      Alert.alert('Error', `Please provide your ${inputType === 'email' ? 'email' : 'mobile number'}.`);
      console.log('[UserCheckMailbox] Resend OTP failed: Missing input value', { inputType, value });
      return;
    }
    try {
      setIsLoading(true);
      if (isFirebase) {
        console.log('[UserCheckMailbox] Resending Firebase OTP for:', value);
        const confirmationResult = await auth().signInWithPhoneNumber(value);
        console.log('[UserCheckMailbox] Firebase OTP resent successfully:', confirmationResult);

        Alert.alert('Success', 'OTP resent successfully!');
        setOtp(['', '', '', '', '', '']);
        inputRefs[0]?.current?.focus();

        navigation.setParams({ confirmation: confirmationResult });
      } else {
        const otpData = inputType === 'email' ? { email: value } : { mobileNumber: value };
        console.log('[UserCheckMailbox] Resending OTP:', { endpoint: '/user/email-number-send-otp', data: otpData });

        const response = await api.post('/user/email-number-send-otp', otpData);

        console.log('[UserCheckMailbox] Resend OTP response:', response.data);

        if (response.data) {
          Alert.alert('Success', 'OTP resent successfully!');
          setOtp(['', '', '', '', '', '']);
          inputRefs[0]?.current?.focus();
        } else {
          Alert.alert('Error', response.data.message || 'Failed to resend OTP');
          console.log('[UserCheckMailbox] Resend OTP failed:', response.data.message);
        }
      }
    } catch (error) {
      console.error('[UserCheckMailbox] Resend OTP error:', {
        message: error.message,
        response: error.response?.data,
        firebaseCode: error.code,
      });
      let errorMessage = error.response?.data?.message || 'Failed to resend OTP';
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

  const handleConfirm = async (code) => {
    const otpCode = code || otp.join('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\+\d{1,3}\d{9,15}$/;

    if (!value || otpCode.length !== 6) {
      Alert.alert('Error', `Please enter the 6-digit OTP and ensure ${inputType === 'email' ? 'email' : 'mobile number'} is present.`);
      console.log('[UserCheckMailbox] OTP verification failed: Invalid input', { value, otpCode });
      return;
    }

    if (inputType === 'email' && !emailRegex.test(value)) {
      Alert.alert('Error', 'Invalid email format.');
      console.log('[UserCheckMailbox] OTP verification failed: Invalid email', { value });
      return;
    }

    if (inputType === 'mobile' && !mobileRegex.test(value)) {
      Alert.alert('Error', 'Invalid mobile number. It must include country code (e.g., +91XXXXXXXXXX).');
      console.log('[UserCheckMailbox] OTP verification failed: Invalid mobile number', { value });
      return;
    }

    try {
      setIsLoading(true);
      if (isFirebase) {
        if (!confirmation) {
          Alert.alert('Error', 'OTP session expired. Please request a new OTP.');
          console.log('[UserCheckMailbox] OTP verification failed: Missing confirmation object');
          return;
        }

        console.log('[UserCheckMailbox] Verifying Firebase OTP with code:', otpCode);
        const credential = await confirmation.confirm(otpCode);
        const idToken = await auth().currentUser.getIdToken();
        console.log('[UserCheckMailbox] Firebase OTP verified, ID token:', idToken);

        const verifyData = {
          mobileNumber: value,
          idToken,
          fullName,
        };
        console.log('[UserCheckMailbox] Verifying Firebase OTP:', { endpoint: '/user/firebase-auth/firebase-verify-otp', data: verifyData });

        const response = await api.post('/user/firebase-auth/firebase-verify-otp', verifyData);

        console.log('[UserCheckMailbox] Firebase OTP verification response:', response.data);

        if (response.data.success) {
          console.log('[UserCheckMailbox] Firebase OTP verified successfully, navigating to UserCreateNewPassword');
          Alert.alert('Success', 'OTP verified successfully!', [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('UserCreateNewPassword', {
                  inputType,
                  value,
                  token: response.headers['authorization']?.replace('Bearer ', '') || '',
                  isForgotPassword: true,
                }),
            },
          ]);
        } else {
          Alert.alert('Error', response.data.message || 'Firebase OTP verification failed');
          console.log('[UserCheckMailbox] Firebase OTP verification failed:', response.data.message);
        }
      } else {
        const verifyData = inputType === 'email' ? { email: value, code: otpCode } : { mobileNumber: value, code: otpCode };
        console.log('[UserCheckMailbox] Verifying OTP:', { endpoint: '/user/verify-email-number-otp', data: verifyData });

        const response = await api.post('/user/verify-email-number-otp', verifyData);

        console.log('[UserCheckMailbox] OTP verification response:', response.data);

        if (response.data.success) {
          console.log('[UserCheckMailbox] OTP verified successfully, navigating to UserCreateNewPassword');
          Alert.alert('Success', 'OTP verified successfully!', [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('UserCreateNewPassword', {
                  inputType,
                  value,
                  token: response.headers['authorization']?.replace('Bearer ', '') || '',
                  isForgotPassword: true,
                }),
            },
          ]);
        } else {
          Alert.alert('Error', response.data.message || 'OTP verification failed');
          console.log('[UserCheckMailbox] OTP verification failed:', response.data.message);
        }
      }
    } catch (error) {
      console.error('[UserCheckMailbox] OTP verification error:', {
        message: error.message,
        response: error.response?.data,
        firebaseCode: error.code,
      });
      let errorMessage = error.response?.data?.message || 'OTP verification failed';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const maskedValue =
    inputType === 'email'
      ? value.replace(/(.{2}).*?@/, '***@')
      : value.replace(/(\+\d{1,3}\d{3})\d{4}(\d{3})/, '$1****$2');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom: responsiveDimensions.contentBottomPadding,
              paddingHorizontal: responsiveDimensions.paddingHorizontal,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={responsiveDimensions.iconSize} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[styles.contentArea, { marginTop: responsiveDimensions.contentTopMargin }]}>
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={[styles.title, { fontSize: responsiveDimensions.titleFontSize }]}>
              Check Your {inputType === 'email' ? 'Mailbox' : 'Messages'}
            </Text>
            <Text style={[styles.description, { fontSize: responsiveDimensions.descriptionFontSize }]}>
              Please enter the 6-digit OTP code sent to your{' '}
              {inputType === 'email' ? 'email' : 'mobile number'} ({maskedValue})
            </Text>

            <View style={[styles.otpContainer, { width: responsiveDimensions.otpContainerWidth, gap: responsiveDimensions.otpGap }]}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    {
                      width: responsiveDimensions.otpBoxSize,
                      height: responsiveDimensions.otpBoxSize,
                      fontSize: responsiveDimensions.inputFontSize,
                    },
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  value={digit}
                  ref={inputRefs[index]}
                  textAlign="center"
                  selectionColor="#a95eff"
                  editable={!isLoading}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { bottom: insets.bottom + responsiveDimensions.buttonBottom, paddingHorizontal: responsiveDimensions.buttonMargin }]}>
          <TouchableOpacity
            style={[styles.resendButton, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius }]}
            onPress={handleResendOTP}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.resendButtonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.resendButtonText}>{isLoading ? 'Resending...' : 'Resend OTP'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius }]}
            onPress={() => handleConfirm()}
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonTextBorder}>{isLoading ? 'Verifying...' : 'Confirm'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
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
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {},
  contentArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 10,
  },
  description: {
    opacity: 0.8,
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#a95eff',
    borderRadius: 10,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#1a1a1a',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  resendButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    overflow: 'hidden',
    marginBottom: 12,
  },
  resendButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#C6C5ED',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  confirmButtonTextBorder: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
});

export default UserCheckMailbox;