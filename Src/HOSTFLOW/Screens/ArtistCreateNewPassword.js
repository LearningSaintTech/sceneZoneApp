import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Image,
  SafeAreaView,
  Alert,
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
  buttonWidth: Math.min(width - 40, Math.max(width * 0.9, 300)),
  buttonHeight: Math.max(height * 0.065, 52),
  buttonMargin: Math.max(width * 0.05, 20),
  buttonBottom: Math.max(height * 0.05, 20),
  borderRadius: Math.max(width * 0.035, 14),
  paddingHorizontal: Math.max(width * 0.04, 16),
  gap: Math.max(width * 0.025, 10),
  contentTopMargin: Math.max(height * 0.08, 60),
  contentBottomPadding: Math.max(height * 0.12, 100),
  iconSize: Math.max(width * 0.06, 24),
  titleFontSize: Math.max(width * 0.06, 24),
  descriptionFontSize: Math.max(width * 0.035, 14),
  inputFontSize: Math.max(width * 0.05, 16),
};

const ArtistCreateNewPassword = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  // Get inputType and value from navigation params
  console.log('[ArtistCreateNewPassword] Received params:', route?.params);
  const { inputType = 'email', value = '' } = route?.params || {};

  const handleResetPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^\d{10}$/;

    if (!value) {
      Alert.alert('Error', `Please provide your ${inputType === 'email' ? 'email' : 'mobile number'}.`);
      console.log('[ArtistCreateNewPassword] Reset failed: Missing input value', { inputType, value });
      return;
    }

    if (inputType === 'email' && !emailRegex.test(value)) {
      Alert.alert('Error', 'Invalid email format.');
      console.log('[ArtistCreateNewPassword] Reset failed: Invalid email', { value });
      return;
    }

    if (inputType === 'mobile' && !mobileRegex.test(value)) {
      Alert.alert('Error', 'Invalid mobile number. It must be 10 digits.');
      console.log('[ArtistCreateNewPassword] Reset failed: Invalid mobile number', { value });
      return;
    }

    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      console.log('[ArtistCreateNewPassword] Reset failed: Password or confirm password empty');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      console.log('[ArtistCreateNewPassword] Reset failed: Invalid password format', { password });
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      console.log('[ArtistCreateNewPassword] Reset failed: Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const resetData = inputType === 'email' ? { email: value, password } : { mobileNumber: value, password };
      console.log('[ArtistCreateNewPassword] Resetting password:', { endpoint: '/artist/set-newpassword', data: resetData });

      const response = await api.post('/artist/set-newpassword', resetData);

      console.log('[ArtistCreateNewPassword] Reset password response:', response.data);

      if (response.data.success) {
        console.log('[ArtistCreateNewPassword] Password reset successful, showing success modal');
        if (response.data.success) {
          const userData = response.data.data.user;
          const token = response.headers['authorization']?.replace('Bearer ', '');
      
          console.log('handleVerify - User Data:', userData);
          console.log('handleVerify - Token:', token);
      
          if (!token) {
            console.warn('No token found in response headers');
            Alert.alert('Error', 'Authentication failed: No token received.');
            return;
          }
      
          dispatch(loginArtist({
            id: userData._id || userData.id,
            name: userData.fullName || 'Artist User',
            email: userData.email || 'artist@example.com',
            phone: userData.mobileNumber || mobileNumber,
            mobileNumber: mobileNumber,
            location: null,
            role: userData.role || 'artist',
            token: token,
          }));
         navigation.navigate('MainTabs', { mobileNumber: mobileNumber });
     
       }
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to reset password');
        console.log('[ArtistCreateNewPassword] Reset failed:', response.data.message);
      }
    } catch (error) {
      console.error('[ArtistCreateNewPassword] Reset password error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const maskedValue = value
    ? inputType === 'email'
      ? value.replace(/(.{2}).*?@/, '***@')
      : value.replace(/\D/g, '').replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')
    : inputType === 'email'
    ? 'your email'
    : 'your mobile number';

  console.log('[ArtistCreateNewPassword] Masked value:', { inputType, value, maskedValue });

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={[styles.backIcon, { paddingTop: insets.top + 10 }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={responsiveDimensions.iconSize} color="#fff" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingBottom: responsiveDimensions.contentBottomPadding,
                paddingHorizontal: responsiveDimensions.paddingHorizontal,
                paddingTop: responsiveDimensions.contentTopMargin,
              },
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={[styles.title, { fontSize: responsiveDimensions.titleFontSize }]}>
              Create New Artist Password
            </Text>
            <Text style={[styles.subtitle, { fontSize: responsiveDimensions.descriptionFontSize }]}>
              Create a new strong password for {inputType === 'email' ? 'email' : 'mobile number'} ({maskedValue})
            </Text>

            <View style={[styles.inputWrapper, styles.highlightedInput, { width: responsiveDimensions.buttonWidth }]}>
              <Icon name="lock" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: responsiveDimensions.inputFontSize }]}
                placeholder="New password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass1}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass1(!showPass1)} disabled={isLoading}>
                <Icon name={showPass1 ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <View style={[styles.inputWrapper, { width: responsiveDimensions.buttonWidth }]}>
              <Icon name="lock" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { fontSize: responsiveDimensions.inputFontSize }]}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPass2(!showPass2)} disabled={isLoading}>
                <Icon name={showPass2 ? 'eye-off' : 'eye'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.fixedButton,
              {
                bottom: insets.bottom + responsiveDimensions.buttonBottom,
                width: responsiveDimensions.buttonWidth,
                left: responsiveDimensions.paddingHorizontal,
                borderRadius: responsiveDimensions.borderRadius,
              },
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.buttonGradient, { borderRadius: responsiveDimensions.borderRadius, opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.buttonText}>{isLoading ? 'Resetting...' : 'Confirm Reset Password'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <Modal transparent visible={showSuccessModal} animationType="fade" statusBarTranslucent>
          <View style={styles.modalBackground}>
            <View style={[styles.modalContent, { width: responsiveDimensions.buttonWidth }]}>
              <Image
                source={require('../assets/Images/Reset.png')}
                style={[styles.successImage, { width: responsiveDimensions.iconSize * 2, height: responsiveDimensions.iconSize * 2 }]}
              />
              <Text style={[styles.successTitle, { fontSize: responsiveDimensions.titleFontSize * 0.75 }]}>
                Reset Password Success!
              </Text>
              <Text style={[styles.successSubtitle, { fontSize: responsiveDimensions.descriptionFontSize }]}>
                Please login to Scene Zone again with your new password
              </Text>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    width: responsiveDimensions.buttonWidth * 0.6,
                    height: responsiveDimensions.buttonHeight * 0.8,
                    borderRadius: responsiveDimensions.borderRadius,
                  },
                ]}
                onPress={() => {
                  setShowSuccessModal(false);
                  console.log('[ArtistCreateNewPassword] Success modal closed, navigating to ArtistSigninScreen');
                  navigation.navigate('ArtistSigninScreen');
                }}
              >
                <LinearGradient
                  colors={['#B15CDE', '#7952FC']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={[styles.modalButtonGradient, { borderRadius: responsiveDimensions.borderRadius }]}
                >
                  <Text style={styles.modalButtonText}>Go to Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  scrollContent: {
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 15,
    marginBottom: 30,
  },
  backIcon: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: 10,
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  highlightedInput: {
    borderColor: 'rgba(141, 107, 252, 1)',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  fixedButton: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  successImage: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    overflow: 'hidden',
  },
  modalButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
});

export default ArtistCreateNewPassword;