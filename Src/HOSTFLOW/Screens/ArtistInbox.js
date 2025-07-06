import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, TextInput, Image, Switch, Animated, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomToggle from '../Components/CustomToggle';
import SignUpBackground from '../assets/Banners/SignUp';

const messagesData = [
  {
    id: '1',
    image: require('../assets/Images/fff.jpg'),
    eventName: 'GenrAcoustic Moments',
    eventDate: '07 Feb 2025',
  },
  {
    id: '2',
    image: require('../assets/Images/fff.jpg'),
    eventName: 'GenrUrban Beats',
    eventDate: '08 Feb 2025',
  },
  {
    id: '3',
    image: require('../assets/Images/fff.jpg'),
    eventName: 'GenrClassical Rhythms',
    eventDate: '09 Feb 2025',
  },
  {
    id: '4',
    image: require('../assets/Images/fff.jpg'),
    eventName: "GenrNature's Echoes",
    eventDate: '10 Feb 2025',
  },
  {
    id: '5',
    image: require('../assets/Images/fff.jpg'),
    eventName: 'GenrRetro Vibes',
    eventDate: '11 Feb 2025',
  },
];

// MusicBeatsLoader: Animated music bars loader
const MusicBeatsLoader = () => {
  const barAnims = [React.useRef(new Animated.Value(1)).current, React.useRef(new Animated.Value(1)).current, React.useRef(new Animated.Value(1)).current];

  React.useEffect(() => {
    const animations = barAnims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.8,
            duration: 300,
            useNativeDriver: false,
            delay: i * 100,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
            delay: 0,
          }),
        ])
      )
    );
    animations.forEach(anim => anim.start());
    return () => animations.forEach(anim => anim.stop());
  }, [barAnims]);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', height: 28, marginVertical: 8 }}>
      {barAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={{
            width: 6,
            height: anim.interpolate({ inputRange: [1, 1.8], outputRange: [14, 24] }),
            backgroundColor: '#a95eff',
            borderRadius: 3,
            marginHorizontal: 3,
          }}
        />
      ))}
    </View>
  );
};

const ArtistInboxScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [isNegotiationEnabled, setIsNegotiationEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      navigation.navigate('ArtistHome');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} onPress={() => navigation.navigate('HostArtistInbox')}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={styles.eventDate}>{item.eventDate}</Text>
        <Text style={styles.eventName}>{item.eventName}</Text>
      </View>
    </TouchableOpacity>
  );  

  return (
    <SafeAreaView style={styles.container}>
      {/* SVG Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <SignUpBackground width="100%" height="100%" />
      </View>
      {/* Foreground Content */}
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('ArtistHome')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
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

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <MusicBeatsLoader />
            <Text style={{ color: '#fff', marginTop: 10 }}>Loading messages...</Text>
          </View>
        ) : (
          <FlatList
            data={messagesData}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
          />
        )}
        <ArtistBottomNavBar
          navigation={navigation}
          insets={insets}
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    color: '#C6C5ED',
    flex: 1,
    textAlign: 'left',
  },
  negotiationToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  negotiationToggleText: {
    fontSize: 12,
    fontWeight:700,
    color: '#C6C5ED',
    fontFamily:'Nunito Sans',
    fontStyle:'normal',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    height: 52,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
    borderRadius: 12,
    borderWidth: 1.5,
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
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 20,
    marginBottom: 20,
    padding: 0,
    borderWidth: 0,
    minHeight: 90,
  },
  eventImage: {
    width: 70,
    height: 70,
    borderRadius: 16,
    margin: 12,
    backgroundColor: '#333',
  },
  eventContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 12,
    paddingLeft: 0,
  },
  eventDate: {
    color: '#A084E8',
    fontSize: 12,
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    marginBottom: 2,
  },
  eventName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
  },
});

export default ArtistInboxScreen; 