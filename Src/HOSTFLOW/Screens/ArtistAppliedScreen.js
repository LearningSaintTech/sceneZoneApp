// import React from 'react';
// import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Icon from 'react-native-vector-icons/Feather';
// import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for trash icon
// import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome for star icon

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
//     large: Math.max(width * 0.05, 20),
//   },
//   borderRadius: {
//     sm: Math.max(width * 0.015, 5),
//     md: Math.max(width * 0.025, 10),
//     lg: Math.max(width * 0.04, 16),
//     xl: Math.max(width * 0.05, 20),
//   },
//   buttonHeight: Math.max(height * 0.06, 44),
//   iconSize: Math.max(width * 0.06, 20),
//   cardImageHeight: Math.max(height * 0.18, 150),
//   cardPadding: Math.max(width * 0.03, 12),
//   headerHeight: Math.max(height * 0.08, 60),
// };

// const appliedRequestsData = [
//   {
//     id: '1',
//     location: 'Noida',
//     budget: '$400-$500',
//     time: '09:30 AM',
//     genres: ['Drums', 'Violin', 'Saxophone', 'Harp', 'Ukulele'],
//     rating: 4,
//     status: 'pending',
//   },
//   {
//     id: '2',
//     location: 'Delhi',
//     budget: '$400-$500',
//     time: '09:30 AM',
//     genres: ['Piano', 'Guitar', 'Vocals'],
//     rating: 4,
//     status: 'pending',
//   },
//   // Add more placeholder data here
// ];

// const ArtistAppliedScreen = ({ navigation }) => {
//   const insets = useSafeAreaInsets();

//   const renderAppliedItem = ({ item }) => {
//     return (
//       <View style={styles.card}>
//         <View style={styles.cardImageContainer}>
//           <View style={styles.dateBox}>
//             <Text style={styles.dateText}>Aug</Text>
//             <Text style={styles.dateText}>15</Text>
//           </View>
//           <TouchableOpacity style={styles.heartIcon}>
//              <Icon name="heart" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#fff" />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.cardContent}>
//           <View style={styles.cardRow}>
//             <Text style={styles.locationText}>{item.location}</Text>
//             <Text style={styles.timeText}>{item.time}</Text>
//           </View>
//           <Text style={styles.budgetText}>{item.budget}</Text>
//           <View style={styles.genresContainer}>
//             {item.genres.map((genre, index) => (
//               <View key={index} style={styles.genreTag}>
//                 <Text style={styles.genreText}>{genre}</Text>
//               </View>
//             ))}
//           </View>
//           <View style={styles.starRating}>
//             {[...Array(5)].map((_, i) => (
//               <FontAwesome
//                 key={i}
//                 name={i < item.rating ? 'star' : 'star-o'}
//                 size={Math.max(dimensions.iconSize * 0.7, 14)}
//                 color={i < item.rating ? '#ffc107' : '#aaa'}
//                 style={{ marginRight: dimensions.spacing.xs }}
//               />
//             ))}
//           </View>
//           <View style={styles.buttonRow}>
//             <TouchableOpacity style={styles.requestPendingButton}>
//               <Text style={styles.requestPendingText}>Request Pending</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.deleteButton}>
//               <Ionicons name="trash-outline" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
//       <View style={styles.header}>
//          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-left" size={dimensions.iconSize} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Applied</Text>
//         <View style={{ width: dimensions.iconSize }} />
//       </View>
//       <FlatList
//         data={appliedRequestsData}
//         renderItem={renderAppliedItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
//         showsVerticalScrollIndicator={false}
//       />
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
//     borderBottomColor: '#333',
//     minHeight: dimensions.headerHeight,
//   },
//   backButton: {
//     minWidth: dimensions.iconSize,
//     minHeight: dimensions.iconSize,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: dimensions.spacing.xs,
//   },
//   headerTitle: {
//     fontSize: dimensions.fontSize.header,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   listContent: {
//     paddingHorizontal: dimensions.spacing.lg,
//     paddingVertical: dimensions.spacing.md,
//   },
//   card: {
//     backgroundColor: '#1a1a1a',
//     borderRadius: 20,
//     marginBottom: dimensions.spacing.md,
//     overflow: 'visible',
//     borderWidth: 1,
//     borderColor: '#404040',
//     padding: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.08,
//     shadowRadius: 16,
//     elevation: 4,
//   },
//   cardImageContainer: {
//     width: '100%',
//     height: dimensions.cardImageHeight,
//     backgroundColor: '#333',
//     justifyContent: 'flex-end',
//     padding: dimensions.cardPadding,
//     position: 'relative',
//     borderRadius: 20,
//     overflow: 'hidden',
    
