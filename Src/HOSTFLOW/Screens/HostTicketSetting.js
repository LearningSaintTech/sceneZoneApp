import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Camera from '../assets/icons/Camera';
// You may need to import a date/time picker library here later
// import DatePicker from 'react-native-date-picker';

const { width, height } = Dimensions.get('window');

// Enhanced responsive dimensions system for all Android devices
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
    small: Math.max(width * 0.03, 12),
    body: Math.max(width * 0.035, 14),
    title: Math.max(width * 0.04, 16),
    header: Math.max(width * 0.045, 18),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  inputHeight: Math.max(height * 0.055, 40),
  iconSize: Math.max(width * 0.06, 20),
  uploadBoxHeight: Math.min(height * 0.12, 100),
};

const CustomToggle = ({ value, onValueChange }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => onValueChange(!value)}
    style={{
      width: 48,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#8D6BFC',
      backgroundColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2,
    }}
  >
    {value ? (
      <LinearGradient
        colors={['#B15CDE', '#7952FC']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 14,
        }}
      />
    ) : null}
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#C6C5ED',
        marginLeft: value ? 18 : 0,
        marginRight: value ? 0 : 18,
        zIndex: 1,
      }}
    />
  </TouchableOpacity>
);

const HostTicketSettingScreen = ({ navigation }) => {
  const [ticketType, setTicketType] = useState('Paid'); // 'Paid' or 'RSVP/Free'
  const [eventName, setEventName] = useState('Sounds of Celebration');
  const [location, setLocation] = useState('Noida, Sector 63');
  const [aboutEvent, setAboutEvent] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('500');
  const [gstType, setGstType] = useState('18%');
  const [price, setPrice] = useState('100'); // New state for Price
  const [ticketStatus, setTicketStatus] = useState({ // New state for Ticket Status
    Live: false,
    ComingSoon: false,
    SoldOut: true,
  });
  const [isTicketEnabled, setIsTicketEnabled] = useState(true); // New state for Enable Ticket toggle
  const insets = useSafeAreaInsets();

  // Placeholder functions for future implementation
  const handleUploadPoster = () => {
    console.log('Upload poster pressed');
    // Implement image picker logic here
  };

  const handleDateSelect = (dateType) => {
    console.log(`Select ${dateType} pressed`);
    // Implement date picker logic here
  };

  const handleTimeSelect = (timeType) => {
    console.log(`Select ${timeType} pressed`);
    // Implement time picker logic here
  };

  const handleGstTypeSelect = () => {
    console.log('Select GST Type pressed');
    // Implement dropdown/picker logic here
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          paddingTop: Platform.OS === 'ios' ? 20 : Math.max(insets.top + 10, 20),
        }
      ]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={dimensions.iconSize} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Settings</Text>
        <View style={{ width: dimensions.iconSize }} />
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollViewContent,
          {
            paddingBottom: Math.max(insets.bottom + 100, 120),
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Paid / RSVP Toggle */}
        <View style={styles.toggleContainer}>
          {/* Paid Button */}
          {ticketType === 'Paid' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.toggleButton, styles.toggleButtonActive]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
                onPress={() => setTicketType('Paid')}
                activeOpacity={1}
              >
                <Text style={[styles.toggleButtonText, styles.toggleButtonTextActive]}>Paid</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.toggleButton, styles.toggleButtonInactive]}>
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
                onPress={() => setTicketType('Paid')}
                activeOpacity={1}
              >
                <Text style={[styles.toggleButtonText, styles.toggleButtonTextInactive]}>Paid</Text>
              </TouchableOpacity>
            </View>
          )}
          {/* RSVP/Free Button */}
          {ticketType === 'RSVP/Free' ? (
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.toggleButton, styles.toggleButtonActive]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
                onPress={() => setTicketType('RSVP/Free')}
                activeOpacity={1}
              >
                <Text style={[styles.toggleButtonText, styles.toggleButtonTextActive]}>RSVP/Free</Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.toggleButton, styles.toggleButtonInactive]}>
              <TouchableOpacity
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
                onPress={() => setTicketType('RSVP/Free')}
                activeOpacity={1}
              >
                <Text style={[styles.toggleButtonText, styles.toggleButtonTextInactive]}>RSVP/Free</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.dividerLineCustom} />
        <TouchableOpacity style={styles.uploadContainer} onPress={handleUploadPoster}>
          <Camera width={25} height={24} style={{ marginBottom: 4 }} />
          <Text style={styles.uploadText}>Upload Event Poster</Text>
        </TouchableOpacity>
        <View style={styles.uploadHintBox}>
          <Text style={styles.uploadHint}>The image dimension should be ( 317 × 232 )px</Text>
          <Text style={styles.uploadHint}>Max Upload Size( 10mb )</Text>
        </View>

        {/* Event Name */}
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={eventName}
          onChangeText={setEventName}
          placeholder="Sounds of Celebration"
          placeholderTextColor="#d1cfff"
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Noida, Sector 63"
          placeholderTextColor="#d1cfff"
        />

        {/* About Event */}
        <Text style={styles.label}>About Event</Text>
        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={aboutEvent}
          onChangeText={setAboutEvent}
          placeholder="Write here"
          placeholderTextColor="#7952FC"
          placeholderStyle={{ paddingTop: 20 }}
          multiline={true}
          numberOfLines={4}
        />

        {/* Sales Start From */}
        <Text style={styles.label}>Sales Start From</Text>
        <View style={styles.datePickerRow}>
          <TouchableOpacity style={styles.datePickerButton} onPress={() => handleDateSelect('Start Date')}>
            <Text style={styles.datePickerText}>{startDate || 'Start Date'}</Text>
          </TouchableOpacity>
          <Text style={styles.datePickerDivider}>-</Text>
          <TouchableOpacity style={styles.datePickerEndButton} onPress={() => handleDateSelect('End Date')}>
            <Text style={[styles.datePickerText, { textAlign: 'right' }]}>{endDate || 'End Date'}</Text>
          </TouchableOpacity>
          <View style={styles.datePickerIconWrapper}>
            <MaterialIcons name="calendar-today" size={28} color="#B392FF" />
          </View>
        </View>

        {/* Start and End Time */}
        <View style={styles.timePickerRow}>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity style={styles.timePickerButton} onPress={() => handleTimeSelect('Start Time')}>
              <Text style={styles.timePickerText}>{startTime || 'HH:mm'}</Text>
              <MaterialIcons name="access-time" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.timePickerIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity style={styles.timePickerButton} onPress={() => handleTimeSelect('End Time')}>
              <Text style={styles.timePickerText}>{endTime || 'HH:mm'}</Text>
              <MaterialIcons name="access-time" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.timePickerIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Ticket Quantity (only if Paid or RSVP/Free) */}
        {(ticketType === 'Paid' || ticketType === 'RSVP/Free') && (
          <View>
            <Text style={styles.label}>Ticket Quantity</Text>
            <TextInput
              style={styles.input}
              value={ticketQuantity}
              onChangeText={setTicketQuantity}
              placeholder="500"
              placeholderTextColor="#d1cfff"
              keyboardType="number-pad"
            />
          </View>
        )}

        {/* GST Type (only if Paid) */}
        {ticketType === 'Paid' && (
          <View>
            <Text style={styles.label}>GST Type</Text>
            <TouchableOpacity style={styles.gstTypeButtonRow} onPress={handleGstTypeSelect}>
              <Text style={[styles.inputText, { color: gstType === '18%' ? '#a95eff' : '#d1cfff' }]}>{gstType || '18%'}</Text>
              <Feather name="chevron-down" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Price (only if Paid) */}
        {ticketType === 'Paid' && (
          <View>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="100"
              placeholderTextColor="#d1cfff"
              keyboardType="decimal-pad"
            />
          </View>
        )}

        {/* Ticket Status (show for both Paid and RSVP/Free) */}
        {(ticketType === 'Paid' || ticketType === 'RSVP/Free') && (
          <View>
            <Text style={styles.label}>Ticket Status</Text>
            <View style={styles.ticketStatusContainer}>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.Live && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ ...ticketStatus, Live: !ticketStatus.Live })}
              >
                <View style={[styles.customCheckbox, ticketStatus.Live && styles.customCheckboxChecked]}>
                  {ticketStatus.Live && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.Live && styles.ticketStatusTextActive]}>Live</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.ComingSoon && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ ...ticketStatus, ComingSoon: !ticketStatus.ComingSoon })}
              >
                <View style={[styles.customCheckbox, ticketStatus.ComingSoon && styles.customCheckboxChecked]}>
                  {ticketStatus.ComingSoon && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.ComingSoon && styles.ticketStatusTextActive]}>Coming Soon</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.SoldOut && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ ...ticketStatus, SoldOut: !ticketStatus.SoldOut })}
              >
                <View style={[styles.customCheckbox, ticketStatus.SoldOut && styles.customCheckboxChecked]}>
                  {ticketStatus.SoldOut && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.SoldOut && styles.ticketStatusTextActive]}>Sold Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Enable Ticket (only if Paid or RSVP/Free) */}
        {(ticketType === 'Paid' || ticketType === 'RSVP/Free') && (
          <View style={styles.enableTicketContainer}>
            <Text style={styles.label}>Enable Ticket</Text>
            <CustomToggle value={isTicketEnabled} onValueChange={setIsTicketEnabled} />
          </View>
        )}

        {(ticketType === 'Paid' || ticketType === 'RSVP/Free') && (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveDetailsButton}
          >
            <TouchableOpacity style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.saveDetailsButtonText}>Save Details</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

      </ScrollView>

    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderColor: '#2d2d3a',
    minHeight: Math.max(dimensions.buttonHeight * 1.2, 60),
  },
  backButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    minWidth: dimensions.iconSize + 8,
    minHeight: dimensions.iconSize + 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: dimensions.fontSize.header,
    fontWeight: 'bold',
    color: '#fff',
    marginRight:150,
  },
  scrollViewContent: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.xl,
  },
  toggleContainer: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
    gap: 12,
    paddingHorizontal: 0,
  },
  toggleButton: {
    flex: 1,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'stretch',
    flexDirection: 'row',
    margin: 0,
    padding: 0,
    shadowColor: 'rgba(177, 92, 222, 0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  toggleButtonActive: {
    backgroundColor: 'transparent',
    shadowColor: '#B15CDE',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  toggleButtonInactive: {
    backgroundColor: '#181828',
    borderWidth: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleButtonGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito Sans',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  toggleButtonTextInactive: {
    color: '#C6C5ED',
  },
  uploadContainer: {
    marginTop:10,
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C6C5ED',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  uploadText: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: undefined,
    letterSpacing: -0.333,
    marginTop: dimensions.spacing.sm,
    paddingBottom: 10,
  },
  uploadHint: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginTop: dimensions.spacing.xs,
    textAlign: 'center',
  },
  label: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: dimensions.spacing.sm,
  },
  input: {
    backgroundColor: '#121212',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 48,
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#24242D',
    fontSize: dimensions.fontSize.title,
    color: '#d1cfff',
    marginBottom: dimensions.spacing.xl,
  },
  aboutInput: {
    backgroundColor: '#121212',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 48,
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: '#24242D',
    textAlignVertical: 'top',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingTop: 0,
    paddingRight: 24,
    paddingBottom: 0,
    paddingLeft: 24,
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: 'transparent',
    marginBottom: dimensions.spacing.xl,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: '100%',
    minHeight: undefined,
    marginRight: 0,
  },
  datePickerText: {
    fontSize: 13,
    color: '#B392FF',
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    textAlign: 'left',
    flex: 1,
  },
  datePickerDivider: {
    fontSize: 32,
    color: '#B392FF',
    marginHorizontal: 0,
    textAlign: 'center',
    width: 30,
  },
  datePickerEndButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: '100%',
    minHeight: undefined,
    marginLeft: 0,
  },
  datePickerIconWrapper: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.xl,
  },
  timePickerColumn: {
    flex: 1,
    marginRight: dimensions.spacing.md,
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 16,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
  },
  timePickerText: {
    fontSize: dimensions.fontSize.title,
    color: '#d1cfff',
  },
  timePickerIcon: {
    marginLeft: dimensions.spacing.sm,
  },
  dropdownIcon: {
    marginLeft: 'auto',
  },
  inputText: {
    fontSize: dimensions.fontSize.title,
    flex: 1,
    textAlign: 'left',
    marginRight: 0,
    marginTop: 0,
  },
  ticketStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2d2d3a',
    backgroundColor: 'transparent',
    padding: 16,
    marginBottom: dimensions.spacing.xl,
  },
  ticketStatusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 8,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    minHeight: 32,
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#7952FC',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  customCheckboxChecked: {
    backgroundColor: '#7952FC',
    borderColor: '#7952FC',
  },
  ticketStatusText: {
    fontSize: dimensions.fontSize.body,
    color: '#7A7A90',
    fontWeight: '400',
  },
  ticketStatusTextActive: {
    color: '#a95eff',
    fontWeight: 'bold',
  },
  enableTicketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.xl,
    minHeight: Math.max(dimensions.buttonHeight * 0.8, 40),
  },
  saveDetailsButton: {
    borderRadius: 16,
    minHeight: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  saveDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  uploadHintBox: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  gstTypeButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#8D6BFC',
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: '#121212',
    height: 48,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
    marginBottom: dimensions.spacing.xl,
  },
  dividerLineCustom: {
    width: 361,
    height: 1,
    backgroundColor: '#34344A',
    alignSelf: 'center',
    marginVertical: 18,
  },
});

export default HostTicketSettingScreen; 