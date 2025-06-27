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
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import SignUpBackground from '../assets/Banners/SignUp';
import MailboxIcon from '../assets/icons/mailbox';
import api from '../Config/api';

const { width, height } = Dimensions.get('window');

const CreateNewPasswordScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get inputType and value from navigation params
  const { inputType = 'email', value = '' } = route?.params || {};

  const handleResetPassword = async () => {
    if (!value) {
      Alert.alert('Error', `Please provide your ${inputType === 'email' ? 'email' : 'mobile number'}.`);
      console.log('[CreateNewPasswordScreen] Reset failed: Missing input value', { inputType, value });
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      console.log('[CreateNewPasswordScreen] Reset failed: Password or confirm password empty');
      return;
    }
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      console.log('[CreateNewPasswordScreen] Reset failed: Invalid password format', { password });
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      console.log('[CreateNewPasswordScreen] Reset failed: Passwords do not match');
      return;
    }
    try {
      setIsLoading(true);
      const resetData = inputType === 'email' ? { email: value, password } : { mobileNumber: value, password };
      console.log('[CreateNewPasswordScreen] Resetting password:', { endpoint: '/host/set-newpassword', data: resetData });

      const response = await api.post('/host/set-newpassword', resetData);

      console.log('[CreateNewPasswordScreen] Reset password response:', response.data);

      if (response.data.success) {
        console.log('[CreateNewPasswordScreen] Password reset successful, showing success modal');
        setShowSuccessModal(true);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to reset password');
        console.log('[CreateNewPasswordScreen] Reset failed:', response.data.message);
      }
    } catch (error) {
      console.error('[CreateNewPasswordScreen] Reset password error:', {
        message: error.message,
        response: error.response?.data,
      });
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Mask the email or mobile number for display
  const maskedValue =
    inputType === 'email'
      ? value.replace(/(.{2}).*?@/, '***@') // e.g., te**@gmail.com
      : value.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2'); // e.g., 987****3210

  return (
    <View style={styles.container}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.iconContainer}>
              <MailboxIcon width={53} height={52} />
            </View>

            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Create a new strong password for {inputType === 'email' ? 'email' : 'mobile number'} ({maskedValue})
            </Text>

            <View style={[styles.inputWrapper, styles.highlightedInput]}>
              <Icon name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="New password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass1}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPass1(!showPass1)} disabled={isLoading}>
                <Icon name={showPass1 ? 'eye' : 'eye-off'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputWrapper}>
              <Icon name="lock" size={20} color="#aaa" />
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#666"
                secureTextEntry={!showPass2}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPass2(!showPass2)} disabled={isLoading}>
                <Icon name={showPass2 ? 'eye' : 'eye-off'} size={20} color="#aaa" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.fixedButton, { bottom: insets.bottom + 20 }]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.buttonGradient, { opacity: isLoading ? 0.7 : 1 }]}
            >
              <Text style={styles.buttonText}>{isLoading ? 'Resetting...' : 'Confirm Reset Password'}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <Modal transparent visible={showSuccessModal} animationType="fade" statusBarTranslucent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Image
                source={require('../assets/Images/Reset.png')}
                style={styles.successImage}
              />
              <Text style={styles.successTitle}>Reset Password Success!</Text>
              <Text style={styles.successSubtitle}>
                Please login to Scene Zone again with your new password
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  navigation.navigate('MainTabs');
                  console.log('[CreateNewPasswordScreen] Success modal closed, navigating to MainTabs');
                }}
              >
                <LinearGradient
                  colors={['#B15CDE', '#7952FC']}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 0 }}
                  style={styles.modalButtonGradient}
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
    paddingHorizontal: 24,
    paddingTop: 40,
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
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 24,
    lineHeight: 36,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
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
  input: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
    color: '#fff',
  },
  fixedButton: {
    position: 'absolute',
    width: 361,
    height: 52,
    left: 16,
    borderRadius: 14,
    overflow: 'hidden',
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 21,
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
    width: '80%',
  },
  successImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  successTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
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

export default CreateNewPasswordScreen;