import React from 'react';
import './login.css';

export function Login() {
  return (
    <main className="login-main">
      <div className="login-box">
          <h1>Welcome to Binary Mania</h1>
          <form method="get" action="play.html">
              <div className="form-group">
                  <input type="text" placeholder="username"></input>
              </div>
              <div>
                  <input type="password" placeholder="password"></input>
              </div>
              <button type="submit">Play</button>
          </form>
      </div>
    </main>
  );
}