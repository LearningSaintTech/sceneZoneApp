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
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PlayIcon from '../assets/icons/play';

const HostPerfomanceDetailsScreen = ({ navigation, route }) => {
  const artist = route?.params?.artist;
  console.log('HostPerfomanceDetailsScreen artist:', artist);

  if (!artist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">
            Performance
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', marginTop: 40 }}>No artist data provided</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderPills = (items) => {
    const genres = Array.isArray(items) ? items : [];
    return (
      <View style={styles.pillContainer}>
        {genres.length > 0 ? (
          genres.map((item, index) => (
            <View key={index} style={styles.pill}>
              <Text style={styles.pillText}>{item}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.pillText}>No genre</Text>
        )}
      </View>
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const avgRating = rating || 0;
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < avgRating ? 'star' : 'star-outline'}
          size={16}
          color={'#ffc107'}
          style={styles.starIcon}
        />
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderPerformanceCard = (item, idx) => (
    <View key={idx} style={{ alignItems: 'center', width: '100%' }}>
      <View style={styles.performanceCard}>
        <View style={styles.imageContainer}>
          {item.videoUrl ? (
            <>
              <Image
                source={{ uri: artist.profileImageUrl || 'https://via.placeholder.com/345x230' }}
                style={styles.performanceImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => {
                  if (item.videoUrl) {
                    Linking.openURL(item.videoUrl).catch(() =>
                      Alert.alert('Error', 'Unable to open video URL')
                    );
                  }
                }}
              >
                <PlayIcon width={44} height={44} />
              </TouchableOpacity>
            </>
          ) : (
            <Image
              source={{ uri: artist.profileImageUrl || 'https://via.placeholder.com/345x230' }}
              style={styles.performanceImage}
              resizeMode="cover"
            />
          )}
        </View>
      </View>
      <Text style={styles.performanceTitle}>{item.venueName}</Text>
      <View style={styles.pillRow}>{renderPills([item.genre])}</View>
      <View style={styles.starRow}>{renderStars(artist.Rating)}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">
          {artist.artistType || 'Performance'}
        </Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Artist Profile Section */}
        <View style={styles.artistProfileContainer}>
          <Image
            source={{ uri: artist.profileImageUrl || 'https://via.placeholder.com/100' }}
            style={styles.artistImage}
          />
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>{artist.email.split('@')[0]}</Text>
            <Text style={styles.artistDetails}>
              {artist.artistType} • {artist.artistSubType} • {artist.instrument}
            </Text>
            <Text style={styles.artistDetails}>Budget: ${artist.budget}</Text>
            <Text style={styles.artistDetails}>Location: {artist.address}</Text>
            {artist.isCrowdGuarantee && (
              <Text style={styles.crowdGuaranteeText}>Crowd Guarantee</Text>
            )}
          </View>
        </View>

        {/* Performances Section */}
        <Text style={styles.sectionTitle}>Performances</Text>
        {artist.performanceUrlId && artist.performanceUrlId.length > 0 ? (
          artist.performanceUrlId.map(renderPerformanceCard)
        ) : (
          <Text style={{ color: '#fff', marginTop: 20 }}>No performances found.</Text>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
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
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: 0,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  artistProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    width: '100%',
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    color: '#FCFCFD',
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  artistDetails: {
    color: '#E4E4E7',
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  crowdGuaranteeText: {
    color: '#a95eff',
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FCFCFD',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 16,
    width: '100%',
  },
  performanceCard: {
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
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -22,
    marginLeft: -22,
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
    fontWeight: '500',
    lineHeight: 16,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  starIcon: {
    marginRight: 2,
  },
  performanceTitle: {
    color: '#FCFCFD',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  pillRow: {
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