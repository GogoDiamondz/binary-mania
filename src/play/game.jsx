import React from "react";

import "./game.css";

export function Game(props) {
    const userName = props.userName;
    const friendName = props.friendName
    const onGameEnd = props.onGameEnd;

    return (
        <div className="game-container">
            <h1 id="hint">Higher / Lower</h1>
            <span id="input-container">
            <h2 className="input">00100100</h2>
            </span>
            <button-container>
                <button id="zero">0</button>
                <button id="one">1</button>
            </button-container>
            {/* FIXME change functionality -- this is a test */}
            <button id="submit" onClick={() => props.onGameEnd(userName)}>Submit</button>
        </div>
    )
}