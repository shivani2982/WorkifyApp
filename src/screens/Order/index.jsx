import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
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
import Offers from './Offers';
import Orders from './Orders';
import OrderNavigation from '../../navigation/OrderNavigation';

const Tab = createMaterialTopTabNavigator();

function Order({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row, {marginBottom: 20}]}>
        <Text style={styles.largeTxt}>Orders Details</Text>
      </View>

      <Tab.Navigator
        initialRouteName="Offers"
        screenOptions={{
          tabBarActiveTintColor: Colors.primary.black,
          tabBarInactiveTintColor: Colors.primary.lightGray,
          tabBarLabelStyle: {fontSize: 14, fontWeight: '600'},
          tabBarIndicatorStyle: {backgroundColor: Colors.primary.black},
          tabBarStyle: {
            backgroundColor: Colors.primary.sub,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          },
        }}>
        <Tab.Screen
          name="Offers"
          component={Offers}
          options={{
            tabBarLabel: 'Offers',
          }}
        />
        <Tab.Screen
          name="Orders"
          component={Orders}
          options={{tabBarLabel: 'Orders'}}
        />
      </Tab.Navigator>
      {/* <View style={{marginVertical: 10}}>
        <CustomBtn
          lbl="New Dispute"
          onPress={() => navigation.navigate('NewDispute')}
          // loading={loginMutation.isPending}
        />
      </View> */}
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
});

export default Order;
