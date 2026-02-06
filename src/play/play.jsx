import React from 'react';
import './play.css';

export function Play() {
  return (
    <main className="play-main">
      <div className="players">
          <p> Friend: <span id="friend-name">[friend's username]</span></p>
      </div>
      <div hidden className="notification">
          <span id="winner-text">[player] won!</span>
      </div>
      <div className="game-container">
          <h1 id="hint">Higher / Lower</h1>
          <span id="input-container">
          <h2 className="input">00100100</h2>
          </span>
          <button-container>
              <button id="zero">0</button>
              <button id="one">1</button>
          </button-container>
      <button id="submit">Submit</button>
      </div>
    </main>
  );
}