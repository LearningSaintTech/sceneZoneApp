import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ArtistGeneralSettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>General Settings</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollViewContent}>
        {/* Placeholder Settings Options */}
        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ArtistPrivacy')}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#a95eff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Privacy Policy</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ArtistTerms')}>
          <Ionicons name="document-text-outline" size={24} color="#a95eff" style={styles.optionIcon} />
          <Text style={styles.optionText}>Terms of Service</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('ArtistAbout')}>
          <Ionicons name="information-circle-outline" size={24} color="#a95eff" style={styles.optionIcon} />
          <Text style={styles.optionText}>About Us</Text>
          <Icon name="chevron-right" size={24} color="#A58AFF" style={styles.chevronIcon} />
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
    paddingTop: 30,
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
    backgroundColor: '#18171D',
    borderRadius: 20,
    marginVertical: 6,
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 72,
    borderWidth: 1.5,
    borderColor: '#39355B',
    width: '92%',
    alignSelf: 'center',
    shadowColor: 'transparent',
  },
  optionIcon: {
    marginLeft: 28,
    marginRight: 20,
    alignSelf: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontWeight: '600',
    lineHeight: 22,
    textAlignVertical: 'center',
  },
  chevronIcon: {
    marginRight: 28,
    alignSelf: 'center',
  },
});

export default ArtistGeneralSettingsScreen; 



