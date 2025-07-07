// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
//   SafeAreaView,
//   Dimensions,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import Feather from 'react-native-vector-icons/Feather';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';

// const { width } = Dimensions.get('window');

// const dummyTickets = [
//   {
//     id: '1234567890',
//     title: 'Harmony Festival 2025',
//     date: 'Sep 20',
//     image: 'https://images.app.goo.gl/iSFwLwB3HMurwGNV7',
//   },
//   {
//     id: '0987654321',
//     title: 'Unity Fest 2025',
//     date: 'Sep 20',
//     image: 'https://images.app.goo.gl/iSFwLwB3HMurwGNV7',
//   },
//   {
//     id: '1122334455',
//     title: 'November Bash',
//     date: 'Nov 30',
//     image: 'https://images.app.goo.gl/iSFwLwB3HMurwGNV7',
//   },
// ];

// const HostAllTicket = ({ navigation }) => {
//   const insets = useSafeAreaInsets();

//   return (
//     <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Feather name="arrow-left" size={22} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Ticket Settings</Text>
//         <View style={{ width: 22 }} />
//       </View>

//       {/* Ticket Cards */}
//       <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
//         {dummyTickets.map((ticket) => (
//           <TouchableOpacity key={ticket.id} style={styles.card} activeOpacity={0.9}>
//             <Image source={ticket.image} style={styles.cardImage} resizeMode="cover" />
//             <View style={styles.dateBadge}>
//               <Text style={styles.dateText}>{ticket.date}</Text>
//             </View>
//             <TouchableOpacity style={styles.heartIcon}>
//               <FontAwesome name="heart-o" size={16} color="#fff" />
//             </TouchableOpacity>
//             <View style={styles.cardContent}>
//               <Text style={styles.cardTitle}>{ticket.title}</Text>
//               <Text style={styles.cardSubtitle}>Ticket ID: #{ticket.id}</Text>
//             </View>
//             <TouchableOpacity style={styles.arrowCircle}>
//               <Feather name="chevron-right" size={16} color="#fff" />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default HostAllTicket;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#111018',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderColor: '#2D2D3A',
//     justifyContent: 'space-between',
//   },
//   headerTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   scrollViewContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   card: {
//     backgroundColor: '#1A1A1F',
//     borderRadius: 16,
//     marginBottom: 18,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   cardImage: {
//     width: '100%',
//     height: width * 0.5,
//     borderTopLeftRadius: 16,
//     borderTopRightRadius: 16,
//   },
//   dateBadge: {
//     position: 'absolute',
//     top: 12,
//     left: 12,
//     backgroundColor: '#0A0A0E',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 6,
//     zIndex: 2,
//   },
//   dateText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   heartIcon: {
//     position: 'absolute',
//     top: 12,
//     right: 12,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     padding: 6,
//     borderRadius: 20,
//     zIndex: 2,
//   },
//   cardContent: {
//     padding: 14,
//   },
//   cardTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   cardSubtitle: {
//     color: '#b3b3cc',
//     fontSize: 12,
//   },
//   arrowCircle: {
//     position: 'absolute',
//     bottom: 16,
//     right: 16,
//     backgroundColor: '#24242D',
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });



import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

const dummyTickets = [
  {
    id: '1234567890',
    title: 'Harmony Festival 2025',
    date: 'Sep 20',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?fit=crop&w=800&q=60',
  },
 
  {
    id: '1122334455',
    title: 'November Bash',
    date: 'Nov 30',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?fit=crop&w=800&q=60',
  },
 
  {
    id: '1122334456',
    title: 'November Bash',
    date: 'Nov 30',
    image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?fit=crop&w=800&q=60',
  },
];

const HostAllTicket = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Settings</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Ticket Cards */}
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {dummyTickets.map((ticket) => (
          <TouchableOpacity key={ticket.id} style={styles.card} activeOpacity={0.9}>
            <Image source={{ uri: ticket.image }} style={styles.cardImage} resizeMode="cover" />
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{ticket.date}</Text>
            </View>
            <TouchableOpacity style={styles.heartIcon}>
              <FontAwesome name="heart-o" size={16} color="#fff" />
            </TouchableOpacity>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{ticket.title}</Text>
              <Text style={styles.cardSubtitle}>Ticket ID: #{ticket.id}</Text>
            </View>
            <TouchableOpacity style={styles.arrowCircle}>
              <Feather name="chevron-right" size={16} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HostAllTicket;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111018',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#2D2D3A',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1A1A1F',
    borderRadius: 16,
    marginBottom: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: width * 0.5,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#0A0A0E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 2,
  },
  dateText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  heartIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 6,
    borderRadius: 20,
    zIndex: 2,
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#b3b3cc',
    fontSize: 12,
  },
  arrowCircle: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#24242D',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

