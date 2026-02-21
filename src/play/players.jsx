import React from "react";

import './players.css';

export function Players(props) {
    const friendName = props.friendName;
    const gameOver = props.gameOver;
    const winner = props.winner;
    const timeRemaining = props.timeRemaining;
    
    return (
        <div>
            <div className="gameInfo">
                {friendName && (
                    <p> Friend: <span id="friend-name">{friendName}</span></p>
                )}
                {!friendName && (
                    <p> Time: {props.timeScore} </p>
                )}
            </div>
            {gameOver && (
                <div className="notification">
                    <span id="winner-text">{winner ? `${winner} won!` : ''}</span>
                </div>
            )}
        </div>
    )
}