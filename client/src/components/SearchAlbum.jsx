import React from 'react'
import styles from './dash.module.css';
export default function SearchAlbum({track}) {
  return (
    <div
    className={styles.trackDivRes}
    style={{ cursor: "pointer" }}
   
  >
    <img src={track.images[0].url} className={styles.responsiveCover} />
    
    <div className={styles.trackRes}>

        <div className={styles.trackTitleRes}>{track.name}</div>
        <div className={styles.searchAlbumArtistName}>{track.release_date.substring(0, 4)} • {track.artists[0].name}</div>
    </div>
  </div>
  )
}
