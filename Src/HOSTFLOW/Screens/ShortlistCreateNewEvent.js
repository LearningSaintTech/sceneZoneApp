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
  Modal,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import CameraIcon from '../assets/icons/Camera';
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';

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

const ShortlistCreateNewEventContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [eventName, setEventName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [genre, setGenre] = useState('');
  const [soundSystemAvailable, setSoundSystemAvailable] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

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
            // Enhanced content padding with better safe area consideration
            paddingTop: Math.max(dimensions.spacing.md, 10),
            paddingBottom: Math.max(insets.bottom + 40, 60),
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Enhanced Header with comprehensive safe area handling */}
        <View style={[
          styles.header,
          {
            // Dynamic header positioning based on safe area
            marginTop: Math.max(dimensions.spacing.sm, 8),
            paddingTop: Math.max(dimensions.spacing.md, 10),
            paddingBottom: Math.max(dimensions.spacing.sm, 8),
          }
        ]}>
          <TouchableOpacity 
            style={[
              styles.backButton,
              {
                // Enhanced back button with better touch target
                minWidth: Math.max(dimensions.buttonHeight * 0.8, 44),
                minHeight: Math.max(dimensions.buttonHeight * 0.8, 44),
              }
            ]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={Math.max(dimensions.iconSize, 20)} color="#fff" />
          </TouchableOpacity>
          <View style={[
            styles.dateContainer,
            {
              // Enhanced date container with better responsive sizing
              minHeight: Math.max(dimensions.buttonHeight * 0.7, 40),
            }
          ]}>
            <TouchableOpacity onPress={() => setCalendarVisible(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name="calendar" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#a95eff" />
              <Text style={styles.dateText}>{date ? date : 'DD/MM/YYYY'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced Upload Event Poster with responsive constraints */}
        <View
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
        </View>
        <Text style={styles.uploadHint}>The image dimension Should be ( 317 x 232 )px</Text>
        <Text style={styles.uploadHint}>Max Upload Size(10mb)</Text>
        {/* Enhanced Event Details Inputs with better spacing */}
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
              {
                // Enhanced input with better minimum height
                minHeight: Math.max(dimensions.inputHeight, 48),
              }
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
          {
            marginBottom: Math.max(dimensions.spacing.lg, 16),
          }
        ]}>
          <Text style={styles.label}>Venue Name</Text>
          <TextInput
            style={[
              styles.input,
              {
                minHeight: Math.max(dimensions.inputHeight, 48),
              }
            ]}
            value={venueName}
            onChangeText={setVenueName}
            placeholder="xyz"
            placeholderTextColor="#666"
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>

        {/* Enhanced Date and Time Inputs with better responsive layout */}
        <View style={[
          styles.dateTimeContainer,
          {
            marginBottom: Math.max(dimensions.spacing.lg, 16),
            gap: Math.max(dimensions.spacing.md, 12),
          }
        ]}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.dateTimeInput}
                value={date}
                onChangeText={setDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={10}
              />
              <TouchableOpacity onPress={() => setCalendarVisible(true)}>
                <Feather 
                  name="calendar" 
                  size={Math.max(dimensions.iconSize * 0.8, 18)} 
                  color="#a95eff" 
                  style={styles.inputIcon} 
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.timeInputContainer}>
            <Text style={styles.label}>Time</Text>
            <View style={[
              styles.inputWithIcon,
              {
                minHeight: Math.max(dimensions.inputHeight, 48),
              }
            ]}>
              <TextInput
                style={styles.dateTimeInput}
                value={time}
                onChangeText={setTime}
                placeholder="08:00"
                placeholderTextColor="#666"
                keyboardType="numeric"
                maxLength={5}
              />
              <Text style={styles.ampmText}>PM</Text>
            </View>
          </View>
        </View>

        <View style={[
          styles.inputContainer,
          {
            marginBottom: Math.max(dimensions.spacing.lg, 16),
          }
        ]}>
          <Text style={styles.label}>Genre/Instrument</Text>
          <TextInput
            style={[
              styles.input,
              {
                minHeight: Math.max(dimensions.inputHeight, 48),
                // Enhanced multiline support for genre input
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

        {/* Enhanced Sound System Availability Checkbox with better spacing */}
        <View style={[
          styles.checkboxContainer,
          {
            marginBottom: Math.max(dimensions.spacing.xl, 20),
          }
        ]}>
          <Text style={[
            styles.label,
            {
              marginBottom: Math.max(dimensions.spacing.md, 12),
            }
          ]}>Sound System Availability</Text>
          <View style={[
            styles.checkboxRow,
            {
              gap: Math.max(dimensions.spacing.xl, 24),
            }
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

        {/* Enhanced Continue Button placed right after the last input section */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('HostDetailBooking')} 
          style={styles.continueButton}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' }}>
            <Calendar
              onDayPress={day => {
                setDate(day.dateString.split('-').reverse().join('/'));
                setCalendarVisible(false);
              }}
              theme={{
                backgroundColor: '#fff',
                calendarBackground: '#fff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#B15CDE',
                selectedDayTextColor: '#fff',
                todayTextColor: '#B15CDE',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: '#B15CDE',
                selectedDotColor: '#fff',
                arrowColor: '#B15CDE',
                monthTextColor: '#7952FC',
                indicatorColor: '#7952FC',
                textDayFontFamily: 'Nunito Sans',
                textMonthFontFamily: 'Nunito Sans',
                textDayHeaderFontFamily: 'Nunito Sans',
                textDayFontWeight: '400',
                textMonthFontWeight: '700',
                textDayHeaderFontWeight: '400',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 12,
              }}
            />
            <TouchableOpacity onPress={() => setCalendarVisible(false)} style={{ marginTop: 16, alignSelf: 'center' }}>
              <Text style={{ color: '#B15CDE', fontWeight: '700', fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const ShortlistCreateNewEventScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <ShortlistCreateNewEventContent navigation={navigation} />
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
    // Enhanced shadow for better visual hierarchy
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
    // Optionally, simulate blur with a subtle shadow (comment out if not needed)
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 8,
    // elevation: 4,
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
    // Enhanced container with consistent spacing
    height:70,
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
    // Enhanced shadow for better visual feedback
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
    // Enhanced shadow for consistency
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
    // Enhanced spacing for checkbox section
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
    // Enhanced minimum touch target
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
    width: '90%',
    height: dimensions.buttonHeight,
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