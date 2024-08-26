import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import CustomInput from '../../components/CustomInput';
import image from '../../assets/Images/empty.jpg';
import {Colors} from '../../constants/theme';
import {useQuery} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
const Chat = ({navigation}) => {
  const [searchVal, setSearchVal] = useState('');
  const chatRoomData = useQuery({
    queryKey: ['chatroom'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: 'chatrooms',
      });
      return response.data;
    },
  });
  console.log('gih', chatRoomData.data)
  let filteredChatRooms = chatRoomData.data;
  if (searchVal)
    filteredChatRooms = chatRoomData.data.filter(item => {
      return (
        item.user_account?.first_name
          .toLowerCase()
          .includes(searchVal.toLowerCase()) ||
        item.user_account?.last_name
          .toLowerCase()
          .includes(searchVal.toLowerCase())
      );
    });
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row]}>
        <Text style={styles.largeTxt}>Chat Room</Text>
      </View>
      <CustomInput
        isIcon={true}
        placeholder="Search..."
        keyboardType="default"
        isIconName="magnify"
        style={{
          backgroundColor: Colors.primary.sub,
          padding: 0,
        }}
        containerStyle={{
          backgroundColor: Colors.primary.sub,
          padding: 0,

        }}
        onChangeText={e => setSearchVal(e)}
      />
      <FlatList
        style={styles.flat}
        showsVerticalScrollIndicator={false}
        data={filteredChatRooms}
        refreshControl={
          <RefreshControl
            refreshing={chatRoomData.isFetching}
            onRefresh={() => chatRoomData.refetch()}
          />
        }
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            style={{
              marginTop: 20,
              paddingLeft: 10,
              borderColor: Colors.primary.lightGray,
              borderWidth: 2,
              paddingVertical: 8,
            }}
            onPress={() =>
              navigation.navigate('MessageBox', {
                chatRoomId: item.chatroom_id,
                user: item.user_account.user_id,
                first_name: item.user_account.first_name,
                last_name: item.user_account.last_name,
                image: item?.user_account.image,
                postData: item,
              })
            }>
            <View style={{marginBottom: 2}} key={index}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingLeft: 15,
                }}>
                <View>
                  {/* {item?.unread_count ? (
                    <View style={styles.badge}>
                      <Text style={{color: 'white', textAlign: 'center'}}>
                        {item?.unread_count ? item?.unread_count : 0}
                      </Text>
                    </View>
                  ) : null} */}
                  {item?.user_account.image ? (
                    <Image
                      style={styles.img}
                      source={{uri: item?.user_account.image}}
                    />
                  ) : (
                    <Image style={styles.img} source={image} />
                  )}
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text
                    style={
                      styles.paragraph
                    }>{`${item.user_account?.first_name} ${item.user_account?.last_name}`}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.white,
    paddingHorizontal: 20,
    paddingTop: 10,
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
  paragraph: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary.lightBlack,
    marginLeft: 10,
    // borderTopColor: 'transparent',
    // borderRightColor: 'transparent',
    // borderLeftColor: 'transparent',
  },
  // card: {
  //   outline: 'transparent',
  // },
  flat: {
    backgroundColor: 'white',
    marginLeft: -25,
    marginRight: -25,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  img: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderRadius: 100 / 2,
    borderColor: Colors.primary.darkgray,
  },
  view: {
    // margin: -10,
    border: '2px solid black',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'green',
    position: 'absolute',
    top: -5,
    left: 35,
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    color: 'white',
    zIndex: 1,
  },
});
