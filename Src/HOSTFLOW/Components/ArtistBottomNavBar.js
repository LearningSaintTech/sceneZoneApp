import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppliedIcon from '../assets/icons/Applied';
import InboxIcon from '../assets/icons/inbox';

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

  const handleTabPress = (tabName, routeName) => {
    if (activeTab !== tabName) {
      navigation.replace(routeName);
    }
  };

  return (
    <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 20) }]}> 
      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'home' && styles.navButtonActive]} 
        onPress={() => handleTabPress('home', 'ArtistHome')}
      >
        <Ionicons 
          name={activeTab === 'home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'home' ? '#a95eff' : '#aaa'} 
        />
        <Text style={[styles.navButtonText, activeTab === 'home' && styles.navButtonTextActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'applied' && styles.navButtonActive]}
        onPress={() => handleTabPress('applied', 'ArtistApplied')}
      >
        <AppliedIcon width={24} height={24} stroke={activeTab === 'applied' ? '#a95eff' : '#aaa'} />
        <Text style={[styles.navButtonText, activeTab === 'applied' && styles.navButtonTextActive]}>Applied</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'inbox' && styles.navButtonActive]}
        onPress={() => handleTabPress('inbox', 'ArtistInbox')}
      >
        <InboxIcon width={24} height={24} stroke={activeTab === 'inbox' ? '#a95eff' : '#aaa'} />
        <Text style={[styles.navButtonText, activeTab === 'inbox' && styles.navButtonTextActive]}>Inbox</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.navButton, activeTab === 'profile' && styles.navButtonActive]}
        onPress={() => handleTabPress('profile', 'ArtistProfile')}
      >
        <Ionicons 
          name={activeTab === 'profile' ? 'person' : 'person-outline'} 
          size={24} 
          color={activeTab === 'profile' ? '#a95eff' : '#aaa'} 
        />
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
  navButtonActive: {
    backgroundColor: 'rgba(169, 94, 255, 0.1)',
    borderRadius: 15,
    marginHorizontal: 5,
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