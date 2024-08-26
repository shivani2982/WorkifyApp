import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AuthNavigation from './navigation/AuthNavigation';
import BottomNavigation from './navigation/BottomNavigation';
import FlashMessage from 'react-native-flash-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useQuery} from '@tanstack/react-query';
import {useStateValue} from './context/GlobalContextProvider';
import urlType from './constants/UrlConstants';
import {navigationRef} from './api/RootNavigation';
import apiRequest from './api/apiRequest';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import notifee, {AuthorizationStatus, AndroidImportance} from '@notifee/react-native';

const Stack = createNativeStackNavigator();

function Main() {
  // const [loading, setLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [{isLogin}, dispatch] = useStateValue();
  const [{}, dispatchToken] = useStateValue();
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `usersMe`,
      });
      console.log(result.data);
      return result.data;
    },
    enabled: false,
  });

  useEffect(() => {
    requestNotificationPermission();
    requestUserPermission();
    createNotificationChannel();
    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
      });
    });

    return unsubscribe;
  }, []);

  // Function to create notification channel on Android
  async function createNotificationChannel() {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  const requestNotificationPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      console.log('found');
      dispatchToken({type: 'SET_FCMTOKEN', isFcmToken: fcmToken});
    } else {
      console.log('not found');
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }

    const settings = await notifee.requestPermission();

    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      console.log('Permission settings:', settings);
    } else {
      console.log('User declined permissions');
    }
  };

  useEffect(() => {
    checkUser();
  }, [isLogin]);

  const checkUser = async () => {
    setLoading(true);
    const userToken = await AsyncStorage.getItem('@auth_token');

    if (userToken) {
      dispatch({
        type: 'SET_LOGIN',
        isLogin: true,
      });
      await userQuery.refetch();
      setLoading(false);
    } else {
      dispatch({
        type: 'SET_LOGIN',
        isLogin: false,
      });
      setLoading(false);
    }
  };

  // const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   checkUser();
  // }, []);

  // const checkUser = async () => {
  //   try {
  //     const userToken = await AsyncStorage.getItem('@auth_token');

  //     if (userToken) {
  //       setIsAuthenticated(true);
  //     }

  //     setLoading(false);
  //   } catch (error) {
  //     console.error('Error checking user:', error);
  //     setLoading(false);
  //   }
  // };

  // if (loading) {
  //   return <ActivityIndicator size="large" />;
  // }

  return (
    <View style={{flex: 1}}>
      <NavigationContainer ref={navigationRef}>
        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} size={32} />
          </View>
        ) : (
          <Stack.Navigator>
            {isLogin === true ? (
              <Stack.Screen
                options={{headerShown: false}}
                name="BottomNavigation"
                component={BottomNavigation}
              />
            ) : (
              <Stack.Screen
                options={{headerShown: false}}
                name="AuthNavigation"
                component={AuthNavigation}
              />
            )}
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <FlashMessage position="top" duration={5000} hideOnPress={true} />
    </View>
  );
}

export default Main;