//   },
//   cardContent: {
//     padding: dimensions.cardPadding,
//   },
//   cardRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: dimensions.spacing.xs,
//     alignItems: 'center',
//   },
//   locationText: {
//     fontSize: dimensions.fontSize.header,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   timeText: {
//     fontSize: dimensions.fontSize.body,
//     color: '#aaa',
//   },
//   budgetText: {
//     fontSize: dimensions.fontSize.title,
//     color: '#a95eff',
//     marginBottom: dimensions.spacing.sm,
//     fontWeight: '400',
//   },
//   genresContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: dimensions.spacing.sm,
//     gap: dimensions.spacing.xs,
//   },
//   genreTag: {
//     display: 'flex',
//     paddingVertical: 2,
//     paddingHorizontal: 8,
//     alignItems: 'center',
//     gap: 4,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#3F3F46',
//     backgroundColor: 'transparent',
//     marginRight: dimensions.spacing.sm,
//     marginBottom: dimensions.spacing.xs,
//   },
//   genreText: {
//     fontSize: dimensions.fontSize.small,
//     color: '#fff',
//     fontWeight: '500',
//   },
//   starRating: {
//     flexDirection: 'row',
//     marginBottom: dimensions.spacing.md,
//     alignItems: 'center',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: dimensions.spacing.sm,
//   },
//   requestPendingButton: {
//     display: 'flex',
//     paddingTop: 4,
//     paddingBottom: 4,
//     paddingLeft: 12,
//     paddingRight: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 4,
//     flex: 1,
//     alignSelf: 'stretch',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#FF9500',
//   },
//   requestPendingText: {
//     color: '#FF9500',
//     fontFamily: 'Inter',
//     fontSize: 14,
//     fontStyle: 'normal',
//     fontWeight: '500',
//     lineHeight: 20,
//     fontFeatureSettings: "'salt' on",
//   },
//   deleteButton: {
//     backgroundColor: '#dc3545',
//     borderRadius: dimensions.borderRadius.sm,
//     padding: dimensions.spacing.md,
//     justifyContent: 'center',
//     alignItems: 'center',
//     minWidth: dimensions.buttonHeight,
//     minHeight: dimensions.buttonHeight,
//   },
//   dateBox: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: dimensions.borderRadius.sm,
//     padding: dimensions.spacing.xs,
//     position: 'absolute',
//     bottom: dimensions.spacing.md,
//     left: dimensions.spacing.md,
//     minWidth: Math.max(width * 0.12, 45),
//     alignItems: 'center',
//   },
//   dateText: {
//     fontSize: dimensions.fontSize.small,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   heartIcon: {
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     borderRadius: dimensions.borderRadius.md,
//     padding: dimensions.spacing.sm,
//     position: 'absolute',
//     top: dimensions.spacing.md,
//     right: dimensions.spacing.md,
//     minWidth: Math.max(width * 0.08, 32),
//     minHeight: Math.max(width * 0.08, 32),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ArtistAppliedScreen; 








import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { removeAppliedEvent } from '../Redux/slices/appliedSlice';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for trash icon
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Assuming FontAwesome for star icon
import ArtistBottomNavBar from '../Components/ArtistBottomNavBar';
import LinearGradient from 'react-native-linear-gradient';
import AppliedIcon from '../assets/icons/Applied';

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
    large: Math.max(width * 0.05, 20),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 5),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.05, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  cardImageHeight: Math.max(height * 0.18, 150),
  cardPadding: Math.max(width * 0.03, 12),
  headerHeight: Math.max(height * 0.08, 60),
};

const ArtistAppliedScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('applied');
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const appliedEvents = useSelector(state => state.applied.appliedEvents);

  const renderAppliedItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardImageContainer}>
          <Image source={item.image} style={styles.cardImage} />
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{item.dateMonth}</Text>
            <Text style={styles.dateText}>{item.dateDay}</Text>
          </View>
          <TouchableOpacity style={styles.heartIcon}>
             <Icon name="heart" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
          <Text style={styles.budgetText}>{item.budget}</Text>
          <View style={styles.genresContainer}>
            {item.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
          <View style={styles.starRating}>
            {[...Array(5)].map((_, i) => (
              <FontAwesome
                key={i}
                name={i < item.rating ? 'star' : 'star-o'}
                size={Math.max(dimensions.iconSize * 0.7, 14)}
                color={i < item.rating ? '#ffc107' : '#aaa'}
                style={{ marginRight: dimensions.spacing.xs }}
              />
            ))}
          </View>
          <View style={styles.buttonRow}>
            {item.status === 'pending' && (
              <TouchableOpacity style={styles.requestPendingButton}>
                <Text style={styles.requestPendingText}>Request Pending</Text>
              </TouchableOpacity>
            )}
            {item.status === 'approved' && (
              <TouchableOpacity style={styles.requestApprovedButton}>
                <Text style={styles.requestApprovedText}>Request Approved</Text>
              </TouchableOpacity>
            )}
            {item.status === 'canceled' && (
              <TouchableOpacity style={styles.requestCanceledButton}>
                <Text style={styles.requestCanceledText}>Request Canceled</Text>
              </TouchableOpacity>
            )}
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.deleteButtonGradient}
            >
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(removeAppliedEvent(id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applied</Text>
        <View style={{ width: dimensions.iconSize }} />
      </View>
      {/* Tab Buttons for Applied and Saved */}
      <View style={styles.tabHeader}>
        {activeTab === 'applied' ? (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.tabButton, styles.activeTabButton]}
          >
            <TouchableOpacity
              style={styles.tabTouchable}
              onPress={() => setActiveTab('applied')}
              activeOpacity={1}
            >
              <Text style={styles.tabButtonTextActive}>Applied</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.tabButton, styles.inactiveTabButton]}
            onPress={() => setActiveTab('applied')}
          >
            <Text style={styles.tabButtonTextInactive}>Applied</Text>
          </TouchableOpacity>
        )}

        {activeTab === 'saved' ? (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={[styles.tabButton, styles.activeTabButton]}
          >
            <TouchableOpacity
              style={styles.tabTouchable}
              onPress={() => setActiveTab('saved')}
              activeOpacity={1}
            >
              <Text style={styles.tabButtonTextActive}>Saved</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.tabButton, styles.inactiveTabButton]}
            onPress={() => setActiveTab('saved')}
          >
            <Text style={styles.tabButtonTextInactive}>Saved</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={appliedEvents}
        renderItem={renderAppliedItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          activeTab === 'applied' ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <AppliedIcon width={60} height={60} />
              </View>
              <Text style={styles.emptyTitle}>No Applied Events</Text>
              <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => navigation.navigate('ArtistHome')}
              >
                <LinearGradient
                  colors={['#B15CDE', '#7952FC']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={styles.exploreButtonGradient}
                >
                  <Text style={styles.exploreButtonText}>Explore Events</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )
        }
      />
      <ArtistBottomNavBar
        navigation={navigation}
        insets={insets}
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    minHeight: dimensions.headerHeight,
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#C6C5ED',
    marginRight:220,
    
  },
  listContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    marginBottom: dimensions.spacing.md,
    overflow: 'visible',
    borderWidth: 1,
    borderColor: '#404040',
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardImageContainer: {
    width: '92%',
    height: dimensions.cardImageHeight,
    backgroundColor: '#333',
    justifyContent: 'flex-end',
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 13,
    marginTop: 20,
    marginBottom: 18,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: dimensions.cardPadding,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.xs,
  },
  locationText: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeText: {
    color: '#7952FC',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    fontFeatureSettings: "'salt' on",
  },
  budgetText: {
    fontSize: dimensions.fontSize.title,
    color: '#a95eff',
    marginBottom: dimensions.spacing.sm,
    fontWeight: '400',
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: dimensions.spacing.sm,
    gap: dimensions.spacing.xs,
  },
  genreTag: {
    display: 'flex',
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
    backgroundColor: 'transparent',
    marginRight: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.xs,
  },
  genreText: {
    fontSize: dimensions.fontSize.small,
    color: '#fff',
    fontWeight: '500',
  },
  starRating: {
    flexDirection: 'row',
    marginBottom: dimensions.spacing.md,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacing.sm,
  },
  requestPendingButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  requestPendingText: {
    color: '#FF9500',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  requestApprovedButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00C853',
  },
  requestApprovedText: {
    color: '#00C853',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  requestCanceledButton: {
    display: 'flex',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  requestCanceledText: {
    color: '#FF3B30',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  deleteButtonGradient: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 0,
    margin: 0,
  },
  dateBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: dimensions.borderRadius.sm,
    padding: dimensions.spacing.xs,
    position: 'absolute',
    bottom: dimensions.spacing.md,
    left: dimensions.spacing.md,
    minWidth: Math.max(width * 0.12, 45),
    alignItems: 'center',
  },
  dateText: {
    fontSize: dimensions.fontSize.small,
    color: '#fff',
    fontWeight: 'bold',
  },
  heartIcon: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    position: 'absolute',
    top: dimensions.spacing.md,
    right: dimensions.spacing.md,
    minWidth: Math.max(width * 0.08, 32),
    minHeight: Math.max(width * 0.08, 32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    marginBottom: dimensions.spacing.md,
  },
  emptyTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: dimensions.spacing.sm,
  },
  emptySubtitle: {
    fontSize: dimensions.fontSize.body,
    color: '#aaa',
  },
  exploreButton: {
    display: 'flex',
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    marginTop: dimensions.spacing.lg,
  },
  exploreButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  exploreButtonText: {
    color: '#fff',
    fontFamily: 'Inter',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 20,
    fontFeatureSettings: "'salt' on",
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
    gap: 12, // gap between buttons
  },
  tabButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
    shadowColor: 'rgba(177, 92, 222, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  activeTabButton: {
    borderWidth: 0,
  },
  inactiveTabButton: {
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
  },
  tabTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonTextActive: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
  tabButtonTextInactive: {
    color: '#B15CDE',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 21,
  },
});

export default ArtistAppliedScreen; 