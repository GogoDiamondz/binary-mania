import React from 'react';
import { useNavigate } from "react-router-dom";

import './profile.css';

export function Profile(props) {
  const navigate = useNavigate();
  const [bestTime, setBestTime] = React.useState(null);

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

  React.useEffect(() => {
    loadBestTime();
  }, []);

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
      <img src="duck.jpg" alt="duck" width="400px" />
      <div className="navigation-buttons">
        <button id="play" onClick={() => clickPlay()}>Play</button>
        <button id="friends" onClick={() => clickFriends()}>Friends</button>
      </div>
      <button id="logout" onClick={() => logout()}>Log Out</button>
  </main>
  );
}