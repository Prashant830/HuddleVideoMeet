
import {Video} from '@huddle01/react-native/components';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react-native/hooks';
//import axios from 'axios';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View, StatusBar} from 'react-native';
import {RTCView} from 'react-native-webrtc';
 
function App(): JSX.Element {
  
  const {state} = useMeetingMachine();
  const {initialize, isInitialized} = useHuddle01();
  const {joinLobby, leaveLobby} = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const {joinRoom, leaveRoom} = useRoom();
  const {peers} = usePeers();
 
  const [streamURL, setStreamURL] = useState('');


  // const response =  axios.post(
  //   'https://api.huddle01.com/api/v1/create-room',
  //   {
  //     title: 'Huddle01-Test',
  //     hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
  //   },
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'x-api-key': "s9R8fnr18ouHivGfRnDliVjRiOguurVb",
  //     },
  //   }
  // );
 
  useEventListener('lobby:cam-on', () => {
    if (camStream) {
      console.log('camStream: ', camStream.toURL());
      setStreamURL(camStream.toURL());
    }
  });
 
  return (

   
    <ScrollView style={styles.background}>
       <StatusBar
 backgroundColor="#f05022"
 barStyle="light-content"
/>
      <Text style={styles.appTitle}> Video Conferencing App</Text>
 
      <View style={styles.infoSection}>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Room State</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>{JSON.stringify(state.value)}</Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Me Id</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.peerId)}
            </Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Peers</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.peers)}
            </Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Consumers</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.consumers)}
            </Text>
          </View>
        </View>
      </View>


      <View style={styles.controlsSection}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Idle</Text>
            <View style={styles.button}>
              <Button
                title="INIT"
                disabled={!state.matches('Idle')}
                onPress={() => initialize('8Kc8rCb2u41KUmTv_nTgaXDoJ6Kjtxng')}
              />
            </View>
          </View>


 
          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Initialized</Text>
            <View style={styles.button}>
              <Button
                title="JOIN LOBBY"
                disabled={!joinLobby.isCallable}
                onPress={() => {
                    joinLobby('cai-epcu-pfz');
                }}
              />
            </View>
          
            </View>

          </View>


      <View style={styles.videoSection}>
        <Text style={styles.texVideot}>My Video:</Text>
        <View style={styles.myVideo}>
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={streamURL}
            zOrder={0}
            style={{
              backgroundColor: 'white',
              width: '75%',
              height: '100%',
            }}
          />
        </View>
        <View>
          {Object.values(peers)
            .filter(peer => peer.cam)
            .map(peer => (
              <Video
                key={peer.peerId}
                peerId={peer.peerId}
                track={peer.cam}
                style={{
                  backgroundColor: 'white',
                  width: '75%',
                  height: '100%',
                }}
              />
            ))}
        </View>
      </View>
 
    




          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Lobby</Text>

            <View style = { styles.controlsSection}>
              <View style={styles.button}>
                <Button
                  title="ENABLE CAM"
                  disabled={!fetchVideoStream.isCallable}
                  onPress={fetchVideoStream}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="ENABLE MIC"
                  disabled={!fetchAudioStream.isCallable}
                  onPress={fetchAudioStream}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="JOIN ROOM"
                  disabled={!joinRoom.isCallable}
                  onPress={joinRoom}
                />
              </View>

              </View>

              <View style = { styles.controlsSectionTwo}>

              <View style={styles.button}>
                <Button
                  title="LEAVE LOBBY"
                  disabled={!state.matches('Initialized.JoinedLobby')}
                  onPress={leaveLobby}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="DISABLE CAM"
                  disabled={!stopVideoStream.isCallable}
                  onPress={stopVideoStream}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="DISABLE MIC"
                  disabled={!stopAudioStream.isCallable}
                  onPress={stopAudioStream}
                />
              </View>
            </View>
          </View>
          
 
          {/* <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Room</Text>
            <View>
              <View style={styles.button}>
                <Button
                  title="PRODUCE MIC"
                  disabled={!produceAudio.isCallable}
                  onPress={() => produceAudio(micStream)}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="PRODUCE CAM"
                  disabled={!produceVideo.isCallable}
                  onPress={() => produceVideo(camStream)}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="STOP PRODUCING MIC"
                  disabled={!stopProducingAudio.isCallable}
                  onPress={() => stopProducingAudio()}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="STOP PRODUCING CAM"
                  disabled={!stopProducingVideo.isCallable}
                  onPress={() => stopProducingVideo()}
                />
              </View>
 
              <View style={styles.button}>
                <Button
                  title="Leave Room"
                  disabled={!leaveRoom.isCallable}
                  onPress={leaveRoom}
                />
              </View>
            </View>
          </View>
           */}
       
  
      
    </ScrollView>
  );
}
 
const styles = StyleSheet.create({
  appTitle: {
    color: '#000000',
    fontSize: 25,
    marginTop:5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  background: {
    backgroundColor: '#f05022',
    height: '100%',
    width: '100%',
    paddingVertical: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  },
  texVideot: {
    color: '#000',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  infoSection: {
    borderBottomColor: '#000',
    borderBottomWidth: 3,
    padding: 25,
  },
  infoTab: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 6,
    marginTop: 4,
  },
  infoKey: {
    borderRightColor: '#000',
    borderRightWidth: 3,
    padding: 4,
  },
  infoValue: {
    flex: 1,
    padding: 5,
  },
  controlsSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
    // borderBottomColor: '#000',
    // borderBottomWidth: 2,
  },

  controlsSectionTwo: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: 20,
    paddingEnd: 20,
    marginBottom : 60
    // borderBottomColor: '#000',
    // borderBottomWidth: 2,
  },
  controlsColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginTop: 4,
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#000',
  },
  controlsGroupTitle: {
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  controlGroup: {
    marginTop: 4,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  videoSection: {},
  myVideo: {
    height: 300,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});
 
export default App;