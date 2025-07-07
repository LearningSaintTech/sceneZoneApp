import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomToggle from '../Components/CustomToggle';
import { useSelector } from 'react-redux';
import {jwtDecode} from 'jwt-decode'; // Ensure this is installed (e.g., npm install jwt-decode)

const HostChatList = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [isNegotiationEnabled, setIsNegotiationEnabled] = useState(false);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);
  const { eventId } = route.params; // Get eventId from navigation params
  const BASE_URL = 'http://192.168.1.52:3000';

  // Decode token to get user role and ID
  let userId = null;
  let role = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded.hostId; // Assuming hostId is the user ID in the token
    role = decoded.role;
    console.log('Token decoded successfully', { userId, role });
  } catch (err) {
    console.error('Token decode error:', err.message);
    setError('Invalid authentication token');
    setLoading(false);
  }

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      if (!token || !eventId) {
        setError('Missing token or event ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}/api/chat/get-chats/${eventId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', JSON.stringify(data, null, 2));

        if (!response.ok) {
          throw new Error(data.message || `HTTP error! Status: ${response.status}`);
        }

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format: Expected an array of chats');
        }

        const validChats = data
          .filter(chat => 
            chat && 
            typeof chat === 'object' && 
            chat._id && 
            chat.hostId && 
            chat.artistId
          )
          .map(chat => ({
            id: chat._id,
            hostId: chat.hostId._id,
            hostName: chat.hostId.fullName,
            hostImage: chat.hostId.profileImageUrl || null,
            artistId: chat.artistId._id,
            artistName: chat.artistId.fullName,
            artistImage: chat.artistId.profileImageUrl || null,
            lastMessage: chat.latestProposedPrice ? `$${chat.latestProposedPrice}` : '',
            unreadCount: 0, // Adjust based on API if available
            lastMessageAt: chat.lastMessageAt || null,
          }));

        console.log('Valid Chats:', JSON.stringify(validChats, null, 2));
        setChats(validChats);
        setFilteredChats(validChats);
        setLoading(false);
      } catch (err) {
        console.error('Fetch Error:', err.message);
        setError(typeof err.message === 'string' ? err.message : 'Failed to fetch chats');
        setLoading(false);
      }
    };

    fetchChats();
  }, [token, eventId]);

  // Search filtering
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat => {
        const name = role === 'host' ? chat.artistName : chat.hostName;
        return name.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredChats(filtered);
    }
  }, [searchText, chats, role]);

  // Render message item
  const renderMessageItem = ({ item }) => {
    const displayName = role === 'host' ? item.artistName : item.hostName;
    const displayImage = role === 'host' ? item.artistImage : item.hostImage;

    return (
      <TouchableOpacity
        style={styles.messageCard}
        onPress={() => navigation.navigate('HostNegotiationAvailable', { chatId: item.id })}
      >
        <View style={styles.profileImagePlaceholder}>
          <Image
            source={displayImage ? { uri: displayImage } : require('../assets/Images/fff.jpg')}
            style={styles.profileImage}
            defaultSource={require('../assets/Images/fff.jpg')}
          />
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.negotiationToggleContainer}>
        <Text style={styles.negotiationToggleText}>Enable Negotiation</Text>
        <CustomToggle
          value={isNegotiationEnabled}
          onValueChange={setIsNegotiationEnabled}
        />
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Message"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <View style={styles.searchSeparator} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chats...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredChats.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchText ? 'No chats match your search' : 'No chats found'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderMessageItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ArtistBottomNavBar navigation={navigation} insets={insets} isLoading={false} />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
    flex: 1,
    textAlign: 'center',
  },
  negotiationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  negotiationToggleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: 361,
    height: 52,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
    marginHorizontal: 16,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 14,
  },
  searchSeparator: {
    width: 361,
    height: 1,
    backgroundColor: '#24242D',
    alignSelf: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageCard: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 8,
    paddingRight: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#aaa',
  },
  unreadBadge: {
    backgroundColor: '#a95eff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HostChatList;