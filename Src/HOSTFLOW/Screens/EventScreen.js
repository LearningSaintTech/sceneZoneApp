// import React, { useState, useEffect, useCallback } from 'react'; // Explicitly import useState and useEffect
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   useColorScheme,
//   ScrollView,
//   Dimensions,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import Feather from 'react-native-vector-icons/Feather';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import DeleteIcon from '../assets/icons/delete';
// import Calender from '../assets/icons/Calender';
// import RingIcon from '../assets/icons/ring';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { useFocusEffect } from '@react-navigation/native';

// const { width, height } = Dimensions.get('window');

// // Responsive dimensions system for all Android devices
// const isTablet = width >= 768;
// const isSmallPhone = width < 350;

// const dimensions = {
//   spacing: {
//     xs: Math.max(width * 0.01, 4),
//     sm: Math.max(width * 0.02, 8),
//     md: Math.max(width * 0.03, 12),
//     lg: Math.max(width * 0.04, 16),
//     xl: Math.max(width * 0.05, 20),
//     xxl: Math.max(width * 0.06, 24),
//   },
//   fontSize: {
//     tiny: Math.max(width * 0.025, 10),
//     small: Math.max(width * 0.03, 12),
//     body: Math.max(width * 0.035, 14),
//     title: Math.max(width * 0.04, 16),
//     header: Math.max(width * 0.045, 18),
//     large: Math.max(width * 0.07, 28),
//   },
//   borderRadius: {
//     sm: Math.max(width * 0.015, 6),
//     md: Math.max(width * 0.025, 10),
//     lg: Math.max(width * 0.04, 16),
//     xl: Math.max(width * 0.06, 25),
//   },
//   buttonHeight: Math.max(height * 0.06, 44),
//   iconSize: Math.max(width * 0.06, 20),
//   imageHeight: Math.min(width * 0.55, height * 0.3),
//   cardPadding: Math.max(width * 0.04, 16),
//   headerHeight: Math.max(height * 0.1, 80),
// };

// const EventScreen = ({ navigation }) => {
//   console.log('EventScreen component loaded'); // Debug log
//   const isDark = useColorScheme() === 'dark';
//   const [events, setEvents] = useState([]); // Ensure useState is used
//   const insets = useSafeAreaInsets();
//   const token = useSelector(state => state.auth.token);

//   const textColor = '#fff'; // Force white text for visibility
//   const subText = '#aaa'; // Light gray for secondary text

//   const fetchEvents = useCallback(async () => {
//     console.log('fetchEvents called');
//     try {
//       console.log('Making GET request to fetch events');
//       const response = await axios.get('http://192.168.1.8:3000/api/host/events/get-all-events', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log('API Response:', response.data); // Log full response
//       if (response.data.success) {
//         console.log('Mapping events from API response');
//         const apiEvents = response.data.data.map(event => {
//           console.log('Mapping event:', event);
//           const firstDate = new Date(event.eventDate[0]);
//           const nearestStatus = event.showStatus.reduce((nearest, current) => {
//             const currentDate = new Date(current.date);
//             const nearestDate = new Date(nearest.date);
//             return currentDate > new Date() && currentDate < nearestDate ? current : nearest;
//           }, event.showStatus[0] || { date: new Date().toISOString().split('T')[0], status: 'upcoming' });

//           const mappedEvent = {
//             id: event._id,
//             title: event.eventName,
//             location: event.venue,
//             date: {
//               month: firstDate.toLocaleString('en-US', { month: 'short' }),
//               day: firstDate.getDate().toString(),
//             },
//             tags: event.genre,
//             description: 'Come along for an unforgettable evening filled with live music! Feel the beat and excitement!',
//             image: { uri: event.posterUrl },
//             status: nearestStatus.status,
//           };
//           console.log('Mapped event:', mappedEvent);
//           return mappedEvent;
//         });
//         console.log('Mapped Events:', apiEvents); // Log mapped events
//         setEvents(apiEvents);
//         console.log('Events state updated');
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to fetch events. Check network or API URL.');
//     }
//   }, [token]);

//   useFocusEffect(
//     React.useCallback(() => {
//       console.log('Screen focused, calling fetchEvents');
//       fetchEvents();
//     }, [fetchEvents])
//   );

//   const addEvent = () => {
//     console.log('Navigating to NewEvent screen');
//     navigation.navigate('NewEvent');
//   };

