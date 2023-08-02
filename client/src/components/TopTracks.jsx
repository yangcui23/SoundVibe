import React from 'react';
import styles from './dash.module.css';
import { BiSolidPlaylist } from 'react-icons/bi';
export default function TopTracks({tracks,chooseTrack,toggleDropdown}) {
    function handlePlay() {
        chooseTrack(tracks)
      }
  return (
    <div
      className={styles.trackDiv}
      style={{ cursor: "pointer" }}
      
    >
      <img src={tracks.album.images[0].url} className={styles.biggerCover} onClick={handlePlay}/>

      <div className={styles.track}>


        <div className={styles.trackTitle}>{tracks.name}</div>
        <div className={styles.name}>
          <p className={styles.wn}>
            {tracks.artists[0].name}

          </p>
          <button onClick={() => toggleDropdown(tracks.uri)} className={styles.divAddButton} ><BiSolidPlaylist /></button>
        </div>
      </div>

    </div>
  )
}
