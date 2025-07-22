import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal as RNModal,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import { API_BASE_URL } from '../Config/env';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { SocketContext } from '../../../App';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from "react-native-linear-gradient";

const { width } = Dimensions.get('window');

const NegotiationScreen = ({ navigation, route }) => {
  const [price, setPrice] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [participant, setParticipant] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUpdatePriceEnabled, setIsUpdatePriceEnabled] = useState(true);
  const flatListRef = useRef(null);
  const defaultImage = require('../assets/Images/profile.png');
  const { chatId, eventId } = route.params || {};
  const { token } = useSelector((state) => state.auth);
  const socket = useContext(SocketContext);
  const [customAlert, setCustomAlert] = useState({ visible: false, title: '', message: '' });

  if (!socket) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>Connecting to chat service...</Text>
      </SafeAreaView>
    );
  }

  console.log('NegotiationScreen initialized', {
    timestamp: new Date().toISOString(),
    chatId,
    eventId,
    token: !!token,
  });

  const logDebug = (message, data) => {
    console.log(`[${new Date().toISOString()}] ${message}`, JSON.stringify(data, null, 2));
  };

  // Fetch current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        logDebug('No authentication token found', { token });
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      try {
        logDebug('Attempting to decode token', { token });
        const decoded = jwtDecode(token);
        logDebug('Token decoded successfully', { decoded });

        const { hostId: userId, role } = decoded;
        if (!userId || !role) {
          logDebug('Invalid token data', { userId, role });
          throw new Error('Invalid token data: missing userId or role');
        }

        const endpoint = role === 'host' ? '/host/auth/getHost' : '/artist/auth/get-artist';
        logDebug('Fetching user details', { endpoint, userId });
        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { id: userId },
        });

        logDebug('User API response', { response: response.data });
        if (response.data.success) {
          const userData = role === 'host' ? response.data.data.user : response.data.data;
          setCurrentUser({
            id: userData._id,
            role,
            fullName: userData.fullName || 'Unknown',
            profileImageUrl: userData.profileImageUrl || null,
          });
          logDebug('Current user set', {
            id: userData._id,
            role,
            fullName: userData.fullName,
            profileImageUrl: userData.profileImageUrl,
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch user details');
        }
      } catch (err) {
        logDebug('Error fetching current user', {
          message: err.message,
          response: err.response?.data,
        });
        setError('Failed to load user details');
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Fetch participant details and chat history
  const fetchParticipantDetailsAndChat = async () => {
    if (!chatId || !currentUser) {
      logDebug('Missing chatId or currentUser', { chatId, currentUser });
      setError('Missing chat or user information');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      logDebug('Fetching chat history', { chatId });
      const response = await axios.get(`${API_BASE_URL}/chat/get-chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      logDebug('Chat API response', { response: response.data });
      const chatData = response.data;

      if (!chatData || !chatData.hostId || !chatData.artistId) {
        throw new Error('Invalid chat data');
      }

      const participantData = currentUser.role === 'host' ? chatData.artistId : chatData.hostId;
      setParticipant({
        id: participantData._id,
        fullName: participantData.fullName || 'Unknown',
        profileImageUrl: participantData.profileImageUrl || null,
      });
      logDebug('Participant set', {
        id: participantData._id,
        fullName: participantData.fullName,
        profileImageUrl: participantData.profileImageUrl,
      });

      const sortedMessages = (chatData.messages || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMessages(sortedMessages.map((msg) => ({
        _id: msg._id,
        senderModel: msg.senderType,
        message: msg.proposedPrice ? `${msg.senderType === 'HostAuthentication' ? 'Host' : 'Artist'}: ₹${msg.proposedPrice}` : '',
        price: msg.proposedPrice || 0,
        artistApproved: chatData.isArtistApproved,
        hostApproved: chatData.isHostApproved,
        timestamp: msg.createdAt,
      })));

      setIsUpdatePriceEnabled(!chatData.isNegotiationComplete);
      logDebug('UpdatePriceEnabled status set', {
        isUpdatePriceEnabled: !chatData.isNegotiationComplete,
        isNegotiationComplete: chatData.isNegotiationComplete,
        isArtistApproved: chatData.isArtistApproved,
        isHostApproved: chatData.isHostApproved,
      });

      setError(null);
      setLoading(false);
    } catch (err) {
      logDebug('Error fetching chat history', {
        message: err.message,
        response: err.response?.data,
      });
      setError('Failed to load chat history. Tap to retry.');
      setLoading(false);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async () => {
    try {
      if (!token || !chatId) {
        logDebug('No token or chatId for marking messages as read', { token, chatId });
        return;
      }
      logDebug('Marking messages as read', { chatId });
      await axios.put(
        `${API_BASE_URL}/chat/read/${chatId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      logDebug('Messages marked as read', {});
    } catch (err) {
      logDebug('Error marking messages as read', {
        message: err.message,
        response: err.response?.data,
      });
    }
  };

  // Socket.IO listeners
  useEffect(() => {
    if (!socket || !chatId || !currentUser) return;

    socket.onNewMessage((chat) => {
      if (chat._id === chatId) {
        logDebug('Received new message via Socket.IO', { chat });
        const sortedMessages = (chat.messages || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages.map((msg) => ({
          _id: msg._id,
          senderModel: msg.senderType,
          message: msg.proposedPrice ? `${msg.senderType === 'HostAuthentication' ? 'Host' : 'Artist'}: ₹${msg.proposedPrice}` : '',
          price: msg.proposedPrice || 0,
          artistApproved: chat.isArtistApproved,
          hostApproved: chat.isHostApproved,
          timestamp: msg.createdAt,
        })));
        setIsUpdatePriceEnabled(!chat.isNegotiationComplete);
        if (chat.isNegotiationComplete) {
          setCustomAlert({ visible: true, title: 'Negotiation Complete', message: `Price of ₹${chat.latestProposedPrice} has been finalized by both parties!` });
          setTimeout(() => {
            navigation.navigate('HostDetailUpdateBookingScreen', {
              artist: {
                artistId: chat.artistId._id,
                profileImageUrl: chat.artistId.profileImageUrl,
                approvedPrice: chat.latestProposedPrice,
              },
              eventId,
            });
          }, 1200);
        }
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    });

    socket.onPriceApproved((chat) => {
      if (chat._id === chatId) {
        logDebug('Price approved via Socket.IO', { chat });
        const sortedMessages = (chat.messages || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages.map((msg) => ({
          _id: msg._id,
          senderModel: msg.senderType,
          message: msg.proposedPrice ? `${msg.senderType === 'HostAuthentication' ? 'Host' : 'Artist'}: ₹${msg.proposedPrice}` : '',
          price: msg.proposedPrice || 0,
          artistApproved: chat.isArtistApproved,
          hostApproved: chat.isHostApproved,
          timestamp: msg.createdAt,
        })));
        setIsUpdatePriceEnabled(!chat.isNegotiationComplete);
        if (chat.isNegotiationComplete) {
          setCustomAlert({ visible: true, title: 'Negotiation Complete', message: `Price of ₹${chat.latestProposedPrice} has been finalized by both parties!` });
          setTimeout(() => {
            navigation.navigate('HostDetailUpdateBookingScreen', {
              artist: {
                artistId: chat.artistId._id,
                profileImageUrl: chat.artistId.profileImageUrl,
                approvedPrice: chat.latestProposedPrice,
              },
              eventId,
            });
          }, 1200);
        }
      }
    });

    return () => {
      socket.onNewMessage(null);
      socket.onPriceApproved(null);
    };
  }, [socket, chatId, currentUser, navigation, eventId]);

  // Fetch initial chat history and mark messages as read
  useEffect(() => {
    if (currentUser && chatId) {
      fetchParticipantDetailsAndChat();
      markMessagesAsRead();
    }
  }, [currentUser, chatId]);

  // Send price message
  const handleUpdatePrice = async () => {
    try {
      if (!token || !chatId || !price || isNaN(price)) {
        logDebug('Invalid parameters for sending price message', {
          token: !!token,
          chatId,
          price,
        });
        setCustomAlert({ visible: true, title: 'Error', message: 'Invalid input or authentication' });
        return;
      }

      const messagePrefix = currentUser.role === 'host' ? 'Host' : 'Artist';
      logDebug('Sending price message', {
        chatId,
        message: `${messagePrefix}: ₹${price}`,
      });
      const response = await axios.post(
        `${API_BASE_URL}/chat/send-message/${chatId}`,
        {
          proposedPrice: parseFloat(price),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      logDebug('Price message sent successfully', { response: response.data });
      setPrice('');
      await fetchParticipantDetailsAndChat();
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      logDebug('Error sending price message', {
        message: err.message,
        response: err.response?.data,
      });
      setCustomAlert({ visible: true, title: 'Error', message: 'Failed to send price update' });
    }
  };

  // Approve price
  const handleApprovePrice = async () => {
    try {
      if (!token || !chatId) {
        logDebug('No token or chatId for approving price', { token, chatId });
        setCustomAlert({ visible: true, title: 'Error', message: 'No authentication token or chat ID' });
        return;
      }

      logDebug('Approving price', { chatId });
      const response = await axios.patch(
        `${API_BASE_URL}/chat/approve-price/${chatId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      logDebug('Price approved successfully', { response: response.data });
      await fetchParticipantDetailsAndChat();
    } catch (err) {
      logDebug('Error approving price', {
        message: err.message,
        response: err.response?.data,
      });
      setCustomAlert({ visible: true, title: 'Error', message: 'Failed to approve price' });
    }
  };

  // Render message
  const renderMessage = ({ item }) => {
    const isSender = item.senderModel === (currentUser?.role === 'host' ? 'HostAuthentication' : 'ArtistAuthentication');
    const isPriceMessage = item.price > 0;
    const canApprove = !item.isNegotiationComplete && isPriceMessage && (
      (currentUser?.role === 'artist' && !item.artistApproved && item.senderModel === 'HostAuthentication') ||
      (currentUser?.role === 'host' && !item.hostApproved && item.senderModel === 'ArtistAuthentication')
    );

    logDebug('Rendering message', {
      messageId: item._id,
      isSender,
      isPriceMessage,
      canApprove,
      artistApproved: item.artistApproved,
      hostApproved: item.hostApproved,
      currentUserRole: currentUser?.role,
      senderModel: item.senderModel,
    });

    return (
      <View
        style={[
          isSender ? styles.senderBubbleContainer : styles.receiverBubbleContainer,
          { maxWidth: width * 0.85 },
        ]}
      >
        {!isSender && (
          <Image
            source={participant?.profileImageUrl ? { uri: participant.profileImageUrl } : defaultImage}
            style={[styles.profileImage, !participant?.profileImageUrl && styles.noProfileImage]}
            defaultSource={defaultImage}
          />
        )}
        <View
          style={[
            isSender ? styles.senderBubble : styles.receiverBubble,
            item.artistApproved && item.hostApproved && styles.finalizedBubble,
          ]}
        >
          <Text style={isSender ? styles.senderBubbleText : styles.receiverBubbleText}>
            {item.message}
          </Text>
          {isPriceMessage && (
            <View style={styles.approvalStatus}>
              <Text style={styles.approvalText}>
                {item.artistApproved ? '✅ Artist Approved' : '⏳ Artist Pending'}
              </Text>
              <Text style={styles.approvalText}>
                {item.hostApproved ? '✅ Host Approved' : '⏳ Host Pending'}
              </Text>
            </View>
          )}
          {canApprove && (
            <TouchableOpacity
              style={styles.approveButton}
              onPress={handleApprovePrice}
              accessibilityLabel="Approve price"
              accessibilityRole="button"
            >
              <Text style={styles.approveButtonText}>Approve Price</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.timestampText}>
            {new Date(item.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Text>
        </View>
        {isSender && (
          <Image
            source={currentUser?.profileImageUrl ? { uri: currentUser.profileImageUrl } : defaultImage}
            style={[styles.profileImage, !currentUser?.profileImageUrl && styles.noProfileImage]}
            defaultSource={defaultImage}
          />
        )}
      </View>
    );
  };

  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
        <View style={{
          backgroundColor: '#1a1a1a',
          borderRadius: 20,
          padding: 28,
          width: '85%',
          maxWidth: 320,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#333',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}>
          <Ionicons
            name={customAlert.title === 'Negotiation Complete' || customAlert.title === 'Success' ? 'checkmark-done-circle' : 'alert-circle'}
            size={48}
            color="#a95eff"
            style={{ marginBottom: 16 }}
          />
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#a95eff',
            marginBottom: 8,
            textAlign: 'center',
            fontFamily: 'Nunito Sans',
          }}>{customAlert.title}</Text>
          <Text style={{
            fontSize: 15,
            color: '#fff',
            textAlign: 'center',
            lineHeight: 22,
            marginBottom: 24,
            fontFamily: 'Nunito Sans',
          }}>{customAlert.message}</Text>
          <TouchableOpacity
            style={{
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden',
            }}
            onPress={() => setCustomAlert({ ...customAlert, visible: false })}
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              style={{
                paddingVertical: 14,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 12,
              }}
            >
              <Text style={{
                color: '#fff',
                fontSize: 15,
                fontWeight: '600',
                fontFamily: 'Nunito Sans',
              }}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('Back button pressed', {
              timestamp: new Date().toISOString(),
              navigation: 'goBack',
            });
            navigation.goBack();
          }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Negotiation with {participant?.fullName || (currentUser?.role === 'host' ? 'Artist' : 'Host')}
        </Text>
        <TouchableOpacity
          style={isUpdatePriceEnabled ? styles.updateButton : styles.disabledButton}
          onPress={handleUpdatePrice}
          disabled={!isUpdatePriceEnabled}
          accessibilityLabel="Update price"
          accessibilityRole="button"
        >
          <Text style={styles.updateButtonText}>Update Price</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        style={styles.negotiationArea}
        contentContainerStyle={{ paddingBottom: 20 }}
        inverted
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#a95eff" />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : error ? (
            <TouchableOpacity onPress={fetchParticipantDetailsAndChat}>
              <Text style={styles.errorText}>{error}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMessagesText}>
              No negotiation to display
            </Text>
          )
        }
      />

      <View style={styles.inputSection}>
        <TextInput
          style={isUpdatePriceEnabled ? styles.priceInput : styles.disabledInput}
          value={price}
          onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          placeholder="Enter price in ₹"
          placeholderTextColor="#666"
          editable={isUpdatePriceEnabled}
        />
        <TouchableOpacity
          style={isUpdatePriceEnabled && price.length > 0 ? styles.sendButton : styles.disabledButton}
          onPress={handleUpdatePrice}
          disabled={!isUpdatePriceEnabled || price.length === 0}
          accessibilityLabel="Send price"
          accessibilityRole="button"
        >
          <Feather name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <CustomAlertModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2a2a2a',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Nunito Sans',
    marginHorizontal: 12,
  },
  updateButton: {
    backgroundColor: '#a95eff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  updateButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Nunito Sans',
  },
  disabledButton: {
    backgroundColor: '#666',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
  },
  negotiationArea: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  senderBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 12,
    alignSelf: 'flex-end',
  },
  receiverBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 8,
    marginHorizontal: 12,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  noProfileImage: {
    backgroundColor: '#666',
  },
  senderBubble: {
    backgroundColor: '#a95eff',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginLeft: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  receiverBubble: {
    backgroundColor: '#4a4a60',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  finalizedBubble: {
    borderWidth: 2,
    borderColor: '#00ff00',
  },
  senderBubbleText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Nunito Sans',
  },
  receiverBubbleText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Nunito Sans',
  },
  timestampText: {
    fontSize: 12,
    color: '#ccc',
    fontFamily: 'Nunito Sans',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  approvalStatus: {
    marginTop: 8,
  },
  approvalText: {
    fontSize: 12,
    color: '#ccc',
    fontFamily: 'Nunito Sans',
  },
  approveButton: {
    backgroundColor: '#00cc00',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  approveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Nunito Sans',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#2a2a2a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },
  disabledInput: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    backgroundColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    opacity: 0.5,
  },
  sendButton: {
    backgroundColor: '#a95eff',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    fontFamily: 'Nunito Sans',
  },
  errorText: {
    fontSize: 16,
    color: '#ff5555',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Nunito Sans',
  },
  noMessagesText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Nunito Sans',
  },
});

export default NegotiationScreen;