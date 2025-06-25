import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DeleteIcon from '../assets/icons/delete';
import Calender from '../assets/icons/Calender';
import RingIcon from '../assets/icons/ring';
import { Calendar } from 'react-native-calendars';
import RectangleSVG from '../assets/icons/rectangle';

const { width, height } = Dimensions.get('window');

// Responsive dimensions system for all Android devices
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
    large: Math.max(width * 0.07, 28),
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 16),
    xl: Math.max(width * 0.06, 25),
  },
  buttonHeight: Math.max(height * 0.06, 44),
  iconSize: Math.max(width * 0.06, 20),
  imageHeight: Math.min(width * 0.55, height * 0.3),
  cardPadding: Math.max(width * 0.04, 16),
  headerHeight: Math.max(height * 0.1, 80),
};

const initialEvents = [
  {
    id: '1',
    title: 'Noida',
    location: 'Noida',
    date: { month: 'May', day: '20' },
    tags: ['Rock', 'Classical', 'Jazz', 'Piano', 'Guitar'],
    description:
      'Come along for an unforgettable evening filled with live music! Feel the beat and excitement!',
    image: require('../assets/Images/fff.jpg'),
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Midnight Melodies',
    location: 'Mumbai',
    date: { month: 'Feb', day: '12' },
    tags: ['Pop', 'EDM'],
    description: 'Experience the electrifying energy of live performances under the stars!',
    image: require('../assets/Images/ffff.jpg'),
    status: 'Recent',
  },
  {
    id: '3',
    title: 'Sunset Grooves',
    location: 'Goa',
    date: { month: 'Jun', day: '15' },
    tags: ['House', 'Trance', 'Chill'],
    description: 'Dance into the sunset with the best DJs and a beach vibe you will never forget!',
    image: require('../assets/Images/fff.jpg'),
    status: 'Upcoming',
  },
  {
    id: '4',
    title: 'Bollywood Beats',
    location: 'Delhi',
    date: { month: 'Aug', day: '5' },
    tags: ['Bollywood', 'Dance', 'Fusion'],
    description: 'A night of Bollywood hits and fusion performances to light up your evening!',
    image: require('../assets/Images/ffff.jpg'),
    status: 'Upcoming',
  },
];

