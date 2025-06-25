import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomToggle from '../Components/CustomToggle';
import { useSelector } from 'react-redux';
import { selectToken, selectUserData } from '../Redux/slices/authSlice';
import api from '../Config/api';
import ImagePicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Video from 'react-native-video';
//import * as ImagePicker from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');
const isSmallPhone = width < 350;
const isTablet = width >= 768;

const dimensions = {
  dropdownMaxHeight: isSmallPhone ? height * 0.4 : isTablet ? height * 0.5 : height * 0.45,
  dropdownOptionHeight: isSmallPhone ? 44 : isTablet ? 52 : 48,
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const genres = ['Rock', 'Jazz', 'Hip Hop', 'Classical', 'Reggae', 'Electronic', 'Blues', 'Country', 'Pop', 'Metal'];
const typeOptions = ['Music', 'Comedy', 'Magician', 'Anchor', 'Dancer', 'Poet'];
const artistTypeOptions = ['Solo', 'Duo', 'Trio', '4PC', '5PC', 'Group'];

// UploadModal component (copied and adapted from CreateProfile.js)
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
          <TouchableOpacity onPress={onClose}>
            <Icon name="arrow-left" size={24} color="#fff" />
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
          <View style={styles.videoUploadSection}>
            {videoSource ? (
                <Video
                  source={{ uri: videoSource }}
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
            style={styles.uploadButton}
          >
            <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 10 }} onPress={handleUpload}>
              <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const ArtistEditProfileScreen = ({ navigation }) => {
  const token = useSelector(selectToken);
  const userData = useSelector(selectUserData);
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [genre, setGenre] = useState('');
  const [instrument, setInstrument] = useState('');
  const [budget, setBudget] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [crowdGuarantee, setCrowdGuarantee] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Video upload/player state
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Electronic');
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [videoSource, setVideoSource] = useState(null);
  const [galleryVideos, setGalleryVideos] = useState([]);
  const [isPlayerModalVisible, setPlayerModalVisible] = useState(false);
  const [currentPlayingVideo, setCurrentPlayingVideo] = useState(null);
  const [focusedField, setFocusedField] = useState('fullName');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [artistType, setArtistType] = useState('');
  const [isArtistTypeDropdownOpen, setIsArtistTypeDropdownOpen] = useState(false);

  useEffect(() => {
    setFullName(userData?.fullName || userData?.name || '');
    setEmail(userData?.email || '');
    setPhoneNumber(userData?.mobileNumber ? String(userData.mobileNumber) : '');
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await api.get('/artist/get-profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        const data = response.data.data;
        setFullName(data.fullName || data.name || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setGenre(data.genre ? (Array.isArray(data.genre) ? data.genre.join(', ') : data.genre) : '');
        setInstrument(data.instrument || '');
        setBudget(data.budget ? String(data.budget) : '');
        setPhoneNumber(data.mobileNumber ? String(data.mobileNumber) : '');
        setProfileImage(data.profileImageUrl ? { uri: data.profileImageUrl } : null);
        setDateOfBirth(formatDateToDDMMYYYY(data.dob));
        // Note: dateOfBirth and crowdGuarantee might need different field names based on your API
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile data');
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Choose Image Source',
      'Select image from',
      [
        {
          text: 'Camera',
          onPress: () => launchCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => launchGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const launchCamera = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera to take your profile picture.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'You need to grant camera permission to use this feature.');
          return;
        }
      }

      ImagePicker.openCamera({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
      }).then(image => {
        let uri = Platform.OS === 'android' ? `file://${image.path}` : image.path;
        setProfileImage({ ...image, uri: uri });
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return;
        }
        console.log('Camera Error: ', error);
        Alert.alert('Error', 'Could not open camera.');
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const launchGallery = async () => {
    try {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.8,
      }).then(image => {
        let uri = Platform.OS === 'android' ? `file://${image.path}` : image.path;
        setProfileImage({ ...image, uri: uri });
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return;
        }
        console.log('Gallery Error: ', error);
        Alert.alert('Error', 'Could not open gallery.');
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('genre', genre);
      formData.append('instrument', instrument);
      formData.append('budget', budget);
      
      if (profileImage && profileImage.uri) {
        formData.append('profileImageUrl', {
          uri: profileImage.uri,
          type: profileImage.mime || 'image/jpeg',
          name: profileImage.filename || 'profile.jpg',
        });
      }

      const response = await api.patch('/artist/update-profile', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setDateOfBirth(formatDateToDDMMYYYY(response.data.data.dob));
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Video picker logic
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

  const handleVideoCameraPress = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs access to your camera to record video.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'You need to grant camera permission to use this feature.');
          return;
        }
      }
      ImagePicker.openCamera({
        mediaType: 'video',
        videoQuality: 'medium',
        compressVideoPreset: 'MediumQuality',
        maxDuration: 60,
      }).then(video => {
        let uri = Platform.OS === 'android' ? `file://${video.path}` : video.path;
        setVideoSource(uri);
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return;
        }
        console.log('Video Camera Error: ', error);
        Alert.alert('Error', 'Could not open video camera.');
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleVideoGalleryPress = async () => {
    try {
      ImagePicker.openPicker({
        mediaType: 'video',
        videoQuality: 'medium',
        compressVideoPreset: 'MediumQuality',
        maxDuration: 60,
      }).then(video => {
        let uri = Platform.OS === 'android' ? `file://${video.path}` : video.path;
        setVideoSource(uri);
      }).catch(error => {
        if (error.code === 'E_PICKER_CANCELLED') {
          return;
        }
        console.log('Video Gallery Error: ', error);
        Alert.alert('Error', 'Could not open video gallery.');
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleUpload = () => {
    if (!videoSource) {
      Alert.alert('No Video', 'Please select a video before uploading.');
      return;
    }
    const newVideo = {
      id: Date.now().toString(),
      uri: videoSource,
      genre: selectedGenre,
      venue: venueName,
      timestamp: new Date().toISOString(),
    };
    setGalleryVideos(prevVideos => [newVideo, ...prevVideos]);
    setIsUploadModalVisible(false);
    setVideoSource(null);
    setVenueName('');
    setSelectedGenre('Electronic');
  };

  const handleVideoPlay = (video) => {
    setCurrentPlayingVideo(video);
    setPlayerModalVisible(true);
  };

  const handleTypeSelect = (selectedType) => {
    setGenre(selectedType);
    setIsTypeDropdownOpen(false);
    setIsArtistTypeDropdownOpen(false);
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

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>  
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
          <Icon name="arrow-left" size={20} color="#C6C5ED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 50 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={profileImage ? { uri: profileImage.uri } : require('../assets/Images/frame1.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={handleImagePicker}>
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full name (Read-only)</Text>
        <View style={[styles.inputContainer, { borderColor: focusedField === 'fullName' ? '#8D6BFC' : '#555' }]}> 
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Franklin Clinton"
            placeholderTextColor="#aaa"
            editable={false}
            onFocus={() => setFocusedField('fullName')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <Text style={styles.label}>Date of Birth</Text>
        <View style={[styles.inputContainer, { borderColor: focusedField === 'dateOfBirth' ? '#8D6BFC' : '#24242D' }]}> 
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#aaa"
            editable={false}
            pointerEvents="none"
            onFocus={() => setFocusedField('dateOfBirth')}
            onBlur={() => setFocusedField('')}
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
        <View style={[styles.inputContainer, { borderColor: focusedField === 'email' ? '#8D6BFC' : '#24242D' }]}> 
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="scenezone@gmail.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <Text style={styles.label}>Address</Text>
        <View style={[styles.inputContainer, { borderColor: focusedField === 'address' ? '#8D6BFC' : '#7A7A90' }]}> 
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Location"
            placeholderTextColor="#aaa"
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField('')}
          />
          <MaterialIcons name="location-on" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Artist Type</Text>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={[
              styles.inputContainer, 
              {
                marginBottom: 0, 
                borderWidth: 0,
                backgroundColor: genre ? '#2A2A2A' : '#121212'
              }
            ]}
            onPress={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <Text style={[styles.input, { color: genre ? '#fff' : '#aaa' }]}> {genre || 'Select Artist Type'} </Text>
            <MaterialIcons 
              name={isTypeDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
              size={20} 
              color="#aaa" 
            />
          </TouchableOpacity>
          {isTypeDropdownOpen && (
            <View style={styles.dropdownOptions}>
              {typeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dropdownOption, genre === option && styles.selectedDropdownOption]}
                  onPress={() => handleTypeSelect(option)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownOptionText, genre === option && styles.selectedDropdownOptionText]}>
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
                style={[
                  styles.inputContainer, 
                  {
                    marginBottom: 0, 
                    borderWidth: 0,
                    backgroundColor: artistType ? '#2A2A2A' : '#121212'
                  }
                ]}
                onPress={() => setIsArtistTypeDropdownOpen(!isArtistTypeDropdownOpen)}
              >
                <Text style={[styles.input, { color: artistType ? '#fff' : '#aaa' }]}> {artistType || 'Select Musician Type'} </Text>
                <MaterialIcons 
                  name={isArtistTypeDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                  size={20} 
                  color="#aaa" 
                />
              </TouchableOpacity>
              {isArtistTypeDropdownOpen && (
                <View style={styles.dropdownOptions}>
                  {artistTypeOptions.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.dropdownOption, artistType === option && styles.selectedDropdownOption]}
                      onPress={() => handleArtistTypeSelect(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dropdownOptionText, artistType === option && styles.selectedDropdownOptionText]}>
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
        <View style={[styles.inputContainer, { borderColor: focusedField === 'instrument' ? '#8D6BFC' : '#24242D' }]}> 
          <TextInput
            style={styles.input}
            value={instrument}
            onChangeText={setInstrument}
            placeholder="Guitar"
            placeholderTextColor="#aaa"
            onFocus={() => setFocusedField('instrument')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <Text style={styles.label}>Budget</Text>
        <View style={[styles.inputContainer, { borderColor: focusedField === 'budget' ? '#8D6BFC' : '#24242D' }]}> 
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            placeholder="500k"
            placeholderTextColor="#aaa"
            onFocus={() => setFocusedField('budget')}
            onBlur={() => setFocusedField('')}
          />
        </View>

        <Text style={styles.label}>Phone number</Text>
        <View style={[styles.inputContainer, { borderColor: focusedField === 'phoneNumber' ? '#8D6BFC' : '#24242D' }]}> 
          <Text style={{color: '#fff'}}>🇮🇳 ▼</Text>
          <TextInput
            style={[styles.input, {marginLeft: 10}]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="412-123-4215"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
            onFocus={() => setFocusedField('phoneNumber')}
            onBlur={() => setFocusedField('')}
          />
        </View>
        <View style={styles.crowdGuaranteeRow}>
          <Text style={styles.crowdGuaranteeLabel}>Crowd Guarantee</Text>
          <CustomToggle
            value={crowdGuarantee}
            onValueChange={setCrowdGuarantee}
          />
        </View>

        <View style={styles.galleryHeader}>
          <Text style={styles.label}>Performance Gallery {galleryVideos.length > 0 && `(${galleryVideos.length})`}</Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.galleryLargeRow}>
          {galleryVideos.slice(0, 2).map((video, index) => (
            <TouchableOpacity key={video.id} style={styles.galleryLargeItem} onPress={() => handleVideoPlay(video)}>
              <View style={styles.videoThumbnail}>
                <Icon name="play-circle" size={48} color="#a95eff" />
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
        <View style={styles.galleryPlaceholderContainer}>
          {galleryVideos.slice(2, 5).map((video, index) => (
            <TouchableOpacity key={video.id} style={styles.galleryPlaceholderItem} onPress={() => handleVideoPlay(video)}>
              <View style={styles.videoThumbnailSmall}>
                <Icon name="play-circle" size={32} color="#a95eff" />
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
        {/* Upload Modal */}
        <UploadModal
          visible={isUploadModalVisible}
          onClose={() => setIsUploadModalVisible(false)}
          venueName={venueName}
          setVenueName={setVenueName}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          showGenreDropdown={showGenreDropdown}
          setShowGenreDropdown={setShowGenreDropdown}
          videoSource={videoSource}
          handleChooseVideo={handleChooseVideo}
          handleUpload={handleUpload}
        />
        {/* Video Player Modal */}
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
            <View style={styles.playerControls}>
              <TouchableOpacity style={styles.playerCloseButton} onPress={() => setPlayerModalVisible(false)}>
                <MaterialIcons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.continueButton} onPress={handleSaveChanges} disabled={loading}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 393,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    alignSelf: 'center',
  },
  headerBackButton: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
    flex: 1,
    textAlign: 'left',
    
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
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
    fontWeight: '500',
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
  galleryPlaceholderContainer:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
  },
  galleryPlaceholderItem:{
      width: '32%',
      aspectRatio: 1,
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
    aspectRatio: 0.75,
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
  crowdGuaranteeLabel: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Nunito Sans',
  },
  videoThumbnail: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
  },
  videoGenre: {
    color: '#aaa',
    fontSize: 12,
  },
  videoThumbnailSmall: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfoSmall: {
    color: '#fff',
    fontSize: 12,
  },
  playerModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  playerControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerCloseButton: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 0,
    padding: 0,
    margin: 0,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  modalHeaderTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito Sans',
    flex: 1,
    textAlign: 'left',
  },
  modalScrollContent: {
    padding: 16,
  },
  dropdownInputContainer: {
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
  dropdownInputText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  dropdownListContainer: {
    maxHeight: dimensions.dropdownMaxHeight,
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: 12,
  },
  dropdownItemActive: {
    backgroundColor: '#24242D',
  },
  dropdownItemText: {
    color: '#fff',
    fontSize: 16,
  },
  dropdownItemTextActive: {
    fontWeight: 'bold',
  },
  videoUploadSection: {
    height: 320,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: 24,
    paddingBottom: 70,
  },
  videoPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  uploadButton: {
    display: 'flex',
    width: 361,
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
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadVideoBtn: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  uploadVideoBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  dropdownContainer: {
    borderWidth: 0,
    borderRadius: 14,
    backgroundColor: '#18181A',
    marginBottom: 15,
    paddingHorizontal: 0,
    height: 52,
    justifyContent: 'center',
  },
  dropdownOptions: {
    backgroundColor: '#18181A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    marginTop: 4,
    height: 6 * 48,
    overflow: 'visible',
    zIndex: 100,
  },
  dropdownOption: {
    padding: 12,
  },
  selectedDropdownOption: {
    backgroundColor: '#24242D',
  },
  dropdownOptionText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedDropdownOptionText: {
    fontWeight: 'bold',
  },
});

// Add helper function to format ISO date to DD/MM/YYYY
function formatDateToDDMMYYYY(isoDate) {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default ArtistEditProfileScreen; 