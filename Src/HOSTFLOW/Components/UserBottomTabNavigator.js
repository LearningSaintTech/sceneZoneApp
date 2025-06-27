// navigation/UserBottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserHomeScreen from '../Screens/UserHomeScreen';
import UserFavoriteScreen from '../Screens/UserFavorite';
import UserTicketScreen from '../Screens/UserTicket';
import UserProfileScreen from '../Screens/UserProfile';
import { View, Dimensions, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeIcon from '../assets/icons/home';
import MyTicketIcon from '../assets/icons/myticket';
import FavoriteIcon from '../assets/icons/favorite';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const UserTabs = () => {
  const insets = useSafeAreaInsets();
  
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

          if (route.name === 'UserHome') {
            IconComponent = (
              <HomeIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
          }
          else if (route.name === 'UserFavorite') {
            IconComponent = (
              <FavoriteIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
          }
          else if (route.name === 'UserTicket') {
            IconComponent = (
              <MyTicketIcon 
                width={iconSize} 
                height={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
          }
          else if (route.name === 'UserProfile') {
            IconComponent = (
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={iconSize} 
                color={focused ? "#a95eff" : "#aaa"} 
              />
            );
          }

          return (
            <View style={{
              backgroundColor: focused ? 'rgba(169, 94, 255, 0.2)' : 'transparent',
              borderRadius: 8,
              paddingHorizontal: 4,
              paddingVertical: 4,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {IconComponent}
            </View>
          );
        },
        tabBarActiveTintColor: '#a95eff',
        tabBarInactiveTintColor: '#aaa',
      })}
    >
      <Tab.Screen 
        name="UserHome" 
        component={UserHomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="UserFavorite" 
        component={UserFavoriteScreen}
        options={{ tabBarLabel: 'Favorite' }}
      />
      <Tab.Screen 
        name="UserTicket" 
        component={UserTicketScreen}
        options={{ tabBarLabel: 'My Ticket' }}
      />
      <Tab.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default UserTabs; 