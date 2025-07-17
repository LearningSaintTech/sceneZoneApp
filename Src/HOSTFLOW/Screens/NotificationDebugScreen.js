import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useSelector } from 'react-redux';
import api from '../services/api';

const NotificationDebugScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [healthCheck, setHealthCheck] = useState(null);
  const [fcmStatus, setFcmStatus] = useState(null);
  const [notificationStats, setNotificationStats] = useState(null);
  const [testResult, setTestResult] = useState(null);

  const { token, userType } = useSelector(state => state.auth);
  const { fcmToken, deviceId } = useSelector(state => state.notifications);

  const performHealthCheck = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/debug/health');
      setHealthCheck(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to perform health check');
    } finally {
      setLoading(false);
    }
  };

  const checkFCMStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/debug/fcm-status');
      setFcmStatus(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to check FCM status');
    } finally {
      setLoading(false);
    }
  };

  const getNotificationStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/debug/stats');
      setNotificationStats(response.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to get notification stats');
    } finally {
      setLoading(false);
    }
  };

  const sendTestNotification = async () => {
    setLoading(true);
    try {
      const response = await api.post('/notifications/debug/test', {
        title: 'Test Notification',
        body: 'This is a test notification from debug screen',
      });
      setTestResult(response.data);
      Alert.alert('Success', 'Test notification sent successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  const forceSaveFCMToken = async () => {
    if (!fcmToken || !deviceId) {
      Alert.alert('Error', 'FCM token or device ID not available');
      return;
    }
    setLoading(true);
    try {
      await api.post('/notifications/debug/force-save-fcm', {
        fcmToken,
        deviceId,
      });
      Alert.alert('Success', 'FCM token force saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to force save FCM token');
    } finally {
      setLoading(false);
    }
  };

  const renderHealthCheck = () => {
    if (!healthCheck) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Check Results</Text>
        <Text style={styles.timestamp}>Timestamp: {healthCheck.timestamp}</Text>
        <View style={styles.subSection}>
          <Text style={styles.subTitle}>FCM Token Status</Text>
          <Text style={styles.text}>Has Token: {healthCheck.fcmTokenStatus?.hasToken ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.text}>Is Active: {healthCheck.fcmTokenStatus?.isActive ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.text}>Last Seen: {healthCheck.fcmTokenStatus?.lastSeen || 'Never'}</Text>
          <Text style={styles.text}>Message: {healthCheck.fcmTokenStatus?.message}</Text>
        </View>
        <View style={styles.subSection}>
          <Text style={styles.subTitle}>Notification Stats</Text>
          <Text style={styles.text}>Total: {healthCheck.notificationStats?.total || 0}</Text>
          <Text style={styles.text}>Unread: {healthCheck.notificationStats?.unread || 0}</Text>
          <Text style={styles.text}>Push Sent: {healthCheck.notificationStats?.pushSent || 0}</Text>
        </View>
        {healthCheck.issues && healthCheck.issues.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>Issues Found</Text>
            {healthCheck.issues.map((issue, index) => (
              <Text key={index} style={styles.issueText}>• {issue}</Text>
            ))}
          </View>
        )}
        {healthCheck.recommendations && healthCheck.recommendations.length > 0 && (
          <View style={styles.subSection}>
            <Text style={styles.subTitle}>Recommendations</Text>
            {healthCheck.recommendations.map((rec, index) => (
              <Text key={index} style={styles.recommendationText}>• {rec}</Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderFCMStatus = () => {
    if (!fcmStatus) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FCM Token Status</Text>
        <Text style={styles.text}>Has Token: {fcmStatus.hasToken ? '✅ Yes' : '❌ No'}</Text>
        <Text style={styles.text}>Is Active: {fcmStatus.isActive ? '✅ Yes' : '❌ No'}</Text>
        <Text style={styles.text}>Last Seen: {fcmStatus.lastSeen || 'Never'}</Text>
        <Text style={styles.text}>Message: {fcmStatus.message}</Text>
      </View>
    );
  };

  const renderNotificationStats = () => {
    if (!notificationStats) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Statistics</Text>
        <Text style={styles.text}>Total Notifications: {notificationStats.total}</Text>
        <Text style={styles.text}>Unread Notifications: {notificationStats.unread}</Text>
        <Text style={styles.text}>Push Notifications Sent: {notificationStats.pushSent}</Text>
        <Text style={styles.text}>Message: {notificationStats.message}</Text>
      </View>
    );
  };

  const renderTestResult = () => {
    if (!testResult) return null;
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Notification Result</Text>
        <Text style={styles.text}>Success: {testResult.success ? '✅ Yes' : '❌ No'}</Text>
        <Text style={styles.text}>Message: {testResult.message}</Text>
        {testResult.data?.notificationId && (
          <Text style={styles.text}>Notification ID: {testResult.data.notificationId}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Debug</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Current User Info</Text>
          <Text style={styles.infoText}>User Type: {userType}</Text>
          <Text style={styles.infoText}>Has Token: {token ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.infoText}>Has FCM Token: {fcmToken ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.infoText}>Has Device ID: {deviceId ? '✅ Yes' : '❌ No'}</Text>
        </View>
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.button} onPress={performHealthCheck} disabled={loading}>
            <Text style={styles.buttonText}>Perform Health Check</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={checkFCMStatus} disabled={loading}>
            <Text style={styles.buttonText}>Check FCM Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={getNotificationStats} disabled={loading}>
            <Text style={styles.buttonText}>Get Notification Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={sendTestNotification} disabled={loading}>
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={forceSaveFCMToken} disabled={loading}>
            <Text style={styles.buttonText}>Force Save FCM Token</Text>
          </TouchableOpacity>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
        {renderHealthCheck()}
        {renderFCMStatus()}
        {renderNotificationStats()}
        {renderTestResult()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2a2a2a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 4,
  },
  buttonSection: {
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  subSection: {
    marginBottom: 12,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 2,
  },
  issueText: {
    fontSize: 14,
    color: '#ff6b6b',
    marginBottom: 2,
  },
  recommendationText: {
    fontSize: 14,
    color: '#4ecdc4',
    marginBottom: 2,
  },
});

export default NotificationDebugScreen; 