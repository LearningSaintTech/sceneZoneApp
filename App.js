import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { io } from "socket.io-client";
import { store, persistor } from "./Src/HOSTFLOW/Redux/store";
import { selectIsLoggedIn, selectUserType, selectToken } from "./Src/HOSTFLOW/Redux/slices/authSlice";

// Common Screens
import SplashScreen from "./Src/HOSTFLOW/Screens/SplashScreen";
import OnboardScreen from "./Src/HOSTFLOW/Screens/OnboardScreen";
import NotificationScreen from "./Src/HOSTFLOW/Screens/NotificationScreen";
import ExploreEventScreen from "./Src/HOSTFLOW/Screens/ExploreEventScreen";
import EventDashboardScreen from "./Src/HOSTFLOW/Screens/EventDashboardScreen";
import NewEventScreen from "./Src/HOSTFLOW/Screens/NewEventScreen";
import GuestListScreen from "./Src/HOSTFLOW/Screens/GuestListScreen";
import ShortListScreen from "./Src/HOSTFLOW/Screens/ShortListScreen";
import ChatScreen from "./Src/HOSTFLOW/Screens/Chat";
import BottomTabNavigator from "./Src/HOSTFLOW/Components/BottomTabNavigator";

// Artist Screens
import ArtistSignupScreen from "./Src/HOSTFLOW/Screens/ArtistSignupScreen";
import ArtistSigninScreen from "./Src/HOSTFLOW/Screens/ArtistSigninScreen";
import ArtistOtpVerificationScreen from "./Src/HOSTFLOW/Screens/ArtistOtpVerificationScreen";
import ArtistVerifiedScreen from "./Src/HOSTFLOW/Screens/ArtistVerifiedScreen";
import ArtistHomeScreen from "./Src/HOSTFLOW/Screens/ArtistHomeScreen";
import ArtistNotificationScreen from "./Src/HOSTFLOW/Screens/ArtistNotificationScreen";
import ArtistAppliedScreen from "./Src/HOSTFLOW/Screens/ArtistAppliedScreen";
import ArtistFormBookingScreen from "./Src/HOSTFLOW/Screens/ArtistFormBooking";
import ArtistInboxScreen from "./Src/HOSTFLOW/Screens/ArtistInbox";
import ArtistProfileScreen from "./Src/HOSTFLOW/Screens/ArtistProfileScreen";
import ArtistEditProfileScreen from "./Src/HOSTFLOW/Screens/ArtistEditProfile";
import ArtistGuestListScreen from "./Src/HOSTFLOW/Screens/ArtistGuestList";
import ArtistPaymentSettingsScreen from "./Src/HOSTFLOW/Screens/ArtistPaymentSettings";
import ArtistGeneralSettingsScreen from "./Src/HOSTFLOW/Screens/ArtistGeneralSettings";
import ArtistHelpCentreScreen from "./Src/HOSTFLOW/Screens/ArtistHelpCentre";
import ArtistForgotPasswordScreen from "./Src/HOSTFLOW/Screens/ArtistForgotPasswordScreen";
import ArtistCheckMailbox from "./Src/HOSTFLOW/Screens/ArtistCheckMailBox";
import ArtistCreateNewPassword from "./Src/HOSTFLOW/Screens/ArtistCreateNewPassword";
import ArtistUpload from "./Src/HOSTFLOW/Screens/ArtistUpload";

