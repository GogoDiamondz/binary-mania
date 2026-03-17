import React from 'react';
import { useNavigate } from "react-router-dom";

import './profile.css';

export function Profile(props) {
  const navigate = useNavigate();
  const [bestTime, setBestTime] = React.useState(null);
  const [duckImageUrl, setDuckImageUrl] = React.useState('../../public/duck.jpg');

  React.useEffect(() => {
    loadBestTime();
    loadDuckImage().then(url => setDuckImageUrl(url));
  }, []);

  async function loadBestTime() {
    try {
      const scoreRes = await fetch('/api/singleplayer/score');
      if (!scoreRes.ok) throw new Error(`Failed to load best time (${scoreRes.status})`);
      const scoreData = await scoreRes.json();
      setBestTime(scoreData.bestTime);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadDuckImage() {
    try {
      const duckRes = await fetch('/api/duck');
      if (!duckRes.ok) throw new Error(`Failed to load duck image (${duckRes.status})`);
      const duckData = await duckRes.json();
      return duckData.url;
    } catch (err) {
      console.error(err);
      return '../../public/duck.jpg'; // Fallback image
    }
  }

  function clickPlay() {
    navigate("/play");
  }

  function clickFriends() {
    navigate("/friends");
  }

  function logout() {
    fetch('/api/auth/logout', {
      method: 'delete',
    }).then(() => {
      localStorage.removeItem('userName');
      props.onLogout();
    });
  }

  return (
      <main className="profile-main">
      <h1>{props.userName}'s Profile</h1>
      <p>Best Time: {bestTime}</p>
      {/* Random image of a duck, replace with 3rd party API duck image */}
      <img src={duckImageUrl} alt="duck" width="400px" />
      <div className="navigation-buttons">
        <button id="play" onClick={() => clickPlay()}>Play</button>
        <button id="friends" onClick={() => clickFriends()}>Friends</button>
      </div>
      <button id="logout" onClick={() => logout()}>Log Out</button>
  </main>
  );
}