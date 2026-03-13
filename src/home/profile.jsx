import React from 'react';
import { useNavigate } from "react-router-dom";

import './profile.css';

export function Profile(props) {
  const navigate = useNavigate();

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
      <p>Best Time: [best time]</p>
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