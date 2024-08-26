import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomBtn from '../../components/CustomBtn';
import {Colors} from '../../constants/theme';
import {useQuery, useMutation} from '@tanstack/react-query';
import apiRequest from '../../api/apiRequest';
import urlType from '../../constants/UrlConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import {DropdownMultiselectView} from 'react-native-dropdown-multiselect';
import {useStateValue} from '../../context/GlobalContextProvider';

const AddSkills = ({navigation, route}) => {
  const {user_id} = route.params;
  // const [user_id, setuser_id] = useState(39);
  const [selectedItem, setSelectedItem] = useState([]);
  const [{}, dispatch] = useStateValue();

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const result = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `usersMe`,
      });
      if (result?.status === 200) {
        return result.data.data;
      } else {
        return false;
      }
    },
    enabled: false,
  });

  const skillsData = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'get',
        url: `skills`,
      });
      return response.data;
    },
  });

  const data = skillsData?.data?.map(skill => ({
    key: skill.skill_id,
    value: skill.skill_name,
  }));

  const addSkillsMutation = useMutation({
    mutationFn: async data => {
      const response = await apiRequest(urlType.BACKEND, {
        method: 'post',
        url: `addSkills`,
        data,
      });
      // console.log(response);
      return response;
    },
    onSuccess: async e => {
      if (e.status === 200) {
        if (e !== false) {
          await userQuery.refetch();
          await dispatch({
            type: 'SET_LOGIN',
            isLogin: true,
          });
        }
      } else if (e.response.status === 404) {
        showMessage({
          message: e.response.message,
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      } else {
        showMessage({
          message: e.response.message || 'An Error occured',
          type: 'danger',
          color: '#fff',
          backgroundColor: 'red',
          floating: true,
        });
      }
    },
  });

  const handleAddSkills = async () => {
    const hasSkillsData = selectedItem.map(id => ({skill_id: id}));

    if (user_id > 0 && hasSkillsData.length > 0) {
      const data = {
        user_id: parseInt(user_id),
        has_skills: hasSkillsData,
      };
      await addSkillsMutation.mutate(data);
      console.log(data);
    } else {
      showMessage({
        message: 'Please fill all the fields',
        type: 'danger',
        color: '#fff',
        backgroundColor: 'red',
        floating: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headContainer}>
        <View>
          <Text style={styles.heading}>Select Skills</Text>
          <Text style={styles.text}>Select the available skills</Text>
        </View>
      </View>

      <View style={{borderRadius: 12}}>
        <DropdownMultiselectView
          data={data}
          optionsContainer={{
            backgroundColor: Colors.primary.sub,
            borderRadius: 12,
          }}
          selectContainer={{
            backgroundColor: Colors.primary.darkgray,
            color: '#fff',
            borderRadius: 12,
          }}
          itemContainer={{
            backgroundColor: Colors.primary.darkgray,
            color: 'black',
            borderRadius: 12,
          }}
          displayKey="value"
          displayValue="key"
          selectedItem={selectedItem}
          setSelectedItem={selectedItems => {
            console.log('Selected Items:', selectedItems);
            setSelectedItem(selectedItems);
          }}
        />
      </View>

      <CustomBtn
        lbl={'Add Skills'}
        style={{marginTop: 80}}
        onPress={handleAddSkills}
        loading={addSkillsMutation.isPending}
        // onPress={() => navigation.navigate('BottomNavigation')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.sub,
    padding: 30,
  },
  headContainer: {
    // marginRight: 180,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: '#636363',
  },
  inputField: {
    backgroundColor: '#fff',
    color: '#636363',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  chipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  line: {
    height: 1,
    width: 50,
    backgroundColor: '#636363',
    marginHorizontal: 10,
  },
  gBtn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 50,
    borderRadius: 14,
    backgroundColor: '#fff',
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    marginBottom: 10,
  },
});
export default AddSkills;