//   const handleDeleteEvent = async (eventId) => {
//     console.log('handleDeleteEvent called for eventId:', eventId);
//     try {
//       console.log('Making DELETE request for event:', eventId);
//       const response = await axios.delete(`http://192.168.1.8:3000/api/host/events/delete-event/${eventId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       console.log('Delete API response:', response.data);
//       if (response.data.success) {
//         console.log('Event deleted successfully, refreshing events');
//         Alert.alert('Success', 'Event deleted successfully');
//         fetchEvents(); // Refresh the event list
//       } else {
//         console.log('Delete failed:', response.data.message);
//         Alert.alert('Error', response.data.message || 'Failed to delete event');
//       }
//     } catch (error) {
//       console.error('Error deleting event:', error.response?.data || error.message);
//       Alert.alert('Error', 'Failed to delete event.');
//     }
//   };

//   console.log('Rendering EventScreen');
//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Event</Text>
//         <TouchableOpacity style={styles.headerIconButton} onPress={() => console.log('Calendar icon pressed')}>
//           <Calender width={32} height={32} />
//         </TouchableOpacity>
//       </View>
//       <LinearGradient
//         colors={['rgba(252,252,253,0.04)', 'rgba(252,252,253,0.03)']}
//         start={{ x: 0.13, y: 0 }}
//         end={{ x: 0.98, y: 1 }}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={[
//             styles.scrollContainer,
//             {
//               paddingTop: 84, // 64 header + 20 spacing
//               paddingBottom: Math.max(insets.bottom + 120, 140),
//               paddingHorizontal: dimensions.spacing.xl,
//             },
//           ]}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Event Cards */}
//           {events.map((event) => {
//             console.log('Rendering event card:', event);
//             return (
//               <View key={event.id} style={styles.outerCardContainer}>
//                 <View style={styles.card}>
//                   <View style={styles.imageWrapper}>
//                     <Image source={event.image} style={styles.cardImage} />
//                     <View style={styles.dateBox}>
//                       <Text style={styles.dateText}>{event.date.month}</Text>
//                       <Text style={styles.dateDay}>{event.date.day}</Text>
//                     </View>
//                     <View style={styles.statusTag}>
//                       <Text style={styles.statusText}>{event.status}</Text>
//                     </View>
//                   </View>

//                   <View style={styles.cardContent}>
//                     <Text style={[styles.location, { color: textColor }]}>
//                       {event.location}
//                     </Text>
//                     <View style={styles.tags}>
//                       {event.tags.map((tag) => {
//                         console.log('Rendering tag:', tag);
//                         return (
//                           <View key={tag} style={styles.tag}>
//                             <Text style={[styles.tagText, { color: textColor }]}>{tag}</Text>
//                           </View>
//                         );
//                       })}
//                     </View>
//                     <Text style={[styles.description, { color: subText }]}>
//                       {event.description}
//                     </Text>

//                     <View style={styles.ratingRow}>
//                       {[...Array(5)].map((_, i) => {
//                         console.log('Rendering star for event:', event.id, 'star:', i);
//                         return <MaterialIcons key={i} name="star" size={12} color="#FFD700" />;
//                       })}
//                     </View>

//                     <View style={styles.actionRow}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           console.log('Explore button pressed for event:', event.id);
//                           navigation.navigate('Explore');
//                         }}
//                         style={styles.exploreButtonWrapper}
//                       >
//                         <LinearGradient
//                           colors={['#B15CDE', '#7952FC']}
//                           start={{ x: 1, y: 0 }}
//                           end={{ x: 0, y: 0 }}
//                           style={styles.exploreButton}
//                         >
//                           <Text style={styles.exploreText}>Explore</Text>
//                         </LinearGradient>
//                       </TouchableOpacity>
//                       <TouchableOpacity
//                         style={{ borderRadius: 12, overflow: 'hidden', width: 38, height: 38 }}
//                         onPress={() => {
//                           console.log('Delete button pressed for event:', event.id);
//                           handleDeleteEvent(event.id);
//                         }}
//                       >
//                         <LinearGradient
//                           colors={['#B15CDE', '#7952FC']}
//                           start={{ x: 0, y: 0 }}
//                           end={{ x: 1, y: 1 }}
//                           style={{
//                             flex: 1,
//                             borderRadius: 9,
//                             borderWidth: 1,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                           }}
//                         >
//                           <View
//                             style={{
//                               width: 34,
//                               height: 34,
//                               backgroundColor: '#111',
//                               borderRadius: 8,
//                               justifyContent: 'center',
//                               alignItems: 'center',
//                             }}
//                           >
//                             <DeleteIcon width={20} height={20} />
//                           </View>
//                         </LinearGradient>
//                       </TouchableOpacity>
//                     </View>
//                   </View>
//                 </View>
//               </View>
//             );
//           })}
//         </ScrollView>
//       </LinearGradient>

