import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import gImg from '../../assets/Images/google-img.png';
import {Picker} from '@react-native-picker/picker';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';
import CustomRadioBtn from '../../components/CustomRadioBtn';
import {Colors} from '../../constants/theme';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [user_name, setUser_name] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');

  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [selectedGender, setSelectedGender] = useState('');

  const handleSelect = option => {
    setSelectedGender(option);
  };

  // console.log(account)

  const signupMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `signup`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        await AsyncStorage.setItem('@user', JSON.stringify(e.data.user));
        await AsyncStorage.setItem('@auth_token', e.data.token);
        navigation.navigate('MoreInfo', {
          accountType: parseInt(account),
          firstName: first_name,
          lastName: last_name,
        });

      } else if (e.response.status === 404) {
        showMessage({
          message: e.response.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
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

  const handleSignup = async () => {
    var emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var passwordFormat =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    // const password = 'SecurePassword123!';
    // const isValid = passwordFormat.test(password);

    // if (isValid) {
    //   console.log('Valid password');
    // } else {
    //   console.log('Invalid password');
    // }
    if (
      email.length > 0 &&
      user_name.length > 0 &&
      first_name.length > 0 &&
      last_name.length > 0 &&
      selectedGender.length > 0 &&
      password.length > 0 &&
      account > 0 &&
      password === confirmPassword
    ) {
      if (email.match(emailFormat)) {
        const data = {
          user_name: user_name,
          email: email,
          password: password,
          first_name: first_name,
          last_name: last_name,
          gender: selectedGender,
          role_id: parseInt(account),
        };
        await signupMutation.mutate(data);
        // console.log(loginMutation.isLoading);
        console.log(data);
      } else {
        showMessage({
          message: 'Invalid Email Format',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    } else if (password !== confirmPassword) {
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
        backgroundColor: 'red',
        floating: true,
      });
    }
  };

  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <View style={styles.headContainer}>
          <View>
            <Text style={styles.heading}>Register Account</Text>
            <Text style={styles.text}>Fill your details or continue</Text>
            <Text style={styles.text}>with google</Text>
          </View>
        </View>
        <CustomInput
          isIcon={true}
          isIconName={'account-outline'}
          placeholder="User Name"
          keyboardType="default"
          value={user_name}
          onChangeText={text => {
            setUser_name(text);
          }}
        />
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CustomInput
            placeholder={'First Name'}
            keyboardType={'default'}
            style={{width: 160}}
            value={first_name}
            onChangeText={text => {
              setFirst_name(text);
            }}
          />
          <CustomInput
            placeholder={'Last Name'}
            keyboardType={'default'}
            style={{width: 160}}
            value={last_name}
            onChangeText={text => {
              setLast_name(text);
            }}
          />
        </View>
        <View style={[styles.inputField, {marginTop: 20}]}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: Colors.primary.darkgray,
            }}>
            Gender
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <CustomRadioBtn
              label="Male"
              onSelect={() => handleSelect('Male')}
              selected={selectedGender === 'Male'}
            />
            <CustomRadioBtn
              label="Female"
              onSelect={() => handleSelect('Female')}
              selected={selectedGender === 'Female'}
            />
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
        <CustomInput
          isIcon={true}
          isIconName={'lock-open-outline'}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={e => {
            setConfirmPassword(e);
          }}
          isPasswordIcon={true}
          placeholder="Confirm Password"
        />

        <View
          style={[
            styles.inputField,
            {borderRadius: 12, marginTop: 20, padding: 0},
          ]}>
          <Picker
            style={[styles.inputField]}
            dropdownIconColor={Colors.primary.darkgray}
            dropdownIconRippleColor={Colors.primary.lightGray}
            selectedValue={account}
            onValueChange={itemValue => setAccount(itemValue)}>
            <Picker.Item
              label="Select account type"
              value=""
              style={{borderRadius: 12}}
            />
            <Picker.Item label="Client" value="2" />
            <Picker.Item label="Freelancer" value="1" />
          </Picker>
        </View>
        <CustomBtn
          lbl={'sign up'}
          style={{marginTop: 80}}
          onPress={handleSignup}
          loading={signupMutation.isPending}
          // onPress={() => navigation.navigate('MoreInfo',{
          //   accountType: account,
          //   firstName: first_name,
          //   lastName: last_name,
          // })}
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
          <Text style={[styles.text, {fontSize: 16}]}>
            Already Have Account?{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Authentication');
            }}>
            <Text style={[styles.text, {fontSize: 16, fontWeight: '600'}]}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.sub,
    padding: 30,
  },
  headContainer: {
    // marginRight: 180,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: '#636363',
  },
  inputField: {
    backgroundColor: '#fff',
    color: '#636363',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
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

  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
});
export default Signup;
