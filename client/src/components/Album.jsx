import React from 'react'
import { BsFillExplicitFill } from 'react-icons/bs'
import { TbSquareLetterC } from 'react-icons/tb'
export default function Album({track,chooseTrack}) {


  
  function handlePlay() {
    chooseTrack(track)
  }
  return (
    <div
      className="trackContainer d-flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img src={track.albumUrl} style={{ height: "64px", width: "64px" }} />
      <div className="track ">
        <div>

          <div className="track-title" >{track.title}</div>
          <div className="text-white">{track.artist}</div>
          <div>
            {track.restriction ? <BsFillExplicitFill /> : <TbSquareLetterC />
            }

          </div>
        </div>
      </div>
      <div className='album d-flex justify-content-between align-items-center'>
        <p>{track.album}</p>
        <p > {`${Math.floor(track.duration / 60000)}:${(track.duration % 60000 / 1000).toFixed(0).padStart(2, '0')}`}</p>
      </div>
      
    </div>
  )
}
