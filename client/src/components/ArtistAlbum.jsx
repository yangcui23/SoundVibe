import React from 'react'

import styles from './dash.module.css';
export default function ArtistAlbum({track}) {
  return (
    <div
    className={styles.trackDiv}
    style={{ cursor: "pointer" }}
    
>
    <img src={track.images[0].url} className={styles.biggerCover} alt='new release'/>

    <div className={styles.track}>
        <div className={styles.trackTitle} >{track.name}</div>

        <div className="name text-white">{track.artists[0].name}</div>
        
        
    </div>

</div>
  )
}
