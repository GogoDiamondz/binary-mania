import React from "react";

import './players.css';

export function Players(props) {
    const friendName = props.friendName;
    const gameOver = props.gameOver;
    const winner = props.winner;
    
    return (
        <div>
            <div className="players">
                <p> Friend: <span id="friend-name">{friendName}</span></p>
            </div>
            {gameOver && (
                <div className="notification">
                    <span id="winner-text">{winner ? `${winner} won!` : ''}</span>
                </div>
            )}
        </div>
    )
}