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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import MailboxIcon from '../assets/icons/mailbox';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const CheckMailboxScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Get inputType and value from navigation params
  const { inputType = 'email', value = '' } = route?.params || {};

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    console.log('[CheckMailboxScreen] OTP input updated:', { index, value: text, currentOtp: newOtp });

    if (text !== '' && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    if (text === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }

    // Auto-submit if all digits are entered
    if (newOtp.every(digit => digit !== '') && index === otp.length - 1) {
      console.log('[CheckMailboxScreen] All OTP digits entered, triggering handleConfirm');
      handleConfirm(newOtp.join(''));
    }
  };

  const handleResendOTP = async () => {
    if (!value) {
      Alert.alert('Error', `Please provide your ${inputType === 'email' ? 'email' : 'mobile number'}.`);
      console.log('[CheckMailboxScreen] Resend OTP failed: Missing input value', { inputType, value });
      return;
    }
    try {
      setIsLoading(true);
      const otpData = inputType === 'email' ? { email: value } : { mobileNumber: value };
      console.log('[CheckMailboxScreen] Resending OTP:', { endpoint: '/host/send-otp', data: otpData });

      const response = await api.post('/host/send-otp', otpData);

      console.log('[CheckMailboxScreen] Resend OTP response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'OTP resent successfully!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP');
        console.log('[CheckMailboxScreen] Resend OTP failed:', response.data.message);
      }
    } catch (error) {
      console.error('[CheckMailboxScreen] Resend OTP error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async (code) => {
    const otpCode = code || otp.join('');
    if (!value || otpCode.length !== 4) {
      Alert.alert('Error', `Please enter the 4-digit OTP and ensure ${inputType === 'email' ? 'email' : 'mobile number'} is present.`);
      console.log('[CheckMailboxScreen] OTP verification failed: Invalid input', { value, otpCode });
      return;
    }
    try {
      setIsLoading(true);
      const verifyData = inputType === 'email' ? { email: value, code: otpCode } : { mobileNumber: value, code: otpCode };
      console.log('[CheckMailboxScreen] Verifying OTP:', { endpoint: '/host/email-verifyOtp', data: verifyData });

      const response = await api.post('host/email-verifyOtp', verifyData);

      console.log('[CheckMailboxScreen] OTP verification response:', response.data);

      if (response.data.success) {
        console.log('[CheckMailboxScreen] OTP verified successfully, navigating to CreateNewPassword');
        Alert.alert('Success', 'OTP verified successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CreateNewPassword', { inputType, value }),
          },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'OTP verification failed');
        console.log('[CheckMailboxScreen] OTP verification failed:', response.data.message);
      }
    } catch (error) {
      console.error('[CheckMailboxScreen] OTP verification error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the email or mobile number for display
  const maskedValue =
    inputType === 'email'
      ? value.replace(/(.{2}).*?@/, '***@') // Mask email (e.g., te**@gmail.com)
      : value.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'); // Mask mobile (e.g., 987****3210)

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
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={styles.title}>Check Your {inputType === 'email' ? 'Mailbox' : 'Messages'}</Text>
            <Text style={styles.description}>
              Please enter the 4-digit OTP code sent to your{' '}
              {inputType === 'email' ? 'email' : 'mobile number'} ({maskedValue})
            </Text>

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
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

        <View style={[styles.buttonContainer, { bottom: insets.bottom + 20 }]}>
          <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP} disabled={isLoading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.resendButtonGradient, { opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => handleConfirm()}
            disabled={isLoading}
          >
            <Text style={styles.confirmButtonTextBorder}>{isLoading ? 'Verifying...' : 'Confirm'}</Text>
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
  iconContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
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
    width: 361,
    opacity: 0.8,
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
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
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
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
    padding: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  resendButton: {
    width: 361,
    height: 52,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  resendButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
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
    width: 361,
    height: 52,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(198, 197, 237, 1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
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

export default CheckMailboxScreen;