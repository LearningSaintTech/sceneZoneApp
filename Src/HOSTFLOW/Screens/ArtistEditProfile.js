import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import CustomToggle from '../Components/CustomToggle';

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

const ArtistEditProfileScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('Franklin Clinton');
  const [dateOfBirth, setDateOfBirth] = useState('DD/MM/YYYY');
  const [email, setEmail] = useState('scenezone@gmail.com');
  const [address, setAddress] = useState('Location');
  const [genre, setGenre] = useState('Music');
  const [instrument, setInstrument] = useState('Guitar');
  const [budget, setBudget] = useState('500k');
  const [phoneNumber, setPhoneNumber] = useState('412-123-4215');
  const [crowdGuarantee, setCrowdGuarantee] = useState(false);
  const insets = useSafeAreaInsets();

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
            placeholder="Location"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="location-on" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Genre</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={genre}
            onChangeText={setGenre}
            placeholder="Music"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Instrument</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={instrument}
            onChangeText={setInstrument}
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
            placeholder="500k"
            placeholderTextColor="#aaa"
          />
          <MaterialIcons name="keyboard-arrow-down" size={20} color="#aaa" />
        </View>

        <Text style={styles.label}>Phone number</Text>
        <View style={styles.inputContainer}>
          <Text style={{color: '#fff'}}>🇮🇳 ▼</Text>
          <TextInput
            style={[styles.input, {marginLeft: 10}]}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="412-123-4215"
            placeholderTextColor="#aaa"
            keyboardType="phone-pad"
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
          <Text style={styles.label}>Performance Gallery</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.galleryLargeRow}>
          <TouchableOpacity style={styles.galleryLargeItem}>
            <Icon name="play-circle" size={48} color="#a95eff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.galleryLargeItem}>
            <Icon name="play-circle" size={48} color="#a95eff" />
          </TouchableOpacity>
        </View>
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

        <TouchableOpacity style={styles.continueButton}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueButtonText}>Save Changes</Text>
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
});

export default ArtistEditProfileScreen; 