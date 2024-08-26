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
import profileImg from '../../assets/Images/profileImg.jpg';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';
import {Picker} from '@react-native-picker/picker';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import ImageCropPicker from 'react-native-image-crop-picker';
import img from '../../assets/Images/empty.jpg';

function EditProfile({route, navigation}) {
  const {userDetail, userInfo} = route.params;

  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [overview, setOverview] = useState('');
  const [experience, setExperience] = useState('');
  const [link, setLink] = useState('');
  const [location, setLocation] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const userApiDetail = useQuery({
    queryKey: ['userApiDetail', userInfo?.userType, userInfo?.id],
    queryFn: async () => {
      try {
        const response = await apiRequest(urlType.BACKEND, {
          method: 'get',
          url: `user?id=${userInfo?.id}&userType=${userInfo?.userType}`,
        });
        if (response.data) {
          setFirst_name(response?.data?.user_account?.first_name);
          setLast_name(response?.data?.user_account?.last_name);
          setOverview(response?.data?.overview);
          setExperience(response?.data?.experience);
          setLink(response?.data?.links);
          setLocation(response?.data?.location);
          setImageUri(response?.data?.user_account?.image || null);
          return response.data;
        } else {
          throw new Error('Data not available');
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
      }
    },
    enabled: userInfo ? true : false,
  });
  console.log('das', location);

  const updateMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'put',
        url: `user`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        console.log('sada', e.data);
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
          message: e.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      }
    },
  });

  const handleUpdate = async () => {
    // const userInfo = await getUserData();
    // console.log('Info', userInfo.user_id);
    // Freelancer
    if (userInfo?.userType === 'freelancer') {
      if (
        overview.length > 0 &&
        experience.length > 0 &&
        link.length > 0 &&
        countries.length > 0
      ) {
        const data = {
          user_id: parseInt(userApiDetail?.data?.useraccount_id),
          image: imageUri,
          first_name: first_name,
          last_name: last_name,
          userData: {
            overview: overview,
            experience: experience,
            links: link,
            location: location,
          },
        };
        await updateMutation.mutate(data);
        userApiDetail.refetch();
        // console.log(loginMutation.isLoading);
        // console.log(data);
      } else {
        showMessage({
          message: 'Please fill all the fields Or upload image',
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      }
    }
    // Client
    else if (userInfo?.userType === 'client') {
      if (overview.length > 0 && countries.length > 0) {
        const data = {
          user_id: parseInt(userApiDetail?.data?.useraccount_id),
          first_name: first_name,
          last_name: last_name,
          image: imageUri,
          userData: {
            overview: overview,
            location: location,
          },
        };
        await updateMutation.mutate(data);
        userApiDetail.refetch();
        // console.log(loginMutation.isLoading);
        // console.log(data);
      } else {
        showMessage({
          message: 'Please fill all the fields Or upload image',
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      }
    }
  };

  const countries = [
    {label: 'United States', value: 'US'},
    {label: 'Canada', value: 'CA'},
    {label: 'Pakistan', value: 'PK'},
    {label: 'Germany', value: 'DE'},
    // Add more countries as needed
  ];

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      // second: 'numeric',
      // timeZoneName: 'short',
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const chooseImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 250,
        height: 250,
        cropping: true,
        includeBase64: true,
      });
      setImageUri(`data:${image.mime};base64,${image.data}`);
    } catch (error) {
      console.log('ImagePicker Error: ', error);
    }
  };

  const renderImage = () => {
    if (imageUri) {
      return <Image source={{uri: imageUri}} style={styles.imgStyle} />;
    } else {
      return <Image source={img} style={styles.imgStyle} />;
    }
  };
  // console.log('detail', userDetail);
  console.log('APi Detail', userApiDetail?.data);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginRight: '30%'}}
            // onPress={() => navigation.navigate('AccountSetting')}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Edit Profile</Text>
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
          <Text style={styles.largeTxt}>
            {userApiDetail?.data?.user_account?.first_name}{' '}
            {userApiDetail?.data?.user_account?.last_name}
          </Text>
        </View>
        <View style={styles.line}></View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text style={styles.smallTxt}>Created: </Text>
            <Text style={{color: Colors.primary.lightGray}}>
              {formatDate(userApiDetail?.data?.created_at)}
            </Text>
          </View>
          <View>
            <Text style={styles.smallTxt}>Updated: </Text>
            <Text style={{color: Colors.primary.lightGray}}>
              {formatDate(userApiDetail?.data?.updated_at)}
            </Text>
          </View>
        </View>
        <View style={styles.line}></View>

        {userInfo?.userType === 'freelancer' ? (
          <>
            <View
              style={{
                marginTop: 10,
              }}>
              <Text style={styles.smallTxt}>Your Name</Text>

              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <CustomInput
                  placeholder={'First Name'}
                  keyboardType={'default'}
                  style={{backgroundColor: Colors.primary.sub, width: 160}}
                  value={first_name}
                  onChangeText={text => {
                    setFirst_name(text);
                  }}
                />
                <CustomInput
                  placeholder={'Last Name'}
                  keyboardType={'default'}
                  style={{backgroundColor: Colors.primary.sub, width: 160}}
                  value={last_name}
                  onChangeText={text => {
                    setLast_name(text);
                  }}
                />
              </View>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Overview</Text>
              <CustomInput
                style={{backgroundColor: Colors.primary.sub, marginTop: 5}}
                placeholder="Write the overview of your profile"
                keyboardType="default"
                value={overview}
                onChangeText={text => {
                  setOverview(text);
                }}
                multiline={true}
                numberOfLines={2}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Experience</Text>
              <CustomInput
                style={{
                  backgroundColor: Colors.primary.sub,
                  marginTop: 5,
                }}
                placeholder="Write the experience of your work in detail"
                keyboardType="default"
                value={experience}
                onChangeText={text => {
                  setExperience(text);
                }}
                multiline={true}
                numberOfLines={4}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Portfolio Links</Text>
              <CustomInput
                style={{backgroundColor: Colors.primary.sub, marginTop: 5}}
                placeholder="Add any Links"
                keyboardType="default"
                value={link}
                onChangeText={text => {
                  setLink(text);
                }}
                multiline={true}
              />
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Country</Text>
            </View>
            <View
              style={{
                backgroundColor: Colors.primary.sub,
                color: Colors.primary.lightBlack,
                borderRadius: 12,
                marginTop: 5,
                padding: 0,
              }}>
              <Picker
                style={[styles.inputField]}
                dropdownIconColor={Colors.primary.darkgray}
                dropdownIconRippleColor={Colors.primary.lightGray}
                selectedValue={location}
                onValueChange={itemValue => setLocation(itemValue)}>
                <Picker.Item
                  label="Select Your Country"
                  value=""
                  style={{borderRadius: 12, color: Colors.primary.darkgray}}
                />
                {countries.map((country, index) => (
                  <Picker.Item
                    key={index}
                    label={country.label}
                    value={country.value}
                    style={{borderRadius: 12, color: Colors.primary.darkgray}}
                  />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginVertical: 10,
                marginBottom: 40,
              }}>
              {/* <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChangePassword', {
                    userDetail: userDetail,
                  })
                }
                style={[styles.skillContainer, {marginRight: 0}]}>
                <Text
                  style={{color: Colors.primary.lightBlack, marginRight: 20}}>
                  Change Password
                </Text>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.primary.lightBlack}
                />
              </TouchableOpacity> */}
            </View>
            <CustomBtn
              lbl={'Update'}
              style={{marginTop: 20, marginBottom: 60}}
              onPress={handleUpdate}
              loading={updateMutation.isPending}
              // onPress={() => navigation.navigate('AddSkills')}
            />
          </>
        ) : userInfo?.userType === 'client' ? (
          <>
            <View
              style={{
                marginTop: 10,
              }}>
              <Text style={styles.smallTxt}>Your Name</Text>

              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <CustomInput
                  placeholder={'First Name'}
                  keyboardType={'default'}
                  style={{backgroundColor: Colors.primary.sub, width: 160}}
                  value={first_name}
                  onChangeText={text => {
                    setFirst_name(text);
                  }}
                />
                <CustomInput
                  placeholder={'Last Name'}
                  keyboardType={'default'}
                  style={{backgroundColor: Colors.primary.sub, width: 160}}
                  value={last_name}
                  onChangeText={text => {
                    setLast_name(text);
                  }}
                />
              </View>
            </View>
            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Overview</Text>
              <CustomInput
                style={{backgroundColor: Colors.primary.sub, marginTop: 5}}
                placeholder="Write the overview of your profile"
                keyboardType="default"
                value={overview}
                onChangeText={text => {
                  setOverview(text);
                }}
                multiline={true}
                numberOfLines={2}
              />
            </View>

            <View style={{marginTop: 20}}>
              <Text style={styles.smallTxt}>Country</Text>
            </View>
            <View
              style={{
                backgroundColor: Colors.primary.sub,
                color: Colors.primary.lightBlack,
                borderRadius: 12,
                marginTop: 5,
                padding: 0,
              }}>
              <Picker
                style={[styles.inputField]}
                dropdownIconColor={Colors.primary.darkgray}
                dropdownIconRippleColor={Colors.primary.lightGray}
                selectedValue={location}
                onValueChange={itemValue => setLocation(itemValue)}>
                <Picker.Item
                  label="Select Your Country"
                  value=""
                  style={{borderRadius: 12, color: Colors.primary.darkgray}}
                />
                {countries.map((country, index) => (
                  <Picker.Item
                    key={index}
                    label={country.label}
                    value={country.value}
                    style={{borderRadius: 12, color: Colors.primary.darkgray}}
                  />
                ))}
              </Picker>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginVertical: 10,
                marginBottom: 40,
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChangePassword', {
                    userDetail: userDetail,
                  })
                }
                style={[styles.skillContainer, {marginRight: 0}]}>
                <Text
                  style={{color: Colors.primary.lightBlack, marginRight: 20}}>
                  Change Password
                </Text>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={22}
                  color={Colors.primary.lightBlack}
                />
              </TouchableOpacity>
            </View>
            <CustomBtn
              lbl={'Update'}
              style={{marginTop: 20, marginBottom: 60}}
              onPress={handleUpdate}
              loading={updateMutation.isPending}
            />
          </>
        ) : (
          <>
            {showMessage({
              message: 'User type not recognized',
              type: 'danger',
              color: '#fff',
              backgroundColor: Colors.primary.red,
              floating: true,
            })}
          </>
        )}
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
  imgStyle: {
    width: 82,
    height: 82,
    borderRadius: 55,
    marginTop: 20,
    marginBottom: 10,
    resizeMode: 'cover',
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
  line: {
    marginVertical: 20,
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
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
  skillContainer: {
    backgroundColor: Colors.primary.sub,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginRight: 10,
    marginTop: 5,
  },
});

export default EditProfile;
