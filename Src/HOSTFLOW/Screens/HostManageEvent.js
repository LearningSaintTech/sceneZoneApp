import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import TrashIcon from '../assets/icons/trash';
import MaskedView from '@react-native-masked-view/masked-view';

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
    xlarge: Math.max(width * 0.055, 22),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.max(height * 0.25, 180),
  cardPadding: Math.max(width * 0.025, 10),
  marginHorizontal: Math.max(width * 0.04, 16),
  artistImageSize: Math.max(width * 0.15, 60),
  dateOverlaySize: Math.max(width * 0.12, 48),
};

// Sample data for artist status cards
const artistStatusData = [
  { id: '1', image: require('../assets/Images/frame1.png'), budget: '$500', genre: 'Rock', status: 'Pending', date: '06 Feb 2025' },
  { id: '2', image: require('../assets/Images/frame1.png'), budget: '$500', genre: 'Rock', status: 'Pay Booking Amount', date: '06 Feb 2025' },
  { id: '3', image: require('../assets/Images/frame1.png'), budget: '$500', genre: 'Rock', status: 'Booked', date: '06 Feb 2025' },
  { id: '4', image: require('../assets/Images/frame1.png'), budget: '$500', genre: 'Rock', status: 'Rejected', date: '06 Feb 2025' },
];

// GradientText component for gradient text rendering
const GradientText = ({ text, style, colors = ['#B15CDE', '#7952FC'] }) => (
  <MaskedView maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>}>
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={[style, { opacity: 0 }]}>{text}</Text>
    </LinearGradient>
  </MaskedView>
);

const HostManageEventContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  // Retrieve eventId from route.params or use fallback
  const eventId = route.params?.eventId ;
