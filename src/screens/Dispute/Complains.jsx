import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  RefreshControl,
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
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import moment from 'moment';
import {showMessage} from 'react-native-flash-message';
import ImageCropPicker from 'react-native-image-crop-picker';
import emptyImg from '../../assets/Images/empty.jpg';
import ImageViewer from 'react-native-image-zoom-viewer';
function Complain({navigation, route}) {
  const {dispute_data} = route.params;
  const [complainRespond, setComplainRespond] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState('');

  const complainData = useQuery({
    queryKey: ['disputeComplains', dispute_data?.dispute_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `disputeComplains?dispute_id=${dispute_data?.dispute_id}`,
      });
      return response.data;
    },
    enabled: dispute_data?.dispute_id ? true : false,
  });

  const complainMutation = useMutation({
    mutationKey: ['complain'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `disputeComplain`,
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
        complainData.refetch();
        setComplainRespond('');
        setImageUri('');
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
    if (complainRespond.length > 0) {
      const data = {
        dispute_id: parseInt(dispute_data?.dispute_id),
        useraccount_id: parseInt(dispute_data?.useraccount_id),
        complain_msg: complainRespond,
        img: imageUri,
      };
      await complainMutation.mutate(data);
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
      return <Image source={{uri: imageUri}} style={styles.selectImgStyle} />;
    } else {
      return <Image source={emptyImg} style={styles.selectImgStyle} />;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row, {marginBottom: 20}]}>
        <TouchableOpacity
          style={{marginRight: '23%'}}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={Colors.primary.lightBlack}
          />
        </TouchableOpacity>
        <Text style={styles.largeTxt}>Complain Details</Text>
      </View>

      {complainData?.data?.dispute_complains &&
      complainData?.data?.dispute_complains.length > 0 ? (
        <FlatList
          data={complainData?.data?.dispute_complains}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={complainData?.data?.isLoading}
          //     onRefresh={() => complainData?.data?.refetch()}
          //   />
          // }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item: data, index}) => (
            <>
              {data?.useraccount_id === dispute_data?.useraccount_id ? (
                <View style={{alignItems: 'flex-end'}}>
                  <View
                    key={index}
                    style={{
                      width: '80%',
                      marginTop: 10,
                      backgroundColor: Colors.primary.lightGray,
                      paddingLeft: 20,
                      paddingRight: 10,
                      paddingTop: 10,
                      borderRadius: 12,
                    }}>
                    <Text style={[styles.smallTxt]}>{data?.complain_msg}</Text>
                    <Text
                      style={[
                        styles.smallTxt,
                        {textAlign: 'right', fontSize: 12, marginBottom: 5},
                      ]}>
                      Send By You
                    </Text>
                  </View>
                  {data?.image === null ? null : (
                    <View
                      style={{
                        // width: '80%',
                        marginTop: 10,
                        backgroundColor: Colors.primary.lightGray,
                        padding: 5,

                        borderRadius: 12,
                      }}>
                      <TouchableOpacity
                        style={{alignItems: 'center'}}
                        onPress={() => {
                          setIsVisible(true);
                          setImgUrl(data?.image);
                        }}>
                        <Image
                          source={{uri: data?.image}}
                          style={styles.sentImgStyle}
                        />
                      </TouchableOpacity>
                      <Modal visible={isVisible} transparent={true}>
                        <ImageViewer
                          imageUrls={[{url: imgUrl}]}
                          onClick={() => setIsVisible(false)}
                        />
                      </Modal>
                    </View>
                  )}
                </View>
              ) : (
                <View style={{alignItems: 'flex-start'}}>
                  <View
                    key={index}
                    style={{
                      width: '80%',
                      marginTop: 10,
                      backgroundColor: Colors.primary.lightGray,
                      paddingLeft: 20,
                      paddingRight: 10,
                      paddingTop: 10,
                      borderRadius: 12,
                    }}>
                    <Text style={[styles.smallTxt]}>{data?.complain_msg}</Text>
                    <Text
                      style={[
                        styles.smallTxt,
                        {textAlign: 'right', fontSize: 12, marginBottom: 5},
                      ]}>
                      Send By Admin
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
          ListHeaderComponent={
            <>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={[styles.smallTxt]}>
                  {complainData?.data?.complain_title}
                </Text>
                <Text style={[styles.smallTxt]}>
                  {moment(complainData?.data?.created_at).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View
                style={{
                  marginTop: 10,
                  padding: 20,
                  borderRadius: 12,
                  borderColor: Colors.primary.darkgray,
                  borderWidth: 2,
                }}>
                <View style={{alignItems: 'center'}}>
                  {complainData?.data?.complain_img ? (
                    <TouchableOpacity
                      onPress={() => {
                        setIsVisible(true);
                        setImgUrl(complainData?.data?.complain_img);
                      }}>
                      <Image
                        source={{uri: complainData?.data?.complain_img}}
                        style={styles.imgStyle}
                      />
                    </TouchableOpacity>
                  ) : (
                    <Image source={emptyImg} style={styles.imgStyle} />
                  )}
                </View>

                <Modal visible={isVisible} transparent={true}>
                  <ImageViewer
                    imageUrls={[{url: imgUrl}]}
                    onClick={() => setIsVisible(false)}
                  />
                </Modal>
                <Text style={[styles.smallTxt, {textAlign: 'left'}]}>
                  {complainData?.data?.complain_msg}
                </Text>
              </View>
            </>
          }
          ListFooterComponent={
            <>
              <View style={{marginBottom: 40}}></View>
            </>
          }
        />
      ) : (
        <View style={{alignItems: 'center', marginTop: 10}}>
          {complainData?.data?.dispute_complains ? (
            <Text style={{color: Colors.primary.lightGray}}>
              We are working on your request!
            </Text>
          ) : (
            <ActivityIndicator size={24} color={Colors.primary.black} />
          )}
        </View>
      )}

      <View style={styles.line}></View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <CustomInput
          placeholder="Write the respond..."
          keyboardType="default"
          multiline={true}
          numberOfLines={3}
          style={{
            backgroundColor: Colors.primary.sub,
            width: 300,
          }}
          value={complainRespond}
          onChangeText={text => {
            setComplainRespond(text);
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={[styles.containerImg]} onPress={chooseImage}>
            {renderImage()}
            <View style={styles.overlay}>
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={Colors.primary.lightBlack}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginTop: 20, marginBottom: 10}}>
        <CustomBtn
          lbl="Send"
          onPress={handleSubmit}
          loading={complainMutation.isPending}
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
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.darkgray,
  },
  line: {
    marginVertical: 20,
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
  },
  sentImgStyle: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },
  imgStyle: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  containerImg: {
    position: 'relative',
    overflow: 'hidden',
  },
  selectImgStyle: {
    width: 60,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Complain;
