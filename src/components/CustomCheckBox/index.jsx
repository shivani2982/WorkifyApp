import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import {Colors} from '../../constants/theme';

const CustomCheckBox = ({label, onChange, isChecked, simpleCheckBox}) => {
  return (
    <>
      {simpleCheckBox ? (
        <TouchableOpacity style={styles.container} onPress={onChange}>
          <View style={styles.simplecheckbox}>
            {isChecked ? (
              <MaterialCommunityIcons name="checkbox-marked" size={24} color={Colors.primary.lightBlack} />
            ) : (
              <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color={Colors.primary.lightBlack} />
            )}
          </View>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.container} onPress={onChange}>
          <View style={styles.checkbox}>
            {isChecked ? (
              <Icon name="check-square-o" size={20} color="green" />
            ) : (
              <Icon name="square-o" size={20} color="gray" />
            )}
          </View>
          <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
  },
  simplecheckbox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: 'gray',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.primary.lightBlack,
    fontWeight: '500',
  },
});

export default CustomCheckBox;
