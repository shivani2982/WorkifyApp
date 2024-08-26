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

function Offers({navigation}) {
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [isMultiple, setIsMultiple] = useState(false);
  const handleSwitchChange = value => {
    setIsMultiple(value);
  };   
  const receivedProposalData = useQuery({
    queryKey: ['receivedProposalData', userData?.user?.useraccount_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `receivedProposals?useraccount_id=${userData?.user?.useraccount_id}`,
      });
      return response?.data;
    },
  });
  const proposalData = useQuery({
    queryKey: ['sentProposalData', userData?.user?.useraccount_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `proposalsByUser?useraccount_id=${userData?.user?.useraccount_id}`,
      });
      return response?.data;
    },
  });

  const updateProposalStatusMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'put',
        url: `proposal`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        receivedProposalData.refetch();
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
      } else if (e.response.status === 404) {
        showMessage({
          message: e.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
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

  const handleAcceptProposal = async (proposalId) => {
    const data = {
      proposal_id: parseInt(proposalId),
      proposal_status: 'accept',
    };
    await updateProposalStatusMutation.mutate(data);
    // console.log(data);
  };
  const handleDeclineProposal = async (proposalId) => {
    const data = {
      proposal_id: parseInt(proposalId),
      proposal_status: 'decline',
    };
    await updateProposalStatusMutation.mutate(data);
    // console.log(data);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.line}></View>
      {/* // Freelancer role_id = 1 */}
      {userData?.user?.user_account?.role_id == 1 ? (
        <View>
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isMultiple ? '#DAE4E1' : '#1E1E1E',
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 20,
                  marginRight: 10,
                }}
                onPress={() => handleSwitchChange(false)}>
                <Text
                  style={{
                    color: isMultiple ? '#000' : '#fff',
                    fontWeight: isMultiple ? '400' : '500',
                    fontSize: 16,
                  }}>
                  Sent
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: isMultiple ? '#1E1E1E' : '#DAE4E1',
                  padding: 10,
                  borderRadius: 20,
                  paddingHorizontal: 20,
                }}
                onPress={() => handleSwitchChange(true)}>
                <Text
                  style={{
                    color: isMultiple ? '#fff' : '#000',
                    fontWeight: isMultiple ? '500' : '400',
                    fontSize: 16,
                  }}>
                  Received
                </Text>
              </TouchableOpacity>
            </View>
            {isMultiple ? (
              // RECEIVED Proposal
              <View>
                {receivedProposalData?.data &&
                receivedProposalData?.data.length > 0 ? (
                  <FlatList
                    data={receivedProposalData?.data}
                    refreshControl={
                      <RefreshControl
                        refreshing={receivedProposalData.isLoading}
                        onRefresh={() => receivedProposalData.refetch()}
                      />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item: data, index}) => (
                      <SmallCard
                        profile_image={data?.user_account?.image}
                        first_name={data?.user_account?.first_name}
                        last_name={data?.user_account?.last_name}
                        proposal_description={data?.description}
                        proposal_duration={data?.duration}
                        proposal_revision={data?.revisions}
                        proposal_payment={data?.payment?.payment_amount}
                        proposal_status={data?.proposal_status}
                        proposal_tasks={data?.has_proposal_task}
                        time={moment(data?.updated_at).format('MMMM, DD YYYY')}
                        isReceived={true}
                        key={index}
                        isOffer={true}
                        onAcceptPress={() => handleAcceptProposal(data?.proposal_id)}
                        onDeclinePress={() => handleDeclineProposal(data?.proposal_id)}
                        // onPress={() =>
                        //   navigation.navigate('Complain', {
                        //     dispute_data: data,
                        //   })
                        // }
                      />
                    )}
                  />
                ) : (
                  <View style={{alignItems: 'center', marginTop: 10}}>
                    {receivedProposalData?.data ? (
                      <Text style={{color: Colors.primary.lightGray}}>
                        No Offer Available.
                      </Text>
                    ) : (
                      <ActivityIndicator
                        size={24}
                        color={Colors.primary.black}
                      />
                    )}
                  </View>
                )}
              </View>
            ) : (
              // SENT Proposal
              <View style={{marginBottom: 250}}>
                {proposalData?.data && proposalData?.data.length > 0 ? (
                  <FlatList
                    data={proposalData?.data}
                    refreshControl={
                      <RefreshControl
                        refreshing={proposalData.isLoading}
                        onRefresh={() => proposalData.refetch()}
                      />
                    }
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item: data, index}) => (
                      <SmallCard
                        profile_image={data?.user_account?.image}
                        first_name={data?.user_account?.first_name}
                        last_name={data?.user_account?.last_name}
                        verifiedStatus={data?.user_account?.status}
                        proposal_description={data?.description}
                        proposal_duration={data?.duration}
                        proposal_revision={data?.revisions}
                        proposal_payment={data?.payment?.payment_amount}
                        proposal_status={data?.proposal_status}
                        proposal_tasks={data?.has_proposal_task}
                        time={moment(data?.updated_at).format('MMMM, DD YYYY')}
                        key={index}
                        isOffer={true}
                        // onPress={() =>
                        //   navigation.navigate('Complain', {
                        //     dispute_data: data,
                        //   })
                        // }
                      />
                    )}
                  />
                ) : (
                  <View style={{alignItems: 'center', marginTop: 10}}>
                    {proposalData?.data ? (
                      <Text style={{color: Colors.primary.lightGray}}>
                        No Offer Available.
                      </Text>
                    ) : (
                      <ActivityIndicator
                        size={24}
                        color={Colors.primary.black}
                      />
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      ) : (
        // Client role_id = 2
        <View style={{paddingBottom: 60}}> 
          {receivedProposalData?.data && receivedProposalData?.data.length > 0 ? (
            <FlatList
              data={receivedProposalData?.data}
              refreshControl={
                <RefreshControl
                  refreshing={receivedProposalData.isLoading}
                  onRefresh={() => receivedProposalData.refetch()}
                />
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item: data, index}) => (
                <SmallCard
                  profile_image={data?.user_account?.image}
                  first_name={data?.user_account?.first_name}
                  last_name={data?.user_account?.last_name}
                  proposal_description={data?.description}
                  proposal_duration={data?.duration}
                  proposal_revision={data?.revisions}
                  proposal_payment={data?.payment?.payment_amount}
                  proposal_status={data?.proposal_status}
                  proposal_tasks={data?.has_proposal_task}
                  time={moment(data?.updated_at).format('MMMM, DD YYYY')}
                  isReceived={true}
                  key={index}
                  isOffer={true}
                  onAcceptPress={() => handleAcceptProposal(data?.proposal_id)}
                  onDeclinePress={() => handleDeclineProposal(data?.proposal_id)}
                  
                  // onPress={() =>
                  //   navigation.navigate('Complain', {
                  //     dispute_data: data,
                  //   })
                  // }
                />
              )}
            />
          ) : (
            <View style={{alignItems: 'center', marginTop: 10}}>
              {receivedProposalData?.data ? (
                <Text style={{color: Colors.primary.lightGray}}>
                  No Offer Available.
                </Text>
              ) : (
                <ActivityIndicator size={24} color={Colors.primary.black} />
              )}
            </View>
          )}
        </View>
      )}
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

export default Offers;
