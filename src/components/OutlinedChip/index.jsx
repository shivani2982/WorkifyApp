import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const OutlinedChip = ({label, onDelete}) => {
  return (
    <>
      <View style={styles.chipContainer}>
        <Text style={styles.chipText}>{label}</Text>
        <Text style={styles.deleteIcon} onPress={onDelete}>
          ❌
        </Text>
      </View>
      <View style={{marginTop: 10}}>
        <Text style={styles.smallTxt}>Selected Skills</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={styles.skillContainer}>
            <Text style={{color: Colors.primary.lightBlack, marginRight: 5}}>
              UI / UX Designer
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={Colors.primary.lightBlack}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.skillContainer}>
            <Text style={{color: Colors.primary.lightBlack, marginRight: 5}}>
              UI / UX Designer
            </Text>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={Colors.primary.lightBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
  },
  chipText: {
    marginRight: 5,
    color: '#000',
  },
  deleteIcon: {
    color: 'red',
  },
});
export default OutlinedChip;
