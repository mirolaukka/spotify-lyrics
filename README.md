# Spotify Lyrics Web App

This project is a web application that allows users to view the lyrics of the song they are currently listening to on Spotify. The application is built using Node.js and Express.js for the backend, and it utilizes the Spotify Web API and Genius Lyrics API to fetch and display the lyrics.

## Prerequisites

Before running the application, ensure that you have the following:

- Node.js installed on your machine.
- Spotify API credentials (Client ID and Client Secret) from the Spotify Developer Dashboard.
- Genius Lyrics API token from the Genius API Clients page.

## Getting Started

1. Clone the repository and navigate to the project directory.

2. Install the required Node.js packages by running the following command:
   ```
   npm install
   ```

3. Create a `.env` file in the root of the project and provide the necessary environment variables as shown below:

   ```
   CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID
   CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET
   REDIRECTURI2=YOUR_SPOTIFY_REDIRECT_URI
   SESSION_SECRET=YOUR_SESSION_SECRET
   GENIUS_API_KEY=YOUR_GENIUS_API_KEY
   PORT=YOUR_DESIRED_PORT_NUMBER
   ```

4. Start the application by running the command:
   ```
   npm start
   ```

5. Open your web browser and navigate to `http://localhost:PORT` (Replace `PORT` with the port number specified in the `.env` file).

## Features

- Login: Users can log in with their Spotify accounts to access their currently playing song.
- Logout: Users can log out of the application.
- Lyrics Display: When a user is logged in and listening to a song on Spotify, the application fetches and displays the lyrics of the currently playing song.
- Song Change: When the user switches to a different song, the lyrics automatically update to show the lyrics of the new song.

## How It Works

1. User logs in with their Spotify account by clicking the "Login" button.
2. The application redirects the user to the Spotify authentication page for authorization.
3. After authorization, the user is redirected back to the application with an access token.
4. The application uses the access token to access the user's Spotify data, including the currently playing song.
5. The application then fetches the lyrics of the currently playing song using the Genius Lyrics API.
6. The fetched lyrics are displayed on the web page.

## Contributing

If you would like to contribute to this project, feel free to open a pull request with your proposed changes or improvements.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use and modify the code as per the terms of the license.

## Acknowledgments

This project was created by Miro Laukka as a showcase of their skills and understanding of web development using Node.js and the Spotify Web API.

