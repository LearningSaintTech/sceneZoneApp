// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   SafeAreaView,
// //   ScrollView,
// //   TouchableOpacity,
// //   Image,
// //   TextInput,
// //   FlatList,
// //   Dimensions,
// //   Switch,
// //   Modal,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Feather';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import FontAwesome from 'react-native-vector-icons/FontAwesome';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import LinearGradient from 'react-native-linear-gradient';
// // import Slider from '@react-native-community/slider';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import AppliedIcon from '../assets/icons/Applied';
// // import InboxIcon from '../assets/icons/inbox';
// // import SignUpBackground from '../assets/Banners/SignUp';
// // import MaskedView from '@react-native-masked-view/masked-view';

// // const { width } = Dimensions.get('window');

// // // Responsive dimensions
// // const scale = width / 375; // Base iPhone X width
// // const dimensions = {
// //   cardWidth: width * 0.9,
// //   imageHeight: 150 * scale,
// //   headerFontSize: Math.max(18 * scale, 16),
// //   bodyFontSize: Math.max(14 * scale, 12),
// //   smallFontSize: Math.max(12 * scale, 10),
// //   spacing: {
// //     xs: Math.max(4 * scale, 4),
// //     sm: Math.max(8 * scale, 6),
// //     md: Math.max(12 * scale, 10),
// //     lg: Math.max(16 * scale, 14),
// //     xl: Math.max(20 * scale, 18),
// //   },
// //   borderRadius: {
// //     sm: Math.max(5 * scale, 4),
// //     md: Math.max(10 * scale, 8),
// //     lg: Math.max(15 * scale, 12),
// //   }
// // };

// // const latestEventsData = [
// //   {
// //     id: '1',
// //     image: require('../assets/Images/fff.jpg'),
// //     dateMonth: 'Aug',
// //     dateDay: '15',
// //     location: 'Noida',
// //     budget: '$400-$500',
// //     time: '09:30 AM',
// //     rating: 4,
// //     tags: ['Drums', 'Violin', 'Saxophone', 'Harp', 'Ukulele'],
// //     hasGuestList: true,
// //   },
// //   {
// //     id: '2',
// //     image: require('../assets/Images/Cover.png'),
// //     dateMonth: 'Nov',
// //     dateDay: '30',
// //     location: 'Delhi',
// //     budget: '$300-$400',
// //     time: '07:00 PM',
// //     rating: 3,
// //     tags: ['Piano', 'Guitar', 'Vocals'],
// //     hasGuestList: false,
// //   },
// //   {
// //     id: '3',
// //     image: require('../assets/Images/ffff.jpg'),
// //     dateMonth: 'Sep',
// //     dateDay: '22',
// //     location: 'Gurgaon',
// //     budget: '$500-$600',
// //     time: '08:00 PM',
// //     rating: 5,
// //     tags: ['DJ', 'Electronic', 'Bass', 'Synthesizer'],
// //     hasGuestList: true,
// //   },
// //   {
// //     id: '4',
// //     image: require('../assets/Images/Cover.png'),
// //     dateMonth: 'Oct',
// //     dateDay: '05',
// //     location: 'Mumbai',
// //     budget: '$600-$800',
// //     time: '06:30 PM',
// //     rating: 4,
// //     tags: ['Jazz', 'Saxophone', 'Piano', 'Double Bass'],
// //     hasGuestList: true,
// //   },
// //   {
// //     id: '5',
// //     image: require('../assets/Images/ffff.jpg'),
// //     dateMonth: 'Dec',
// //     dateDay: '15',
// //     location: 'Bangalore',
// //     budget: '$450-$550',
// //     time: '07:30 PM',
// //     rating: 4,
// //     tags: ['Rock', 'Electric Guitar', 'Drums', 'Vocals'],
// //     hasGuestList: false,
// //   },
// //   {
// //     id: '6',
// //     image: require('../assets/Images/Cover.png'),
// //     dateMonth: 'Sep',
// //     dateDay: '30',
// //     location: 'Hyderabad',
// //     budget: '$350-$450',
// //     time: '08:30 PM',
// //     rating: 3,
// //     tags: ['Classical', 'Violin', 'Cello', 'Piano'],
// //     hasGuestList: true,
// //   },
// //   {
// //     id: '7',
// //     image: require('../assets/Images/ffff.jpg'),
// //     dateMonth: 'Oct',
// //     dateDay: '20',
// //     location: 'Chennai',
// //     budget: '$400-$500',
// //     time: '06:00 PM',
// //     rating: 5,
// //     tags: ['Carnatic', 'Tabla', 'Sitar', 'Flute'],
// //     hasGuestList: true,
// //   },
// //   {
// //     id: '8',
// //     image: require('../assets/Images/Cover.png'),
// //     dateMonth: 'Nov',
// //     dateDay: '10',
// //     location: 'Pune',
// //     budget: '$300-$400',
// //     time: '07:00 PM',
// //     rating: 4,
// //     tags: ['Folk', 'Acoustic Guitar', 'Harmonica', 'Vocals'],
// //     hasGuestList: false,
// //   }
// // ];

// // // New component for individual event cards
// // const ArtistEventCard = ({ item, navigation }) => {
// //   const [showGuestListInput, setShowGuestListInput] = useState(item.hasGuestList);

// //   return (
// //     <View style={styles.eventCard}>
// //       <Image source={item.image} style={styles.eventImage} />
// //       <View style={styles.dateOverlay}>
// //         <Text style={styles.dateMonth}>{item.dateMonth}</Text>
// //         <Text style={styles.dateDay}>{item.dateDay}</Text>
// //       </View>
// //        <TouchableOpacity style={styles.heartIcon}>
// //          <Ionicons name="heart-outline" size={24} color="#fff" />
// //        </TouchableOpacity>
// //       <View style={styles.eventContent}>
// //         <Text style={styles.eventLocation}>{item.location}</Text>
// //         <View style={styles.eventDetailsRow}>
// //           <Text style={styles.eventBudget}>{item.budget}</Text>
// //           <Text style={styles.eventTime}>{item.time}</Text>
// //         </View>
// //          <View style={styles.starRating}>
// //               {[...Array(5)].map((_, i) => (
// //                 <Icon
// //                   key={i}
// //                   name={i < item.rating ? 'star' : 'star'}
// //                   size={16}
// //                   color={i < item.rating ? '#ffc107' : '#aaa'}
// //                   style={{ marginRight: 2 }}
// //                 />
// //               ))}
// //             </View>
// //         <View style={styles.tagsContainer}>
// //           {item.tags.map((tag, index) => (
// //             <View key={index} style={styles.tag}>
// //               <Text style={styles.tagText}>{tag}</Text>
// //             </View>
// //           ))}
// //         </View>
// //         <View style={styles.guestListRow}>
// //             <Text style={styles.guestListText}>Do You Have a Guest List?</Text>
// //              <TouchableOpacity>
// //                 <Switch
// //                   trackColor={{ false: "#767577", true: "#a95eff" }}
// //                   thumbColor={showGuestListInput ? "#f4f3f4" : "#f4f3f4"}
// //                   ios_backgroundColor="#3e3e3e"
// //                   onValueChange={(newValue) => {
// //                     setShowGuestListInput(newValue);
// //                   }}
// //                   value={showGuestListInput}
// //                 />
// //             </TouchableOpacity>
// //         </View>

// //         {showGuestListInput && (
// //           <View style={styles.guestListInputContainer}>
// //             <TextInput
// //               style={styles.guestListInput}
// //               placeholder="https://copy-guestlist-link-artist-"
// //               placeholderTextColor="#888"
// //               value="https://copy-guestlist-link-artist-"
// //               editable={false}
// //             />
// //             <TouchableOpacity onPress={() => console.log('Copy guest list link')}>
// //               <Ionicons name="copy-outline" size={24} color="#ccc" />
// //             </TouchableOpacity>
// //           </View>
// //         )}

