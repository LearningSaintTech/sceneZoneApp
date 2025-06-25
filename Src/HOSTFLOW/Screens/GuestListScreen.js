import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GuestListScreen = ({ navigation }) => {
  // Sample data for the guest list (replace with actual data from your API or state)
  const guestData = [
    { id: '1', name: 'Nova Brightsky', ticketId: '#9954673009' },
    { id: '2', name: 'Celeste Moonshadow', ticketId: '#9954673009' },
    { id: '3', name: 'Stella Nightingale', ticketId: '#9954673009' },
    { id: '4', name: 'Aurora Skyrunner', ticketId: '#9954673009' },
    { id: '5', name: 'Vega Starwhisper', ticketId: '#9954673009' },
    { id: '6', name: 'Lyra Starstream', ticketId: '#9954673009' },
    { id: '7', name: 'Comet Dreamweaver', ticketId: '#9954673009' },
    { id: '8', name: 'Serena Lightbringer', ticketId: '#9954673009' },
  ];

  const textColor = '#fff';
  const subColor = '#ccc';

  const insets = useSafeAreaInsets();

  // Render each guest item
  const renderGuestItem = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={[styles.guestName, { color: textColor }]}>{item.name}</Text>
      <Text style={[styles.ticketId, { color: subColor }]}>Ticket ID: {item.ticketId}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={textColor} />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.centerText}>Guest List</Text>
        </View>
        {/* Dropdown/Filter (for "Level 1") */}
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Level 1</Text>
          <Feather name="chevron-down" size={16} color={textColor} style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>

      {/* Guest List */}
      <FlatList
        data={guestData}
        renderItem={renderGuestItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 32,
  },
  iconCircle: {
    backgroundColor: '#2c2c2c',
    borderRadius: 50,
    padding: 6,
  },
  centerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  centerText: {
    backgroundColor: '#2c2c2c',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  filterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginRight: 4,
  },
  chevronIcon: {
    marginLeft: 2,
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 20,
  },
  guestItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  guestName: {
    fontSize: 14,
    fontWeight: '500',
  },
  ticketId: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default GuestListScreen;