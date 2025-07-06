import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserGeneralSettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Settings</Text>
        <View style={{ width: 24 }} />{/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Language Setting */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Language Setting</Text>
          <Text style={styles.menuItemValue}>English</Text>
          <MaterialIcons name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* Notification Setting */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Notification Setting</Text>
          <MaterialIcons name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* About EVNC */}
         <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>About EVNC</Text>
          <Text style={styles.menuItemValue}>Version 1.0.0.1</Text>
          <MaterialIcons name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

        {/* Term of Use */}
         <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Term of Use</Text>
          <MaterialIcons name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

         {/* Privacy Policy */}
         <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Privacy Policy</Text>
          <MaterialIcons name="chevron-right" size={24} color="#555" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    display: 'flex',
    width: 393,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    // Shadow for iOS
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
    paddingTop:40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
   scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  menuItem: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1, // Take up available space
    fontSize: 16,
    color: '#fff',
  },
  menuItemValue: {
      fontSize: 16,
      color: '#a95eff', // Purple color for values
      marginRight: 10,
  },
});

export default UserGeneralSettingsScreen; 