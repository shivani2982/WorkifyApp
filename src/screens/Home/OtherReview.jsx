import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import {Colors} from '../../constants/theme';
import SmallCard from '../../components/SmallCard';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import moment from 'moment';

function OtherReview() {
  const otherReviewData = useQuery({
    queryKey: ['otherReview'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `recivedReview`,
      });
      return response.data;
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.line}></View>
      <Text style={{color: Colors.primary.darkgray, marginBottom: 10}}>
        *Reviews given by you.{' '}
      </Text>
      <View>
        {otherReviewData.data && otherReviewData.data.length > 0 ? (
          <FlatList
            data={otherReviewData.data}
            refreshControl={
              <RefreshControl
                refreshing={otherReviewData.isLoading}
                onRefresh={() => otherReviewData.refetch()}
              />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => (
              <SmallCard
                profile_image={data?.sendReview_user?.image}
                first_name={data?.sendReview_user?.first_name}
                last_name={data?.sendReview_user?.last_name}
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
            {otherReviewData.data ? (
              <Text style={{color: Colors.primary.lightGray}}>
                No Reviews on other profiles by you.
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

export default OtherReview;
