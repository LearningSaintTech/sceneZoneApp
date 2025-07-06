import React, { useState } from 'react';
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

const guestListData = [
  { id: '1', name: 'Nova Brightsky', ticketId: '#8954673009' },
  { id: '2', name: 'Celeste Moonshadow', ticketId: '#8954673009' },
  { id: '3', name: 'Stella Nightingale', ticketId: '#8954673009' },
  { id: '4', name: 'Aurora Skydancer', ticketId: '#8954673009' },
  { id: '5', name: 'Vega Starwhisper', ticketId: '#8954673009' },
  { id: '6', name: 'Lyra Starstream', ticketId: '#8954673009' },
  { id: '7', name: 'Comet Dreamweaver', ticketId: '#8954673009' },
  { id: '8', name: 'Serena Lightbringer', ticketId: '#8954673009' },
  // Add more placeholder guest data here
];

const ArtistGuestListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const textColor = '#fff';
  const subColor = '#ccc';

  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const levelOptions = ['Level 1', 'Level 2', 'Level 3'];

  const renderGuestItem = ({ item }) => (
    <View style={styles.guestItem}>
      <Text style={styles.guestName}>{item.name}</Text>
      <Text style={styles.ticketId}>Ticket ID: {item.ticketId}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 16 }]}> 
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={32} color="#C6C5ED" />
        </TouchableOpacity>
        <View style={styles.centerTitle}>
          <Text style={styles.headerTitleText}>Guest List</Text>
        </View>
        {/* Dropdown/Filter (for "Level 1") */}
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={styles.filterButton} onPress={() => setDropdownVisible(!dropdownVisible)}>
            <Text style={styles.filterText}>{selectedLevel}</Text>
            <Feather name="chevron-down" size={16} color={textColor} style={styles.chevronIcon} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Render dropdown at root level for visibility */}
      {dropdownVisible && (
        <View style={styles.dropdownMenuRoot}>
          <View style={styles.dropdownMenu}>
            {levelOptions.map((level) => (
              <TouchableOpacity
                key={level}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedLevel(level);
                  setDropdownVisible(false);
                }}
              >
                <Text style={[styles.dropdownItemText, selectedLevel === level && { color: '#B15CDE', fontWeight: 'bold' }]}>{level}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {/* Guest List */}
      <FlatList
        data={guestListData}
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
    backgroundColor: '#121212',
  },
  header: {
    width: 393,
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    flexShrink: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    marginLeft: 0,
    padding: 0,
  },
  centerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight: 90,
    lineHeight: 24,
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
    marginRight: 30,
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
    backgroundColor: '#1a1a1a',
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
    fontWeight: '400',
    color: '#b3b3cc',
  },
  dropdownMenuRoot: {
    position: 'absolute',
    top: 80,
    right: 30,
    zIndex: 999,
    width: 120,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: '#232336',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B15CDE',
    zIndex: 100,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ArtistGuestListScreen; 