import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeNavigation from './HomeNavigation';
import {Colors} from '../constants/theme';
import AddPost from '../screens/AddPost';
import ChatNavigation from './ChatNavigation';
import Order from '../screens/Order';
import Notification from '../screens/Notification';
import OrderNavigation from './OrderNavigation';

const Tab = createBottomTabNavigator();

function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Homes"
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.lightBlack,
        tabBarInactiveTintColor: Colors.primary.darkgray,
      }}>
      <Tab.Screen
        name="Homes"
        component={HomeNavigation}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Message"
        component={ChatNavigation}
        options={{
          headerShown: false,
          tabBarLabel: 'Messages',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={focused ? 'message-text' : 'message-text-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={AddPost}
        options={{
          headerShown: false,
          tabBarLabel: 'Post',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={focused ? 'plus-box' : 'plus-box-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false,
          tabBarLabel: 'Updates',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={focused ? 'bell' : 'bell-outline'}
              color={color}
              size={size}
            />
          ),
          tabBarBadge: 3,
        }}
      />
      <Tab.Screen
        name="OrderNavigation"
        component={OrderNavigation}
        options={{
          headerShown: false,
          tabBarLabel: 'Orders',
          tabBarIcon: ({focused, color, size}) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigation;
