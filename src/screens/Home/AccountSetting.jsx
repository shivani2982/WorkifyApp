import React, {useState} from 'react';
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
} from 'react-native';
import {Colors} from '../../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBtn from '../../components/CustomBtn';
import LargeCard from '../../components/LargeCard';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import CustomModal from '../../components/CustomModal';
import {useStateValue} from '../../context/GlobalContextProvider';

function AccountSetting({route, navigation}) {
  const {userInfo, userDetail} = route.params;
  const [{}, dispatch] = useStateValue();
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const userData = useQuery({
    queryKey: ['freelancerPost'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `freelancerJobs?freelancer_id=${userInfo?.id}`,
      });
      return response.data;
    },
    enabled: userInfo?.id ? true : false,
  });

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    await AsyncStorage.removeItem('@auth_token');
    await AsyncStorage.removeItem('@user');
    dispatch({
      type: 'SET_LOGIN',
      isLogin: false,
    });
    setLogoutModalVisible(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <ScrollView style={styles.scrollContent}> */}
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <TouchableOpacity
            // style={{marginRight: '30%'}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Profile</Text>
          <TouchableOpacity
            // onPress={handleLogout}
            onPress={() => navigation.navigate('MoreOptions')}>
            <MaterialCommunityIcons
              name="menu"
              size={30}
              color={Colors.primary.black}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: 10, marginBottom: 40}}>
          {userData.data && userData.data.length > 0 ? (
            <FlatList
              data={userData.data}
              refreshControl={
                <RefreshControl
                  refreshing={userData.isLoading}
                  onRefresh={() => userData.refetch()}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item: jobData, index}) => (
                <LargeCard
                  userData={userData}
                  key={index}
                  jobData={jobData}
                  isMyPost={true}
                  postId={jobData?.job_id}
                  handleUpdate={() =>
                    navigation.navigate('EditPost', {job_id: jobData?.job_id})
                  }
                />
              )}
              ListHeaderComponent={
                <>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={{uri: userDetail?.user_account?.image}}
                      style={styles.imgStyle}
                    />
                    <Text style={styles.largeTxt}>
                      {userDetail?.user_account?.first_name}{' '}
                      {userDetail?.user_account?.last_name}{' '}
                      {userDetail?.user_account?.status === 'verified' ? (
                        <MaterialCommunityIcons
                          name="check-decagram"
                          size={20}
                          color={Colors.primary.lightBlack}
                        />
                      ) : null}
                    </Text>
                    <View style={[styles.row, {marginVertical: 20}]}>
                      <View style={{alignItems: 'center', marginRight: 35}}>
                        <Text style={styles.smallTxt}>20</Text>
                        <Text style={styles.smallTxt}>Posts</Text>
                      </View>
                      <View style={{alignItems: 'center', marginRight: 35}}>
                        <Text style={styles.smallTxt}>4.2</Text>
                        <Text style={styles.smallTxt}>Rating</Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.smallTxt}>20</Text>
                        <Text style={styles.smallTxt}>Jobs</Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <CustomBtn
                        lbl={'Edit Profile'}
                        lblStyle={{
                          textTransform: 'capitalize',
                        }}
                        style={{
                          marginRight: 20,
                          paddingHorizontal: 30,
                          paddingVertical: 10,
                        }}
                        onPress={() =>
                          navigation.navigate('EditProfile', {
                            userDetail: userDetail,
                            userInfo: userInfo,
                          })
                        }
                      />
                      <CustomBtn
                        lbl={'Profile Review'}
                        lblStyle={{
                          textTransform: 'capitalize',
                        }}
                        style={{paddingHorizontal: 30, paddingVertical: 10}}
                        onPress={() => navigation.navigate('TopReviewNav')}
                      />
                    </View>
                  </View>
                  <View style={styles.line}></View>
                  <Text style={styles.largeTxt}>Your Posts</Text>
                </>
              }
            />
          ) : (
            <View style={{alignItems: 'center', marginTop: 10}}>
              {userData.data ? (
                <>
                  <View
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Image
                      source={{uri: userDetail?.user_account?.image}}
                      style={styles.imgStyle}
                    />
                    <Text style={styles.largeTxt}>
                      {userDetail?.user_account?.first_name}{' '}
                      {userDetail?.user_account?.last_name}
                    </Text>
                    <View style={[styles.row, {marginVertical: 20}]}>
                      <View style={{alignItems: 'center', marginRight: 35}}>
                        <Text style={styles.smallTxt}>20</Text>
                        <Text style={styles.smallTxt}>Posts</Text>
                      </View>
                      <View style={{alignItems: 'center', marginRight: 35}}>
                        <Text style={styles.smallTxt}>4.2</Text>
                        <Text style={styles.smallTxt}>Rating</Text>
                      </View>
                      <View style={{alignItems: 'center'}}>
                        <Text style={styles.smallTxt}>20</Text>
                        <Text style={styles.smallTxt}>Jobs</Text>
                      </View>
                    </View>
                    <View style={styles.row}>
                      <CustomBtn
                        lbl={'Edit Profile'}
                        lblStyle={{
                          textTransform: 'capitalize',
                        }}
                        style={{
                          marginRight: 20,
                          paddingHorizontal: 30,
                          paddingVertical: 10,
                        }}
                        onPress={() =>
                          navigation.navigate('EditProfile', {
                            userDetail: userDetail,
                            userInfo: userInfo,
                          })
                        }
                      />
                      <CustomBtn
                        lbl={'Profile Review'}
                        lblStyle={{
                          textTransform: 'capitalize',
                        }}
                        style={{paddingHorizontal: 30, paddingVertical: 10}}
                        onPress={() => navigation.navigate('TopReviewNav')}
                      />
                    </View>
                  </View>
                  <View style={styles.line}></View>

                  <Text style={{color: Colors.primary.lightGray}}>
                    No posts available
                  </Text>
                </>
              ) : (
                <ActivityIndicator size={24} color={Colors.primary.black} />
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
      <CustomModal
        visible={isLogoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onAction={confirmLogout}
        action="Logout"
        message="Are you sure you want to log out?"
      />
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
});

export default AccountSetting;
