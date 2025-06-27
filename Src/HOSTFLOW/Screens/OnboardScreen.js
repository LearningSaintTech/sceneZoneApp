import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Logo from '../assets/icons/logo.js';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    title: '',
    subtitle: '',
    image: require('../assets/Images/onb3.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();

  const handleFinalButton = (type) => {
    // Handle signup flow based on user selection
    if (type === 'continue as host') {
      navigation.navigate('Signup');
    } else if (type === 'continue as artist') {
      navigation.navigate('ArtistSignup');
    } else if (type === 'discover events') {
      navigation.navigate('UserHome', { isLoggedIn: false });
    }
  };

  return (
    <ImageBackground
      source={slides[0].image}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.85)', '#000']}
        locations={[0.18, 0.55, 1]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.safeArea}>
            <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>  
              <View style={styles.logoContainer}>
                <Logo width={94} height={81} />
              </View>
              <View style={styles.buttonGroup}>
                {['Continue as Host', 'Continue as Artist', 'Discover Events'].map(
                  (label, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.fixedButton,
                        label === 'Discover Events' && styles.discoverButton
                      ]}
                      onPress={() => handleFinalButton(label.toLowerCase())}
                      activeOpacity={0.8}
                    >
                      {label === 'Discover Events' ? (
                        <View style={styles.discoverButtonContent}>
                          <Text style={styles.buttonText}>{label}</Text>
                          <View style={styles.arrowCircle}>
                            <Svg
                              width="20"
                              height="20"
                              viewBox="0 0 21 20"
                              fill="none"
                            >
                              <Path
                                d="M10.5 18.3334C15.1024 18.3334 18.8334 14.6025 18.8334 10.0001C18.8334 5.39771 15.1024 1.66675 10.5 1.66675C5.89765 1.66675 2.16669 5.39771 2.16669 10.0001C2.16669 14.6025 5.89765 18.3334 10.5 18.3334Z"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <Path
                                d="M7.58331 10H12.5833"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <Path
                                d="M10.9167 12.5L13.4167 10L10.9167 7.5"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </Svg>
                          </View>
                        </View>
                      ) : (
                        <LinearGradient
                          colors={['#B15CDE', '#7952FC']}
                          start={{x: 1, y: 0}}
                          end={{x: 0, y: 0}}
                          style={styles.buttonGradient}
                        >
                          <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>{label}</Text>
                          </View>
                        </LinearGradient>
                      )}
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 40,
    letterSpacing: 0,
    marginBottom: 10,
    color: 'rgba(250, 250, 250, 1)',
  },
  subtitle: {
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: '#FAFAFA',
    letterSpacing: 0,
    marginBottom: 30,
  },
  horizontalIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    height: 10,
  },
  indicator: {
    height: 4,
    minWidth: 22,
    maxWidth: 8,
    borderRadius: 1.5,
    marginHorizontal: 4,
  },
  fixedButton: {
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '115%',
    alignSelf: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 19,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#fff',
  },
  arrowCircle: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonGroup: {
    marginBottom: 15,
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  signin: {
    textAlign: 'center',
    color: '#ccc',
    fontSize: 12,
    marginTop: 0,
  },
  signinBold: {
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.25,
    marginBottom: 150,
  },
  discoverButton: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#B15CDE',
    width: '105%',
    alignSelf: 'center',
  },
  discoverButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  firstSlideTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 34,
    color: '#FAFAFA',
  },
  secondSlideTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 34,
    color: '#FAFAFA',
  },
});

export default OnboardingScreen;




