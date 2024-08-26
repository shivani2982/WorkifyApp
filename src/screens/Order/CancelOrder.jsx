import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
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
function CancelOrder({navigation, route}) {
  const {contract} = route.params;
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [messageRequest, setMessageRequest] = useState('');
  const [imageUri, setImageUri] = useState(null);

  console.log('contract', contract?.contract_status);
  const contractData = useQuery({
    queryKey: ['contractCancelData', contract?.contract_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `contract?contract_id=${contract?.contract_id}`,
      });
      return response.data;
    },
    enabled: contract?.contract_id ? true : false,
  });

  const cancelContractMutation = useMutation({
    mutationKey: ['cancelContractReq'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `cancelContractReq`,
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
        contractData.refetch();
        setMessageRequest('');
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
    if (messageRequest.length > 0) {
      const data = {
        contract_id: parseInt(contractData?.data?.contract_id),
        user_id: parseInt(userData?.user?.useraccount_id),
        message: messageRequest,
        img: imageUri,
      };
      await cancelContractMutation.mutate(data);
      // console.log("da", data)
    } else {
      showMessage({
        message: 'Please Fill the Input Field',
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
          style={{marginRight: '18%'}}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={Colors.primary.lightBlack}
          />
        </TouchableOpacity>
        <Text style={styles.largeTxt}>Cancel Order Request</Text>
      </View>

      {contractData?.data?.cancel_contract &&
      contractData?.data?.cancel_contract.length > 0 ? (
        <FlatList
          data={contractData?.data?.cancel_contract}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={complainData?.data?.isLoading}
          //     onRefresh={() => complainData?.data?.refetch()}
          //   />
          // }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item: data, index}) => (
            <>
              {data?.user_id === userData?.user?.useraccount_id ? (
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
                    <Text style={[styles.smallTxt]}>{data?.message}</Text>
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
                      <View style={{alignItems: 'center'}}>
                        <Image
                          source={{uri: data?.image}}
                          style={styles.sentImgStyle}
                        />
                      </View>
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
                    <Text style={[styles.smallTxt]}>{data?.message}</Text>
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
          ListHeaderComponent={<></>}
          ListFooterComponent={
            <>
              <View style={{marginBottom: 40}}></View>
            </>
          }
        />
      ) : (
        <View style={{alignItems: 'center', marginTop: 10}}>
          {contractData?.data?.cancel_contract ? (
            <Text style={{color: Colors.primary.lightGray}}>
              No cancellation requests have been sent.
            </Text>
          ) : (
            <ActivityIndicator size={24} color={Colors.primary.black} />
          )}
        </View>
      )}

      <View style={styles.line}></View>
      {contract?.contract_status === 'order cancel' ? (
        <View style={{ marginBottom: 10}}>
          <CustomBtn
            lbl="Order Cancel"
            disabled={true}
            style={{backgroundColor: Colors.primary.sub}}
          />
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <CustomInput
              placeholder="Write the reason of order cancel."
              keyboardType="default"
              multiline={true}
              numberOfLines={3}
              style={{
                backgroundColor: Colors.primary.sub,
                width: 300,
              }}
              value={messageRequest}
              onChangeText={text => {
                setMessageRequest(text);
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={[styles.containerImg]}
                onPress={chooseImage}>
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
              lbl="Request Send"
              onPress={handleSubmit}
              loading={cancelContractMutation.isPending}
            />
          </View>
        </>
      )}
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

export default CancelOrder;
