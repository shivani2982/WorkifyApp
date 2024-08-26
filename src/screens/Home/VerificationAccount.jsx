import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  Linking,
  Modal,
  Button,
} from 'react-native';
import {Colors} from '../../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBtn from '../../components/CustomBtn';
import LargeCard from '../../components/LargeCard';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import moment from 'moment';
import {WebView} from 'react-native-webview';

function VerificationAccount({route, navigation}) {
  const {user_data} = route.params;
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const hostname = '192.168.100.34:3000'; 
  const link = `http://${hostname}/public/ev-form/${user_data?.form[0]?.url}?title=${user_data?.form[0]?.title}`;
  const [modalVisible, setModalVisible] = useState(false);

  const handlePress = () => {
    setModalVisible(true);
  };
  const formStatus = user_data?.form[0]?.live ? 'Live' : 'Not Live';

//   console.log('sds', userData?.user?.user_account?.user_id);
//   console.log('sds', user_data?.form[0]?.url);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={[styles.row]}>
          <TouchableOpacity
            style={{marginRight: '20%'}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Verification Account</Text>
        </View>
        <View style={styles.line}></View>
        <ScrollView style={styles.scrollContent}>
          <View>
            <Text style={styles.largeTxt}>
              Note: To verify your account, fill out this form, submit it, and
              wait for admin approval.
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.smallTxt}>
                Created:{' '}
                {moment(user_data?.form[0]?.created_at).format('MMMM DD, YYYY')}
              </Text>
              <Text style={styles.smallTxt}>
                Status:{' '}
                <Text
                  style={
                    formStatus == 'Live' ? {color: 'green'} : {color: 'red'}
                  }>
                  {formStatus}
                </Text>
              </Text>
            </View>
          </View>
          <View style={styles.line}></View>

          <View style={{marginVertical: 10}}>
            {formStatus === 'Live' ? (
              <CustomBtn lbl="Open Form" onPress={handlePress} />
            ) : (
              <CustomBtn
                lbl="Form Link not avialable"
                disabled={true}
                style={{backgroundColor: Colors.primary.lightGray}}
              />
            )}
          </View>

          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            animationType="slide">
            <View style={styles.modalContainer}>
              {/* <Button title="Close" onPress={() => setModalVisible(false)} /> */}
              <WebView source={{uri: link}} style={styles.webview} />
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </>
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
    textAlign: 'justify',
  },
  smallTxt: {
    // marginLeft: 10,
    marginTop: 10,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.primary.lightBlack,
    textAlign: 'right',
  },
  line: {
    marginVertical: 20,
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
  },
  modalContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default VerificationAccount;
