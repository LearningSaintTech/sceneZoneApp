import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ArtistAddPayment = ({ navigation, route }) => {
  const [paymentMethod, setPaymentMethod] = useState('Master Card');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}> 
          <Ionicons name="arrow-back" size={24} color="#C6C5ED" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Payment Method Label */}
        <Text style={styles.label}>Payment Method</Text>
        {/* Payment Method Field (Dropdown look, not functional) */}
        <View style={styles.paymentMethodField}>
          <Text style={{ color: '#C6C5ED', flex: 1 }}>{paymentMethod}</Text>
          <Ionicons name="chevron-down" size={22} color="#7A7A90" />
        </View>
        {/* Card Holder Name Label */}
        <Text style={[styles.label, { marginTop: 20 }]}>Card Holder Name</Text>
        <TextInput
          style={styles.cardHolderField}
          placeholder="Franklin Clinton"
          placeholderTextColor="#7A7A90"
          value={cardHolder}
          onChangeText={setCardHolder}
        />
        {/* Card Number Label */}
        <Text style={[styles.label, { marginTop: 20 }]}>Card Number</Text>
        <TextInput
          style={styles.cardNumberField}
          placeholder="1234 5678 9012 3456"
          placeholderTextColor="#7A7A90"
          value={cardNumber}
          onChangeText={setCardNumber}
          keyboardType="number-pad"
        />
        {/* Expired Date and CVV */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Expired Date</Text>
            <TextInput
              style={styles.cardNumberField}
              placeholder="12/2024"
              placeholderTextColor="#7A7A90"
              value={expiry}
              onChangeText={setExpiry}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.cardNumberField}
              placeholder="123"
              placeholderTextColor="#7A7A90"
              value={cvv}
              onChangeText={setCvv}
              keyboardType="number-pad"
              secureTextEntry={true}
            />
          </View>
        </View>
      </ScrollView>
      {/* Save Button */}
      <View style={styles.saveButtonContainer}>
        <LinearGradient
          colors={["#B15CDE", "#7952FC"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.saveButton}
        >
          <TouchableOpacity style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }} activeOpacity={0.85}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    display: 'flex',
    width: 393,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#C6C5ED',
    // Shadow for iOS
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
    paddingTop:40,
  },
  headerTitle: {
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight:90,
  },
  label: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginBottom: 8,
  },
  paymentMethodField: {
    display: 'flex',
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
  
  },
  cardHolderField: {
    display: 'flex',
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8D6BFC',
    backgroundColor: '#121212',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    
    
  },
  cardNumberField: {
    display: 'flex',
    height: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
    color: '#C6C5ED',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
  },
  saveButtonContainer: {
    padding: 16,
    backgroundColor: '#121212',
    paddingBottom:30,
  },
  saveButton: {
    display: 'flex',
    width: 361,
    height: 52,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
    borderRadius: 14,
    overflow: 'hidden',
    
  },
  saveButtonText: {
    color: '#FFF',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ArtistAddPayment;
