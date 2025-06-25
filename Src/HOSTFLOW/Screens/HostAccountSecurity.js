import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 8),
    md: Math.max(width * 0.03, 12),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  fontSize: {
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  itemHeight: Math.max(height * 0.08, 60),
};

const CustomToggle = ({ value, onValueChange }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => onValueChange(!value)}
    style={{
      width: 48,
      height: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#34344A',
      backgroundColor: '#1A1A1F',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    }}
  >
    <View
      style={{
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? '#a95eff' : '#C6C5ED',
        marginLeft: value ? 16 : 0,
        marginRight: value ? 0 : 16,
        transition: 'margin 0.2s',
      }}
    />
  </TouchableOpacity>
);

const HostAccountSecurityScreen = ({ navigation }) => {
  const [isFingerprintEnabled, setIsFingerprintEnabled] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          paddingTop: Platform.OS === 'ios' ? 20 : Math.max(insets.top + 10, 20),
        }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Security</Text>
        <View style={{ width: dimensions.iconSize }} />
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingBottom: Math.max(insets.bottom + 40, 60),
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Update Password Item */}
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Update Password</Text>
          <MaterialIcons name="chevron-right" size={dimensions.iconSize} color="#555" />
        </TouchableOpacity>

        {/* Fingerprint Log In Section */}
        <View style={styles.fingerprintSection}>
          <View style={styles.fingerprintTextContainer}>
            <Text style={styles.fingerprintTitle}>Fingerprint Log In</Text>
            <Text style={styles.fingerprintDescription}>
              Activation will allow anyone with Fingerprint
              access to this device, to login to your account
            </Text>
          </View>
          <CustomToggle value={isFingerprintEnabled} onValueChange={setIsFingerprintEnabled} />
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 393,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'space-between',
    minHeight: Math.max(dimensions.buttonHeight * 1.2, 60),
  },
  backButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    minWidth: dimensions.iconSize + 8,
    minHeight: dimensions.iconSize + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
    marginRight:110,
  },
  scrollViewContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginBottom: dimensions.spacing.md,
    minHeight: dimensions.itemHeight,
  },
  menuItemText: {
    fontSize: dimensions.fontSize.title,
    color: '#fff',
    fontWeight: '500',
  },
  fingerprintSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 40,
    alignSelf: 'stretch',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginBottom: dimensions.spacing.md,
    minHeight: Math.max(dimensions.itemHeight * 1.2, 70),
  },
  fingerprintTextContainer: {
    flex: 1,
    marginRight: dimensions.spacing.lg,
  },
  fingerprintTitle: {
    fontSize: dimensions.fontSize.title,
    color: '#fff',
    marginBottom: dimensions.spacing.xs,
    fontWeight: '500',
  },
  fingerprintDescription: {
    fontSize: dimensions.fontSize.small,
    color: '#888',
    lineHeight: Math.max(dimensions.fontSize.small + 4, 16),
  },
});

export default HostAccountSecurityScreen; 