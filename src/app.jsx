import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return <div className="body bg-dark text-light">
            <header>
                <h1>Binary Mania</h1>
                <nav>
                    <div><a href="index.html">Home</a></div>
                    <div><a href="play.html">Play</a></div>
                    <div><a href="friends.html">Friends</a></div>
                    <div><a href="profile.html">Profile</a></div>
                </nav>
            </header>
            
            <main>
                App components go here
            </main>

            <footer>
                <span className="text-reset">Hannah Heydorn</span>
                <a href="https://github.com/GogoDiamondz/binary-mania">GitHub</a>
            </footer>
        </div>;
}