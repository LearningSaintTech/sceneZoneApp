import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Ticket from '../assets/icons/Ticket'; // Adjust the path if needed

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
        <Ticket width={24} height={24} />
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
        <ImageBackground
          source={require('../assets/Images/Cover.png')} // Replace with your image path
          style={styles.imagePlaceholder}
          imageStyle={{ borderRadius: 16, resizeMode: 'cover' }}
        >
          <View style={styles.dateOverlay}>
            <Text style={styles.dateText}>May</Text>
            <Text style={styles.dateText}>20</Text>
          </View>
        </ImageBackground>

        <View style={styles.contentContainer}>
          <Text style={styles.eventTitle}>Sounds of Celebration</Text>
          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Guest Type:</Text>

          {guestLevelsData.map(item => renderGuestLevel({ item }))}

        </View>
      </ScrollView>

      <LinearGradient
        colors={['#B15CDE', '#7952FC']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.continueButton}
      >
        <TouchableOpacity
          style={styles.continueButtonInner}
          onPress={() => { /* Handle continue action */ }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    width: 393,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
    backgroundColor: '#121212',
    borderBottomWidth: 0,
    shadowColor: '#683bfc',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight:190,
  },
  imagePlaceholder: {
    flexDirection: 'row',
    height: 140,
    paddingTop: 8,
    paddingRight: 313,
    paddingBottom: 92,
    paddingLeft: 8,
    alignItems: 'center',
    flexShrink: 0,
    alignSelf: 'stretch',
    backgroundColor: '#333',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
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
    color: '#FCFCFD',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    fontFeatureSettings: "'salt' on",
    marginBottom: 16,
    marginRight:100,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
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
    fontSize: 12,
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
    width: 331,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    alignSelf: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  continueButtonInner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ArtistFormBookingScreen; 