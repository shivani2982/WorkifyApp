import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInputBase,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import profileImg from '../../assets/Images/profileImg.jpg';
import {Colors} from '../../constants/theme';
import RemainingTime from '../RemainingTime';

function SmallCard({
  profile,
  review_comment,
  rating,
  job_skill,
  jobData,
  dispute,
  onPress,
  complain_title,
  complain_msg,
  time,
  isOffer,
  profile_image,
  first_name,
  last_name,
  verifiedStatus,
  proposal_description,
  proposal_duration,
  created_at,
  proposal_payment,
  proposal_revision,
  proposal_status,
  proposal_tasks,
  isReceived,
  onDeclinePress,
  onAcceptPress,
  isOrder,
  order_status,
}) {
  return (
    <>
      {profile ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.primary.sub,
            borderRadius: 12,
            padding: 10,
            marginBottom: 10,
          }}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {profile_image ? (
                <Image source={{uri: profile_image}} style={styles.cardImg} />
              ) : (
                <Image source={profileImg} style={styles.cardImg} />
              )}
              <Text
                style={[styles.smallTxt, {marginLeft: 5, fontWeight: '600'}]}>
                {first_name} {last_name} |
              </Text>
              <Text style={[styles.smallTxt, {marginLeft: 5}]}>
                {job_skill}
              </Text>
            </View>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>{time}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text style={[styles.smallTxt, {width: '100%'}]}>
              {review_comment}
            </Text>
            <View style={[styles.row, {justifyContent: 'flex-end'}]}>
              <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
                {rating}
              </Text>
              <MaterialIcons
                name="star"
                size={20}
                color={Colors.primary.main}
              />
            </View>
          </View>
        </View>
      ) : dispute ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            borderWidth: 1,
            borderColor: Colors.primary.sub,
            borderRadius: 12,
            padding: 10,
            marginBottom: 10,
          }}>
          <View style={styles.row}>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              {complain_title}
            </Text>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>{time}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={[styles.smallTxt, {width: '100%'}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {complain_msg}
            </Text>
          </View>
        </TouchableOpacity>
      ) : isOffer ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            borderWidth: 1,
            borderColor: Colors.primary.sub,
            borderRadius: 12,
            padding: 10,
            marginBottom: 10,
          }}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {profile_image ? (
                <Image source={{uri: profile_image}} style={styles.cardImg} />
              ) : (
                <Image source={profileImg} style={styles.cardImg} />
              )}
              <Text style={[styles.smallTxt, {marginLeft: 5}]}>
                {first_name} {last_name}{' '}
                {verifiedStatus === 'verified' ? (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={14}
                    color={Colors.primary.lightBlack}
                  />
                ) : null}
              </Text>
            </View>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>{time}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={[styles.smallTxt, {width: '100%'}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {proposal_description}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            {proposal_tasks?.map((data, index) => (
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
                    borderRadius: 6,
                    marginRight: 5,
                    backgroundColor: 'black',
                  }}></View>
                <Text style={styles.txt}>{data?.task?.task_description}</Text>
              </View>
            ))}
          </View>
          <View style={styles.line}></View>
          <View style={[styles.row, {marginTop: 0}]}>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              Time: {proposal_duration} days
            </Text>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              Revision: {proposal_revision}
            </Text>
          </View>

          <View style={{alignItems: 'flex-end', marginTop: 10}}>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              Price: ${proposal_payment}
            </Text>
          </View>
          <View style={styles.line}></View>
          {isReceived ? (
            <>
              {proposal_status == 'waiting' ? (
                <View style={[styles.row, {justifyContent: 'space-evenly'}]}>
                  <TouchableOpacity
                    onPress={onDeclinePress}
                    style={[styles.btn, {backgroundColor: Colors.primary.red}]}>
                    <Text style={styles.btntxt}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btn} onPress={onAcceptPress}>
                    <Text style={styles.btntxt}>Accept</Text>
                  </TouchableOpacity>
                </View>
              ) : proposal_status == 'accept' ? (
                <Text
                  style={[
                    styles.smallTxt,
                    {
                      width: '100%',
                      textAlign: 'center',
                      color: Colors.primary.green,
                    },
                  ]}>
                  You accept this proposal.
                </Text>
              ) : (
                <Text
                  style={[
                    styles.smallTxt,
                    {
                      width: '100%',
                      textAlign: 'center',
                      color: Colors.primary.red,
                    },
                  ]}>
                  You decline this proposal.
                </Text>
              )}
            </>
          ) : (
            <View>
              {proposal_status == 'waiting' ? (
                <Text
                  style={[
                    styles.smallTxt,
                    {
                      width: '100%',
                      textAlign: 'center',
                      color: Colors.primary.lightGray,
                    },
                  ]}>
                  Hang tight! Your proposal is being considered by the client.
                </Text>
              ) : proposal_status == 'accept' ? (
                <Text
                  style={[
                    styles.smallTxt,
                    {
                      width: '100%',
                      textAlign: 'center',
                      color: Colors.primary.green,
                    },
                  ]}>
                  Great news! The client has accepted your proposal.
                </Text>
              ) : (
                <Text
                  style={[
                    styles.smallTxt,
                    {
                      width: '100%',
                      textAlign: 'center',
                      color: Colors.primary.red,
                    },
                  ]}>
                  Your proposal was not accepted this time. Keep applying for
                  more projects.
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
      ) : isOrder ? (
        <TouchableOpacity
          onPress={onPress}
          style={{
            borderWidth: 1,
            borderColor: Colors.primary.sub,
            borderRadius: 12,
            padding: 10,
            marginBottom: 10,
          }}>
          <View style={styles.row}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={profile_image ? {uri: profile_image} : {profileImg}}
                style={styles.cardImg}
              />
              <Text style={[styles.smallTxt, {marginLeft: 5}]}>
                {first_name} {last_name}{' '}
                {verifiedStatus === 'verified' ? (
                  <MaterialCommunityIcons
                    name="check-decagram"
                    size={14}
                    color={Colors.primary.lightBlack}
                  />
                ) : null}
              </Text>
            </View>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>{time}</Text>
          </View>
          <View style={{marginTop: 10}}>
            <Text
              style={[styles.smallTxt, {width: '100%'}]}
              numberOfLines={2}
              ellipsizeMode="tail">
              {proposal_description}
            </Text>
          </View>
          <View style={{marginTop: 10}}>
            {proposal_tasks?.map((data, index) => (
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
                    borderRadius: 6,
                    marginRight: 5,
                    backgroundColor: 'black',
                  }}></View>
                <Text style={styles.txt}>{data?.task?.task_description}</Text>
              </View>
            ))}
          </View>
          <View style={styles.line}></View>
          <View style={[styles.row, {marginTop: 0}]}>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              Revision: {proposal_revision}
            </Text>
            <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
              Price: ${proposal_payment}
            </Text>
          </View>
          <View style={{alignItems: 'center', marginTop: 10}}>
            <View
              style={[
                order_status === 'working' ||
                order_status === 'complete request'
                  ? {backgroundColor: Colors.primary.main}
                  : order_status === 'complete'
                  ? {backgroundColor: Colors.primary.green}
                  : order_status === 'order cancel' ||
                    order_status === 'cancel request'
                  ? {backgroundColor: Colors.primary.red}
                  : null,

                {
                  padding: 10,
                  borderRadius: 6,
                  paddingHorizontal: 30,
                },
              ]}>
              <Text
                style={[
                  styles.smallTxt,
                  {fontWeight: '500', textTransform: 'uppercase'},
                  order_status === 'working' ||
                  order_status === 'complete request'
                    ? {color: Colors.primary.lightBlack}
                    : {color: Colors.primary.white},
                ]}>
                {order_status}
              </Text>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={{alignItems: 'center'}}>
            {order_status === 'working' ? (
              <RemainingTime
                createdDate={created_at}
                days={proposal_duration}
              />
            ) : null}
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          <View style={[styles.smallCard]}>
            <View style={styles.row}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={
                    jobData?.profile_image
                      ? {uri: jobData.profile_image}
                      : jobData?.client?.image
                      ? {uri: jobData?.client?.image}
                      : jobData?.freelancer?.image
                      ? {uri: jobData?.freelancer?.image}
                      : {profileImg}
                  }
                  style={styles.cardImg}
                />
                <Text style={[styles.smallTxt, {marginLeft: 5}]}>
                  {jobData?.first_name} {jobData?.last_name}
                  {jobData?.client?.first_name} {jobData?.client?.last_name}
                  {jobData?.freelancer?.first_name}{' '}
                  {jobData?.freelancer?.last_name}{' '}
                </Text>
              </View>
              <MaterialIcons
                name="star"
                size={20}
                color={Colors.primary.main}
              />
            </View>
            <View style={[styles.row, {marginTop: 10}]}>
              <Text style={[styles.smallTxt, {width: '70%'}]}>
                {jobData?.job_description}
              </Text>
              <Text style={[styles.smallTxt, {fontWeight: '600'}]}>
                ${jobData?.payment_amount}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  cardImg: {
    width: 28,
    height: 28,
    borderRadius: 25,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  smallTxt: {
    fontSize: 14,
    color: Colors.primary.darkgray,
    fontWeight: '400',
  },
  smallCard: {
    flex: 0.2,
    // flexDirection: 'column',
    marginTop: 10,
    backgroundColor: Colors.primary.sub,
    padding: 15,
    borderRadius: 12,
    height: 130,
    width: 350,
    marginRight: 20,
  },
  line: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: Colors.primary.lightGray,
  },
  btn: {
    padding: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary.green,
  },
  btntxt: {
    fontSize: 14,
    color: Colors.primary.white,
    fontWeight: '500',
  },
  txt: {
    color: Colors.primary.darkgray,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'justify',
  },
});

export default SmallCard;
