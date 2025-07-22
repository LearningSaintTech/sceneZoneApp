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
  Dimensions,
  Modal as RNModal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlayV from '../assets/icons/playv';
import { useDispatch, useSelector } from 'react-redux';
import { loginArtist, selectToken, selectUserData } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomToggle from '../Components/CustomToggle';
import { Calendar } from 'react-native-calendars';
import Video from 'react-native-video';
import api from '../Config/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import SignUpBackground from '../assets/Banners/SignUp';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        {/* Modal Background SVG */}
        <View style={styles.backgroundContainer} pointerEvents="none">
          <SignUpBackground width="100%" height="100%" style={{ position: 'absolute' }} />
        </View>
        {/* Modal Foreground Content */}
        <View style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose} disabled={isUploading}>
              <Icon name="arrow-left" size={24} color={isUploading ? "#666" : "#fff"} />
            </TouchableOpacity>
            <Text style={styles.modalHeaderTitle}>Performance Upload</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.label}>Venue Name</Text>
            <View style={[
              styles.inputContainer, 
              { 
                borderRadius: 12, 
                borderColor: '#B15CDE', 
                backgroundColor: '#121212' 
              }
            ]}>
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
    </View>
  </Modal>
);

const ArtistEditProfileScreen = ({ navigation }) => {
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
  
  // Profile states
  const [profileId, setProfileId] = useState(null); // Store the actual profile ID
  
  // Focus states for input fields
  const [focusedField, setFocusedField] = useState('');
  
  // Loading state for initial data fetch
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });

  // Helper function to ensure unique videos in gallery
  const addUniqueVideo = (newVideo) => {
    setGalleryVideos(prev => {
      // Check if video already exists based on id or uri
      const exists = prev.some(video => 
        video.id === newVideo.id || video.uri === newVideo.uri
      );
      
      if (exists) {
        console.log('🔄 Video already exists, not adding duplicate:', newVideo.id);
        return prev;
      }
      
      console.log('✅ Adding new unique video:', newVideo.id);
      return [...prev, newVideo];
    });
  };

  // Helper function to set videos with deduplication
  const setUniqueGalleryVideos = (videos) => {
    // Remove duplicates based on id or uri
    const uniqueVideos = videos.reduce((acc, current) => {
      const exists = acc.find(video => 
        video.id === current.id || video.uri === current.uri
      );
      
      if (!exists) {
        acc.push(current);
      }
      
      return acc;
    }, []);
    
    console.log(`📹 Setting ${uniqueVideos.length} unique videos (filtered from ${videos.length})`);
    setGalleryVideos(uniqueVideos);
  };

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

  const handleSaveChanges = async () => {
    if (!token) {
      setCustomAlert({ visible: true, title: 'Error', message: 'You are not authenticated. Please log in again.' });
      navigation.navigate('ArtistSigninScreen');
      return;
    }
    if (email && !validateEmail(email)) {
      setCustomAlert({ visible: true, title: 'Invalid Email', message: 'Please enter a valid email address.' });
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('💾 Starting profile update...');
      
      const formData = new FormData();
      
      // Format DOB as YYYY-MM-DD (only if changed)
      if (dateOfBirth && dateOfBirth !== 'DD/MM/YYYY') {
        const [day, month, year] = dateOfBirth.split('/');
        if (day && month && year) {
          const dobIso = `${year}-${month}-${day}`;
          formData.append('dob', dobIso);
          console.log('📅 DOB to update:', dobIso);
        }
      }
      
      // Basic profile fields
      if (email) formData.append('email', email);
      if (address) formData.append('address', address);
      if (instrument) formData.append('instrument', instrument);
      if (budget) formData.append('budget', Number(budget) || 0);
      formData.append('isCrowdGuarantee', crowdGuarantee);
      
      // Determine artistType and artistSubType for backend
      if (genre) {
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
        
        console.log('🎭 Artist type:', artistTypeForApi);
        if (artistSubTypeForApi) console.log('🎵 Artist sub type:', artistSubTypeForApi);
      }
      
      // Profile image (only if changed)
      if (avatarSource && !avatarSource.startsWith('https://')) {
        formData.append('profileImageUrl', {
          uri: avatarSource,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });
        console.log('🖼️ New profile image to upload');
      }
      
      // performanceUrlId as array of string IDs (existing videos)
      galleryVideos.forEach((video) => {
        if (video.id) {
          formData.append('performanceUrlId[]', video.id);
        }
      });
      
      console.log('📋 Form data prepared, sending update request...');
      
      // Use PATCH method for updating artist profile
      const response = await api.patch('/artist/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ Update response:', response.data);
      
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Profile Updated!',
          text2: 'Your changes have been saved successfully.',
          position: 'top',
          visibilityTime: 2000,
          topOffset: 60,
        });
        setTimeout(() => navigation.goBack(), 1200);
      } else {
        setCustomAlert({ visible: true, title: 'Error', message: response.data.message || 'Something went wrong.' });
      }
      
    } catch (error) {
      console.error('❌ Profile update error:', error.response ? error.response.data : error.message);
      
      // If PATCH update endpoint doesn't exist, try create endpoint as fallback
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.log('🔄 PATCH update endpoint not available, trying create endpoint as fallback...');
        try {
          const formData = new FormData();
          
          // Format DOB as YYYY-MM-DD
          let dobIso = '';
          if (dateOfBirth && dateOfBirth !== 'DD/MM/YYYY') {
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
          if (artistSubTypeForApi !== null) {
            formData.append('artistSubType', artistSubTypeForApi);
          }
          formData.append('instrument', instrument);
          formData.append('budget', budget ? Number(budget) : 0);
          formData.append('isCrowdGuarantee', crowdGuarantee);
          formData.append('status', 'pending');
          
          // Profile image
          if (avatarSource) {
            if (avatarSource.startsWith('https://')) {
              // If it's already uploaded, we might need to handle differently
              console.log('🖼️ Using existing profile image URL');
            } else {
              formData.append('profileImageUrl', {
                uri: avatarSource,
                type: 'image/jpeg',
                name: 'profile.jpg',
              });
            }
          }
          
          // performanceUrlId as array of string IDs
          galleryVideos.forEach((video) => {
            if (video.id) {
              formData.append('performanceUrlId[]', video.id);
            }
          });
          
          const fallbackResponse = await api.post('/artist/create-profile', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (fallbackResponse.data.success) {
            setCustomAlert({ visible: true, title: 'Success', message: 'Profile updated successfully!' });
            dispatch(loginArtist({
              ...userData,
              location: address,
              token,
            }));
            navigation.goBack();
          } else {
            setCustomAlert({ visible: true, title: 'Error', message: fallbackResponse.data.message || 'Something went wrong.' });
          }
          
        } catch (fallbackError) {
          console.error('❌ Fallback create also failed:', fallbackError.response?.data);
          setCustomAlert({ visible: true, title: 'Error', message: 'An error occurred while updating the profile.' });
        }
      } else {
        setCustomAlert({ visible: true, title: 'Error', message: error.response?.data?.message || 'An error occurred while updating the profile.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCameraPress = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Could not open gallery.' });
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setAvatarSource(response.assets[0].uri);
      }
    });
  };

  const handleVideoCameraPress = async () => {
    launchCamera({ mediaType: 'video', videoQuality: 'medium', durationLimit: 60 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        setCustomAlert({ visible: true, title: 'Error', message: 'Could not open camera.' });
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
        setCustomAlert({ visible: true, title: 'Error', message: 'Could not open gallery.' });
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
      setCustomAlert({ visible: true, title: 'No Video', message: 'Please select a video before uploading.' });
      return;
    }
    if (!venueName || !selectedGenre) {
      setCustomAlert({ visible: true, title: 'Missing Info', message: 'Please enter venue name and select genre.' });
      return;
    }
    
    if (!profileId) {
      setCustomAlert({ visible: true, title: 'Error', message: 'Profile ID not found. Please wait for the profile to load or try refreshing.' });
      return;
    }
    
    console.log('🆔 Using Profile ID for upload:', profileId);
    console.log('👤 Artist ID from userData:', userData?.id);
    
    try {
      setIsUploading(true);
      console.log('🎬 Starting performance gallery update...');
      
      // Send everything in one FormData PATCH to update-performance-gallery
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
      
      console.log('📋 Upload FormData:', {
        venueName: venueName.trim(),
        genre: selectedGenre.trim(),
        videoUri: videoSource.uri,
        profileId: profileId,
        artistId: userData.id
      });
      
      // Use PATCH method for updating performance gallery with correct profile ID
      const res = await api.patch(`/artist/profile/update-performance-gallery/${profileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('✅ Upload Response:', res.data); // Debug: Check upload response
      
      if (res.data && res.data.success) {
        // Add the newly uploaded video to local gallery immediately
        const newVideo = {
          id: res.data.data._id || Date.now().toString(),
          uri: res.data.data.videoUrl,
          genre: res.data.data.genre,
          venue: res.data.data.venueName,
          timestamp: new Date().toISOString(),
        };
        
        addUniqueVideo(newVideo);
        console.log('🎥 Added new video to gallery:', newVideo);
        
        // Try to refresh gallery from server to get latest data
        try {
          console.log('🔄 Refreshing gallery from server...');
          const profileRes = await api.get(`/artist/get-profile/${userData.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (profileRes.data && profileRes.data.success && profileRes.data.data.performanceUrlId) {
            const videos = profileRes.data.data.performanceUrlId.map((item, idx) => ({
              id: item._id || `${item.videoUrl}-${idx}`,
              uri: item.videoUrl,
              genre: item.genre,
              venue: item.venueName,
              timestamp: new Date().toISOString(),
            }));
            setUniqueGalleryVideos(videos);
            console.log('✅ Gallery refreshed from server, total videos:', videos.length);
          }
        } catch (galleryError) {
          console.log('⚠️ Could not refresh gallery from server, using local data');
        }
        
        // Reset upload modal
        setIsUploadModalVisible(false);
        setVideoSource(null);
        setVenueName('');
        setSelectedGenre('Electronic');
        setCustomAlert({ visible: true, title: 'Success', message: 'Performance video uploaded successfully!' });
        
      } else {
        console.error('❌ Upload error:', res.data);
        setCustomAlert({ visible: true, title: 'Error', message: res.data?.message || 'Failed to upload performance.' });
      }
      
    } catch (err) {
      console.error('❌ Upload Error Details:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        config: {
          url: err.config?.url,
          method: err.config?.method,
        }
      });
      
      // Check if PATCH endpoint doesn't exist or profile not found
      if (err.response?.status === 404) {
        console.log('🔄 Profile not found with profile ID, trying with artist ID...');
        console.log('💡 The endpoint might expect artist ID instead of profile ID');
        console.log('🆔 Profile ID used:', profileId);
        console.log('👤 Artist ID available:', userData?.id);
        
        // Try with artist ID instead of profile ID
        try {
          console.log('🔄 Attempting PATCH with artist ID...');
          const retryFormData = new FormData();
          retryFormData.append('venueName', venueName.trim());
          retryFormData.append('genre', selectedGenre.trim());
          retryFormData.append('video', {
            uri: videoSource.uri,
            type: videoSource.type || 'video/mp4',
            name: `performance_${Date.now()}.mp4`,
          });
          
          const retryRes = await api.patch(`/artist/profile/update-performance-gallery/${userData.id}`, retryFormData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (retryRes.data && retryRes.data.success) {
            const newVideo = {
              id: retryRes.data.data._id || `retry-${Date.now()}`,
              uri: retryRes.data.data.videoUrl,
              genre: retryRes.data.data.genre,
              venue: retryRes.data.data.venueName,
              timestamp: new Date().toISOString(),
            };
            
            addUniqueVideo(newVideo);
            setIsUploadModalVisible(false);
            setVideoSource(null);
            setVenueName('');
            setSelectedGenre('Electronic');
            setCustomAlert({ visible: true, title: 'Success', message: 'Performance video uploaded successfully!' });
            console.log('✅ Upload successful with artist ID');
            return; // Exit the function successfully
          }
        } catch (retryErr) {
          console.log('❌ PATCH with artist ID also failed:', retryErr.response?.status);
        }
        
        // If both attempts failed, try POST create as final fallback
        console.log('🔄 Both PATCH attempts failed, trying POST create as final fallback...');
        try {
          const formData = new FormData();
          formData.append('venueName', venueName.trim());
          formData.append('genre', selectedGenre.trim());
          formData.append('video', {
            uri: videoSource.uri,
            type: videoSource.type || 'video/mp4',
            name: `performance_${Date.now()}.mp4`,
          });
          
          const fallbackRes = await api.post('/artist/profile/create-performance-gallery', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (fallbackRes.data && fallbackRes.data.success) {
            const newVideo = {
              id: fallbackRes.data.data._id || `fallback-${Date.now()}`,
              uri: fallbackRes.data.data.videoUrl,
              genre: fallbackRes.data.data.genre,
              venue: fallbackRes.data.data.venueName,
              timestamp: new Date().toISOString(),
            };
            
            addUniqueVideo(newVideo);
            setIsUploadModalVisible(false);
            setVideoSource(null);
            setVenueName('');
            setSelectedGenre('Electronic');
            setCustomAlert({ visible: true, title: 'Success', message: 'Performance video uploaded successfully!' });
          } else {
            setCustomAlert({ visible: true, title: 'Error', message: fallbackRes.data?.message || 'Failed to upload performance.' });
          }
          
                 } catch (fallbackErr) {
           console.error('❌ Fallback POST also failed:', fallbackErr.response?.data);
           setCustomAlert({ visible: true, title: 'Upload Error', message: 'Failed to upload performance. Please try again.' });
         }
       } else if (err.response?.status === 405) {
         // Method not allowed - try POST create directly
         console.log('🔄 PATCH method not allowed, trying POST create...');
         try {
           const formData = new FormData();
           formData.append('venueName', venueName.trim());
           formData.append('genre', selectedGenre.trim());
           formData.append('video', {
             uri: videoSource.uri,
             type: videoSource.type || 'video/mp4',
             name: `performance_${Date.now()}.mp4`,
           });
           
           const fallbackRes = await api.post('/artist/profile/create-performance-gallery', formData, {
             headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
             },
           });
           
                       if (fallbackRes.data && fallbackRes.data.success) {
              const newVideo = {
                id: fallbackRes.data.data._id || `post-fallback-${Date.now()}`,
                uri: fallbackRes.data.data.videoUrl,
                genre: fallbackRes.data.data.genre,
                venue: fallbackRes.data.data.venueName,
                timestamp: new Date().toISOString(),
              };
              
              addUniqueVideo(newVideo);
             setIsUploadModalVisible(false);
             setVideoSource(null);
             setVenueName('');
             setSelectedGenre('Electronic');
             setCustomAlert({ visible: true, title: 'Success', message: 'Performance video uploaded successfully!' });
           } else {
             setCustomAlert({ visible: true, title: 'Error', message: fallbackRes.data?.message || 'Failed to upload performance.' });
           }
         } catch (methodErr) {
           console.error('❌ POST method also failed:', methodErr.response?.data);
           setCustomAlert({ visible: true, title: 'Upload Error', message: 'Failed to upload performance. Please try again.' });
         }
       } else {
        if (err.response && err.response.data) {
          setCustomAlert({ visible: true, title: 'Upload Error', message: err.response.data.message || 'Failed to upload performance.' });
        } else {
          setCustomAlert({ visible: true, title: 'Network Error', message: 'Failed to upload performance. Please check your connection.' });
        }
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
          renderItem={({ item, index }) => (
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
                <PlayV width={32} height={32} />
              </View>
              <View style={styles.videoInfoContainer}>
                <Text style={styles.videoInfoText} numberOfLines={1}>{item.venue}</Text>
                <Text style={styles.videoGenreText} numberOfLines={1}>{item.genre}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => `video-${item.id}-${index}`}
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

  // Fetch complete profile data and populate form
  useEffect(() => {
    const fetchCompleteProfile = async () => {
      if (!token || !userData?.id) {
        setIsInitialLoading(false);
        return;
      }
      
      setIsInitialLoading(true);
      
      try {
        console.log('🔄 Fetching complete profile for artist ID:', userData.id);
        
        // Fetch complete profile data using the get-profile endpoint
        const profileRes = await api.get(`/artist/get-profile/${userData.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('📋 Complete Profile API Response:', profileRes.data);
        
        if (profileRes.data && profileRes.data.success && profileRes.data.data) {
          const profileData = profileRes.data.data;
          console.log('✅ Profile Data:', profileData);
          
          // Store the profile ID for later use in uploads
          setProfileId(profileData._id);
          console.log('🆔 Set profileId:', profileData._id);
          
          // Set basic artist info from artistId object
          if (profileData.artistId) {
            const artistInfo = profileData.artistId;
            setFullName(artistInfo.fullName || '');
            const cleanPhone = artistInfo.mobileNumber ? artistInfo.mobileNumber.replace('+91', '') : '';
            setPhoneNumber(cleanPhone);
            console.log('📱 Set fullName:', artistInfo.fullName);
            console.log('📞 Set phoneNumber:', cleanPhone);
          }
          
          // Set profile image
          if (profileData.profileImageUrl) {
            setAvatarSource(profileData.profileImageUrl);
            console.log('🖼️ Set profile image:', profileData.profileImageUrl);
          }
          
          // Set date of birth (convert from ISO to DD/MM/YYYY)
          if (profileData.dob) {
            const dobDate = new Date(profileData.dob);
            const day = dobDate.getDate().toString().padStart(2, '0');
            const month = (dobDate.getMonth() + 1).toString().padStart(2, '0');
            const year = dobDate.getFullYear();
            const formattedDob = `${day}/${month}/${year}`;
            setDateOfBirth(formattedDob);
            console.log('📅 Set DOB:', formattedDob);
          }
          
          // Set email
          if (profileData.email) {
            setEmail(profileData.email);
            console.log('📧 Set email:', profileData.email);
          }
          
          // Set address
          if (profileData.address) {
            setAddress(profileData.address);
            console.log('📍 Set address:', profileData.address);
          }
          
          // Set artist type
          if (profileData.artistType) {
            setGenre(profileData.artistType);
            console.log('🎭 Set artistType:', profileData.artistType);
            
            // Set artist sub type (only for Music/Musician)
            if (profileData.artistType === 'Musician' && profileData.artistSubType) {
              setArtistType(profileData.artistSubType);
              console.log('🎵 Set artistSubType:', profileData.artistSubType);
            }
          }
          
          // Set instrument
          if (profileData.instrument) {
            setInstrument(profileData.instrument);
            console.log('🎸 Set instrument:', profileData.instrument);
          }
          
          // Set budget
          if (profileData.budget) {
            setBudget(profileData.budget.toString());
            console.log('💰 Set budget:', profileData.budget);
          }
          
          // Set crowd guarantee
          if (typeof profileData.isCrowdGuarantee === 'boolean') {
            setCrowdGuarantee(profileData.isCrowdGuarantee);
            console.log('👥 Set crowdGuarantee:', profileData.isCrowdGuarantee);
          }
          
          // Set performance gallery videos
          if (profileData.performanceUrlId && Array.isArray(profileData.performanceUrlId)) {
            const videos = profileData.performanceUrlId.map((item, idx) => ({
              id: item._id || `profile-${item.videoUrl}-${idx}`,
              uri: item.videoUrl,
              genre: item.genre,
              venue: item.venueName,
              timestamp: new Date().toISOString(), // Since timestamp not provided in API
            }));
            setUniqueGalleryVideos(videos);
            console.log('🎬 Set gallery videos count:', videos.length);
          }
          
          console.log('✅ Successfully populated all profile data');
          
        } else {
          console.log('❌ No profile data found in API response');
          setCustomAlert({ visible: true, title: 'Error', message: 'Could not load profile data. Please try again.' });
        }
        
      } catch (err) {
        console.error('❌ Error fetching complete profile:', err.message);
        console.error('Error response data:', err.response?.data);
        console.error('Error response status:', err.response?.status);
        
        if (err.response?.status === 404) {
          console.log('⚠️ Profile not found - this might be a new artist without a profile yet');
          // For new artists, we'll use the artist ID as profile ID for uploads
          setProfileId(userData?.id);
          console.log('🆔 Using artist ID as profile ID:', userData?.id);
        }
        
        // Fallback to basic artist data if profile fetch fails
        try {
          console.log('🔄 Falling back to basic artist data...');
          const basicRes = await api.get('/artist/auth/get-artist', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (basicRes.data && basicRes.data.success && basicRes.data.data) {
            const artistData = basicRes.data.data;
            setFullName(artistData.fullName || artistData.name || '');
            const cleanPhone = artistData.mobileNumber ? artistData.mobileNumber.replace('+91', '') : '';
            setPhoneNumber(cleanPhone);
            console.log('✅ Fallback data set successfully');
            
            // If profile ID wasn't set and this is artist data, use artist ID
            if (!profileId) {
              setProfileId(artistData._id || userData?.id);
              console.log('🆔 Set profileId from artist data:', artistData._id || userData?.id);
            }
          }
        } catch (fallbackErr) {
          console.error('❌ Fallback also failed:', fallbackErr.message);
          
          // Final fallback to Redux data
          if (userData) {
            console.log('🔄 Using Redux data as final fallback');
            setFullName(userData.fullName || userData.name || '');
            setPhoneNumber(userData.mobileNumber ? String(userData.mobileNumber).replace('+91', '') : '');
            
            // Set profile ID from user data if not already set
            if (!profileId) {
              setProfileId(userData.id);
              console.log('🆔 Set profileId from Redux userData:', userData.id);
            }
          }
        }
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    fetchCompleteProfile();
  }, [token, userData?.id]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Background SVG */}
      <View style={styles.backgroundContainer} pointerEvents="none">
        <SignUpBackground width="100%" height="100%" style={{ position: 'absolute' }} />
      </View>
      {/* Main content */}
      {isInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a95eff" />
          <Text style={styles.loadingText}>Loading profile details...</Text>
        </View>
      ) : (
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
              <TouchableOpacity key={`large-${video.id}-${index}`} style={styles.galleryLargeItem} onPress={() => handleVideoPlay(video)}>
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
                  <PlayV width={32} height={32} />
                </View>
                <View style={styles.videoInfoContainer}>
                  <Text style={styles.videoInfo}>{video.venue}</Text>
                  <Text style={styles.videoGenre}>{video.genre}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {galleryVideos.length < 1 && (
              <TouchableOpacity key="large-placeholder-0" style={styles.galleryLargeItem}>
                <PlayV width={48} height={48} />
              </TouchableOpacity>
            )}
            {galleryVideos.length < 2 && (
              <TouchableOpacity key="large-placeholder-1" style={styles.galleryLargeItem}>
                <PlayV width={48} height={48} />
              </TouchableOpacity>
            )}
          </View>
          {/* Second row: three small boxes */}
          <View style={styles.galleryPlaceholderContainer}>
            {galleryVideos.slice(2, 5).map((video, index) => (
              <TouchableOpacity key={`small-${video.id}-${index + 2}`} style={styles.galleryPlaceholderItem} onPress={() => handleVideoPlay(video)}>
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
                  <PlayV width={24} height={24} />
                </View>
                <View style={styles.videoInfoContainerSmall}>
                  <Text style={styles.videoInfoSmall}>{video.venue}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {galleryVideos.length < 3 && (
              <TouchableOpacity key="small-placeholder-0" style={styles.galleryPlaceholderItem}>
                <PlayV width={32} height={32} />
              </TouchableOpacity>
            )}
            {galleryVideos.length < 4 && (
              <TouchableOpacity key="small-placeholder-1" style={styles.galleryPlaceholderItem}>
                <PlayV width={32} height={32} />
              </TouchableOpacity>
            )}
            {galleryVideos.length < 5 && (
              <TouchableOpacity key="small-placeholder-2" style={styles.galleryPlaceholderItem}>
                <PlayV width={32} height={32} />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.uploadButton} onPress={() => setIsUploadModalVisible(true)}>
             <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.continueButton} onPress={handleSaveChanges} disabled={loading}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.continueButtonGradient}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.continueButtonText}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

        </ScrollView>
      )}

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
      <RNModal
  visible={customAlert.visible}
  transparent
  animationType="fade"
  onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
>
  <View style={styles.shortlistModalOverlay}>
    <View style={styles.shortlistModalContent}>
      <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : customAlert.title === 'Already Shortlisted' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
      <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
      <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
      <TouchableOpacity
        style={styles.shortlistModalButton}
        onPress={() => setCustomAlert({ ...customAlert, visible: false })}
      >
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          style={styles.shortlistModalButtonGradient}
        >
          <Text style={styles.shortlistModalButtonText}>OK</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
</RNModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Nunito Sans',
    fontWeight: '500',
  },
   scrollContent: {
    padding: 20,
    paddingBottom: 50, // Add padding to the bottom to ensure the last button is visible
  },
  avatarContainer: {
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: '#fff',
    padding: 3,
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
      overflow: 'hidden',
      position: 'relative',
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
    overflow: 'hidden',
    position: 'relative',
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
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  videoGenre: {
    color: '#BCA4F7',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  videoThumbnailSmall: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  videoInfoSmall: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.3,
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
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 0.5,
  },
  videoGenreText: {
    color: '#BCA4F7',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188, 164, 247, 0.2)',
  },
  videoInfoContainerSmall: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(188, 164, 247, 0.2)',
  },
  videoThumbnailImageSmall: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',
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
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  shortlistModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortlistModalContent: {
    backgroundColor: '#000',
    width: '80%',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  shortlistModalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  shortlistModalMessage: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  shortlistModalButton: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  shortlistModalButtonGradient: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortlistModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ArtistEditProfileScreen; 