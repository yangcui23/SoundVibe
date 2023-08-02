import React from 'react'
import { BsFillExplicitFill } from 'react-icons/bs'
import { TbSquareLetterC } from 'react-icons/tb'
import styles from './dash.module.css'
const TrackSearchResult = ({ track, chooseTrack }) => {




  function handlePlay() {
    chooseTrack(track)
  }
  return (

    <div
      className={styles.trackContainerRes}
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} className={styles.albumCover} alt='album cover'/>
      <div className={styles.track}>
        <div className={styles.wrapper}>

          <div className={styles.trackTitle2} >{track.title}</div>
          
          <div className={styles.ex}>
            {track.restriction ? <BsFillExplicitFill style={{marginTop : '5px'}}/> : <TbSquareLetterC style={{marginTop : '5px'}} />}
            <p>{track.artist}</p>
          </div>
        </div>
      </div>
      <div className={styles.albumInfo}>
        <p className={styles.albumDiv}>{track.album}</p>
        <p style={{marginTop : '15px'}} className={styles.durationRes}> {`${Math.floor(track.duration / 60000)}:${(track.duration % 60000 / 1000).toFixed(0).padStart(2, '0')}`}</p>
      </div>
      
    </div>


  )
}
export default TrackSearchResult;