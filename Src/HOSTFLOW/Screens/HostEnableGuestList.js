import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const HostEnableGuestListScreen = ({ navigation }) => {
  // Sample data for the guest list (replace with actual data from your API or state)
  const guestData = [
    { id: '1', name: 'Nova ZSDGFHBrightsky', ticketId: '#8954673009' },
    { id: '2', name: 'Celeste Moonshadow', ticketId: '#8954673009' },
    { id: '3', name: 'Stella Nightingale', ticketId: '#8954673009' },
    { id: '4', name: 'Aurora Skydancer', ticketId: '#8954673009' },
    { id: '5', name: 'Vega Starwhisper', ticketId: '#8954673009' },
    { id: '6', name: 'Lyra Starstream', ticketId: '#8954673009' },
    { id: '7', name: 'Comet Dreamweaver', ticketId: '#8954673009' },
    { id: '8', name: 'Serena Lightbringer', ticketId: '#8954673009' },
    { id: '9', name: 'Cassiopeia Brightheart', ticketId: '#8954673009' },
    { id: '10', name: 'Andromeda Starfire', ticketId: '#8954673009' },
  ];

  const textColor = '#fff';
  const subColor = '#b3b3cc';

  // Render each guest item
  const renderGuestItem = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={styles.guestName}>{item.name}</Text>
      <Text style={styles.ticketId}>Ticket ID: {item.ticketId}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>Guest List</Text>
        </View>
        {/* Dropdown/Filter (for "Level 1") */}
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Level 1</Text>
          <Feather name="chevron-down" size={16} color="#a95eff" style={styles.chevronIcon} />
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
    backgroundColor: 'rgba(26, 26, 31, 1)',
  },
  header: {
    marginTop:25,
    width: 393,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: 700,
    color: '#fff',
    marginRight:120,
    lineHeight:24,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 106,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: 'transparent',
    marginRight:30,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  chevronIcon: {
    marginLeft: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  guestItem: {
    backgroundColor: 'rgba(26, 26, 31, 1)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2d2d3a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  guestName: {
    color: '#7952FC',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  ticketId: {
    fontSize: 14,
    marginTop: 4,
    fontWeight:400,
    color: '#b3b3cc',
  },
});

export default HostEnableGuestListScreen; 