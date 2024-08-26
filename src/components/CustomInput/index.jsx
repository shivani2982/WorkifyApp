import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/theme';

function CustomInput({
  placeholder,
  keyboardType,
  onBlur,
  onChange,
  onChangeText,
  multiline,
  editable,
  scrollEnabled,
  value,
  isNoIcon,
  isIcon,
  secureTextEntry,
  isPasswordIcon,
  isIconName,
  style,
  containerStyle,
  numberOfLines,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View >
      {isIcon ? (
        <View style={[styles.innerContainer, containerStyle]}>
          <MaterialCommunityIcons name={isIconName} size={20} color={Colors.primary.darkgray} />

          <TextInput
            style={[styles.styleInput, style]}
            placeholderTextColor={Colors.primary.darkgray}
            placeholderStyle={{color: 'red'}}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onChange={onChange}
            value={value}
            secureTextEntry={secureTextEntry && isPasswordVisible}
            multiline={multiline}
            editable={editable}
            scrollEnabled={scrollEnabled}
            keyboardType={keyboardType}
          />
          {isPasswordIcon ? (
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={Colors.primary.darkgray}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
          <TextInput
            style={[
              styles.styleInput,
              style,
              {borderRadius: 12, paddingVertical: 15},
            ]}
            placeholderTextColor={Colors.primary.darkgray}
            placeholderStyle={{color: 'red'}}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChangeText}
            onChange={onChange}
            value={value}
            multiline={multiline}
            editable={editable}
            scrollEnabled={scrollEnabled}
            keyboardType={keyboardType}
            numberOfLines={numberOfLines}
          />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent:'flex-start',
    backgroundColor: 'white',
    paddingRight: 50,
    paddingLeft: 10,
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  styleTxt: {},
  styleInput: {
    width: '100%',
    backgroundColor: Colors.primary.white,
    color: Colors.primary.darkgray,
    padding: 5,
    paddingHorizontal: 10,
  },
});

export default CustomInput;
