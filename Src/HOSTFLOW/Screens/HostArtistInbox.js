import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const eventData = [
  {
    id: '1',
    image: require('../assets/Images/fff.jpg'),
    date: '15 May 2026',
    budget: '$750',
    genre: 'Indie Rock',
  },
  {
    id: '2',
    image: require('../assets/Images/frame1.png'),
    date: '15 May 2026',
    budget: '$750',
    genre: 'Indie Rock',
  },
  {
    id: '3',
    image: require('../assets/Images/fff.jpg'),
    date: '15 May 2026',
    budget: '$750',
    genre: 'Indie Rock',
  },
  {
    id: '4',
    image: require('../assets/Images/frame1.png'),
    date: '15 May 2026',
    budget: '$750',
    genre: 'Indie Rock',
  },
  {
    id: '5',
    image: require('../assets/Images/fff.jpg'),
    date: '15 May 2026',
    budget: '$750',
    genre: 'Indie Rock',
  },
];

const HostArtistInbox = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Chat')}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.budgetText}>Budget: {item.budget}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <Text style={styles.genreText}>Genre: <Text style={{fontWeight:'bold'}}>Indie Rock</Text></Text>
      </View>
      <TouchableOpacity style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={18} color="#FF4B4B" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#C6C5ED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Artist</Text>
      </View>
      <View style={styles.divider} />
      <FlatList
        data={eventData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginTop: 16,
    marginBottom: 16,
    marginHorizontal: 0,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 20,
    marginBottom: 18,
    padding: 0,
    borderWidth: 0,
    minHeight: 78,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 14,
    marginLeft: 14,
    marginRight: 12,
    marginVertical: 10,
    backgroundColor: '#333',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingLeft: 0,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  budgetText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito Sans',
  },
  dateText: {
    color: '#A084E8',
    fontSize: 10,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
  },
  genreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    marginTop: 2,
    textAlign: 'left',
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
});

export default HostArtistInbox;
