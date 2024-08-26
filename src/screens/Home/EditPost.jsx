import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';
import {Colors} from '../../constants/theme';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import CustomCheckBox from '../../components/CustomCheckBox';
import ImageCropPicker from 'react-native-image-crop-picker';
import img from '../../assets/Images/empty.jpg';

const EditPost = ({route, navigation}) => {
  const {job_id} = route.params;
  console.log(job_id);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState();
  const [isChecked, setIsChecked] = useState();
  const [imageUri, setImageUri] = useState();
  const [userId, setUserId] = useState(null);

  const jobData = useQuery({
    queryKey: ['post'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `job?job_id=${job_id}`,
      });
      if (response.data) {
        setDescription(response?.data?.job_description);
        setDuration(response?.data?.duration);
        setAmount(response?.data?.payment?.payment_amount);
        setCategory(response?.data?.skillcategory_id);
        setIsChecked(Boolean(response?.data?.feature_job?.status));
        setImageUri(response?.data?.image);
        return response.data;
      }
    },
    enabled: job_id ? true : false,
  });
  console.log('dasd', category);
  //   console.log(jobData?.data?.skillcategory_id);
  // jobData.refetch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        const user = JSON.parse(userString);
        setUserId(user.useraccount_id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);
  // console.log(userId)

  const skillsData = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `skills`,
      });
      return response.data;
    },
  });

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const updatePostMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'put',
        url: `job`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        jobData.refetch();
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
      } else if (e.response.status === 404) {
        showMessage({
          message: e.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      } else {
        showMessage({
          message: e.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    },
  });

  const handleUpdatePost = async () => {
    if (
      description.length > 0 &&
      duration.length > 0 &&
      category.length > 0 &&
      amount.length > 0
    ) {
      const data = {
        job_id: job_id,
        payment_id: jobData?.data?.payment_id,
        feature_id: jobData?.data?.feature_id,
        job_description: description,
        duration: duration,
        image: imageUri,
        skillcategory_id: parseInt(category),
        payment: amount,
        feature_job: isChecked,
      };
      await updatePostMutation.mutate(data);
      // console.log(data);
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

  const chooseImage = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        width: 720,
        height: 720,
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginRight: '30%'}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Edit Post</Text>
        </View>
        <View style={styles.headContainer}>
          <View style={{width: '100%'}}>
            <Text style={styles.smallTxt}>
              *Edit the fields for update your post
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.text}>Created:</Text>
                <Text style={styles.text}>
                  {formatDate(jobData?.data?.created_at)}
                </Text>
              </View>
              <View>
                <Text style={styles.text}>Updated: </Text>
                <Text style={styles.text}>
                  {formatDate(jobData?.data?.updated_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.line}></View>
        <Text style={styles.smallTxt}>Post Image</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: Colors.primary.lightBlack,
            borderRadius: 6,
          }}>
          <TouchableOpacity style={[styles.containerImg]} onPress={chooseImage}>
            {renderImage()}
            <View style={styles.overlay}>
              <MaterialCommunityIcons
                name="camera"
                size={32}
                color={Colors.primary.lightBlack}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Post Description</Text>
          <CustomInput
            style={{backgroundColor: Colors.primary.sub}}
            placeholder="Add the detail description for the work..."
            keyboardType="default"
            multiline={true}
            numberOfLines={4}
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Duration</Text>
          <CustomInput
            style={{backgroundColor: Colors.primary.sub}}
            placeholder="Duration for work... like 4th-5th weeks"
            keyboardType="default"
            value={duration}
            onChangeText={text => {
              setDuration(text);
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Available Category</Text>
          <View
            style={[
              styles.inputField,
              {
                borderRadius: 12,
                padding: 0,
                backgroundColor: Colors.primary.sub,
              },
            ]}>
            <Picker
              style={[styles.inputField]}
              dropdownIconColor={Colors.primary.darkgray}
              dropdownIconRippleColor={Colors.primary.lightGray}
              selectedValue={6}
              onValueChange={itemValue => setCategory(itemValue)}>
              <Picker.Item
                label="Select suitable category for post"
                value=""
                style={{borderRadius: 12}}
              />
              {skillsData.isSuccess &&
                skillsData.data.map((skill, index) => (
                  <Picker.Item
                    key={index}
                    label={skill?.skill_name}
                    value={skill?.skill_id.toString()} // Ensure the value is a string
                  />
                ))}
            </Picker>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: Colors.primary.sub,
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 12,
            }}>
            <CustomCheckBox
              label="Feature Post"
              onChange={handleCheckboxChange}
              isChecked={isChecked}
            />
          </View>
          <View>
            <Text style={styles.smallTxt}>Amount</Text>
            <CustomInput
              placeholder={'$ Price'}
              keyboardType={'numeric'}
              style={{width: 160, backgroundColor: Colors.primary.sub}}
              value={amount}
              onChangeText={text => {
                setAmount(text);
              }}
            />
          </View>
        </View>
        <CustomBtn
          lbl={'Update'}
          style={{marginVertical: 80}}
          onPress={handleUpdatePost}
          loading={updatePostMutation.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

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
  containerImg: {
    position: 'relative',
    overflow: 'hidden',
  },
  imgStyle: {
    width: 120,
    height: 120,
    marginVertical: 10,
    resizeMode: 'cover',
    borderRadius: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
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
  smallTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.lightBlack,
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.primary.darkgray,
  },
  inputField: {
    backgroundColor: Colors.primary.sub,
    color: Colors.primary.darkgray,
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightBlack,
    marginBottom: 20,
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
export default EditPost;