// Host Screens
import SignUpScreen from "./Src/HOSTFLOW/Screens/SignupScreen";
import SigninScreen from "./Src/HOSTFLOW/Screens/SigninScreen";
import OtpVerificationScreen from "./Src/HOSTFLOW/Screens/OtpVerificationScreen";
import ForgotPasswordScreen from "./Src/HOSTFLOW/Screens/ForgotPasswordScreen";
import CheckMailboxScreen from "./Src/HOSTFLOW/Screens/CheckMailBoxScreen";
import CreateNewPasswordScreen from "./Src/HOSTFLOW/Screens/CreateNewPasswordScreen";
import ProfileScreen from "./Src/HOSTFLOW/Screens/ProfileScreen";
import CreateProfile from "./Src/HOSTFLOW/Screens/CreateProfile";
import HostEditProfileScreen from "./Src/HOSTFLOW/Screens/HostEditProfile";
import HostAccountSecurityScreen from "./Src/HOSTFLOW/Screens/HostAccountSecurity";
import HostPaymentSettingsScreen from "./Src/HOSTFLOW/Screens/HostPaymentSetting";
import HostGeneralSettingsScreen from "./Src/HOSTFLOW/Screens/HostGeneralSetting";
import HostHelpCentreScreen from "./Src/HOSTFLOW/Screens/HostHelpCentre";
import HostEnableGuestListScreen from "./Src/HOSTFLOW/Screens/HostEnableGuestList";
import HostTicketSettingScreen from "./Src/HOSTFLOW/Screens/HostTicketSetting";
import OnSalaryBasisScreen from "./Src/HOSTFLOW/Screens/OnSalaryBasis";
import ShortlistCreateNewEventScreen from "./Src/HOSTFLOW/Screens/ShortlistCreateNewEvent";
import HostDetailBookingScreen from "./Src/HOSTFLOW/Screens/HostDetailBooking";
import HostNegotiationAvailableScreen from "./Src/HOSTFLOW/Screens/HostNegotiationAvailable";
import HostShortBookPaymentMethodScreen from "./Src/HOSTFLOW/Screens/HostShortBookPaymentMethod";
import HostShortConfirmBookingScreen from "./Src/HOSTFLOW/Screens/HostShortConfirmBooking";
import HostArtistContactScreen from "./Src/HOSTFLOW/Screens/HostArtistContact";
import HostManageEventScreen from "./Src/HOSTFLOW/Screens/HostManageEvent";
import HostManageEventDetailBookingScreen from "./Src/HOSTFLOW/Screens/HostManageEventDetailBooking";
import HostPerfomanceDetailsScreen from "./Src/HOSTFLOW/Screens/HostPerfomanceDetails";
import HostVerifiedScreen from "./Src/HOSTFLOW/Screens/HostVerifiedScreen";
import HostAddPayment from "./Src/HOSTFLOW/Screens/HostAddPayment";
import HostDetailUpdateBookingScreen from './Src/HOSTFLOW/Screens/HostDetailUpdateBooking'
import HostChatEventList from './Src/HOSTFLOW/Screens/HostChatEventList'
import HostChatList from './Src/HOSTFLOW/Screens/HostChatList'

// User Screens
import UserSignupScreen from "./Src/HOSTFLOW/Screens/UserSignup";
import UserSigninScreen from "./Src/HOSTFLOW/Screens/UserSignin";
import UserCreateProfileScreen from "./Src/HOSTFLOW/Screens/UserCreateProfile";
import UserOtpVerificationScreen from "./Src/HOSTFLOW/Screens/UserOtpVerification";
import UserForgotPasswordScreen from "./Src/HOSTFLOW/Screens/UserForgotPassword";
import UserOtpResetScreen from "./Src/HOSTFLOW/Screens/UserOtpReset";
import UserHomeScreen from "./Src/HOSTFLOW/Screens/UserHomeScreen";
import UserNotificationScreen from "./Src/HOSTFLOW/Screens/UserNotification";
import UserProfileScreen from "./Src/HOSTFLOW/Screens/UserProfile";
import UserEditProfileScreen from "./Src/HOSTFLOW/Screens/UserEditProfile";
import UserAccountSecurityScreen from "./Src/HOSTFLOW/Screens/UserAccountSecurity";
import UserPaymentSettingsScreen from "./Src/HOSTFLOW/Screens/UserPaymentSettings";
import AddPaymentMethodScreen from "./Src/HOSTFLOW/Screens/AddPaymentMethod";
import UserGeneralSettingsScreen from "./Src/HOSTFLOW/Screens/UserGeneralSettings";
import UserHelpCentreScreen from "./Src/HOSTFLOW/Screens/UserHelpCentre";
import UserFavoriteScreen from "./Src/HOSTFLOW/Screens/UserFavorite";
import UserVenueBookingScreen from "./Src/HOSTFLOW/Screens/UserVenueBooking";
import UserTicketScreen from "./Src/HOSTFLOW/Screens/UserTicket";
import UserEvent from "./Src/HOSTFLOW/Screens/UserEvent";
import UserFormBookingScreen from "./Src/HOSTFLOW/Screens/UserFormBooking";
import UserDetailBookingScreen from "./Src/HOSTFLOW/Screens/UserDetailBooking";
import UserBookingPaymentScreen from "./Src/HOSTFLOW/Screens/userBookingPayment";
import UserConfirmBookingScreen from "./Src/HOSTFLOW/Screens/UserConfirmBooking";
import UserBottomTabNavigator from "./Src/HOSTFLOW/Components/UserBottomTabNavigator";
import UserVerifiedScreen from "./Src/HOSTFLOW/Screens/UserVerified";
import UserCreateNewPassword from "./Src/HOSTFLOW/Screens/UserCreateNewPassword";
import UserCheckMailbox from "./Src/HOSTFLOW/Screens/UserCheckMailBox";

