import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const CustomToggle = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
      style={[styles.toggleContainer, { backgroundColor: value ? '#B15CDE' : '#BCA4F7' }]}
    >
      <View
        style={[
          styles.toggleThumb,
          { left: value ? 20 : 4 }
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 36,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#BCA4F7',
  },
  toggleThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 4,
    backgroundColor: '#19191a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default CustomToggle; 