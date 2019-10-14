import React, {Fragment, useEffect, useState} from 'react';
import {Alert, Button, Text, View} from 'react-native';
import Permissions from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';
import {SERVER_HOST} from '../../config';

function SpeakScreen() {
  // After checking, can be one of: 'authorized', 'denied', 'restricted', or 'undetermined'.
  const [permissionMicrophone, setPermissionMicrophone] = useState(null);
  const [permissionStorage, setPermissionStorage] = useState(null);
  const [soundFileExists, setSoundFileExists] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [audioRecorderPlayer, setAudioRecorderPlayer] = useState({});

  useEffect(() => {
    Permissions.check('microphone').then(status => {
      setPermissionMicrophone(status);
    });
    Permissions.check('storage').then(status => {
      setPermissionStorage(status);
    });
  }, []);

  useEffect(() => {
    if (
      Object.keys(audioRecorderPlayer).length === 0 &&
      audioRecorderPlayer.constructor === Object
    ) {
      RNFS.unlink(RNFS.ExternalStorageDirectoryPath + '/sound.mp4');
    } else {
      RNFS.exists(RNFS.ExternalStorageDirectoryPath + '/sound.mp4').then(
        bool => {
          setSoundFileExists(bool);
        },
      );
    }
  }, [audioRecorderPlayer]);

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
    try {
      setAudioRecorderPlayer(new AudioRecorderPlayer());
      await audioRecorderPlayer.startRecorder();
      setIsRecording(true);
      setSoundFileExists(true);
      // audioRecorderPlayer.addRecordBackListener(e => {});
      console.log('Started recording');
    } catch (err) {
      console.warn('Failed to start recording', err);
    }
  }

  async function onStopRecord() {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    console.log('Stopped recording');
  }

  async function onStartPlay() {
    await audioRecorderPlayer.startPlayer();
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
      body: {uri: 'file:///sdcard/sound.mp4'},
    });
    console.log('Response from post request:', res);
  }

  return (
    <View>
      {permissionMicrophone && permissionStorage ? (
        !soundFileExists ? (
          <Button title="Start Recording" onPress={onStartRecord} />
        ) : isRecording ? (
          <Button title="Stop Recording" onPress={onStopRecord} />
        ) : (
          <Fragment>
            {!audioRecorderPlayer._isPlaying ? (
              <Button title="Start Playing" onPress={onStartPlay} />
            ) : (
              <Fragment>
                <Button title="Pause" onPress={onPausePlay} />
                <Button title="Stop" onPress={onStopPlay} />
              </Fragment>
            )}
            <Button title="Send to server" onPress={onSubmit} />
          </Fragment>
        )
      ) : (
        <Text>Checking your permissions. Please wait...</Text>
      )}
    </View>
  );
}

export default SpeakScreen;
