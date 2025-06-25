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
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleConfirm = async () => {
    try {
      // Input validation
      if (!email.trim()) {
        Alert.alert('Error', 'Please enter your email address');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }

      setIsLoading(true);

      const otpData = {
        email: email.trim()
      };

      console.log("Sending OTP Data:", otpData); // Debug log

      const response = await api.post('/host/email-sendOtp', otpData);

      console.log("OTP Response:", response.data); // Debug log

      if (response.data) {
        // Navigate to check mailbox screen
        navigation.navigate('CheckMailBox', { email: email.trim() });
      }
    } catch (error) {
      console.error("OTP Error:", error.message);
      console.error("Error Response:", error.response?.data);
      
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to send OTP. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
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
              <ForgotIcon width={53} height={52} />
            </View>

            <Text style={styles.title}>Forgot  Your Password?</Text>
            <Text style={styles.description}>
              Please enter your email address account to send the OTP
              verification to reset your password
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="scenezone@gmail.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>
        </ScrollView>

        {/* Confirm Button - Fixed position */}
        <TouchableOpacity 
          style={[styles.confirmButton, { bottom: insets.bottom + 60 }]} 
          onPress={handleConfirm}
          disabled={isLoading}
        >
          <LinearGradient 
            colors={['#B15CDE', '#7952FC']} 
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={[styles.confirmButtonGradient, { opacity: isLoading ? 0.7 : 1 }]}
          >
            <Text style={styles.confirmButtonText}>
              {isLoading ? 'Sending...' : 'Confirm'}
            </Text>
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
  header: {
   
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
    // bottom will be set dynamically with safe area insets
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
