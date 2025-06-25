import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const AddPaymentMethodScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
        <View style={{ width: 24 }} />{/* Spacer to center the title */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Payment Method Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Payment Method</Text>
          <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Master Card</Text>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Card Holder Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Franklin Clinton"
            placeholderTextColor="#888"
          />
        </View>

        {/* Card Number Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor="#888"
            keyboardType="number-pad"
          />
        </View>

        {/* Expired Date and CVV Inputs */}
        <View style={styles.rowInputContainer}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.inputLabel}>Expired Date</Text>
            <TextInput
              style={styles.input}
              placeholder="12/2024"
              placeholderTextColor="#888"
              keyboardType="number-pad"
            />
          </View>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              secureTextEntry={true}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <LinearGradient
          colors={['#B15CDE', '#7952FC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 100, // Add padding at the bottom for the button
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1a1a1a', // Dark input background
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#1a1a1a', // Dark input background
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#fff',
  },
  rowInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%%',
    marginBottom: 0, // Remove bottom margin when in a row
  },
  saveButton: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden', // To make gradient respect border radius
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddPaymentMethodScreen; 