import React from "react";

import "./game.css";

export function Game(props) {
    const userName = props.userName;
    const friendName = props.friendName
    const onGameEnd = props.onGameEnd;
    const gameOver = props.gameOver;
    const onTimeScoreChange = props.onTimeScoreChange;
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
        if (gameOver) return;
        if (tryAgain) {
            setGuess(digit);
            setTryAgain(false);
        } else {
            if (guess.length >= 8) return;
            setGuess(prev => prev + digit);
        }
    }

    function handleSubmit() {
        if (gameOver) return;
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

    // Singleplayer functionality
    React.useEffect(() => {
        if (friendName || gameOver) return;
        const interval = setInterval(() => {
            onTimeScoreChange(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [friendName, gameOver]);

    // Simulate friend winning after 10 seconds for demonstration purposes
    React.useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            onGameEnd(friendName);
        }, 10000);

        return () => clearInterval(interval);
    }, [gameOver, friendName, onGameEnd]);

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