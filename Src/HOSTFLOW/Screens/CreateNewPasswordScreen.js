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

  // Get email from navigation params
  const email = route?.params?.email || '';

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Email is missing.');
      return;
    }
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      const response = await api.post('/host/set-newpassword', {
        email,
        password,
      });
      if (response.data.success) {
        setShowSuccessModal(true);
        Alert.alert('Success', 'Password reset successfully!', [
          {
            text: 'OK',
            onPress: () => {
              setShowSuccessModal(false);
              navigation.navigate('MainTabs');
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
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
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 30 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Central Icon */}
          <View style={styles.iconContainer}>
            <MailboxIcon width={53} height={52} />
          </View>
          
          <Text style={styles.title}>Create New Password </Text>
          <Text style={styles.subtitle}>
            Create new strong password for updating (*********@gmail.com)
          </Text>

          {/* New Password Field */}
          <View style={[styles.inputWrapper, styles.highlightedInput]}>
            <Icon name="lock" size={20} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor="#666"
              secureTextEntry={!showPass1}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass1(!showPass1)}>
              <Icon name={showPass1 ? 'eye' : 'eye-off'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#666"
              secureTextEntry={!showPass2}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowPass2(!showPass2)}>
              <Icon name={showPass2 ? 'eye' : 'eye-off'} size={20} color="#aaa" />
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.fixedButton} onPress={handleResetPassword}>
            <LinearGradient 
              colors={['#B15CDE', '#7952FC']} 
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Confirm Reset Password</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ✅ Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade" statusBarTranslucent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/Images/Reset.png')} // ✅ your local success image
              style={styles.successImage}
            />
            <Text style={styles.successTitle}>Reset Password Success!</Text>
            <Text style={styles.successSubtitle}>Please login to Scene Zone again with your new password</Text>
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
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
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
    top: 750,
    left: 16,
    gap: 10,
    borderRadius: 14,
    paddingRight: 16,
    paddingLeft: 16,
    overflow: 'hidden',
    marginBottom: 12,
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
    letterSpacing: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'rgba(255, 255, 255, 1)',
  },

  // ✅ Modal Styles
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
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  },
});

export default CreateNewPasswordScreen;
