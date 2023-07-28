"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
const SpotifyWebApi = require("spotify-web-api-node");
const geniusLyricsApi = require("genius-lyrics-api");
const opn = require("opn");
const {
    v4: uuidv4
} = require("uuid");
require("dotenv").config();

const app = express();
const router = express.Router();

const scopes = ["user-read-playback-state"];
const state = "spotify_auth_state";
const port = process.env.PORT;

// Set up Spotify API
const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDRIECTURI2,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
});

// Create the authentication URL for Spotify
const authUrl = spotifyApi.createAuthorizeURL(scopes, state);

// Set up the Express session
app.use(
    session({
        genid: function (req) {
            return uuidv4();
        },
        resave: true,
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET,
        cookie: {},
    })
);

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

// Route for login, redirects to Spotify authentication URL
app.use("/login", (req, res) => {
    res.redirect(authUrl);
});

// Route for logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    console.log("Logged out");
    res.redirect("/?logout=1");
});

// Route for Spotify callback
app.get("/callback", function (req, res) {
    let code = req.query["code"];

    spotifyApi
        .authorizationCodeGrant(code)
        .then(function (data) {
            req.session["access_token"] = data.body["access_token"];
            req.session["refresh_token"] = data.body["refresh_token"];

            res.redirect("/?id=" + encodeURIComponent(req.session.id));
        })
        .catch(function (err) {
            console.log("Something went wrong!", err);
        });
});

// Start the server and listen for requests
app.listen(port, function () {
    console.log(`API running on port ${port}`);
});

// Route for getting lyrics
app.get("/getlyrics", function (req, res) {
    let id = req.session.id;
    spotifyApi.setAccessToken(req.session["access_token"]);
    spotifyApi.setRefreshToken(req.session["refresh_token"]);
    spotifyApi
        .getMyCurrentPlaybackState()
        .then(function (data) {
            let temp = getSongArtist(data.body);
            let name = temp[0],
                artist = temp[1];
            const options = {
                apiKey: process.env.GENIUS_API_KEY,
                title: name,
                artist: artist,
                optimizeQuery: true,
            };
            geniusLyricsApi
                .getLyrics(options)
                .then((lyrics) => {
                    if (lyrics == null) {
                        res.json({
                            status: "404",
                            message: "Lyrics not found",
                            artist: artist,
                            songName: name,
                        });
                    } else {
                        lyrics = lyrics.replace(/(?:\r\n|\r|\n)/g, "<br/>");
                        res.json({
                            status: "200",
                            message: "Successful",
                            lyrics: lyrics,
                            artist: artist,
                            songName: name,
                        });
                    }
                })
                .catch((err) => {
                    res.json({
                        status: "500",
                        message: "Something went wrong"
                    });
                });
        })
        .catch((err) => res.json({
            status: "502",
            message: "Couldn't get playback"
        }));
});

// Route for serving the index.html file
app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

// Helper function to get song and artist names from Spotify data
function getSongArtist(body) {
    let name = body.item.name;
    let artist = body.item.artists["0"].name;
    return [name, artist];
}