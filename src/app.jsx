import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Play } from './play/play';
import { Friends } from './friends/friends';
import { Profile } from './profile/profile';
import { Login } from './login/login';

export default function App() {
    return (
    <BrowserRouter>
        <div className="body bg-dark text-light">
            <header>
                <h1>Binary Mania</h1>
                <nav>
                    <div><NavLink to="/">Home</NavLink></div>
                    <div><NavLink to="/play">Play</NavLink></div>
                    <div><NavLink to="/friends">Friends</NavLink></div>
                    <div><NavLink to="/profile">Profile</NavLink></div>
                </nav>
            </header>
            
            <Routes>
                <Route path="/" element={<Login />} />
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