import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import PlayIcon from '../assets/icons/play';
import { useSelector } from 'react-redux';

const HostPerfomanceDetailsScreen = ({ navigation, route }) => {
  const artistId = route?.params?.artistId;
  console.log('HostPerfomanceDetailsScreen artistId:', artistId);

  const token = useSelector(state => state.auth.token);

  const [performanceData, setPerformanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered. artistId:', artistId, 'token:', token);
    const fetchPerformanceData = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
        const url = `${API_BASE}/api/artist/get-Artist-Performance/${artistId}`;
        console.log('Fetching from URL:', url);
        console.log('Using token:', token);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetch response status:', response.status);
        const result = await response.json();
        console.log('Raw API response data:', JSON.stringify(result.data, null, 2));
        if (result.success) {
          const normalizedData = result.data.map((item) => ({
            ...item,
            genre: Array.isArray(item.genre) ? item.genre : [],
          }));
          setPerformanceData(normalizedData);
          console.log('Normalized performance data:', normalizedData);
        } else {
          setPerformanceData([]);
          setError(result.message || 'Failed to fetch performances');
          console.log('API error:', result.message || 'Failed to fetch performances');
        }
      } catch (err) {
        setPerformanceData([]);
        setError('Network error');
        console.log('Network error:', err);
      } finally {
        setLoading(false);
        console.log('Loading set to false');
      }
    };
    if (artistId && token) {
      fetchPerformanceData();
    } else {
      console.log('artistId or token missing. artistId:', artistId, 'token:', token);
      setLoading(false);
      setError('Missing artist ID or token');
    }
  }, [artistId, token]);

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
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i < rating ? 'star' : 'star-outline'}
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
          <Image
            source={require('../assets/Images/perf1.png')}
            style={styles.performanceImage}
            resizeMode="contain"
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
        </View>
      </View>
      <Text style={styles.performanceTitle}>{item.venueName}</Text>
      <View style={styles.pillRow}>{renderPills(item.genre)}</View>
      <View style={styles.starRow}>{renderStars(item.avgRating)}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2} ellipsizeMode="tail">Performance</Text>
        <View style={{ width: 24 }} />
      </View>
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#B15CDE" />
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', marginTop: 40 }}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {performanceData.length === 0 ? (
            <Text style={{ color: '#fff', marginTop: 40 }}>No performances found.</Text>
          ) : (
            performanceData.map(renderPerformanceCard)
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Styles remain unchanged
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
    alignItems: 'center',
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
    marginRight: 2,
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