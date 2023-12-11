import React, { useState, useEffect } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import './styles/index.css';

const App = () => {
  const [videoId, setVideoId] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch saved YouTube videos from the server
    axios.get('https://provoke-assignment.onrender.com/api/videos').then((response) => {
      setSavedVideos(response.data.videos);
    });
  }, []);

  const searchVideo = async () => {
    setLoading(true);
    try {
      // Fetch video details using YouTube Data API
      const response = await axios.get(`https://provoke-assignment.onrender.com/api/videos/${videoId}`);
      const videoDetails = response.data.videoDetails;

      setSearchResults([...searchResults, { videoId, details: videoDetails }]);
    } catch (error) {
      console.error('Error searching video:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveVideo = async () => {
    // Save YouTube video ID to the server
    await axios.post('https://provoke-assignment.onrender.com/api/videos', { videoId });

    // Reset the input field after saving
    setVideoId('');
    // Fetch updated saved videos
    const response = await axios.get('https://provoke-assignment.onrender.com/api/videos');
    setSavedVideos(response.data.videos);
  };

  return (
    <div className="container">
      <h1>YouTube Video Player</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter YouTube Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <button
          className="button"
          onClick={searchVideo}
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button
          className="button"
          onClick={saveVideo}
          disabled={!videoId || loading}
        >
          Save
        </button>
      </div>
      <div>
        <h2>Search Results</h2>
        {searchResults.map((v) => (
          <div key={v.videoId} className="video-item">
            <div className="video-player">
              <YouTube videoId={v.videoId} />
            </div>
            {v.details && (
              <div className="video-details">
                <h3>{v.details.snippet.title}</h3>
                <p>{v.details.snippet.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2>Saved Videos</h2>
        {savedVideos.map((v) => (
          <div key={v.videoId} className="video-item">
            <div className="video-player">
              <YouTube videoId={v.videoId} />
            </div>
            {v.details && (
              <div className="video-details">
                <h3>{v.details.snippet.title}</h3>
                <p>{v.details.snippet.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default App;
