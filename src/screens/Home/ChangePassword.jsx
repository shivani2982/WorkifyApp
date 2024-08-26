import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

function ChangePassword({route, navigation}) {
  const {user_id} = route.params;
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const updateMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'put',
        url: `updatePassword`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        setOldPassword('');
        setNewPassword('');
        setRetypePassword('');
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
        // navigation.navigate('AddSkills');
      } else if (e.status === 404) {
        showMessage({
          message: e.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      } else {
        showMessage({
          message: e.message || 'Old password is incorrect',
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      }
    },
  });

  const handleUpdate = async () => {
    if (
      oldPassword.length > 0 &&
      newPassword.length > 0 &&
      newPassword === retypePassword
    ) {
      const data = {
        user_id: parseInt(user_id),
        oldPassword: oldPassword,
        newPassword: newPassword,
      };
      await updateMutation.mutate(data);

      // console.log(loginMutation.isLoading);
      // console.log(data);
    } else if (newPassword !== retypePassword) {
      showMessage({
        message: 'Password does not match',
        type: 'danger',
        color: '#fff',
        backgroundColor: 'red',
        floating: true,
      });
    } else {
      showMessage({
        message: 'Please fill all the fields',
        type: 'danger',
        color: '#fff',
        backgroundColor: Colors.primary.red,
        floating: true,
      });
    }
  };

  // console.log('detail', userDetail.useraccount_id);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginRight: '20%'}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Password Change</Text>
        </View>

        <CustomInput
          isIcon={true}
          secureTextEntry={true}
          value={oldPassword}
          onChangeText={e => {
            setOldPassword(e);
          }}
          isPasswordIcon={true}
          placeholder="Old Password"
          style={{backgroundColor: Colors.primary.sub, margin: 0}}
          containerStyle={{backgroundColor: Colors.primary.sub, marginTop: 40}}
        />

        <CustomInput
          isIcon={true}
          secureTextEntry={true}
          value={newPassword}
          onChangeText={e => {
            setNewPassword(e);
          }}
          isPasswordIcon={true}
          placeholder="New Password"
          style={{backgroundColor: Colors.primary.sub, margin: 0}}
          containerStyle={{backgroundColor: Colors.primary.sub, margin: 0}}
        />

        <CustomInput
          isIcon={true}
          secureTextEntry={true}
          value={retypePassword}
          onChangeText={e => {
            setRetypePassword(e);
          }}
          isPasswordIcon={true}
          placeholder="Re-type New Password"
          style={{backgroundColor: Colors.primary.sub, margin: 0}}
          containerStyle={{backgroundColor: Colors.primary.sub, margin: 0}}
        />
        <View style={{marginTop: 60}}>
          <CustomBtn
            lbl={'Password Changed'}
            onPress={handleUpdate}
            loading={updateMutation.isPending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.white,
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  scrollContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
  },
  largeTxt: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary.lightBlack,
  },
  smallTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.lightBlack,
  },
});

export default ChangePassword;
