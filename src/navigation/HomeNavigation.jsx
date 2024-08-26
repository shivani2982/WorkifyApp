import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'react-native';
import Home from '../screens/Home';
import AccountSetting from '../screens/Home/AccountSetting';
import EditProfile from '../screens/Home/EditProfile';
import ChangePassword from '../screens/Home/ChangePassword';
import TopReviewNav from './TopReviewNav';
import EditPost from '../screens/Home/EditPost';
import FeaturedPost from '../screens/Home/FeaturedPost';
import MessageBox from '../screens/Chat/Message';
import MoreOptions from '../screens/Home/MoreOptions';
import SavedPost from '../screens/Home/SavedPost';
import Dispute from '../screens/Dispute';
import NewDispute from '../screens/Dispute/NewDispute';
import Complain from '../screens/Dispute/Complains';
import VerificationAccount from '../screens/Home/VerificationAccount';
function HomeNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#fff"
        barStyle="dark-content"
      />
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{headerShown: false}}
          name="Home"
          component={Home}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AccountSetting"
          component={AccountSetting}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditProfile"
          component={EditProfile}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="TopReviewNav"
          component={TopReviewNav}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePassword}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MessageBox"
          component={MessageBox}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="EditPost"
          component={EditPost}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="FeaturedPost"
          component={FeaturedPost}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MoreOptions"
          component={MoreOptions}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="SavedPost"
          component={SavedPost}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Dispute"
          component={Dispute}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="NewDispute"
          component={NewDispute}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Complain"
          component={Complain}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="VerificationAccount"
          component={VerificationAccount}
        />
      </Stack.Navigator>
    </>
  );
}

export default HomeNavigation;
