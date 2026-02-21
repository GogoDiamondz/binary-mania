import React from 'react';
import { useNavigate } from "react-router-dom";

import './play.css';

export function Play() {
    const navigate = useNavigate();

    return (
        <main className="play-main">
            <div className="play-box">
                <h1>Choose Game Mode</h1>
                <button id='singleplayer' onClick={() => navigate('/game')}>
                    Singleplayer
                </button>
                <button id='multiplayer' onClick={() => navigate('/friends')}>
                    Multiplayer
                </button>
            </div>
        </main>
    );
}