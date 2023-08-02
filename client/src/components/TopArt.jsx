import React from 'react'
import styles from './dash.module.css'
export default function TopArt({ artist }) {

  
  return (
    <div
      className={styles.trackDiv}
      style={{ cursor: "pointer" }}
      
    >
      <img src={artist.images[0].url}  className={styles.artistCover}  />

      <div className={styles.track}>


        <div className="text-white">{artist.name}</div>
      </div>




    </div>
  )
}
