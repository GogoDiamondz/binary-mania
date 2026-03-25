import React from 'react';
import { useNavigate } from "react-router-dom";

import './play.css';

async function handleSingleplayer(navigate) {
    try {
        await fetch('/api/game/start' , {
            method: 'POST'
        });
    }
    catch (err) {
        console.error(err);
    }
    navigate('/game');
}

export function Play() {
    const navigate = useNavigate();

    return (
        <main className="play-main">
            <div className="play-box">
                <h1>Choose Game Mode</h1>
                <button id='singleplayer' onClick={() => handleSingleplayer(navigate)}>
                    Singleplayer
                </button>
                <button id='multiplayer' onClick={() => navigate('/friends')}>
                    Multiplayer
                </button>
            </div>
        </main>
    );
}