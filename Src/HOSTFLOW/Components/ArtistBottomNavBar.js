import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppliedIcon from '../assets/icons/Applied';
import InboxIcon from '../assets/icons/inbox';
import HomeIcon from '../assets/icons/home';
import ProfileIcon from './profile';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ArtistBottomNavBar = ({ navigation, insets = { bottom: 20 } }) => {
  // Get the current route name to determine active tab
  const currentRoute = navigation.getState()?.routes[navigation.getState()?.index]?.name;
  
  // Map route names to tab names
  const getActiveTab = () => {
    switch (currentRoute) {
      case 'ArtistHome':
        return 'home';
      case 'ArtistApplied':
        return 'applied';
      case 'ArtistInbox':
        return 'inbox';
      case 'ArtistProfile':
        return 'profile';
      default:
        return 'home';
    }
  };

  const activeTab = getActiveTab();

  // Animation values for each tab
  const homeAnim = React.useRef(new Animated.Value(0)).current;
  const appliedAnim = React.useRef(new Animated.Value(0)).current;
  const inboxAnim = React.useRef(new Animated.Value(0)).current;
  const profileAnim = React.useRef(new Animated.Value(0)).current;
  const [loaded, setLoaded] = React.useState(false);

  // Get unread chat count from Redux
  const unreadChatCount = useSelector(state => state.notifications.unreadChatCount);

  React.useEffect(() => {
    // Animate all icons on mount
    Animated.parallel([
      Animated.sequence([
        Animated.timing(homeAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(homeAnim, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(appliedAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(appliedAnim, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(inboxAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(inboxAnim, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: true })
      ]),
      Animated.sequence([
        Animated.timing(profileAnim, { toValue: 1, duration: 1000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(profileAnim, { toValue: 0, duration: 1000, easing: Easing.linear, useNativeDriver: true })
      ]),
    ]).start(() => setLoaded(true));
  }, []);

  const iconSize = Math.max(24, width * 0.06);

  const handleTabPress = (tabName, routeName) => {
    if (activeTab !== tabName) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 20) }]}> 
      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleTabPress('home', 'ArtistHome')}
      >
        <Animated.View style={activeTab === 'home' ? { transform: [{ rotate: homeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] } : {}}>
          <HomeIcon width={iconSize} height={iconSize} color={activeTab === 'home' ? '#a95eff' : '#aaa'} />
        </Animated.View>
        <Text style={[styles.navButtonText, activeTab === 'home' && styles.navButtonTextActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleTabPress('applied', 'ArtistApplied')}
      >
        <Animated.View style={activeTab === 'applied' ? { transform: [{ rotate: appliedAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] } : {}}>
          <AppliedIcon width={iconSize} height={iconSize} stroke={activeTab === 'applied' ? '#a95eff' : '#aaa'} />
        </Animated.View>
        <Text style={[styles.navButtonText, activeTab === 'applied' && styles.navButtonTextActive]}>Applied</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleTabPress('inbox', 'ArtistInbox')}
      >
        <Animated.View style={activeTab === 'inbox' ? { transform: [{ rotate: inboxAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] } : {}}>
          <View style={{ position: 'relative' }}>
            <InboxIcon width={iconSize} height={iconSize} stroke={activeTab === 'inbox' ? '#a95eff' : '#aaa'} />
            {unreadChatCount > 0 && (
              <View style={{
                position: 'absolute',
                top: -6,
                right: -10,
                backgroundColor: '#FF3B30',
                borderRadius: 10,
                minWidth: 18,
                height: 18,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 4,
              }}>
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                  {unreadChatCount > 99 ? '99+' : unreadChatCount}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
        <Text style={[styles.navButtonText, activeTab === 'inbox' && styles.navButtonTextActive]}>Inbox</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navButton}
        onPress={() => handleTabPress('profile', 'ArtistProfile')}
      >
        <Animated.View style={activeTab === 'profile' ? { transform: [{ rotate: profileAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] } : {}}>
          <ProfileIcon width={iconSize} height={iconSize} color={activeTab === 'profile' ? '#a95eff' : '#aaa'} />
        </Animated.View>
        <Text style={[styles.navButtonText, activeTab === 'profile' && styles.navButtonTextActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    paddingVertical: 5,
    paddingBottom: 45, // Adjust for home bar indicator
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 5,
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#aaa',
    marginTop: 4,
  },
  navButtonTextActive: {
    color: '#a95eff',
  },
});

export default ArtistBottomNavBar; 