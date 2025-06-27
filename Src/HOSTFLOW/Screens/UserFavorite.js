// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   Dimensions
// } from 'react-native';
// import { useSelector, useDispatch } from 'react-redux';
// import { selectFavorites, toggleFavorite } from '../Redux/slices/favoritesSlice';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import LinearGradient from 'react-native-linear-gradient';

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
//     xxxl: Math.max(width * 0.08, 32),
//   },
//   fontSize: {
//     tiny: Math.max(width * 0.025, 10),
//     small: Math.max(width * 0.03, 12),
//     body: Math.max(width * 0.035, 14),
//     title: Math.max(width * 0.04, 16),
//     header: Math.max(width * 0.045, 18),
//     large: Math.max(width * 0.05, 20),
//     xlarge: Math.max(width * 0.055, 22),
//   },
//   borderRadius: {
//     sm: Math.max(width * 0.015, 6),
//     md: Math.max(width * 0.025, 10),
//     lg: Math.max(width * 0.04, 15),
//     xl: Math.max(width * 0.05, 20),
//     xxl: Math.max(width * 0.06, 24),
//   },
//   buttonHeight: Math.max(height * 0.06, 44),
//   iconSize: Math.max(width * 0.06, 20),
//   navIconSize: Math.max(width * 0.065, 24),
//   emptyIconSize: Math.max(width * 0.16, 64),
//   cardImageHeight: Math.max(height * 0.25, 200),
//   headerHeight: Math.max(height * 0.08, 60),
// };

// const UserFavoriteScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const favorites = useSelector(selectFavorites);
//   const insets = useSafeAreaInsets();

//   // Event data mapping (you can move this to a separate data file)
//   const eventData = {
//     'featured_event_1': {
//       title: 'Another Music Festival',
//       location: 'Some City, India',
//       image: require('../assets/Images/fff.jpg'),
//     },
//     'upcoming_event_1': {
//       title: 'Stand-up Comedy Night',
//       location: 'Comedy Club, City',
//       image: require('../assets/Images/rr.png'),
//     },
//     'upcoming_event_2': {
//       title: 'Basketball Game',
//       location: 'Sports Stadium, City',
//       image: require('../assets/Images/wall.jpg'),
//     },
//     'upcoming_event_3': {
//       title: 'Harmony Jam 2024',
//       location: 'Noida, India',
//       price: '₹25.00 -₹125.00',
//       image: require('../assets/Images/ffff.jpg'),
//     },
//     'upcoming_event_4': {
//       title: 'Rhythm Rally 2024',
//       location: 'Delhi, India',
//       price: '₹25.00 -₹125.00',
//       image: require('../assets/Images/px.png'),
//     },
//     'upcoming_event_5': {
//       title: 'Third Event Example',
//       location: 'Mumbai, India',
//       image: require('../assets/Images/pxx.png'),
//     },
//   };

//   const handleFavoriteToggle = (eventId) => {
//     dispatch(toggleFavorite(eventId));
//   };

//   const favoritedEvents = Object.entries(favorites)
//     .filter(([_, isFavorite]) => isFavorite)
//     .map(([eventId]) => eventId);

//   return (
//     <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={dimensions.navIconSize} color="#fff" />
//         </TouchableOpacity>
//         <View style={styles.headerTitleContainer}>
//           <Text style={styles.headerTitle}>My Favorites</Text>
//         </View>
//         <View style={{ width: dimensions.navIconSize }} />
//       </View>

//       <ScrollView 
//         style={styles.content}
//         contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
//         showsVerticalScrollIndicator={false}
//       >
//         {favoritedEvents.length === 0 ? (
//           <View style={styles.emptyState}>
//             <View style={styles.emptyStateIconContainer}>
//               <Ionicons name="heart-outline" size={dimensions.emptyIconSize} color="#555" />
//             </View>
//             <View style={styles.emptyStateTextContainer}>
//               <Text style={styles.emptyStateText}>No favorites yet</Text>
//               <Text style={styles.emptyStateSubText}>
//                 Add events to your favorites by tapping the heart icon
//               </Text>
//             </View>
//           </View>
//         ) : (
//           favoritedEvents.map((eventId) => {
//             const event = eventData[eventId];
//             if (!event) return null;

