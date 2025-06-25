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

const { width, height } = Dimensions.get('window');

// Responsive dimensions for all screen sizes
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const responsiveDimensions = {
  buttonWidth: Math.min(width - 40, Math.max(width * 0.9, 300)), // 90% of screen width, min 300px, max screen width - 40px
  buttonHeight: Math.max(height * 0.065, 52), // 6.5% of screen height, min 52px
  buttonMargin: Math.max(width * 0.05, 20), // 5% of screen width, min 20px
  buttonBottom: Math.max(height * 0.05, 20), // 5% of screen height, min 20px
  borderRadius: Math.max(width * 0.035, 14), // 3.5% of screen width, min 14px
  paddingHorizontal: Math.max(width * 0.04, 16), // 4% of screen width, min 16px
  gap: Math.max(width * 0.025, 10), // 2.5% of screen width, min 10px
  // OTP specific dimensions
  otpBoxSize: Math.max(width * 0.12, 48), // 12% of screen width, min 48px
  otpGap: Math.max(width * 0.02, 8), // 2% of screen width, min 8px
  otpContainerWidth: Math.min(width * 0.8, 320), // 80% of screen width, max 320px
  // Content spacing
  contentTopMargin: Math.max(height * 0.08, 60), // 8% of screen height, min 60px
  contentBottomPadding: Math.max(height * 0.12, 100), // 12% of screen height, min 100px
  iconSize: Math.max(width * 0.06, 24), // 6% of screen width, min 24px
  titleFontSize: Math.max(width * 0.06, 24), // 6% of screen width, min 24px
  descriptionFontSize: Math.max(width * 0.035, 14), // 3.5% of screen width, min 14px
  inputFontSize: Math.max(width * 0.05, 20), // 5% of screen width, min 20px
};

const ArtistCheckMailbox = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const insets = useSafeAreaInsets();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  // Get email from navigation params
  const email = route?.params?.email || '';

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text !== '' && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
    if (text === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is missing.');
      return;
    }
    try {
      setIsResending(true);
      
      const resendData = {
        email: email
      };

      console.log("Resending Artist OTP:", resendData); // Debug log

      const response = await api.post('/artist/auth/resend-otp', resendData);

      console.log("Resend Artist OTP Response:", response.data); // Debug log

      if (response.data) {
        Alert.alert('Success', 'OTP has been resent successfully!');
        // Clear existing OTP
        setOtp(['', '', '', '']);
        // Focus on first input
        inputRefs[0]?.current?.focus();
      }
    } catch (error) {
      console.error("Resend Artist OTP Error:", error.message);
      console.error("Error Response:", error.response?.data);
      
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to resend OTP. Please try again.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleConfirm = async () => {
    const code = otp.join('');
    if (!email || code.length !== 4) {
      Alert.alert('Error', 'Please enter the 4-digit OTP and make sure email is present.');
      return;
    }
    try {
      const response = await api.post('/artist/email-verifyOtp', {
        email,
        code
      });
      if (response.data.success) {
        Alert.alert('Success', 'OTP verified successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('ArtistCreateNewPassword', { email }) }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SignUpBackground 
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <SafeAreaView style={styles.overlay}>
        <ScrollView 
          contentContainerStyle={[
            styles.scrollViewContent,
            { 
              paddingBottom: responsiveDimensions.contentBottomPadding,
              paddingHorizontal: responsiveDimensions.paddingHorizontal,
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}> 
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={responsiveDimensions.iconSize} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={[
            styles.contentArea,
            { 
              marginTop: responsiveDimensions.contentTopMargin,
              minHeight: height * 0.6, // Ensure minimum content height
            }
          ]}>
            {/* Central Icon */}
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={[
              styles.title,
              { fontSize: responsiveDimensions.titleFontSize }
            ]}>
              Check Your Mailbox
            </Text>
            <Text style={[
              styles.description,
              { fontSize: responsiveDimensions.descriptionFontSize }
            ]}>
              Please enter the 4 digit OTP code that we sent to your
              email (**********n@gmail.com)
            </Text>

            {/* OTP Input Fields */}
            <View style={[
              styles.otpContainer,
              { 
                width: responsiveDimensions.otpContainerWidth,
                gap: responsiveDimensions.otpGap,
              }
            ]}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    { 
                      width: responsiveDimensions.otpBoxSize,
                      height: responsiveDimensions.otpBoxSize,
                      fontSize: responsiveDimensions.inputFontSize,
                    }
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  value={digit}
                  ref={inputRefs[index]}
                  textAlign={'center'}
                  selectionColor={'#a95eff'}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Buttons at bottom - Responsive */}
        <View style={[
          styles.buttonContainer, 
          { 
            bottom: insets.bottom + responsiveDimensions.buttonBottom,
            paddingHorizontal: responsiveDimensions.buttonMargin,
          }
        ]}> 
          <TouchableOpacity 
            style={[
              styles.resendButton,
              {
                marginBottom: responsiveDimensions.gap,
                opacity: isResending ? 0.7 : 1,
                width: responsiveDimensions.buttonWidth,
                height: responsiveDimensions.buttonHeight,
                borderRadius: responsiveDimensions.borderRadius,
              }
            ]} 
            onPress={handleResendOTP}
            disabled={isResending}
          >
            <LinearGradient 
              colors={['#B15CDE', '#7952FC']} 
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={[
                styles.resendButtonGradient,
                { borderRadius: responsiveDimensions.borderRadius }
              ]}
            >
              <Text style={styles.resendButtonText}>
                {isResending ? 'Resending...' : 'Resend OTP'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.confirmButton,
              {
                width: responsiveDimensions.buttonWidth,
                height: responsiveDimensions.buttonHeight,
                borderRadius: responsiveDimensions.borderRadius,
              }
            ]} 
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonTextBorder}>Confirm</Text>
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
  header: {
    // paddingTop will be set dynamically with safe area insets
  },
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
    minWidth: 44,
    minHeight: 44,
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

export default ArtistCheckMailbox;