// //         <View style={styles.actionsRow}>
// //           <TouchableOpacity style={styles.applyButton}>
// //               <LinearGradient colors={['#B15CDE', '#7952FC']} start={{x: 1, y: 0}} end={{x: 0, y: 0}} style={styles.applyButtonGradient}>
// //                  <Text style={styles.applyButtonText}>Apply</Text>
// //               </LinearGradient>
// //           </TouchableOpacity>
// //            <TouchableOpacity style={styles.bookmarkButton}>
// //              <Icon name="bookmark" size={24} color="#a95eff" />
// //           </TouchableOpacity>
// //         </View>

// //       </View>
// //     </View>
// //   );
// // };

// // const ArtistHomeScreen = ({ navigation }) => {
// //   const [searchText, setSearchText] = useState('');
// //   const [selectedGenre, setSelectedGenre] = useState(null);
// //   const [selectedInstrument, setSelectedInstrument] = useState(null);
// //   const [selectedPrice, setSelectedPrice] = useState(null);
// //   const [showBudgetModal, setShowBudgetModal] = useState(false);
// //   const [currentBudget, setCurrentBudget] = useState(100);
// //   const [bubbleLeft, setBubbleLeft] = useState('50%');
// //   const [activeTab, setActiveTab] = useState('home');
// //   const insets = useSafeAreaInsets();

// //   const renderHeader = () => (
// //     <>
// //       {/* Header */}
// //       <View style={[styles.header, { paddingTop: Math.max(insets.top * 0.5, 10) }]}>
// //         <View>
// //           <MaskedView
// //             maskElement={
// //               <Text
// //                 style={[
// //                   styles.greeting,
// //                   {
// //                     fontFamily: 'Poppins',
// //                     fontSize: 22,
// //                     fontWeight: '700',
// //                     lineHeight: 28,
// //                     backgroundColor: 'transparent',
// //                   },
// //                 ]}
// //               >
// //                 Hello Brandon!
// //               </Text>
// //             }
// //           >
// //             <LinearGradient
// //               colors={["#B15CDE", "#7952FC"]}
// //               start={{ x: 1, y: 0 }}
// //               end={{ x: 0, y: 0 }}
// //               style={{ height: 28 }}
// //             >
// //               <Text
// //                 style={[
// //                   styles.greeting,
// //                   {
// //                     opacity: 0,
// //                     fontFamily: 'Poppins',
// //                     fontSize: 24,
// //                     fontWeight: '700',
// //                     lineHeight: 28,
// //                   },
// //                 ]}
// //               >
// //                 Hello Brandon!
// //               </Text>
// //             </LinearGradient>
// //           </MaskedView>
// //           <View style={styles.locationContainer}>
// //             <MaterialIcons name="location-on" size={16} color="#a95eff" />
// //             <Text style={styles.locationText}>H-70, Sector 63, Noida</Text>
// //           </View>
// //         </View>
// //         <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('ArtistNotification')}>
// //           <Icon name="bell" size={24} color="#fff" />
// //           {/* Notification dot */}
// //           <View style={styles.notificationDot} />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <Icon name="search" size={20} color="#aaa" />
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search Event"
// //           placeholderTextColor="#aaa"
// //           value={searchText}
// //           onChangeText={setSearchText}
// //         />
// //       </View>

// //       {/* Filter Buttons */}
// //       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
// //         <TouchableOpacity style={[styles.filterButton, styles.allPillActive]}>
// //            <Ionicons name="grid" size={18} color={'#fff'} style={styles.filterIcon} />
// //           <Text style={[styles.filterButtonText, { color: '#fff' }]}>All</Text>
// //         </TouchableOpacity>
// //          <TouchableOpacity style={styles.filterButton}>
// //             <Ionicons name="musical-notes" size={18} color="#aaa" style={styles.filterIcon} />
// //           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Genre</Text>
// //         </TouchableOpacity>
// //          <TouchableOpacity style={styles.filterButton} onPress={() => setShowBudgetModal(true)}>
// //             <FontAwesome name="dollar" size={18} color="#aaa" style={styles.filterIcon} />
// //           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Budget</Text>
// //         </TouchableOpacity>
// //           <TouchableOpacity style={styles.filterButton}>
// //             <Icon name="calendar" size={18} color="#aaa" style={styles.filterIcon} />
// //           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Date</Text>
// //         </TouchableOpacity>
// //            <TouchableOpacity style={styles.filterButton}>
// //             <Icon name="map-pin" size={18} color="#aaa" style={styles.filterIcon} />
// //           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Location</Text>
// //         </TouchableOpacity>
// //       </ScrollView>

// //       {/* Latest Events */}
// //       <View style={styles.latestEventsContainer}>
// //         <Text
// //           style={[
// //             styles.latestEventsTitle,
// //             {
// //               color: '#404040',
// //               fontFamily: 'Roboto',
// //               fontSize: 20,
// //               fontWeight: '500',
// //               lineHeight: undefined,
// //             },
// //           ]}
// //         >
// //           Latest Events
// //         </Text>
// //         <TouchableOpacity>
// //            <Text style={styles.seeAllText}>See All <Icon name="arrow-right" size={12} color="#a95eff" /></Text>
// //         </TouchableOpacity>
// //       </View>
// //     </>
// //   );

// //   return (
// //     <View style={[styles.container, { paddingTop: insets.top }]}>
// //       <SignUpBackground
// //         style={{
// //           position: 'absolute',
// //           top: 0,
// //           left: 0,
// //           width: '100%',
// //           height: '100%',
// //         }}
// //         width={width}
// //         height={'100%'}
// //       />
// //       <FlatList
// //         data={latestEventsData}
// //         renderItem={({ item }) => <ArtistEventCard item={item} navigation={navigation} />}
// //         keyExtractor={(item) => item.id}
// //         ListHeaderComponent={renderHeader}
// //       />

// //       {/* Bottom Navigation Bar */}
// //       <View style={[styles.bottomNavBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
// //         <TouchableOpacity 
// //           style={[styles.navButton, activeTab === 'home' && styles.navButtonActive]} 
// //           onPress={() => setActiveTab('home')}
// //         >
// //           <Ionicons 
// //             name={activeTab === 'home' ? "home" : "home-outline"} 
// //             size={24} 
// //             color={activeTab === 'home' ? "#a95eff" : "#aaa"} 
// //           />
// //           <Text style={[styles.navButtonText, activeTab === 'home' && styles.navButtonTextActive]}>Home</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity 
// //           style={[styles.navButton, activeTab === 'applied' && styles.navButtonActive]}
// //           onPress={() => {
// //             setActiveTab('applied');
// //             navigation.navigate('ArtistApplied');
// //           }}
// //         >
// //           <AppliedIcon width={24} height={24} stroke={activeTab === 'applied' ? "#a95eff" : "#aaa"} />
// //           <Text style={[styles.navButtonText, activeTab === 'applied' && styles.navButtonTextActive]}>Applied</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity 
// //           style={[styles.navButton, activeTab === 'inbox' && styles.navButtonActive]}
// //           onPress={() => {
// //             setActiveTab('inbox');
// //             navigation.navigate('ArtistInbox');
// //           }}
// //         >
// //           <InboxIcon width={24} height={24} stroke={activeTab === 'inbox' ? "#a95eff" : "#aaa"} />
// //           <Text style={[styles.navButtonText, activeTab === 'inbox' && styles.navButtonTextActive]}>Inbox</Text>
// //         </TouchableOpacity>

