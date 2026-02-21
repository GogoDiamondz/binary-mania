import React from 'react';
import { useNavigate } from "react-router-dom";

import './play.css';

export function Play() {
    const navigate = useNavigate();

    return (
        <main className="play-main">
            <button onClick={() => console.log('Singleplayer button clicked!')}>
                Singleplayer
            </button>
            <button onClick={() => navigate('/friends')}>
                Multiplayer
            </button>
        </main>
    );
}