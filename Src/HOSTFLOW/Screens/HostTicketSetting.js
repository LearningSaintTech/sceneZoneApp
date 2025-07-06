import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker'; // Added for date/time picking
import axios from 'axios'; // Added for API calls
import { useSelector } from 'react-redux'; // Added for token
import Camera from '../assets/icons/Camera';

const { width, height } = Dimensions.get('window');

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
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#C6C5ED',
        marginLeft: value ? 18 : 0,
        marginRight: value ? 0 : 18,
      }}
    />
  </TouchableOpacity>
);

const HostTicketSettingScreen = ({ navigation, route }) => {
  const [ticketType, setTicketType] = useState('paid'); // Changed to 'paid' or 'free'
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [aboutEvent, setAboutEvent] = useState('');
  const [startDate, setStartDate] = useState(null); // Changed to Date object
  const [endDate, setEndDate] = useState(null); // Changed to Date object
  const [startTime, setStartTime] = useState(null); // Changed to Date object
  const [endTime, setEndTime] = useState(null); // Changed to Date object
  const [ticketQuantity, setTicketQuantity] = useState('500');
  const [gstType, setGstType] = useState('inclusive'); // Changed to match API ('inclusive' or 'exclusive')
  const [price, setPrice] = useState('100');
  const [ticketStatus, setTicketStatus] = useState({
    Live: false,
    ComingSoon: true,
    SoldOut: false,
  });
  const [isTicketEnabled, setIsTicketEnabled] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(null); // For date picker visibility
  const [showTimePicker, setShowTimePicker] = useState(null); // For time picker visibility
  const token = useSelector(state => state.auth.token); // Get token from Redux
  const eventId = route.params?.eventId ; // Get eventId from route or use default
  console.log("evedffdfdfdfdfvdvfntId",eventId)
  const insets = useSafeAreaInsets();

  const handleUploadPoster = () => {
    console.log('Upload poster pressed', {
      timestamp: new Date().toISOString(),
    });
    // Implement image picker logic here
  };

  const handleDateSelect = (dateType, event, selectedDate) => {
    console.log(`Date selected for ${dateType}`, {
      timestamp: new Date().toISOString(),
      selectedDate,
    });
    const date = selectedDate || (event?.nativeEvent?.timestamp ? new Date(event.nativeEvent.timestamp) : null);
    if (date) {
      if (dateType === 'Start Date') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
    setShowDatePicker(null);
  };

  const handleTimeSelect = (timeType, event, selectedTime) => {
    console.log(`Time selected for ${timeType}`, {
      timestamp: new Date().toISOString(),
      selectedTime,
    });
    const time = selectedTime || (event?.nativeEvent?.timestamp ? new Date(event.nativeEvent.timestamp) : null);
    if (time) {
      if (timeType === 'Start Time') {
        setStartTime(time);
      } else {
        setEndTime(time);
      }
    }
    setShowTimePicker(null);
  };

  const handleGstTypeSelect = () => {
    console.log('Select GST Type pressed', {
      timestamp: new Date().toISOString(),
    });
    // Toggle between 'inclusive' and 'exclusive' for simplicity
    setGstType(gstType === 'inclusive' ? 'exclusive' : 'inclusive');
  };

  const getTicketStatusValue = () => {
    if (ticketStatus.Live) return 'live';
    if (ticketStatus.ComingSoon) return 'comingsoon';
    if (ticketStatus.SoldOut) return 'soldout';
    return 'comingsoon'; // Default
  };

  const handleSaveDetails = async () => {
    console.log('Save Details pressed', {
      timestamp: new Date().toISOString(),
      ticketType,
      eventName,
      location,
      aboutEvent,
      startDate,
      endDate,
      startTime,
      endTime,
      ticketQuantity,
      gstType,
      price,
      ticketStatus,
      isTicketEnabled,
      eventId,
    });

    if (!token) {
      console.warn('No token available, cannot save ticket settings', {
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Error', 'Please log in to save ticket settings');
      return;
    }

    if (!startDate || !endDate || !startTime || !endTime) {
      console.warn('Missing date or time fields', {
        timestamp: new Date().toISOString(),
      });
      Alert.alert('Error', 'Please select sales start and end dates and times');
      return;
    }

    // Combine date and time for salesStart and salesEnd
    const salesStart = new Date(startDate);
    salesStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
    const salesEnd = new Date(endDate);
    salesEnd.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

    const payload = {
      ticketType: ticketType.toLowerCase(), // 'paid' or 'free'
      salesStart: salesStart.toISOString(),
      salesEnd: salesEnd.toISOString(),
      gstType: ticketType === 'paid' ? gstType : undefined,
      price: ticketType === 'paid' ? parseFloat(price) : 0,
      totalQuantity: parseInt(ticketQuantity, 10),
      ticketStatus: getTicketStatusValue(),
      isEnabled: isTicketEnabled,
    };

    try {
      console.log('Sending ticket settings API request', {
        timestamp: new Date().toISOString(),
        url: `http://localhost:3000/api/host/${eventId}/ticket-settings`,
        payload,
        headers: { Authorization: `Bearer ${token}` },
      });
      const response = await axios.post(
        `http://localhost:3000/api/host/${eventId}/ticket-settings`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Ticket settings API response', {
        timestamp: new Date().toISOString(),
        response: response.data,
      });

      if (response.data.success) {
        Alert.alert('Success', 'Ticket settings updated successfully');
        navigation.goBack(); // Navigate back after successful save
      } else {
        console.error('Failed to update ticket settings', {
          timestamp: new Date().toISOString(),
          message: response.data.message,
        });
        Alert.alert('Error', response.data.message || 'Failed to update ticket settings');
      }
    } catch (error) {
      console.error('Error saving ticket settings', {
        timestamp: new Date().toISOString(),
        error: error.response?.data?.message || error.message,
        status: error.response?.status,
      });
      Alert.alert('Error', 'Failed to save ticket settings. Please try again.');
    }
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
        {/* Paid / Free Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              ticketType === 'paid' ? styles.toggleButtonActive : styles.toggleButtonInactive,
              { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
            ]}
            onPress={() => setTicketType('paid')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={ticketType === 'paid' ? ['#B15CDE', '#7952FC'] : ['#181828', '#181828']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.toggleButtonGradient}
            >
              <Text style={[
                styles.toggleButtonText,
                ticketType === 'paid' ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive,
              ]}>
                Paid
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              ticketType === 'free' ? styles.toggleButtonActive : styles.toggleButtonInactive,
              { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
            ]}
            onPress={() => setTicketType('free')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={ticketType === 'free' ? ['#B15CDE', '#7952FC'] : ['#181828', '#181828']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.toggleButtonGradient}
            >
              <Text style={[
                styles.toggleButtonText,
                ticketType === 'free' ? styles.toggleButtonTextActive : styles.toggleButtonTextInactive,
              ]}>
                RSVP/Free
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Upload Event Poster */}
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
           placeholderTextColor="#d1cfff"
        />

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
           placeholderTextColor="#d1cfff"
        />

        {/* About Event */}
        <Text style={styles.label}>About Event</Text>
        <TextInput
          style={[styles.input, styles.aboutInput]}
          value={aboutEvent}
          onChangeText={setAboutEvent}
           placeholderTextColor="#7952FC"
          multiline={true}
          numberOfLines={4}
        />

        {/* Sales Start From */}
        <Text style={styles.label}>Sales Start From</Text>
        <View style={styles.datePickerRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker('Start Date')}
          >
            <Text style={styles.datePickerText}>
              {startDate ? startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Start Date'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.datePickerDivider}>-</Text>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker('End Date')}
          >
            <Text style={styles.datePickerText}>
              {endDate ? endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'End Date'}
            </Text>
            <MaterialIcons name="calendar-today" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.datePickerIcon} />
          </TouchableOpacity>
        </View>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={showDatePicker === 'Start Date' ? (startDate || new Date()) : (endDate || new Date())}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => handleDateSelect(showDatePicker, event, selectedDate)}
          />
        )}

        {/* Start and End Time */}
        <View style={styles.timePickerRow}>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker('Start Time')}
            >
              <Text style={styles.timePickerText}>
                {startTime ? startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'HH:mm'}
              </Text>
              <MaterialIcons name="access-time" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.timePickerIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.timePickerColumn}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={styles.timePickerButton}
              onPress={() => setShowTimePicker('End Time')}
            >
              <Text style={styles.timePickerText}>
                {endTime ? endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'HH:mm'}
              </Text>
              <MaterialIcons name="access-time" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.timePickerIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Time Pickers */}
        {showTimePicker && (
          <DateTimePicker
            value={showTimePicker === 'Start Time' ? (startTime || new Date()) : (endTime || new Date())}
            mode="time"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedTime) => handleTimeSelect(showTimePicker, event, selectedTime)}
          />
        )}

        {/* Ticket Quantity (only if Paid or Free) */}
        {(ticketType === 'paid' || ticketType === 'free') && (
          <View>
            <Text style={styles.label}>Ticket Quantity</Text>
            <TextInput
              style={styles.input}
              value={ticketQuantity}
              onChangeText={setTicketQuantity}
               placeholderTextColor="#d1cfff"
              keyboardType="number-pad"
            />
          </View>
        )}

        {/* GST Type (only if Paid) */}
        {ticketType === 'paid' && (
          <View>
            <Text style={styles.label}>GST Type</Text>
            <TouchableOpacity style={styles.gstTypeButtonRow} onPress={handleGstTypeSelect}>
              <Text style={[styles.inputText, { color: gstType === 'inclusive' ? '#a95eff' : '#d1cfff' }]}>
                {gstType.charAt(0).toUpperCase() + gstType.slice(1)}
              </Text>
              <Feather name="chevron-down" size={Math.max(dimensions.iconSize * 0.8, 16)} color="#a95eff" style={styles.dropdownIcon} />
            </TouchableOpacity>
          </View>
        )}

        {/* Price (only if Paid) */}
        {ticketType === 'paid' && (
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

        {/* Ticket Status (only if Paid) */}
        {ticketType === 'paid' && (
          <View>
            <Text style={styles.label}>Ticket Status</Text>
            <View style={styles.ticketStatusContainer}>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.Live && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ Live: true, ComingSoon: false, SoldOut: false })}
              >
                <View style={[styles.customCheckbox, ticketStatus.Live && styles.customCheckboxChecked]}>
                  {ticketStatus.Live && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.Live && styles.ticketStatusTextActive]}>Live</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.ComingSoon && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ Live: false, ComingSoon: true, SoldOut: false })}
              >
                <View style={[styles.customCheckbox, ticketStatus.ComingSoon && styles.customCheckboxChecked]}>
                  {ticketStatus.ComingSoon && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.ComingSoon && styles.ticketStatusTextActive]}>Coming Soon</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.ticketStatusButton, ticketStatus.SoldOut && styles.ticketStatusButtonActive]}
                onPress={() => setTicketStatus({ Live: false, ComingSoon: false, SoldOut: true })}
              >
                <View style={[styles.customCheckbox, ticketStatus.SoldOut && styles.customCheckboxChecked]}>
                  {ticketStatus.SoldOut && <Feather name="check" size={16} color="#fff" />}
                </View>
                <Text style={[styles.ticketStatusText, ticketStatus.SoldOut && styles.ticketStatusTextActive]}>Sold Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Enable Ticket (only if Paid or Free) */}
        {(ticketType === 'paid' || ticketType === 'free') && (
          <View style={styles.enableTicketContainer}>
            <Text style={styles.label}>Enable Ticket</Text>
            <CustomToggle value={isTicketEnabled} onValueChange={setIsTicketEnabled} />
          </View>
        )}

        {/* Save Details Button */}
        {(ticketType === 'paid' || ticketType === 'free') && (
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveDetailsButton}
          >
            <TouchableOpacity
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              onPress={handleSaveDetails}
            >
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
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.xl,
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'center',
  },
  toggleButton: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    alignSelf: 'stretch',
    flexDirection: 'row',
    gap: 10,
    margin: 0,
    padding: 0,
  },
  toggleButtonActive: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  toggleButtonInactive: {
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
    borderRadius: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
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
    borderColor: '#C6C5ED',
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  uploadText: {
    color: '#C6C5ED',
    textAlign: 'center',
    fontFamily: 'Poppins',
    fontSize: 16,
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
    fontSize: dimensions.fontSize.body,
    color: '#d1cfff',
    marginBottom: dimensions.spacing.sm,
    fontWeight: '500',
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
    height: 48,
    paddingTop: 0,
    paddingRight: 16,
    paddingBottom: 0,
    paddingLeft: 48,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
    marginBottom: dimensions.spacing.xl,
  },
  datePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    height: '100%',
    minHeight: undefined,
    marginRight: 0,
  },
  datePickerText: {
    fontSize: dimensions.fontSize.title,
    color: '#d1cfff',
  },
  datePickerDivider: {
    fontSize: Math.max(dimensions.fontSize.header, 24),
    color: '#b3b3cc',
    marginHorizontal: dimensions.spacing.xs,
  },
  datePickerIcon: {
    marginLeft: dimensions.spacing.sm,
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
});

export default HostTicketSettingScreen; 