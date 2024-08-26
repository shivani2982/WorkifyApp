import React, {useEffect, useState} from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

const AddPost = ({navigation}) => {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [imageUri, setImageUri] = useState(null);
  const [userId, setUserId] = useState(null);

  const [isMultiple, setIsMultiple] = useState(false);
  const [inputs, setInputs] = useState(['']);

  const handleSwitchChange = value => {
    setIsMultiple(value);
    if (!value) {
      setInputs(['']);
    }
  };

  const handleAddInput = () => {
    setInputs([...inputs, '']);
  };

  const handleDeleteInput = index => {
    const newInputs = [...inputs];
    newInputs.splice(index, 1);
    setInputs(newInputs);
  };

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

  const addPostMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `job`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
        navigation.goBack();

        setAmount('');
        setDescription('');
        setImageUri(null);
        setIsChecked(false);
        setDuration('');
        setImageUri(null);
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

  const handleAddPost = async () => {
    if (
      description.length > 0 &&
      duration.length > 0 &&
      category.length > 0 &&
      amount.length > 0
    ) {
      const data = {
        user_id: userId,
        postData: {
          job_description: description,
          duration: duration,
          image: imageUri,
          skillcategory_id: parseInt(category),
          payment: amount,
          feature_job: isChecked,
        },
        task_descriptions: inputs,
      };
      // console.log('testing data', data);
      await addPostMutation.mutate(data);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headContainer}>
          <View>
            <Text style={styles.heading}>Post Work</Text>
            <Text style={styles.text}>Fill the fields for posting</Text>
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
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: isMultiple ? '#DAE4E1' : '#1E1E1E',
                padding: 10,
                paddingHorizontal: 20,
                borderRadius: 6,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
              }}
              onPress={() => handleSwitchChange(false)}>
              <Text style={{color: isMultiple ? '#000' : '#fff'}}>Single</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: isMultiple ? '#1E1E1E' : '#DAE4E1',
                padding: 10,
                borderRadius: 6,
                paddingHorizontal: 20,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              onPress={() => handleSwitchChange(true)}>
              <Text style={{color: isMultiple ? '#fff' : '#000'}}>
                Multiple
              </Text>
            </TouchableOpacity>
          </View>

          {isMultiple && (
            <View>
              {inputs.map((input, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <View style={{flex: 1}}>
                    <CustomInput
                      placeholder="Wirte the tasks"
                      keyboardType="default"
                      value={input}
                      onChangeText={text => {
                        const newInputs = [...inputs];
                        newInputs[index] = text;
                        setInputs(newInputs);
                      }}
                    />
                  </View>
                  {index > 0 && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary.white,
                        padding: 10,
                        borderRadius: 6,
                        marginLeft: 10,
                      }}
                      onPress={() => handleDeleteInput(index)}>
                      <MaterialCommunityIcons
                        name="delete"
                        size={24}
                        color={Colors.primary.red}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <CustomBtn
                style={{paddingVertical: 10}}
                lbl={'Add'}
                onPress={handleAddInput}
              />
            </View>
          )}
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Duration</Text>
          <CustomInput
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
          <View style={[styles.inputField, {borderRadius: 12, padding: 0}]}>
            <Picker
              style={[styles.inputField]}
              dropdownIconColor={Colors.primary.darkgray}
              dropdownIconRippleColor={Colors.primary.lightGray}
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}>
              <Picker.Item
                label="Select suitable category for post"
                value=""
                style={{borderRadius: 12}}
              />
              {skillsData.isSuccess &&
                skillsData.data.map(skill => (
                  <Picker.Item
                    key={skill.skill_id}
                    label={skill.skill_name}
                    value={skill.skill_id.toString()} // Ensure the value is a string
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
              backgroundColor: Colors.primary.white,
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
              style={{width: 160}}
              value={amount}
              onChangeText={text => {
                setAmount(text);
              }}
            />
          </View>
        </View>
        <CustomBtn
          lbl={'Post'}
          style={{marginVertical: 80}}
          onPress={handleAddPost}
          loading={addPostMutation.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
  },
  smallTxt: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary.lightBlack,
    marginBottom: 5,
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
export default AddPost;
