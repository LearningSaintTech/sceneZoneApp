// navigation/UserBottomTabNavigator.js
import React, { useRef, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHomeScreen from '../Screens/UserHomeScreen';
import UserFavoriteScreen from '../Screens/UserFavorite';
import UserTicketScreen from '../Screens/UserTicket';
import UserProfileScreen from '../Screens/UserProfile';
import { View, Dimensions, Platform, Animated, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/icons/home';
import MyTicketIcon from '../assets/icons/myticket';
import FavoriteIcon from '../assets/icons/favorite';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../Redux/slices/authSlice';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const UserTabs = () => {
  const insets = useSafeAreaInsets();
  const [homeLoaded, setHomeLoaded] = useState(false);
  const [favoriteLoaded, setFavoriteLoaded] = useState(false);
  const [ticketLoaded, setTicketLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Get isLoggedIn from Redux
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Animation values for each tab
  const homeAnim = useRef(new Animated.Value(0)).current;
  const favoriteAnim = useRef(new Animated.Value(0)).current;
  const ticketAnim = useRef(new Animated.Value(1)).current;
  const profileAnim = useRef(new Animated.Value(0)).current;

  // Jitter state for favorite tab
  const [jitterFavorite, setJitterFavorite] = useState(false);
  const jitterFavoriteTab = () => {
    setJitterFavorite(true);
    Animated.sequence([
      Animated.timing(favoriteAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: -1,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 0.7,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: -0.7,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 0.4,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: -0.4,
        duration: 40,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 0,
        duration: 30,
        useNativeDriver: true,
      }),
    ]).start(() => setJitterFavorite(false));
  };

  // Animation effect for active tab - stop after screens are loaded
  useEffect(() => {
    // Set screens as loaded after a brief delay
    const loadTimer = setTimeout(() => {
      setHomeLoaded(true);
      setFavoriteLoaded(true);
      setTicketLoaded(true);
      setProfileLoaded(true);
    }, 2000); // 2 seconds delay

    // Run initial animations
    Animated.sequence([
      Animated.timing(homeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(homeAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();

    Animated.sequence([
      Animated.timing(favoriteAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(favoriteAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();

      Animated.sequence([
        Animated.timing(ticketAnim, {
          toValue: 1.2,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(ticketAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      Animated.timing(ticketAnim, {
        toValue: 1.2,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(ticketAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();

    Animated.sequence([
      Animated.timing(profileAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(profileAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();

    return () => {
      clearTimeout(loadTimer);
      // Stop all animations
      homeAnim.stopAnimation();
      favoriteAnim.stopAnimation();
      ticketAnim.stopAnimation();
      profileAnim.stopAnimation();
    };
  }, [homeAnim, favoriteAnim, ticketAnim, profileAnim]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: { 
          fontSize: Math.max(12, width * 0.03),
          fontWeight: '600',
          marginTop: 6,
          marginBottom: 1,
          lineHeight: Math.max(16, width * 0.04),
        },
        tabBarStyle: {
          backgroundColor: '#0D0D0D',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 8,
          height: Math.max(80, height * 0.12) + insets.bottom,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          left: 0,
          right: 0,
          bottom: 0,
          position: 'absolute',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = Math.max(24, width * 0.06);
          let IconComponent;
          let animatedStyle = {};

          if (route.name === 'UserHome') {
            IconComponent = (
              <HomeIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
            // Only animate if screen is not loaded yet
            animatedStyle = (focused && !homeLoaded) ? { 
              transform: [{ rotate: homeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] 
            } : {};
          }
          else if (route.name === 'UserFavorite') {
            IconComponent = (
              <FavoriteIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
            // Animate on jitterFavorite or initial load
            animatedStyle = (focused && (!favoriteLoaded || jitterFavorite)) ? { 
              transform: [{ rotate: favoriteAnim.interpolate({ inputRange: [-1, 1], outputRange: ['-30deg', '30deg'] }) }] 
            } : {};
          }
          else if (route.name === 'UserTicket') {
            IconComponent = (
              <MyTicketIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
            // Only animate if screen is not loaded yet
            animatedStyle = (focused && !ticketLoaded) ? { 
              transform: [{ scale: ticketAnim }] 
            } : {};
          }
          else if (route.name === 'UserProfile') {
            IconComponent = (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
            // Only animate if screen is not loaded yet
            animatedStyle = (focused && !profileLoaded) ? { 
              transform: [{ rotate: profileAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] 
            } : {};
          }

          return (
            <Animated.View style={animatedStyle}>
              <View style={{
                backgroundColor: 'transparent',
                borderRadius: 8,
                paddingHorizontal: 4,
                paddingVertical: 4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {IconComponent}
              </View>
            </Animated.View>
          );
        },
        tabBarActiveTintColor: '#a95eff',
        tabBarInactiveTintColor: '#aaa',
      })}
    >
      <Tab.Screen 
        name="UserHome" 
        children={props => <UserHomeScreen {...props} onScreenLoaded={() => setHomeLoaded(true)} jitterFavoriteTab={jitterFavoriteTab} />}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="UserFavorite" 
        children={props => <UserFavoriteScreen {...props} onScreenLoaded={() => setFavoriteLoaded(true)} />}
        options={{ tabBarLabel: 'Favorite' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('UserSignup');
            }
          },
        })}
      />
      <Tab.Screen 
        name="UserTicket" 
        children={props => <UserTicketScreen {...props} onScreenLoaded={() => setTicketLoaded(true)} />}
        options={{ tabBarLabel: 'My Ticket' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('UserSignup');
            }
          },
        })}
      />
      <Tab.Screen 
        name="UserProfile" 
        children={props => <UserProfileScreen {...props} onScreenLoaded={() => setProfileLoaded(true)} />}
        options={{ tabBarLabel: 'Profile' }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              navigation.navigate('UserSignup');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default UserTabs; 