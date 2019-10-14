import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';
import ListenScreen from './src/components/ListenScreen';
import HomeScreen from './src/components/HomeScreen';
import SpeakScreen from './src/components/SpeakScreen';
import CollectionScreen from './src/components/CollectionScreen';

const AppNavigator = createStackNavigator({
  Home: HomeScreen,
  Listen: ListenScreen,
  Speak: SpeakScreen,
  Collection: CollectionScreen,
});

export default createAppContainer(AppNavigator);
