import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import globalStyles from './globalStyles';
import PropTypes from 'prop-types';

function HomeScreen(props) {
  const {navigation} = props;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.flexView}>
        <Text style={localStyles.title}>Linguistics App!</Text>
      </View>
      <View style={globalStyles.flexView}>
        <Button title="Listen" onPress={() => navigation.navigate('Listen')} />
      </View>
      <View style={globalStyles.flexView}>
        <Button title="Speak" onPress={() => navigation.navigate('Speak')} />
      </View>
      <View style={globalStyles.flexView}>
        <Button
          title="Collection"
          onPress={() => navigation.navigate('Collection')}
        />
      </View>
    </View>
  );
}
HomeScreen.navigationOptions = {
  headerStyle: {display: 'none'},
};
HomeScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const localStyles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 24,
  },
});

export default HomeScreen;
