import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ArtistHelpCentreScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Centre</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            For any query kindly contact -{' '}
            <Text style={styles.link} onPress={() => {
              const email = 'thescenezoneofficial@gmail.com';
              const subject = encodeURIComponent('SceneZone App Query');
              const mailtoUrl = `mailto:${email}?subject=${subject}`;
              Linking.openURL(mailtoUrl);
            }} accessibilityRole="link">
              thescenezoneofficial@gmail.com
            </Text>
          </Text>
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
    paddingTop:30,
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
    paddingVertical: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  text: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    lineHeight: 24,
  },
  link: {
    color: '#a95eff',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});

export default ArtistHelpCentreScreen; 