console.log("manage events ",eventId)
  // Sample event data
  const eventData = {
    image: require('../assets/Images/ffff.jpg'),
    title: 'Sounds of Celebration',
    date: 'May 20',
  };

  const renderArtistStatusCard = ({ item }) => {
    let statusButton;
    let statusButtonStyle = {};
    let statusButtonTextStyle = {};
    let showPlusButton = false;

    switch (item.status) {
      case 'Pending':
        statusButtonStyle = styles.statusButtonPending;
        statusButtonTextStyle = styles.statusButtonTextPending;
        break;
      case 'Pay Booking Amount':
        statusButtonStyle = styles.statusButtonPayBooking;
        statusButtonTextStyle = styles.statusButtonTextPayBooking;
        break;
      case 'Booked':
        statusButtonStyle = styles.statusButtonBooked;
        statusButtonTextStyle = styles.statusButtonTextBooked;
        break;
      case 'Rejected':
        statusButtonStyle = styles.statusButtonRejected;
        statusButtonTextStyle = styles.statusButtonTextRejected;
        showPlusButton = true;
        break;
      default:
        break;
    }

    return (
      <View style={[
        styles.artistCard,
        {
          padding: dimensions.cardPadding,
          marginBottom: Math.max(dimensions.spacing.lg, 15),
          borderRadius: dimensions.borderRadius.md,
        }
      ]}>
        <Image 
          source={item.image} 
          style={[
            styles.artistImage,
            {
              width: dimensions.artistImageSize,
              height: dimensions.artistImageSize,
              borderRadius: dimensions.borderRadius.sm,
              marginRight: Math.max(dimensions.spacing.md, 10),
            }
          ]} 
        />
        <View style={styles.artistInfo}>
          <Text style={[
            styles.artistBudget,
            {
              fontSize: Math.max(dimensions.fontSize.body, 14),
            }
          ]}>
            Budget : {item.budget}
          </Text>
          <Text style={[
            styles.artistGenre,
            {
              color: '#A6A6A6',
              fontSize: Math.max(dimensions.fontSize.body, 14),
              marginVertical: Math.max(dimensions.spacing.xs, 2),
              fontWeight: '400',
              fontFamily: 'Poppins',
            }
          ]}>
            Genre : <Text style={{ color: '#000', fontFamily: 'Poppins', fontSize: 16, fontWeight: '600' }}>{item.genre}</Text>
          </Text>
          <View style={[
            styles.artistStatusRow,
            {
              marginTop: Math.max(dimensions.spacing.xs, 5),
            }
          ]}>
            <Text style={[
              styles.artistStatusLabel,
              {
                fontSize: Math.max(dimensions.fontSize.body, 14),
              }
            ]}>
              Status : 
            </Text>
            <TouchableOpacity 
              style={[
                statusButtonStyle,
                {
                  // Remove extra minWidth/padding for Pay Booking Amount and Booked
                }
              ]}
              onPress={() => item.status === 'Pay Booking Amount' && navigation.navigate('HostManageEventDetailBooking')}
              activeOpacity={0.8}
            >
              {item.status === 'Pay Booking Amount' ? (
                <GradientText
                  text={item.status}
                  style={[
                    styles.statusButtonTextPayBooking,
                    {
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      fontWeight: '400',
                      textTransform: 'capitalize',
                      lineHeight: undefined,
                    },
                  ]}
                />
              ) : item.status === 'Booked' ? (
                <GradientText
                  text={item.status}
                  colors={['#28a745', '#43e97b']}
                  style={[
                    styles.statusButtonTextBooked,
                    {
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      fontWeight: '400',
                      textTransform: 'capitalize',
                      lineHeight: undefined,
                    },
                  ]}
                />
              ) : item.status === 'Rejected' ? (
                <GradientText
                  text={item.status}
                  colors={['#FF3B30', '#FF3B30']}
                  style={[
                    styles.statusButtonTextRejected,
                    {
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      fontWeight: '400',
                      textTransform: 'capitalize',
                      lineHeight: undefined,
                    },
                  ]}
                />
              ) : item.status === 'Pending' ? (
                <GradientText
                  text={item.status}
                  colors={['#FF9500', '#FFC371']}
                  style={[
                    styles.statusButtonTextPending,
                    {
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      fontWeight: '400',
                      textTransform: 'capitalize',
                      lineHeight: undefined,
                    },
                  ]}
                />
              ) : (
                <Text style={[
                  statusButtonTextStyle,
                  {
                    fontSize: Math.max(dimensions.fontSize.small, 12),
                    fontWeight: 'bold',
                  }
                ]}>
                  {item.status}
                </Text>
              )}
            </TouchableOpacity>
            {showPlusButton && (
              <TouchableOpacity 
                style={[
                  styles.plusButton,
                  {
                    borderRadius: Math.max(dimensions.borderRadius.lg, 15),
                    width: Math.max(dimensions.spacing.xxl + 6, 30),
                    height: Math.max(dimensions.spacing.xxl + 6, 30),
                    marginLeft: Math.max(dimensions.spacing.md, 10),
                  }
                ]}
                activeOpacity={0.8}
              >
                <Feather name="plus" size={Math.max(dimensions.iconSize * 0.8, 18)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.artistActions}>
          <Text style={[
            styles.artistDate,
            {
              fontSize: Math.max(dimensions.fontSize.small, 12),
              marginBottom: Math.max(dimensions.spacing.xs, 5),
            }
          ]}>
            {item.date}
          </Text>
          <TouchableOpacity 
            style={styles.trashButton}
            activeOpacity={0.7}
          >
            <TrashIcon width={14} height={14} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      {
        paddingTop: Math.max(insets.top, 0),
      }
    ]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom + 30, 50),
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[
          styles.header,
          {
            width: 393,
            paddingTop: 20,
            paddingBottom: 20,
            paddingRight: 90,
            alignItems: 'center',
            gap: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#C6C5ED',
            backgroundColor: '#121212',
            shadowColor: '#683BFC',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 4,
          }
        ]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={[
              styles.backButton,
              {
                padding: Math.max(dimensions.spacing.sm, 8),
                borderRadius: dimensions.borderRadius.sm,
              }
            ]}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={Math.max(dimensions.iconSize + 4, 24)} color="#fff" />
          </TouchableOpacity>
          <Text style={[
            styles.headerTitle,
            {
              fontSize: Math.max(dimensions.fontSize.header, 18),
            }
          ]}>
            {eventData.title}
          </Text>
          <View style={{ width: Math.max(dimensions.iconSize + 4, 24) }} />
        </View>

        {/* Event Image with Date Overlay */}
        <View style={[
          styles.imageContainer,
          {
            marginHorizontal: dimensions.marginHorizontal,
            marginTop: Math.max(dimensions.spacing.lg, 15),
            borderRadius: dimensions.borderRadius.lg,
          }
        ]}>
          <Image 
            source={eventData.image} 
            style={[
              styles.eventImage,
              {
                height: dimensions.imageHeight,
                borderRadius: dimensions.borderRadius.lg,
              }
            ]} 
            resizeMode="cover" 
          />
          <View style={[
            styles.dateOverlay,
            {
              top: Math.max(dimensions.spacing.md, 10),
              left: Math.max(dimensions.spacing.md, 10),
              borderRadius: dimensions.borderRadius.sm,
              paddingHorizontal: Math.max(dimensions.spacing.sm, 8),
              paddingVertical: Math.max(dimensions.spacing.xs, 4),
              minWidth: dimensions.dateOverlaySize,
            }
          ]}>
            <Text style={[
              styles.dateMonth,
              {
                fontSize: Math.max(dimensions.fontSize.small, 12),
              }
            ]}>
              {eventData.date.split(' ')[0]}
            </Text>
            <Text style={[
              styles.dateDay,
              {
                fontSize: Math.max(dimensions.fontSize.header, 18),
              }
            ]}>
              {eventData.date.split(' ')[1]}
            </Text>
          </View>
        </View>

        {/* Event Title */}
        <Text style={[
          styles.eventTitle,
          {
            fontSize: Math.max(dimensions.fontSize.large, 20),
            marginHorizontal: dimensions.marginHorizontal,
            marginTop: Math.max(dimensions.spacing.md, 10),
          }
        ]}>
          {eventData.title}
        </Text>
        <View style={styles.sectionSeparator} />

        {/* Artists Status Section */}
        <Text style={[
          styles.sectionTitle,
          {
            fontSize: Math.max(dimensions.fontSize.title, 16),
            marginBottom: Math.max(dimensions.spacing.md, 10),
            marginLeft: dimensions.marginHorizontal,
          }
        ]}>
          Artists Status :
        </Text>
        <View style={[
          styles.artistStatusSection,
          {
            marginTop: Math.max(dimensions.spacing.lg, 15),
            paddingHorizontal: dimensions.marginHorizontal,
          }
        ]}>
          {artistStatusData.map((item) => (
            <View key={item.id}>
              {renderArtistStatusCard({ item })}
            </View>
          ))}
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Action Buttons */}
        <View style={[
          styles.eventActionButtonsContainer,
          {
            marginTop: Math.max(dimensions.spacing.lg, 15),
            marginHorizontal: dimensions.marginHorizontal,
          }
        ]}>
          <View style={styles.topActionButtonsContainer}>
            <LinearGradient
              colors={['#B15CDE', '#7952FC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradientBorderButton, { marginRight: 5 }]}
            >
              <LinearGradient
                colors={['#b33bf6', '#a95eff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cancelEventButton}
              >
                <TouchableOpacity
                  style={{ width: '100%' }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelEventButtonText}>Cancel Event</Text>
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
            <TouchableOpacity
              style={styles.eventCompletedButton}
              activeOpacity={0.8}
            >
              <GradientText
                text="Event Completed"
                colors={['#B15CDE', '#7952FC']}
                style={styles.eventCompletedButtonText}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.ticketSettingsButton}
            onPress={() => {
              console.log('Navigating to HostTicketSettingScreen', {
                timestamp: new Date().toISOString(),
                eventId,
              });
              navigation.navigate('HostTicketSetting', { eventId });
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.ticketSettingsButtonText}>Ticket Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const HostManageEventScreen = ({ navigation, route }) => {
  return (
    <SafeAreaProvider>
      <HostManageEventContent navigation={navigation} route={route} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  backButton: {
    // Enhanced touch target for better accessibility
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 600,
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    
    
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
  },
  imageContainer: {
    overflow: 'hidden',
    position: 'relative',
    // Enhanced shadow for better depth perception
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  eventImage: {
    width: '100%',
  },
  dateOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dateDay: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventTitle: {
    fontWeight: 500,
    
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  artistStatusSection: {
    // Container styles handled dynamically
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: '600',
  },
  artistCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    // Enhanced shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  artistImage: {
    // Dimensions handled dynamically
  },
  artistInfo: {
    flex: 1,
  },
  artistBudget: {
    color: '#6A6A6A',
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: undefined, // normal
  },
  artistGenre: {
    color: '#888',
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: undefined, // normal
  },
  artistStatusLabel: {
    color: '#888',
  },
  artistStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Status Button Styles
  statusButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusButtonPending: {
    display: 'flex',
    width: 78,
    height: 20,
    marginLeft:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FF9500',
    backgroundColor: 'transparent',
  },
  statusButtonTextPending: {
    color: '#FF9500',
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: undefined, // normal
    textTransform: 'capitalize',
    
  },
  statusButtonPayBooking: {
    height: 20,
    paddingHorizontal: 12,
    marginLeft:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#B15CDE',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  statusButtonBooked: {
    height: 20,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginLeft:10,
    borderWidth: 0.5,
    borderColor: '#28a745',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  statusButtonTextBooked: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    textTransform: 'capitalize',
    lineHeight: undefined, // normal
  },
  statusButtonRejected: {
    height: 20,
    paddingHorizontal: 12,
    marginLeft:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FF3B30',
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  statusButtonTextRejected: {
    fontFamily: 'Poppins',
    fontSize: 10,
    fontWeight: '400',
    textTransform: 'capitalize',
    lineHeight: undefined, // normal
  },
  plusButton: {
    backgroundColor: '#a95eff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistActions: {
    alignItems: 'flex-end',
  },
  artistDate: {
    color: '#a95eff',
  },
  trashButton: {
    display: 'flex',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#FF3B30',
  },
  eventActionButtonsContainer: {
    // Margins handled dynamically
  },
  topActionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  gradientBorderButton: {
    flex: 1,
    borderRadius: 12,
    padding: 1.5, // border thickness
    marginRight: 5,
    marginLeft: 0,
  },
  cancelEventButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelEventButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  eventCompletedButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#A95EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCompletedButtonText: {
    color: '#A95EFF',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  ticketSettingsButton: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#C6C5ED',
    backgroundColor: 'transparent',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketSettingsButtonText: {
    color: '#C6C5ED',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
  },
  buttonTouchableOpacity: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionSeparator: {
    width: 319,
    height: 1,
    backgroundColor: '#4F4F59',
    alignSelf: 'center',
    marginVertical: 16, // optional, for spacing
  },
});

export default HostManageEventScreen; 