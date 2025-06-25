import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Assuming Ionicons for calendar/location/users
import BackButtonIcon from '../assets/icons/backbutton';
import CalIcon from '../assets/icons/cal';
import LocIcon from '../assets/icons/loc';
import CrowIcon from '../assets/icons/crow';
import LinearGradient from 'react-native-linear-gradient';

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
    large: Math.max(width * 0.05, 22),
    xlarge: Math.max(width * 0.055, 26),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.045, 18),
  imageHeight: Math.max(height * 0.25, 180),
  cardPadding: Math.max(width * 0.04, 15),
  marginHorizontal: Math.max(width * 0.04, 16),
};

const HostArtistContactContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  // Sample data
  const eventData = {
    image: require('../assets/Images/ffff.jpg'),
    title: 'Sounds of Celebration',
    date: 'May 20',
    location: 'Yogyakarta',
    crowdCapacity: '500',
  };

  const artistContact = {
    name: 'Luna Starfield',
    mobile: '+62 812-3456-7890',
    email: 'contact@creativecompany.com',
  };

  return (
    <View style={[
      styles.container,
      {
        // Comprehensive safe area handling for main container
        paddingTop: Math.max(insets.top, 0),
      }
    ]}>
      {/* Enhanced Header with responsive design */}
      <View style={[
        styles.header,
        {
          paddingHorizontal: dimensions.marginHorizontal,
          paddingTop: Math.max(dimensions.spacing.lg, 15),
          paddingBottom: Math.max(dimensions.spacing.md, 10),
          marginTop: Math.max(insets.top * 0.5, 10),
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
          <BackButtonIcon width={20} height={20} />
        </TouchableOpacity>
        <Text style={[
          styles.headerTitle,
          {
            fontSize: Math.max(dimensions.fontSize.header, 18),
          }
        ]}>
          Artist Contact
        </Text>
        <View style={{ width: Math.max(dimensions.iconSize + 4, 24) }} />
      </View>

      {/* Enhanced ScrollView with proper safe area handling */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom: Math.max(insets.bottom + 20, 30),
          }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Event Image and Title */}
        <View style={styles.eventContainer}>
          <Image
            source={eventData.image}
            style={styles.eventImageModern}
            resizeMode="cover"
          />
          <Text
            style={styles.eventTitleModern}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {eventData.title}
          </Text>
        </View>

        {/* Enhanced Event Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconLabelRow}>
              <CalIcon style={styles.detailIcon} width={13} height={12} />
              <Text style={styles.detailLabel}>Date</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">{eventData.date}</Text>
          </View>
          <View style={styles.detailSeparator} />
          <View style={[styles.detailItem, { marginLeft: -22 }]}>
            <View style={styles.detailIconLabelRow}>
              <LocIcon style={styles.detailIcon} width={13} height={12} />
              <Text style={styles.detailLabel}>Location</Text>
            </View>
            <Text
              style={[styles.detailValue, { marginLeft: 12 }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {eventData.location}
            </Text>
          </View>
          <View style={styles.detailSeparator} />
          <View style={[styles.detailItem, { marginLeft: -10 }]}>
            <View style={styles.detailIconLabelRow}>
              <CrowIcon style={styles.detailIcon} width={13} height={12} />
              <Text style={styles.detailLabel} numberOfLines={1} ellipsizeMode="tail">Crowd</Text>
            </View>
            <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">{eventData.crowdCapacity}</Text>
          </View>
        </View>

        {/* Enhanced Artist Contact Details */}
        <View style={[
          styles.contactCard,
          {
            marginHorizontal: dimensions.marginHorizontal,
            marginTop: Math.max(dimensions.spacing.lg, 15),
            borderRadius: dimensions.borderRadius.lg,
            padding: dimensions.cardPadding,
          }
        ]}>
          <View style={[styles.contactField, { marginBottom: 0 }]}>
            <Text style={styles.contactLabel}>Name</Text>
            <Text style={styles.contactValue}>{artistContact.name}</Text>
          </View>
          <View style={[styles.contactField, { marginBottom: 0 }]}>
            <Text style={styles.contactLabel}>Mobile</Text>
            <Text style={styles.contactValue}>{artistContact.mobile}</Text>
          </View>
          <View style={[styles.contactField, { marginBottom: 0 }]}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>{artistContact.email}</Text>
          </View>
        </View>

        {/* Enhanced Ticket Settings Button */}
        <View style={{ alignItems: 'center', width: '100%', marginTop: 40, marginBottom: 24 }}>
          <LinearGradient
            colors={['#B15CDE', '#7952FC']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ticketSettingsButton}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('HostTicketSetting')}
              style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 14 }}
              activeOpacity={0.8}
            >
              <Text style={styles.ticketSettingsButtonText}>
                Ticket Settings
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const HostArtistContactScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <HostArtistContactContent navigation={navigation} />
    </SafeAreaProvider>
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
    width: 393,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: 'rgba(104, 59, 252, 1)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  backButton: {
    // Enhanced touch target for better accessibility
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    marginRight:170,
  },
  scrollContent: {
    flexGrow: 1,
  },
  eventContainer: {
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    marginHorizontal: dimensions.marginHorizontal,
    marginTop: Math.max(dimensions.spacing.lg, 15),
    marginBottom: 20,
  },
  eventImageModern: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    marginBottom: 26,
  },
  eventTitleModern: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 18,
    
    fontStyle: 'normal',
    lineHeight: 24,
    marginLeft: 10,
    marginBottom: 0,
    overflow: 'hidden',
  },
  detailsCard: {
    backgroundColor: 'rgba(26, 26, 31, 1)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
    shadowColor: '#A95EFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    marginHorizontal: dimensions.marginHorizontal,
    marginTop: Math.max(dimensions.spacing.lg, 15),
    marginBottom: 20,
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    gap: 0,
  },
  detailIconLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailLabel: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginLeft: 0,
    marginRight: 15,
    marginBottom: 0,
    padding: 0,
  },
  detailValue: {
    color: '#8D6BFC',
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 14,
    fontStyle: 'normal',
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 0,
    overflow: 'hidden',
  },
  detailSeparator: {
    width: 1,
    height: 40,
    backgroundColor: '#1F1F25',
    alignSelf: 'center',
    marginRight:25,
  },
  contactCard: {
    backgroundColor: '#1A1A1F',
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'column',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34344A',
  },
  contactField: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactLabel: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 28,
    marginBottom: 2,
  },
  contactValue: {
    color: '#7952FC',
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 28,
    marginTop: -10,
  },
  ticketSettingsButton: {
    width: 361,
    height: 52,
    paddingVertical: 0,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
  },
  ticketSettingsButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default HostArtistContactScreen; 