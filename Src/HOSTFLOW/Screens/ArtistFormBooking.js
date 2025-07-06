import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import TicketIcon from '../assets/icons/Ticket';

const { width } = Dimensions.get('window');

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
      style={[
        styles.guestLevelCard, 
        selectedLevel === item.id && styles.selectedCard,
        !item.isAvailable && styles.disabledCard
      ]}
      onPress={() => item.isAvailable && setSelectedLevel(item.id)}
      disabled={!item.isAvailable}
    >
      <View style={styles.guestLevelIcon}>
        <TicketIcon width={32} height={32} />
      </View>
      <View style={styles.guestLevelContent}>
        <Text style={styles.guestLevelTitle}>{item.level}</Text>
        <Text style={styles.guestLevelDescription}>{item.description}</Text>
        <Text style={[styles.guestLevelAvailability, !item.isAvailable && styles.notAvailableText]}>
          {item.availability}
        </Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedLevel === item.id && styles.radioButtonSelected,
        !item.isAvailable && styles.radioButtonDisabled
      ]}>
        {selectedLevel === item.id && <Ionicons name="checkmark" size={16} color="#fff" />}
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
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/Images/fff.jpg')}
            style={styles.eventImage}
          />
          <View style={styles.dateOverlay}>
            <Text style={styles.dateMonth}>May</Text>
            <Text style={styles.dateDay}>20</Text>
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
        disabled={!selectedLevel}
      >
        <LinearGradient
          colors={selectedLevel ? ['#B15CDE', '#7952FC'] : ['#666', '#444']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.continueButtonGradient}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </LinearGradient>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Nunito Sans',
    marginRight:170,
  },
  imageContainer: {
    height: 140,
    width: '100%',
    alignSelf: 'stretch',
    position: 'relative',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginHorizontal: 2,
    marginTop: 20,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dateOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    position: 'absolute',
    top: 16,
    left: 16,
  },
  dateMonth: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  dateDay: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  contentContainer: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  guestLevelCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#B15CDE',
    borderWidth: 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
  guestLevelIcon: {
    marginRight: 16,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestLevelContent: {
    flex: 1,
  },
  guestLevelTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  guestLevelDescription: {
    fontSize: 12,
    color: '#B15CDE',
    marginBottom: 6,
    fontFamily: 'Poppins',
  },
  guestLevelAvailability: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Poppins',
  },
  notAvailableText: {
    color: '#888',
  },
  radioButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  radioButtonSelected: {
    backgroundColor: '#B15CDE',
    borderColor: '#B15CDE',
  },
  radioButtonDisabled: {
    borderColor: '#444',
  },
  continueButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Poppins',
  },
});

export default ArtistFormBookingScreen; 