// //         <TouchableOpacity 
// //           style={[styles.navButton, activeTab === 'profile' && styles.navButtonActive]}
// //           onPress={() => {
// //             setActiveTab('profile');
// //             navigation.navigate('ArtistProfile');
// //           }}
// //         >
// //           <Ionicons 
// //             name={activeTab === 'profile' ? "person" : "person-outline"} 
// //             size={24} 
// //             color={activeTab === 'profile' ? "#a95eff" : "#aaa"} 
// //           />
// //           <Text style={[styles.navButtonText, activeTab === 'profile' && styles.navButtonTextActive]}>Profile</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Budget Selection Modal */}
// //       <Modal
// //         visible={showBudgetModal}
// //         transparent={true}
// //         animationType="slide"
// //         onRequestClose={() => setShowBudgetModal(false)}
// //       >
// //         <View style={styles.modalOverlayTop}>
// //           <View style={styles.budgetModalContent}>
// //             {/* Close Button */}
// //             <TouchableOpacity style={styles.closeButton} onPress={() => setShowBudgetModal(false)}>
// //               <Ionicons name="close" size={24} color="#fff" />
// //             </TouchableOpacity>

// //             {/* Budget Value Bubble */}
// //             <View style={[styles.budgetValueBubble, { left: bubbleLeft }]}>
// //               <Text style={styles.budgetValueText}>${currentBudget}</Text>
// //             </View>

// //             {/* Slider Implementation */}
// //             <Slider
// //               style={styles.actualSlider}
// //               minimumValue={0}
// //               maximumValue={1000}
// //               value={currentBudget}
// //               onValueChange={value => {
// //                 const roundedValue = Math.round(value);
// //                 setCurrentBudget(roundedValue);
// //                 const estimatedLeft = `${(roundedValue / 1000) * 90}%`;
// //                 setBubbleLeft(estimatedLeft);
// //               }}
// //               minimumTrackTintColor="#a95eff"
// //               maximumTrackTintColor="#3e3e3e"
// //               thumbTintColor="#a95eff"
// //             />
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#000',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: dimensions.spacing.xl,
// //     paddingBottom: dimensions.spacing.md,
// //   },
// //   greeting: {
// //     fontSize: dimensions.headerFontSize + 6,
// //     fontWeight: 'bold',
// //     color: '#a95eff',
// //   },
// //   locationContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: dimensions.spacing.xs,
// //   },
// //   locationText: {
// //     fontSize: dimensions.bodyFontSize,
// //     color: '#aaa',
// //     marginLeft: dimensions.spacing.xs,
// //   },
// //   notificationIcon: {
// //     padding: dimensions.spacing.sm,
// //     position: 'relative',
// //   },
// //     notificationDot: {
// //     position: 'absolute',
// //     top: dimensions.spacing.sm,
// //     right: dimensions.spacing.sm,
// //     width: dimensions.spacing.sm,
// //     height: dimensions.spacing.sm,
// //     borderRadius: dimensions.spacing.xs,
// //     backgroundColor: 'red',
// //   },
// //   searchContainer: {
// //     display: 'flex',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //     alignSelf: 'stretch',
// //     height: 48,
// //     paddingHorizontal: 16,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: 'rgba(36,36,45,1)',
// //     backgroundColor: '#121212',
// //     marginHorizontal: dimensions.spacing.xl,
// //     marginTop: dimensions.spacing.md,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     marginLeft: dimensions.spacing.md,
// //     color: 'rgba(57, 57, 70, 1)',
// //     fontFamily: 'Nunito Sans',
// //     fontSize: 14,
// //     fontStyle: 'normal',
// //     fontWeight: '400',
// //     lineHeight: 21,
// //   },
// //   filterContainer: {
// //     paddingHorizontal: 20,
// //     marginTop: 20,
// //     marginBottom: 20,
// //   },
// //   filterButton: {
// //     display: 'flex',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     height: 38,
// //     paddingHorizontal: 24,
// //     gap: 8,
// //     borderRadius: 360,
// //     borderWidth: 1,
// //     borderColor: 'rgba(45,45,56,1)',
// //     backgroundColor: '#1a1a1a',
// //     marginRight: 10,
// //   },
// //   filterButtonActive: {
// //     backgroundColor: 'rgba(198,197,237,1)',
// //     borderColor: 'rgba(45,45,56,1)',
// //   },
// //   filterIcon:{
// //     marginRight: 5,
// //   },
// //   filterButtonText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   filterButtonTextInactive: {
// //     color: '#aaa',
// //   },
// //   filterButtonTextActive: {
// //     color: '#fff',
// //   },
// //   latestEventsContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginHorizontal: 20,
// //     marginBottom: 15,
// //   },
// //   latestEventsTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   seeAllText: {
// //     color: '#a95eff',
// //     fontSize: 14,
// //     fontWeight: '600',
// //   },
// //   eventCard: {
// //     backgroundColor: '#1a1a1a',
// //     borderRadius: 10,
// //     width: width * 0.9, // Increased from 0.8 to 0.9 for wider cards
// //     marginBottom: 15,
// //     overflow: 'hidden',
// //     alignSelf: 'center',
// //   },
// //   eventImage: {
// //     width: '100%',
// //     height: 150, // Adjust image height as needed
// //     resizeMode: 'cover',
// //   },
// //    dateOverlay: {
// //     position: 'absolute',
// //     top: 10,
// //     left: 10,
// //     backgroundColor: '#000000aa',
// //     borderRadius: 5,
// //     paddingVertical: 4,
// //     paddingHorizontal: 8,
// //     alignItems: 'center',
// //   },
// //   dateMonth: {
// //     fontSize: 12,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   dateDay: {
// //     fontSize: 18,
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //     heartIcon: {
// //      position: 'absolute',
// //      top: 10,
// //      right: 10,
// //      zIndex: 1, // Ensure heart icon is above image
// //     },
// //   eventContent: {
// //     padding: 12,
// //   },
// //   eventLocation: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //     marginBottom: 4,
// //   },
// //    eventDetailsRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginBottom: 4,
// //   },
// //   eventBudget: {
// //     fontSize: 14,
// //     color: '#a95eff',
// //   },
// //   eventTime: {
// //     fontSize: 14,
// //     color: '#aaa',
// //   },
// //    starRating: {
// //     flexDirection: 'row',
// //     marginBottom: 8,
// //   },
// //   tagsContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginBottom: 8,
// //   },
// //   tag: {
// //     backgroundColor: '#333',
// //     borderRadius: 5,
// //     paddingVertical: 4,
// //     paddingHorizontal: 8,
// //     marginRight: 6,
// //     marginBottom: 6,
// //   },
// //   tagText: {
// //     fontSize: 12,
// //     color: '#fff',
// //   },
// //     guestListRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 15,
// //   },
// //     guestListText: {
// //      fontSize: 14,
// //     color: '#fff',
// //     },
// //     guestListInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#1a1a1a',
// //      borderRadius: 10,
// //     paddingHorizontal: 15,
// //     marginTop: 15,
// //     marginBottom: 20,
// //     borderWidth: 1,
// //     borderColor: '#a95eff',
// //   },
// //   guestListInput: {
// //     flex: 1,
// //     color: '#fff',
// //     paddingVertical: 12,
// //     fontSize: 16,
// //     },
// //    actionsRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //    },
// //     applyButton: {
// //     display: 'flex',
// //     flex: 1,
// //     flexBasis: 0,
// //     alignSelf: 'stretch',
// //     paddingTop: 4,
// //     paddingBottom: 4,
// //     paddingLeft: 12,
// //     paddingRight: 16,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     gap: 4,
// //     borderRadius: 8,
// //     overflow: 'hidden',
// //     marginRight: 10,
// //   },
// //   applyButtonGradient: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     width: '100%',
// //     borderRadius: 8,
// //     backgroundColor: 'transparent',
// //   },
// //   applyButtonText: {
// //     color: '#FFF',
// //     fontFamily: 'Inter',
// //     fontSize: 14,
// //     fontStyle: 'normal',
// //     fontWeight: '500',
// //     lineHeight: 20,
// //     fontFeatureSettings: "'salt' on",
// //   },
// //   bookmarkButton: {
// //     padding: 8,
// //   },

