import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const guestLevelsData = [
  {
    id: '1',
    level: 'Level 1',
    description: 'Discout + $1.50 Fee',
    availability: 'Filled Out',
    isAvailable: false,
  },
  {
    id: '2',
    level: 'Level 2',
    description: 'Discout + $1.50 Fee',
    availability: '24 Avilable',
    isAvailable: true,
  },
  {
    id: '3',
    level: 'Level 3',
    description: 'Discout + $1.50 Fee',
    availability: '12 Avilable',
    isAvailable: true,
  },
];

const ArtistFormBookingScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const renderGuestLevel = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.guestLevelCard, selectedLevel === item.id && styles.selectedCard]}
      onPress={() => item.isAvailable && setSelectedLevel(item.id)}
      disabled={!item.isAvailable}
    >
      <View style={styles.guestLevelIcon}>
        <Ionicons name="ticket" size={24} color="#a95eff" />{/* Placeholder icon */}
      </View>
      <View style={styles.guestLevelContent}>
        <Text style={styles.guestLevelTitle}>{item.level}</Text>
        <Text style={styles.guestLevelDescription}>{item.description}</Text>
        <Text style={[styles.guestLevelAvailability, !item.isAvailable && styles.notAvailableText]}>
          {item.availability}
        </Text>
      </View>
      <View style={styles.radioButton}>
        {selectedLevel === item.id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Guest list</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Placeholder */}
        <View style={styles.imagePlaceholder}>
          {/* <Image source={...} style={styles.eventImage} /> */}
          <View style={styles.dateOverlay}>
            <Text style={styles.dateText}>May</Text>
            <Text style={styles.dateText}>20</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.eventTitle}>Sounds of Celebration</Text>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Guest Type:</Text>

          {guestLevelsData.map(item => renderGuestLevel({ item }))}

        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => { /* Handle continue action */ }}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
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
  imagePlaceholder: {
    width: '100%',
    height: 200, // Adjust height as needed
    backgroundColor: '#333', // Placeholder background
    justifyContent: 'flex-end',
    padding: 16,
  },
  dateOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  guestLevelCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#a95eff',
    borderWidth: 1,
  },
  guestLevelIcon: {
    marginRight: 16,
  },
  guestLevelContent: {
    flex: 1,
  },
  guestLevelTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  guestLevelDescription: {
    fontSize: 14,
    color: '#a95eff', // Purple color
    marginBottom: 4,
  },
  guestLevelAvailability: {
    fontSize: 14,
    color: '#aaa',
  },
  notAvailableText: {
    color: '#dc3545', // Red color for filled out
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#a95eff',
  },
  continueButton: {
    backgroundColor: '#a95eff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default ArtistFormBookingScreen; 