import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  StyleSheet,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectUserType } from '../Redux/slices/authSlice';

const SplashScreen = () => {
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Access navigation object
  const [isNavigating, setIsNavigating] = useState(false);

  // Get auth state from Redux
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userType = useSelector(selectUserType);

  const backgroundColor =
    colorScheme === 'dark' ? '#100218' : '#ffffff'; 

  useEffect(() => {
    // Reset navigation state when splash screen loads
    setIsNavigating(false);
    
    // Navigate based on login status after 3 seconds
    const timer = setTimeout(() => {
      if (!isNavigating) {
        setIsNavigating(true);
        
        // Check if user is logged in and navigate to respective screen
        if (isLoggedIn && userType) {
          switch (userType) {
            case 'user':
              navigation.replace('UserHome', { isLoggedIn: true });
              break;
            case 'host':
              navigation.replace('MainTabs'); // BottomTabNavigator with HomeScreen
              break;
            case 'artist':
              navigation.replace('ArtistHome');
              break;
            default:
              // If userType is invalid, go to onboarding
              navigation.replace('Onboard1');
              break;
          }
        } else {
          // Not logged in, go to onboarding
          navigation.replace('Onboard1');
        }
      }
    }, 3000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [navigation, isLoggedIn, userType]);

  // Reset state when component mounts
  useEffect(() => {
    setIsNavigating(false);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <View style={styles.container}>
        <Image
          source={require('../assets/Images/SplashLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 160,
  },
});

export default SplashScreen;