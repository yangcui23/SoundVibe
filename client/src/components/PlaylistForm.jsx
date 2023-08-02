import React, { useState } from 'react'
import axios from 'axios'
import styles from './dash.module.css'

export default function PlaylistForm({ accessToken, userId, handleCloseForm, onPlaylistCreate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [publicList, setPublicList] = useState(false);
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                `https://api.spotify.com/v1/users/${userId}/playlists`,
                {
                    name,
                    description,
                    public: publicList,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 201) {
                console.log('Playlist created successfully!');
                const newPlaylist = response.data;
                onPlaylistCreate(newPlaylist);
                setName('');
                setDescription('');
                setPublicList(false);

                handleCloseForm(true)
            } else {
                console.log('Failed to create playlist');
            }
        } catch (error) {
            console.log('Something went wrong!', error);
        }
    };
    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>

                Playlist Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br />
            <label className={styles.label}>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <br />
            <div className={styles.check}>

                <label className={styles.label}>
                    Public:
                </label>
                <input
                    type="checkbox"
                    checked={publicList}
                    className={styles.checkInput}
                    onChange={(e) => setPublicList(e.target.checked)}
                />
            </div>

            <button className={styles.button49} type="submit">Create Playlist</button>
        </form>
    )
}
