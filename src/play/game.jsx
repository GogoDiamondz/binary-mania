import React from "react";

import "./game.css";

export function Game(props) {
    const userName = props.userName;
    const friendName = props.friendName
    const onGameEnd = props.onGameEnd;
    const [target, setTarget] = React.useState(0);
    const [hint, setHint] = React.useState("");
    const [guess, setGuess] = React.useState("");
    const [tryAgain, setTryAgain] = React.useState(false);

    React.useEffect(() => {
        const randomNum = Math.floor(Math.random() * 256);
        setTarget(randomNum);
        console.log(`Target number: ${randomNum}`);
        console.log(`Binary: ${randomNum.toString(2)}`);
    }, []);

    function handleBinaryClick(digit) {
        if (tryAgain) {
            setGuess(digit);
            setTryAgain(false);
        } else {
            if (guess.length >= 8) return;
            setGuess(prev => prev + digit);
        }
    }

    function handleSubmit() {
        if (!guess) return;

        const guessDecimal = parseInt(guess, 2);

        if (guessDecimal > target) {
            setHint("Lower");
        } else if (guessDecimal < target) {
            setHint("Higher");
        } else {
            console.log("nailed it.");
            onGameEnd(userName);
        }
        setTryAgain(true);
    }

    return (
        <div className="game-container">
            <h1 id="hint">{hint || "Guess up to 8 digits"}</h1>
            <span id="input-container">
            <h2 className="input">{guess}</h2>
            </span>
            <button-container>
                <button id="zero" onClick={() => handleBinaryClick("0")}>0</button>
                <button id="one" onClick={() => handleBinaryClick("1")}>1</button>
            </button-container>
            <button id="submit" onClick={handleSubmit}>Submit</button>
        </div>
    )
}