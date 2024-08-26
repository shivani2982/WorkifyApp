import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomBtn from '../../components/CustomBtn';
import gImg from '../../assets/Images/google-img.png';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {useStateValue} from '../../context/GlobalContextProvider';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

function Authenticaion({navigation}) {
  const [email, setEmail] = useState('');
  const [{}, dispatch] = useStateValue();
  const [fcmState] = useStateValue();
  const [password, setPassword] = useState('');
  // const [fcmToken, setFcmToken] = useState('');

  // useEffect(() => {
  //   requestNotificationPermission();
  // }, []);

  // const requestNotificationPermission = async () => {
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  //   );
  //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     const fcmToken = await messaging().getToken();
  //     setFcmToken(fcmToken);
  //     console.log("Check token", fcmState.isFcmToken)
  //   } else {
  //     console.log('not found');
  //   }
  // };

  const loginMutation = useMutation({
    mutationKey: ['user'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `login`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        await AsyncStorage.setItem('@user', JSON.stringify(e.data.user));
        await AsyncStorage.setItem('@auth_token', e.data.token);
        await dispatch({
          type: 'SET_LOGIN',
          isLogin: true,
        });
      } else {
        showMessage({
          message: e.response.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    },
  });

  const handleLogin = async () => {
    var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (email.length > 0) {
      if (password.length > 0 && email.match(format)) {
        const data = {
          email: email,
          password: password,
          fcmToken: fcmState.isFcmToken
        };
        await loginMutation.mutate(data);
        console.log(loginMutation.isLoading);
        // console.log(data);
      } else {
        showMessage({
          message: 'Invalid Email/Password',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    } else {
      showMessage({
        message: 'Please Enter Email Address',
        type: 'danger',
        color: '#fff',
        backgroundColor: 'red',
        floating: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headContainer}>
        <View>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.text}>Fill your details or continue</Text>
          <Text style={styles.text}>with google</Text>
        </View>
      </View>
      <CustomInput
        isIcon={true}
        isIconName={'email-outline'}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={text => {
          setEmail(text);
        }}
      />
      <CustomInput
        isIcon={true}
        isIconName={'lock-open-outline'}
        secureTextEntry={true}
        value={password}
        onChangeText={e => {
          setPassword(e);
        }}
        isPasswordIcon={true}
        placeholder="Password"
      />
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          marginTop: 5,
        }}>
        <Text style={[styles.text, {fontWeight: '600'}]}>Forget Password</Text>
      </TouchableOpacity>
      <CustomBtn
        lbl="Login"
        style={{marginTop: 80}}
        onPress={handleLogin}
        loading={loginMutation.isPending}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <View style={styles.line}></View>
        <Text style={styles.text}>Or Continue with</Text>
        <View style={styles.line}></View>
      </View>
      <View
        style={{
          flexDirection: 'col',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <TouchableOpacity style={styles.gBtn}>
          <Image source={gImg} style={{width: 35, height: 35}} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text style={[styles.text, {fontSize: 16}]}>New User? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Signup');
          }}>
          <Text
            style={[
              styles.text,
              {fontSize: 16, fontWeight: '600', color: '#000'},
            ]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View>
        <Text style={{color: '#000'}}>User Id: {userData.data?.user_id}</Text>
        <Text style={{color: '#000'}}>
          User Name: {userData.data?.user_name}
        </Text>
        <Text style={{color: '#000'}}>Email: {userData.data?.email}</Text>
        <Text style={{color: '#000'}}>Password: {userData.data?.password}</Text>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DAE4E1',
    padding: 20,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 40,
  },
  heading: {
    color: '#000',
    fontSize: 26,
    fontWeight: '700',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: '#636363',
  },
  line: {
    height: 1,
    width: 50,
    backgroundColor: '#636363',
    marginHorizontal: 10,
  },
  gBtn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 14,
    backgroundColor: '#fff',
  },
});
export default Authenticaion;
