import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  Modal,
  PermissionsAndroid,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { loginArtist, selectToken, selectUserData } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomToggle from '../Components/CustomToggle';
import { Calendar } from 'react-native-calendars';
import Video from 'react-native-video';
import api from '../Config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

// Responsive dimensions for mobile optimization
const isSmallPhone = width < 350;
const isTablet = width >= 768;

const dimensions = {
  dropdownMaxHeight: isSmallPhone ? height * 0.4 : isTablet ? height * 0.5 : height * 0.45,
  dropdownOptionHeight: isSmallPhone ? 44 : isTablet ? 52 : 48, // Increased for better touch targets
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const genres = ['Rock', 'Jazz', 'Hip Hop', 'Classical', 'Reggae', 'Electronic', 'Blues', 'Country', 'Pop', 'Metal'];

const UploadModal = ({
  visible,
  onClose,
  venueName,
  setVenueName,
  selectedGenre,
  setSelectedGenre,
  showGenreDropdown,
  setShowGenreDropdown,
  videoSource,
  handleChooseVideo,
  handleUpload,
  isUploading,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} disabled={isUploading}>
            <Icon name="arrow-left" size={24} color={isUploading ? "#666" : "#fff"} />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>Performance Upload</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.modalScrollContent}>
          <Text style={styles.label}>Venue Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={venueName}
              onChangeText={setVenueName}
              placeholder="Venue name"
              placeholderTextColor="#aaa"
            />
          </View>

          <Text style={styles.label}>Genre</Text>
          <TouchableOpacity style={styles.dropdownInputContainer} onPress={() => setShowGenreDropdown(!showGenreDropdown)}>
            <Text style={styles.dropdownInputText}>{selectedGenre || 'Select Genre'}</Text>
            <MaterialIcons name={showGenreDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={20} color="#aaa" />
          </TouchableOpacity>

          {showGenreDropdown && (
            <View style={styles.dropdownListContainer}>
              {genres.map((genreOption) => (
                <TouchableOpacity
                  key={genreOption}
                  style={[styles.dropdownItem, selectedGenre === genreOption && styles.dropdownItemActive]}
                  onPress={() => {
                    setSelectedGenre(genreOption);
                    setShowGenreDropdown(false);
                  }}
                >
                  <Text style={[styles.dropdownItemText, selectedGenre === genreOption && styles.dropdownItemTextActive]}>{genreOption}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Text style={styles.label}>Upload Your Video</Text>
          <View style={styles.videoContainer}>
            {videoSource ? (
                <Video
                  source={{ uri: videoSource.uri }}
                  style={styles.videoPlayer}
                  controls={true}
                  resizeMode="cover"
                  paused={false}
                />
            ) : (
              <View style={styles.videoPlaceholder} />
            )}
            <TouchableOpacity style={styles.uploadVideoBtn} onPress={handleChooseVideo}>
                <MaterialIcons name="photo-camera" size={24} color="#BCA4F7" />
                <Text style={styles.uploadVideoBtnText}>Upload Video</Text>
            </TouchableOpacity>
          </View>

          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.modalUploadButton}
          >
            <TouchableOpacity 
              style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }} 
              onPress={handleUpload}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <ActivityIndicator size="small" color="#000" />
                  <Text style={styles.uploadButtonText}>Uploading...</Text>
                </>
              ) : (
                <Text style={styles.uploadButtonText}>Upload</Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const CreateProfile = ({ navigation }) => {
  const [avatarSource, setAvatarSource] = useState(null);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [address, setAddress] = useState('');
  const [genre, setGenre] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [artistType, setArtistType] = useState('');
  const [isArtistTypeDropdownOpen, setIsArtistTypeDropdownOpen] = useState(false);
  const [instrument, setInstrument] = useState('');
  const [budget, setBudget] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [crowdGuarantee, setCrowdGuarantee] = useState(false);
  
  // Modal states
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Electronic');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isAllVideosModalVisible, setIsAllVideosModalVisible] = useState(false);
  const [isPlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  
  // Gallery states
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Focus states for input fields
  const [focusedField, setFocusedField] = useState('');
  
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const typeOptions = ['Music', 'Comedy', 'Magician', 'Anchor', 'Dancer', 'Poet'];
  const artistTypeOptions = ['Solo', 'Duo', 'Trio', '4PC', '5PC', 'Group'];

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (text === '') {
      setEmailError('');
      setIsEmailValid(true);
    } else if (!validateEmail(text)) {
      setEmailError('Please enter a valid email address');
      setIsEmailValid(false);
    } else {
      setEmailError('');
      setIsEmailValid(true);
    }
  };

  const handleTypeSelect = (selectedType) => {
    setGenre(selectedType);
    setIsTypeDropdownOpen(false); // Always close Type dropdown immediately
    setIsArtistTypeDropdownOpen(false); // Close Artist Type dropdown too
    // Reset artist type when changing main type
    if (selectedType !== 'Music') {
      setArtistType('');
    }
  };

  const handleArtistTypeSelect = (selectedArtistType) => {
    setArtistType(selectedArtistType);
    setIsArtistTypeDropdownOpen(false);
  };

  const closeDropdown = () => {
    setIsTypeDropdownOpen(false);
    setIsArtistTypeDropdownOpen(false);
  };

  const handleInputFocus = (fieldName) => {
    setFocusedField(fieldName);
    closeDropdown();
  };

  const handleInputBlur = () => {
    setFocusedField('');
  };

  const handleDayPress = (day) => {
    setSelectedCalendarDate(day.dateString);
  };

  const handleConfirmDate = () => {
    if (selectedCalendarDate) {
      // Reformat from YYYY-MM-DD to DD/MM/YYYY
      const [year, month, day] = selectedCalendarDate.split('-');
      setDateOfBirth(`${day}/${month}/${year}`);
      setDatePickerVisible(false);
    }
  };

  // Calculate dropdown height to show all options fully
  const getDropdownHeight = (itemCount) => {
    // Calculate exact height needed for all items plus borders and padding
    const optionHeight = dimensions.dropdownOptionHeight;
    const totalOptionsHeight = itemCount * optionHeight;
    const borderAndPaddingHeight = 8; // Extra space for borders and padding
    
    // For our current lists (6 items max), always show all items
    return totalOptionsHeight + borderAndPaddingHeight;
  };

  const handleContinue = async () => {
    if (!token) {
      Alert.alert('Error', 'You are not authenticated. Please log in again.');
      navigation.navigate('ArtistSigninScreen');
      return;
    }
    if (email && !validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (!avatarSource) {
      Alert.alert('Profile Image Required', 'Please upload a profile image.');
      return;
    }
    if (galleryVideos.length === 0) {
      Alert.alert('Performance Video Required', 'Please upload at least one performance video.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    // Format DOB as YYYY-MM-DD
    let dobIso = '';
    if (dateOfBirth) {
      const [day, month, year] = dateOfBirth.split('/');
      if (day && month && year) {
        dobIso = `${year}-${month}-${day}`;
      }
    }
    formData.append('dob', dobIso);
    formData.append('email', email);
    formData.append('address', address);
    // Determine artistType and artistSubType for backend
    let artistTypeForApi = genre;
    let artistSubTypeForApi = null;
    if (genre === 'Music') {
      artistTypeForApi = 'Musician';
      artistSubTypeForApi = artistType || null;
    }
    formData.append('artistType', artistTypeForApi);
    // Only append artistSubType if it's not null (i.e., only for Music/Musician)
    if (artistSubTypeForApi !== null) {
      formData.append('artistSubType', artistSubTypeForApi);
    }
    formData.append('instrument', genre === 'Music' ? instrument : null);
    formData.append('budget', budget ? Number(budget) : 0);
    formData.append('isCrowdGuarantee', crowdGuarantee);
    formData.append('status', 'pending');
    // Profile image
    formData.append('profileImageUrl', {
      uri: avatarSource,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    // performanceUrlId as array of string IDs
    galleryVideos.forEach((video) => {
      if (video.id) {
        formData.append('performanceUrlId[]', video.id);
      }
    });
    try {
      const response = await api.post('/artist/create-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        Alert.alert('Success', 'Profile created successfully!');
        
        console.log('Profile creation response:', response.data.data);
        
        // Map artistId from response to id for Redux store
        const profileData = response.data.data;
        dispatch(loginArtist({
          ...userData, // Keep existing user data
          id: profileData.artistId, // Map artistId to id
          location: profileData.address,
          token,
        }));
        navigation.navigate('ArtistHome');
      } else {
        Alert.alert('Error', response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'An error occurred while creating the profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPress = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not open gallery.');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setAvatarSource(response.assets[0].uri);
      }
    });
  };

  const handleVideoCameraPress = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera to record video.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Camera permission is required to record video.');
          return;
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to request camera permission.');
        return;
      }
    }
    launchCamera({ mediaType: 'video', videoQuality: 'medium', durationLimit: 60 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not open camera.');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setVideoSource({ uri: response.assets[0].uri, thumbnail: null });
      }
    });
  };

  const handleVideoGalleryPress = async () => {
    launchImageLibrary({ mediaType: 'video', videoQuality: 'medium', durationLimit: 60 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', 'Could not open gallery.');
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setVideoSource({ uri: response.assets[0].uri, thumbnail: null });
      }
    });
  };

  const handleVideoPlay = (video) => {
    setCurrentPlayingVideo(video);
    setPlayerModalVisible(true);
  };

  const handleChooseVideo = () => {
    Alert.alert(
      "Upload Video",
      "Choose an option to upload your performance video.",
      [
        {
          text: "Record Video",
          onPress: handleVideoCameraPress,
        },
        {
          text: "Choose from Gallery",
          onPress: handleVideoGalleryPress,
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ],
      { cancelable: true }
    );
  };

  const handleUpload = async () => {
    if (!videoSource) {
      Alert.alert('No Video', 'Please select a video before uploading.');
      return;
    }
    if (!venueName || !selectedGenre) {
      Alert.alert('Missing Info', 'Please enter venue name and select genre.');
      return;
    }
    try {
      setIsUploading(true);
      // Send everything in one FormData POST to create-performance-gallery
      const formData = new FormData();
      
      // Ensure venueName is properly formatted string
      formData.append('venueName', venueName.trim());
      
      // Ensure genre is properly formatted string
      formData.append('genre', selectedGenre.trim());
      
      // Video file with proper formatting
      formData.append('video', {
        uri: videoSource.uri,
        type: videoSource.type || 'video/mp4',
        name: `performance_${Date.now()}.mp4`,
      });
      
      console.log('Upload FormData:', {
        venueName: venueName.trim(),
        genre: selectedGenre.trim(),
        videoUri: videoSource.uri
      });
      const res = await api.post('/artist/profile/create-performance-gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Upload Response:', res.data); // Debug: Check upload response
      
      if (res.data && res.data.success) {
        // Add the newly uploaded video to local gallery immediately
        const newVideo = {
          id: res.data.data._id || Date.now().toString(),
          uri: res.data.data.videoUrl,
          genre: res.data.data.genre,
          venue: res.data.data.venueName,
          timestamp: new Date().toISOString(),
        };
        
        setGalleryVideos(prev => [...prev, newVideo]);
        console.log('Added new video to gallery:', newVideo);
        
        // Try to refresh gallery from server (optional)
        try {
          const galleryRes = await api.get('/artist/profile/get-all-performances-by-artist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (galleryRes.data && galleryRes.data.success && Array.isArray(galleryRes.data.data)) {
            setGalleryVideos(galleryRes.data.data.map((item, idx) => ({
              id: item._id || idx.toString(),
              uri: item.videoUrl,
              genre: item.genre,
              venue: item.venueName,
              timestamp: item.createdAt,
            })));
            console.log('Refreshed gallery from server');
          }
        } catch (galleryError) {
          console.log('Could not refresh gallery from server, using local data');
        }
        
        setIsUploadModalVisible(false);
        setVideoSource(null);
        setVenueName('');
        setSelectedGenre('Electronic');
        Alert.alert('Success', 'Video uploaded successfully!');
      } else {
        console.error('Upload error:', res.data);
        Alert.alert('Error', res.data?.message || 'Failed to upload performance.');
      }
    } catch (err) {
      console.error('Upload Error Details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
        }
      });
      
      if (err.response && err.response.data) {
        Alert.alert('Upload Error', err.response.data.message || 'Failed to upload performance.');
      } else {
        Alert.alert('Network Error', 'Failed to upload performance. Please check your connection.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const AllVideosModal = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isAllVideosModalVisible}
      onRequestClose={() => setIsAllVideosModalVisible(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setIsAllVideosModalVisible(false)}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.modalHeaderTitle}>All Performances</Text>
          <View style={{ width: 24 }} />
        </View>
        <FlatList
          data={galleryVideos}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.videoItem} onPress={() => {
              setIsAllVideosModalVisible(false);
              handleVideoPlay(item);
            }}>
              <Video
                source={{ uri: item.uri }}
                style={styles.videoThumbnailImage}
                resizeMode="cover"
                paused={true}
                muted={true}
                repeat={false}
                onError={(error) => console.log('Video thumbnail error:', error)}
              />
              <View style={styles.videoOverlay}>
                <Icon name="play-circle" size={32} color="#fff" />
              </View>
              <View style={styles.videoInfoContainer}>
                <Text style={styles.videoInfoText} numberOfLines={1}>{item.venue}</Text>
                <Text style={styles.videoGenreText} numberOfLines={1}>{item.genre}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          ListEmptyComponent={<Text style={styles.emptyText}>No videos have been uploaded yet.</Text>}
        />
      </SafeAreaView>
    </Modal>
  );

  const VideoPlayerModal = () => (
    <Modal
      visible={isPlayerModalVisible}
      transparent={true}
      onRequestClose={() => setPlayerModalVisible(false)}
      statusBarTranslucent
    >
      <View style={styles.playerModalOverlay}>
        {currentPlayingVideo && (
          <Video
            source={{ uri: currentPlayingVideo.uri }}
            style={styles.fullScreenVideo}
            controls={true}
            resizeMode="contain"
            autoplay={true}
            onEnd={() => setPlayerModalVisible(false)}
            onError={(e) => console.log('Video Error:', e)}
          />
        )}
        <SafeAreaView style={styles.playerControls}>
          <TouchableOpacity style={styles.playerCloseButton} onPress={() => setPlayerModalVisible(false)}>
            <MaterialIcons name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );

  // Fetch performance gallery and prefill name/number on mount
  useEffect(() => {
    const fetchProfileAndGallery = async () => {
      if (!token) return;
             try {
         // Fetch artist info for prefill
         const res = await api.get('/artist/auth/get-artist', {
           headers: { Authorization: `Bearer ${token}` }
         });
         
         console.log('Artist API Response:', res.data); // Debug: Check API response
         
         if (res.data && res.data.success && res.data.data) {
           const artistData = res.data.data;
           console.log('Artist Data:', artistData); // Debug: Check artist data
           
           // Set fullname from API response
           const fullNameFromApi = artistData.fullName || artistData.name || '';
           setFullName(fullNameFromApi);
           console.log('Setting fullName:', fullNameFromApi);
           
           // Set phone number from API response
           const phoneFromApi = artistData.mobileNumber || artistData.phone || '';
           setPhoneNumber(phoneFromApi ? String(phoneFromApi) : '');
           console.log('Setting phoneNumber:', phoneFromApi);
         } else {
           console.log('No artist data found in API response');
         }
        // Fetch performances for gallery
        const galleryRes = await api.get('/artist/profile/get-all-performances-by-artist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (galleryRes.data && galleryRes.data.success && Array.isArray(galleryRes.data.data)) {
          setGalleryVideos(galleryRes.data.data.map((item, idx) => ({
            id: item._id || idx.toString(),
            uri: item.videoUrl, // Use videoUrl from backend
            genre: item.genre,
            venue: item.venueName,
            timestamp: item.createdAt,
          })));
        }
             } catch (err) {
         console.error('Error fetching artist profile:', err.message);
         console.error('Error response data:', err.response?.data);
         console.error('Error response status:', err.response?.status);
         
         // Fallback to Redux data if API fails
         if (userData) {
           console.log('Falling back to Redux data:', userData);
           setFullName(userData.fullName || userData.name || '');
           setPhoneNumber(userData.mobileNumber ? String(userData.mobileNumber) : userData.phone || '');
         }
       }
    };
    fetchProfileAndGallery();
  }, [token]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 50 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource ? { uri: avatarSource } : require('../assets/Images/frame1.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={handleCameraPress}>
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full name</Text>
        <View style={[
          styles.inputContainer, 
          { 
            borderRadius: 12, 
            borderColor: focusedField === 'fullName' ? '#8D6BFC' : '#24242D', 
            backgroundColor: '#121212' 
          }
        ]}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => handleInputFocus('fullName')}
            onBlur={handleInputBlur}
            placeholder="Franklin Clinton"
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#aaa"
            editable={false}
            pointerEvents="none"
            onFocus={() => setFocusedField('dateOfBirth')}
            onBlur={handleInputBlur}
          />
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <MaterialIcons name="calendar-today" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth ? (() => { const [d, m, y] = dateOfBirth.split('/'); return new Date(`${y}-${m}-${d}`); })() : new Date()}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                const day = selectedDate.getDate().toString().padStart(2, '0');
                const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                const year = selectedDate.getFullYear();
                setDateOfBirth(`${day}/${month}/${year}`);
              }
            }}
          />
        )}

        <Text style={styles.label}>Email</Text>
        <View style={[
          styles.inputContainer, 
          { 
            borderColor: focusedField === 'email' ? '#8D6BFC' : !isEmailValid && email !== '' ? '#ff0000' : '#24242D',
            backgroundColor: '#121212'
          }
        ]}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={handleEmailChange}
            onFocus={() => handleInputFocus('email')}
            onBlur={handleInputBlur}
            placeholder="scenezone@gmail.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>
        {emailError !== '' && (
          <Text style={styles.errorText}>{emailError}</Text>
        )}

        <Text style={styles.label}>Address</Text>
        <View style={[
          styles.inputContainer, 
          { 
            borderRadius: 12, 
            borderColor: focusedField === 'address' ? '#8D6BFC' : '#24242D', 
            backgroundColor: '#121212' 
          }
        ]}>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            onFocus={() => handleInputFocus('address')}
            onBlur={handleInputBlur}
            placeholder="Location"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="location-on" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Artist Type</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <Text style={[styles.input, { color: genre ? '#fff' : '#aaa' }]}>
              {genre || 'Select Type'}
            </Text>
            <MaterialIcons 
              name={isTypeDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={20} 
              color="#aaa" 
            />
          </TouchableOpacity>
          
          {isTypeDropdownOpen && (
            <View style={[
              styles.dropdownOptions, 
              { 
                height: getDropdownHeight(typeOptions.length)
              }
            ]}>
              {typeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownOption,
                    { height: dimensions.dropdownOptionHeight },
                    genre === option && styles.selectedDropdownOption,
                    index === typeOptions.length - 1 && styles.lastDropdownOption
                  ]}
                  onPress={() => handleTypeSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.dropdownOptionText,
                    genre === option && styles.selectedDropdownOptionText
                  ]}>
                    {option}
                  </Text>
                  {genre === option && (
                    <MaterialIcons name="check" size={20} color="#a95eff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {genre === 'Music' && !isTypeDropdownOpen && (
          <>
            <Text style={styles.label}>Musician</Text>
            <View style={[styles.dropdownContainer, {zIndex: 2000}]}>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setIsArtistTypeDropdownOpen(!isArtistTypeDropdownOpen)}
              >
                <Text style={[styles.input, { color: artistType ? '#fff' : '#aaa' }]}>
                  {artistType || 'Select Artist Type'}
                </Text>
                <MaterialIcons 
                  name={isArtistTypeDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={20} 
                  color="#aaa" 
                />
              </TouchableOpacity>
              
              {isArtistTypeDropdownOpen && (
                <View style={[
                  styles.dropdownOptions, 
                  { 
                    zIndex: 2001, 
                    elevation: 15,
                    height: getDropdownHeight(artistTypeOptions.length)
                  }
                ]}>
                  {artistTypeOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.dropdownOption,
                        { height: dimensions.dropdownOptionHeight },
                        artistType === option && styles.selectedDropdownOption,
                        index === artistTypeOptions.length - 1 && styles.lastDropdownOption
                      ]}
                      onPress={() => handleArtistTypeSelect(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.dropdownOptionText,
                        artistType === option && styles.selectedDropdownOptionText
                      ]}>
                        {option}
                      </Text>
                      {artistType === option && (
                        <MaterialIcons name="check" size={20} color="#a95eff" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </>
        )}

        {genre === 'Music' && (
          <>
            <Text style={styles.label}>Instrument</Text>
            <View style={[
              styles.inputContainer,
              { 
                borderColor: focusedField === 'instrument' ? '#8D6BFC' : '#24242D',
                backgroundColor: '#121212'
              }
            ]}>
              <TextInput
                style={styles.input}
                value={instrument}
                onChangeText={setInstrument}
                onFocus={() => handleInputFocus('instrument')}
                onBlur={handleInputBlur}
                placeholder="Guitar"
                placeholderTextColor="#aaa"
              />
            </View>
          </>
        )}

        <Text style={styles.label}>Budget</Text>
         <View style={[
           styles.inputContainer,
           { 
             borderColor: focusedField === 'budget' ? '#8D6BFC' : '#24242D',
             backgroundColor: '#121212'
           }
         ]}>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            onFocus={() => handleInputFocus('budget')}
            onBlur={handleInputBlur}
            placeholder="500k"
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.label}>Phone number</Text>
         <View style={[
           styles.inputContainer,
           { 
             borderColor: focusedField === 'phoneNumber' ? '#8D6BFC' : '#24242D',
             backgroundColor: '#121212'
           }
         ]}>
             {/* Country code input would go here */}
             <Text style={{color: '#fff'}}>🇮🇳 ▼</Text>
          <TextInput
            style={[styles.input, {marginLeft: 10}] }
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onFocus={() => handleInputFocus('phoneNumber')}
            onBlur={handleInputBlur}
            placeholder="412-123-4215"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.crowdGuaranteeRow}>
          <Text style={styles.label}>Crowd Guarantee</Text>
          <CustomToggle
            value={crowdGuarantee}
            onValueChange={setCrowdGuarantee}
          />
        </View>

        <View style={styles.galleryHeader}>
          <Text style={styles.label}>Performance Gallery {galleryVideos.length > 0 && `(${galleryVideos.length})`}</Text>
          <TouchableOpacity 
            onPress={() => setIsAllVideosModalVisible(true)}
            disabled={galleryVideos.length === 0}
          >
             <Text style={[styles.seeAllText, galleryVideos.length === 0 && styles.disabledSeeAllText]}>
               See All →
             </Text>
          </TouchableOpacity>
        </View>

        {/* First row: two large upload boxes */}
        <View style={styles.galleryLargeRow}>
          {galleryVideos.slice(0, 2).map((video, index) => (
            <TouchableOpacity key={video.id} style={styles.galleryLargeItem} onPress={() => handleVideoPlay(video)}>
              <Video
                source={{ uri: video.uri }}
                style={styles.videoThumbnailImage}
                resizeMode="cover"
                paused={true}
                muted={true}
                repeat={false}
                onError={(error) => console.log('Video thumbnail error:', error)}
              />
              <View style={styles.videoOverlay}>
                <Icon name="play-circle" size={32} color="#fff" />
              </View>
              <View style={styles.videoInfoContainer}>
                <Text style={styles.videoInfo}>{video.venue}</Text>
                <Text style={styles.videoGenre}>{video.genre}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {galleryVideos.length < 1 && (
            <TouchableOpacity style={styles.galleryLargeItem}>
              <Icon name="play-circle" size={48} color="#a95eff" />
            </TouchableOpacity>
          )}
          {galleryVideos.length < 2 && (
            <TouchableOpacity style={styles.galleryLargeItem}>
              <Icon name="play-circle" size={48} color="#a95eff" />
            </TouchableOpacity>
          )}
        </View>
        {/* Second row: three small boxes */}
        <View style={styles.galleryPlaceholderContainer}>
          {galleryVideos.slice(2, 5).map((video, index) => (
            <TouchableOpacity key={video.id} style={styles.galleryPlaceholderItem} onPress={() => handleVideoPlay(video)}>
              <Video
                source={{ uri: video.uri }}
                style={styles.videoThumbnailImageSmall}
                resizeMode="cover"
                paused={true}
                muted={true}
                repeat={false}
                onError={(error) => console.log('Video thumbnail error:', error)}
              />
              <View style={styles.videoOverlaySmall}>
                <Icon name="play-circle" size={24} color="#fff" />
              </View>
              <View style={styles.videoInfoContainerSmall}>
                <Text style={styles.videoInfoSmall}>{video.venue}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {galleryVideos.length < 3 && (
            <TouchableOpacity style={styles.galleryPlaceholderItem}>
              <Icon name="play-circle" size={32} color="#a95eff" />
            </TouchableOpacity>
          )}
          {galleryVideos.length < 4 && (
            <TouchableOpacity style={styles.galleryPlaceholderItem}>
              <Icon name="play-circle" size={32} color="#a95eff" />
            </TouchableOpacity>
          )}
          {galleryVideos.length < 5 && (
            <TouchableOpacity style={styles.galleryPlaceholderItem}>
              <Icon name="play-circle" size={32} color="#a95eff" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={() => setIsUploadModalVisible(true)}>
           <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>


        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} disabled={loading}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>

      <UploadModal
        visible={isUploadModalVisible}
        onClose={() => !isUploading && setIsUploadModalVisible(false)}
        venueName={venueName}
        setVenueName={setVenueName}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        showGenreDropdown={showGenreDropdown}
        setShowGenreDropdown={setShowGenreDropdown}
        videoSource={videoSource}
        handleChooseVideo={handleChooseVideo}
        handleUpload={handleUpload}
        isUploading={isUploading}
      />
      <AllVideosModal />
      <VideoPlayerModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
   scrollContent: {
    padding: 20,
    paddingBottom: 50, // Add padding to the bottom to ensure the last button is visible
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#a95eff',
    borderRadius: 20,
    padding: 8,
  },
  label: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 8,
    marginTop: 10,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
    marginBottom: 15,
  },
  dropdownOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderColor: '#555',
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 1001,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownScrollView: {
    flexGrow: 1,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: isSmallPhone ? 12 : isTablet ? 16 : 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedDropdownOption: {
    backgroundColor: '#2a2a2a',
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  selectedDropdownOptionText: {
    color: '#a95eff',
    fontWeight: '600',
  },
   galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  seeAllText: {
    color: '#a95eff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledSeeAllText: {
    color: '#555',
  },
  galleryPlaceholderContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  galleryPlaceholderItem:{
      width: '32%',
      aspectRatio: 1, // To maintain square aspect ratio
      backgroundColor: '#1a1a1a',
      borderRadius: 10,
      justifyContent:'center',
      alignItems:'center',
      borderWidth: 0.5,
      borderColor: '#a95eff',
  },
  uploadButton:{
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#555',
  },
  uploadButtonText:{
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  continueButton: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    width: '100%',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#000',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
  },
  galleryLargeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  galleryLargeItem: {
    width: '48%',
    aspectRatio: 0.75, // Taller rectangle
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a95eff',
  },
  crowdGuaranteeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalHeaderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginRight: 110,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  modalUploadButton: {
    display: 'flex',
    width: '100%',
    height: 52,
    paddingHorizontal: 16,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20,
  },
  // Additional modal-specific styles
  dropdownInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#24242D',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 48,
    backgroundColor: '#121212',
    gap: 12,
    alignSelf: 'stretch',
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  dropdownInputText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownListContainer: {
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  dropdownItemActive: {
    backgroundColor: '#a95eff',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoContainer: {
    height: 320,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    width: '100%',
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  uploadVideoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(25, 25, 26, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    gap: 10,
  },
  uploadVideoBtnText: {
    color: '#BCA4F7',
    fontSize: 14,
    fontWeight: '600',
  },
  videoUploadSection: {
    // This style is kept for the parent container but can be simplified if no longer needed for other things.
  },
  videoPreviewContainer: {
    // ... existing code ...
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  confirmButton: {
    backgroundColor: '#ff7f50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoThumbnail: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  videoInfo: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoGenre: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: '400',
  },
  videoThumbnailSmall: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  videoInfoSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoItem: {
    width: '50%',
    aspectRatio: 1,
    padding: 5,
  },
  videoInfoContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  videoGenreText: {
    color: '#a95eff',
    fontSize: 12,
    fontWeight: '400',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
  },
  playerModalOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
  },
  playerControls: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  playerCloseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  inputContainerError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 5,
  },
  videoThumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  videoInfoContainerSmall: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  videoThumbnailImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  videoOverlaySmall: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateProfile; 