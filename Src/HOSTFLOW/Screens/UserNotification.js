import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const notificationsToday = [
  {
    id: '1',
    title: 'Event Booked Successfully for WJNC #9',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '25 Oct 2024',
    time: '11:31 AM',
  },
   {
    id: '2',
    title: '3 more days until WJNC #9 starts!',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '15 Oct 2024',
    time: '9:30 AM',
  },
   {
    id: '3',
    title: 'Event Review Request',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '10 Oct 2024',
    time: '09:43 AM',
  },
    {
    id: '4',
    title: 'Event Booked Successfully',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '9 Oct 2024',
    time: '10:10 AM',
  },
];

const notificationsYesterday = [
   {
    id: '5',
    title: 'Event Review Request',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '10 Oct 2024',
    time: '09:43 AM',
  },
    {
    id: '6',
    title: 'Event Booked Successfully',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididu...',
    date: '9 Oct 2024',
    time: '10:10 AM',
  },
];

const NotificationItem = ({ title, description, date, time }) => (
  <View style={styles.notificationItem}>
    <View style={styles.notificationIconContainer}>
      <Ionicons name="notifications-outline" size={24} color="#a95eff" />
    </View>
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationDescription}>{description}</Text>
      <Text style={styles.notificationTimestamp}>{date} • {time}</Text>
    </View>
  </View>
);

const UserNotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity style={styles.newButton}>
          <Text style={styles.newButtonText}>1 NEW</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
      
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TODAY</Text>
          <TouchableOpacity>
             <Text style={styles.markAsReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
        {notificationsToday.map(notification => (
          <NotificationItem key={notification.id} {...notification} />
        ))}

         <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>YESTERDAY</Text>
          <TouchableOpacity>
             <Text style={styles.markAsReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
         {notificationsYesterday.map(notification => (
          <NotificationItem key={notification.id} {...notification} />
        ))}

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
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  newButton: {
    backgroundColor: '#a95eff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
  },
  newButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a', // Slightly lighter dark for section header
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  markAsReadText: {
    fontSize: 14,
    color: '#a95eff',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333', // Dark circle background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default UserNotificationScreen; 