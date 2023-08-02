import React from 'react'
import { BsFillExplicitFill } from 'react-icons/bs'
import { TbSquareLetterC } from 'react-icons/tb'
import styles from './dash.module.css';
export default function ArtistTopTracks({ track, chooseTrack }) {
    function handlePlay() {
        chooseTrack(track)
    }

    
    return (
        <div
            className={styles.trackContainer}
            style={{ cursor: "pointer" }}
            onClick={handlePlay}
        >

            <img src={track.album.images[0].url} alt='album cover' className={styles.albumCover} />
            <div className={styles.track}>
                <div className={styles.wrapper}>

                    <div style={{marginLeft : '5px' , fontWeight : 'bold'}} className={styles.trackTitleRes}>{track.name}</div>
                    <div className={styles.ex}>
                        {track.explicit ? <BsFillExplicitFill style={{ marginTop: '5px' }} /> : <TbSquareLetterC style={{ marginTop: '5px' }} />
                        }
                        <p >{track.artists[0].name}</p>
                    </div>

                </div>
            </div>
            <div className={styles.albumInfo}>
                

                <p style={{marginLeft : '130px'}} className={styles.durationRes} > {`${Math.floor(track.duration_ms / 60000)}:${(track.duration_ms % 60000 / 1000).toFixed(0).padStart(2, '0')}`}</p>
            </div>

        </div>
    )
}
