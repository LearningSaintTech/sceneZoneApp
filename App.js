import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { AppState } from 'react-native';
import { store } from './Src/HOSTFLOW/Redux/store';
import SplashScreen from './Src/HOSTFLOW/Screens/SplashScreen';
import OnboardScreen from './Src/HOSTFLOW/Screens/OnboardScreen';
import SignUpScreen from './Src/HOSTFLOW/Screens/SignupScreen';
import SigninScreen from './Src/HOSTFLOW/Screens/SigninScreen';
//Host screens
import OtpVerificationScreen from './Src/HOSTFLOW/Screens/OtpVerificationScreen';
import ForgotPasswordScreen from './Src/HOSTFLOW/Screens/ForgotPasswordScreen'
import CheckMailboxScreen from './Src/HOSTFLOW/Screens/CheckMailBoxScreen';
import CreateNewPasswordScreen from './Src/HOSTFLOW/Screens/CreateNewPasswordScreen';
import BottomTabNavigator from './Src/HOSTFLOW/Components/BottomTabNavigator';
import NotificationScreen from './Src/HOSTFLOW/Screens/NotificationScreen';
import ExploreEventScreen from './Src/HOSTFLOW/Screens/ExploreEventScreen';
import EventDashboardScreen from './Src/HOSTFLOW/Screens/EventDashboardScreen';
import NewEventScreen from './Src/HOSTFLOW/Screens/NewEventScreen';
import GuestListScreen from './Src/HOSTFLOW/Screens/GuestListScreen';
import ShortListScreen from './Src/HOSTFLOW/Screens/ShortListScreen';
import ProfileScreen from './Src/HOSTFLOW/Screens/ProfileScreen';
import ArtistSignupScreen from './Src/HOSTFLOW/Screens/ArtistSignupScreen';
import ArtistSigninScreen from './Src/HOSTFLOW/Screens/ArtistSigninScreen';
import ArtistOtpVerificationScreen from './Src/HOSTFLOW/Screens/ArtistOtpVerificationScreen';
import ArtistVerifiedScreen from './Src/HOSTFLOW/Screens/ArtistVerifiedScreen';
import CreateProfile from './Src/HOSTFLOW/Screens/CreateProfile';
import ArtistHomeScreen from './Src/HOSTFLOW/Screens/ArtistHomeScreen';
import ArtistNotificationScreen from './Src/HOSTFLOW/Screens/ArtistNotificationScreen';
import ArtistAppliedScreen from './Src/HOSTFLOW/Screens/ArtistAppliedScreen';
import ArtistFormBookingScreen from './Src/HOSTFLOW/Screens/ArtistFormBooking';
import ArtistInboxScreen from './Src/HOSTFLOW/Screens/ArtistInbox';
import ChatScreen from './Src/HOSTFLOW/Screens/Chat';