// //   // New styles for bottom navigation
// //   bottomNavBar: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-around',
// //     alignItems: 'center',
// //     backgroundColor: '#000',
// //     borderTopWidth: 1,
// //     borderTopColor: '#1a1a1a',
// //     paddingVertical: 5,
// //     paddingBottom: 45, // Adjust for home bar indicator
// //   },
// //   navButton: {
// //     flex: 1,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     position: 'relative',
// //     paddingVertical: 5,
// //   },
// //   navButtonActive: {
// //     backgroundColor: 'rgba(169, 94, 255, 0.1)',
// //     borderRadius: 15,
// //     marginHorizontal: 5,
// //   },
// //   navButtonText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: '#aaa',
// //     marginTop: 4,
// //   },
// //   navButtonTextActive: {
// //     color: '#a95eff',
// //   },

// //   // Updated styles for the budget modal to match image
// //   modalOverlayTop: {
// //     flex: 1,
// //     backgroundColor: 'rgba(0,0,0,0.6)',
// //     justifyContent: 'flex-start',
// //     alignItems: 'stretch',
// //     paddingTop: 250,
// //   },
// //   budgetModalContent: {
// //     backgroundColor: '#1a1a1a',
// //     padding: 20,
// //     paddingTop: 40,
// //     borderBottomLeftRadius: 20,
// //     borderBottomRightRadius: 20,
// //     alignItems: 'center',
// //     borderWidth: 1,
// //     borderColor: '#333',
// //   },
// //   closeButton: {
// //     position: 'absolute',
// //     top: 10,
// //     right: 10,
// //     zIndex: 1,
// //     padding: 5,
// //   },
// //   modalTitle: {
// //     // Removed as per image
// //   },
// //   budgetValueBubble: {
// //     position: 'absolute',
// //     top: -30,
// //     backgroundColor: '#fff',
// //     borderRadius: 8,
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     zIndex: 4,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   budgetValueText: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#000',
// //   },
// //   actualSlider: {
// //     width: '100%',
// //     height: 40,
// //     marginVertical: 10,
// //    },
// //   allPillActive: {
// //     backgroundColor: '#7952FC',
// //     borderWidth: 0,
// //   },
// // });

// // export default ArtistHomeScreen;




// //  anirudh code is here 



// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   TextInput,
//   FlatList,
//   Dimensions,
//   Switch,
//   Modal,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Feather';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';
// import Slider from '@react-native-community/slider';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { addAppliedEvent } from '../Redux/slices/appliedSlice';
// import { selectLocation, selectToken } from '../Redux/slices/authSlice';
// import AppliedIcon from '../assets/icons/Applied';
// import InboxIcon from '../assets/icons/inbox';
// import SignUpBackground from '../assets/Banners/SignUp';
// import MaskedView from '@react-native-masked-view/masked-view';
// import CustomToggle from '../Components/CustomToggle'; // Adjust path as needed
// import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
// import api from '../Config/api';

// const { width } = Dimensions.get('window');

// // Responsive dimensions
// const scale = width / 375; // Base iPhone X width
// const dimensions = {
//   cardWidth: width * 0.9,
//   imageHeight: 150 * scale,
//   headerFontSize: Math.max(18 * scale, 16),
//   bodyFontSize: Math.max(14 * scale, 12),
//   smallFontSize: Math.max(12 * scale, 10),
//   spacing: {
//     xs: Math.max(4 * scale, 4),
//     sm: Math.max(8 * scale, 6),
//     md: Math.max(12 * scale, 10),
//     lg: Math.max(16 * scale, 14),
//     xl: Math.max(20 * scale, 18),
//   },
//   borderRadius: {
//     sm: Math.max(5 * scale, 4),
//     md: Math.max(10 * scale, 8),
//     lg: Math.max(15 * scale, 12),
//   }
// };

// // New component for individual event cards
// const ArtistEventCard = ({ item, navigation }) => {
//   const [showGuestListInput, setShowGuestListInput] = useState(false);
//   const [isApplying, setIsApplying] = useState(false);
//   const dispatch = useDispatch();
//   const appliedEvents = useSelector(state => state.applied.appliedEvents);
//   const token = useSelector(state => state.auth.token);
  
//   // Check if this event is already applied
//   const isAlreadyApplied = appliedEvents.some(appliedEvent => appliedEvent.id === item.id);

//   const handleApplyPress = async () => {
//     if (isAlreadyApplied) {
//       Alert.alert('Already Applied', 'You have already applied for this event.');
//       return;
//     }
//     if (!token) {
//       Alert.alert('Not Authenticated', 'Please login to apply for events.');
//       return;
//     }
//     setIsApplying(true);
//     try {
//       const response = await api.post(
//         '/artist/apply-event',
//         { eventId: item.id },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       if (response.data && response.data.success) {
//         dispatch(addAppliedEvent({
//           id: item.id,
//           location: item.location,
//           budget: item.budget,
//           time: item.time,
//           genres: item.tags,
//           rating: item.rating,
//           image: item.image,
//           eventId: item.id,
//           venueName: item.location,
//           dateMonth: item.dateMonth,
//           dateDay: item.dateDay,
//         }));
//         Alert.alert('Success', 'Application submitted successfully!');
//       } else {
//         Alert.alert('Failed', response.data?.message || 'Failed to apply for event.');
//       }
//     } catch (error) {
//       console.error('Error applying for event:', error);
//       Alert.alert('Error', error.response?.data?.message || 'Failed to apply for event.');
//     } finally {
//       setIsApplying(false);
//     }
//   };

//   return (
//     <View style={styles.eventCard}>
//       <Image source={item.image} style={styles.eventImage} />
//       <View style={styles.dateOverlay}>
//         <Text style={styles.dateMonth}>{item.dateMonth}</Text>
//         <Text style={styles.dateDay}>{item.dateDay}</Text>
//       </View>
//        <TouchableOpacity style={styles.heartIcon}>
//          <Ionicons name="heart-outline" size={24} color="#fff" />
//        </TouchableOpacity>
//       <View style={styles.eventContent}>
//         <View style={styles.eventDetailsRow}>
//           <View style={{ flex: 1 }}>
//             <Text style={styles.eventLocation}>{item.location}</Text>
//             <Text style={styles.eventBudget}>{item.budget}</Text>
//           </View>
//           <View style={styles.eventTimeAndRating}>
//             <Text style={styles.eventTime}>{item.time}</Text>
//           </View>
//         </View>
//         <View style={styles.tagsContainer}>
//           {item.tags.map((tag, index) => (
//             <View key={index} style={styles.tag}>
//               <Text style={styles.tagText}>{tag}</Text>
//             </View>
//           ))}
//         </View>
//         <View style={styles.guestListRow}>
//           <Text style={styles.guestListText}>Do You Have a Guest List?</Text>
//           <CustomToggle
//             value={showGuestListInput}
//             onValueChange={setShowGuestListInput}
//           />
//         </View>

//         {showGuestListInput && (
//           <View style={styles.guestListInputContainer}>
//             <TextInput
//               style={styles.guestListInput}
//               placeholder="https://copy-guestlist-link-artist-"
//               placeholderTextColor="#888"
//               value={item.guestLink || "https://copy-guestlist-link-artist-"}
//               editable={false}
//             />
//             <TouchableOpacity onPress={() => console.log('Copy guest list link')}>
//               <Ionicons name="copy-outline" size={24} color="#ccc" />
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={styles.actionsRow}>
//           <TouchableOpacity 
//             style={[styles.applyButton, isAlreadyApplied && styles.appliedButton]} 
//             onPress={handleApplyPress}
//             disabled={isAlreadyApplied || isApplying}
//           >
//             {isAlreadyApplied ? (
//               <Text style={styles.appliedButtonText}>Applied</Text>
//             ) : isApplying ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <LinearGradient 
//                 colors={['#B15CDE', '#7952FC']} 
//                 start={{x: 1, y: 0}} 
//                 end={{x: 0, y: 0}} 
//                 style={styles.applyButtonGradient}
//               >
//                  <Text style={styles.applyButtonText}>Apply</Text>
//               </LinearGradient>
//             )}
//           </TouchableOpacity>
//            <TouchableOpacity style={styles.bookmarkButton}>
//              <Icon name="bookmark" size={24} color="#a95eff" />
//           </TouchableOpacity>
//         </View>

