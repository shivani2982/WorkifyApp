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
import {showMessage} from 'react-native-flash-message';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageCropPicker from 'react-native-image-crop-picker';
import img from '../../assets/Images/empty.jpg';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';

function NewDispute({navigation}) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [imageUri, setImageUri] = useState(null);
  const [complain_title, setComplain_title] = useState('');
  const [complain_msg, setComplain_msg] = useState('');
  // console.log('sds', userData?.user?.useraccount_id);

  const disputeMutation = useMutation({
    mutationKey: ['dispute'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `dispute`,
        data,
      });
      // console.log(response);
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
        setComplain_msg('');
        setComplain_title('');
        setImageUri(null);
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

  const handleSubmit = async () => {
    if (complain_title.length > 0 && complain_msg.length > 0) {
      const data = {
        complain_title: complain_title,
        complain_msg: complain_msg,
        complain_img: imageUri,
        useraccount_id: parseInt(userData?.user?.useraccount_id),
      };
      await disputeMutation.mutate(data);
      // console.log(loginMutation.isLoading);
      // console.log(data);
    } else {
      showMessage({
        message: 'Please Fill All Fields',
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
      <View style={[styles.row, {marginBottom: 20}]}>
        <TouchableOpacity
          style={{marginRight: '25%'}}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={Colors.primary.lightBlack}
          />
        </TouchableOpacity>
        <Text style={styles.largeTxt}>New Dispute</Text>
      </View>
      <View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Complain Title</Text>
          <CustomInput
            placeholder="Write complain title"
            keyboardType="default"
            style={{
              backgroundColor: Colors.primary.sub,
            }}
            value={complain_title}
            onChangeText={text => {
              setComplain_title(text);
            }}
          />
        </View>
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Complain Description</Text>
          <CustomInput
            placeholder="Write detail description of your problem..."
            keyboardType="default"
            multiline={true}
            numberOfLines={5}
            style={{
              backgroundColor: Colors.primary.sub,
            }}
            value={complain_msg}
            onChangeText={text => {
              setComplain_msg(text);
            }}
          />
        </View>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={styles.smallTxt}>Image/Screenshot (Optional)</Text>
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
      </View>
      <View style={{marginVertical: 40}}>
        <CustomBtn
          lbl="Submit"
          onPress={handleSubmit}
          loading={disputeMutation.isPending}
        />
      </View>
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
    marginBottom: 5,
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
});

export default NewDispute;
