import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SignUpBackground from '../assets/Banners/SignUp';

const { width } = Dimensions.get('window');

const UserConfirmBookingScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const handleConfirm = () => {
    // Implement logic for the final confirmation button
    console.log('Booking confirmed!');
    // Navigate back to home or a booking history screen
    navigation.navigate('UserHome');
  };

  return (
    <SafeAreaView style={[
      styles.container,
      {
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: Math.max(insets.bottom + 20, 20),
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      {/* SVG Background */}
      <View style={styles.backgroundSvgContainer} pointerEvents="none">
        <SignUpBackground style={styles.backgroundSvg} width={width} height="100%" />
      </View>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']} // Purple gradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBackground}
          >
            {/* Placeholder for the credit card with checkmark icon */}
            {/* You might need to combine multiple icons or use a custom asset */}
            {/* This is a simplified representation */} 
             <Ionicons name="card" size={60} color="#fff" style={styles.cardIcon} />
             <View style={styles.checkmarkContainer}>
                 <Ionicons name="checkmark-circle" size={30} color="#fff" />
             </View>
          </LinearGradient>
        </View>

        {/* Message */}
        <Text style={styles.messageTitle}>Booked Successfully!</Text>
        <Text style={styles.messageSubtitle}>
          Please check your Booking in the Manage Event
        </Text>
      </View>

      {/* Confirm Button */}
      <LinearGradient
        colors={['#B15CDE', '#7952FC']} // Purple gradient colors
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.confirmButtonGradient,
          {
            marginHorizontal: Math.max(width * 0.05, 20),
            marginBottom: Math.max(insets.bottom, 10),
          }
        ]}
      >
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between', // Space out content and button
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    position: 'relative',
  },
   iconBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   },
   cardIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }], // Center the icon
    zIndex: 1, // Ensure card icon is below checkmark
   },
   checkmarkContainer: {
     position: 'absolute',
     bottom: 5,
     right: 5,
     backgroundColor: '#a95eff', // Match the purple color
     borderRadius: 15,
     padding: 2, // Adjust padding as needed
     zIndex: 2, // Ensure checkmark is on top
   },
  messageTitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: 10,
  },
  messageSubtitle: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  confirmButtonGradient: {
    borderRadius: 14,
    overflow: 'hidden',
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 52,
    paddingVertical: 0,
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
  backgroundSvgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default UserConfirmBookingScreen; 