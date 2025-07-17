import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const ArtistTermsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/*} <Text style={styles.title}>Terms and Conditions – SceneZone</Text> */}
        <Text style={styles.text}>
          Welcome to SceneZone, a mobile application designed to help users explore, create, and manage events. These Terms and Conditions ("Terms") govern your use of the SceneZone mobile application and services (referred to collectively as the "App" or "Platform"). By downloading or using SceneZone, you agree to be bound by these <Text style={{color: '#1e90ff'}} onPress={() => {
            Linking.openURL('https://thescenezone.com/terms');
          }} accessibilityRole="link">
            Terms.
          </Text>{"\n"}
        </Text>
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By creating an account or using the SceneZone app, you confirm that you: {"\n"}
          • Are at least 18 years of age (or the age of digital consent in your country){"\n"}
          • Have read, understood, and agree to comply with these Terms{"\n"}
          If you do not agree, you must not use this App.
        </Text>
        <Text style={styles.sectionTitle}>2. User Roles & Responsibilities</Text>
        <Text style={styles.text}>
          SceneZone caters to the following users:{"\n"}
          • Event Managers/Organizers: Can create, edit, and manage events.{"\n"}
          • Hosts/Artists: Can be listed, booked, and promoted through the platform.{"\n"}
          • General Users: Can explore, book, and attend events.{"\n"}
          Each user is responsible for the accuracy of the information they provide and for the activities carried out under their account.
        </Text>
        <Text style={styles.sectionTitle}>3. Account Registration & Security</Text>
        <Text style={styles.text}>
          • You must provide accurate and complete information during account creation.{"\n"}
          • You are responsible for maintaining the confidentiality of your login credentials.{"\n"}
          • SceneZone is not liable for any unauthorized access due to user negligence.
        </Text>
        <Text style={styles.sectionTitle}>4. Event Creation and Booking</Text>
        <Text style={styles.text}>
          • Event organizers must ensure the accuracy of event details, including location, time, and pricing.{"\n"}
          • SceneZone is not responsible for event cancellations, changes, or refunds unless otherwise stated.{"\n"}
          • Bookings made through the App are subject to the organizer’s terms.
        </Text>
        <Text style={styles.sectionTitle}>5. Content Guidelines</Text>
        <Text style={styles.text}>
          Users may upload content (event descriptions, images, artist portfolios, etc.). You agree not to post:{"\n"}
          • False, misleading, or harmful content{"\n"}
          • Inappropriate, abusive, or illegal material{"\n"}
          • Content that infringes on the rights of others (e.g., copyright){"\n"}
          We reserve the right to remove content or suspend accounts that violate these guidelines.
        </Text>
        <Text style={styles.sectionTitle}>6. Fees and Payments</Text>
        <Text style={styles.text}>
          • Some events or features on SceneZone may require payment.{"\n"}
          • Payment gateways used are third-party services and SceneZone is not responsible for payment failures or disputes.{"\n"}
          • Any fees for premium services will be disclosed clearly within the App.
        </Text>
        <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
        <Text style={styles.text}>
          • All trademarks, logos, and content in the app belong to SceneZone or its licensors.{"\n"}
          • You may not copy, modify, distribute, or reverse-engineer any part of the App without permission.
        </Text>
        <Text style={styles.sectionTitle}>8. Termination</Text>
        <Text style={styles.text}>
          SceneZone reserves the right to:{"\n"}
          • Suspend or terminate your access for violation of these Terms{"\n"}
          • Remove any content deemed inappropriate or harmful{"\n"}
          You may delete your account at any time by contacting us.
        </Text>
        <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
        <Text style={styles.text}>
          SceneZone is provided "as-is" and we do not guarantee:{"\n"}
          • The availability, accuracy, or reliability of the App at all times{"\n"}
          • That the App will be error-free or uninterrupted{"\n"}
          We are not liable for:{"\n"}
          • Any direct or indirect loss or damage resulting from your use of the App{"\n"}
          • Any disputes between users, event organizers, or third parties
        </Text>
        <Text style={styles.sectionTitle}>10. Privacy</Text>
        <Text style={styles.text}>
          Your privacy is important to us. Please refer to our Privacy Policy for details on how we collect and use your personal information.
        </Text>
        <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
        <Text style={styles.text}>
          We may revise these Terms at any time. We will notify you of significant updates via in-app alerts or emails. Continued use of the App constitutes acceptance of the updated Terms.
        </Text>
        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about these Terms, please contact us:{"\n"}
          SceneZone Support Team{"\n"}
          📧 Email: thescenezoneofficial@gmail.com
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
  header: {
    paddingTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
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
  text: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default ArtistTermsScreen;
