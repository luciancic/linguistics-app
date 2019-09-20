import React from 'react';
import {Button, TextInput, StyleSheet, View} from 'react-native';
import globalStyles from './globalStyles';

function ListenScreen() {
  return (
    <View style={globalStyles.container}>
      <View style={localStyles.inputView}>
        <TextInput
          style={localStyles.textInput}
          placeholder="Enter text you would like to hear"
          onChangeText={() => {}}
          onSubmitEditing={() => {}}
        />
      </View>
      <View style={globalStyles.flexView}>
        <Button title="Listen" />
      </View>
    </View>
  );
}
ListenScreen.navigationOptions = {
  title: 'Listen',
};

const localStyles = StyleSheet.create({
  inputView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  textInput: {
    alignSelf: 'stretch',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    margin: 20,
  },
});

export default ListenScreen;
