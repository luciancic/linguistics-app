import React, {Fragment, useEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import Permissions from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import {SERVER_HOST} from '../../config';

function SpeakScreen() {
  // After checking, can be one of: 'authorized', 'denied', 'restricted', or 'undetermined'.
  const [permissionMicrophone, setPermissionMicrophone] = useState(null);
  const [permissionStorage, setPermissionStorage] = useState(null);
  const [duration, setDuration] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
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

  useEffect(() => {
    if (duration >= currentPosition && duration !== null) {
      console.log('Duration:', duration);
      console.log('Current position:', currentPosition);
      (async () => {
        await audioRecorderPlayer.stopPlayer();
      })();
    }
  }, [duration, currentPosition, audioRecorderPlayer]);

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
      return;
    });
    console.log(result);
  }

  async function onStopRecord() {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    console.log(result);
  }

  async function onStartPlay() {
    console.log('onStartPlay');
    const msg = await audioRecorderPlayer.startPlayer();
    console.log('Done waiting to start playing', msg);
    audioRecorderPlayer.addPlayBackListener(async function(ev) {
      setDuration(ev.duration);
      setCurrentPosition(ev.current_position);
    });
  }

  async function onPausePlay() {
    try {
      await audioRecorderPlayer.pausePlayer();
    } catch (err) {
      console.warn(`Error happened when pausing player: ${err}`);
    }
  }

  async function onStopPlay() {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    } catch (err) {
      console.warn(`Error happened when stopping player: ${err}`);
    }
  }

  async function onSubmit() {
    const res = await fetch(`${SERVER_HOST}/audio`, {
      method: 'POST',
      body: 'Placeholder for the audio file',
    });
    console.log('Response from post request:', res);
  }

  return (
    <View>
      {permissionMicrophone && permissionStorage ? (
        <Fragment>
          <Button title="Start Recording" onPress={onStartRecord} />
          <Button title="Stop Recording" onPress={onStopRecord} />
          <Button title="Start Playing" onPress={onStartPlay} />
          <Button title="Pause" onPress={onPausePlay} />
          <Button title="Stop" onPress={onStopPlay} />
          <Button title="Send to server" onPress={onSubmit} />
        </Fragment>
      ) : (
        <Text>Checking your permissions. Please wait...</Text>
      )}
    </View>
  );
}

export default SpeakScreen;
