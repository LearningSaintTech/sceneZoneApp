import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const genres = ['Rock', 'Jazz', 'Hip Hop', 'Classical', 'Reggae', 'Electronic', 'Blues', 'Country', 'Pop', 'Metal'];

const ArtistUpload = ({ navigation }) => {
  const [venueName, setVenueName] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Electronic');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  // State for video upload might be needed later

  const handleUpload = () => {
    // Handle upload logic here
    console.log('Uploading video...');
    console.log('Selected Genre:', selectedGenre);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance Upload</Text>
        <View style={{ width: 24 }} />{/* Spacer for alignment */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.label}>Venue Nae</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={venueName}
            onChangeText={setVenueName}
            placeholder="Venue name"
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.label}>Genre</Text>
        <TouchableOpacity style={styles.dropdownInputContainer} onPress={() => setShowGenreDropdown(!showGenreDropdown)}>
          <Text style={styles.dropdownInputText}>{selectedGenre || 'Select Genre'}</Text>
          <MaterialIcons name={showGenreDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#aaa" />
        </TouchableOpacity>

        {showGenreDropdown && (
          <View style={styles.dropdownListContainer}>
            {genres.map((genreOption) => (
              <TouchableOpacity
                key={genreOption}
                style={[styles.dropdownItem, selectedGenre === genreOption && styles.dropdownItemActive]}
                onPress={() => {
                  setSelectedGenre(genreOption);
                  setShowGenreDropdown(false);
                }}
              >
                <Text style={[styles.dropdownItemText, selectedGenre === genreOption && styles.dropdownItemTextActive]}>{genreOption}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.label}>Reviews</Text>
        <View style={styles.reviewsContainer}>
          {/* Placeholder for star ratings */}
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name={i < 4 ? 'star' : 'star-o'} // 4 filled, 1 outline based on image
              size={18}
              color="#ffc107" // Star color (example: yellow)
              style={styles.starIcon}
            />
          ))}
        </View>

        <Text style={styles.label}>Upload Your Video</Text>
        <TouchableOpacity style={styles.videoUploadContainer}>
          {/* Placeholder for upload icon and text */}
          <MaterialIcons name="photo-camera" size={30} color="#a95eff" />
          <Text style={styles.uploadVideoText}>Upload Video</Text>
        </TouchableOpacity>

        {/* Main Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
           <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>

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
    paddingTop:40,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 50, // Add padding to the bottom
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 48,
    backgroundColor: '#1a1a1a', // Input background color
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  reviewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  starIcon: {
    marginRight: 5,
  },
  videoUploadContainer: {
    borderWidth: 1,
    borderColor: '#a95eff', // Border color
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    height: 200, // Example height
  },
  uploadVideoText: {
    color: '#a95eff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#a95eff', // Purple background
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 0,
    height: 48,
    backgroundColor: '#1a1a1a',
    justifyContent: 'space-between',
  },
  dropdownInputText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownListContainer: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemActive: {
    backgroundColor: '#a95eff',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ArtistUpload; 