import React,{useState,useEffect} from 'react'
import SpotifyPlayer from "react-spotify-web-playback"
import axios from 'axios';
export default function Player({ accessToken, trackUri,spotifyApi }) {
  const [play, setPlay] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    useEffect(() => setPlay(true), [trackUri])
    console.log('Access token:', accessToken);
    console.log('Track URI:', trackUri);

    useEffect(() => {
      if (accessToken) {
        // Fetch the user's devices and set the selected device.
        axios
          .get('https://api.spotify.com/v1/me/player/devices', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            const activeDevice = response.data.devices.find(device => device.is_active);
            if (activeDevice) {
              setSelectedDeviceId(activeDevice.id);
            }
          })
          .catch((error) => {
            console.error('Error fetching devices:', error);
          });
      }
    }, [accessToken]);
  
    if (!accessToken) return null


  return (
    
      <SpotifyPlayer
      
        token={accessToken}
        
        callback={state => {
          if (!state.isPlaying) setPlay(false)
        }}
        play={play}
        uris={trackUri ? [trackUri] : []}
        styles={{trackArtistColor: 'white',trackNameColor: 'white',sliderColor: '#1cb954',bgColor: 'black',color:"#d5ccc7"}}
        syncExternalDevice={true}
      syncExternalDeviceInterval={5}
      autoPlay={true}
      persistDeviceSelection={true}
      showSaveIcon={false}
      device={selectedDeviceId}
      />
    
  )
}
