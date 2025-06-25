import React, { useRef, useState } from 'react';
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { loginArtist } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignUpBackground from '../assets/Banners/SignUp';
import OtpIcon from '../assets/icons/otp';
import LinearGradient from 'react-native-linear-gradient';

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
  otpBoxSize: Math.max(width * 0.12, 48),
  imageSize: Math.max(width * 0.25, 100),
  modalImageSize: Math.max(width * 0.2, 80),
};

const ArtistOtpVerificationScreen = ({ navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

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
    // Modal specific responsive dimensions
    modalPadding: {
      horizontal: Math.max(width * 0.08, 20) + Math.max(insets.left, insets.right),
      vertical: Math.max(height * 0.1, 40) + Math.max(insets.top, insets.bottom),
    },
    modalWidth: Math.min(width - (Math.max(width * 0.16, 40) + Math.max(insets.left + insets.right, 0)), isTablet ? 400 : 320),
    modalContentPadding: {
      horizontal: Math.max(width * 0.06, 20),
      vertical: Math.max(height * 0.025, 16),
    },
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    if (text.length > 1) {
      const chars = text.split('').slice(0, 4);
      chars.forEach((char, idx) => {
        newOtp[idx] = char;
        if (inputs.current[idx]) inputs.current[idx].setNativeProps({ text: char });
      });
      setOtp(newOtp);
      inputs.current[chars.length - 1]?.focus();
      return;
    }
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    navigation.navigate('ArtistVerifiedScreen');
  };

  return (
    <View style={styles.container}>
      <SignUpBackground 
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <View style={[
        styles.overlay,
        { 
          paddingTop: responsiveDimensions.safeAreaTop,
          paddingBottom: responsiveDimensions.safeAreaBottom,
          paddingLeft: responsiveDimensions.safeAreaLeft,
          paddingRight: responsiveDimensions.safeAreaRight,
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.backIcon,
            {
              paddingLeft: Math.max(responsiveDimensions.safeAreaLeft + dimensions.spacing.md, dimensions.spacing.xl),
              paddingRight: Math.max(responsiveDimensions.safeAreaRight + dimensions.spacing.md, dimensions.spacing.xl),
            }
          ]} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <OtpIcon
            width={52}
            height={52}
            style={styles.iconImage}
          />
          <Text style={styles.title}>
            OTP{"\n"}Verification
          </Text>
          <Text style={styles.emailVerifyText}>
            We need to verify your email
          </Text>
          <Text style={styles.subtitle}>
            To verify your artist account, enter the 4 digit OTP code that we sent to your email.
          </Text>

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

          <TouchableOpacity onPress={handleVerify}>
            <LinearGradient 
              colors={['#B15CDE', '#7952FC']} 
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Resend OTP</Text>
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
    paddingHorizontal: isSmallPhone ? dimensions.spacing.sm : dimensions.spacing.lg,
    gap: dimensions.spacing.sm,
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
    minWidth: 44,
    minHeight: 44,
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

export default ArtistOtpVerificationScreen; 