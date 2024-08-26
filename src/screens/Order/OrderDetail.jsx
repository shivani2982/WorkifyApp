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
import SmallCard from '../../components/SmallCard';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomBtn from '../../components/CustomBtn';
import LargeCard from '../../components/LargeCard';

function OrderDetail({route, navigation}) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [revisionCounter, setRevisionCounter] = useState(1);

  const {contract_id} = route.params;
  const contractData = useQuery({
    queryKey: ['contractData', contract_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `contract?contract_id=${contract_id}`,
      });
      return response.data;
    },
    enabled: contract_id ? true : false,
  });
  console.log('user', contractData?.data?.proposal?.job);
  const feedbackCheckData = useQuery({
    queryKey: ['feedbackCheckData', contractData?.data?.proposal?.job?.job_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `checkReviewByUserIdAndJobId?job_id=${contractData?.data?.proposal?.job?.job_id}`,
      });
      return response.data;
    },
    enabled: contractData?.data?.proposal?.job?.job_id ? true : false,
  });

  const completeStatusMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'put',
        url: `updateCompleteContractStatus`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        contractData.refetch();
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
      } else {
        showMessage({
          message: e.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    },
  });
  const handleCompleteStatus = async e => {
    // if (e.status === 'working') {
    //   setRevisionCounter(revisionCounter + 1);
    // }

    await completeStatusMutation.mutate(e);
  };
  console.log('feedback', feedbackCheckData.data);
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row, {justifyContent: 'space-between'}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={Colors.primary.lightBlack}
          />
        </TouchableOpacity>
        <Text style={[styles.largeTxt]}>Order Details</Text>
        {contractData?.data?.contract_status === 'working' ||
        contractData?.data?.contract_status === 'order cancel' ||
        contractData?.data?.contract_status === 'cancel request' ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CancelOrder', {
                contract: contractData?.data,
              })
            }>
            <MaterialCommunityIcons
              name="clipboard-remove-outline"
              size={32}
              color={Colors.primary.red}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="clipboard-remove-outline"
              size={32}
              color={Colors.primary.white}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{flex: 1, marginTop: 20, marginBottom: 0}}>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={[styles.largeTxt, {fontSize: 18}]}>Job Post</Text>
          <View
            style={[
              contractData?.data?.contract_status === 'working' ||
              contractData?.data?.contract_status === 'complete request'
                ? {backgroundColor: Colors.primary.main, borderRadius: 8}
                : contractData?.data?.contract_status === 'complete'
                ? {backgroundColor: Colors.primary.green, borderRadius: 8}
                : contractData?.data?.contract_status === 'order cancel' ||
                  contractData?.data?.contract_status === 'cancel request'
                ? {backgroundColor: Colors.primary.red, borderRadius: 8}
                : null,
              {padding: 10},
            ]}>
            <Text
              style={[
                {fontSize: 16, fontWeight: '600', textTransform: 'capitalize'},
                contractData?.data?.contract_status === 'working' ||
                contractData?.data?.contract_status === 'complete request'
                  ? {color: Colors.primary.lightBlack}
                  : {color: Colors.primary.white},
              ]}>
              {contractData?.data?.contract_status}
            </Text>
          </View>
        </View>
        <LargeCard jobData={contractData?.data?.proposal?.job} isOrder={true} />
        <Text style={[styles.largeTxt, {fontSize: 18, marginVertical: 10}]}>
          Proposal Details
        </Text>
        <SmallCard
          profile_image={contractData?.data?.proposal?.user_account?.image}
          first_name={contractData?.data?.proposal?.user_account?.first_name}
          last_name={contractData?.data?.proposal?.user_account?.last_name}
          proposal_description={contractData?.data?.proposal?.description}
          proposal_duration={contractData?.data?.proposal?.duration}
          proposal_revision={contractData?.data?.proposal?.revisions}
          proposal_payment={
            contractData?.data?.proposal?.payment?.payment_amount
          }
          proposal_status={contractData?.data?.proposal?.proposal_status}
          proposal_tasks={contractData?.data?.proposal?.has_proposal_task}
          time={moment(contractData?.data?.proposal?.updated_at).format(
            'MMMM, DD YYYY',
          )}
          isOffer={true}
        />
        {contractData?.data?.proposal?.useraccount_id ===
        userData?.user?.useraccount_id ? (
          // Post Worker User
          contractData?.data?.contract_status === 'working' ? (
            <CustomBtn
              lbl={'Work Delivered'}
              style={{marginVertical: 20}}
              onPress={() =>
                handleCompleteStatus({
                  id: contractData?.data?.contract_id,
                  status: 'complete request',
                })
              }
              loading={completeStatusMutation.isPending}
            />
          ) : contractData?.data?.contract_status === 'complete request' ? (
            <CustomBtn
              lbl={'Wait for Approved'}
              style={{marginVertical: 20, backgroundColor: Colors.primary.sub}}
              disabled={true}
            />
          ) : contractData?.data?.contract_status === 'complete' ? (
            feedbackCheckData.data === null ? (
              <CustomBtn
                lbl={'Give Feedback'}
                style={{marginVertical: 20}}
                onPress={() =>
                  navigation.navigate('Feedback', {
                    jobId: contractData?.data?.proposal?.job?.job_id,
                    jobUserId:
                      contractData?.data?.proposal?.job?.freelancer_id === null
                        ? contractData?.data?.proposal?.job?.client?.user_id
                        : contractData?.data?.proposal?.job?.freelancer
                            ?.user_id,
                    proposalUserId:
                      contractData?.data?.proposal?.useraccount_id,
                  })
                }
              />
            ) : (
              <CustomBtn
                lbl={'Feedback ALready Send'}
                style={{
                  marginVertical: 20,
                  backgroundColor: Colors.primary.sub,
                }}
                disabled={true}
              />
            )
          ) : null
        ) : // Post User
        contractData?.data?.contract_status === 'working' ? (
          <CustomBtn
            lbl={'Work in Progress'}
            style={{marginVertical: 20, backgroundColor: Colors.primary.sub}}
            disabled={true}
          />
        ) : contractData?.data?.contract_status === 'complete request' ? (
          <View
            style={{
              marginVertical: 20,
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}>
            {revisionCounter > contractData?.data?.proposal?.revisions ? (
              <CustomBtn
                lbl={'no more revision'}
                style={{
                  backgroundColor: Colors.primary.lightGray,
                  paddingHorizontal: 20,
                }}
                disabled={true}
              />
            ) : (
              <CustomBtn
                lbl={'revised'}
                style={{
                  backgroundColor: Colors.primary.lightGray,
                  paddingHorizontal: 20,
                }}
                onPress={() =>
                  handleCompleteStatus({
                    id: contractData?.data?.contract_id,
                    status: 'working',
                  })
                }
                loading={completeStatusMutation.isPending}
              />
            )}
            <CustomBtn
              lbl={'Completed'}
              style={{
                paddingHorizontal: 20,
              }}
              onPress={() =>
                handleCompleteStatus({
                  id: contractData?.data?.contract_id,
                  status: 'complete',
                })
              }
              loading={completeStatusMutation.isPending}
            />
          </View>
        ) : contractData?.data?.contract_status === 'complete' ? (
          feedbackCheckData.data === null ? (
            <CustomBtn
              lbl={'Give Feedback'}
              style={{marginVertical: 20}}
              onPress={() =>
                navigation.navigate('Feedback', {
                  jobId: contractData?.data?.proposal?.job?.job_id,
                  jobUserId:
                    contractData?.data?.proposal?.job?.freelancer_id === null
                      ? contractData?.data?.proposal?.job?.client?.user_id
                      : contractData?.data?.proposal?.job?.freelancer?.user_id,
                  proposalUserId: contractData?.data?.proposal?.useraccount_id,
                })
              }
            />
          ) : (
            <CustomBtn
              lbl={'Feedback ALready Send'}
              style={{
                marginVertical: 20,
                backgroundColor: Colors.primary.sub,
              }}
              disabled={true}
            />
          )
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
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

export default OrderDetail;
