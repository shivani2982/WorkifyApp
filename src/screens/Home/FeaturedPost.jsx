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
  FlatList,
  RefreshControl,
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

function FeaturedPost({navigation}) {
  const userData = useQuery({
    queryKey: ['featuredPost'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `featuredJobs?status=true`,
      });
      return response.data;
    },
  });
  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={[styles.row]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={[styles.largeTxt, {marginLeft: 90}]}>Featured Post</Text>
        </View>

        <View style={{marginTop: 20, marginBottom: 40}}>
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
                <LargeCard key={index} jobData={jobData?.job} postId={jobData?.job?.job_id} />
              )}
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
        </View>
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
  //   scrollContent: {
  //     flexGrow: 1,
  //   },
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

export default FeaturedPost;
