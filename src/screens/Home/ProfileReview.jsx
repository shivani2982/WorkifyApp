import React from 'react';
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
import SmallCard from '../../components/SmallCard';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import moment from 'moment';

function ProfileReview({navigation}) {
  const profileReviewData = useQuery({
    queryKey: ['profileReview'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `sendReview`,
      });
      return response.data;
    },
  });
  console.log('first', profileReviewData);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.line}></View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={[styles.largeTxt, {fontSize: 26}]}>4.2</Text>
        <Text style={styles.largeTxt}>Rating</Text>
        <Text style={styles.smallTxt}>*Average rating of your profile</Text>
      </View>
      <View style={styles.line}></View>

      <View>
        {profileReviewData.data && profileReviewData.data.length > 0 ? (
          <FlatList
            data={profileReviewData.data}
            refreshControl={
              <RefreshControl
                refreshing={profileReviewData.isLoading}
                onRefresh={() => profileReviewData.refetch()}
              />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => (
              <SmallCard
                profile_image={data?.receivedReview_user?.image}
                first_name={data?.receivedReview_user?.first_name}
                last_name={data?.receivedReview_user?.last_name}
                review_comment={data?.review_comment}
                rating={data?.rating}
                time={moment(data?.created_at).format('MMMM DD, YY')}
                job_skill={data?.job?.skill_category?.skill_name}
                key={index}
                profile={true}
                // onPress={() => navigation.navigate('Complain', {dispute_data: data})}
              />
            )}
          />
        ) : (
          <View style={{alignItems: 'center', marginTop: 10}}>
            {profileReviewData.data ? (
              <Text style={{color: Colors.primary.lightGray}}>
                No Reviews on your profile
              </Text>
            ) : (
              <ActivityIndicator size={24} color={Colors.primary.black} />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.white,
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
    fontSize: 14,
    fontWeight: '400',
    color: Colors.primary.darkgray,
  },
  line: {
    marginVertical: 20,
    height: 2,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
  },
});

export default ProfileReview;
