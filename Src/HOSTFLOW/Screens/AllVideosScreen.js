import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const videoItemWidth = (width - 56) / 2; // (Screen width - horizontal padding - gap between items) / 2

const AllVideosScreen = ({ route, navigation }) => {
  const { videos, onVideoPlay } = route.params;
  const insets = useSafeAreaInsets();

  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoItem} onPress={() => onVideoPlay(item)}>
      <View style={styles.videoThumbnail}>
        <Icon name="play-circle" size={48} color="#a95eff" />
        <View style={styles.videoInfoContainer}>
          <Text style={styles.videoInfoText} numberOfLines={1}>{item.venue}</Text>
          <Text style={styles.videoGenreText} numberOfLines={1}>{item.genre}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Performances</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No videos have been uploaded yet.</Text>}
      />
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  videoItem: {
    width: videoItemWidth,
    aspectRatio: 0.75,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a95eff',
    overflow: 'hidden',
  },
  videoThumbnail: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 8,
    padding: 8,
  },
  videoInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  videoGenreText: {
    color: '#d8b4fe',
    fontSize: 12,
  },
  emptyText: {
    color: '#7A7A90',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default AllVideosScreen; 