//       </View>
//     </View>
//   );
// };

// const ArtistHomeScreen = ({ navigation }) => {
//   const [searchText, setSearchText] = useState('');
//   const [selectedGenre, setSelectedGenre] = useState(null);
//   const [selectedBudget, setSelectedBudget] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [showBudgetModal, setShowBudgetModal] = useState(false);
//   const [currentBudget, setCurrentBudget] = useState(100);
//   const [bubbleLeft, setBubbleLeft] = useState('50%');
//   const [artistName, setArtistName] = useState('Artist');
//   const [artistLocation, setArtistLocation] = useState('H-70, Sector 63, Noida');
//   const [eventsData, setEventsData] = useState([]);
//   const [isLoadingEvents, setIsLoadingEvents] = useState(true);
//   const [eventsError, setEventsError] = useState(null);
//   const insets = useSafeAreaInsets();
//   const dispatch = useDispatch();
  
//   // Get token and auth data from Redux
//   const token = useSelector(selectToken);
//   const authName = useSelector(state => state.auth.userData.name);
//   const authLocation = useSelector(selectLocation);
//   const userData = useSelector(state => state.auth.userData);

//   // Function to get first word from full name
//   const getFirstName = (fullName) => {
//     if (!fullName) return 'Artist';
//     return fullName.split(' ')[0];
//   };

//   // Fetch events data from API
//   const fetchEvents = async () => {
//     try {
//       setIsLoadingEvents(true);
//       setEventsError(null);
      
//       console.log('Fetching events with token:', token);
      
//       if (!token) {
//         setEventsError('No authentication token found. Please login again.');
//         return;
//       }
      
//       const response = await api.get('/host/events/get-all-events', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
      
//       console.log('Events API Response:', response.data);
      
//       if (response.data && response.data.data) {
//         // Transform API data to match our component structure
//         const transformedEvents = response.data.data.map((event, index) => {
//           // Get the first date from the eventDate array
//           const eventDate = event.eventDate && event.eventDate.length > 0 
//             ? new Date(event.eventDate[0]) 
//             : new Date();
          
//           return {
//             id: event._id,
//             image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
//             dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
//             dateDay: eventDate.getDate().toString(),
//             location: event.venue || 'Noida',
//             budget: `$${event.budget || 400}-${event.budget ? event.budget + 100 : 500}`,
//             time: event.eventTime || '09:30 AM',
//             rating: event.Rating || 4,
//             tags: event.genre || ['Drums', 'Violin'],
//             hasGuestList: !!event.guestLinkUrl,
//             guestLink: event.guestLinkUrl,
//             eventName: event.eventName,
//             discount: event.Discount,
//             status: event.status,
//             isCompleted: event.isCompleted,
//             isCancelled: event.isCancelled,
//             showStatus: event.showStatus,
//           };
//         });
        
