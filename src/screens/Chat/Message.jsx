import React, {useState, useRef, useEffect} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TextInputBase,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import avatar from '../../assets/Images/profileImg.jpg';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import moment from 'moment';
import {io} from 'socket.io-client';
import {Colors} from '../../constants/theme';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import CustomBtn from '../../components/CustomBtn';
import {BottomSheet} from '../../components/BottomSheet';
import LargeCard from '../../components/LargeCard';
const MessageBox = ({navigation}) => {
  const bottomRef = useRef();
  const route = useRoute();
  const {
    chatRoomId: chatRoomID,
    first_name,
    last_name,
    image,
    user,
    job_id,
    postData,
  } = route.params;
  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };
  const [chatRoomId, setChatRoomId] = useState(chatRoomID);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryData(['user']);
  const usr_id = userData?.user?.useraccount_id;
  const role_id = userData?.user?.user_account?.role_id;
  const [socket, setSocket] = useState(io('http://192.168.100.34:5000/'));
  const [message, setmessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  console.log('sdasd', postData);
  // useEffect(() => {
  //   queryClient.removeQueries({ queryKey: ['messages'] });
  // },[navigation])
  useEffect(() => {
    // Event listener for 'typing' event

    socket.on('connection');
    socket.on('typing', () => {
      setIsTyping(true);
    });

    socket.on('message', data => {
      console.log('sd', data);
      queryClient.setQueryData(['messages', chatRoomId], prevData => {
        // Concatenate the new message with the existing messages data
        setChatRoomId(data.chatroom_id);
        return prevData !== undefined ? [...prevData, data] : [data];
      });
    });

    return () => {
      socket.off('typing', () => {
        console.log('data');
        setIsTyping(false);
      });
      socket.off('connect');
      socket.off('message', data => {
        console.log('ajs', data);
      });
    };
  }, [socket]);
  const userJobs = useQuery({
    queryKey: ['userJobs'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `userJobs?user_id=${parseInt(user)}`,
      });
      return response.data;
    },
  });
  // console.log("sdshi",userJobs.data)
  const messagesData = useQuery({
    queryKey: ['messages', chatRoomId],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `messages?chatroom_id=${chatRoomId}`,
      });
      return response.data;
    },
    enabled: chatRoomId === null ? false : true,
  });
  const emitTypingEvent = () => {
    socket.emit('typing', chatRoomId);
  };
  const sendMessage = () => {
    if (chatRoomId !== null) {
      socket.emit('send-message', {
        user: usr_id,
        chatroom_id: chatRoomId,
        msg_text: message,
      });
    } else {
      socket.emit('join-room_and_send-message', {
        userId1: usr_id,
        userId2: user,
        job_id: job_id,
        msg_text: message,
      });
    }

    setmessage(''); // Clear the input field after sending message
    setIsTyping(false);
  };

  const handleTyping = txt => {
    setmessage(txt);
    if (txt) {
      setIsTyping(true);
      emitTypingEvent();
    } else {
      setIsTyping(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 0,
          backgroundColor: 'white',
          paddingBottom: 10,
          borderLeftColor: Colors.primary.white,
          borderRightColor: Colors.primary.white,
          borderTopColor: Colors.primary.white,
          borderBottomColor: Colors.primary.lightGray,
          borderWidth: 2,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={32}
              color={Colors.primary.lightBlack}
            />
          </TouchableOpacity>

          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              paddingLeft: 10,
              alignContent: 'center',
            }}>
            <View>
              {image ? (
                <Image style={styles.imgAvatar} source={{uri: image}} />
              ) : (
                <Image style={styles.imgAvatar} source={avatar} />
              )}
            </View>
            {/* {result[0]?.receiver_name} */}
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.paragraph}>
                {first_name} {last_name}
              </Text>
            </View>
          </View>
        </View>
        {role_id === 1 ? (
          <CustomBtn
            lbl={'Send Proposal'}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              marginRight: 10,
            }}
            lblStyle={{textTransform: 'none'}}
            // onPress={() => navigation.navigate("SendProposal", {postData})}
            onPress={toggleModal}
          />
        ) : role_id === 2 ? (
          <></>
        ) : null}
      </View>
      <FlatList
        ref={bottomRef}
        // ref={ref => this.flatList = ref}
        onContentSizeChange={async () => {
          await bottomRef.current?.scrollToEnd({animated: true});
        }}
        style={styles.flat}
        showsVerticalScrollIndicator={false}
        data={messagesData.data}
        renderItem={({item, index}) =>
          usr_id === item.useraccount_id ? (
            <View style={styles.receiverrow} key={index}>
              <View style={styles.receiverchat}>
                <View style={styles.receivercol}>
                  <View>
                    <Text style={styles.view1}>
                      {item?.user_account?.first_name} {}
                      {item?.user_account?.last_name}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.view2}>{item?.msg_text}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={styles.view3}>
                    {moment(item?.created_at).format('YY-MM-DD HH:mm a')}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.senderrrow} key={index}>
              <View style={styles.senderchat}>
                <View style={styles.sendercol}>
                  <View>
                    <Text style={styles.sview1}>
                      {item?.user_account?.first_name} {}
                      {item?.user_account?.last_name}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.sview2}>{item?.msg_text}</Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={styles.sview3}>
                    {moment(item?.created_at).format('YY-MM-DD HH:mm a')}
                  </Text>
                </View>
              </View>
            </View>
          )
        }
      />

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <Text style={{color: Colors.primary.darkgray}}>
          {isTyping ? '...typing' : null}
        </Text>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
          marginLeft: 8,
          marginRight: 8,
          borderRadius: 20,
          marginBottom: 8,
          borderColor: Colors.primary.lightGray,
          borderWidth: 2,
        }}>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              padding: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TextInput
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
                width: '88%',
                backgroundColor: Colors.primary.white,
                marginLeft: 10,
                padding: 8,
                color: Colors.primary.black,
                fontSize: 16,
              }}
              placeholder="Message..."
              value={message}
              onChangeText={e => {
                handleTyping(e);
              }}
              placeholderTextColor={Colors.primary.darkgray}
            />
            <TouchableOpacity onPress={sendMessage}>
              <MaterialCommunityIcons
                name={'send-outline'}
                size={30}
                color={Colors.primary.lightBlack}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomSheet isVisible={isVisible} setIsVisible={setIsVisible}>
        {userJobs?.data && userJobs?.data.length > 0 ? (
          <FlatList
            data={userJobs?.data}
            // refreshControl={
            //   <RefreshControl
            //     refreshing={userJobs.isLoading}
            //     onRefresh={() => userJobs.refetch()}
            //   />
            // }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item: jobData, index}) => (
              <LargeCard
                key={index}
                jobData={jobData}
                isProposal={true}
                handleProposal={() => navigation.navigate("SendProposal", {jobData})}
              />
            )}
            ListHeaderComponent={
              <>
                <View style={{marginTop: 20}}>
                  <Text style={styles.largeTxt}>Available Posts</Text>
                </View>
              </>
            }
            ListFooterComponent={
              <>
                <View style={{marginBottom: 100}}></View>
              </>
            }
          />
        ) : (
          <View style={{alignItems: 'center', marginTop: 10}}>
            {userJobs?.data ? (
              <Text style={{color: Colors.primary.lightGray}}>
                No posts available
              </Text>
            ) : (
              <ActivityIndicator size={24} color={Colors.primary.black} />
            )}
          </View>
        )}
      </BottomSheet>
    </SafeAreaView>
  );
};

