import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  Dimensions,
  Switch,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppliedIcon from '../assets/icons/Applied';
import InboxIcon from '../assets/icons/inbox';
import SignUpBackground from '../assets/Banners/SignUp';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomToggle from '../Components/CustomToggle'; // Adjust path as needed
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';

const { width } = Dimensions.get('window');

// Responsive dimensions
const scale = width / 375; // Base iPhone X width
const dimensions = {
  cardWidth: width * 0.9,
  imageHeight: 150 * scale,
  headerFontSize: Math.max(18 * scale, 16),
  bodyFontSize: Math.max(14 * scale, 12),
  smallFontSize: Math.max(12 * scale, 10),
  spacing: {
    xs: Math.max(4 * scale, 4),
    sm: Math.max(8 * scale, 6),
    md: Math.max(12 * scale, 10),
    lg: Math.max(16 * scale, 14),
    xl: Math.max(20 * scale, 18),
  },
  borderRadius: {
    sm: Math.max(5 * scale, 4),
    md: Math.max(10 * scale, 8),
    lg: Math.max(15 * scale, 12),
  }
};

const latestEventsData = [
  {
    id: '1',
    image: require('../assets/Images/fff.jpg'),
    dateMonth: 'Aug',
    dateDay: '15',
    location: 'Noida',
    budget: '$400-$500',
    time: '09:30 AM',
    rating: 4,
    tags: ['Drums', 'Violin', 'Saxophone', 'Harp', 'Ukulele'],
    hasGuestList: true,
  },
  {
    id: '2',
    image: require('../assets/Images/Cover.png'),
    dateMonth: 'Nov',
    dateDay: '30',
    location: 'Delhi',
    budget: '$300-$400',
    time: '07:00 PM',
    rating: 3,
    tags: ['Piano', 'Guitar', 'Vocals'],
    hasGuestList: false,
  },
  {
    id: '3',
    image: require('../assets/Images/ffff.jpg'),
    dateMonth: 'Sep',
    dateDay: '22',
    location: 'Gurgaon',
    budget: '$500-$600',
    time: '08:00 PM',
    rating: 5,
    tags: ['DJ', 'Electronic', 'Bass', 'Synthesizer'],
    hasGuestList: true,
  },
  {
    id: '4',
    image: require('../assets/Images/Cover.png'),
    dateMonth: 'Oct',
    dateDay: '05',
    location: 'Mumbai',
    budget: '$600-$800',
    time: '06:30 PM',
    rating: 4,
    tags: ['Jazz', 'Saxophone', 'Piano', 'Double Bass'],
    hasGuestList: true,
  },
  {
    id: '5',
    image: require('../assets/Images/ffff.jpg'),
    dateMonth: 'Dec',
    dateDay: '15',
    location: 'Bangalore',
    budget: '$450-$550',
    time: '07:30 PM',
    rating: 4,
    tags: ['Rock', 'Electric Guitar', 'Drums', 'Vocals'],
    hasGuestList: false,
  },
  {
    id: '6',
    image: require('../assets/Images/Cover.png'),
    dateMonth: 'Sep',
    dateDay: '30',
    location: 'Hyderabad',
    budget: '$350-$450',
    time: '08:30 PM',
    rating: 3,
    tags: ['Classical', 'Violin', 'Cello', 'Piano'],
    hasGuestList: true,
  },
  {
    id: '7',
    image: require('../assets/Images/ffff.jpg'),
    dateMonth: 'Oct',
    dateDay: '20',
    location: 'Chennai',
    budget: '$400-$500',
    time: '06:00 PM',
    rating: 5,
    tags: ['Carnatic', 'Tabla', 'Sitar', 'Flute'],
    hasGuestList: true,
  },
  {
    id: '8',
    image: require('../assets/Images/Cover.png'),
    dateMonth: 'Nov',
    dateDay: '10',
    location: 'Pune',
    budget: '$300-$400',
    time: '07:00 PM',
    rating: 4,
    tags: ['Folk', 'Acoustic Guitar', 'Harmonica', 'Vocals'],
    hasGuestList: false,
  }
];