const EventScreen = ({ navigation }) => {
  const isDark = useColorScheme() === 'dark';
  const [events, setEvents] = useState(initialEvents);
  const insets = useSafeAreaInsets();
  const [calendarVisible, setCalendarVisible] = useState(false);

  const textColor = '#fff'; // Force white text for visibility
  const subText = '#aaa'; // Light gray for secondary text

  const addEvent = () => {
    // Navigate to the CreateEventScreen and pass setEvents to update the events list
    navigation.navigate('NewEvent', { setEvents, events });
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => setCalendarVisible(true)}>
          <Calender width={32} height={32} />
        </TouchableOpacity>
      </View>
      <Modal
        visible={calendarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' }}>
            <Calendar
              onDayPress={() => setCalendarVisible(false)}
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
      <LinearGradient
        colors={['rgba(252,252,253,0.04)', 'rgba(252,252,253,0.03)']}
        start={{ x: 0.13, y: 0 }}
        end={{ x: 0.98, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer, 
            { 
              paddingTop: 84, // 64 header + 20 spacing
              paddingBottom: Math.max(insets.bottom + 120, 140),
              paddingHorizontal: dimensions.spacing.xl,
            }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          {/* Event Cards */}
          {events.map((event) => (
            <View key={event.id} style={styles.outerCardContainer}>
              <View style={styles.card}>
                <View style={styles.imageWrapper}>
                  <Image source={event.image} style={styles.cardImage} />
                  <View style={styles.dateBox}>
                    <Text style={styles.dateText}>{event.date.month}</Text>
                    <Text style={styles.dateDay}>{event.date.day}</Text>
                  </View>
                  <View style={styles.upcomingContainer}>
                    <RectangleSVG />
                    <Text style={styles.upcomingText}>{event.status || 'Upcoming'}</Text>
                  </View>
                </View>

                <View style={styles.cardContent}>
                  <Text style={[styles.location, { color: textColor }]}> 
                    {event.title}
                  </Text>
                  <View style={styles.tags}>
                    {event.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={[styles.tagText, { color: textColor }]}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={[styles.description, { color: subText }]}>{event.description}</Text>

                  <View style={styles.ratingRow}>
                    {[...Array(5)].map((_, i) => (
                      <MaterialIcons key={i} name="star" size={12} color="#FFD700" />
                    ))}
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => navigation.navigate('Explore')} style={styles.exploreButtonWrapper}>
                      <LinearGradient
                        colors={['#B15CDE', '#7952FC']}
                        start={{ x: 1, y: 0 }}
                        end={{ x: 0, y: 0 }}
                        style={styles.exploreButton}
                      >
                        <Text style={styles.exploreText}>Explore</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ borderRadius: 12, overflow: 'hidden', width: 38, height: 38 }}
                      onPress={() => setEvents(events.filter((e) => e.id !== event.id))}
                    >
                      <LinearGradient
                        colors={['#B15CDE', '#7952FC']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          flex: 1,
                          borderRadius: 9,
                          borderWidth:1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          
                        }}
                      >
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            backgroundColor: '#111',
                            borderRadius: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <DeleteIcon width={20} height={20} />
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>

      {/* Floating + Icon to Navigate to CreateEventScreen */}
      <TouchableOpacity 
        style={[
          styles.floatingPlus, 
          { 
            bottom: Math.max(insets.bottom + 80, 100),
            right: dimensions.spacing.xxl,
          }
        ]} 
        onPress={addEvent}
        activeOpacity={0.8}
      >
        <RingIcon style={styles.floatingPlusRing} width={54} height={54} />
        <View style={styles.floatingPlusInnerCircle}>
          <Feather name="plus" size={32} color="#fff" style={styles.floatingPlusIcon} />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    shadowColor: '#683BFC',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    backgroundColor: '#000',
  },
  headerTitle: {
    color: '#fff',
    fontFamily: 'Nunito Sans',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: 0.5,
    flex: 1,
    marginTop:10,
  },
  headerIconButton: {
    borderWidth: 1,
    borderColor: '#a095c4',
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.sm,
    backgroundColor: '#111',
    minWidth: Math.max(width * 0.1, 40),
    minHeight: Math.max(width * 0.1, 40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  card: {
    borderRadius: dimensions.borderRadius.lg,
    overflow: 'hidden',
    marginBottom: dimensions.spacing.xxl,
  },
  imageWrapper: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: dimensions.imageHeight,
    borderTopLeftRadius: dimensions.borderRadius.lg,
    borderTopRightRadius: dimensions.borderRadius.lg,
  },
  dateBox: {
    position: 'absolute',
    top: dimensions.spacing.md,
    left: dimensions.spacing.md,
    backgroundColor: '#333',
    borderRadius: dimensions.borderRadius.sm,
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    alignItems: 'center',
    minWidth: Math.max(width * 0.12, 45),
  },
  dateText: { 
    color: '#fff', 
    fontSize: dimensions.fontSize.tiny,
    fontWeight: '500',
  },
  dateDay: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: dimensions.fontSize.body,
  },
  upcomingContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 17,
    width: 127,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    zIndex: 2,
    marginBottom: 0,
    marginLeft:90,
  },
  upcomingText: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontWeight: '400',
    lineHeight: 17,
    letterSpacing: 0.2,
    zIndex: 3,
  },
  cardContent: { 
    padding: dimensions.cardPadding,
  },
  location: {
    fontSize: dimensions.fontSize.title,
    fontWeight: '600',
    marginBottom: dimensions.spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: dimensions.spacing.sm,
  },
  tag: {
    display: 'flex',
    backgroundColor: 'transparent',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
    alignItems: 'center',
    minHeight: 24,
    justifyContent: 'center',
  },
  tagText: {
    color: '#fff',
    fontSize: dimensions.fontSize.tiny,
    fontWeight: '500',
  },
  description: {
    fontSize: 11,
    
    lineHeight: Math.max(dimensions.fontSize.small + 5, 20),
    marginBottom: dimensions.spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: dimensions.spacing.lg,
    gap: dimensions.spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 0,
  },
  exploreButtonWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    marginRight: 9,
  },
  exploreButton: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch',
    borderRadius: 8,
    minWidth: 180,
    width: '100%',
  },
  exploreText: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  floatingPlus: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 27,
    width: 54,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  floatingPlusRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
  },
  floatingPlusIcon: {
    zIndex: 1,
  },
  floatingPlusInnerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#B15CDE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  outerCardContainer: {
    display: 'flex',
    minWidth: 240,
    maxWidth: 580,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    gap: 20,
    alignSelf: 'stretch',
    flexWrap: 'wrap',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(252,252,253,0.12)',
    marginBottom: 32,
    shadowColor: '#0F0F0F',
    shadowOffset: { width: 0, height: 40 },
    shadowOpacity: 0.10,
    shadowRadius: 64,
    // Note: backdropFilter: blur(12px) is not supported in React Native, but can be mimicked with overlays if needed
  },
});

export default EventScreen;