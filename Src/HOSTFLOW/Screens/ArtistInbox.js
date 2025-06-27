// import React, { useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image, Switch } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';

// const messagesData = [
//   {
//     id: '1',
//     image: null, // Placeholder image
//     name: 'Maya',
//     lastMessage: '$7500',
//     unreadCount: 3,
//   },
//   {
//     id: '2',
//     image: null, // Placeholder image
//     name: 'Sophia',
//     lastMessage: '800',
//     unreadCount: 2,
//   },
//   {
//     id: '3',
//     image: null, // Placeholder image
//     name: 'Ella',
//     lastMessage: '6000',
//     unreadCount: 0,
//   },
//    {
//     id: '4',
//     image: null, // Placeholder image
//     name: 'Luna',
//     lastMessage: '200',
//     unreadCount: 0,
//   },
//    {
//     id: '5',
//     image: null, // Placeholder image
//     name: 'Zara',
//     lastMessage: '5000',
//     unreadCount: 0,
//   },
//     {
//     id: '6',
//     image: null, // Placeholder image
//     name: 'Nina',
//     lastMessage: '',
//     unreadCount: 0,
//   },
//   // Add more placeholder message data here
// ];

// const ArtistInboxScreen = ({ navigation }) => {
//   const [searchText, setSearchText] = useState('');
//   const [isNegotiationEnabled, setIsNegotiationEnabled] = useState(false);

//   const renderMessageItem = ({ item }) => (
//     <TouchableOpacity style={styles.messageCard} onPress={() => navigation.navigate('Chat')}>
//       <View style={styles.profileImagePlaceholder}>
//          <Image source={item.image} style={styles.profileImage} />
//       </View>
//       <View style={styles.messageContent}>
//         <Text style={styles.userName}>{item.name}</Text>
//         <Text style={styles.lastMessage}>{item.lastMessage}</Text>
//       </View>
//       {item.unreadCount > 0 && (
//         <View style={styles.unreadBadge}>
//           <Text style={styles.unreadText}>{item.unreadCount}</Text>
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Icon name="arrow-left" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Messages</Text>
//         <View style={{ width: 24 }} />{/* Spacer */}
//       </View>

//       <View style={styles.negotiationToggleContainer}>
//         <Text style={styles.negotiationToggleText}>Enable Negotiation</Text>
//         <Switch
//           trackColor={{ false: '#C6C5ED', true: '#C6C5ED' }}
//           thumbColor={'#18171D'}
//           ios_backgroundColor="#C6C5ED"
//           onValueChange={setIsNegotiationEnabled}
//           value={isNegotiationEnabled}
//         />
//       </View>

//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#aaa" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search Message"
//           placeholderTextColor="#aaa"
//           value={searchText}
//           onChangeText={setSearchText}
//         />
//       </View>
//       <View style={styles.searchSeparator} />

//       <FlatList
//         data={messagesData}
//         renderItem={renderMessageItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   header: {
//     paddingTop:40,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#333',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   negotiationToggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   negotiationToggleText: {
//     fontSize: 15,
//     fontWeight:600,
//     color: '#fff',
//   },
//   searchContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     width: 361,
//     height: 52,
//     paddingTop: 0,
//     paddingBottom: 0,
//     paddingLeft: 16,
//     paddingRight: 16,
//     alignItems: 'center',
//     gap: 12,
//     flexShrink: 0,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#24242D',
//     backgroundColor: '#121212',
//     marginHorizontal: 16,
//     marginTop: 12,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 10,
//     color: '#fff',
//     fontSize: 14,
//   },
//   searchSeparator: {
//     width: 361,
//     height: 1,
//     backgroundColor: '#24242D',
//     alignSelf: 'center',
//     marginBottom: 8,
//     marginTop:12,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   messageCard: {
//     display: 'flex',
//     flexDirection: 'row',
//     paddingTop: 8,
//     paddingBottom: 8,
//     paddingLeft: 8,
//     paddingRight: 16,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     alignSelf: 'stretch',
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#34344A',
//     backgroundColor: '#1A1A1F',
//     marginBottom: 12,
//   },
//   profileImagePlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//     backgroundColor: '#555',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   messageContent: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 4,
//   },
//   lastMessage: {
//     fontSize: 14,
//     color: '#aaa',
//   },
//   unreadBadge: {
//     backgroundColor: '#a95eff',
//     borderRadius: 10,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginLeft: 8,
//   },
//   unreadText: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default ArtistInboxScreen; 





import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomToggle from '../Components/CustomToggle';

const messagesData = [
  {
    id: '1',
    image: null, // Placeholder image
    name: 'Maya',
    lastMessage: '$7500',
    unreadCount: 3,
  },
  {
    id: '2',
    image: null, // Placeholder image
    name: 'Sophia',
    lastMessage: '800',
    unreadCount: 2,
  },
  {
    id: '3',
    image: null, // Placeholder image
    name: 'Ella',
    lastMessage: '6000',
    unreadCount: 0,
  },
   {
    id: '4',
    image: null, // Placeholder image
    name: 'Luna',
    lastMessage: '200',
    unreadCount: 0,
  },
   {
    id: '5',
    image: null, // Placeholder image
    name: 'Zara',
    lastMessage: '5000',
    unreadCount: 0,
  },
    {
    id: '6',
    image: null, // Placeholder image
    name: 'Nina',
    lastMessage: '',
    unreadCount: 0,
  },
  // Add more placeholder message data here
];

const ArtistInboxScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isNegotiationEnabled, setIsNegotiationEnabled] = useState(false);
  const insets = useSafeAreaInsets();

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.messageCard} onPress={() => navigation.navigate('Chat')}>
      <View style={styles.profileImagePlaceholder}>
         <Image source={item.image} style={styles.profileImage} />
      </View>
      <View style={styles.messageContent}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={{ width: 24 }} />{/* Spacer */}
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

      <FlatList
        data={messagesData}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <ArtistBottomNavBar
        navigation={navigation}
        insets={insets}
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
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
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
    fontWeight:700,
    color: '#C6C5ED',
    fontFamily:'Nunito Sans',
    fontStyle:'normal',
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
    marginTop:12,
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
});

export default ArtistInboxScreen; 