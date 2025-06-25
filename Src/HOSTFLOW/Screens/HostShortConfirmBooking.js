import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BookedSuccess from '../assets/icons/BookedSucces';
import SignUpBG from '../assets/Banners/SignUp';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
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
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.055, 22),
    xlarge: Math.max(width * 0.065, 26),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
    xxl: Math.max(width * 0.08, 30),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.06, 20),
  iconContainerSize: Math.max(width * 0.25, 100),
  cardIconSize: Math.max(width * 0.15, 60),
  checkmarkSize: Math.max(width * 0.075, 30),
  marginHorizontal: Math.max(width * 0.05, 20),
};

const HostShortConfirmBookingContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const handleConfirm = () => {
    console.log('Booking confirmed!');
    navigation.navigate('HostArtistContact');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18171D' }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={styles.backgroundContainer}>
        <SignUpBG style={styles.backgroundSVG} />
        <View style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 0),
          }
        ]}>
          <View style={[
            styles.content,
            {
              paddingHorizontal: dimensions.marginHorizontal,
              paddingTop: Math.max(insets.top + 40, 60),
              paddingBottom: Math.max(dimensions.spacing.xl, 20),
            }
          ]}>
            <View style={[
              styles.iconContainer,
              {
                marginBottom: 24,
              }
            ]}>
              <BookedSuccess width={133} height={133} />
            </View>
            <Text style={styles.messageTitle}>Booked Successfully!</Text>
            <Text
              style={styles.messageSubtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Please check your Booking in the Manage Event
            </Text>
          </View>
          <View style={[
            styles.buttonContainer,
            {
              marginHorizontal: dimensions.marginHorizontal,
              marginBottom: Math.max(insets.bottom + 20, 30),
              backgroundColor: '#18171D',
            }
          ]}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.confirmButtonGradient,
                {
                  borderRadius: dimensions.borderRadius.lg,
                }
              ]}
            >
              <TouchableOpacity 
                onPress={handleConfirm} 
                style={[
                  styles.confirmButton,
                  {
                    paddingVertical: Math.max(dimensions.spacing.lg, 15),
                    minHeight: Math.max(dimensions.buttonHeight, 54),
                  }
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.confirmButtonText,
                  {
                    fontSize: Math.max(dimensions.fontSize.header, 18),
                  }
                ]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const HostShortConfirmBookingScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <HostShortConfirmBookingContent navigation={navigation} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backgroundSVG: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: 8, // less space below title
  },
  messageSubtitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    marginBottom: 0,
    marginTop: 0,
    alignSelf: 'center',
    width: '100%',
  },
  buttonContainer: {
    // Container for button with proper safe area handling
    backgroundColor: '#18171D',
  },
  confirmButtonGradient: {
    overflow: 'hidden',
    // Enhanced shadow for better visual prominence
    shadowColor: '#7952FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default HostShortConfirmBookingScreen; 