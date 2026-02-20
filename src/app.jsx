import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Play } from './play/play';
import { Friends } from './friends/friends';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { AuthState } from './login/authState';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

    return (
    <BrowserRouter>
        <div className="body bg-dark text-light">
            <header>
                <h1>Binary Mania</h1>
                <nav>
                    <div><NavLink to="/">Home</NavLink></div>
                    {authState === AuthState.Authenticated && (
                        <div><NavLink to="/play">Play</NavLink></div>
                    )}
                    {authState === AuthState.Authenticated && (
                        <div><NavLink to="/friends">Friends</NavLink></div>
                    )}
                    {/* TODO: replace 'home' with 'profile' once logged in */}
                    <div><NavLink to="/profile">Profile</NavLink></div>
                </nav>
            </header>
            
            <Routes>
                <Route path="/" element={
                    <Login 
                        userName={userName}
                        authState={authState}
                        onAuthChange={(userName, authState) => {
                            setAuthState(authState);
                            setUserName(userName);
                        }}
                    />
                    } />
                <Route path="/play" element={<Play />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            <footer>
                <span className="text-reset">Hannah Heydorn</span>
                <a href="https://github.com/GogoDiamondz/binary-mania">GitHub</a>
            </footer>
        </div>
    </BrowserRouter>
    );
}

function NotFound() {
    return (
        <main className="container-fluid bg-secondary text-center">
            <div>404: Not Found</div>
        </main>
    );
}