import React from 'react'
import './login.css';
import { AiFillLinkedin,AiFillGithub } from 'react-icons/ai'
const AUTH_URL =
    "https://accounts.spotify.com/authorize?client_id=8e48633bb519433c82873afba9fa6d03&response_type=code&redirect_uri=http://bluesoundvibe.com&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20user-read-recently-played%20user-top-read%20playlist-modify-public%20playlist-modify-private"
export default function Login() {
    
    return (
        <div>
            <div className="box">
                <div className="smallBox d-flex flex-column align-items-center ">
                    <a href={AUTH_URL} className='btn btn-success'><span>Login With Spotify</span></a>
                </div>
                <div className='linkBanner'>
                    <div>
                        <p className='text-white font-weight-bold'>Made By Yang Cui Circa 2023</p>
                    </div>
                    <div className='d-flex justify-content-around w-25'>

                        <a href='https://www.linkedin.com/in/yang-cui-477127266/' className='text-white'><AiFillLinkedin />LinkedIn</a>
                        <a href='https://github.com/yangcui23'  className='text-white'><AiFillGithub/>Gibhub</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