//ARTIST SCREENS
import ArtistProfileScreen from './Src/HOSTFLOW/Screens/ArtistProfileScreen';
import ArtistEditProfileScreen from './Src/HOSTFLOW/Screens/ArtistEditProfile';
import ArtistGuestListScreen from './Src/HOSTFLOW/Screens/ArtistGuestList';
import ArtistPaymentSettingsScreen from './Src/HOSTFLOW/Screens/ArtistPaymentSettings';
import ArtistGeneralSettingsScreen from './Src/HOSTFLOW/Screens/ArtistGeneralSettings';
import ArtistHelpCentreScreen from './Src/HOSTFLOW/Screens/ArtistHelpCentre';
import UserSignupScreen from './Src/HOSTFLOW/Screens/UserSignup';
import UserSigninScreen from './Src/HOSTFLOW/Screens/UserSignin';
import UserCreateProfileScreen from './Src/HOSTFLOW/Screens/UserCreateProfile';
import UserOtpVerificationScreen from './Src/HOSTFLOW/Screens/UserOtpVerification';
import UserVerifiedScreen from './Src/HOSTFLOW/Screens/UserVerified';
import UserForgotPasswordScreen from './Src/HOSTFLOW/Screens/UserForgotPassword';
import UserOtpResetScreen from './Src/HOSTFLOW/Screens/UserOtpReset';
import UserHomeScreen from './Src/HOSTFLOW/Screens/UserHomeScreen';
import UserNotificationScreen from './Src/HOSTFLOW/Screens/UserNotification';
import UserProfileScreen from './Src/HOSTFLOW/Screens/UserProfile';
import UserEditProfileScreen from './Src/HOSTFLOW/Screens/UserEditProfile';
import UserAccountSecurityScreen from './Src/HOSTFLOW/Screens/UserAccountSecurity';
import UserPaymentSettingsScreen from './Src/HOSTFLOW/Screens/UserPaymentSettings';
import AddPaymentMethodScreen from './Src/HOSTFLOW/Screens/AddPaymentMethod';
import UserGeneralSettingsScreen from './Src/HOSTFLOW/Screens/UserGeneralSettings';
import UserHelpCentreScreen from './Src/HOSTFLOW/Screens/UserHelpCentre';
import UserFavoriteScreen from './Src/HOSTFLOW/Screens/UserFavorite';
import UserVenueBookingScreen from './Src/HOSTFLOW/Screens/UserVenueBooking';
import UserTicketScreen from './Src/HOSTFLOW/Screens/UserTicket';
import UserEvent from './Src/HOSTFLOW/Screens/UserEvent';
import UserFormBookingScreen from './Src/HOSTFLOW/Screens/UserFormBooking';
import UserDetailBookingScreen from './Src/HOSTFLOW/Screens/UserDetailBooking';
import UserBookingPaymentScreen from './Src/HOSTFLOW/Screens/userBookingPayment';
import UserConfirmBookingScreen from './Src/HOSTFLOW/Screens/UserConfirmBooking';
import HostEditProfileScreen from './Src/HOSTFLOW/Screens/HostEditProfile';
import HostAccountSecurityScreen from './Src/HOSTFLOW/Screens/HostAccountSecurity';
import HostPaymentSettingsScreen from './Src/HOSTFLOW/Screens/HostPaymentSetting';
import HostGeneralSettingsScreen from './Src/HOSTFLOW/Screens/HostGeneralSetting';
import HostHelpCentreScreen from './Src/HOSTFLOW/Screens/HostHelpCentre';
import HostEnableGuestListScreen from './Src/HOSTFLOW/Screens/HostEnableGuestList';
import HostTicketSettingScreen from './Src/HOSTFLOW/Screens/HostTicketSetting';
import OnSalaryBasisScreen from './Src/HOSTFLOW/Screens/OnSalaryBasis';
import ShortlistCreateNewEventScreen from './Src/HOSTFLOW/Screens/ShortlistCreateNewEvent';
import HostDetailBookingScreen from './Src/HOSTFLOW/Screens/HostDetailBooking';
import HostNegotiationAvailableScreen from './Src/HOSTFLOW/Screens/HostNegotiationAvailable';
import HostShortBookPaymentMethodScreen from './Src/HOSTFLOW/Screens/HostShortBookPaymentMethod';
import HostShortConfirmBookingScreen from './Src/HOSTFLOW/Screens/HostShortConfirmBooking';
import HostArtistContactScreen from './Src/HOSTFLOW/Screens/HostArtistContact';
import HostManageEventScreen from './Src/HOSTFLOW/Screens/HostManageEvent';
import HostManageEventDetailBookingScreen from './Src/HOSTFLOW/Screens/HostManageEventDetailBooking';
import HostPerfomanceDetailsScreen from './Src/HOSTFLOW/Screens/HostPerfomanceDetails';
import ArtistUpload from './Src/HOSTFLOW/Screens/ArtistUpload';
import HomeScreen from './Src/HOSTFLOW/Screens/HomeScreen';
import HostVerifiedScreen from './Src/HOSTFLOW/Screens/HostVerifiedScreen';
import HostAddPayment from './Src/HOSTFLOW/Screens/HostAddPayment';
import ArtistForgotPasswordScreen from './Src/HOSTFLOW/Screens/ArtistForgotPasswordScreen';
import ArtistCheckMailbox from './Src/HOSTFLOW/Screens/ArtistCheckMailbox';
import ArtistCreateNewPassword from './Src/HOSTFLOW/Screens/ArtistCreateNewPassword';
import UserBottomTabNavigator from './Src/HOSTFLOW/Components/UserBottomTabNavigator';
import HostDiscount from './Src/HOSTFLOW/Screens/HostDiscount';
import UserTicketDownload from './Src/HOSTFLOW/Screens/UserTicketDownload';

