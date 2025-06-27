import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import ForgotIcon from '../assets/icons/forgot';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
  const [inputType, setInputType] = useState('email'); // 'email' or 'mobile'
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleConfirm = async () => {
    try {
      // Input validation
      if (inputType === 'email') {
        if (!email.trim()) {
          Alert.alert('Error', 'Please enter your email address');
          console.log('[ForgotPasswordScreen] Validation failed: Email is empty');
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          Alert.alert('Error', 'Please enter a valid email address');
          console.log('[ForgotPasswordScreen] Validation failed: Invalid email format', email);
          return;
        }
      } else {
        if (!mobileNumber.trim()) {
          Alert.alert('Error', 'Please enter your mobile number');
          console.log('[ForgotPasswordScreen] Validation failed: Mobile number is empty');
          return;
        }
        const mobileRegex = /^[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber.trim())) {
          Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
          console.log('[ForgotPasswordScreen] Validation failed: Invalid mobile number format', mobileNumber);
          return;
        }
      }

      setIsLoading(true);

      const otpData = inputType === 'email' ? { email: email.trim() } : { mobileNumber: mobileNumber.trim() };
      console.log('[ForgotPasswordScreen] Sending OTP request:', { endpoint: 'host/email-sendOtp', data: otpData });

      const response = await api.post('host/email-sendOtp', otpData);

      console.log('[ForgotPasswordScreen] OTP response:', response.data);

      if (response.data.success) {
        console.log('[ForgotPasswordScreen] OTP sent successfully, navigating to CheckMailboxScreen');
        navigation.navigate('CheckMailBox', {
          inputType,
          value: inputType === 'email' ? email.trim() : mobileNumber.trim(),
        });
      } else {
        console.log('[ForgotPasswordScreen] OTP request failed:', response.data.message);
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('[ForgotPasswordScreen] OTP request error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP. Please try again.');
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
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, inputType === 'email' ? styles.toggleButtonActive : null]}
                onPress={() => {
                  setInputType('email');
                  setMobileNumber('');
                  console.log('[ForgotPasswordScreen] Switched input type to email');
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
                  console.log('[ForgotPasswordScreen] Switched input type to mobile');
                }}
              >
                <Text style={[styles.toggleText, inputType === 'mobile' ? styles.toggleTextActive : null]}>
                  Mobile
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Field */}
            <View style={styles.inputContainer}>
              <Ionicons
                name={inputType === 'email' ? 'mail-outline' : 'call-outline'}
                size={20}
                color="#aaa"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={inputType === 'email' ? 'scenezone@gmail.com' : '9876543210'}
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
          style={[styles.confirmButton, { bottom: insets.bottom + 60 }]}
          onPress={handleConfirm}
          disabled={isLoading}
        >
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.confirmButtonGradient, { opacity: isLoading ? 0.7 : 1 }]}
          >
            <Text style={styles.confirmButtonText}>{isLoading ? 'Sending...' : 'Confirm'}</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    width: 361,
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
    width: 361,
    height: 52,
    left: 16,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
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
});

export default ForgotPasswordScreen;