import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import profileImg from '../../assets/Images/profileImg.jpg';
import CustomBtn from '../../components/CustomBtn';
import CustomInput from '../../components/CustomInput';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import CustomCheckBox from '../../components/CustomCheckBox';
import moment from 'moment';

function SendProposal({route, navigation}) {
  const {jobData} = route.params;
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [payment, setPayment] = useState('');
  const [revisions, setRevisions] = useState('');
  const [taskChecker, setTaskChecker] = useState(false);

  const handleCheckboxChange = taskId => {
    setCheckedTasks(prevCheckedTasks => ({
      ...prevCheckedTasks,
      [taskId]: !prevCheckedTasks[taskId],
    }));
  };
  console.log('job Data', jobData.job_id);

  useEffect(() => {
    const checkedTaskIds = Object.keys(checkedTasks)
      .filter(taskId => checkedTasks[taskId])
      .map(taskId => parseInt(taskId, 10));
    setSelectedTasks(checkedTaskIds);
    console.log('Checked task IDs:', checkedTaskIds);
  }, [checkedTasks]);

  useEffect(() => {
    if (jobData?.task?.length !== 0) {
      const allNone = jobData?.task?.every(task => task.status !== 'none');
      console.log('first', allNone);
      setTaskChecker(allNone);
    }
  }, [jobData]);

  const {data: jobProposalData} = useQuery({
    queryKey: ['jobProposalData', jobData.job_id],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `proposalsByJob?job_id=${parseInt(jobData.job_id)}`,
      });

      const proposalData = response.data;
      const proposals = response.data.data.proposal;
      let derivedStatus = '';

      if (proposals) {
        let hasAcceptedProposal = false;
        let hasSentProposal = false;

        proposals.forEach(proposal => {
          if (proposal.has_proposal_task.length === 0) {
            if (proposal.proposal_status === 'accept') {
              hasAcceptedProposal = true;
            } else if (
              proposal.useraccount_id === userData?.user?.useraccount_id
            ) {
              if (proposal.proposal_status === 'waiting') {
                hasSentProposal = true;
              }
            }
          }
        });

        if (hasAcceptedProposal) {
          derivedStatus = 'accept';
        } else if (hasSentProposal) {
          derivedStatus = 'already sent';
        } else {
          derivedStatus = 'not found';
        }
      }

      return {proposalData, derivedStatus};
    },
  });

  // console.log('props', proposalStatus);
  console.log('propsal Data', jobProposalData);
  console.log('propsal Data', jobProposalData?.proposalData?.data?.proposal);
  const proposalMutation = useMutation({
    mutationKey: ['proposal'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `proposals`,
        data,
      });
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        console.log('sada', e.data);
        showMessage({
          message: e.message,
          type: 'success',
          color: '#fff',
          backgroundColor: Colors.primary.green,
          floating: true,
        });
        navigation.navigate('Chat');
      } else if (e.status === 404) {
        showMessage({
          message: e.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      } else {
        showMessage({
          message: e.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: Colors.primary.red,
          floating: true,
        });
      }
    },
  });

  const handleSendProposal = async () => {
    if (
      description.length > 0 &&
      revisions.length > 0 &&
      payment.length > 0 &&
      duration.length > 0
    ) {
      const data = {
        useraccount_id: parseInt(userData?.user?.useraccount_id),
        jobUser_id: parseInt(jobData?.user_id),
        job_id: parseInt(jobData?.job_id),
        description: description,
        revisions: parseInt(revisions),
        duration: parseInt(duration),
        payment: parseInt(payment),
        selectedTasks: selectedTasks,
      };
      await proposalMutation.mutate(data);
      console.log(data);
    } else {
      showMessage({
        message: 'Please fill all the fields Or upload image',
        type: 'danger',
        color: '#fff',
        backgroundColor: Colors.primary.red,
        floating: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginRight: '25%'}}
            onPress={() => navigation.navigate('Chat')}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Send Proposal</Text>
        </View>
        <View style={styles.postBox}>
          <View style={[styles.row, {justifyContent: 'space-between'}]}>
            <View style={[styles.row, {justifyContent: 'flex-start'}]}>
              <Image
                source={
                  jobData?.profile_image
                    ? {uri: jobData?.profile_image}
                    : {profileImg}
                }
                style={styles.cardImg}
              />

              <View style={{marginLeft: 10}}>
                <Text
                  style={[
                    styles.txt,
                    {
                      fontSize: 14,
                      fontWeight: '600',
                      color: Colors.primary.lightBlack,
                    },
                  ]}>
                  {jobData?.first_name} {jobData?.last_name}
                </Text>
                <Text style={[styles.txt]}>
                  {moment(jobData?.updated_at).format('MMMM DD, YYYY')} |{' '}
                  <>{jobData?.skill_name}</>{' '}
                </Text>
              </View>
            </View>
            {jobData?.feature_job ? (
              <MaterialIcons name="star" size={24} color={Colors.primary.red} />
            ) : null}
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View>
              <Text style={styles.txt}>{jobData?.job_description}</Text>
            </View>
            <View>
              {jobData?.image ? (
                <Image
                  source={{uri: jobData?.image}}
                  style={{width: 100, height: 100, resizeMode: 'contain'}}
                />
              ) : null}
            </View>
          </View>
          <View style={{marginTop: 10}}>
            {jobData?.task?.map((task, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <View
                  style={{
                    padding: 6,
                    borderRadius: 3,
                    marginRight: 5,
                    backgroundColor:
                      task.status === 'progress'
                        ? 'yellow'
                        : task.status === 'complete'
                        ? 'green'
                        : 'black',
                  }}></View>
                <Text style={styles.txt}>{task.task_description}</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View style={[styles.row, {justifyContent: 'flex-start'}]}>
              <Text style={styles.txt}>Payment: </Text>
              <Text
                style={[
                  styles.txt,
                  {color: Colors.primary.lightBlack, fontWeight: '600'},
                ]}>
                ${jobData?.payment_amount}
              </Text>
            </View>
            <View style={[styles.row, {justifyContent: 'flex-start'}]}>
              <Text style={styles.txt}>Duration: </Text>
              <Text
                style={[
                  styles.txt,
                  {color: Colors.primary.lightBlack, fontWeight: '600'},
                ]}>
                {jobData?.duration}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.row, {justifyContent: 'space-between'}]}>
          <Text style={styles.txt}>
            Declined Proposals:{' '}
            {jobProposalData?.proposalData?.countDeclineProposal}{' '}
          </Text>
          <Text style={styles.txt}>
            Send Proposals: {jobProposalData?.proposalData?.countSendProposal}
          </Text>
        </View>
        {jobData?.task.length > 0 ? (
          <View style={{marginTop: 10}}>
            <Text style={[styles.smallTxt, {marginBottom: 5}]}>
              Available Task
            </Text>
            {jobData?.task?.map((task, index) => (
              <View key={index}>
                {task?.status === 'none' ? (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 10,
                    }}>
                    <CustomCheckBox
                      label={task.task_description}
                      simpleCheckBox={true}
                      isChecked={checkedTasks[task.task_id] || false}
                      onChange={() => handleCheckboxChange(task.task_id)}
                    />
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Proposal Description</Text>
          <CustomInput
            style={{backgroundColor: Colors.primary.sub, marginTop: 5}}
            placeholder="Write the proposal desription"
            keyboardType="default"
            value={description}
            onChangeText={text => {
              setDescription(text);
            }}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View>
          <View
            style={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <Text style={styles.smallTxt}>Duration</Text>
              <CustomInput
                placeholder={'Time Peroid in days'}
                keyboardType={'numeric'}
                style={{backgroundColor: Colors.primary.sub, width: 160}}
                value={duration}
                onChangeText={text => {
                  setDuration(text);
                }}
              />
            </View>
            <View>
              <Text style={styles.smallTxt}>Amount</Text>

              <CustomInput
                placeholder={'Price'}
                keyboardType={'numeric'}
                style={{backgroundColor: Colors.primary.sub, width: 160}}
                value={payment}
                onChangeText={text => {
                  setPayment(text);
                }}
              />
            </View>
          </View>

          <View>
            <Text style={[styles.smallTxt, {marginTop: 10}]}>Revisions</Text>
            <CustomInput
              placeholder={'Optional'}
              keyboardType={'numeric'}
              style={{backgroundColor: Colors.primary.sub, width: 160}}
              value={revisions}
              onChangeText={text => {
                setRevisions(text);
              }}
            />
          </View>
          {jobProposalData?.derivedStatus === 'already sent' ? (
            <CustomBtn
              lbl={'You’ve Already Submitted a Proposal'}
              style={{
                marginTop: 20,
                marginBottom: 60,
                backgroundColor: Colors.primary.lightGray,
              }}
              disabled={true}
            />
          ) : jobProposalData?.derivedStatus === 'accept' ? (
            <CustomBtn
              lbl={'Job No Longer Available'}
              style={{
                marginTop: 20,
                marginBottom: 60,
                backgroundColor: Colors.primary.lightGray,
              }}
              disabled={true}
            />
          ) : taskChecker ? (
            <CustomBtn
              lbl={'Job No Longer Available'}
              style={{
                marginTop: 20,
                marginBottom: 60,
                backgroundColor: Colors.primary.lightGray,
              }}
              disabled={true}
            />
          ) : (
            <CustomBtn
              lbl={'Send Proposal'}
              style={{marginTop: 20, marginBottom: 60}}
              onPress={handleSendProposal}
              loading={proposalMutation.isPending}
            />
          )}
        </View>
      </ScrollView>
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
  imgStyle: {
    width: 82,
    height: 82,
    borderRadius: 55,
    marginTop: 20,
    marginBottom: 10,
    resizeMode: 'cover',
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

  skillContainer: {
    backgroundColor: Colors.primary.sub,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 12,
    marginRight: 10,
    marginTop: 5,
  },
  postBox: {
    marginVertical: 20,
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    borderColor: Colors.primary.darkgray,
  },
  cardImg: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  txt: {
    color: Colors.primary.darkgray,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'justify',
  },
});

export default SendProposal;
