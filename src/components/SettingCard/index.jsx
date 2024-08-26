import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInputBase,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function SettingCard({iconName, iconColor, text, textColor, onPress}) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.row,
          {
            justifyContent: 'space-between',
            paddingVertical: 16,
            paddingHorizontal: 10,
            borderColor: Colors.primary.lightGray,
            borderWidth: 1,
            borderRadius: 12,
            marginBottom: 10,
          },
        ]}>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name={iconName}
            size={30}
            color={iconColor ? iconColor : Colors.primary.lightBlack}
          />
          <Text
            style={[
              styles.smallTxt,
              {color: textColor ? textColor : Colors.primary.lightBlack},
            ]}>
            {text}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={iconColor ? iconColor : Colors.primary.lightBlack}
        />
      </TouchableOpacity>
    </>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  smallTxt: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.lightBlack,
  },
});

export default SettingCard;
