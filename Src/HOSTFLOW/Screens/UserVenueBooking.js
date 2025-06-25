import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const UserVenueBookingScreen = ({ navigation }) => {
  // Placeholder data for venues
  const venues = [
    {
      id: 1,
      image: require('../assets/Images/fff.jpg'),
      name: 'Venue Name',
      location: 'Noida, India',
    },
    {
      id: 2,
      image: require('../assets/Images/fff.jpg'),
      name: 'Moshing Metal Fest 2024',
      location: 'Noida, India',
    },
    {
      id: 3,
      image: require('../assets/Images/ffff.jpg'),
      name: 'Moshing Metal Fest II 2024',
      location: 'Noida, India',
    },
    {
      id: 4,
      image: require('../assets/Images/ffff.jpg'),
      name: 'Moshing Metal Fest II 2024',
      location: 'Noida, India',
    },
    {
      id: 5,
      image: require('../assets/Images/ffff.jpg'),
      name: 'Moshing Metal Fest II 2024',
      location: 'Noida, India',
    },
    // Add more venues as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue Booking</Text>
        <View style={{ width: 24 }} />{/* Spacer to align title */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Feather name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search Event"
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <MaterialIcons name="cancel" size={20} color="#888" />{/* Placeholder for clear icon */}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {/* Venue List */}
        {venues.map((venue) => (
          <View key={venue.id} style={styles.venueCard}>
            <Image source={venue.image} style={styles.venueImage} resizeMode="cover" />
            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <Text style={styles.venueLocation}>{venue.location}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation Placeholder - Actual navigation handled by navigator */}
      {/* <View style={{ height: 60 }} /> */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchBarInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    paddingRight: 10, // Add some padding on the right for the clear icon
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  venueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a', // Dark background
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
  },
  venueImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 15,
  },
  venueInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  venueLocation: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default UserVenueBookingScreen;