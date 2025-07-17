import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import SignUpBackground from '../assets/Banners/SignUp';

const ArtistPrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backgroundSvgContainer}>
        <SignUpBackground style={styles.backgroundSvg} />
      </View>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy – SceneZone</Text>
        <Text style={styles.text}>
          Welcome to SceneZone. We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application “SceneZone” (referred to as the “App”).{"\n"}
          By using SceneZone, you agree to the collection and use of information in accordance with this <Text style={styles.link} onPress={() => Linking.openURL('https://thescenezone.com/privacy')} accessibilityRole="link"><Text style={styles.bold}>Privacy Policy</Text></Text>.
        </Text>
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>We may collect the following types of information:</Text>
        <Text style={styles.subSectionTitle}>a. Personal Information</Text>
        <Text style={styles.text}>
          • Full Name{"\n"}
          • Email Address{"\n"}
          • Phone Number{"\n"}
          • Location (City, State){"\n"}
          • Profile Picture (optional){"\n"}
          • Date of Birth (for age verification)
        </Text>
        <Text style={styles.subSectionTitle}>b. Event-Related Information</Text>
        <Text style={styles.text}>
          • Events created, booked, or attended{"\n"}
          • Host or Artist profile and descriptions{"\n"}
          • Reviews and ratings
        </Text>
        <Text style={styles.subSectionTitle}>c. Device Information</Text>
        <Text style={styles.text}>
          • Device model and operating system{"\n"}
          • IP address{"\n"}
          • App version{"\n"}
          • Usage data and interaction logs
        </Text>
        <Text style={styles.subSectionTitle}>d. Location Data</Text>
        <Text style={styles.text}>
          If enabled, we collect real-time location data to help users explore nearby events and venues.
        </Text>
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use the collected information for purposes including:{"\n"}
          • Facilitating account creation and user management{"\n"}
          • Enabling event creation, booking, and discovery{"\n"}
          • Personalizing the app experience{"\n"}
          • Communicating with users about bookings, updates, or support requests{"\n"}
          • Analyzing usage trends to improve app performance{"\n"}
          • Preventing fraudulent or unauthorized activity
        </Text>
        <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
        <Text style={styles.text}>
          We do not sell your personal data. However, we may share your data with:{"\n"}
          • Event Hosts or Organizers when you register/book their events{"\n"}
          • Service Providers assisting with app development, hosting, analytics, or customer support (bound by confidentiality){"\n"}
          • Legal Authorities when required by law or to protect SceneZone’s rights or user safety
        </Text>
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.text}>
          We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
        </Text>
        <Text style={styles.sectionTitle}>5. Your Choices & Rights</Text>
        <Text style={styles.text}>
          You have the right to:{"\n"}
          • Access and update your personal data{"\n"}
          • Delete your account and associated information{"\n"}
          • Withdraw consent to marketing communications{"\n"}
          • Request data export or restriction (as per applicable laws){"\n"}
          {"\n"}For any of the above, contact us at [insert contact email].
        </Text>
        <Text style={styles.sectionTitle}>6. Children’s Privacy</Text>
        <Text style={styles.text}>
          SceneZone is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware, we will delete such information promptly.
        </Text>
        <Text style={styles.sectionTitle}>7. Third-Party Links</Text>
        <Text style={styles.text}>
          The App may contain links to third-party services (e.g., ticketing partners or social media). We are not responsible for the privacy practices or content of those services.
        </Text>
        <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the “Last Updated” date and, where appropriate, through in-app notifications or emails.
        </Text>
        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.text}>
          If you have questions or concerns about this Privacy Policy or how your data is handled, please contact us at:{"\n"}
          SceneZone Support Team{"\n"}
          Email: thescenezoneofficial@gmail.com
        </Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundSvgContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  backgroundSvg: {
    width: '100%',
    height: '100%',
  },
  header: {
    paddingTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 18,
    marginBottom: 6,
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 8,
    lineHeight: 22,
  },
  link: {
    color: '#a95eff',
    textDecorationLine: 'underline',
  },
  bold: {
    fontWeight: 'bold',
    color: '#a95eff',
  },
});

export default ArtistPrivacyScreen;
