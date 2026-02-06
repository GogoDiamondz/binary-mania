import React from 'react';
import './profile.css';

export function Profile() {
  return (
      <main className="profile-main">
      <h1>[Username]'s Profile</h1>
      <p>Best Time: [best time]</p>
      {/* Random image of a duck, replace with 3rd party API duck image */}
      <img src="duck.jpg" alt="duck" width="400px" />
      <button id="logout">Log Out</button>
  </main>
  );
}