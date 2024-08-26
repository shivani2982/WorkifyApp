import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ProfileReview from '../screens/Home/ProfileReview';
import OtherReview from '../screens/Home/OtherReview';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../constants/theme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialTopTabNavigator();

function TopReviewNav({navigation}) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row, {marginBottom: 20}]}>
        <TouchableOpacity
          style={{marginRight: '25%'}}
          onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="chevron-left"
            size={32}
            color={Colors.primary.lightBlack}
          />
        </TouchableOpacity>
        <Text style={styles.largeTxt}>Profile Review</Text>
      </View>
      <Tab.Navigator
        initialRouteName="ProfileReview"
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
          name="ProfileReview"
          component={ProfileReview}
          options={{
            tabBarLabel: 'Profile Review',
          }}
        />
        <Tab.Screen
          name="OtherReview"
          component={OtherReview}
          options={{tabBarLabel: 'Other Profile'}}
        />
      </Tab.Navigator>
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

export default TopReviewNav;
