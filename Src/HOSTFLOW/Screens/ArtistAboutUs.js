import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ArtistAboutUsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>
      <ScrollView style={styles.scrollViewContent}>
        {/* Placeholder About Us Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>This is a placeholder for the About Us information.</Text>
          <Text style={styles.contentText}>Add details about your app or organization here.</Text>
        </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  contentContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 16,
  },
  contentText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
});

export default ArtistAboutUsScreen; 