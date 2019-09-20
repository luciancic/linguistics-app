import React, {Fragment, useEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import Permissions from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

function SpeakScreen() {
  // After checking, can be one of: 'authorized', 'denied', 'restricted', or 'undetermined'.
  const [permissionMicrophone, setPermissionMicrophone] = useState(null);
  const [permissionStorage, setPermissionStorage] = useState(null);
  const audioRecorderPlayer = new AudioRecorderPlayer();

  useEffect(() => {
    Permissions.check('microphone').then(status => {
      setPermissionMicrophone(status);
    });
    Permissions.check('storage').then(status => {
      setPermissionStorage(status);
    });
  }, []);

  useEffect(() => {
    if (permissionMicrophone === 'undetermined') {
      Alert.alert(
        'Microphone Permission',
        'You will be prompted for permission to access your microphone by your system. This is required for us to help with your pronunciation.',
        [
          {
            text: 'Ok',
            onPress: _requestPermissionMicrophone,
          },
        ],
        {cancelable: false},
      );
    }
    if (permissionStorage === 'undetermined') {
      Alert.alert(
        'Storage Permission',
        'You will be prompted for permission to access storage by your system. This is required for the microphone to work and the audio files to be saved.',
        [
          {
            text: 'Ok',
            onPress: _requestPermissionStorage,
          },
        ],
        {cancelable: false},
      );
    }
  }, [permissionMicrophone, permissionStorage]);

  function _requestPermissionMicrophone() {
    Permissions.request('microphone').then(status => {
      setPermissionMicrophone(status);
    });
  }
  function _requestPermissionStorage() {
    Permissions.request('storage').then(status => {
      setPermissionStorage(status);
    });
  }

  async function onStartRecord() {
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener(e => {
      // this.setState({
      //   recordSecs: e.current_position,
      //   recordTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
      // });
      return;
    });
    console.log(result);
  }

  async function onStopRecord() {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    // this.setState({
    //   recordSecs: 0,
    // });
    console.log(result);
  }

  async function onStartPlay() {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log(msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      return;
    });
  }

  async function onPausePlay() {
    await audioRecorderPlayer.pausePlayer();
  }

  async function onStopPlay() {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  }

  return (
    <View>
      {permissionMicrophone && permissionStorage ? (
        <Fragment>
          <Button title="Start Recording" onPress={onStartRecord} />
          <Button title="Stop Recroding" onPress={onStopRecord} />
          <Button title="Start Playing" onPress={onStartPlay} />
          <Button title="Pause" onPress={onPausePlay} />
          <Button title="Stop" onPress={onStopPlay} />
        </Fragment>
      ) : (
        <Text>Checking your permissions. Please wait...</Text>
      )}
    </View>
  );
}

export default SpeakScreen;
