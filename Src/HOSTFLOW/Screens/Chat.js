import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import frame1 from '../assets/Images/frame1.png';
import SendIcon from '../assets/icons/Send';

const messages = [
  {
    id: '1',
    sender: 'host',
    amount: '4000',
  },
  {
    id: '2',
    sender: 'artist',
    amount: '5000',
  },
  // Add more placeholder messages here
];

const ChatScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState('');

  const renderMessage = ({ item }) => {
    const isHost = item.sender === 'host';
    const avatarSrc = frame1;
    return (
      <View
        style={[
          styles.messageRow,
          isHost ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' },
        ]}
      >
        {isHost && <Image source={avatarSrc} style={styles.avatar} />}
        <View style={isHost ? styles.hostBubble : styles.artistBubble}>
          <Text style={[styles.messageText, isHost ? styles.hostText : styles.artistText]}>
            {isHost ? 'Host: ' : 'Artist: '}
            <Text style={{ fontWeight: '400' }}>{item.amount}₹</Text>
          </Text>
        </View>
        {!isHost && <Image source={avatarSrc} style={styles.avatar} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Negotiation</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <View style={styles.inputBoxWrapper}>
          <TextInput
            style={[styles.textInput, { paddingRight: 48 }]}
            placeholder="₹5000"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={inputText}
            onChangeText={(text) => {
              // Allow only digits and limit to 5 characters
              const numericInput = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
              if (numericInput.length <= 5) {
                setInputText(numericInput);
              }
            }}
          />
          <TouchableOpacity style={styles.sendIconButton}>
            <SendIcon width={26} height={26} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.numericInputHint}>Numeric Inputs Only</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    paddingTop:40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginRight:180,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  hostBubble: {
    display: 'flex',
    height: 55,
    maxWidth: 251.432,
    padding: 16,
    alignItems: 'flex-start',
    gap: 6.103,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#D9D8F3',
  },
  artistBubble: {
    display: 'flex',
    height: 55,
    maxWidth: 251.432,
    padding: 16,
    alignItems: 'center',
    gap: 6.103,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: '#34344A',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  hostText: {
    color: '#34344A',
    fontWeight: '700',
    fontSize: 14,
  },
  artistText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#121212',
    marginBottom: 4,
  },
  inputBoxWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1A1A1F',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#121212',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 48,
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },
  numericInputHint: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 18,
  },
  sendIconButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -13 }], // half the icon height (26/2)
    zIndex: 2,
    backgroundColor: 'transparent',
    borderRadius: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen; 