const Stack = createNativeStackNavigator();

// Polyfill for Array.prototype.findLastIndex (Hermes/older JS engines)
if (!Array.prototype.findLastIndex) {
  Object.defineProperty(Array.prototype, 'findLastIndex', {
    value: function(predicate, thisArg) {
      for (let i = this.length - 1; i >= 0; i--) {
        if (predicate.call(thisArg, this[i], i, this)) {
          return i;
        }
      }
      return -1;
    },
    configurable: true,
    writable: true,
  });
}

export default function App() {
  // const [isAppInBackground, setIsAppInBackground] = React.useState(false);
  // const [showSplash, setShowSplash] = React.useState(true);
  const navigationRef = React.useRef();

  /*
  React.useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setIsAppInBackground(true);
      } else if (nextAppState === 'active' && isAppInBackground) {
        // App came to foreground, show splash screen
        setShowSplash(true);
        setIsAppInBackground(false);
        // Reset navigation to splash screen
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Splash' }],
          });
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isAppInBackground]);
  */

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            screenOptions={{ 
              headerShown: false,
              animation: 'slide_from_right',
              animationDuration: 300,
            }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen 
              name="Onboard1" 
              component={OnboardScreen}
              options={{
                animation: 'slide_from_left',
                animationDuration: 300,
              }}
            />
            <Stack.Screen 
              name="Signup" 
              component={SignUpScreen}
              options={{
                animation: 'slide_from_left',
                animationDuration: 300,
              }}
            />
            <Stack.Screen name="ArtistSignup" component={ArtistSignupScreen} />
            <Stack.Screen 
              name="SignIn" 
              component={SigninScreen}
              options={{
                animation: 'slide_from_right',
                animationDuration: 300,
              }}
            />
            <Stack.Screen name="ArtistSigninScreen" component={ArtistSigninScreen} />
            <Stack.Screen name="ArtistForgotPasswordScreen" component={ArtistForgotPasswordScreen} />
            <Stack.Screen name="ArtistCheckMailbox" component={ArtistCheckMailbox} />
            <Stack.Screen name="ArtistCreateNewPassword" component={ArtistCreateNewPassword} />
            <Stack.Screen name="OtpVerify" component={OtpVerificationScreen} />
            <Stack.Screen name="ArtistOtpVerificationScreen" component={ArtistOtpVerificationScreen} />
            <Stack.Screen name="ArtistVerifiedScreen" component={ArtistVerifiedScreen} />
            <Stack.Screen name="UserOtpVerification" component={UserOtpVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={UserForgotPasswordScreen} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
            <Stack.Screen name="ArtistHome" component={ArtistHomeScreen} />
            <Stack.Screen name="ArtistNotification" component={ArtistNotificationScreen} />
            <Stack.Screen name="ArtistApplied" component={ArtistAppliedScreen} />
            <Stack.Screen name="ArtistFormBooking" component={ArtistFormBookingScreen} />
            <Stack.Screen name="ArtistInbox" component={ArtistInboxScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
            <Stack.Screen name="ArtistEditProfile" component={ArtistEditProfileScreen} />
            <Stack.Screen name="ArtistGuestList" component={ArtistGuestListScreen} />
            <Stack.Screen name="ArtistPaymentSettings" component={ArtistPaymentSettingsScreen} />
            <Stack.Screen name="ArtistGeneralSettings" component={ArtistGeneralSettingsScreen} />
            <Stack.Screen name="ArtistHelpCentre" component={ArtistHelpCentreScreen} />
            <Stack.Screen name="UserSignup" component={UserSignupScreen} />
            <Stack.Screen name="UserSignin" component={UserSigninScreen} />
            <Stack.Screen name="UserCreateProfile" component={UserCreateProfileScreen} />
            <Stack.Screen name="CheckMailBox" component={CheckMailboxScreen} />
            <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
            <Stack.Screen name="UserOtpReset" component={UserOtpResetScreen} />
            <Stack.Screen name="UserHome" component={UserBottomTabNavigator} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="Explore" component={ExploreEventScreen} />
            <Stack.Screen name="Event" component={EventDashboardScreen} />
            <Stack.Screen name="NewEvent" component={NewEventScreen} />
            <Stack.Screen name="GuestList" component={GuestListScreen} />
            <Stack.Screen name="ShortList" component={ShortListScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="UserNotificationScreen" component={UserNotificationScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="UserEditProfileScreen" component={UserEditProfileScreen} />
            <Stack.Screen name="UserAccountSecurityScreen" component={UserAccountSecurityScreen} />
            <Stack.Screen name="UserPaymentSettingsScreen" component={UserPaymentSettingsScreen} />
            <Stack.Screen name="AddPaymentMethodScreen" component={AddPaymentMethodScreen} />
            <Stack.Screen name="UserGeneralSettingsScreen" component={UserGeneralSettingsScreen} />
            <Stack.Screen name="UserHelpCentreScreen" component={UserHelpCentreScreen} />
            <Stack.Screen name="UserFavoriteScreen" component={UserFavoriteScreen} />
            <Stack.Screen name="UserVenueBookingScreen" component={UserVenueBookingScreen} />
            <Stack.Screen name="UserTicketScreen" component={UserTicketScreen} />
            <Stack.Screen name="UserEvent" component={UserEvent} />
            <Stack.Screen name="UserFormBookingScreen" component={UserFormBookingScreen} />
            <Stack.Screen name="UserDetailBookingScreen" component={UserDetailBookingScreen} />
            <Stack.Screen name="UserBookingPaymentScreen" component={UserBookingPaymentScreen} />
            <Stack.Screen name="UserConfirmBookingScreen" component={UserConfirmBookingScreen} />
            <Stack.Screen name="HostEditProfile" component={HostEditProfileScreen} />
            <Stack.Screen name="HostAccountSecurity" component={HostAccountSecurityScreen} />
            <Stack.Screen name="hostPaymentSetting" component={HostPaymentSettingsScreen} />
            <Stack.Screen name="HostGeneralSetting" component={HostGeneralSettingsScreen} />
            <Stack.Screen name="HostHelpCentre" component={HostHelpCentreScreen} />
            <Stack.Screen name="HostEnableGuestList" component={HostEnableGuestListScreen} />
            <Stack.Screen name="HostTicketSetting" component={HostTicketSettingScreen} />
            <Stack.Screen name="OnSallaryBasis" component={OnSalaryBasisScreen} />
            <Stack.Screen name="ShortlistCreateNewEvent" component={ShortlistCreateNewEventScreen} />
            <Stack.Screen name="HostDetailBooking" component={HostDetailBookingScreen} />
            <Stack.Screen name="HostNegotiationAvailable" component={HostNegotiationAvailableScreen} />
            <Stack.Screen name="HostShortBookPaymentMethod" component={HostShortBookPaymentMethodScreen} />
            <Stack.Screen name="HostShortConfirmBooking" component={HostShortConfirmBookingScreen} />
            <Stack.Screen name="HostArtistContact" component={HostArtistContactScreen} />
            <Stack.Screen name="HostManageEvent" component={HostManageEventScreen} />
            <Stack.Screen name="HostManageEventDetailBooking" component={HostManageEventDetailBookingScreen} />
            <Stack.Screen name="HostPerfomanceDetails" component={HostPerfomanceDetailsScreen} />
            <Stack.Screen name="ArtistUpload" component={ArtistUpload} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="HostVerifiedScreen" component={HostVerifiedScreen} />
            <Stack.Screen name="HostAddPayment" component={HostAddPayment} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} /> 
                       
            <Stack.Screen name="HostDiscount" component={HostDiscount} />
            <Stack.Screen name="UserVerifiedScreen" component={UserVerifiedScreen} />
            <Stack.Screen name="UserTicketDownload" component={UserTicketDownload} />


          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}
