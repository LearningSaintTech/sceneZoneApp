import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { loginArtist } from '../Redux/slices/authSlice';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomToggle from '../Components/CustomToggle';

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

const CreateProfile = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [genre, setGenre] = useState('');
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [artistType, setArtistType] = useState('');
  const [isArtistTypeDropdownOpen, setIsArtistTypeDropdownOpen] = useState(false);
  const [instrument, setInstrument] = useState('');
  const [budget, setBudget] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [crowdGuarantee, setCrowdGuarantee] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const typeOptions = ['Music', 'Comedy', 'Magician', 'Anchor', 'Dancer', 'Poet'];
  const artistTypeOptions = ['Solo', 'Duo', 'Trio', '4PC', '5PC', 'Group'];

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

  const handleInputFocus = () => {
    closeDropdown();
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

  const handleContinue = () => {
    // Dispatch login action for artist
    dispatch(loginArtist({
      id: 'artist123',
      name: fullName || 'Kevin Richards',
      email: email || 'artist@example.com',
      phone: phoneNumber || '+91 412-123-4215'
    }));
    
    navigation.navigate('ArtistHome');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 50 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={require('../assets/Images/frame1.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <MaterialIcons name="camera-alt" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Full name</Text>
        <View style={[styles.inputContainer, { borderRadius: 12, borderColor: '#8D6BFC', backgroundColor: '#121212' }]}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            onFocus={handleInputFocus}
            placeholder="Franklin Clinton"
            placeholderTextColor="#aaa"
          />
        </View>

        <Text style={styles.label}>Date of Birth</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            onFocus={handleInputFocus}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="calendar-today" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={handleInputFocus}
            placeholder="scenezone@gmail.com"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
        </View>

        <Text style={styles.label}>Address</Text>
        <View style={[styles.inputContainer, { borderRadius: 12, borderColor: '#7A7A90', backgroundColor: '#121212' }]}>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            onFocus={handleInputFocus}
            placeholder="Location"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="location-on" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Type</Text>
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
            <Text style={styles.label}>Artist Type</Text>
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
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={instrument}
            onChangeText={setInstrument}
            onFocus={handleInputFocus}
            placeholder="Guitar"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Budget</Text>
         <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            onFocus={handleInputFocus}
            placeholder="500k"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Phone number</Text>
         <View style={styles.inputContainer}>
             {/* Country code input would go here */}
             <Text style={{color: '#fff'}}>🇮🇳 ▼</Text>
          <TextInput
            style={[styles.input, {marginLeft: 10}] }
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            onFocus={handleInputFocus}
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
          <Text style={styles.label}>Performance Gallery</Text>
          <TouchableOpacity>
             <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        {/* First row: two large upload boxes */}
        <View style={styles.galleryLargeRow}>
          <TouchableOpacity style={styles.galleryLargeItem}>
            <Icon name="play-circle" size={48} color="#a95eff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryLargeItem}>
            <Icon name="play-circle" size={48} color="#a95eff" />
          </TouchableOpacity>
        </View>
        {/* Second row: three small boxes */}
        <View style={styles.galleryPlaceholderContainer}>
          <TouchableOpacity style={styles.galleryPlaceholderItem}>
            <Icon name="play-circle" size={32} color="#a95eff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryPlaceholderItem}>
            <Icon name="play-circle" size={32} color="#a95eff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryPlaceholderItem}>
            <Icon name="play-circle" size={32} color="#a95eff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={() => navigation.navigate('ArtistUpload')}>
           <Text style={styles.uploadButtonText}>Upload</Text>
           <Icon name="upload" size={20} color="#fff" style={{marginLeft: 5}} />
        </TouchableOpacity>


        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </LinearGradient>
        </TouchableOpacity>

      </ScrollView>
    </View>
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
});

export default CreateProfile; 