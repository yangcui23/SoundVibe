import React from 'react'
import styles from './dash.module.css';
export default function SearchArtist({track}) {
  return (
    <div
    className={styles.trackDivRes}
    style={{ cursor: "pointer" }}
   
  >
    
    {track.images && track.images.length > 0 ? (

        <img src={track.images[0].url} className={styles.responsiveCover} />
    )
        :
        (
            <img src={process.env.PUBLIC_URL + '/noimages.png'}  className={styles.responsiveCover} />
        )

    }
    <div className={styles.trackRes}>

        <div className={styles.trackTitleRes}>{track.name}</div>
        <p className={styles.wewr}>Artist</p>
        
    </div>
  </div>
  )
}