//         setEventsData(transformedEvents);
//         console.log('Transformed Events:', transformedEvents);
//       } else {
//         setEventsError('Failed to fetch events');
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       if (error.response?.status === 401) {
//         setEventsError('Authentication failed. Please login again.');
//       } else {
//         setEventsError(error.response?.data?.message || 'Failed to fetch events');
//       }
//     } finally {
//       setIsLoadingEvents(false);
//     }
//   };

//   // Fetch artist profile to get the name and location
//   const fetchArtistProfile = async () => {
//     try {
//       if (!token) {
//         console.log('No token available for profile fetch');
//         // Use auth name and location as fallback
//         if (authName) setArtistName(getFirstName(authName));
//         if (authLocation) setArtistLocation(authLocation);
//         return;
//       }
      
//       const artistId = userData?.id;
//       if (!artistId) {
//         console.log('No artist ID available for profile fetch');
//         // Use auth name and location as fallback
//         if (authName) setArtistName(getFirstName(authName));
//         if (authLocation) setArtistLocation(authLocation);
//         return;
//       }
      
//       console.log('Fetching profile for artistId:', artistId, 'with token:', token);
      
//       const response = await api.get(`/artist/get-profile/${artistId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
      
//       console.log('Profile API Response:', response.data);
      
//       if (response.data && response.data.success && response.data.data) {
//         const profile = response.data.data;
//         const name = profile.fullName || profile.name || 'Artist';
//         const location = profile.address || '';
        
//         console.log('Setting artist name to:', name, 'and location to:', location);
        
//         setArtistName(getFirstName(name));
//         setArtistLocation(location);
//       } else {
//         console.log('Profile API failed or returned no data');
//         // Use fallback values
//         if (authName) setArtistName(getFirstName(authName));
//         if (authLocation) setArtistLocation(authLocation);
//       }
//     } catch (error) {
//       console.error('Error fetching artist profile:', error);
//       // Fallback to Redux values
//       if (authName) setArtistName(getFirstName(authName));
//       if (authLocation) setArtistLocation(authLocation);
//     }
//   };

//   // Fetch filtered events from API
//   const fetchFilteredEvents = async (filters = {}) => {
//     try {
//       setIsLoadingEvents(true);
//       setEventsError(null);
//       const params = {};
//       if (filters.search) params.search = filters.search;
//       if (filters.genre) params.genre = filters.genre;
//       if (filters.budget) params.budget = filters.budget;
//       if (filters.location) params.location = filters.location;
//       const response = await api.get('/artist/filter-events', {
//         params,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (response.data && response.data.data) {
//         const transformedEvents = response.data.data.map((event) => {
//           const eventDate = event.eventDate && event.eventDate.length > 0 
//             ? new Date(event.eventDate[0]) 
//             : new Date();
//           return {
//             id: event._id,
//             image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
//             dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
//             dateDay: eventDate.getDate().toString(),
//             location: event.venue || 'Noida',
//             budget: `$${event.budget || 400}-${event.budget ? event.budget + 100 : 500}`,
//             time: event.eventTime || '09:30 AM',
//             rating: event.Rating || 4,
//             tags: event.genre || ['Drums', 'Violin'],
//             hasGuestList: !!event.guestLinkUrl,
//             guestLink: event.guestLinkUrl,
//             eventName: event.eventName,
//             discount: event.Discount,
//             status: event.status,
//             isCompleted: event.isCompleted,
//             isCancelled: event.isCancelled,
//             showStatus: event.showStatus,
//           };
//         });
//         setEventsData(transformedEvents);
//       } else {
//         setEventsError('No events found');
//       }
//     } catch (error) {
//       setEventsError(error.response?.data?.message || 'Failed to fetch events');
//     } finally {
//       setIsLoadingEvents(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchArtistProfile();
//     fetchEvents();
//   }, []);

//   // Filter button handlers
//   const handleAllPress = () => {
//     setSelectedGenre(null);
//     setSelectedBudget(null);
//     setSelectedLocation(null);
//     setSearchText('');
//     fetchEvents();
//   };
//   const handleGenrePress = (genre) => {
//     setSelectedGenre(genre);
//     fetchFilteredEvents({
//       search: searchText,
//       genre,
//       budget: selectedBudget,
//       location: selectedLocation,
//     });
//   };
//   const handleBudgetPress = (budget) => {
//     setSelectedBudget(budget);
//     fetchFilteredEvents({
//       search: searchText,
//       genre: selectedGenre,
//       budget,
//       location: selectedLocation,
//     });
//   };
//   const handleLocationPress = (location) => {
//     setSelectedLocation(location);
//     fetchFilteredEvents({
//       search: searchText,
//       genre: selectedGenre,
//       budget: selectedBudget,
//       location,
//     });
//   };
//   const handleSearchSubmit = () => {
//     fetchFilteredEvents({
//       search: searchText,
//       genre: selectedGenre,
//       budget: selectedBudget,
//       location: selectedLocation,
//     });
//   };

//   const renderScrollableHeader = () => (
//     <>
//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#aaa" />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search Event"
//           placeholderTextColor="#aaa"
//           value={searchText}
//           onChangeText={setSearchText}
//           returnKeyType="search"
//           onSubmitEditing={handleSearchSubmit}
//         />
//       </View>

//       {/* Filter Buttons */}
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
//         <TouchableOpacity style={[styles.filterButton, styles.allPillActive]}>
//            <Ionicons name="grid" size={18} color={'#fff'} style={styles.filterIcon} />
//           <Text style={[styles.filterButtonText, { color: '#fff' }]}>All</Text>
//         </TouchableOpacity>
//          <TouchableOpacity style={styles.filterButton} onPress={() => handleGenrePress('Electronic')}>
//             <Ionicons name="musical-notes" size={18} color="#aaa" style={styles.filterIcon} />
//           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Genre</Text>
//         </TouchableOpacity>
//          <TouchableOpacity style={styles.filterButton} onPress={() => setShowBudgetModal(true)}>
//             <FontAwesome name="dollar" size={18} color="#aaa" style={styles.filterIcon} />
//           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Budget</Text>
//         </TouchableOpacity>
//           <TouchableOpacity style={styles.filterButton}>
//             <Icon name="calendar" size={18} color="#aaa" style={styles.filterIcon} />
//           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Date</Text>
//         </TouchableOpacity>
//            <TouchableOpacity style={styles.filterButton} onPress={() => handleLocationPress('Noida')}>
//             <Icon name="map-pin" size={18} color="#aaa" style={styles.filterIcon} />
//           <Text style={[styles.filterButtonText, styles.filterButtonTextInactive]}>Location</Text>
//         </TouchableOpacity>
//       </ScrollView>

//       {/* Latest Events */}
//       <View style={styles.latestEventsContainer}>
//         <Text
//           style={[
//             styles.latestEventsTitle,
//             {
//               color: '#404040',
//               fontFamily: 'Roboto',
//               fontSize: 20,
//               fontWeight: '500',
//               lineHeight: undefined,
//             },
//           ]}
//         >
//           Latest Events
//         </Text>
//       </View>
//     </>
//   );

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       <SignUpBackground
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//         }}
//         width={width}
//         height={'100%'}
//       />
      
//       {/* Fixed Header */}
//       <View style={[styles.fixedHeader, { paddingTop: Math.max(insets.top * 0.5, 10) }]}>
//         <View>
//           <MaskedView
//             maskElement={
//               <Text
//                 style={[
//                   styles.greeting,
//                   {
//                     fontFamily: 'Poppins',
//                     fontSize: 22,
//                     fontWeight: '700',
//                     lineHeight: 28,
//                     backgroundColor: 'transparent',
//                   },
//                 ]}
//               >
//                 Hello {artistName}!
//               </Text>
//             }
//           >
//             <LinearGradient
//               colors={["#B15CDE", "#7952FC"]}
//               start={{ x: 1, y: 0 }}
//               end={{ x: 0, y: 0 }}
//               style={{ height: 28 }}
//             >
//               <Text
//                 style={[
//                   styles.greeting,
//                   {
//                     opacity: 0,
//                     fontFamily: 'Poppins',
//                     fontSize: 24,
//                     fontWeight: '700',
//                     lineHeight: 28,
//                   },
//                 ]}
//               >
//                 Hello {artistName}!
//               </Text>
//             </LinearGradient>
//           </MaskedView>
//           <View style={styles.locationContainer}>
//             <MaterialIcons name="location-on" size={16} color="#a95eff" />
//             <Text style={styles.locationText}>{artistLocation}</Text>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('ArtistNotification')}>
//           <Icon name="bell" size={24} color="#fff" />
//           {/* Notification dot */}
//           <View style={styles.notificationDot} />
//         </TouchableOpacity>
//       </View>

//       {/* Scrollable Content */}
//       <View style={styles.scrollableContent}>
//         {/* Loading State for Events */}
//         {isLoadingEvents ? (
//           <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//             <ActivityIndicator size="large" color="#a95eff" />
//             <Text style={{ color: '#fff', marginTop: 10 }}>Loading events...</Text>
//           </View>
//         ) : eventsError ? (
//           <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
//             <Text style={{ color: '#fff', marginBottom: 20, textAlign: 'center' }}>{eventsError}</Text>
//             <TouchableOpacity 
//               style={styles.retryButton}
//               onPress={fetchEvents}
//             >
//               <Text style={{ color: '#fff' }}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <FlatList
//             data={eventsData}
//             renderItem={({ item }) => <ArtistEventCard item={item} navigation={navigation} />}
//             keyExtractor={(item) => item.id}
//             ListHeaderComponent={renderScrollableHeader}
//             refreshing={isLoadingEvents}
//             onRefresh={fetchEvents}
//           />
//         )}
//       </View>

//       {/* Bottom Navigation Bar */}
//       <ArtistBottomNavBar
//         navigation={navigation}
//         insets={insets}
//       />

//       {/* Budget Selection Modal */}
//       <Modal
//         visible={showBudgetModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowBudgetModal(false)}
//       >
//         <View style={styles.modalOverlayTop}>
//           <View style={styles.budgetModalContent}>
//             {/* Close Button */}
//             <TouchableOpacity style={styles.closeButton} onPress={() => setShowBudgetModal(false)}>
//               <Ionicons name="close" size={24} color="#fff" />
//             </TouchableOpacity>

//             {/* Budget Value Bubble */}
//             <View style={[styles.budgetValueBubble, { left: bubbleLeft }]}>
//               <Text style={styles.budgetValueText}>${currentBudget}</Text>
//             </View>

//             {/* Slider Implementation */}
//             <Slider
//               style={styles.actualSlider}
//               minimumValue={0}
//               maximumValue={1000}
//               value={currentBudget}
//               onValueChange={value => {
//                 const roundedValue = Math.round(value);
//                 setCurrentBudget(roundedValue);
//                 const estimatedLeft = `${(roundedValue / 1000) * 90}%`;
//                 setBubbleLeft(estimatedLeft);
//               }}
//               minimumTrackTintColor="#a95eff"
//               maximumTrackTintColor="#3e3e3e"
//               thumbTintColor="#a95eff"
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   fixedHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: dimensions.spacing.xl,
//     paddingBottom: dimensions.spacing.md,
//     backgroundColor: 'transparent',
//     zIndex: 10,
//   },
//   scrollableContent: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: dimensions.spacing.xl,
//     paddingBottom: dimensions.spacing.md,
//   },
//   greeting: {
//     fontSize: dimensions.headerFontSize + 6,
//     fontWeight: 'bold',
//     color: '#a95eff',
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: dimensions.spacing.xs,
//   },
//   locationText: {
//     fontSize: dimensions.bodyFontSize,
//     color: '#aaa',
//     marginLeft: dimensions.spacing.xs,
//   },
//   notificationIcon: {
//     padding: dimensions.spacing.sm,
//     position: 'relative',
//     borderWidth: 1,
//     borderColor: '#C6C5ED',
//     borderRadius: 20,
//   },
//     notificationDot: {
//     position: 'absolute',
//     top: dimensions.spacing.sm,
//     right: dimensions.spacing.sm,
//     width: dimensions.spacing.sm,
//     height: dimensions.spacing.sm,
//     borderRadius: dimensions.spacing.xs,
//     backgroundColor: 'red',
//   },
//   searchContainer: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     alignSelf: 'stretch',
//     height: 48,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: 'rgba(36,36,45,1)',
//     backgroundColor: '#121212',
//     marginHorizontal: dimensions.spacing.xl,
//     marginTop: dimensions.spacing.md,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: dimensions.spacing.md,
//     color: 'rgba(57, 57, 70, 1)',
//     fontFamily: 'Nunito Sans',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '400',
//     lineHeight: 21,
//   },
//   filterContainer: {
//     paddingHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 20,
//   },
//   filterButton: {
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 38,
//     paddingHorizontal: 20,
//     gap: 8,
//     borderRadius: 360,
//     borderWidth: 1,
//     borderColor: 'rgba(45,45,56,1)',
//     backgroundColor: '#1a1a1a',
//     marginRight: 10,
//   },
//   filterButtonActive: {
//     backgroundColor: 'rgba(198,197,237,1)',
//     borderColor: 'rgba(45,45,56,1)',
//   },
//   filterIcon:{
//     marginRight: 5,
//   },
//   filterButtonText: {
//     fontSize: 10,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   filterButtonTextInactive: {
//     color: '#aaa',
//   },
//   filterButtonTextActive: {
//     color: '#fff',
//   },
//   latestEventsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 20,
//     marginBottom: 15,
//   },
//   latestEventsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   eventCard: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 10,
//     width: width * 0.9, // Increased from 0.8 to 0.9 for wider cards
//     marginBottom: 15,
//     overflow: 'hidden',
//     alignSelf: 'center',
//   },
//   eventImage: {
//     width: '100%',
//     height: 150, // Adjust image height as needed
//     resizeMode: 'cover',
   
//   },
//    dateOverlay: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: '#000000aa',
//     borderRadius: 5,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     alignItems: 'center',
//   },
//   dateMonth: {
//     fontSize: 12,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   dateDay: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//     heartIcon: {
//      position: 'absolute',
//      top: 10,
//      right: 10,
//      zIndex: 1, // Ensure heart icon is above image
//     },
//   eventContent: {
//     padding: 12,
//   },
//   eventLocation: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   eventDetailsRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     marginBottom: 4,
//     gap: 8,
//   },
//   eventTimeAndRating: {
//     flexDirection: 'column',
//     alignItems: 'flex-end',
//     gap: 2,
//   },
//   eventBudget: {
//     fontSize: 12,
//     color: '#7952FC',
//     fontWeight:600,
//     marginTop:5,
//     marginBottom:5,
//   },
//   eventTime: {
//     fontSize: 12,
//     color: '#7952FC',
//     fontWeight:600,
//     marginTop:5,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 8,
//   },
//   tag: {
//     backgroundColor: '#333',
//     borderRadius: 5,
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//     marginRight: 6,
//     marginBottom: 6,
//   },
//   tagText: {
//     fontSize: 12,
//     color: '#fff',
//   },
//     guestListRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//     guestListText: {
//      fontSize: 14,
//     color: '#fff',
//     },
//     guestListInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//      borderRadius: 10,
//     paddingHorizontal: 15,
//     marginTop: 15,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#a95eff',
//   },
//   guestListInput: {
//     flex: 1,
//     color: '#fff',
//     paddingVertical: 12,
//     fontSize: 16,
//     },
//    actionsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//    },
//     applyButton: {
//     display: 'flex',
//     flex: 1,
//     flexBasis: 0,
//     alignSelf: 'stretch',
//     paddingTop: 4,
//     paddingBottom: 4,
//    // paddingLeft: 12,
//    // paddingRight: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 4,
//     borderRadius: 8,
//     overflow: 'hidden',
//     marginRight: 10,
//   },
//   applyButtonGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     borderRadius: 8,
//     backgroundColor: 'transparent',
//   },
//   applyButtonText: {
//     color: '#FFF',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '500',
//     lineHeight: 20,
//     fontFeatureSettings: "'salt' on",
//   },
//   bookmarkButton: {
//     padding: 8,
//     borderWidth: 1,
//     borderColor: '#B15CDE',
//     borderRadius: 14,
//   },

//   // Updated styles for the budget modal to match image
//   modalOverlayTop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-start',
//     alignItems: 'stretch',
//     paddingTop: 250,
//   },
//   budgetModalContent: {
//     backgroundColor: '#1a1a1a',
//     padding: 20,
//     paddingTop: 40,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#333',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 1,
//     padding: 5,
//   },
//   modalTitle: {
//     // Removed as per image
//   },
//   budgetValueBubble: {
//     position: 'absolute',
//     top: -30,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     zIndex: 4,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   budgetValueText: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   actualSlider: {
//     width: '100%',
//     height: 40,
//     marginVertical: 10,
//    },
//   allPillActive: {
//     backgroundColor: '#7952FC',
//     borderWidth: 0,
//   },
//   appliedButton: {
//     borderWidth: 1,
//     borderColor: '#B15CDE',
//     borderRadius: 8,
//   },
//   appliedButtonText: {
//     color: '#B15CDE',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '500',
//     lineHeight: 20,
//     fontFeatureSettings: "'salt' on",
//   },
//   retryButton: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#a95eff',
//     borderRadius: 8,
//   },
// });

// export default ArtistHomeScreen;



//  anirudh code is here






import React, { useState, useEffect } from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { addAppliedEvent } from '../Redux/slices/appliedSlice';
import { selectLocation, selectToken } from '../Redux/slices/authSlice';
import AppliedIcon from '../assets/icons/Applied';
import InboxIcon from '../assets/icons/inbox';
import SignUpBackground from '../assets/Banners/SignUp';
import MaskedView from '@react-native-masked-view/masked-view';
import CustomToggle from '../Components/CustomToggle'; // Adjust path as needed
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import api from '../Config/api';

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

// New component for individual event cards
const ArtistEventCard = ({ item, navigation }) => {
  const [showGuestListInput, setShowGuestListInput] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const dispatch = useDispatch();
  const appliedEvents = useSelector(state => state.applied.appliedEvents);
  const token = useSelector(state => state.auth.token);
  
  // Check if this event is already applied
  const isAlreadyApplied = appliedEvents.some(appliedEvent => appliedEvent.id === item.id);

  const handleApplyPress = async () => {
    if (isAlreadyApplied) {
      Alert.alert('Already Applied', 'You have already applied for this event.');
      return;
    }
    if (!token) {
      Alert.alert('Not Authenticated', 'Please login to apply for events.');
      return;
    }
    setIsApplying(true);
    try {
      const response = await api.post(
        '/artist/apply-event',
        { eventId: item.id },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data && response.data.success) {
        dispatch(addAppliedEvent({
          id: item.id,
          location: item.location,
          budget: item.budget,
          time: item.time,
          genres: item.tags,
          rating: item.rating,
          image: item.image,
          eventId: item.id,
          venueName: item.location,
          dateMonth: item.dateMonth,
          dateDay: item.dateDay,
        }));
        Alert.alert('Success', 'Application submitted successfully!');
      } else {
        Alert.alert('Failed', response.data?.message || 'Failed to apply for event.');
      }
    } catch (error) {
      console.error('Error applying for event:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to apply for event.');
    } finally {
      setIsApplying(false);
    }
  };

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
              value={item.guestLink || "https://copy-guestlist-link-artist-"}
              editable={false}
            />
            <TouchableOpacity onPress={() => console.log('Copy guest list link')}>
              <Ionicons name="copy-outline" size={24} color="#ccc" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.applyButton, isAlreadyApplied && styles.appliedButton]} 
            onPress={handleApplyPress}
            disabled={isAlreadyApplied || isApplying}
          >
            {isAlreadyApplied ? (
              <Text style={styles.appliedButtonText}>Applied</Text>
            ) : isApplying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <LinearGradient 
                colors={['#B15CDE', '#7952FC']} 
                start={{x: 1, y: 0}} 
                end={{x: 0, y: 0}} 
                style={styles.applyButtonGradient}
              >
                 <Text style={styles.applyButtonText}>Apply</Text>
              </LinearGradient>
            )}
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
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentBudget, setCurrentBudget] = useState(100);
  const [bubbleLeft, setBubbleLeft] = useState('50%');
  const [artistName, setArtistName] = useState('Artist');
  const [artistLocation, setArtistLocation] = useState('H-70, Sector 63, Noida');
  const [eventsData, setEventsData] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Get token and auth data from Redux
  const token = useSelector(selectToken);
  const authName = useSelector(state => state.auth.userData.name);
  const authLocation = useSelector(selectLocation);
  const userData = useSelector(state => state.auth.userData);

  // Function to get first word from full name
  const getFirstName = (fullName) => {
    if (!fullName) return 'Artist';
    return fullName.split(' ')[0];
  };

  // Fetch events data from API
  const fetchEvents = async () => {
    try {
      setIsLoadingEvents(true);
      setEventsError(null);
      
      console.log('Fetching events with token:', token);
      
      if (!token) {
        setEventsError('No authentication token found. Please login again.');
        return;
      }
      
      const response = await api.get('/host/events/get-all-events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Events API Response:', response.data);
      
      if (response.data && response.data.data) {
        // Transform API data to match our component structure
        const transformedEvents = response.data.data.map((event, index) => {
          // Get the first date from the eventDate array
          const eventDate = event.eventDate && event.eventDate.length > 0 
            ? new Date(event.eventDate[0]) 
            : new Date();
          
          return {
            id: event._id,
            image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            location: event.venue || 'Noida',
            budget: `$${event.budget || 400}-${event.budget ? event.budget + 100 : 500}`,
            time: event.eventTime || '09:30 AM',
            rating: event.Rating || 4,
            tags: event.genre || ['Drums', 'Violin'],
            hasGuestList: !!event.guestLinkUrl,
            guestLink: event.guestLinkUrl,
            eventName: event.eventName,
            discount: event.Discount,
            status: event.status,
            isCompleted: event.isCompleted,
            isCancelled: event.isCancelled,
            showStatus: event.showStatus,
          };
        });
        
        setEventsData(transformedEvents);
        console.log('Transformed Events:', transformedEvents);
      } else {
        setEventsError('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        setEventsError('Authentication failed. Please login again.');
      } else {
        setEventsError(error.response?.data?.message || 'Failed to fetch events');
      }
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Fetch artist profile to get the name and location
  const fetchArtistProfile = async () => {
    try {
      if (!token) {
        console.log('No token available for profile fetch');
        // Use auth name and location as fallback
        if (authName) setArtistName(getFirstName(authName));
        if (authLocation) setArtistLocation(authLocation);
        return;
      }
      
      const artistId = userData?.id;
      if (!artistId) {
        console.log('No artist ID available for profile fetch');
        // Use auth name and location as fallback
        if (authName) setArtistName(getFirstName(authName));
        if (authLocation) setArtistLocation(authLocation);
        return;
      }
      
      console.log('Fetching profile for artistId:', artistId, 'with token:', token);
      
      const response = await api.get(`/artist/get-profile/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Profile API Response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        const profile = response.data.data;
        const name = profile.fullName || profile.name || 'Artist';
        const location = profile.address || '';
        
        console.log('Setting artist name to:', name, 'and location to:', location);
        
        setArtistName(getFirstName(name));
        setArtistLocation(location);
      } else {
        console.log('Profile API failed or returned no data');
        // Use fallback values
        if (authName) setArtistName(getFirstName(authName));
        if (authLocation) setArtistLocation(authLocation);
      }
    } catch (error) {
      console.error('Error fetching artist profile:', error);
      // Fallback to Redux values
      if (authName) setArtistName(getFirstName(authName));
      if (authLocation) setArtistLocation(authLocation);
    }
  };

  // Fetch filtered events from API
  const fetchFilteredEvents = async (filters = {}) => {
    try {
      setIsLoadingEvents(true);
      setEventsError(null);
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.genre) params.genre = filters.genre;
      if (filters.budget) params.budget = filters.budget;
      if (filters.location) params.location = filters.location;
      const response = await api.get('/artist/filter-events', {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data && response.data.data) {
        const transformedEvents = response.data.data.map((event) => {
          const eventDate = event.eventDate && event.eventDate.length > 0 
            ? new Date(event.eventDate[0]) 
            : new Date();
          return {
            id: event._id,
            image: event.posterUrl ? { uri: event.posterUrl } : require('../assets/Images/fff.jpg'),
            dateMonth: eventDate.toLocaleDateString('en-US', { month: 'short' }),
            dateDay: eventDate.getDate().toString(),
            location: event.venue || 'Noida',
            budget: `$${event.budget || 400}-${event.budget ? event.budget + 100 : 500}`,
            time: event.eventTime || '09:30 AM',
            rating: event.Rating || 4,
            tags: event.genre || ['Drums', 'Violin'],
            hasGuestList: !!event.guestLinkUrl,
            guestLink: event.guestLinkUrl,
            eventName: event.eventName,
            discount: event.Discount,
            status: event.status,
            isCompleted: event.isCompleted,
            isCancelled: event.isCancelled,
            showStatus: event.showStatus,
          };
        });
        setEventsData(transformedEvents);
      } else {
        setEventsError('No events found');
      }
    } catch (error) {
      setEventsError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchArtistProfile();
    fetchEvents();
  }, []);

  // Filter button handlers
  const handleAllPress = () => {
    setSelectedGenre(null);
    setSelectedBudget(null);
    setSelectedLocation(null);
    setSearchText('');
    fetchEvents();
  };
  const handleGenrePress = (genre) => {
    setSelectedGenre(genre);
    fetchFilteredEvents({
      search: searchText,
      genre,
      budget: selectedBudget,
      location: selectedLocation,
    });
  };
  const handleBudgetPress = (budget) => {
    setSelectedBudget(budget);
    fetchFilteredEvents({
      search: searchText,
      genre: selectedGenre,
      budget,
      location: selectedLocation,
    });
  };
  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    fetchFilteredEvents({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location,
    });
  };
  const handleSearchSubmit = () => {
    fetchFilteredEvents({
      search: searchText,
      genre: selectedGenre,
      budget: selectedBudget,
      location: selectedLocation,
    });
  };

  const renderScrollableHeader = () => (
    <>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#aaa" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Event"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
      </View>

      {/* Filter Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.allPillActive]}>
           <Ionicons name="grid" size={18} color={'#fff'} style={styles.filterIcon} />
          <Text style={[styles.filterButtonText, { color: '#fff' }]}>All</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.filterButton} onPress={() => handleGenrePress('Electronic')}>
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
           <TouchableOpacity style={styles.filterButton} onPress={() => handleLocationPress('Noida')}>
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
      
      {/* Fixed Header */}
      <View style={[styles.fixedHeader, { paddingTop: Math.max(insets.top * 0.5, 10) }]}>
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
                Hello {artistName}!
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
                Hello {artistName}!
              </Text>
            </LinearGradient>
          </MaskedView>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#a95eff" />
            <Text style={styles.locationText}>{artistLocation}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('ArtistNotification')}>
          <Icon name="bell" size={24} color="#fff" />
          {/* Notification dot */}
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <View style={styles.scrollableContent}>
        {/* Loading State for Events */}
        {isLoadingEvents ? (
          <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#a95eff" />
            <Text style={{ color: '#fff', marginTop: 10 }}>Loading events...</Text>
          </View>
        ) : eventsError ? (
          <View style={[styles.loadingContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ color: '#fff', marginBottom: 20, textAlign: 'center' }}>{eventsError}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchEvents}
            >
              <Text style={{ color: '#fff' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={eventsData}
            renderItem={({ item }) => <ArtistEventCard item={item} navigation={navigation} />}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderScrollableHeader}
            refreshing={isLoadingEvents}
            onRefresh={fetchEvents}
          />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <ArtistBottomNavBar
        navigation={navigation}
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
  fixedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.xl,
    paddingBottom: dimensions.spacing.md,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
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
    paddingHorizontal: 20,
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
    fontSize: 10,
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
    fontSize: 12,
    color: '#7952FC',
    fontWeight:600,
    marginTop:5,
    marginBottom:5,
  },
  eventTime: {
    fontSize: 12,
    color: '#7952FC',
    fontWeight:600,
    marginTop:5,
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
   // paddingLeft: 12,
   // paddingRight: 16,
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
  appliedButton: {
    borderWidth: 1,
    borderColor: '#B15CDE',
    borderRadius: 8,
  },
  appliedButtonText: {
    color: '#B15CDE',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  retryButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#a95eff',
    borderRadius: 8,
  },
});

export default ArtistHomeScreen;