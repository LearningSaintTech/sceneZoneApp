import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import PlayIcon from '../assets/icons/play';

const HostPerfomanceDetailsScreen = ({ navigation }) => {
  // Sample data for performance items (based on the image)
  const performanceData = [
    {
      id: '1',
      image: require('../assets/Images/perf1.png'),
      title: 'Melodies Ablaze',
      genres: ['Rock', 'Classical', 'Jazz', 'Piano'],
      instruments: ['Guitar'],
      rating: 4, // Out of 5 stars
    },
     {
      id: '2',
      image: require('../assets/Images/perf2.jpg'),
      title: 'Melodies Ablaze',
      genres: ['Rock', 'Classical', 'Jazz', 'Piano'],
      instruments: ['Guitar'],
      rating: 4, // Out of 5 stars
    },
    {
      id: '3',
      image: require('../assets/Images/perf1.png'),
      title: 'Melodies Ablaze',
      genres: ['Rock', 'Classical', 'Jazz', 'Piano'],
      instruments: ['Guitar'],
      rating: 4, // Out of 5 stars
    },
    {
      id: '4',
      image: require('../assets/Images/perf2.jpg'),
      title: 'Melodies Ablaze',
      genres: ['Rock', 'Classical', 'Jazz', 'Piano'],
      instruments: ['Guitar'],
      rating: 4, // Out of 5 stars
    },
    // Add more performance items if needed
  ];

  const renderPills = (items) => (
    <View style={styles.pillContainer}>
      {items.map((item, index) => (
        <View key={index} style={styles.pill}>
          <Text style={styles.pillText}>{item}</Text>
        </View>
      ))}
    </View>
  );

   const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
          size={16}
          color={'#ffc107'} // Yellow color for stars
          style={styles.starIcon}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderPerformanceCard = (item) => (
    <View key={item.id} style={{ alignItems: 'center', width: '100%' }}>
      <View style={styles.performanceCard}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.performanceImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.playButton}>
          <PlayIcon width={44} height={44} />
        </TouchableOpacity>
      </View>
      </View>
      {/* Title below card */}
      <Text style={styles.performanceTitle}>{item.title}</Text>
      {/* Genres as pills below title */}
      <View style={styles.pillRow}>{renderPills(item.genres)}</View>
      {/* Star rating below pills */}
      <View style={styles.starRow}>{renderStars(4)}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">Performance</Text>
        <View style={{ width: 24 }} />{/* Placeholder to balance header */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {performanceData.map(renderPerformanceCard)}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center', // Center the cards horizontally
  },
  performanceCard: {
    display: 'flex',
    width: 345,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: '#121212',
    marginTop: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  performanceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22, // Half of the icon height (44/2)
    marginLeft: -22, // Half of the icon width (44/2)
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  pill: {
    display: 'flex',
    backgroundColor: 'transparent',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
    paddingVertical: 2,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  pillText: {
    color: '#E4E4E7',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  starIcon: {
    marginRight: 2, // Space between stars
  },
  performanceTitle: {
    color: '#FCFCFD',
    textAlign: 'left',
    fontFamily: 'Inter',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.2,
    alignSelf: 'flex-start',
    width: '100%',
  },
  pillRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
  },
  starRow: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 8,
    flexDirection: 'row',
  },
});

export default HostPerfomanceDetailsScreen; 