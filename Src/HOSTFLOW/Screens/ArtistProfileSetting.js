import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ArtistProfileSettingScreen = ({ navigation }) => {
  // You can add state for switch values here if needed
  const [isPushEnabled, setIsPushEnabled] = React.useState(false);
  const [isEmailEnabled, setIsEmailEnabled] = React.useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Settings</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>

        {/* Account Settings Section */}
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Update Email Address</Text>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Delete Account</Text>
          <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity>

        {/* Notification Settings Section */}
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <View style={styles.settingItemWithToggle}>
          <Text style={styles.settingText}>Push Notifications</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#a95eff' }}
            thumbColor={isPushEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsPushEnabled}
            value={isPushEnabled}
          />
        </View>
        <View style={styles.settingItemWithToggle}>
          <Text style={styles.settingText}>Email Notifications</Text>
           <Switch
            trackColor={{ false: '#767577', true: '#a95eff' }}
            thumbColor={isEmailEnabled ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsEmailEnabled}
            value={isEmailEnabled}
          />
        </View>

        {/* Other Settings (Add based on image if needed) */}
        {/* Example: */}
        {/* <Text style={styles.sectionTitle}>Privacy</Text>
        <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Icon name="chevron-right" size={20} color="#aaa" />
        </TouchableOpacity> */}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
  },
    settingItemWithToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 8,
   },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default ArtistProfileSettingScreen; 