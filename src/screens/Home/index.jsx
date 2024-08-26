import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInputBase,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import profileImg from '../../assets/Images/profileImg.jpg';
import filterIcon from '../../assets/icons/filter.png';
import CustomInput from '../../components/CustomInput';
import {Colors} from '../../constants/theme';
import SmallCard from '../../components/SmallCard';
import LargeCard from '../../components/LargeCard';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';

function Home({navigation}) {
  const [userInfo, setUserInfo] = useState(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        const user = JSON.parse(userString);

        if (user) {
          if (user.freelancer_id) {
            setUserInfo({userType: 'freelancer', id: user.freelancer_id});
          } else if (user.client_id) {
            setUserInfo({userType: 'client', id: user.client_id});
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);
  const featuredData = useQuery({
    queryKey: ['featuredPost'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `featuredJobs?status=true`,
      });
      return response.data;
    },
  });
  const userData = useQuery({
    queryKey: ['jobPost', userInfo?.userType, userInfo?.id],
    queryFn: async () => {
      if (userInfo.userType === 'freelancer') {
        const response = await apiRequest(urlType.BACKEND, {
          method: 'get',
          url: `skillsJobs?freelancer_id=${userInfo?.id}`,
        });
        return response.data;
      } else if (userInfo.userType === 'client') {
        const response = await apiRequest(urlType.BACKEND, {
          method: 'get',
          url: `clientJobs?client_id=${userInfo?.id}`,
        });
        return response.data;
      }
    },
    enabled: userInfo?.id ? true : false,
  });
  userData.refetch();

  const userDetail = useQuery({
    queryKey: ['userDetail', userInfo?.userType, userInfo?.id],
    queryFn: async () => {
      try {
        const response = await apiRequest(urlType.BACKEND, {
          method: 'get',
          url: `user?id=${userInfo?.id}&userType=${userInfo?.userType}`,
        });
        if (response.data) {
          return response.data;
        } else {
          throw new Error('Data not available');
        }
      } catch (error) {
        console.error('Error fetching user detail:', error);
        throw error;
      }
    },
    enabled: userInfo?.id && userInfo?.userType ? true : false,
  });
  userDetail.refetch();

  if (!userInfo) {
    return <ActivityIndicator size={24} color={Colors.primary.darkgray} />;
  }
  if (!userInfo.userType) {
    showMessage({
      message: 'Error: User information not available',
      type: 'danger',
      color: '#fff',
      backgroundColor: 'red',
      floating: true,
    });
    return null;
  }
  if (userData.isError || userDetail.isError) {
    showMessage({
      message: 'Error fetching data',
      type: 'danger',
      color: '#fff',
      backgroundColor: 'red',
      floating: true,
    });
    return null;
  }
  if (userData.isLoading || userDetail.isLoading) {
    return <ActivityIndicator size={24} color={Colors.primary.darkgray} />;
  }
  // console.log("user Info", userInfo)
  // console.log('User data: ', userDetail);
  // console.log(userData.data);
  // console.log(userData.data);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        {/* <TouchableOpacity>
          <MaterialCommunityIcons
            name="menu"
            size={24}
            color={Colors.primary.darkgray}
          />
        </TouchableOpacity> */}
        <Text
          style={{
            color: Colors.primary.darkgray,
            fontStyle: 'italic',
            fontWeight: '500',
            fontSize: 18,
          }}>
          Workify
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AccountSetting', {
              userInfo: userInfo,
              userDetail: userDetail.data,
            });
          }}>
          <Image
            source={{uri: userDetail?.data?.user_account?.image}}
            style={styles.imgStyle}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <View style={{flex: 1}}>
          <CustomInput
            isIcon={true}
            placeholder="Search for a job..."
            isIconName="magnify"
            keyboardType="default"
            style={{
              backgroundColor: Colors.primary.sub,
              padding: 2,
            }}
            containerStyle={{
              padding: 0,
              backgroundColor: Colors.primary.sub,
            }}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.primary.main,
            padding: 10,
            borderRadius: 12,
            marginTop: 20,
            marginLeft: 10,
          }}>
          <Image source={filterIcon} style={styles.iconStyle} />
        </TouchableOpacity>
      </View>
      {userInfo?.userType === 'freelancer' ? (
        <>
          <View style={{marginTop: 10}}>
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
                    key={index}
                    postId={jobData?.job_id}
                    jobData={jobData}
                    handleSendMessage={async () => {
                      await queryClient.removeQueries({queryKey: ['messages']});
                      navigation.navigate('MessageBox', {
                        chatRoomId: null,
                        first_name: jobData?.client?.first_name,
                        last_name: jobData?.client?.last_name,
                        image: jobData?.client?.image,
                        userId2: jobData?.client?.user_id,
                        job_id: jobData?.job_id,
                      });
                    }}
                  />
                )}
                ListHeaderComponent={
                  <>
                    <View style={[styles.row, {marginTop: 20}]}>
                      <Text style={styles.largeTxt}>Featured Posts</Text>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('FeaturedPost')}>
                        <Text style={styles.smallTxt}>View all</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      data={featuredData.data}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item: jobData, index}) => (
                        <SmallCard key={index} jobData={jobData?.job} />
                      )}
                    />
                    <View style={{marginVertical: 20}}>
                      <View style={styles.line}></View>
                    </View>
                  </>
                }
                ListFooterComponent={
                  <>
                    <View style={{marginBottom: 140}}></View>
                  </>
                }
              />
            ) : (
              <View style={{alignItems: 'center', marginTop: 10}}>
                {userData.data ? (
                  <Text style={{color: Colors.primary.lightGray}}>
                    No posts available
                  </Text>
                ) : (
                  <ActivityIndicator size={24} color={Colors.primary.black} />
                )}
              </View>
            )}
            {/* </View> */}
          </View>
        </>
      ) : userInfo?.userType === 'client' ? (
        <>
          <View style={{marginTop: 20}}>
            <View style={{marginTop: 0}}>
              {userData?.data && userData?.data.length > 0 ? (
                <FlatList
                  data={userData?.data}
                  refreshControl={
                    <RefreshControl
                      refreshing={userData.isLoading}
                      onRefresh={() => userData.refetch()}
                    />
                  }
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item: jobData, index}) => (
                    <LargeCard
                      key={index}
                      jobData={jobData}
                      isMyPost={true}
                      postId={jobData?.job_id}
                      handleUpdate={() =>
                        navigation.navigate('EditPost', {
                          job_id: jobData?.job_id,
                        })
                      }
                    />
                  )}
                  ListHeaderComponent={
                    <>
                      <View style={styles.line}></View>
                      <View style={{marginTop: 20}}>
                        <Text style={styles.largeTxt}>Your Posts</Text>
                      </View>
                    </>
                  }
                  ListFooterComponent={
                    <>
                      <View style={{marginBottom: 140}}></View>
                    </>
                  }
                />
              ) : (
                <View style={{alignItems: 'center', marginTop: 10}}>
                  {userData?.data ? (
                    <Text style={{color: Colors.primary.lightGray}}>
                      No posts available
                    </Text>
                  ) : (
                    <ActivityIndicator size={24} color={Colors.primary.black} />
                  )}
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <>
          {showMessage({
            message: 'User type not recognized',
            type: 'danger',
            color: '#fff',
            backgroundColor: 'red',
            floating: true,
          })}
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
    paddingTop: 20,
  },
  imgStyle: {
    width: 34,
    height: 34,
    borderRadius: 25,
  },
  scrollContent: {
    flexGrow: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  iconStyle: {
    width: 26,
    height: 26,
  },
  largeTxt: {
    fontSize: 16,
    color: Colors.primary.lightBlack,
    fontWeight: 'bold',
  },
  smallTxt: {
    fontSize: 14,
    color: Colors.primary.darkgray,
    fontWeight: '400',
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
  },
});
export default Home;
