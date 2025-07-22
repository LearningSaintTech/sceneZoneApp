import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';

const discountLevels = [
  { key: 'level1', label: 'Level 1' },
  { key: 'level2', label: 'Level 2' },
  { key: 'level3', label: 'Level 3' },
];

const AssignGuestDiscountScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const { eventId, userId, eventName } = route.params;
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAssignDiscount = async () => {
    if (!selectedLevel) {
      Alert.alert('Select Discount', 'Please select a discount level.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${API_BASE_URL}/guest-list/events/${eventId}/approve`,
        { userId, discountLevel: selectedLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Guest list request approved and discount assigned.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      setError('Failed to assign discount.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>Assign Discount</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.eventName}>{eventName || 'Event'}</Text>
        <Text style={styles.label}>Select Discount Level:</Text>
        <View style={styles.levelsRow}>
          {discountLevels.map(level => (
            <TouchableOpacity
              key={level.key}
              style={[styles.levelButton, selectedLevel === level.key && styles.selectedLevelButton]}
              onPress={() => setSelectedLevel(level.key)}
              disabled={loading}
            >
              <Text style={[styles.levelButtonText, selectedLevel === level.key && styles.selectedLevelButtonText]}>{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <TouchableOpacity
          style={styles.assignButton}
          onPress={handleAssignDiscount}
          disabled={loading}
        >
          <LinearGradient colors={['#B15CDE', '#7952FC']} style={styles.buttonGradient}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Assign Discount</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 31, 1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    color: '#B15CDE',
    fontSize: 24,
    fontWeight: '700',
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  eventName: {
    fontSize: 20,
    color: '#7952FC',
    fontWeight: '700',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  levelsRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  levelButton: {
    backgroundColor: '#23233a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: '#2d2d3a',
  },
  selectedLevelButton: {
    backgroundColor: '#B15CDE',
    borderColor: '#7952FC',
  },
  levelButtonText: {
    color: '#b3b3cc',
    fontSize: 15,
    fontWeight: '600',
  },
  selectedLevelButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  assignButton: {
    width: '100%',
    marginTop: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: '#dc3545',
    marginTop: 8,
    marginBottom: 8,
  },
});

export default AssignGuestDiscountScreen; 