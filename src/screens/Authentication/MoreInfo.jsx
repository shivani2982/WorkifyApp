import React, {useState} from 'react';
import {
  FlatList,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import profileImg from '../../assets/Images/profileImg.jpg';
// import ImagePicker from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import {useStateValue} from '../../context/GlobalContextProvider';

const MoreInfo = ({route, navigation}) => {
  const {accountType, firstName, lastName} = route.params;
  const [overview, setOverview] = useState('');
  const [experience, setExperience] = useState('');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [{}, dispatch] = useStateValue();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `usersMe`,
      });
      if (result?.status === 200) {
        return result.data.data;
      } else {
        return false;
      }
    },
    enabled: false,
  });

  const getUserData = async () => {
    try {
      const userString = await AsyncStorage.getItem('@user');
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const countries = [
    {label: 'United States', value: 'US'},
    {label: 'Canada', value: 'CA'},
    {label: 'Pakistan', value: 'PK'},
    {label: 'Germany', value: 'DE'},
    // Add more countries as needed
  ];

  const continueMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `user`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        console.log(e.data);
        await AsyncStorage.setItem('@user', JSON.stringify(e.data));
        if (accountType == 1) {
          navigation.navigate('AddSkills', {user_id: e?.data?.useraccount_id});
        } else if (accountType == 2) {
          if (e !== false) {
            await userQuery.refetch();
            await dispatch({
              type: 'SET_LOGIN',
              isLogin: true,
            });
          }
        }
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

  const handleContinue = async () => {
      const userInfo = await getUserData();
      console.log('Info', userInfo.user_id);
    // Freelancer
    if (parseInt(accountType) == 1) {
      if (
        overview.length > 0 &&
        experience.length > 0 &&
        link.length > 0 &&
        countries.length > 0
      ) {
        const data = {
          user_id: parseInt(userInfo.user_id),
          image: imageUri,
          userData: {
            overview: overview,
            experience: experience,
            links: link,
            location: location,
          },
        };
        await continueMutation.mutate(data);
        // console.log(dasdasd)
        // console.log(loginMutation.isLoading);
        // console.log(data);
      } else {
        showMessage({
          message: 'Please fill all the fields Or upload image',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    }
    // Client
    else if (parseInt(accountType) == 2) {
      if (overview.length > 0 && countries.length > 0) {
        const data = {
          user_id: parseInt(userInfo.user_id),
          image: imageUri,
          userData: {
            overview: overview,
            location: location,
          },
        };
        await continueMutation.mutate(data);
        // console.log(loginMutation.isLoading);
        // console.log(data);
      } else {
        showMessage({
          message: 'Please fill all the fields Or upload image',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    }
  };
  const chooseImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 150,
        height: 150,
        cropping: true,
      });
      setImageUri(image.path);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const renderImage = () => {
    if (imageUri) {
      return <Image source={{uri: imageUri}} style={styles.imgStyle} />;
    } else {
      return (
        <Image
          source={profileImg} // Set the path to your default image
          style={styles.imgStyle}
        />
      );
    }
  };

  // console.log(account)
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        {accountType == 1 ? (
          <>
            <View style={styles.headContainer}>
              <View>
                <Text style={styles.heading}>More Details</Text>
                <Text style={styles.text}>Fill the details for your</Text>
                <Text style={styles.text}>profile as a Freelancer</Text>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.containerImg, {marginRight: 10}]}
                onPress={chooseImage}>
                {renderImage()}
                <View style={styles.overlay}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={32}
                    color={Colors.primary.sub}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.largeTxt}>
                  {firstName} {lastName}
                </Text>
                <Text style={{color: Colors.primary.darkgray, fontSize: 12}}>
                  *Add your profile image
                </Text>
              </View>
            </View>
            <View style={styles.line}></View>

            <CustomInput
              placeholder="Write the overview of your profile"
              keyboardType="default"
              value={overview}
              onChangeText={text => {
                setOverview(text);
              }}
              multiline={true}
              numberOfLines={2}
            />
            <View>
              <CustomInput
                style={{marginVertical: 20}}
                placeholder="Write the experience of your work in detail"
                keyboardType="default"
                value={experience}
                onChangeText={text => {
                  setExperience(text);
                }}
                multiline={true}
                numberOfLines={4}
              />

              <CustomInput
                placeholder="Add any Links"
                keyboardType="default"
                value={link}
                onChangeText={text => {
                  setLink(text);
                }}
                multiline={true}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {borderRadius: 12, marginTop: 20, padding: 0},
              ]}>
              <Picker
                style={[styles.inputField]}
                dropdownIconColor={Colors.primary.darkgray}
                dropdownIconRippleColor={Colors.primary.lightGray}
                selectedValue={location}
                onValueChange={itemValue => setLocation(itemValue)}>
                <Picker.Item
                  label="Select Your Country"
                  value=""
                  style={{borderRadius: 12}}
                />
                {countries.map((country, index) => (
                  <Picker.Item
                    key={index}
                    label={country.label}
                    value={country.value}
                    style={{borderRadius: 12}}
                  />
                ))}
              </Picker>
            </View>
            <CustomBtn
              lbl={'Continue'}
              style={{marginTop: 80, marginBottom: 60}}
              onPress={handleContinue}
              loading={continueMutation.isPending}
              // onPress={() => navigation.navigate('AddSkills')}
            />
          </>
        ) : (
          <>
            <View style={styles.headContainer}>
              <View>
                <Text style={styles.heading}>More Details</Text>
                <Text style={styles.text}>Fill the details for your</Text>
                <Text style={styles.text}>profile as a Client</Text>
              </View>
            </View>
            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.containerImg, {marginRight: 10}]}
                onPress={chooseImage}>
                {renderImage()}
                <View style={styles.overlay}>
                  <MaterialCommunityIcons
                    name="camera"
                    size={32}
                    color={Colors.primary.sub}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.largeTxt}>
                  {firstName} {lastName}
                </Text>
                <Text style={{color: Colors.primary.darkgray, fontSize: 12}}>
                  *Add your profile image
                </Text>
              </View>
            </View>
            <View style={styles.line}></View>

            <CustomInput
              placeholder="Write the overview of your profile"
              keyboardType="default"
              value={overview}
              onChangeText={text => {
                setOverview(text);
              }}
              multiline={true}
              numberOfLines={4}
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
                selectedValue={location}
                onValueChange={itemValue => setLocation(itemValue)}>
                <Picker.Item
                  label="Select Your Country"
                  value=""
                  style={{borderRadius: 12}}
                />
                {countries.map((country, index) => (
                  <Picker.Item
                    key={index}
                    label={country.label}
                    value={country.value}
                    style={{borderRadius: 12}}
                  />
                ))}
              </Picker>
            </View>
            <CustomBtn
              lbl={'Continue'}
              style={{marginTop: 80, marginBottom: 210}}
              onPress={handleContinue}
              loading={continueMutation.isPending}

              // onPress={() => navigation.navigate('AddSkills')}
            />
          </>
        )}
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
  line: {
    marginVertical: 10,
    marginBottom: 20,
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.black,
  },
  imgStyle: {
    width: 82,
    height: 82,
    borderRadius: 55,
    marginTop: 20,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  containerImg: {
    position: 'relative',
    overflow: 'hidden',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject, // Position the overlay absolutely
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 70
  },
});
export default MoreInfo;
