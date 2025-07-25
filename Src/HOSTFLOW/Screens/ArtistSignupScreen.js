import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  Dimensions,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import SignUpBackground from '../assets/Banners/SignUp';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FullNameIcon from '../assets/icons/fullname';
import MobileIcon from '../assets/icons/mobile';
import LockIcon from '../assets/icons/lock';
import api from '../Config/api';
import { useDispatch } from 'react-redux';
import { loginArtist } from '../Redux/slices/authSlice';
import auth from '@react-native-firebase/auth';

const { width, height } = Dimensions.get('window');

const ArtistSignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const dynamicPadding = {
    paddingTop: insets.top + height * 0.04,
    paddingBottom: insets.bottom + height * 0.04,
    paddingLeft: insets.left + width * 0.05,
    paddingRight: insets.right + width * 0.05,
  };

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const getPasswordRequirements = () => {
    const requirements = [
      { 
        label: 'At least 8 characters', 
        met: password.length >= 8,
        icon: password.length >= 8 ? '✓' : '✗'
      },
      { 
        label: 'One uppercase letter', 
        met: /[A-Z]/.test(password),
        icon: /[A-Z]/.test(password) ? '✓' : '✗'
      },
      { 
        label: 'One lowercase letter', 
        met: /[a-z]/.test(password),
        icon: /[a-z]/.test(password) ? '✓' : '✗'
      },
      { 
        label: 'One number', 
        met: /\d/.test(password),
        icon: /\d/.test(password) ? '✓' : '✗'
      },
      { 
        label: 'One special character', 
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        icon: /[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '✗'
      }
    ];
    return requirements;
  };

  const isPasswordValid = () => {
    const requirements = getPasswordRequirements();
    return requirements.every(req => req.met);
  };

  const handleMobileChange = (text) => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '');
    // Limit to 10 digits
    if (cleanedText.length <= 10) {
      setMobile(cleanedText);
    }
  };

  const getFullMobileNumber = () => {
    return mobile ? `+91${mobile}` : '';
  };

  const validateInputs = () => {
    // Sanitize fullName
    const sanitizedFullName = fullName.trim().replace(/[^a-zA-Z\s]/g, '');
    if (!sanitizedFullName || sanitizedFullName.length < 2) {
      Alert.alert('Error', 'Please enter a valid full name (at least 2 characters, letters only)');
      return false;
    }

    // Validate mobile number (should be 10 digits)
    if (!mobile) {
      Alert.alert('Error', 'Please enter your mobile number');
      return false;
    }
    
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    const fullMobileNumber = getFullMobileNumber();
    const phoneRegex = /^\+\d{1,3}\d{9,15}$/;
    if (!phoneRegex.test(fullMobileNumber)) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return false;
    }

    // Validate password
    if (!isPasswordValid()) {
      Alert.alert('Error', 'Password must meet all requirements:\n• At least 8 characters\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character');
      return false;
    }

    return { sanitizedFullName };
  };

  const handleSignup = async () => {
    const validated = validateInputs();
    if (!validated) return;

    const { sanitizedFullName } = validated;
    const fullMobileNumber = getFullMobileNumber();
    const signupData = {
      fullName: sanitizedFullName,
      mobileNumber: fullMobileNumber,
      password: password.trim(),
      isRememberMe: rememberMe,
    };

    try {
      setIsLoading(true);

      console.log('Attempting Firebase signup with data:', signupData);
      const response = await api.post('/artist/firebase-auth/firebase-signup', signupData);
      console.log('Firebase Artist Signup Response:', response);

      if (response.data.success) {
        console.log('Initiating Firebase phone auth for:', fullMobileNumber);
        const confirmationResult = await auth().signInWithPhoneNumber(fullMobileNumber);
        console.log('Firebase OTP sent successfully:', confirmationResult);
        setConfirmation(confirmationResult);

        Alert.alert('Success', 'OTP sent to your mobile number', [
          {
            text: 'OK',
            onPress: () =>
              navigation.navigate('ArtistOtpVerificationScreen', {
                mobileNumber: fullMobileNumber,
                confirmation: confirmationResult,
                isFirebase: true,
                userId: response.data.data.userId,
                fullName: sanitizedFullName,
              }),
          },
        ]);
      }
    } catch (error) {
      console.error('Signup Error:', error.message);
      let errorMessage = 'Failed to sign up. Please check your network or try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, paddingLeft: insets.left, paddingRight: insets.right }]}>
      <SignUpBackground style={styles.backgroundSvg} width={width} height={height} />
      <SafeAreaView style={styles.overlay}>
        <ScrollView
          contentContainerStyle={[styles.inner, dynamicPadding]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.header, { color: '#fff' }]}>Create new{"\n"} account</Text>

          <Text style={styles.signinText}>
            Already have an account?{' '}
            <Text style={styles.signinLink} onPress={() => navigation.navigate('ArtistSigninScreen')}>
              Sign In
            </Text>
          </Text>

          <View style={styles.inputContainer}>
            <FullNameIcon width={20} height={20} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              placeholder="Full Name"
              placeholderTextColor="#aaa"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <MobileIcon width={20} height={20} style={styles.icon} />
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={[styles.input, { color: '#fff', marginLeft: 8 }]}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={mobile}
              onChangeText={handleMobileChange}
              maxLength={10}
            />
          </View>

          <View style={[
            styles.inputContainer, 
            styles.passwordContainer,
            password && isPasswordValid() && { borderColor: '#4CAF50' }
          ]}>
            <LockIcon width={20} height={20} style={styles.icon} />
            <TextInput
              style={[styles.input, { color: '#fff' }]}
              placeholder="Create Password"
              placeholderTextColor="#aaa"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => setShowPasswordRequirements(false)}
            />
            {password && isPasswordValid() && (
              <Icon name="checkmark-circle" size={20} color="#4CAF50" style={{ marginRight: 8 }} />
            )}
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {showPasswordRequirements && (
            <View style={styles.passwordRequirementsContainer}>
              <Text style={styles.passwordRequirementsTitle}>Password Requirements:</Text>
              {getPasswordRequirements().map((requirement, index) => (
                <View key={index} style={styles.requirementRow}>
                  <Text style={[styles.requirementIcon, { color: requirement.met ? '#4CAF50' : '#FF5252' }]}>
                    {requirement.icon}
                  </Text>
                  <Text style={[styles.requirementText, { color: requirement.met ? '#4CAF50' : '#aaa' }]}>
                    {requirement.label}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.rememberMeRow}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              thumbColor={rememberMe ? '#8A2BE2' : '#888'}
            />
            <Text style={{ color: '#fff' }}> Remember me</Text>
          </View>

          <TouchableOpacity onPress={handleSignup} disabled={isLoading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={[styles.signupButton, isLoading && { opacity: 0.7 }]}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Signing Up...' : 'Sign Up '}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* <Text style={[styles.orText, { color: '#ccc' }]}>or sign up with</Text> */}

          {/* <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}> */}
          {/*   <GoogleIcon style={styles.socialIcon} width={24} height={24} /> */}
          {/*   <Text style={styles.socialButtonText}>Sign up with Google</Text> */}
          {/* </TouchableOpacity> */}

          {/* <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#000' }]}> */}
          {/*   <AppleIcon style={styles.socialIcon} width={24} height={24} /> */}
          {/*   <Text style={styles.socialButtonText}>Sign up with Apple</Text> */}
          {/* </TouchableOpacity> */}

          <Text style={[styles.termsText, { color: '#aaa' }]}>
            By clicking "Sign Up" you agree to Recognotes{' '}
            <Text style={styles.linkText}>Term of Use</Text> and{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// Styles unchanged
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
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontFamily: 'Nunito Sans',
    fontWeight: '800',
    fontSize: 25,
    lineHeight: 40,
    letterSpacing: 0,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 20,
    color: '#C6C5ED',
    alignSelf: 'stretch',
  },
  signinText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#aaa',
    marginBottom: 25,
  },
  signinLink: {
    fontFamily: 'Nunito Sans',
    fontWeight: '900',
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0,
    color: '#A020F0',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 15,
    height: 40,
    backgroundColor: '#000',
  },
  passwordContainer: {
    borderColor: '#8D6BFC',
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  signupButton: {
    width: '100%',
    height: 42,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  signupButtonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 21,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },
  orText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 25,
  },
  socialButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#3F3F46',
    borderWidth: 1,
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#000',
    height: 40,
  },
  socialButtonText: {
    marginLeft: 10,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#A020F0',
    fontWeight: '700',
  },
  passwordRequirementsContainer: {
    backgroundColor: 'rgba(20, 20, 20, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  passwordRequirementsTitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  requirementIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  requirementText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 13,
    flex: 1,
  },
  countryCode: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
});

export default ArtistSignupScreen;