import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import SignUpBackground from '../assets/Banners/SignUp';

const { width, height } = Dimensions.get('window');

const VerificationSuccessIcon = (props) => (
  <Svg
    width={111}
    height={111}
    viewBox="0 0 111 111"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M48.625 2.47477C52.42 -0.770234 58.635 -0.770234 62.485 2.47477L71.175 9.95476C72.825 11.3848 75.905 12.5398 78.105 12.5398H87.455C93.285 12.5398 98.07 17.3248 98.07 23.1548V32.5048C98.07 34.6498 99.225 37.7848 100.655 39.4348L108.135 48.1248C111.38 51.9198 111.38 58.1348 108.135 61.9848L100.655 70.6748C99.225 72.3248 98.07 75.4048 98.07 77.6048V86.9548C98.07 92.7848 93.285 97.5698 87.455 97.5698H78.105C75.96 97.5698 72.825 98.7248 71.175 100.155L62.485 107.635C58.69 110.88 52.475 110.88 48.625 107.635L39.935 100.155C38.285 98.7248 35.205 97.5698 33.005 97.5698H23.49C17.66 97.5698 12.875 92.7848 12.875 86.9548V77.5498C12.875 75.4048 11.72 72.3248 10.345 70.6748L2.91997 61.9298C-0.270034 58.1348 -0.270034 51.9748 2.91997 48.1798L10.345 39.4348C11.72 37.7848 12.875 34.7048 12.875 32.5598V23.0998C12.875 17.2698 17.66 12.4848 23.49 12.4848H33.005C35.15 12.4848 38.285 11.3298 39.935 9.89976L48.625 2.47477Z"
      fill="url(#paint0_linear_72_619)"
    />
    {/* Checkmark centered in the star */}
    <Path
      d="M42.845 73.4352C41.745 73.4352 40.7 72.9952 39.93 72.2252L31.62 63.9152C30.025 62.3202 30.025 59.6802 31.62 58.0852C33.215 56.4902 35.855 56.4902 37.45 58.0852L42.845 63.4802L71.495 34.8302C73.09 33.2352 75.73 33.2352 77.325 34.8302C78.92 36.4252 78.92 39.0652 77.325 40.6602L45.76 72.2252C44.99 72.9952 43.945 73.4352 42.845 73.4352Z"
      fill="#0D0D0D"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_72_619"
        x1="110.569"
        y1="110.069"
        x2="0.541222"
        y2="0.0272607"
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#7952FC" />
        <Stop offset="1" stopColor="#B15CDE" />
      </LinearGradient>
    </Defs>
  </Svg>
);

const ArtistVerifiedScreen = ({ navigation, route }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (route?.params?.isProfileComplete) {
        console.log('[ArtistVerifiedScreen] isProfileComplete:', route?.params?.isProfileComplete);
        navigation.navigate('ArtistHome', route?.params || {});
      } else {
        console.log('[ArtistVerifiedScreen] isProfileComplete:', route?.params?.isProfileComplete);
        navigation.navigate('CreateProfile', route?.params || {});
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [navigation, route]);

  return (
    <View style={styles.container}>
      <SignUpBackground 
        style={styles.backgroundSvg}
        width={width}
        height={height}
      />
      <SafeAreaView style={styles.overlay}>
        <View style={styles.content}>
          <VerificationSuccessIcon style={styles.icon} />
          <Text style={styles.title}>Verification Success</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Nunito Sans',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'rgba(198, 197, 237, 1)',
  },
});

export default ArtistVerifiedScreen;
