import React from 'react'
import { BsFillExplicitFill } from 'react-icons/bs'
import { TbSquareLetterC } from 'react-icons/tb'
import styles from './dash.module.css';
export default function PlaylistTracks({ track, chooseTrack }) {
  
  function handlePlay() {
    chooseTrack(track)
    console.log(track.track.uri)
    
  }
  const formattedDate = new Date(track.added_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return (
    <div
      className={styles.trackContainer}
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      {track.album.images && track.album.images.length > 0 ? (
        <img
          src={track.album.images[0].url}
          style={{ height: "50px", width: "50px" }}
          alt="Album Cover"
        />
      ) : (
        <img
          src={process.env.PUBLIC_URL + '/fallback.png'}
          style={{ height: "50px", width: "50px", backgroundColor: "black" }}
          alt="Fallback"
        />
      )}
      <div className={styles.track}>
        <div className={styles.wrapper}>

          <div style={{marginLeft : '5px'}} className={styles.trackTitle2} >{track.name}</div>
          <div className={styles.ex} >
            {track.explicit ? <BsFillExplicitFill style={{marginTop : '4px'}}/> : <TbSquareLetterC style={{marginTop : '5px'}} />
            }
            <p >{track.artists[0].name}</p>
          </div>

        </div>
      </div>
      <div className={styles.albumInfo}>
        <p className={styles.albumName} >{track.album.name}</p>
        <p className={styles.date}>{formattedDate}</p>
        <p className={styles.duration}> {`${Math.floor(track.duration_ms / 60000)}:${(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}`}</p>
      </div>

    </div>
  )
}