//       {/* Floating + Icon to Navigate to CreateEventScreen */}
//       <TouchableOpacity
//         style={[
//           styles.floatingPlus,
//           {
//             bottom: Math.max(insets.bottom + 80, 100),
//             right: dimensions.spacing.xxl,
//           },
//         ]}
//         onPress={() => {
//           console.log('Floating plus button pressed');
//           addEvent();
//         }}
//         activeOpacity={0.8}
//       >
//         <RingIcon style={styles.floatingPlusRing} width={54} height={54} />
//         <View style={styles.floatingPlusInnerCircle}>
//           <Feather name="plus" size={32} color="#fff" style={styles.floatingPlusIcon} />
//         </View>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   header: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//     display: 'flex',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingHorizontal: 16,
//     paddingTop: 32,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#C6C5ED',
//     shadowColor: '#683BFC',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 4,
//     backgroundColor: '#000',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontFamily: 'Nunito Sans',
//     fontSize: 22,
//     fontStyle: 'normal',
//     fontWeight: '700',
//     lineHeight: 24,
//     overflow: 'hidden',
//     textOverflow: 'ellipsis',
//     letterSpacing: 0.5,
//     flex: 1,
//     marginTop: 10,
//   },
//   headerIconButton: {
//     borderWidth: 1,
//     borderColor: '#a095c4',
//     borderRadius: dimensions.borderRadius.md,
//     padding: dimensions.spacing.sm,
//     backgroundColor: '#111',
//     minWidth: Math.max(width * 0.1, 40),
//     minHeight: Math.max(width * 0.1, 40),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 0,
//   },
//   card: {
//     borderRadius: dimensions.borderRadius.lg,
//     overflow: 'hidden',
//     marginBottom: dimensions.spacing.xxl,
//   },
//   imageWrapper: {
//     position: 'relative',
//   },
//   cardImage: {
//     width: '100%',
//     height: dimensions.imageHeight,
//     borderTopLeftRadius: dimensions.borderRadius.lg,
//     borderTopRightRadius: dimensions.borderRadius.lg,
//   },
//   dateBox: {
//     position: 'absolute',
//     top: dimensions.spacing.md,
//     left: dimensions.spacing.md,
//     backgroundColor: '#333',
//     borderRadius: dimensions.borderRadius.sm,
//     paddingHorizontal: dimensions.spacing.sm,
//     paddingVertical: dimensions.spacing.xs,
//     alignItems: 'center',
//     minWidth: Math.max(width * 0.12, 45),
//   },
//   dateText: {
//     color: '#fff',
//     fontSize: dimensions.fontSize.tiny,
//     fontWeight: '500',
//   },
//   dateDay: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: dimensions.fontSize.body,
//   },
//   statusTag: {
//     position: 'absolute',
//     bottom: dimensions.spacing.md,
//     left: dimensions.spacing.md,
//     backgroundColor: '#a95eff',
//     paddingHorizontal: dimensions.spacing.md,
//     paddingVertical: dimensions.spacing.xs,
//     borderRadius: dimensions.borderRadius.sm,
//     minHeight: 28,
//     justifyContent: 'center',
//   },
//   statusText: {
//     color: '#fff',
//     fontSize: dimensions.fontSize.small,
//     fontWeight: '500',
//   },
//   cardContent: {
//     padding: dimensions.cardPadding,
//   },
//   location: {
//     fontSize: dimensions.fontSize.title,
//     fontWeight: '600',
//     marginBottom: dimensions.spacing.sm,
//   },
//   tags: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 4,
//     marginBottom: dimensions.spacing.sm,
//   },
//   tag: {
//     display: 'flex',
//     backgroundColor: 'transparent',
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#3F3F46',
//     alignItems: 'center',
//     minHeight: 24,
//     justifyContent: 'center',
//   },
//   tagText: {
//     color: '#fff',
//     fontSize: dimensions.fontSize.tiny,
//     fontWeight: '500',
//   },
//   description: {
//     fontSize: 11,
//     lineHeight: Math.max(dimensions.fontSize.small + 5, 20),
//     marginBottom: dimensions.spacing.sm,
//   },
//   ratingRow: {
//     flexDirection: 'row',
//     marginBottom: dimensions.spacing.lg,
//     gap: dimensions.spacing.xs,
//   },
//   actionRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     gap: 0,
//   },
//   exploreButtonWrapper: {
//     flex: 1,
//     alignSelf: 'stretch',
//     marginRight: 9,
//   },
//   exploreButton: {
//     paddingTop: 4,
//     paddingBottom: 4,
//     paddingLeft: 12,
//     paddingRight: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     alignSelf: 'stretch',
//     borderRadius: 8,
//     minWidth: 180,
//     width: '100%',
//   },
//   exploreText: {
//     color: '#FFF',
//     fontFamily: 'Inter',
//     fontSize: 13,
//     fontWeight: '500',
//     lineHeight: 20,
//   },
//   floatingPlus: {
//     position: 'absolute',
//     backgroundColor: 'transparent',
//     borderRadius: 27,
//     width: 54,
//     height: 54,
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 6,
//   },
//   floatingPlusRing: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     zIndex: 0,
//   },
//   floatingPlusIcon: {
//     zIndex: 1,
//   },
//   floatingPlusInnerCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#B15CDE',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1,
//   },
//   outerCardContainer: {
//     display: 'flex',
//     minWidth: 240,
//     maxWidth: 580,
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//     alignItems: 'flex-start',
//     alignContent: 'flex-start',
//     gap: 20,
//     alignSelf: 'stretch',
//     flexWrap: 'wrap',
//     borderRadius: 16,
//     borderWidth: 1,
//     borderColor: 'rgba(252,252,253,0.12)',
//     marginBottom: 32,
//     shadowColor: '#0F0F0F',
//     shadowOffset: { width: 0, height: 40 },
//     shadowOpacity: 0.10,
//     shadowRadius: 64,
//   },
// });

