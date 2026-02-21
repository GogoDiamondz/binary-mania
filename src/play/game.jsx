import React from "react";

import "./game.css";

export function Game() {
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
            <button id="submit">Submit</button>
        </div>
    )
}