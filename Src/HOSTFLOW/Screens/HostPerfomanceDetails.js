import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import PlayIcon from '../assets/icons/play';
import axios from 'axios';
import { useSelector } from 'react-redux';

const HostPerfomanceDetailsScreen = ({ navigation, route }) => {
  const artist = route?.params?.artist;
  console.log("artist",artist);
  const token = useSelector((state) => state.auth.token);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Log incoming artist data
  console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] Received artist:`, JSON.stringify(artist, null, 2));

  // Fetch performance details
  useEffect(() => {
    const fetchPerformances = async () => {
      if (!artist || !artist.artistId || !token) {
        console.log(`[${new Date().toISOString()}] [fetchPerformances] Missing required data:`, {
          artistId: artist?.artistId,
          token: !!token,
        });
        setPerformances([]);
        return;
      }

      setIsLoading(true);
      console.log(`[${new Date().toISOString()}] [fetchPerformances] Fetching performances for artistId: ${artist.artistId}`);
      console.log(`[${new Date().toISOString()}] [fetchPerformances] Token: ${token}`);

      try {
        const response = await axios.get(`http://192.168.1.52:3000/api/artist/get-artist-performance/${artist.artistId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        });

        console.log(`[${new Date().toISOString()}] [fetchPerformances] API Response:`, JSON.stringify(response.data, null, 2));

        if (response.data.success) {
          const performanceData = response.data.data || [];
          console.log(`[${new Date().toISOString()}] [fetchPerformances] Parsed performance data:`, JSON.stringify(performanceData, null, 2));
          setPerformances(performanceData);
        } else {
          console.log(`[${new Date().toISOString()}] [fetchPerformances] API returned success=false:`, response.data.message);
          setPerformances([]);
          Alert.alert('Error', response.data.message || 'Failed to fetch performances.');
        }
      } catch (error) {
        console.error(`[${new Date().toISOString()}] [fetchPerformances] Error fetching performances:`, {
          message: error.message,
          status: error.response?.status,
          response: error.response ? JSON.stringify(error.response.data, null, 2) : null,
        });
        setPerformances([]);
        Alert.alert('Error', 'Failed to fetch performance details. Please try again.');
      } finally {
        setIsLoading(false);
        console.log(`[${new Date().toISOString()}] [fetchPerformances] Fetch complete, isLoading: false`);
      }
    };

    fetchPerformances();
  }, [artist, token]);

  if (!artist) {
    console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] No artist data, rendering fallback UI`);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => {
            console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] Back button pressed`);
            navigation.goBack();
          }}>
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
    console.log(`[${new Date().toISOString()}] [renderPills] Rendering pills with items:`, genres);
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
    const avgRating = rating || 0;
    console.log(`[${new Date().toISOString()}] [renderStars] Rendering stars with rating: ${avgRating}`);
    const stars = [];
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

  const renderPerformanceCard = (item, idx) => {
    console.log(`[${new Date().toISOString()}] [renderPerformanceCard] Rendering performance card ${idx}:`, JSON.stringify(item, null, 2));
    return (
      <View key={idx} style={{ alignItems: 'center', width: '100%' }}>
        <View style={styles.performanceCard}>
          <View style={styles.imageContainer}>
            {item.videoUrl && isPlaying && currentVideoUrl === item.videoUrl ? (
              <Video
                source={{ uri: item.videoUrl }}
                style={styles.performanceImage}
                resizeMode="cover"
                controls={true}
                paused={!isPlaying}
                onError={(error) => {
                  console.error(`[${new Date().toISOString()}] [Video] Playback error for ${item.videoUrl}:`, error);
                  Alert.alert('Error', 'Unable to play video');
                  setIsPlaying(false);
                }}
                onLoad={(data) => {
                  console.log(`[${new Date().toISOString()}] [Video] Loaded video: ${item.videoUrl}`, JSON.stringify(data, null, 2));
                }}
              />
            ) : (
              <>
                <Image
                  source={{ uri: item.thumbnailUrl || artist.profileImageUrl || 'https://via.placeholder.com/345x230' }}
                  style={styles.performanceImage}
                  resizeMode="cover"
                  onError={(error) => {
                    console.error(`[${new Date().toISOString()}] [Image] Failed to load image: ${item.thumbnailUrl || artist.profileImageUrl}`, error);
                  }}
                />
                {item.videoUrl && (
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => {
                      console.log(`[${new Date().toISOString()}] [Video] Play button pressed for: ${item.videoUrl}`);
                      setCurrentVideoUrl(item.videoUrl);
                      setIsPlaying(true);
                    }}
                  >
                    <PlayIcon width={44} height={44} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
        <Text style={styles.performanceTitle}>{item.venueName || 'Unknown Venue'}</Text>
        <View style={styles.pillRow}>{renderPills([item.genre || 'Unknown Genre'])}</View>
        <View style={styles.starRow}>{renderStars(item.rating || artist.rating || 0)}</View>
      </View>
    );
  };

  console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] Rendering main UI, performances:`, performances.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] Back button pressed`);
          navigation.goBack();
        }}>
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
          {/* <Image
            source={{ uri: artist.profileImageUrl || 'https://via.placeholder.com/100' }}
            style={styles.artistImage}
            onError={(error) => {
              console.error(`[${new Date().toISOString()}] [Image] Failed to load artist profile image: ${artist.profileImageUrl}`, error);
            }}
          /> */}
          {/* <View style={styles.artistInfo}>
            <Text style={styles.artistName}>
              {artist.email ? artist.email.split('@')[0] : 'Unknown Artist'}
            </Text>
            <Text style={styles.artistDetails}>
              {artist.artistType || 'Unknown Type'} • {artist.artistSubType || 'Unknown SubType'} • {artist.instrument || 'Unknown Instrument'}
            </Text>
            <Text style={styles.artistDetails}>Budget: ${artist.budget || 'N/A'}</Text>
            <Text style={styles.artistDetails}>Location: {artist.address || 'Unknown Location'}</Text>
            {artist.isCrowdGuarantee && (
              <Text style={styles.crowdGuaranteeText}>Crowd Guarantee</Text>
            )}
          </View> */}
        </View>

        {/* Performances Section */}
        {/* <Text style={styles.sectionTitle}>Performances</Text> */}
        {isLoading ? (
          <Text style={{ color: '#fff', marginTop: 20 }}>Loading performances...</Text>
        ) : performances.length > 0 ? (
          performances.map((item, index) => {
            console.log(`[${new Date().toISOString()}] [HostPerfomanceDetailsScreen] Mapping performance ${index}:`, JSON.stringify(item, null, 2));
            return renderPerformanceCard(item, index);
          })
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