//             return (
//               <View key={eventId} style={styles.eventCard}>
//                 <LinearGradient
//                   colors={['#B15CDE', '#7952FC']}
//                   start={{ x: 0, y: 0 }}
//                   end={{ x: 1, y: 1 }}
//                   style={styles.eventCardGradient}
//                 />
//                 <View style={styles.eventCardContent}>
//                   <Image
//                     source={event.image}
//                     style={styles.eventImage}
//                     resizeMode="cover"
//                   />
//                   <View style={styles.imageOverlay} />
//                   <View style={styles.heartIconContainer}>
//                     <TouchableOpacity
//                       onPress={() => handleFavoriteToggle(eventId)}
//                       style={styles.heartIconButton}
//                     >
//                       <Ionicons name="heart" size={dimensions.navIconSize} color="#ff4444" />
//                     </TouchableOpacity>
//                   </View>
//                   <View style={styles.eventDetails}>
//                     <TouchableOpacity 
//                       onPress={() => navigation.navigate('UserFormBookingScreen', { eventDetails: event })}
//                       style={styles.eventDetailsTouchable}
//                     >
//                       <Text style={styles.eventTitle}>{event.title}</Text>
//                       {event.price && (
//                         <Text style={styles.eventPrice}>{event.price}</Text>
//                       )}
//                       <Text style={styles.eventLocation}>{event.location}</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             );
//           })
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: dimensions.spacing.lg,
//     paddingVertical: dimensions.spacing.md,
//     borderBottomWidth: 1,
//     borderColor: '#333',
//     minHeight: dimensions.headerHeight,
//   },
//   backButton: {
//     minWidth: dimensions.buttonHeight,
//     minHeight: dimensions.buttonHeight,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: dimensions.borderRadius.md,
//     padding: dimensions.spacing.sm,
//   },
//   headerTitleContainer: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: dimensions.fontSize.header,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   content: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: dimensions.spacing.lg,
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: Math.max(height * 0.15, 100),
//     paddingHorizontal: dimensions.spacing.xl,
//   },
//   emptyStateIconContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: dimensions.spacing.xl,
//   },
//   emptyStateTextContainer: {
//     alignItems: 'center',
//   },
//   emptyStateText: {
//     fontSize: dimensions.fontSize.large,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: dimensions.spacing.sm,
//   },
//   emptyStateSubText: {
//     fontSize: dimensions.fontSize.body,
//     color: '#aaa',
//     textAlign: 'center',
//     lineHeight: Math.max(dimensions.fontSize.body + 4, 18),
//     paddingHorizontal: dimensions.spacing.xl,
//   },
//   eventCard: {
//     marginBottom: dimensions.spacing.lg,
//     borderRadius: dimensions.borderRadius.lg,
//     overflow: 'hidden',
//     position: 'relative',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   eventCardGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   eventCardContent: {
//     position: 'relative',
//   },
//   eventImage: {
//     width: '100%',
//     height: dimensions.cardImageHeight,
//   },
//   imageOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.4)',
//   },
//   heartIconContainer: {
//     position: 'absolute',
//     top: dimensions.spacing.lg,
//     right: dimensions.spacing.lg,
//     zIndex: 2,
//   },
//   heartIconButton: {
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: dimensions.borderRadius.lg,
//     padding: dimensions.spacing.sm,
//     minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
//     minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   eventDetails: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: dimensions.spacing.lg,
//     zIndex: 2,
//   },
//   eventDetailsTouchable: {
//     width: '100%',
//     minHeight: Math.max(dimensions.buttonHeight * 1.5, 60),
//     justifyContent: 'flex-end',
//   },
//   eventTitle: {
//     fontSize: dimensions.fontSize.header,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: dimensions.spacing.xs,
//     lineHeight: Math.max(dimensions.fontSize.header + 2, 20),
//   },
//   eventPrice: {
//     fontSize: dimensions.fontSize.body,
//     color: '#a95eff',
//     marginBottom: dimensions.spacing.xs,
//     fontWeight: '600',
//   },
//   eventLocation: {
//     fontSize: dimensions.fontSize.body,
//     color: '#aaa',
//     lineHeight: Math.max(dimensions.fontSize.body + 2, 16),
//   },
// });

// export default UserFavoriteScreen; 



//  code by sonu :


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFavorites,
  toggleFavorite,
} from "../Redux/slices/favoritesSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useEffect, useState } from "react";
import api from "../Config/api"; // your configured axios instance

const { width, height } = Dimensions.get("window");

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
    xxxl: Math.max(width * 0.08, 32),
  },
  fontSize: {
    tiny: Math.max(width * 0.025, 10),
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
    large: Math.max(width * 0.05, 20),
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.05, 20),
    xxl: Math.max(width * 0.06, 24),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  navIconSize: Math.max(width * 0.065, 24),
  emptyIconSize: Math.max(width * 0.16, 64),
  cardImageHeight: Math.max(height * 0.25, 200),
  headerHeight: Math.max(height * 0.08, 60),
};

const UserFavoriteScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const insets = useSafeAreaInsets();
  const token = useSelector((state) => state.auth.token);
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavoriteEvents = async () => {
      setLoading(true);
      try {
        const response = await api.get("/user/get-favourite-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Favorite events response xxxxx:", response.data);

        if (response.data.success && Array.isArray(response.data.data)) {
          // setFavoriteEvents(response?.data?.data);

          setFavoriteEvents(response?.data?.data?.filter((e) => e !== null));

        } else {
          console.warn("Failed to fetch favorites:", response.data.message);
        }
      } catch (error) {
        console.error(
          "Error fetching favorites:",
          error?.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteEvents();
  }, [token]);

  console.log("Favorite events:", favoriteEvents);

  // const handleFavoriteToggle = (eventId) => {
  //   dispatch(toggleFavorite(eventId));
  // };

  const handleFavoriteToggle = async (eventId) => {
    console.log("Toggling favorite for event ID:", eventId);
    try {
      const response = await api.delete("/user/delete-favourite-event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          eventId,
        },
      });

      if (response.data?.success) {
        setFavoriteEvents((prevEvents) =>
          prevEvents.filter((event) => event._id !== eventId)
        );
      } else {
        console.warn("Failed to remove favorite:", response.data?.message);
      }
    } catch (error) {
      console.error(
        "Error removing favorite:",
        error?.response?.data || error.message
      );
    }
  };

  const favoritedEvents = Object.entries(favorites)
    .filter(([_, isFavorite]) => isFavorite)
    .map(([eventId]) => eventId);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            name="arrow-back"
            size={dimensions.navIconSize}
            color="#fff"
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>My Favorites </Text>
        </View>
        <View style={{ width: dimensions.navIconSize }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 20, 40) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
            Loading favorite events...
          </Text>
        ) : favoriteEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIconContainer}>
              <Ionicons
                name="heart-outline"
                size={dimensions.emptyIconSize}
                color="#555"
              />
            </View>
            <View style={styles.emptyStateTextContainer}>
              <Text style={styles.emptyStateText}>No favorites yet</Text>
              <Text style={styles.emptyStateSubText}>
                Add events to your favorites by tapping the heart icon
              </Text>
            </View>
          </View>
        ) : (
          favoriteEvents
            .filter((event) => event !== null && typeof event === "object")
            .map((event) => (
              <View key={event?._id} style={styles?.eventCard}>
                <LinearGradient
                  colors={["#B15CDE", "#7952FC"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.eventCardGradient}
                />
                <View style={styles.eventCardContent}>
                  <Image
                    source={{ uri: event?.posterUrl }}
                    style={styles.eventImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageOverlay} />
                  <View style={styles.heartIconContainer}>
                    <TouchableOpacity
                      onPress={() => handleFavoriteToggle(event?._id)}
                      style={styles.heartIconButton}
                    >
                      <Ionicons
                        name="heart"
                        size={dimensions.navIconSize}
                        color="#ff4444"
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.eventDetails}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("UserFormBookingScreen", {
                          eventDetails: event,
                        })
                      }
                      style={styles.eventDetailsTouchable}
                    >
                      <Text style={styles.eventTitle}>{event?.eventName}</Text>
                      {event?.price && (
                        <Text style={styles.eventPrice}>{event?.price}</Text>
                      )}
                      <Text style={styles.eventLocation}>{event?.venue}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: "#333",
    minHeight: dimensions.headerHeight,
  },
  backButton: {
    minWidth: dimensions.buttonHeight,
    minHeight: dimensions.buttonHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: dimensions.spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Math.max(height * 0.15, 100),
    paddingHorizontal: dimensions.spacing.xl,
  },
  emptyStateIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: dimensions.spacing.xl,
  },
  emptyStateTextContainer: {
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: dimensions.fontSize.large,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: dimensions.spacing.sm,
  },
  emptyStateSubText: {
    fontSize: dimensions.fontSize.body,
    color: "#aaa",
    textAlign: "center",
    lineHeight: Math.max(dimensions.fontSize.body + 4, 18),
    paddingHorizontal: dimensions.spacing.xl,
  },
  eventCard: {
    marginBottom: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  eventCardContent: {
    position: "relative",
  },
  eventImage: {
    width: "100%",
    height: dimensions.cardImageHeight,
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  heartIconContainer: {
    position: "absolute",
    top: dimensions.spacing.lg,
    right: dimensions.spacing.lg,
    zIndex: 2,
  },
  heartIconButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.sm,
    minWidth: Math.max(dimensions.buttonHeight * 0.8, 36),
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 36),
    justifyContent: "center",
    alignItems: "center",
  },
  eventDetails: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: dimensions.spacing.lg,
    zIndex: 2,
  },
  eventDetailsTouchable: {
    width: "100%",
    minHeight: Math.max(dimensions.buttonHeight * 1.5, 60),
    justifyContent: "flex-end",
  },
  eventTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: dimensions.spacing.xs,
    lineHeight: Math.max(dimensions.fontSize.header + 2, 20),
  },
  eventPrice: {
    fontSize: dimensions.fontSize.body,
    color: "#a95eff",
    marginBottom: dimensions.spacing.xs,
    fontWeight: "600",
  },
  eventLocation: {
    fontSize: dimensions.fontSize.body,
    color: "#aaa",
    lineHeight: Math.max(dimensions.fontSize.body + 2, 16),
  },
});

export default UserFavoriteScreen;
 

