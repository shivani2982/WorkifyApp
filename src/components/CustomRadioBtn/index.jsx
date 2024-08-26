import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

const CustomRadioBtn = ({ label, onSelect, selected }) => {
  return (
    <TouchableOpacity onPress={onSelect} style={styles.radioButton}>
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary.darkgray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    borderColor: Colors.primary.black, // Change the color when selected
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: Colors.primary.black, // Change the color when selected
  },
  label: {
    fontSize: 15,
    color: Colors.primary.darkgray
  },
});

export default CustomRadioBtn;
