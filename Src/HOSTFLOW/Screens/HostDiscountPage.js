

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  Modal as RNModal
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../Config/env";
 import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const HostDiscountPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const eventId = route.params?.eventId;
  const token = useSelector((state) => state.auth.token) || "";
console.log("eventId",eventId)
  const [level1, setLevel1] = useState("10");
  const [level2, setLevel2] = useState("5");
  const [level3, setLevel3] = useState("3");
  const [customAlert, setCustomAlert] = React.useState({ visible: false, title: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (!eventId) return;
      setLoading(true);
      setFetchError(null);
      try {
        const response = await axios.get(`https://api.thescenezone.com/api/host/events/events/${eventId}/discount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.discount) {
          setLevel1(response.data.discount.level1?.toString() || "");
          setLevel2(response.data.discount.level2?.toString() || "");
          setLevel3(response.data.discount.level3?.toString() || "");
        } else {
          setFetchError(response.data.message || "Failed to fetch discount");
        }
      } catch (err) {
        setFetchError(err.response?.data?.message || err.message || "Failed to fetch discount");
      } finally {
        setLoading(false);
      }
    };
    fetchDiscount();
  }, [eventId, token]);

  // Function to handle saving discounts
  const handleSaveDiscounts = async () => {
    if (!eventId) {
      setCustomAlert({ visible: true, title: "Error", message: "No event ID provided." });
      return;
    }
    if (!token) {
      setCustomAlert({ visible: true, title: "Error", message: "Please log in to perform this action." });
      return;
    }

    // Parse discount values and remove '%' if present
    const parseDiscount = (value) => {
      const cleanedValue = value.replace("%", "").trim();
      const num = parseFloat(cleanedValue);
      return isNaN(num) ? 0 : num;
    };

    const discountData = {
      Discount: {
        level1: parseDiscount(level1),
        level2: parseDiscount(level2),
        level3: parseDiscount(level3),
      },
    };

    try {
      console.log(
        `Making PATCH request to https://api.thescenezone.com/api/host/events/update-event-discount/${eventId}`
      );
      const response = await axios.patch(
        `${API_BASE_URL}/host/events/update-event-discount/${eventId}`,
        discountData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("Update Discounts API Response:", response.data);

      if (response.data.success) {
        setCustomAlert({ visible: true, title: "Success", message: "Discounts updated successfully." });
        navigation.goBack();
      } else {
        setCustomAlert({ visible: true, title: "Error", message: response.data.message || "Failed to update discounts." });
      }
    } catch (error) {
      console.error("Error updating discounts:", error.response?.data || error.message);
      setCustomAlert({ visible: true, title: "Error", message: error.response?.data?.message || "Failed to update discounts." });
    }
  };
  const CustomAlertModal = () => (
    <RNModal
      visible={customAlert.visible}
      transparent
      animationType="fade"
      onRequestClose={() => setCustomAlert({ ...customAlert, visible: false })}
    >
      <View style={styles.shortlistModalOverlay}>
        <View style={styles.shortlistModalContent}>
          <Ionicons name={customAlert.title === 'Success' ? 'checkmark-done-circle' : 'alert-circle'} size={48} color="#a95eff" style={{ marginBottom: 16 }} />
          <Text style={styles.shortlistModalTitle}>{customAlert.title}</Text>
          <Text style={styles.shortlistModalMessage}>{customAlert.message}</Text>
          <TouchableOpacity
            style={styles.shortlistModalButton}
            onPress={() => setCustomAlert({ ...customAlert, visible: false })}
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              style={styles.shortlistModalButtonGradient}
            >
              <Text style={styles.shortlistModalButtonText}>OK</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.statusBarSpacer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discount</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Content */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Loading discount...</Text>
        </View>
      ) : fetchError ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: 'red', fontSize: 16 }}>{fetchError}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Level 1 (%)</Text>
            <TextInput
              style={styles.input}
              value={level1}
              onChangeText={setLevel1}
              placeholder="Enter Level 1 Discount"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Level 2 (%)</Text>
            <TextInput
              style={[styles.input, styles.inputFocused]}
              value={level2}
              onChangeText={setLevel2}
              placeholder="Enter Level 2 Discount"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Level 3 (%)</Text>
            <TextInput
              style={styles.input}
              value={level3}
              onChangeText={setLevel3}
              placeholder="Enter Level 3 Discount"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDiscounts}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      <CustomAlertModal />
    </SafeAreaView>
  );
};

export default HostDiscountPage;



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#A259FF",
    borderBottomWidth: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#fff",
  },
  inputFocused: {
    borderColor: "#A259FF",
  },
  saveButton: {
    marginTop: 40,
    borderColor: "#A259FF",
    borderWidth: 1.5,
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveText: {
    color: "#A259FF",
    fontSize: 16,
    fontWeight: "500",
  },
  shortlistModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  shortlistModalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#333',
  },
  shortlistModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  shortlistModalMessage: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  shortlistModalButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  shortlistModalButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  shortlistModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});