export default MessageBox;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 15,
    backgroundColor: 'rgb(239 239 239 / 40%)',
  },
  paragraph: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
    marginLeft: 10,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  sendicon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiverrow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
  },
  receivercol: {
    flexDirection: 'column',
    width: '100%',
  },
  receiverchat: {
    justifyContent: 'flex-end',
    width: '50%',
    borderRadius: 6,
    padding: 15,
    marginTop: 8,
    marginBottom: 2,
    marginRight: 5,
    shadowOffset: {width: -2, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: '#dcdcdc',
  },
  view1: {
    fontSize: 16,
    fontWeight: '600',
    color: 'steelblue',
    textTransform: 'capitalize',
  },
  view2: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  view3: {
    fontSize: 12,
    fontWeight: '500',
    color: 'grey',
  },
  senderrow: {
    flexDirection: 'row',
    justifyContent: 'start',
    alignItems: 'center',
    marginTop: 10,
  },
  sendercol: {
    flexDirection: 'column',
    width: '100%',
  },
  senderchat: {
    justifyContent: 'flex-start',
    width: '50%',
    borderRadius: 6,
    padding: 5,
    marginTop: 8,
    marginBottom: 2,
    marginLeft: 5,
    shadowColor: '1px 1px 4px 0px #00000040',
    backgroundColor: '#ffffff',
  },
  sview1: {
    fontSize: 16,
    fontWeight: '600',
    color: 'darkblue',
    // color: "black",

    textTransform: 'capitalize',
  },
  sview2: {
    paddingTop: 5,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: '500',
    color: 'black',
  },
  sview3: {
    fontSize: 12,
    fontWeight: '500',
    color: 'grey',
  },
  img: {
    height: 30,
    width: 30,
    borderWidth: 1,
  },

  imgAvatar: {
    height: 40,
    width: 40,
    borderWidth: 1,
    borderRadius: 100 / 2,
    backgroundColor: '#FA4415',
    borderColor: '#737373',
  },
  largeTxt: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary.lightBlack,
  },
});
