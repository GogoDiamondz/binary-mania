import React from 'react';

import './profile.css';

export function Profile({ userName, onLogout }) {

  function logout() {
    localStorage.removeItem('userName');
    onLogout();
  }

  return (
      <main className="profile-main">
      <h1>{userName}'s Profile</h1>
      <p>Best Time: [best time]</p>
      {/* Random image of a duck, replace with 3rd party API duck image */}
      <img src="duck.jpg" alt="duck" width="400px" />
      <button id="logout" onClick={() => logout()}>Log Out</button>
  </main>
  );
}