import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">Notification</Text>
      </View>

      {/* Notification Card */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.notificationCard}>
          <View style={styles.row}>
            <Image
              source={require('../assets/Images/swiper.png')} // ✅ replace with your actual image
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.budget}>Budget: $500</Text>
              <Text style={[styles.genre, { marginTop: 4 }]}>
                Genre : <Text style={styles.bold}>Rock</Text>
              </Text>
              <View style={[styles.stars, { marginTop: 4 }]}>
                {[...Array(5)].map((_, index) => (
                  <Icon key={index} name="star" size={14} color="#FFD700" />
                ))}
              </View>
            </View>
            <Text style={styles.date}>06 Feb 2025</Text>
          </View>

          <TouchableOpacity style={styles.acceptedButton}>
            <Text style={styles.acceptedText}>Accepted</Text>
            <Icon name="check-circle" size={16} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>

        {/* Dummy Notification Items */}
        {[...Array(10)].map((_, i) => (
          <View key={i} style={styles.notificationItem}>
            <Text style={styles.notificationText}>Notifications</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    marginLeft: 16,
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  notificationCard: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 16,
    backgroundColor: '#F6F8FA',
    marginBottom: 16,
    marginTop:10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  budget: {
    color: '#A6A6A6',
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  genre: {
    color: '#A6A6A6',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
  },
  bold: {
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Poppins',
    fontSize: 16,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 6,
  },
  date: {
    color: '#ccc',
    fontSize: 11,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  acceptedButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#34C759',
    backgroundColor: '#34C759',
    marginTop: 10,
    flexDirection: 'row',
  },
  acceptedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '400',
  },
  notificationItem: {
    display: 'flex',
    height: 48,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34344A',
    marginBottom: 10,
    backgroundColor: 'rgba(252,252,253,0.04)', // fallback for gradient
    // For gradient, you would need to use a LinearGradient component from 'react-native-linear-gradient'
  },
  notificationText: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'left',
    width: '100%',
  },
});

export default NotificationScreen;
