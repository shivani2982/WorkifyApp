import React from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native'

function Welcome({navigation}) {
  return (
    <SafeAreaView>
      <Text>Hammad</Text>
      <TextInput placeholder='search'/>
      <TouchableOpacity onPress={()=> navigation.navigate('Signup')}><Text>sgdsgha</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

export default Welcome