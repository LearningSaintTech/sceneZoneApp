import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SendIcon from '../assets/icons/Send';

const HostNegotiationAvailableScreen = ({ navigation }) => {
  const [price, setPrice] = useState('');

  // Placeholder images (replace with actual image sources)
  const hostImage = require('../assets/Images/frame1.png'); // Assume you have placeholder images
  const artistImage = require('../assets/Images/profile.png'); // Assume you have placeholder images

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Negotiation</Text>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update Price</Text>
        </TouchableOpacity>
      </View>

      {/* Separator Line */}
      <View style={styles.separator} />

      {/* Negotiation Section */}
      <View style={styles.negotiationArea}>
        {/* Host Negotiation Bubble */}
        <View style={styles.hostBubbleContainer}>
          <Image source={hostImage} style={styles.profileImage} />
          <View style={styles.hostBubble}>
            <Text style={styles.hostBubbleText}>Host: ₹4000</Text>
          </View>
        </View>

        {/* Artist Negotiation Bubble */}
        <View style={styles.artistBubbleContainer}>
          <View style={styles.artistBubble}>
            <Text style={styles.artistBubbleText}>Artist: ₹5000</Text>
          </View>
          <Image source={artistImage} style={styles.profileImage} />
        </View>

        {/* Add more negotiation bubbles here if needed */}
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <Text style={styles.inputHint}>Numeric Inputs Only</Text>
        <View style={styles.priceInputContainer}>
          <Text style={styles.rupeeSymbol}>₹</Text>
          <TextInput
            style={styles.priceInput}
            value={price}
            onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))} // Allow only numeric input
            keyboardType="numeric"
            placeholder="5000"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.sendButton}>
            <SendIcon />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e', // Dark background color from image
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    paddingTop:20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontStyle:'normal',
    color: '#fff',
    fontFamily:'Nunito Sans',
    marginRight:85,
  },
  updateButton: {
    backgroundColor: '#a95eff', // Purple button background
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  updateButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 5,
  },
  negotiationArea: {
    flex: 1, // Take up remaining space
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  hostBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-start', // Align to the left
  },
  artistBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'flex-end', // Align to the right
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ccc', // Placeholder background
  },
  hostBubble: {
    backgroundColor: '#a95eff', // Light purple background
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  artistBubble: {
    backgroundColor: '#4a4a60', // Darker purple background
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  hostBubbleText: {
    fontSize: 14,
    color: '#fff',
  },
  artistBubbleText: {
    fontSize: 14,
    color: '#fff',
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center', // Center input section horizontally
  },
  inputHint: {
    fontSize: 12,
    color: '#ccc', // Light gray hint text
    marginBottom: 5,
    alignSelf: 'flex-end', // Align hint text to the right
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#282828', // Darker background for input
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    width: '100%', // Take full width
  },
  rupeeSymbol: {
    fontSize: 14,
    color: '#fff',
    marginRight: 5,
  },
  priceInput: {
    flex: 1, // Take remaining space
    fontSize: 14,
    color: '#fff',
    paddingVertical: 0, // Remove default vertical padding
  },
  sendButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HostNegotiationAvailableScreen; 