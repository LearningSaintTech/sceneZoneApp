import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ArtistAboutScreen = ({ navigation }) => {
  const handleAboutUsPress = () => {
    Linking.openURL('https://thescenezone.com/about');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.text}>
          To know more about SceneZone, kindly refer to{' '}
          <Text style={styles.link} onPress={handleAboutUsPress} accessibilityRole="link">
            <Text style={styles.bold}> about us</Text>
          </Text>
          .
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 40,
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
  },
  bold: {
    fontWeight: '500',
    color: '#a95eff',
  },
});

export default ArtistAboutScreen;
