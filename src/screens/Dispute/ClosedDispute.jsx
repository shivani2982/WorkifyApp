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
import SmallCard from '../../components/SmallCard';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import moment from 'moment';

function ClosedDispute({navigation}) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const disputesData = useQuery({
    queryKey: ['closeddisputes'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `closedDisputes?useraccount_id=${userData?.user?.useraccount_id}`,
      });
      return response.data;
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.line}></View>

      <View>
        {disputesData.data && disputesData.data.length > 0 ? (
          <FlatList
            data={disputesData.data}
            refreshControl={
              <RefreshControl
                refreshing={disputesData.isLoading}
                onRefresh={() => disputesData.refetch()}
              />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: data, index}) => (
              <SmallCard
                complain_title={data?.complain_title}
                complain_msg={data?.complain_msg}
                time={moment(data?.created_at).format('DD-MM-YYYY')}
                key={index}
                dispute={true}
              />
            )}
          />
        ) : (
          <View style={{alignItems: 'center', marginTop: 10}}>
            {disputesData.data ? (
              <Text style={{color: Colors.primary.lightGray}}>
                No Closed Dispute available
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

export default ClosedDispute;
