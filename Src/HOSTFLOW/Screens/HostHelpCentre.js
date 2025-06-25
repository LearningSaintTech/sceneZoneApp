import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const HostHelpCentreScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Centre</Text>
        <View style={{ width: 24 }} />{/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* No menu items as requested */}
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Dark background
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between', // To push the arrow to the right
  },
  menuItemText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default HostHelpCentreScreen; 