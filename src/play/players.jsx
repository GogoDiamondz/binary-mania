import React from "react";

import './players.css';

export function Players() {
    return (
        <div>
        <div className="players">
              <p> Friend: <span id="friend-name">[friend's username]</span></p>
          </div>
          <div hidden className="notification">
              <span id="winner-text">[player] won!</span>
          </div>
        </div>
    )
}