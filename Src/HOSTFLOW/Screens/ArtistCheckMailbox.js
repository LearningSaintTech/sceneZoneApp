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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import MailboxIcon from '../assets/icons/mailbox';

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
};

const ArtistCheckMailbox = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const insets = useSafeAreaInsets();
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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

  const handleResendOTP = () => {
    // Handle resend OTP logic
  };

  const handleConfirm = () => {
    navigation.navigate('ArtistCreateNewPassword');
  };

  return (
    <View style={styles.container}>
      <SignUpBackground 
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <SafeAreaView style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={[styles.header, { paddingTop: insets.top + 20 }]}> 
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.contentArea}>
            {/* Central Icon */}
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={styles.title}>Check Your Mailbox</Text>
            <Text style={styles.description}>
              Please enter the 4 digit OTP code that we sent to your
              email (**********n@gmail.com)
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
              }
            ]} 
            onPress={handleResendOTP}
          >
            <LinearGradient 
              colors={['#B15CDE', '#7952FC']} 
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.resendButtonGradient}
            >
              <Text style={styles.resendButtonText}>Resend OTP</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.confirmButton} 
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonTextBorder}>Confirm</Text>
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
    paddingBottom: 160, // Add padding at the bottom to prevent buttons from covering content
  },
  header: {
    // paddingTop will be set dynamically with safe area insets
  },
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
    height: 42,
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
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  resendButton: {
    display: 'flex',
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 14,
    overflow: 'hidden',
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
    display: 'flex',
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C6C5ED',
    overflow: 'hidden',
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
