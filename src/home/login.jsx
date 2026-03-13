import React from 'react';
import './login.css';
import { MessageDialog } from './messageDialog';

export function Login(props) {
  const [userName, setUserName] = React.useState(props.userName || '');
  const [password, setPassword] = React.useState('');
  const [displayError, setDisplayError] = React.useState(null);

  async function registerUser() {
    const response = await fetch('/api/auth/create', {
      method: 'post',
      body: JSON.stringify({ userName: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  async function loginUser() {
    const response = await fetch('/api/auth/login', {
      method: 'post',
      body: JSON.stringify({ userName: userName, password: password }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response?.status === 200) {
      localStorage.setItem('userName', userName);
      props.onLogin(userName);
    } else {
      const body = await response.json();
      setDisplayError(`⚠ Error: ${body.msg}`);
    }
  }

  return (
    <main>
      <div className="login-box">
        <h1>Welcome to Binary Mania</h1>
        <div>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" onClick={() => registerUser()} disabled={!userName || !password}>Register</button>
        <button type="submit" onClick={() => loginUser()} disabled={!userName || !password}>Login</button>
      </div>
      <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
    </main>
  );
}