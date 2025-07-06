import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import CameraIcon from '../assets/icons/Camera';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../Config/env.js';
import { useSelector } from 'react-redux';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
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
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  inputHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  uploadBoxHeight: Math.min(height * 0.15, 120),
  headerHeight: Math.max(height * 0.08, 60),
};

// Custom Checkbox Component with enhanced touch targets
const CustomCheckbox = ({ label, isChecked, onValueChange }) => {
  return (
    <TouchableOpacity 
      style={styles.customCheckboxOption} 
      onPress={() => onValueChange(!isChecked)}
      activeOpacity={0.7}
    >
      <View style={[styles.customCheckbox, isChecked && styles.customCheckboxChecked]}>
        {isChecked && <Feather name="check" size={Math.max(dimensions.iconSize * 0.7, 16)} color="#fff" />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const ShortlistCreateNewEventContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [eventName, setEventName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [genre, setGenre] = useState('');
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [posterUrl, setPosterUrl] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');

  const token = useSelector(state => state.auth.token);
  const artist = route.params?.artist; // Get artist details from navigation params

  const handleDateChange = (event, pickedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && pickedDate) {
      setSelectedDate(pickedDate);
      setDate(pickedDate.toISOString().slice(0, 10));
    }
  };

  const handleCameraPress = async () => {
    Alert.alert(
      'Select Image Source',
      'Choose how you want to add an image',
      [
        {
          text: 'Camera',
          onPress: handleTakePhoto
        },
        {
          text: 'Gallery',
          onPress: handleImageLibraryPress
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleTakePhoto = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 232,
      maxWidth: 317,
      quality: 0.8,
      saveToPhotos: false,
    };
  
    const cameraPermission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });
  
    const storagePermission = Platform.select({
      android: Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });
  
    const checkCameraPermission = await check(cameraPermission);
    const checkStoragePermission = await check(storagePermission);
  
    if (checkCameraPermission !== RESULTS.GRANTED || checkStoragePermission !== RESULTS.GRANTED) {
      const requestCamera = await request(cameraPermission);
      const requestStorage = await request(storagePermission);
      if (requestCamera !== RESULTS.GRANTED || requestStorage !== RESULTS.GRANTED) {
        Alert.alert('Permission Error', 'Camera and storage permissions are required');
        return;
      }
    }
  
    try {
      const result = await launchCamera(options);
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Camera Error', result.errorMessage || 'Unknown error');
        return;
      }
  
      if (result.assets && result.assets[0] && result.assets[0].uri) {
        let uri = result.assets[0].uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }
        setPosterUrl(uri);
      }
    } catch (error) {
      console.log("Camera error:", error);
      Alert.alert('Error', 'Failed to open camera');
    }
  };
  
  const handleImageLibraryPress = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 232,
      maxWidth: 317,
      quality: 0.8,
      saveToPhotos: false,
    };
  
    const storagePermission = Platform.select({
      android: Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    });
  
    const checkPermission = await check(storagePermission);
  
    if (checkPermission !== RESULTS.GRANTED) {
      const requestPermission = await request(storagePermission);
      if (requestPermission !== RESULTS.GRANTED) {
        Alert.alert('Permission Error', 'Photo library access is required');
        return;
      }
    }
  
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Image Library Error', result.errorMessage || 'Unknown error');
        return;
      }
  
      if (result.assets && result.assets[0] && result.assets[0].uri) {
        let uri = result.assets[0].uri;
        if (Platform.OS === 'android' && !uri.startsWith('file://')) {
          uri = 'file://' + uri;
        }
        setPosterUrl(uri);
      }
    } catch (error) {
      console.log("Image library error:", error);
      Alert.alert('Error', 'Failed to access image library');
    }
  };
  
  const handleTimeChange = (event, pickedTime) => {
    setShowTimePicker(false);
    if (event.type === 'set' && pickedTime) {
      setSelectedTime(pickedTime);
      const hours = pickedTime.getHours();
      const minutes = pickedTime.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours % 12 || 12;
      const formattedTime = `${hours12}:${minutes} ${ampm}`;
      console.log('Formatted time:', formattedTime);
      setTime(formattedTime);
    }
  };
  
  const handleContinue = async () => {
    try {
      console.log('Starting handleContinue...', { timestamp: new Date().toISOString() });
      if (!token) {
        console.log('No token found');
        Alert.alert('Error', 'Authentication token not found');
        return;
      }
      console.log('Token found:', token);
      if (!date) {
        console.log('No date selected');
        Alert.alert('Error', 'Please select a date');
        return;
      }
      console.log('Date selected:', date);

      const eventDateTime = JSON.stringify([`${date}T${selectedTime.toISOString().slice(11, 16)}:00.000Z`]);
      console.log('Appended eventDateTime:', eventDateTime);

      const formData = new FormData();
      console.log('FormData created');
      formData.append('eventName', eventName.trim());
      console.log('Appended eventName:', eventName.trim());
      formData.append('venue', venueName.trim());
      console.log('Appended venueName:', venueName.trim());
      formData.append('eventDateTime', eventDateTime);
      console.log('Appended eventDateTime:', eventDateTime);

      const genreArray = genre.split(/\s|,+/)
        .map(g => g.trim())
        .filter(Boolean);
      formData.append('genre', JSON.stringify(genreArray));
      console.log('Appended genre:', JSON.stringify(genreArray));

      formData.append('isSoundSystem', soundSystemAvailable);
      console.log('Appended isSoundSystem:', soundSystemAvailable);
      formData.append('budget', budget);
      console.log('Appended budget:', budget);

      if (posterUrl) {
        console.log('Poster URL found:', posterUrl);
        formData.append('posterUrl', {
          uri: posterUrl,
          type: 'image/jpeg',
          name: 'event-poster.jpg',
        });
        console.log('Appended poster with URI:', posterUrl);
      } else {
        console.log('No poster URL found');
      }

      if (location) {
        console.log('Location found:', location);
        formData.append('location', location);
        console.log('Appended location:', location);
      } else {
        console.log('No location found');
      }

      if (about) {
        console.log('About found:', about);
        formData.append('about', about);
        console.log('Appended about:', about);
      }

      console.log('Sending request to:', `${API_BASE_URL}/host/events/create-event`);
      const response = await axios.post(
        `${API_BASE_URL}/host/events/create-event`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Response received:', { status: response.status, data: response.data });

      if (response.status === 200 || response.status === 201) {
        const eventId = response.data.data._id;
        console.log('Event created successfully', { eventId });
        Alert.alert('Success', 'Event created successfully');
        navigation.navigate('HostDetailBooking', { 
          artist, 
          eventId 
        });
      } else {
        console.log('Unexpected response status:', response.status);
        Alert.alert('Error', 'Failed to create event');
      }
    } catch (error) {
      console.log('Event creation error:', error?.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <LinearGradient
      colors={["#B15CDE", "#7952FC"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 0 }}
      style={[styles.container, { paddingTop: Math.max(insets.top, 0), borderRadius: 14 }]}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent, 
          { 
            paddingTop: Math.max(dimensions.spacing.md, 10),
            paddingBottom: Math.max(insets.bottom + 40, 60),
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View style={[
          styles.header,
          {
            marginTop: Math.max(dimensions.spacing.sm, 8),
            paddingTop: Math.max(dimensions.spacing.md, 10),
            paddingBottom: Math.max(dimensions.spacing.sm, 8),
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.backButton,
              {
                minWidth: Math.max(dimensions.buttonHeight * 0.8, 44),
                minHeight: Math.max(dimensions.buttonHeight * 0.8, 44),
              }
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={Math.max(dimensions.iconSize, 20)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.dateContainer,
              {
                minHeight: Math.max(dimensions.buttonHeight * 0.7, 40),
              }
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Feather name="calendar" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#a95eff" />
            <Text style={styles.dateText}>{date ? date : "Select Date"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleCameraPress}
          style={[
            styles.uploadContainer,
            {
              marginTop: Math.max(dimensions.spacing.lg, 15),
              marginBottom: Math.max(dimensions.spacing.lg, 15),
            }
          ]}
        >
          <CameraIcon style={{ marginRight: 10 }} />
          <Text style={styles.uploadButtonText}>Upload Event Poster</Text>
        </TouchableOpacity>
        {posterUrl && (
          <Image
            source={{ uri: posterUrl }}
            style={{ width: 160, height: 120, alignSelf: 'center', borderRadius: 8, marginBottom: 8 }}
            resizeMode="cover"
          />
        )}
        <Text style={styles.uploadHint}>The image dimension Should be ( 317 x 232 )px</Text>
        <Text style={styles.uploadHint}>Max Upload Size(10mb)</Text>
        <View style={[
          styles.inputContainer,
          {
            marginTop: Math.max(dimensions.spacing.sm, 8),
            marginBottom: Math.max(dimensions.spacing.lg, 16),
          }
        ]}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={[
              styles.input,
              { minHeight: Math.max(dimensions.inputHeight, 48) }
            ]}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Sounds of Celebration"
            placeholderTextColor="#666"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={[
          styles.inputContainer,
          { marginBottom: Math.max(dimensions.spacing.lg, 16) }
        ]}>
          <Text style={styles.label}>Venue Name</Text>
          <TextInput
            style={[
              styles.input,
              { minHeight: Math.max(dimensions.inputHeight, 48) }
            ]}
            value={venueName}
            onChangeText={setVenueName}
            placeholder="xyz"
            placeholderTextColor="#666"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={[
          styles.dateTimeContainer,
          {
            marginBottom: Math.max(dimensions.spacing.lg, 16),
            gap: Math.max(dimensions.spacing.md, 12),
          }
        ]}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.inputWithIcon,
                { minHeight: Math.max(dimensions.inputHeight, 48) }
              ]}
            >
              <TextInput
                style={styles.dateTimeInput}
                value={date}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
                editable={false}
              />
              <Feather 
                name="calendar" 
                size={Math.max(dimensions.iconSize * 0.8, 18)} 
                color="#a95eff" 
                style={styles.inputIcon} 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              style={[
                styles.inputWithIcon,
                { minHeight: Math.max(dimensions.inputHeight, 48) }
              ]}
            >
              <TextInput
                style={styles.dateTimeInput}
                value={time}
                placeholder="HH:mm"
                placeholderTextColor="#666"
                editable={false}
              />
              <Text style={styles.ampmText}>PM</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[
          styles.inputContainer,
          { marginBottom: Math.max(dimensions.spacing.lg, 16) }
        ]}>
          <Text style={styles.label}>Genre/Instrument</Text>
          <TextInput
            style={[
              styles.input,
              {
                minHeight: Math.max(dimensions.inputHeight, 48),
                paddingTop: Math.max(dimensions.spacing.md, 12),
                paddingBottom: Math.max(dimensions.spacing.md, 12),
              }
            ]}
            value={genre}
            onChangeText={setGenre}
            placeholder="#Rock Star #Electric Guitar #Soul Queen"
            placeholderTextColor="#666"
            multiline={true}
            textAlignVertical="top"
            autoCapitalize="words"
          />
        </View>

        <View style={[
          styles.checkboxContainer,
          { marginBottom: Math.max(dimensions.spacing.xl, 20) }
        ]}>
          <Text style={[
            styles.label,
            { marginBottom: Math.max(dimensions.spacing.md, 12) }
          ]}>Sound System Availability</Text>
          <View style={[
            styles.checkboxRow,
            { gap: Math.max(dimensions.spacing.xl, 24) }
          ]}>
            <CustomCheckbox
              label="Yes"
              isChecked={soundSystemAvailable}
              onValueChange={setSoundSystemAvailable}
            />
            <CustomCheckbox
              label="No"
              isChecked={!soundSystemAvailable}
              onValueChange={(newValue) => setSoundSystemAvailable(!newValue)}
            />
          </View>
        </View>

        <View style={[
          styles.inputContainer,
          { marginBottom: Math.max(dimensions.spacing.lg, 16) }
        ]}>
          <Text style={styles.label}>Budget</Text>
          <TextInput
            style={[
              styles.input,
              { minHeight: Math.max(dimensions.inputHeight, 48) }
            ]}
            value={budget}
            onChangeText={setBudget}
            placeholder="Enter budget"
            placeholderTextColor="#666"
            keyboardType="numeric"
          />
        </View>

        <View style={[
          styles.inputContainer,
          { marginBottom: Math.max(dimensions.spacing.lg, 16) }
        ]}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={[
              styles.input,
              { minHeight: Math.max(dimensions.inputHeight, 48) }
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter event location"
            placeholderTextColor="#666"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        <View style={[
          styles.inputContainer,
          { marginBottom: Math.max(dimensions.spacing.lg, 16) }
        ]}>
          <Text style={styles.label}>About Event</Text>
          <TextInput
            style={[
              styles.input,
              {
                minHeight: Math.max(dimensions.inputHeight * 2, 96),
                paddingTop: Math.max(dimensions.spacing.md, 12),
                paddingBottom: Math.max(dimensions.spacing.md, 12),
              }
            ]}
            value={about}
            onChangeText={setAbout}
            placeholder="Describe your event..."
            placeholderTextColor="#666"
            multiline={true}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />
        </View>

        <TouchableOpacity 
          style={styles.continueButton}
          activeOpacity={0.8}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const ShortlistCreateNewEventScreen = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <ShortlistCreateNewEventContent navigation={navigation} route={route} />
    </SafeAreaProvider>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Math.max(dimensions.spacing.xl, 20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Math.max(dimensions.headerHeight * 0.7, 54),
  },
  backButton: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 16,
    backgroundColor: 'transparent',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: Math.max(dimensions.spacing.sm, 8),
    paddingHorizontal: Math.max(dimensions.spacing.md, 12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dateText: {
    marginLeft: Math.max(dimensions.spacing.xs, 6),
    fontSize: 12,
    color: '#B15CDE',
    fontWeight: '600',
  },
  uploadContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFF',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  uploadButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: undefined,
    letterSpacing: -0.333,
  },
  uploadHint: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 15,
    marginTop: 1,
  },
  inputContainer: {
    // height:70, // Removed fixed height for better responsiveness
  },
  label: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: Math.max(dimensions.spacing.sm, 8),
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    paddingHorizontal: Math.max(dimensions.spacing.lg, 16),
    fontSize: Math.max(dimensions.fontSize.body, 14),
    color: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(169, 94, 255, 0.1)',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
  },
  timeInputContainer: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: dimensions.borderRadius.md,
    paddingVertical: Math.max(dimensions.spacing.md, 12),
    paddingHorizontal: Math.max(dimensions.spacing.lg, 16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(169, 94, 255, 0.1)',
  },
  dateTimeInput: {
    flex: 1,
    fontSize: Math.max(dimensions.fontSize.body, 14),
    color: '#000',
    padding: 0,
    margin: 0,
  },
  inputIcon: {
    marginLeft: Math.max(dimensions.spacing.sm, 8),
  },
  ampmText: {
    fontSize: Math.max(dimensions.fontSize.body, 14),
    color: '#B15CDE',
    marginLeft: Math.max(dimensions.spacing.xs, 6),
    fontWeight: '600',
  },
  checkboxContainer: {
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customCheckboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.max(dimensions.spacing.sm, 8),
    paddingHorizontal: Math.max(dimensions.spacing.xs, 4),
    minHeight: Math.max(dimensions.buttonHeight * 0.6, 44),
  },
  customCheckbox: {
    width: Math.max(dimensions.iconSize, 22),
    height: Math.max(dimensions.iconSize, 22),
    borderRadius: Math.max(dimensions.borderRadius.sm, 6),
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Math.max(dimensions.spacing.sm, 8),
  },
  customCheckboxChecked: {
    backgroundColor: 'transparent',
    borderColor: '#a95eff',
  },
  checkboxLabel: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 11,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
  },
  continueButton: {
    display: 'flex',
    width: 320,
    height: 44,
    paddingVertical: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    
    borderColor: '#FFF',
  },
  continueButtonText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ShortlistCreateNewEventScreen; 