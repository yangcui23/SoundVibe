import React, { useState, useEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { BiTimeFive, BiSolidPlaylist, BiLibrary } from 'react-icons/bi'
import styles from './dash.module.css';
import SpotifyWebApi from 'spotify-web-api-node';

import TrackSearchResult from './TrackSearchResult';
import { SiHomebridge } from 'react-icons/si';
import Player from './Player';
import NewRelease from './NewRelease';
import RecentPlayed from './RecentPlayed';
import { BsSearchHeartFill } from 'react-icons/bs';
import TopArt from './TopArt';
import axios from 'axios'
import { FiSearch } from 'react-icons/fi';
import TopTracks from './TopTracks';
import PlaylistTracks from './PlaylistTracks';
import PlaylistForm from './PlaylistForm';
import SearchAlbum from './SearchAlbum';
import SearchArtist from './SearchArtist';
import ArtistTopTracks from './ArtistTopTracks';
import ArtistAlbum from './ArtistAlbum';
import ArtistAlbumTracks from './ArtistAlbumTracks';
const spotifyApi = new SpotifyWebApi({
  clientId: "8e48633bb519433c82873afba9fa6d03"
})

export default function Dashboard({ code }) {

  const accessToken = useAuth(code);

  const [user, setUser] = useState('');
  const [playingTrack, setPlayingTrack] = useState();
  const [timeOfDay, setTimeOfDay] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState({});
  const [playlistId, setPlaylistId] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [album, setAlbum] = useState([]);
  const [artist, setArtist] = useState([]);
  const [newRelease, setNewRelease] = useState([]);
  const [topArtists, setTopArtists] = useState([]);
  const [allTopArtists, setAllTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [allTopTracks, setAllTopTracks] = useState([]);
  const [selectedTab, setSelectedTab] = useState('home');
  const [selectedTabSearch, setSelectedTabSearch] = useState('song')
  const [actionStack, setActionStack] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [userId, setUserId] = useState('');
  const [albumId, setAlbumId] = useState('');
  const [artistTopTracks, setArtistTopTracks] = useState([]);
  const [trackUri, setTrackUri] = useState('');
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null)
  const [allArtistTopTracks, setAllArtistTopTracks] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [albumTracks, setAlbumTracks] = useState([]);

  const [selectedTrackUri, setSelectedTrackUri] = useState(null);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleButtonClick = () => {
    setShowForm(true);
  };
  function chooseTrack(track) {
    setPlayingTrack(track)
  }

  const handleCloseForm = () => {
    setShowForm(false);
  };
  const handleTabClick = async (tab) => {
    if (selectedTab !== tab) {
      setSelectedTab(tab);
      setActionStack((prevActionStack) => [...prevActionStack, tab]);
    } else {
      setActionStack((prevActionStack) => prevActionStack.slice(0, -1));
    }

    if (tab === 'searchArtistTopTracks') {
      try {
        const response = await spotifyApi.getArtist(selectedArtistId);
        const artist = response.body;
        setArtist(artist);
      } catch (error) {
        console.log('Error fetching artist data:', error);
      }
    }
  };
  let scrollTimeout;

  function showScrollbar() {
    clearTimeout(scrollTimeout);
    document.querySelector('.newRelease').style.overflowY = 'scroll';
  }

  function hideScrollbar() {
    scrollTimeout = setTimeout(() => {
      document.querySelector('.newRelease').style.overflowY = 'hidden';
    }, 1000); 
  }
  useEffect(() => {
    if (actionStack.length > 0) {
      setSelectedTab(actionStack[actionStack.length - 1]);
    }
  }, [actionStack]);
  const handleTabClickSearch = (song) => {
    setSelectedTabSearch(song);
  }
  const closeDropdown = () => {
    setShowPlaylistDropdown(false);
  }
  const toggleDropdown = (trackUri) => {
    setSelectedTrackUri(trackUri);
    setShowPlaylistDropdown(!showPlaylistDropdown);
  };
  const handlePlaylistCreate = (newPlaylist) => {

    setPlaylist([newPlaylist, ...playlist]);
  };


  const handleLogout = () => {
    const logoutUrl = 'https://accounts.spotify.com/en/logout';
    const returnUrl = 'http://bluesoundvibe.com';
    const logoutWindow = window.open(logoutUrl, '_blank', 'width=500,height=600');
    const checkWindowClosed = setInterval(() => {
      if (logoutWindow.closed) {
        clearInterval(checkWindowClosed);
        window.location.href = returnUrl;
      }
    }, 1000);
  };
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.getMe()
      .then(res => {
        setUser(res.body);
        console.log(res.body);
        setUserId(res.body.id)
      })
  }, [accessToken]);
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    const limit = 50;
    let offset = 0;

    const fetchSearchResults = async () => {
      try {
        const response = await spotifyApi.searchTracks(search, {
          limit,
          offset,
        });

        const results = response.body.tracks.items.map(track => ({
          album: track.album.name,
          artist: track.artists[0].name,
          title: track.name,
          uri: track.uri,
          albumUrl: track.album.images[0].url,
          restriction: track.explicit,
          duration: track.duration_ms,
        }));

        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();

    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  useEffect(() => {
    const searchAlbums = async () => {
      const access = accessToken;

      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          params: {
            q: search,
            type: 'album',
          },
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        const albums = response.data.albums.items;
        setAlbum(albums)
        console.log(response.data.albums.items);
        setAlbumId(albums.id)

      } catch (error) {
        console.log('Error searching albums:', error);
      }
    };
    searchAlbums()
  }, [search, accessToken]);

  const handleSearchArtistAlbum = async (album) => {
    setSelectedTab('searchArtistAlbumTracks')
    setSelectedAlbumId(album.id);

    spotifyApi.getAlbumTracks(album.id)
      .then((response) => {
        const albumTracks = response.body.items;
        setAlbumTracks(albumTracks);


        const artistId = album.artists[0].id;
        spotifyApi.getArtist(artistId)
          .then((artistResponse) => {
            const artist = artistResponse.body;
            setArtist(artist);

            console.log(albumTracks);
            console.log(artist);
          })
          .catch((error) => {
            console.log('Error fetching artist data:', error);
          });
      })
      .catch((error) => {
        console.log('Error fetching album tracks:', error);
      });
  }
  const handleSearchAlbum = async (album) => {
    setSelectedTab('searchAlbumTracks')
    setSelectedAlbumId(album.id);

    spotifyApi.getAlbumTracks(album.id)
      .then((response) => {
        const albumTracks = response.body.items;
        setAlbumTracks(albumTracks);


        const artistId = album.artists[0].id;
        spotifyApi.getArtist(artistId)
          .then((artistResponse) => {
            const artist = artistResponse.body;
            setArtist(artist);

            console.log(albumTracks);
            console.log(artist);
          })
          .catch((error) => {
            console.log('Error fetching artist data:', error);
          });
      })
      .catch((error) => {
        console.log('Error fetching album tracks:', error);
      });
  }
  useEffect(() => {
    const searchArtist = async () => {
      const access = accessToken;

      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          params: {
            q: search,
            type: 'artist',
          },
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        const artist = response.data.artists.items;
        console.log(artist);
        setArtist(artist)

      } catch (error) {
        console.log('Error searching artist:', error);
      }
    };
    searchArtist()
  }, [search, accessToken]);
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.getMyTopTracks({ limit: 5 })
      .then(res => {
        setTopTracks(res.body.items);
      })
      .catch(err => console.log(err))
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchTopArtists = async () => {
      try {
        const response = await spotifyApi.getMyTopArtists({ limit: 5 });
        const topArtists = response.body.items;
        setTopArtists(topArtists);
        console.log(topArtists)
      } catch (error) {
        console.log('Error fetching top artists:', error);
      }
    };

    fetchTopArtists();
  }, [accessToken]);
  const addItemToPlaylist = async (playlistId, uri) => {
    try {
      console.log('accessToken:', accessToken);
      console.log('playlistId:', playlistId);
      console.log('uri:', uri);


      if (uri.includes('album:')) {
        const albumId = uri.split(':')[2];


        const albumTracksResponse = await spotifyApi.getAlbumTracks(albumId);
        const albumTracks = albumTracksResponse.body.items;


        const trackUris = albumTracks.map(track => track.uri);


        const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: trackUris,
            position: 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add album tracks to playlist');
        }
      } else {

        const apiUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uris: [uri],
            position: 0,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add track to playlist');
        }
      }
      const updatedPlaylist = await spotifyApi.getPlaylist(playlistId);
      const tracks = updatedPlaylist.body.tracks.items.map(item => item.track);
      const updatedPlaylistIndex = playlistTracks.findIndex(
        playlistTrack => playlistTrack.playlist.id === playlistId
      );
      if (updatedPlaylistIndex !== -1) {

        const updatedPlaylistTrack = {
          playlist: {
            ...playlistTracks[updatedPlaylistIndex].playlist,
            tracks: {
              total: updatedPlaylist.body.tracks.total,
            },
          },
          tracks: tracks,
        };
        setPlaylistTracks(prevState => {
          const newState = [...prevState];
          newState[updatedPlaylistIndex] = updatedPlaylistTrack;
          return newState;
        });
      }

      console.log('Successfully added item to playlist:', uri);
      setShowPlaylistDropdown(false);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

    } catch (error) {
      console.log('Error adding item to playlist:', error);
    }
  };


  const handleArtistClick = async (artist) => {
    setSelectedTab('artistTopTracks');
    setSelectedArtistId(artist.id);

    try {
      const response = await spotifyApi.getArtistTopTracks(artist.id, 'US');
      const tracks = response.body.tracks;
      setArtistTopTracks(tracks);
      setSelectedTrackUri(tracks.uri);
      setTrackUri(tracks.uri)
      console.log(response.body.tracks)


      const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
      const albums = albumsResponse.body.items;
      setArtistAlbums(albums);
      setAlbumId(album.id)
      console.log(albumsResponse.body.items)

    } catch (error) {
      console.log('Error fetching artist top tracks:', error);
    }
  };
  const handleSearchArtistClick = async (artistItem) => {
    setSelectedTab('searchArtistTopTracks');
    setSelectedArtistId(artistItem.id);

    try {
      const response = await spotifyApi.getArtistTopTracks(artistItem.id, 'US');
      const tracks = response.body.tracks;
      setArtistTopTracks(tracks);
      setSelectedTrackUri(tracks.uri);
      setTrackUri(tracks.uri);

      const albumsResponse = await spotifyApi.getArtistAlbums(artistItem.id);
      const albums = albumsResponse.body.items;
      setArtist([artistItem]);
      setArtistAlbums(albums);
    } catch (error) {
      console.log('Error fetching artist top tracks:', error);
    }
  };

  const handleArtistAlbumClick = async (album) => {
    setSelectedTab('artistAlbumTracks');
    setSelectedAlbumId(album.id);


    try {
      const response = await spotifyApi.getAlbumTracks(album.id)
      const albumTracks = response.body.items;
      setAlbumTracks(albumTracks);
      console.log(response.body.items)

    } catch (error) {
      console.log('Error fetching artist top tracks:', error);
    }
  }

  useEffect(() => {
    if (!accessToken) return;

    const fetchAllTopArtists = async () => {
      try {
        const response = await spotifyApi.getMyTopArtists({ limit: 10 });
        const allTopArtists = response.body.items;

        setAllTopArtists(allTopArtists)
        console.log(allArtistTopTracks)
      } catch (error) {
        console.log('Error fetching top artists:', error);
      }
    };

    fetchAllTopArtists();
  }, [accessToken]);

  const handleAllArtistClick = async (artist) => {
    setSelectedTab('allArtistTopTracks');
    setSelectedArtistId(artist.id);

    try {
      const response = await spotifyApi.getArtistTopTracks(artist.id, 'US');
      const allTracks = response.body.tracks;

      setAllArtistTopTracks(allTracks)

      const albumsResponse = await spotifyApi.getArtistAlbums(artist.id);
      const albums = albumsResponse.body.items;
      setArtistAlbums(albums);
      setAlbumId(album.id)
      console.log(albumsResponse.body.items)


    } catch (error) {
      console.log('Error fetching artist top tracks:', error);
    }
  };

  const handleAllArtistAlbumClick = async (album) => {
    setSelectedTab('allArtistAlbumTracks');
    setSelectedAlbumId(album.id);


    try {
      const response = await spotifyApi.getAlbumTracks(album.id)
      const albumTracks = response.body.items;
      setAlbumTracks(albumTracks);
      console.log(response.body.items)

    } catch (error) {
      console.log('Error fetching artist top tracks:', error);
    }
  }




  useEffect(() => {
    if (!accessToken) return;

    const fetchData = async () => {
      try {
        const topArtistsResponse = await spotifyApi.getMyTopArtists();
        const topArtists = topArtistsResponse.body.items;

        const artistIds = topArtists.slice(0, 5).map(artist => artist.id);
        console.log(artistIds);
        const recommendationsResponse = await spotifyApi.getRecommendations({
          seed_artists: artistIds,
          min_energy: 0.4,
          min_popularity: 50
        });

        const recommendations = recommendationsResponse.body.tracks;
        setRecommendations(recommendations)
        console.log(recommendations);
      } catch (err) {
        console.log("Something went wrong!", err);
      }
    };

    fetchData();
  }, [accessToken]);
  const limitedRecommendations = recommendations.slice(0, 5);
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.getMyTopTracks()
      .then(res => {
        setAllTopTracks(res.body.items);

      }).catch(err => console.log(err))
  }, [accessToken])


  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.getNewReleases()
      .then(function (data) {
        const albums = data.body.albums.items.filter(track => track.album_type === 'single');

        for (let i = albums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [albums[i], albums[j]] = [albums[j], albums[i]];
        }
        setSelectedTrackUri(data.body.albums.items.uri);

        console.log(data.body.albums.items)
        setNewRelease(albums);
      });
  }, [accessToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        const data = await spotifyApi.getUserPlaylists();
        const id = data.body.items.map(playlist => playlist.id);
        console.log(data.body.items);
        setPlaylistId(id);
        console.log(playlistId);
        setPlaylist(data.body.items);
      } catch (err) {
        console.log('Something went wrong!', err);
      }
    };

    fetchData();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !playlistId) return;

    const fetchPlaylistTracks = async () => {
      try {
        const mergedPlaylists = [];

        for (let i = 0; i < playlistId.length; i++) {
          const response = await spotifyApi.getPlaylistTracks(playlistId[i], {
            limit: 100,
            offset: 0,
          });

          const tracksWithAddedAt = response.body.items.map(item => {
            const track = item.track;
            const addedAt = item.added_at;
            return { ...track, added_at: addedAt };
          });

          mergedPlaylists.push({
            playlist: playlist[i],
            tracks: tracksWithAddedAt,
          });

          console.log(`Tracks for Playlist ${i + 1}:`, tracksWithAddedAt);


          if (tracksWithAddedAt.length > 0) {
            console.log(tracksWithAddedAt[0].uri);
          }
        }

        setPlaylistTracks(mergedPlaylists);
        console.log(mergedPlaylists);
      } catch (err) {
        console.log('Something went wrong!', err);
      }
    };

    const getAllTracksForPlaylist = async (playlistId) => {
      const limit = 100;
      let offset = 0;
      let tracks = [];
      let total = 0;

      do {
        const response = await spotifyApi.getPlaylistTracks(playlistId, {
          limit,
          offset,
        });

        tracks.push(...response.body.items);
        total = response.body.total;
        offset += limit;
      } while (tracks.length < total);

      return tracks;
    };

    fetchPlaylistTracks();
  }, [playlistId, accessToken]);
  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let timeOfDay;
    if (currentHour < 12) {
      timeOfDay = 'Morning';
    } else if (currentHour < 18) {
      timeOfDay = 'Afternoon';
    } else {
      timeOfDay = 'Evening';
    }

    setTimeOfDay(timeOfDay);
  }, []);

  const releaseDate = album.find(album => album.id === selectedAlbumId)?.release_date;
  const year = releaseDate ? releaseDate.slice(0, 4) : "";
  


  return (
    <div className={styles.bigContainer}>
      <div className={styles.topDiv}>
        <div className={styles.left}>
          <div className={styles.Links}>
            <button
              className={`tab ${selectedTab === 'home' ? 'active' : ''} ${styles.tab}`}
              onClick={() => handleTabClick('home')}


            >
              <SiHomebridge className={styles.symbol} style={{ color: selectedTab === 'home' ? '#0a9396' : 'white' }} />
              <span className={styles.glow}>Home</span>
            </button>
            <button
              className={`tab ${selectedTab === 'search' ? 'active' : ''} ${styles.tab}`}
              onClick={() => handleTabClick('search')}
            >
              <BsSearchHeartFill className={styles.symbol} style={{ color: selectedTab === 'search' ? '#0a9396' : 'white' }} />
              <span className={styles.glow}>Search</span>
            </button>

          </div>
          <div className={styles.menu_side}>
            <div className={styles.playlist}>
              <div className={styles.library}>

                <BiLibrary className={styles.symbol2} />
                <h1 className={styles.libraryText}>Your Library</h1>
              </div>
              <div>
                {playlist.map((list, index) => (
                  <button
                    onClick={() => handleTabClick(list.id)}
                    className={styles.listBtn}
                    key={list.id}
                  >
                    <div>
                      {list.images && list.images.length > 0 ? (

                        <img src={list.images[0].url} className={styles.listImg} alt='playlist' />
                      )

                        : (
                          <img src={process.env.PUBLIC_URL + '/beamNote.jpg'} className={styles.listImg} alt="Fallback" />

                        )

                      }
                    </div>
                    <div className={styles.playlistInfo}>
                      <p className={styles.text}>{list.name}</p>
                      <div className={styles.infoDiv}>
                        <p className={styles.text}>{list.type}</p>
                        <p className={styles.text}>•</p>
                        <p className={styles.textRes}>{list.owner.display_name}</p>
                      </div>
                    </div>
                  </button>
                ))}

              </div>
              <div>

                <button className={styles.formButton} onClick={handleButtonClick}>+</button>

                {showForm && (
                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={handleCloseForm}>
                        X
                      </button>

                      {accessToken && <PlaylistForm accessToken={accessToken} userId={userId} onPlaylistCreate={handlePlaylistCreate} handleCloseForm={handleCloseForm} />}
                    </div>
                  </div>
                )}
                {showSuccessMessage && (

                  <div className={`${styles.success} ${showSuccessMessage ? styles.show : ""}`}>

                    <p className={styles.successText}>Successfully add song to playlist!!</p>
                  </div>

                )}


              </div>


            </div>
          </div>
        </div>
        <div className={styles.right}>

          <div className={styles.song_side}>
            <nav className={styles.nav}>
              <div className={styles.time}>

                <h1 className={styles.timeText}>Good {timeOfDay}</h1>


              </div>
              <div className={styles.user}>
                <div className={styles.user_img}>
                  {user && user.images && user.images.length > 0 && (
                    <img src={user.images[0].url} alt="user images" />
                  )}
                  <p className={styles.userName}>{user.display_name}</p>

                </div>

                <button className=' button-85' onClick={handleLogout} > Logout </button>
              </div>
            </nav>
            {selectedTab && playlistTracks.length > 0 && (
              <div className={styles.playlistTracksContainer}>

                {playlistTracks.map(playlistTrack => (
                  playlistTrack.playlist.id === selectedTab && (
                    <div key={playlistTrack.playlist.id}>
                      <div className={styles.playlistBanner}>
                        {playlistTrack.playlist.images && playlistTrack.playlist.images.length > 0 ? (
                          <img src={playlistTrack.playlist.images[0].url} className={styles.bannerImage} alt='playlist' />
                        ) : (
                          <img src={process.env.PUBLIC_URL + '/beamNote.jpg'} className={styles.bannerImage} alt="Fallback" />
                        )}
                        <div>
                          {playlistTrack.playlist.public ? <p style={{ color: 'white' }} className={styles.publicOption}>Public Playlist</p> : <p className={styles.publicOption} style={{ color: 'white' }}>Private Playlist</p>}
                          <p className={styles.bannerName}>{playlistTrack.playlist.name}</p>
                          <p className={styles.displayName}><span>{playlistTrack.playlist.owner.display_name}</span> • {playlistTrack.playlist.tracks.total} songs</p>
                        </div>
                      </div>
                      <div className={styles.trackInfo}>
                        <div className={styles.innerTrack}>
                          <p style={{ marginLeft: '5px' }}>#</p>
                          <p style={{ marginLeft: '25px' }}>Title</p>
                        </div>
                        <p style={{ marginLeft: '360px' }}>Album</p>
                        <p style={{ marginLeft: '140px' }}>Date Added</p>
                        <p><BiTimeFive /></p>
                      </div>
                      <ol className={styles.trackList}>
                        {playlistTrack.tracks.map(track => (
                          <li >
                            <PlaylistTracks track={track} chooseTrack={chooseTrack} />
                          </li>
                        ))}
                      </ol>
                    </div>
                  )
                ))}
              </div>
            )}
            {selectedTab === 'newRelease' && (
              <div className={styles.newRelease}>

                <div className={styles.sectionTitle}>
                  <h4 className={styles.divTitle}>New Releases</h4>


                </div>
                <div className={styles.allSongDiv}>
                  {newRelease.map(song => (


                    <div className={styles.smallDiv}>

                      {song.album_type === "single" && (
                        <div>

                          <NewRelease track={song} chooseTrack={chooseTrack} key={song.uri} toggleDropdown={toggleDropdown} />
                        </div>

                      )}
                    </div>
                  ))}
                </div>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedTab === 'recommendations' && (
              <div className={styles.newRelease}>

                <div className={styles.sectionTitle}>
                  <h4 className={styles.divTitle}>Recommended For You</h4>


                </div>
                <div className={styles.allSongDiv}>
                  {recommendations.map(track => (


                    <div className={styles.smallDiv}>

                      <RecentPlayed track={track} key={track.uri} chooseTrack={chooseTrack} toggleDropdown={toggleDropdown} />

                    </div>
                  ))}
                </div>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedTab === 'topTracks' && (
              <div className={styles.newRelease}>

                <div className={styles.sectionTitle}>
                  <h4 className={styles.divTitle}>Your Top Tracks</h4>


                </div>
                <div className={styles.allSongDiv}>
                  {allTopTracks.map(song => (


                    <div className={styles.smallDiv}>

                      <TopTracks tracks={song} key={song.uri} chooseTrack={chooseTrack} />

                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedTab === 'topArtists' && (
              <div className={styles.newRelease}>

                <div className={styles.sectionTitle}>
                  <h4 className={styles.divTitle}>Your Top Artists</h4>
                </div>
                <div className={styles.allSongDiv}>
                  {allTopArtists.map(artist => (
                    <div className={styles.smallDiv} key={artist.id} onClick={() => handleAllArtistClick(artist)}>
                      <TopArt artist={artist} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'searchAlbumTracks' && (
              <div className={styles.newRelease}>
                <div className={styles.artistBanner}>


                  <img src={album.find(album => album.id === selectedAlbumId)?.images[0].url} className={styles.bannerImage} alt='album' />
                  <div className={styles.bannerContainer}>

                    <p className={styles.albumBannerName}>{album.find(album => album.id === selectedAlbumId)?.name}</p>
                    <div className={styles.artistNameNImg}>
                      <div className={styles.nameContainer}>
                        <div className={styles.imageContainer}>
                      {artist?.images && artist.images.length > 0 && (
                        <img src={artist.images[0].url} className={styles.albumArtistImage} />
                      )}
                          <p className={styles.artistName}>{album.find(album => album.id === selectedAlbumId)?.artists[0].name}</p>

                        </div>

                        <p className={styles.year}>{year} • {album.find(album => album.id === selectedAlbumId)?.total_tracks} songs</p>

                      </div>


                    </div>
                  </div>
                </div>

                <div className={styles.trackInfo}>
                  <div className={styles.innerTrack}>
                    <p style={{ marginLeft: '5px' }}>#</p>
                    <p style={{ marginLeft: '25px' }}>Title</p>
                  </div>
                  <p style={{ marginRight: '40px' }}>Album</p>
                  <p style={{ marginRight: '150px' }}><BiTimeFive /></p>
                </div>
                <ol className={styles.trackList}>
                  {albumTracks.map(track => (
                    <li key={track.id}>
                      <ArtistAlbumTracks track={track} chooseTrack={chooseTrack} album={album.find((albumItem) => albumItem.id === selectedAlbumId)} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedTab === 'allArtistAlbumTracks' && (
              <div className={styles.newRelease}>

                <div className={styles.artistBanner}>

                  <img src={artistAlbums.find(album => album.id === selectedAlbumId)?.images[0].url} className={styles.bannerImage} alt='artist album' />
                  <div className={styles.bannerContainer}>

                    <p className={styles.albumBannerName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.name}</p>
                    <div className={styles.artistNameNImg}>
                      {allTopArtists && allTopArtists.images && allTopArtists.images.length > 0 && (
                        <img src={topArtists.images[0].url} className={styles.albumArtistImage} alt='artist' />
                      )}
                      <img src={allTopArtists.find(artist => artist.id === selectedArtistId)?.images[0].url} className={styles.albumArtistImage} />
                      <p className={styles.artistName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.artists[0].name}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.trackInfo}>
                  <div className={styles.innerTrack}>
                    <p style={{ marginLeft: '5px' }}>#</p>
                    <p style={{ marginLeft: '25px' }}>Title</p>
                  </div>
                  <p style={{ marginRight: '150px' }}>Album</p>

                  <p><BiTimeFive /></p>
                </div>
                <ol className={styles.trackList}>

                  {albumTracks.map(track => (
                    <li key={track.id}>


                      <ArtistAlbumTracks track={track} chooseTrack={chooseTrack} album={artistAlbums.find((album) => album.id === selectedAlbumId)} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {selectedTab === 'artistAlbumTracks' && (
              <div className={styles.newRelease}>

                <div className={styles.artistBanner}>

                  <img src={artistAlbums.find(album => album.id === selectedAlbumId)?.images[0].url} className={styles.bannerImage} alt='artist album' />
                  <div className={styles.bannerContainer}>

                    <p className={styles.albumBannerName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.name}</p>
                    <div className={styles.artistNameNImg}>
                      {topArtists && topArtists.images && topArtists.images.length > 0 && (
                        <img src={topArtists.images[0].url} className={styles.albumArtistImage} alt='artist' />
                      )}
                      <img src={topArtists.find(artist => artist.id === selectedArtistId)?.images[0].url} className={styles.albumArtistImage} />
                      <p className={styles.artistName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.artists[0].name}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.trackInfo}>
                  <div className={styles.innerTrack}>
                    <p style={{ marginLeft: '5px' }}>#</p>
                    <p style={{ marginLeft: '25px' }}>Title</p>
                  </div>
                  <p style={{ marginRight: '150px' }}>Album</p>

                  <p><BiTimeFive /></p>
                </div>
                <ol className={styles.trackList}>

                  {albumTracks.map(track => (
                    <li key={track.id}>


                      <ArtistAlbumTracks track={track} chooseTrack={chooseTrack} album={artistAlbums.find((album) => album.id === selectedAlbumId)} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}
            {selectedTab === 'searchArtistTopTracks' && (
              <div className={styles.newRelease}>
                <div className={styles.artistBanner}>

                  <div>
                    <img src={artist[0]?.images[0]?.url} className={styles.bannerImage} alt='artist' />
                  </div>
                  <div>
                    <p className={styles.bannerName}>{artist.find(artistItem => artistItem.id === selectedArtistId)?.name}</p>
                  </div>
                </div>
                <h3 className={styles.divTitle}>Popular</h3>
                <ol className={styles.trackList}>
                  {artistTopTracks.map(track => (
                    <li key={track.id}>
                      <ArtistTopTracks track={track} chooseTrack={chooseTrack} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
                <h3 className={styles.divTitle}>Discography</h3>
                <div className={styles.allSongDiv}>
                  {artistAlbums.map(album => (

                    <div className={styles.smallDiv} key={album.id} onClick={() => handleSearchArtistAlbum(album)}>

                      <ArtistAlbum track={album} />
                    </div>

                  ))}

                </div>
              </div>

            )}
            {selectedTab === 'searchArtistAlbumTracks' && (
              <div className={styles.newRelease}>

                <div className={styles.artistBanner}>
                  <img src={artistAlbums.find(album => album.id === selectedAlbumId)?.images[0].url} className={styles.bannerImage} alt='artist album' />
                  <div className={styles.bannerContainer}>

                    <p className={styles.albumBannerName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.name}</p>
                    <div className={styles.artistNameNImg}>
                      {artist?.images && artist.images.length > 0 && (
                        <img src={artist.images[0].url} className={styles.albumArtistImage} alt='artist' />
                      )}

                      <p className={styles.artistName}>{artistAlbums.find(album => album.id === selectedAlbumId)?.artists[0].name}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.trackInfo}>
                  <div className={styles.innerTrack}>
                    <p style={{ marginLeft: '5px' }}>#</p>
                    <p style={{ marginLeft: '25px' }}>Title</p>
                  </div>
                  <p style={{ marginRight: '150px' }}>Album</p>

                  <p><BiTimeFive /></p>
                </div>
                <ol className={styles.trackList}>

                  {albumTracks.map(track => (
                    <li key={track.id}>


                      <ArtistAlbumTracks track={track} chooseTrack={chooseTrack} album={artistAlbums.find((album) => album.id === selectedAlbumId)} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}

              </div>
            )}

            {selectedTab === 'artistTopTracks' && (
              <div className={styles.newRelease}>
                <div className={styles.artistBanner}>

                  <img src={topArtists.find(artist => artist.id === selectedArtistId)?.images[0].url} className={styles.bannerImage} />
                  <div>

                    <p className={styles.bannerName}>{topArtists.find(artist => artist.id === selectedArtistId)?.name}</p>

                  </div>
                </div>
                <h3 className={styles.divTitle}>Popular</h3>

                <ol className={styles.trackList}>

                  {artistTopTracks.map(track => (
                    <li key={track.id}>

                      <ArtistTopTracks track={track} chooseTrack={chooseTrack} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
                <h3 className={styles.divTitle}>Discography</h3>
                <div className={styles.allSongDiv}>
                  {artistAlbums.map(album => (

                    <div className={styles.smallDiv} key={album.id} onClick={() => handleArtistAlbumClick(album)}>

                      <ArtistAlbum track={album} />
                    </div>

                  ))}

                </div>
              </div>

            )}


            {selectedTab === 'allArtistTopTracks' && (
              <div className={styles.newRelease}>

                <div className={styles.artistBanner}>
                  <img src={allTopArtists.find(artist => artist.id === selectedArtistId)?.images[0].url} className={styles.bannerImage} alt='artist' />
                  <div>

                    <p className={styles.bannerName}>{allTopArtists.find(artist => artist.id === selectedArtistId)?.name}</p>

                  </div>
                </div>
                <h3 className={styles.divTitle}>Popular</h3>

                <ol className={styles.trackList}>
                  {allArtistTopTracks.map(track => (
                    <li key={track.id}>

                      <ArtistTopTracks track={track} chooseTrack={chooseTrack} />
                      <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                    </li>
                  ))}
                </ol>
                {showPlaylistDropdown && (

                  <div className={styles.popUpOverlay}>
                    <div className={styles.popUpForm}>
                      <button className={styles.closeButton} onClick={closeDropdown}>
                        X
                      </button>
                      <h1>Add to your playlist</h1>
                      <div className={styles.playlistButton}>
                        {playlist.map(playlistItem => (
                          <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                        ))}

                      </div>

                    </div>
                  </div>
                )}
                <h3 className={styles.divTitle}>Discography</h3>
                <div className={styles.allSongDiv}>
                  {artistAlbums.map(album => (

                    <div className={styles.smallDiv} key={album.id} onClick={() => handleAllArtistAlbumClick(album)}>

                      <ArtistAlbum track={album} />
                    </div>

                  ))}

                </div>

              </div>
            )}


            {selectedTab === 'home' && (
              <div className={styles.newRelease} >
                <div>
                </div>
                <div className={styles.sectionTitle}>
                  <h4 className={styles.divTitle}>New Releases</h4>

                  <button onClick={() => handleTabClick('newRelease')} className={styles.show}> Show All </button>
                </div>

                <div className={styles.songDiv}>
                  {newRelease

                    .slice(0, 5)
                    .map((track) => (
                      <div >
                        <div>
                          <NewRelease track={track} key={track.uri} chooseTrack={chooseTrack} toggleDropdown={toggleDropdown} />

                        </div>
                      </div>
                    ))}
                  {showPlaylistDropdown && (

                    <div className={styles.popUpOverlay}>
                      <div className={styles.popUpForm}>
                        <button className={styles.closeButton} onClick={closeDropdown}>
                          X
                        </button>
                        <h1>Add to your playlist</h1>
                        <div className={styles.playlistButton}>
                          {playlist.map(playlistItem => (
                            <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                          ))}

                        </div>

                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.recent}>
                  <div className={styles.sectionTitle}>

                    <h4 className={styles.divTitle}>Recommended For You</h4>
                    <button onClick={() => handleTabClick('recommendations')} className={styles.show}> Show All </button>
                  </div>
                  <div className={styles.songDiv}>
                    {limitedRecommendations.map((track, index) => (
                      <div >
                        <RecentPlayed track={track} key={track.uri} chooseTrack={chooseTrack} toggleDropdown={toggleDropdown} />

                      </div>
                    ))}
                  </div>
                  {showPlaylistDropdown && (

                    <div className={styles.popUpOverlay}>
                      <div className={styles.popUpForm}>
                        <button className={styles.closeButton} onClick={closeDropdown}>
                          X
                        </button>
                        <h1>Add to your playlist</h1>
                        <div className={styles.playlistButton}>
                          {playlist.map(playlistItem => (
                            <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                          ))}

                        </div>

                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.recent}>
                  <div className={styles.sectionTitle}>

                    <h4 className={styles.divTitle}>Your Top Artists</h4>
                    <button onClick={() => handleTabClick('topArtists')} className={styles.show}> Show All </button>
                  </div>
                  <div className={styles.songDiv}>
                    {topArtists.map(artist => (
                      <div key={artist.id} onClick={() => handleArtistClick(artist)}>
                        <TopArt artist={artist} chooseTrack={chooseTrack} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.recent}>
                  <div className={styles.sectionTitle}>

                    <h4 className={styles.divTitle}>Your Top Tracks</h4>
                    <button onClick={() => handleTabClick('topTracks')} className={styles.show}> Show All </button>
                  </div>
                  <div className={styles.songDiv}>
                    {topTracks.map(tracks => (
                      <div >
                        <TopTracks tracks={tracks} chooseTrack={chooseTrack} toggleDropdown={toggleDropdown} />
                      </div>
                    ))}
                  </div>
                  {showPlaylistDropdown && (

                    <div className={styles.popUpOverlay}>
                      <div className={styles.popUpForm}>
                        <button className={styles.closeButton} onClick={closeDropdown}>
                          X
                        </button>
                        <h1>Add to your playlist</h1>
                        <div className={styles.playlistButton}>
                          {playlist.map(playlistItem => (
                            <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                          ))}

                        </div>

                      </div>
                    </div>
                  )}
                </div>



              </div>


            )}

            {selectedTab === 'search' && (
              <div className={styles.newRelease}>
                <div className={styles.search}>

                  <FiSearch className="search-icon" />


                  <input
                    type="search"
                    placeholder="What do you want to listen to?"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={styles.input}
                  />
                </div>

                <div className='popular_song' >
                  <div className={styles.searchBtn}>
                    <button
                      className={`tabSearch ${selectedTabSearch === 'song' ? 'active' : ''}`}
                      onClick={() => handleTabClickSearch('song')}

                    >
                      Songs
                    </button>
                    <button
                      className={`tabSearch ${selectedTabSearch === 'album' ? 'active' : ''} `}
                      onClick={() => handleTabClickSearch('album')}
                    >
                      Albums
                    </button>
                    <button
                      className={`tabSearch ${selectedTabSearch === 'artist' ? 'active' : ''} `}
                      onClick={() => handleTabClickSearch('artist')}
                    >
                      Artists
                    </button>
                  </div>

                  {selectedTabSearch === 'song' && (
                    <div>
                      <div className={styles.trackInfo}>
                        <div className={styles.innerTrack}>
                          <p style={{ marginLeft: '4px' }}>#</p>
                          <p style={{ marginLeft: '25px' }}>Title</p>
                        </div>
                        <p style={{ marginLeft: '90px' }}>Album</p>

                        <p style={{ marginRight: '127px' }}><BiTimeFive /></p>
                      </div>

                      <ol className={styles.trackList}>
                        {searchResults.map((track, index) => (
                          <li >
                            <TrackSearchResult
                              track={track}
                              key={track.uri}
                              chooseTrack={chooseTrack}
                            />
                            <button onClick={() => toggleDropdown(track.uri)} className={styles.addButton}><BiSolidPlaylist /></button>
                          </li>
                        ))}
                      </ol>
                      {showPlaylistDropdown && (
                        <div className={styles.popUpOverlay}>
                          <div className={styles.popUpForm}>
                            <button className={styles.closeButton} onClick={closeDropdown}>
                              X
                            </button>
                            <h1>Add to your playlist</h1>
                            <div className={styles.playlistButton}>
                              {playlist.map(playlistItem => (
                                <button key={playlistId.id} className={styles.addItemBtn} onClick={() => addItemToPlaylist(playlistItem.id, selectedTrackUri)}>{playlistItem.name}</button>
                              ))}

                            </div>

                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTabSearch === 'album' && (
                    <div className={styles.newRelease}>
                      <div className={styles.allSongDiv}>
                        {album.map((albumItem) => (
                          <div className={styles.smallDiv} key={albumItem.id} onClick={() => handleSearchAlbum(albumItem)}>
                            <SearchAlbum track={albumItem} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}



                  {selectedTabSearch === 'artist' && (
                    <div className={styles.newRelease}>
                      <div className={styles.allSongDiv}>
                        {Array.isArray(artist) && artist.map((artistItem) => (
                          <div className={styles.smallDiv} key={artistItem.id} onClick={() => handleSearchArtistClick(artistItem)}>
                            <SearchArtist track={artistItem} />
                          </div>
                        ))}

                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.botDiv}>
        <div className={styles.master_play}>
          <Player accessToken={accessToken} trackUri={playingTrack?.uri} spotifyApi={spotifyApi}/>
        </div>
      </div>
    </div >
  )
}
