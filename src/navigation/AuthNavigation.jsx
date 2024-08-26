import React from 'react';

import Welcome from '../screens/Authentication/Welcome';
import Authentication from '../screens/Authentication';
import Signup from '../screens/Authentication/Signup';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import MoreInfo from '../screens/Authentication/MoreInfo';
import AddSkills from '../screens/Authentication/AddSkills';
function AuthNavigation() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor="#DAE4E1"
        barStyle="dark-content"
      />
      <Stack.Navigator initialRouteName="Authentication">
        <Stack.Screen
          options={{headerShown: false}}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Authentication"
          component={Authentication}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Signup"
          component={Signup}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="MoreInfo"
          component={MoreInfo}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="AddSkills"
          component={AddSkills}
        />
      </Stack.Navigator>
    </>
  );
}

export default AuthNavigation;
