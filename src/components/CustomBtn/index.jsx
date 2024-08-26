import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../constants/theme';

function CustomBtn({
  style,
  lbl,
  onPress,
  disabled,
  lblStyle,
  loading,
  loaderColor = 'black',
}) {
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[styles.btn, style]}>
        {loading ? <ActivityIndicator size={24} color={loaderColor} /> : null}
        <Text style={[styles.btnText, lblStyle,  loading ? {display: 'none'} : null]}>{lbl}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary.main,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary.darkgray,
    textTransform: 'uppercase',
  },
});

export default CustomBtn;