// Socket.IO Context


// Socket.IO URL


const Stack = createNativeStackNavigator();

// Polyfill for Array.prototype.findLastIndex (Hermes/older JS engines)
if (!Array.prototype.findLastIndex) {
  Object.defineProperty(Array.prototype, "findLastIndex", {
    value: function (predicate, thisArg) {
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

function AppNavigator() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userType = useSelector(selectUserType);
  const token = useSelector(selectToken);
  const [initialRoute, setInitialRoute] = React.useState(null);
  const navigationRef = React.useRef();

  React.useEffect(() => {
    const checkLogin = async () => {
      console.log(`[${new Date().toISOString()}] [App] Starting checkLogin`);

      try {
        // Check AsyncStorage
        console.log(`[${new Date().toISOString()}] [App] Fetching token from AsyncStorage`);
        const storedToken = await AsyncStorage.getItem("token");
        console.log(`[${new Date().toISOString()}] [App] Stored Token: ${storedToken ? "Found" : "Not found"}`);

        console.log(`[${new Date().toISOString()}] [App] Fetching userType from AsyncStorage`);
        const storedUserType = await AsyncStorage.getItem("userType");
        console.log(`[${new Date().toISOString()}] [App] Stored UserType: ${storedUserType || "Not found"}`);

        // Check Redux state
        console.log(`[${new Date().toISOString()}] [App] Redux isLoggedIn: ${isLoggedIn}`);
        console.log(`[${new Date().toISOString()}] [App] Redux userType: ${userType || "Not set"}`);
        console.log(`[${new Date().toISOString()}] [App] Redux token: ${token ? "Found" : "Not set"}`);

        // Use AsyncStorage if available, otherwise fall back to Redux
        const finalToken = storedToken || token;
        const finalUserType = storedUserType || userType;

        if (finalToken && finalUserType && isLoggedIn) {
          console.log(`[${new Date().toISOString()}] [App] Valid token and userType found, selecting route`);
          const normalizedUserType = finalUserType.toLowerCase();
          switch (normalizedUserType) {
            case "artist":
              console.log(`[${new Date().toISOString()}] [App] Setting initialRoute to ArtistHome`);
              setInitialRoute("ArtistHome");
              break;
            case "host":
              console.log(`[${new Date().toISOString()}] [App] Setting initialRoute to MainTabs`);
              setInitialRoute("MainTabs");
              break;
            case "user":
              console.log(`[${new Date().toISOString()}] [App] Setting initialRoute to UserHome`);
              setInitialRoute("UserHome");
              break;
            default:
              console.warn(`[${new Date().toISOString()}] [App] Invalid userType: ${finalUserType}, falling back to Onboard1`);
              setInitialRoute("Onboard1");
          }
        } else {
          console.log(`[${new Date().toISOString()}] [App] Missing token, userType, or not logged in, falling back to Onboard1`);
          setInitialRoute("Onboard1");
        }
      } catch (err) {
        console.error(`[${new Date().toISOString()}] [App] Error in checkLogin:`, err.message);
        console.log(`[${new Date().toISOString()}] [App] Falling back to Onboard1 due to error`);
        setInitialRoute("Onboard1");
      }
    };

    console.log(`[${new Date().toISOString()}] [App] Initiating checkLogin`);
    checkLogin();
  }, [isLoggedIn, userType, token]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        console.log(`[${new Date().toISOString()}] [App] NavigationContainer ready, initialRoute: ${initialRoute || "Not set"}`);
      }}
    >
      {initialRoute ? (
        <>
          {console.log(`[${new Date().toISOString()}] [App] Rendering Stack.Navigator with initialRoute: ${initialRoute}`)}
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              animationDuration: 300,
            }}
            initialRouteName={initialRoute}
          >
            {/* Common Screens */}
            <Stack.Screen name="Onboard1" component={OnboardScreen} options={{ animation: "slide_from_left" }} />
            <Stack.Screen name="Notification" component={NotificationScreen} />
            <Stack.Screen name="Explore" component={ExploreEventScreen} />
            <Stack.Screen name="Event" component={EventDashboardScreen} />
            <Stack.Screen name="NewEvent" component={NewEventScreen} />
            <Stack.Screen name="GuestList" component={GuestListScreen} />
            <Stack.Screen name="ShortList" component={ShortListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />

            {/* Artist Screens */}
            <Stack.Screen name="ArtistSignup" component={ArtistSignupScreen} />
            <Stack.Screen name="ArtistSigninScreen" component={ArtistSigninScreen} />
            <Stack.Screen name="ArtistOtpVerificationScreen" component={ArtistOtpVerificationScreen} />
            <Stack.Screen name="ArtistVerifiedScreen" component={ArtistVerifiedScreen} />
            <Stack.Screen name="ArtistHome" component={ArtistHomeScreen} />
            <Stack.Screen name="ArtistNotification" component={ArtistNotificationScreen} />
            <Stack.Screen name="ArtistApplied" component={ArtistAppliedScreen} />
            <Stack.Screen name="ArtistFormBooking" component={ArtistFormBookingScreen} />
            <Stack.Screen name="ArtistInbox" component={ArtistInboxScreen} />
            <Stack.Screen name="ArtistProfile" component={ArtistProfileScreen} />
            <Stack.Screen name="ArtistEditProfile" component={ArtistEditProfileScreen} />
            <Stack.Screen name="ArtistGuestList" component={ArtistGuestListScreen} />
            <Stack.Screen name="ArtistPaymentSettings" component={ArtistPaymentSettingsScreen} />
            <Stack.Screen name="ArtistGeneralSettings" component={ArtistGeneralSettingsScreen} />
            <Stack.Screen name="ArtistHelpCentre" component={ArtistHelpCentreScreen} />
            <Stack.Screen name="ArtistForgotPasswordScreen" component={ArtistForgotPasswordScreen} />
            <Stack.Screen name="ArtistCheckMailbox" component={ArtistCheckMailbox} />
            <Stack.Screen name="ArtistCreateNewPassword" component={ArtistCreateNewPassword} />
            <Stack.Screen name="ArtistUpload" component={ArtistUpload} />

            {/* Host Screens */}
            <Stack.Screen name="Signup" component={SignUpScreen} options={{ animation: "slide_from_left" }} />
            <Stack.Screen name="SignIn" component={SigninScreen} options={{ animation: "slide_from_right" }} />
            <Stack.Screen name="OtpVerify" component={OtpVerificationScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="CheckMailBox" component={CheckMailboxScreen} />
            <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="CreateProfile" component={CreateProfile} />
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
            <Stack.Screen name="HostVerifiedScreen" component={HostVerifiedScreen} />
            <Stack.Screen name="HostAddPayment" component={HostAddPayment} />
            <Stack.Screen name="HostDetailUpdateBookingScreen" component={HostDetailUpdateBookingScreen} />
            <Stack.Screen name="HostChatEventList" component={HostChatEventList} />
            <Stack.Screen name="HostChatList" component={HostChatList} />



            {/* User Screens */}
            <Stack.Screen name="UserSignup" component={UserSignupScreen} />
            <Stack.Screen name="UserSignin" component={UserSigninScreen} />
            <Stack.Screen name="UserCreateProfile" component={UserCreateProfileScreen} />
            <Stack.Screen name="UserOtpVerification" component={UserOtpVerificationScreen} />
            <Stack.Screen name="UserForgotPassword" component={UserForgotPasswordScreen} />
            <Stack.Screen name="UserOtpReset" component={UserOtpResetScreen} />
            <Stack.Screen name="UserHome" component={UserBottomTabNavigator} />
            <Stack.Screen name="UserNotificationScreen" component={UserNotificationScreen} />
            <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
            <Stack.Screen name="UserEditProfileScreen" component={UserEditProfileScreen} />
            <Stack.Screen name="UserAccountSecurityScreen" component={UserAccountSecurityScreen} />
            <Stack.Screen name="UserPaymentSettingsScreen" component={UserPaymentSettingsScreen} />
            <Stack.Screen name="UserCheckMailbox" component={UserCheckMailbox} />
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
            <Stack.Screen name="UserTabs" component={UserBottomTabNavigator} />
            <Stack.Screen name="UserVerifiedScreen" component={UserVerifiedScreen} />
            <Stack.Screen name="UserCreateNewPassword" component={UserCreateNewPassword} />
          </Stack.Navigator>
        </>
      ) : (
        <>
          {console.log(`[${new Date().toISOString()}] [App] Rendering SplashScreen (initialRoute not set)`)}
          <Stack.Screen name="Splash" component={SplashScreen} />
        </>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  const [socket, setSocket] = React.useState(null);
  const [isAppInBackground, setIsAppInBackground] = React.useState(false);

  // Initialize Socket.IO
  
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
         
            <AppNavigator />
       
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}