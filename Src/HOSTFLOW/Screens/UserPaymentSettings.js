import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import VisaIcon from '../assets/icons/Visa';
import MasterIcon from '../assets/icons/Mater';
import BackButtonIcon from '../assets/icons/backbutton';
import ArrowIcon from '../assets/icons/arrow';

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
  },
  borderRadius: {
    sm: Math.max(width * 0.015, 6),
    md: Math.max(width * 0.025, 10),
    lg: Math.max(width * 0.04, 15),
    xl: Math.max(width * 0.06, 20),
  },
  buttonHeight: Math.max(height * 0.065, 50),
  iconSize: Math.max(width * 0.06, 20),
  cardMargin: Math.max(width * 0.04, 16),
  iconContainerSize: Math.max(width * 0.12, 40),
};

const UserPaymentSettingsContent = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('googlepay'); // Default selected

  const handleConfirmPayment = () => {
    // Implement payment confirmation logic here
    console.log('Confirming payment with:', selectedPaymentMethod);
    // Navigation removed as per request
  };

  return (
    <View style={[
      styles.container,
      {
        // Comprehensive safe area handling for main container
        paddingTop: Math.max(insets.top, 0),
      }
    ]}>
      {/* Enhanced Header with comprehensive safe area handling */}
      <View style={[
        styles.header,
        {
          // Dynamic header positioning based on safe area
          paddingTop: Math.max(dimensions.spacing.xl, 20),
          paddingBottom: Math.max(dimensions.spacing.md, 12),
          marginTop: Math.max(dimensions.spacing.sm, 8),
        }
      ]}>
        <TouchableOpacity 
          style={[
            styles.backButtonContainer,
            {
              minWidth: 46,
              minHeight: 46,
              padding: 2
            }
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackButtonIcon width={28} height={28} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Payment Method</Text>
        </View>
        <View style={[
          styles.headerSpacer,
          {
            width: Math.max(dimensions.iconSize, 24),
          }
        ]} />
      </View>

      <ScrollView 
        style={styles.paymentMethodsContainer}
        contentContainerStyle={[
          styles.scrollContent,
          {
            // Enhanced content padding with proper safe area consideration
            paddingBottom: Math.max(insets.bottom + 120, 140),
          }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* Enhanced Google Pay with responsive design */}
        <TouchableOpacity
          style={[
            styles.paymentMethodCard, 
            selectedPaymentMethod === 'googlepay' && styles.paymentMethodCardSelected,
            {
              marginBottom: Math.max(dimensions.spacing.md, 12),
            }
          ]}
          onPress={() => setSelectedPaymentMethod('googlepay')}
          activeOpacity={0.8}
        >
          <View style={[
            styles.paymentMethodContent,
            {
              padding: Math.max(dimensions.spacing.lg, 15),
            }
          ]}>
            <View style={[
              styles.paymentIconContainer,
              {
                width: 34,
                height: 34,
                borderRadius: dimensions.iconContainerSize / 2,
                marginRight: Math.max(dimensions.spacing.lg, 15),
              }
            ]}>
              <GoogleIcon
                style={styles.paymentIcon}
                width={24}
                height={24}
              />
            </View>
            <View style={styles.paymentDetails}>
              <View style={[
                styles.paymentMethodTitleContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodTitle}>Google Pay</Text>
              </View>
              <View style={[
                styles.paymentMethodInfoContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodInfo}>f************n@gmail.com</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text>
                  <Text style={styles.paymentMethodBalanceLabel}>Balance </Text>
                  <Text style={styles.paymentMethodBalanceValue}>$1,234.00</Text>
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkmarkContainer,
              {
                marginLeft: Math.max(dimensions.spacing.sm, 10),
              }
            ]}>
              <ArrowIcon width={14} height={15} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced Apple Pay with responsive design */}
        <TouchableOpacity
          style={[
            styles.paymentMethodCard, 
            selectedPaymentMethod === 'applepay' && styles.paymentMethodCardSelected,
            {
              marginBottom: Math.max(dimensions.spacing.md, 12),
            }
          ]}
          onPress={() => setSelectedPaymentMethod('applepay')}
          activeOpacity={0.8}
        >
          <View style={[
            styles.paymentMethodContent,
            {
              padding: Math.max(dimensions.spacing.lg, 15),
            }
          ]}>
            <View style={[
              styles.paymentIconContainer,
              {
                width: 34,
                height: 34,
                borderRadius: dimensions.iconContainerSize / 2,
                marginRight: Math.max(dimensions.spacing.lg, 15),
              }
            ]}>
              <AppleIcon
                style={styles.paymentIcon}
                width={24}
                height={24}
              />
            </View>
            <View style={styles.paymentDetails}>
              <View style={[
                styles.paymentMethodTitleContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodTitle}>Apple Pay</Text>
              </View>
              <View style={[
                styles.paymentMethodInfoContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodInfo}>f************n@gmail.com</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text>
                  <Text style={styles.paymentMethodBalanceLabel}>Balance </Text>
                  <Text style={styles.paymentMethodBalanceValue}>$2,766.00</Text>
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkmarkContainer,
              {
                marginLeft: Math.max(dimensions.spacing.sm, 10),
              }
            ]}>
              <ArrowIcon width={14} height={15} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced Visa with proper icon replacement */}
        <TouchableOpacity
          style={[
            styles.paymentMethodCard, 
            selectedPaymentMethod === 'visa' && styles.paymentMethodCardSelected,
            {
              marginBottom: Math.max(dimensions.spacing.md, 12),
            }
          ]}
          onPress={() => setSelectedPaymentMethod('visa')}
          activeOpacity={0.8}
        >
          <View style={[
            styles.paymentMethodContent,
            {
              padding: Math.max(dimensions.spacing.lg, 15),
            }
          ]}>
            <View style={[
              styles.paymentIconContainer,
              {
                width:34,
                height: 34,
                borderRadius: dimensions.iconContainerSize / 2,
                marginRight: Math.max(dimensions.spacing.lg, 15),
              }
            ]}>
              <VisaIcon
                style={styles.paymentIcon}
                width={24}
                height={24}
              />
            </View>
            <View style={styles.paymentDetails}>
              <View style={[
                styles.paymentMethodTitleContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodTitle}>Visa</Text>
              </View>
              <View style={[
                styles.paymentMethodInfoContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodInfo}>**** **** **** 1234</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text>
                  <Text style={styles.paymentMethodBalanceLabel}>Balance </Text>
                  <Text style={styles.paymentMethodBalanceValue}>$1,876,766.00</Text>
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkmarkContainer,
              {
                marginLeft: Math.max(dimensions.spacing.sm, 10),
              }
            ]}>
              <ArrowIcon width={14} height={15} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Enhanced Master Card with proper icon replacement */}
        <TouchableOpacity
          style={[
            styles.paymentMethodCard, 
            selectedPaymentMethod === 'mastercard' && styles.paymentMethodCardSelected,
            {
              marginBottom: Math.max(dimensions.spacing.md, 12),
            }
          ]}
          onPress={() => setSelectedPaymentMethod('mastercard')}
          activeOpacity={0.8}
        >
          <View style={[
            styles.paymentMethodContent,
            {
              padding: Math.max(dimensions.spacing.lg, 15),
            }
          ]}>
            <View style={[
              styles.paymentIconContainer,
              {
                width: 34,
                height: 34,
                borderRadius: dimensions.iconContainerSize / 2,
                marginRight: Math.max(dimensions.spacing.lg, 15),
              }
            ]}>
              <MasterIcon
                style={styles.paymentIcon}
                width={24}
                height={24}
              />
            </View>
            <View style={styles.paymentDetails}>
              <View style={[
                styles.paymentMethodTitleContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodTitle}>Master Card</Text>
              </View>
              <View style={[
                styles.paymentMethodInfoContainer,
                {
                  marginBottom: Math.max(dimensions.spacing.xs, 4),
                }
              ]}>
                <Text style={styles.paymentMethodInfo}>**** **** **** 1234</Text>
              </View>
              <View style={styles.paymentMethodBalanceContainer}>
                <Text>
                  <Text style={styles.paymentMethodBalanceLabel}>Balance </Text>
                  <Text style={styles.paymentMethodBalanceValue}>$2,876,766.00</Text>
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkmarkContainer,
              {
                marginLeft: Math.max(dimensions.spacing.sm, 10),
              }
            ]}>
              <ArrowIcon width={14} height={15} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* Enhanced Confirm Payment Button with comprehensive safe area handling */}
      <View style={[
        styles.buttonContainer,
        {
          padding: dimensions.cardMargin,
          marginBottom: Math.max(insets.bottom + 20, 30),
        }
      ]}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.confirmButtonGradient,
            {
              borderRadius: dimensions.borderRadius.lg,
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddPaymentMethodScreen')} 
            style={[
              styles.confirmButton,
              {
                paddingVertical: Math.max(dimensions.spacing.lg, 15),
                minHeight: Math.max(dimensions.buttonHeight, 54),
              }
            ]}
            activeOpacity={0.9}
          >
            <View style={styles.confirmButtonTextContainer}>
              <Text style={styles.confirmButtonText}>Add Payment Method</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const UserPaymentSettingsScreen = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <UserPaymentSettingsContent navigation={navigation} />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    display: 'flex',
    width: 393,
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
  },
  backButtonContainer: {
    padding: Math.max(dimensions.spacing.xs, 4),
    borderRadius: dimensions.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    // Enhanced shadow for better visual feedback
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerSpacer: {
    // Dynamic width set in component
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 24,
    overflow: 'hidden',
    marginRight:120,
  },
  paymentMethodsContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: dimensions.cardMargin,
    paddingTop: Math.max(dimensions.spacing.lg, 16),
  },
  paymentMethodCard: {
    display: 'flex',
    height: 110,
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    minHeight: 0,
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34344A',
    backgroundColor: '#1A1A1F',
    overflow: 'hidden',
  },
  paymentMethodCardSelected: {
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: '#1A1A1F',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // Needed for zIndex to make content visible over gradient
    zIndex: 1, // Ensure content is above gradient
  },
  paymentIconContainer: {
    backgroundColor: '#191919',
    width: 22,
    height: 22,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  paymentIcon: {
   
  },
  paymentDetails: {
    flex: 2, // Take available space
  },
  paymentMethodTitleContainer: {
    // Margin set in component
  },
  paymentMethodTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
  },
  paymentMethodInfoContainer: {
    // Margin set in component
  },
  paymentMethodInfo: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    overflow: 'hidden',
  },
  paymentMethodBalanceContainer: {
    // No additional styling needed
  },
  paymentMethodBalanceLabel: {
    color: '#B4B4C1',
    fontFamily: 'Nunito Sans',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    overflow: 'hidden',
  },
  paymentMethodBalanceValue: {
    color: '#8D6BFC',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 21,
    overflow: 'hidden',
    
  },
  checkmarkContainer: {
    // Margin set in component
  },
  buttonContainer: {
    // Padding and margin set in component
  },
  confirmButtonGradient: {
    overflow: 'hidden',
    // Enhanced shadow for better visual prominence
    shadowColor: '#7952FC',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonTextContainer: {
    // No additional styling needed
  },
  confirmButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
  },
});

export default UserPaymentSettingsScreen; 