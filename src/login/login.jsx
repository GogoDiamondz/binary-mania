import React from 'react';
import './login.css';

export function Login(props) {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function loginUser() {
    localStorage.setItem('userName', userName);
  }

  return (
    <main className="login-main">
      <div className="login-box">
        <h1>Welcome to Binary Mania</h1>
        <div>
          <input type="text" placeholder="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>
        <div>
            <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" onClick={() => loginUser()} disabled={!userName || !password}>Login</button>
      </div>
    </main>
  );
}