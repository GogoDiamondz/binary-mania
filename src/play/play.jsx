import React from 'react';
import { useNavigate } from "react-router-dom";

import './play.css';

export function Play() {
    const navigate = useNavigate();

    return (
        <main className="play-main">
            <button onClick={() => navigate('/game')}>
                Singleplayer
            </button>
            <button onClick={() => navigate('/friends')}>
                Multiplayer
            </button>
        </main>
    );
}