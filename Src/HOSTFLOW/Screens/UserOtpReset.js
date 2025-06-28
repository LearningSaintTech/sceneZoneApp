import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import api from '../Config/api';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Responsive dimensions for all screen sizes
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const responsiveDimensions = {
  buttonWidth: Math.min(width - 32, Math.max(width * 0.9, 300)),
  buttonHeight: Math.max(height * 0.065, 48),
  buttonMargin: Math.max(width * 0.04, 16),
  buttonBottom: Math.max(height * 0.08, 60),
  borderRadius: Math.max(width * 0.035, 12),
  paddingHorizontal: Math.max(width * 0.04, 16),
  otpInputWidth: Math.max(width * 0.12, 50), // Responsive OTP input width
};

const UserOtpResetScreen = ({ navigation }) => {
  const route = useRoute();
  const { inputType = 'email', value } = route.params || {};
  console.log(`[UserOtpResetScreen] ${inputType} from route params:`, value);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to the next input field if a digit is entered
    if (text && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    // Move to the previous input field if backspace is pressed and the current field is empty
    if (!text && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!value) {
      Alert.alert('Error', 'No contact information provided.');
      console.log('[UserOtpResetScreen] Resend OTP failed: No contact information');
      return;
    }

    setIsLoading(true);
    try {
      const otpData = inputType === 'email' ? { email: value } : { mobileNumber: value };
      console.log('[UserOtpResetScreen] Resending OTP request:', { endpoint: '/user/email-number-send-otp', data: otpData });

      const response = await api.post('/user/email-number-send-otp', otpData);

      console.log('[UserOtpResetScreen] Resend OTP response:', response.data);

      if (response?.data?.success) {
        Alert.alert('Success', 'OTP resent successfully');
        setOtp(['', '', '', '']); // Clear OTP fields
        inputRefs[0].current.focus(); // Focus on first input
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('[UserOtpResetScreen] Resend OTP error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit OTP');
      console.log('[UserOtpResetScreen] Validation failed: Incomplete OTP', enteredOtp);
      return;
    }

    if (!value) {
      Alert.alert('Error', 'No contact information provided.');
      console.log('[UserOtpResetScreen] Verification failed: No contact information');
      return;
    }

    setIsLoading(true);
    try {
      const otpData = inputType === 'email' ? { email: value, code: enteredOtp } : { mobileNumber: value, code: enteredOtp };
      console.log('[UserOtpResetScreen] Verifying OTP request:', { endpoint: 'user/verify-email-number-otp', data: otpData });

      const response = await api.post('user/verify-email-number-otp', otpData);

      console.log('[UserOtpResetScreen] OTP Verification Response:', response.data);

      if (response?.data?.success) {
        Alert.alert('Success', 'OTP Verified Successfully');
        navigation.navigate('UserCreateNewPassword', { inputType, value });
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('[UserOtpResetScreen] OTP Verification Failed:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the email or mobile number for display
  const maskContact = (contact, type) => {
    if (type === 'email' && contact) {
      const [localPart, domain] = contact.split('@');
      if (localPart.length > 3) {
        return `${localPart.slice(0, 2)}${'*'.repeat(localPart.length - 2)}@${domain}`;
      }
      return contact;
    } else if (type === 'mobile' && contact) {
      return contact.length > 4 ? `******${contact.slice(-4)}` : contact;
    }
    return 'your contact';
  };

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentArea}>
            <Text style={styles.title}>Check Your {inputType === 'email' ? 'Mailbox' : 'Messages'}</Text>
            <Text style={styles.description}>
              Please enter the 4-digit OTP code sent to your {inputType === 'email' ? 'email' : 'mobile number'} (
              {maskContact(value, inputType)})
            </Text>

            <View style={[styles.otpContainer, { width: responsiveDimensions.buttonWidth, alignSelf: 'center' }]}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[styles.otpInput, { width: responsiveDimensions.otpInputWidth }]}
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

        <View
          style={[
            styles.buttonContainer,
            { bottom: insets.bottom + responsiveDimensions.buttonBottom, paddingHorizontal: responsiveDimensions.paddingHorizontal },
          ]}
        >
          <TouchableOpacity
            style={[styles.resendButton, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius }]}
            onPress={handleResendOTP}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.resendButtonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.resendButtonText}>{isLoading ? 'Sending...' : 'Resend OTP'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.resendButton, { width: responsiveDimensions.buttonWidth, height: responsiveDimensions.buttonHeight, borderRadius: responsiveDimensions.borderRadius }]}
            onPress={handleConfirm}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.resendButtonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.resendButtonText}>{isLoading ? 'Verifying...' : 'Confirm'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  header: {},
  contentArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 80,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 10,
  },
  description: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 0.8)',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#a95eff',
    borderRadius: 10,
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  resendButton: {
    gap: 10,
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
});

export default UserOtpResetScreen;