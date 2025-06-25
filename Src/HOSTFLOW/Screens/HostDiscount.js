import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const HostDiscount = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [level1, setLevel1] = useState('10%');
  const [level2, setLevel2] = useState('5%');
  const [level3, setLevel3] = useState('3%');
  const [level1Focused, setLevel1Focused] = useState(false);
  const [level2Focused, setLevel2Focused] = useState(false);
  const [level3Focused, setLevel3Focused] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 20 : Math.max(insets.top + 10, 20) }]}> 
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack && navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discount</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Level 1 */}
        <Text style={styles.levelTitle}>Level 1</Text>
        <View style={[styles.inputContainer, level1Focused && styles.inputContainerActive]}>
          <TextInput
            style={styles.input}
            value={level1}
            onChangeText={setLevel1}
            placeholder="10%"
            placeholderTextColor="#fff"
            keyboardType="default"
            onFocus={() => setLevel1Focused(true)}
            onBlur={() => setLevel1Focused(false)}
          />
        </View>
        {/* Level 2 */}
        <Text style={styles.levelTitle}>Level 2</Text>
        <View style={[styles.inputContainer, level2Focused && styles.inputContainerActive]}>
          <TextInput
            style={styles.input}
            value={level2}
            onChangeText={setLevel2}
            placeholder="5%"
            placeholderTextColor="#fff"
            keyboardType="default"
            onFocus={() => setLevel2Focused(true)}
            onBlur={() => setLevel2Focused(false)}
          />
        </View>
        {/* Level 3 */}
        <Text style={styles.levelTitle}>Level 3</Text>
        <View style={[styles.inputContainer, level3Focused && styles.inputContainerActive]}>
          <TextInput
            style={styles.input}
            value={level3}
            onChangeText={setLevel3}
            placeholder="3%"
            placeholderTextColor="#fff"
            keyboardType="default"
            onFocus={() => setLevel3Focused(true)}
            onBlur={() => setLevel3Focused(false)}
          />
        </View>
        {/* Save Button */}
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.saveButton}>
          <MaskedView
            maskElement={
              <Text style={styles.saveButtonText}>Save</Text>
            }
          >
            <LinearGradient
              colors={["#B15CDE", "#7952FC"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.saveButtonText, { opacity: 0 }]}>Save</Text>
            </LinearGradient>
          </MaskedView>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 393,
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderColor: '#C6C5ED',
    backgroundColor: '#121212',
    shadowColor: 'rgba(104, 59, 252, 0.05)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Nunito Sans',
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginRight:200,
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingTop: 32,
    paddingBottom: 32,
    flexGrow: 1,
  },
  levelTitle: {
    color: '#7A7A90',
    fontFamily: 'Nunito Sans',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 18,
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 16,
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    gap: 12,
    alignSelf: 'stretch',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#24242D',
    backgroundColor: '#121212',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  inputContainerActive: {
    borderColor: '#8D6BFC',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito Sans',
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
    borderWidth: 1,
    borderColor: '#B15CDE',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    marginTop: 40,
  },
  saveButtonText: {
    textAlign: 'center',
    fontFamily: 'Nunito Sans',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '500',
    lineHeight: 21,
    // Gradient handled by MaskedView + LinearGradient
  },
});

export default HostDiscount;
