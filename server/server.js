require("dotenv").config()
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

const spotifyWebApi = require('spotify-web-api-node');
const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken;
    
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://bluesoundvibe.com',
        clientId: '8e48633bb519433c82873afba9fa6d03',
        clientSecret: 'be7969f681874ca7b30c9806da088725',
        refreshToken
    })
    spotifyApi
    .refreshAccessToken()
    .then(data => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn
            })
        })
        .catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
    })
    app.post('/api/login', (req, res) => {
        const code = req.body.code;
        const spotifyApi = new spotifyWebApi({
            redirectUri: 'http://bluesoundvibe.com',
            clientId: '8e48633bb519433c82873afba9fa6d03',
            clientSecret: 'be7969f681874ca7b30c9806da088725',
        })
        
        spotifyApi.authorizationCodeGrant(code).then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        })
    })
    
    
    


app.listen(port, () => console.log(`Listening on port: ${port}`));