// New component for individual event cards
const ArtistEventCard = ({ item, navigation }) => {
  const [showGuestListInput, setShowGuestListInput] = useState(item.hasGuestList);

  return (
    <View style={styles.eventCard}>
      <Image source={item.image} style={styles.eventImage} />
      <View style={styles.dateOverlay}>
        <Text style={styles.dateMonth}>{item.dateMonth}</Text>
        <Text style={styles.dateDay}>{item.dateDay}</Text>
      </View>
       <TouchableOpacity style={styles.heartIcon}>
         <Ionicons name="heart-outline" size={24} color="#fff" />
       </TouchableOpacity>
      <View style={styles.eventContent}>
        <View style={styles.eventDetailsRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventLocation}>{item.location}</Text>
            <Text style={styles.eventBudget}>{item.budget}</Text>
          </View>
          <View style={styles.eventTimeAndRating}>
            <Text style={styles.eventTime}>{item.time}</Text>
            <View style={styles.starRating}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name={i < item.rating ? 'star' : 'star'}
                  size={16}
                  color={i < item.rating ? '#ffc107' : '#aaa'}
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
          </View>
        </View>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.guestListRow}>
          <Text style={styles.guestListText}>Do You Have a Guest List?</Text>
          <CustomToggle
            value={showGuestListInput}
            onValueChange={setShowGuestListInput}
          />
        </View>

        {showGuestListInput && (
          <View style={styles.guestListInputContainer}>
            <TextInput
              style={styles.guestListInput}
              placeholder="https://copy-guestlist-link-artist-"
              placeholderTextColor="#888"
              value="https://copy-guestlist-link-artist-"
              editable={false}
            />
            <TouchableOpacity onPress={() => console.log('Copy guest list link')}>
              <Ionicons name="copy-outline" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.applyButton}>
              <LinearGradient colors={['#B15CDE', '#7952FC']} start={{x: 1, y: 0}} end={{x: 0, y: 0}} style={styles.applyButtonGradient}>
                 <Text style={styles.applyButtonText}>Apply</Text>
              </LinearGradient>
          </TouchableOpacity>
           <TouchableOpacity style={styles.bookmarkButton}>
             <Icon name="bookmark" size={24} color="#a95eff" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const ArtistHomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(100);
  const [bubbleLeft, setBubbleLeft] = useState('50%');
  const [activeTab, setActiveTab] = useState('home');
  const insets = useSafeAreaInsets();

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top * 0.5, 10) }]}>
        <View>
          <MaskedView
            maskElement={
              <Text
                style={[
                  styles.greeting,
                  {
                    fontFamily: 'Poppins',
                    fontSize: 22,
                    fontWeight: '700',
                    lineHeight: 28,
                    backgroundColor: 'transparent',
                  },
                ]}
              >
                Hello Brandon!
              </Text>
            }
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{ height: 28 }}
            >
              <Text
                style={[
                  styles.greeting,
                  {
                    opacity: 0,
                    fontFamily: 'Poppins',
                    fontSize: 24,
                    fontWeight: '700',
                    lineHeight: 28,
                  },
                ]}
              >
                Hello Brandon!
              </Text>
            </LinearGradient>
          </MaskedView>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#a95eff" />
            <Text style={styles.locationText}>H-70, Sector 63, Noida</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('ArtistNotification')}>
          <Icon name="bell" size={24} color="#fff" />
          {/* Notification dot */}
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Event"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.allPillActive]}>
           <Ionicons name="grid" size={18} color={'#fff'} style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, { color: '#fff' }]}>All</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="musical-notes" size={18} color="#aaa" style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Genre</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.filterButton} onPress={() => setShowBudgetModal(true)}>
            <FontAwesome name="dollar" size={18} color="#aaa" style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Budget</Text>
        </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="calendar" size={18} color="#aaa" style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Date</Text>
        </TouchableOpacity>
           <TouchableOpacity style={styles.filterButton}>
            <Icon name="map-pin" size={18} color="#aaa" style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Location</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Latest Events */}
      <View style={styles.latestEventsContainer}>
        <Text
          style={[
            styles.latestEventsTitle,
            {
              color: '#404040',
              fontFamily: 'Roboto',
              fontSize: 20,
              fontWeight: '500',
              lineHeight: undefined,
            },
          ]}
        >
          Latest Events
        </Text>
      </View>
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SignUpBackground
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        width={width}
        height={'100%'}
      />
      <FlatList
        data={latestEventsData}
        renderItem={({ item }) => <ArtistEventCard item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
      />

      {/* Bottom Navigation Bar */}
      <ArtistBottomNavBar
        navigation={navigation}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        insets={insets}
      />

      {/* Budget Selection Modal */}
      <Modal
        visible={showBudgetModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBudgetModal(false)}
      >
        <View style={styles.modalOverlayTop}>
          <View style={styles.budgetModalContent}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowBudgetModal(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Budget Value Bubble */}
            <View style={[styles.budgetValueBubble, { left: bubbleLeft }]}>
              <Text style={styles.budgetValueText}>${currentBudget}</Text>
            </View>

            {/* Slider Implementation */}
            <Slider
              style={styles.actualSlider}
              minimumValue={0}
              maximumValue={1000}
              value={currentBudget}
              onValueChange={value => {
                const roundedValue = Math.round(value);
                setCurrentBudget(roundedValue);
                const estimatedLeft = `${(roundedValue / 1000) * 90}%`;
                setBubbleLeft(estimatedLeft);
              }}
              minimumTrackTintColor="#a95eff"
              maximumTrackTintColor="#3e3e3e"
              thumbTintColor="#a95eff"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
    paddingBottom: dimensions.spacing.md,
  },
  greeting: {
    fontSize: dimensions.headerFontSize + 6,
    fontWeight: 'bold',
    color: '#a95eff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: dimensions.spacing.xs,
  },
  locationText: {
    fontSize: dimensions.bodyFontSize,
    color: '#aaa',
    marginLeft: dimensions.spacing.xs,
  },
  notificationIcon: {
    padding: dimensions.spacing.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#C6C5ED',
    borderRadius: 20,
  },
    notificationDot: {
    position: 'absolute',
    top: dimensions.spacing.sm,
    right: dimensions.spacing.sm,
    width: dimensions.spacing.sm,
    height: dimensions.spacing.sm,
    borderRadius: dimensions.spacing.xs,
    backgroundColor: 'red',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(36,36,45,1)',
    backgroundColor: '#121212',
    marginHorizontal: dimensions.spacing.xl,
    marginTop: dimensions.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: dimensions.spacing.md,
    color: 'rgba(57, 57, 70, 1)',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  filterButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 24,
    gap: 8,
    borderRadius: 360,
    borderWidth: 1,
    borderColor: 'rgba(45,45,56,1)',
    backgroundColor: '#1a1a1a',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(198,197,237,1)',
    borderColor: 'rgba(45,45,56,1)',
  },
  filterIcon:{
    marginRight: 5,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  filterButtonTextInactive: {
    color: '#aaa',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  latestEventsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  latestEventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    width: width * 0.9, // Increased from 0.8 to 0.9 for wider cards
    marginBottom: 15,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  eventImage: {
    width: '100%',
    height: 150, // Adjust image height as needed
    resizeMode: 'cover',
  },
   dateOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#000000aa',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  dateMonth: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  dateDay: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
    heartIcon: {
     position: 'absolute',
     top: 10,
     right: 10,
     zIndex: 1, // Ensure heart icon is above image
    },
  eventContent: {
    padding: 12,
  },
  eventLocation: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventDetailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  eventTimeAndRating: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 2,
  },
  eventBudget: {
    fontSize: 14,
    color: '#a95eff',
  },
  eventTime: {
    fontSize: 14,
    color: '#aaa',
  },
   starRating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#333',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#fff',
  },
    guestListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
    guestListText: {
     fontSize: 14,
    color: '#fff',
    },
    guestListInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
     borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#a95eff',
  },
  guestListInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 12,
    fontSize: 16,
    },
   actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   },
    applyButton: {
    display: 'flex',
    flex: 1,
    flexBasis: 0,
    alignSelf: 'stretch',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 10,
  },
  applyButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  applyButtonText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  bookmarkButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#B15CDE',
    borderRadius: 14,
  },

  // Updated styles for the budget modal to match image
  modalOverlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingTop: 250,
  },
  budgetModalContent: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    // Removed as per image
  },
  budgetValueBubble: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    zIndex: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetValueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  actualSlider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
   },
  allPillActive: {
    backgroundColor: '#7952FC',
    borderWidth: 0,
  },
});

export default ArtistHomeScreen;