// export default EventScreen;




import React, { useState, useEffect, useCallback } from 'react'; // Explicitly import useState and useEffect
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeleteIcon from '../assets/icons/delete';
import Calender from '../assets/icons/Calender';
import RingIcon from '../assets/icons/ring';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// Responsive dimensions system for all Android devices
const isTablet = width >= 768;
const isSmallPhone = width < 350;

const dimensions = {
  spacing: {
    xs: Math.max(width * 0.01, 4),
    sm: Math.max(width * 0.02, 8),
    md: Math.max(width * 0.03, 12),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.07, 28),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.06, 25),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.min(width * 0.55, height * 0.3),
  cardPadding: Math.max(width * 0.04, 16),
  headerHeight: Math.max(height * 0.1, 80),
};

const EventScreen = ({ navigation }) => {
  console.log('EventScreen component loaded');
  const isDark = useColorScheme() === 'dark';
  const [events, setEvents] = useState([]);
  const insets = useSafeAreaInsets();
  const token = useSelector(state => state.auth.token);

  const textColor = '#fff';
  const subText = '#aaa';

  const fetchEvents = useCallback(async () => {
    try {
      const response = await axios.get('http://192.168.1.8:3000/api/host/events/get-all-events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('API Response:', response.data);
      if (response.data.success) {
        const apiEvents = response.data.data.map(event => {
          const firstDate = new Date(event.eventDate[0]);
          const nearestStatus = event.showStatus.reduce((nearest, current) => {
            const currentDate = new Date(current.date);
            const nearestDate = new Date(nearest.date);
            return currentDate > new Date() && currentDate < nearestDate ? current : nearest;
          }, event.showStatus[0] || { date: new Date().toISOString().split('T')[0], status: 'upcoming' });

          return {
            id: event._id,
            title: event.eventName,
            location: event.venue,
            date: {
              month: firstDate.toLocaleString('en-US', { month: 'short' }),
              day: firstDate.getDate().toString(),
            },
            tags: event.genre,
            description: 'Come along for an unforgettable evening filled with live music! Feel the beat and excitement!',
            image: { uri: event.posterUrl },
            status: nearestStatus.status,
          };
        });
        console.log('Mapped Events:', apiEvents);
        setEvents(apiEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to fetch events. Check network or API URL.');
    }
  }, [token]);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [fetchEvents])
  );

  const addEvent = () => {
    navigation.navigate('NewEvent');
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await axios.delete(`http://192.168.1.8:3000/api/host/events/delete-event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        Alert.alert('Success', 'Event deleted successfully');
        fetchEvents();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to delete event.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Event</Text>
        <TouchableOpacity style={styles.headerIconButton}>
          <Calender width={32} height={32} />
        </TouchableOpacity>
      </View>
      <LinearGradient
        colors={['rgba(252,252,253,0.04)', 'rgba(252,252,253,0.03)']}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 0.98, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer,
            {
              paddingTop: 84,
              paddingBottom: Math.max(insets.bottom + 120, 140),
              paddingHorizontal: dimensions.spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {events.map((event) => (
            <View key={event.id} style={styles.outerCardContainer}>
              <View style={styles.card}>
                <View style={styles.imageWrapper}>
                  <Image source={event.image} style={styles.cardImage} />
                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{event.date.month}</Text>
                    <Text style={styles.dateDay}>{event.date.day}</Text>
                  </View>
                  <View style={styles.statusTag}>
                    <Text style={styles.statusText}>{event.status}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={[styles.location, { color: textColor }]}>
                    {event.location}
                  </Text>
                  <View style={styles.tags}>
                    {event.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={[styles.tagText, { color: textColor }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[styles.description, { color: subText }]}>
                    {event.description}
                  </Text>

                  <View style={styles.ratingRow}>
                    {[...Array(5)].map((_, i) => (
                      <MaterialIcons key={i} name="star" size={12} color="#FFD700" />
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('Explore', { eventId: event.id });
                      }}
                      style={styles.exploreButtonWrapper}
                    >
                      <LinearGradient
                        colors={['#B15CDE', '#7952FC']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.exploreButton}
                      >
                        <Text style={styles.exploreText}>Explore</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ borderRadius: 12, overflow: 'hidden', width: 42, height: 42 }}
                      onPress={() => handleDeleteEvent(event.id)}
                    >
                      <LinearGradient
                        colors={['#B15CDE', '#7952FC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          flex: 1,
                          borderRadius: 9,
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            width: 38,
                            height: 38,
                            backgroundColor: '#111',
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DeleteIcon width={20} height={20} />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      <TouchableOpacity
        style={[
          styles.floatingPlus,
          {
            bottom: Math.max(insets.bottom + 80, 100),
            right: dimensions.spacing.xxl,
          },
        ]}
        onPress={addEvent}
        activeOpacity={0.8}
      >
        <RingIcon style={styles.floatingPlusRing} width={54} height={54} />
        <View style={styles.floatingPlusInnerCircle}>
          <Feather name="plus" size={32} color="#fff" style={styles.floatingPlusIcon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: 0.5,
    flex: 1,
    marginTop: 10,
  },
  headerIconButton: {
    borderWidth: 1,
    borderColor: '#a095c4',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    backgroundColor: '#111',
    minWidth: Math.max(width * 0.1, 40),
    minHeight: Math.max(width * 0.1, 40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  card: {
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.xxl,
  },
  imageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: dimensions.imageHeight,
    borderTopLeftRadius: dimensions.borderRadius.lg,
    borderTopRightRadius: dimensions.borderRadius.lg,
  },
  dateBox: {
    position: 'absolute',
    top: dimensions.spacing.md,
    left: dimensions.spacing.md,
    backgroundColor: '#333',
    borderRadius: dimensions.borderRadius.sm,
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    alignItems: 'center',
    minWidth: Math.max(width * 0.12, 45),
  },
  dateText: {
    color: '#fff',
    fontSize: dimensions.fontSize.tiny,
    fontWeight: '500',
  },
  dateDay: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: dimensions.fontSize.body,
  },
  statusTag: {
    position: 'absolute',
    bottom: dimensions.spacing.md,
    left: dimensions.spacing.md,
    backgroundColor: '#a95eff',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
    minHeight: 28,
    justifyContent: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: dimensions.fontSize.small,
    fontWeight: '500',
  },
  cardContent: {
    padding: dimensions.cardPadding,
  },
  location: {
    fontSize: dimensions.fontSize.title,
    fontWeight: '600',
    marginBottom: dimensions.spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: dimensions.spacing.sm,
  },
  tag: {
    display: 'flex',
    backgroundColor: 'transparent',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
    minHeight: 24,
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: dimensions.fontSize.tiny,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    lineHeight: Math.max(dimensions.fontSize.small + 5, 20),
    marginBottom: dimensions.spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: dimensions.spacing.lg,
    gap: dimensions.spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 0,
  },
  exploreButtonWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    marginRight: 9,
  },
  exploreButton: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    minWidth: 180,
    width: '100%',
  },
  exploreText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  floatingPlus: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 27,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  floatingPlusRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  floatingPlusIcon: {
    zIndex: 1,
  },
  floatingPlusInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B15CDE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outerCardContainer: {
    display: 'flex',
    minWidth: 240,
    maxWidth: 580,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: 20,
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(252,252,253,0.12)',
    marginBottom: 32,
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.10,
    shadowRadius: 64,
  },
});

export default EventScreen;