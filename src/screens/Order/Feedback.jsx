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
import Icon from 'react-native-vector-icons/FontAwesome';

function Feedback({route, navigation}) {
  const {jobId, jobUserId, proposalUserId} = route.params;
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const reviewMutation = useMutation({
    mutationKey: ['review'],
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `review`,
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
        navigation.navigate('Orders');
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

  const handleSendFeedback = async () => {
    if (comment.length > 0 && rating > 0) {
      // job poster gives the rating to job worker
      if (jobUserId === userData?.user?.useraccount_id) {
        const data = {
          send_review_userId: parseInt(userData?.user?.useraccount_id),
          received_review_userId: parseInt(proposalUserId),
          job_id: parseInt(jobId),
          review_comment: comment,
          rating: rating,
        };
        await reviewMutation.mutate(data);
        // job worker gives the rating to job poster
      } else if (proposalUserId === userData?.user?.useraccount_id) {
        const data = {
          send_review_userId: parseInt(userData?.user?.useraccount_id),
          received_review_userId: parseInt(jobUserId),
          job_id: parseInt(jobId),
          review_comment: comment,
          rating: rating,
        };
        await reviewMutation.mutate(data);
      }
    } else {
      showMessage({
        message: 'Please write comment Or Give rating',
        type: 'danger',
        color: '#fff',
        backgroundColor: Colors.primary.red,
        floating: true,
      });
    }
  };

  const handleRating = newRating => {
    setRating(newRating);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.row}>
          <TouchableOpacity
            style={{marginRight: '25%'}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>
          <Text style={styles.largeTxt}>Send Feedback</Text>
        </View>

        <View style={{marginTop: 20}}>
          <Text style={styles.smallTxt}>Rating</Text>
          <View style={styles.starContainer}>
            {Array.from({length: 5}, (_, index) => {
              const starIndex = index + 1;
              return (
                <TouchableOpacity
                  key={starIndex}
                  onPress={() => handleRating(starIndex)}>
                  <Icon
                    name={starIndex <= rating ? 'star' : 'star-o'}
                    size={32}
                    color="#FFD700"
                    style={styles.star}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.smallTxt}>Comment</Text>
          <CustomInput
            style={{backgroundColor: Colors.primary.sub, marginTop: 5}}
            placeholder="Write the comment here.."
            keyboardType="default"
            value={comment}
            onChangeText={text => {
              setComment(text);
            }}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View>
          <CustomBtn
            lbl={'Send Feedback'}
            style={{marginTop: 20, marginBottom: 60}}
            onPress={handleSendFeedback}
            loading={reviewMutation.isPending}
          />
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

  txt: {
    color: Colors.primary.darkgray,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'justify',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    marginHorizontal: 4,
  },
});

export default Feedback;
