import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window');

const OnSalaryBasisScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contract Details</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.workingHoursTitle}>Working Hours:</Text>
        <Text style={styles.workingHoursText}>
          You will be working from the Restaurant for 6 days a week. However, we may occasionally
          schedule additional sales events, seminars, or meetings during the holidays.
        </Text>
        <Text style={styles.workingHoursText}>
          The regular working hours will be 1:00 p.m. to 11:00 p.m with 1 hour of break.
        </Text>
        <Text style={styles.workingHoursText}>
          All employees will be required to work in shifts and/or extended hours as permitted by law.
        </Text>
        <Text style={styles.workingHoursText}>
          You may be required to work beyond your existing working hours depending upon the
          business requirements/exigencies from time to time. However, For, overtime work charges can
          be determined by involved parties.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    paddingVertical: 10,
    marginTop: Platform.OS === 'ios' ? 0 : 30, // Adjust for Android status bar
    borderBottomWidth: 1,
    borderBottomColor: '#333', // Subtle separator
  },
  backButton: {
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    padding: width * 0.03,
  },
  workingHoursTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  workingHoursText: {
    fontSize: 14,
    color: '#ccc', // Lighter text color
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default OnSalaryBasisScreen; 