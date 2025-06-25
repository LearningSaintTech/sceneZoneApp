import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const notificationsData = [
  {
    id: '1',
    type: 'booking',
    budget: '$500',
    genre: 'Rock',
    date: '06 Feb 2025',
    rating: 4,
  },
  {
    id: '2',
    type: 'guest_list',
    user: 'User 23',
    date: '06 Feb 2025',
    rating: 4,
  },
  // Add more placeholder notification data here
  { id: '3', type: 'placeholder', text: 'Notifications' },
  { id: '4', type: 'placeholder', text: 'Notifications' },
  { id: '5', type: 'placeholder', text: 'Notifications' },
  { id: '6', type: 'placeholder', text: 'Notifications' },
  { id: '7', type: 'placeholder', text: 'Notifications' },
  { id: '8', type: 'placeholder', text: 'Notifications' },
  { id: '9', type: 'placeholder', text: 'Notifications' },
  { id: '10', type: 'placeholder', text: 'Notifications' },
];

const AVATAR = require('../assets/Images/frame1.png'); // Adjust path as needed

const ArtistNotificationScreen = ({ navigation }) => {
  const renderNotificationItem = ({ item }) => {
    if (item.type === 'booking') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.cardRowMain}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarShadow}>
                <View style={styles.avatarBorder}>
                  <View style={styles.avatarInner}>
                    <Image source={AVATAR} style={{ width: 64, height: 64, borderRadius: 12 }} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardContentMain}>
              <View style={styles.cardRow}>
                <Text>
                  <Text style={styles.budgetLabel}>Budget : </Text>
                  <Text style={styles.budgetValue}>{item.budget}</Text>
                </Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <Text style={styles.genreRow}>
                <Text style={styles.genreLabel}>Genre : </Text>
                <Text style={styles.genreValue}>{item.genre}</Text>
              </Text>
              <View style={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={i < item.rating ? 'star' : 'star-o'}
                    size={16}
                    color={i < item.rating ? '#ffc107' : '#aaa'}
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.acceptButton}>
                  <LinearGradient colors={['#28a745', '#218838']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Accept</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton}>
                  <Text style={[styles.buttonText, styles.rejectButtonText]}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item.type === 'guest_list') {
      return (
        <View style={styles.notificationCard}>
          <View style={styles.cardRowMain}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarShadow}>
                <View style={styles.avatarBorder}>
                  <View style={styles.avatarInner}>
                    <Image source={AVATAR} style={{ width: 64, height: 64, borderRadius: 12 }} />
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.cardContentMain}>
              <View style={styles.cardRow}>
                <Text style={styles.guestListLabel}>Guest List Request</Text>
                <Text style={styles.cardDate}>{item.date}</Text>
              </View>
              <Text style={styles.guestUser}>{item.user}</Text>
              <View style={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name={i < item.rating ? 'star' : 'star-o'}
                    size={16}
                    color={i < item.rating ? '#ffc107' : '#aaa'}
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.addButton}
                  onPress={() => navigation.navigate('ArtistFormBooking')}
                >
                  <LinearGradient colors={['#a95eff', '#b33bf6']} style={styles.buttonGradient}>
                    <Text style={styles.buttonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButtonGuest}>
                  <Text style={[styles.buttonText, styles.rejectButtonTextGuest]}>Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      );
    } else if (item.type === 'placeholder') {
      return (
        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>{item.text}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>
      <FlatList
        data={notificationsData}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#34344A',
    backgroundColor: '#18171D',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  cardRowMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatarShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarBorder: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#34344A',
    overflow: 'hidden',
  },
  avatarInner: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContentMain: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  budgetLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  budgetValue: {
    color: '#C6C5ED',
    fontFamily: 'Poppins',
    fontSize: 12,
    fontWeight: '400',
  },
  genreRow: {
    marginBottom: 2,
  },
  genreLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '400',
  },
  genreValue: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
  },
  guestListLabel: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '400',
  },
  guestUser: {
    color: '#fff',
    fontFamily: 'Poppins',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 13,
    color: '#A084E8',
    fontFamily: 'Poppins',
    fontWeight: '400',
  },
  starRating: {
    flexDirection: 'row',
    marginBottom: 8,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  addButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 8,
  },
  rejectButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  rejectButtonGuest: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#A084E8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Poppins',
  },
  rejectButtonText: {
    color: '#dc3545',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  rejectButtonTextGuest: {
    color: '#A084E8',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  placeholderCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 16,
  },
});

export default ArtistNotificationScreen; 