import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Alert,
  Modal as RNModal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import ForgotIcon from '../assets/icons/forgot';
import api from '../Config/api';
import auth from '@react-native-firebase/auth';

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
  paddingRight: Math.max(width * 0.12, 50),
};

const UserForgotPasswordScreen = ({ navigation }) => {
  const [inputType, setInputType] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });

  const handleConfirm = async () => {
    try {
      if (inputType === 'email') {
        if (!email.trim()) {
          setCustomAlert({ visible: true, title: 'Error', message: 'Please enter your email address' });
          console.log('[UserForgotPasswordScreen] Validation failed: Email is empty');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          setCustomAlert({ visible: true, title: 'Error', message: 'Please enter a valid email address' });
          console.log('[UserForgotPasswordScreen] Validation failed: Invalid email format', email);
          return;
        }

        setIsLoading(true);

        const otpData = { email: email.trim() };
        console.log('[UserForgotPasswordScreen] Sending email OTP request:', { endpoint: '/user/email-number-send-otp', data: otpData });

        const response = await api.post('/user/email-number-send-otp', otpData);

        console.log('[UserForgotPasswordScreen] Email OTP response:', response.data);

        if (response.data) {
          console.log('[UserForgotPasswordScreen] Email OTP sent successfully, navigating to UserCheckMailbox');
          navigation.navigate('UserCheckMailbox', {
            inputType,
            value: email.trim(),
            isFirebase: false,
            isForgotPassword: true,
          });
        } else {
          console.log('[UserForgotPasswordScreen] Email OTP request failed:', response.data.message);
          setCustomAlert({ visible: true, title: 'Error', message: response.data.message || 'Failed to send OTP' });
        }
      } else {
        const phoneRegex = /^\+\d{1,3}\d{9,15}$/;
        if (!phoneRegex.test(mobileNumber.trim())) {
          setCustomAlert({ visible: true, title: 'Error', message: 'Please enter a valid mobile number with country code (e.g., +91XXXXXXXXXX)' });
          console.log('[UserForgotPasswordScreen] Validation failed: Invalid mobile number format', mobileNumber);
          return;
        }

        setIsLoading(true);

        const otpData = { mobileNumber: mobileNumber.trim() };
        console.log('[UserForgotPasswordScreen] Sending mobile OTP request:', { endpoint: '/user/firebase-auth/firebase-login', data: otpData });

        const response = await api.post('/user/firebase-auth/firebase-login', otpData);

        console.log('[UserForgotPasswordScreen] Mobile OTP response:', response.data);

        if (response.data.success) {
          console.log('[UserForgotPasswordScreen] Initiating Firebase phone auth for:', mobileNumber);
          const confirmationResult = await auth().signInWithPhoneNumber(mobileNumber.trim());
          console.log('[UserForgotPasswordScreen] Firebase OTP sent successfully:', confirmationResult);

          setCustomAlert({
            visible: true,
            title: 'Success',
            message: 'OTP sent to your mobile number',
          });
          Alert.alert(
            'Success',
            'OTP sent to your mobile number',
            [
              {
                text: 'OK',
                onPress: () =>
                  navigation.navigate('CheckMailBox', {
                    mobileNumber: mobileNumber.trim(),
                    confirmation: confirmationResult,
                    fullName: response.data.data.user?.fullName || '',
                    isForgotPassword: true,
                  }),
              },
            ],
          );
        } else {
          console.log('[UserForgotPasswordScreen] Mobile OTP request failed:', response.data.message);
          setCustomAlert({ visible: true, title: 'Error', message: response.data.message || 'Failed to send OTP' });
        }
      }
    } catch (error) {
      console.error('[UserForgotPasswordScreen] OTP request error:', {
        message: error.message,
        response: error.response?.data,
        firebaseCode: error.code,
      });
      let errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      setCustomAlert({ visible: true, title: 'Error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
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
            <View style={styles.iconContainer}>
              <ForgotIcon width={53} height={52} />
            </View>

            <Text style={styles.title}>Forgot Your Password?</Text>
            <Text style={styles.description}>
              Please enter your {inputType === 'email' ? 'email address' : 'mobile number'} to send the OTP
              verification to reset your password
            </Text>

            {/* Toggle between Email and Mobile */}
            <View style={[styles.toggleContainer, { width: responsiveDimensions.buttonWidth, alignSelf: 'center' }]}>
              <TouchableOpacity
                style={[styles.toggleButton, inputType === 'email' ? styles.toggleButtonActive : null]}
                onPress={() => {
                  setInputType('email');
                  setMobileNumber('');
                  console.log('[UserForgotPasswordScreen] Switched input type to email');
                }}
              >
                <Text style={[styles.toggleText, inputType === 'email' ? styles.toggleTextActive : null]}>
                  Email
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, inputType === 'mobile' ? styles.toggleButtonActive : null]}
                onPress={() => {
                  setInputType('mobile');
                  setEmail('');
                  console.log('[UserForgotPasswordScreen] Switched input type to mobile');
                }}
              >
                <Text style={[styles.toggleText, inputType === 'mobile' ? styles.toggleTextActive : null]}>
                  Mobile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Field */}
            <View style={[styles.inputContainer, { width: responsiveDimensions.buttonWidth, alignSelf: 'center' }]}>
              <Ionicons
                name={inputType === 'email' ? 'mail-outline' : 'call-outline'}
                size={20}
                color="#aaa"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={inputType === 'email' ? 'user@email.com' : '+91XXXXXXXXXX'}
                placeholderTextColor="#aaa"
                value={inputType === 'email' ? email : mobileNumber}
                onChangeText={inputType === 'email' ? setEmail : setMobileNumber}
                keyboardType={inputType === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              bottom: insets.bottom + responsiveDimensions.buttonBottom,
              width: responsiveDimensions.buttonWidth,
              height: responsiveDimensions.buttonHeight,
              left: (width - responsiveDimensions.buttonWidth) / 2,
              borderRadius: responsiveDimensions.borderRadius,
              paddingHorizontal: responsiveDimensions.paddingHorizontal,
            },
          ]}
          onPress={handleConfirm}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.confirmButtonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
          >
            <Text style={styles.confirmButtonText}>{isLoading ? 'Sending...' : 'Confirm'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        <CustomAlertModal />
      </SafeAreaView>
    </View>
  );
};

const CustomAlertModal = () => (
  <RNModal
    visible={customAlert.visible}
    transparent
    animationType="fade"
    onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
  >
    <View style={styles.shortlistModalOverlay}>
      <View style={styles.shortlistModalContent}>
        <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
        <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
        <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
        <TouchableOpacity
          style={styles.shortlistModalButton}
          onPress={() => setCustomAlert({ ...customAlert, visible: false })}
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
    paddingBottom: 100,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#8D6BFC',
  },
  toggleText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: '#fff',
  },
  inputContainer: {
    height: 48,
    gap: 12,
    borderRadius: 12,
    paddingRight: 16,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: 'rgba(141, 107, 252, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginBottom: 20,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  confirmButton: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  confirmButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  shortlistModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  shortlistModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
  },
  shortlistModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  shortlistModalMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 24,
  },
  shortlistModalButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shortlistModalButtonGradient: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  shortlistModalButtonText: {
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

export default UserForgotPasswordScreen;