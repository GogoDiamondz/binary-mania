import React from "react";
import { useNavigate } from "react-router-dom";

import "./game.css";
import { useWebSocket } from "../hooks/useWebSocket.js";

export function Game(props) {
    const navigate = useNavigate();
    const userName = props.userName;
    const friendName = props.friendName;
    const secretNumber = props.secretNumber;
    const onGameEnd = props.onGameEnd;
    const gameOver = props.gameOver;
    const onTimeScoreChange = props.onTimeScoreChange;
    const { isConnected, messages, sendMessage } = useWebSocket(userName);
    const [target, setTarget] = React.useState(0);
    const [hint, setHint] = React.useState("");
    const [hintClass, setHintClass] = React.useState("");
    const [guess, setGuess] = React.useState("");
    const [tryAgain, setTryAgain] = React.useState(false);

    // Initialize secret number
    React.useEffect(() => {
        // If multiplayer and secretNumber is provided from WebSocket, use it
        if (friendName && secretNumber) {
            setTarget(secretNumber);
            console.log(`Target number (multiplayer): ${secretNumber}`);
            console.log(`Binary: ${secretNumber.toString(2)}`);
        } else {
            // Single player: generate random number
            const randomNum = Math.floor(Math.random() * 256);
            setTarget(randomNum);
            console.log(`Target number (singleplayer): ${randomNum}`);
            console.log(`Binary: ${randomNum.toString(2)}`);
        }
    }, [friendName, secretNumber]);

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
            setHintClass("flash-lower");
        } else if (guessDecimal < target) {
            setHint("Higher");
            setHintClass("flash-higher");
        } else {
            setHint("Nailed it.");
            setHintClass("");
            onGameEnd(userName);
            
            // Notify opponent of game over in multiplayer
            if (friendName) {
                sendMessage({
                    type: 'game-over',
                    from: userName,
                    targetUser: friendName,
                });
            }
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
    }, [friendName, gameOver, onTimeScoreChange]);

    // Clear animation class after animation completes so it can be reapplied
    React.useEffect(() => {
        if (hintClass) {
            const timeout = setTimeout(() => {
                setHintClass("");
            }, 600); // Match the animation duration
            return () => clearTimeout(timeout);
        }
    }, [hintClass]);

    // Handle incoming messages from opponent
    React.useEffect(() => {
        if (messages.length > 0 && friendName && !gameOver) {
            messages.forEach(message => {
                if (message.type === 'game-over' && message.from === friendName) {
                    console.log(`Opponent ${friendName} won!`);
                    onGameEnd(friendName);
                }
            });
        }
    }, [messages, friendName, gameOver, onGameEnd]);


    return (
        <div className="game-container">
            <h1 id="hint" className={hintClass}>{hint || (gameOver ? "Game Over" : "Guess up to 8 digits")}</h1>
            <span id="input-container">
            <h2 className="input">{guess}</h2>
            </span>
            <button-container>
                <button id="zero" onClick={() => handleBinaryClick("0")}>0</button>
                <button id="one" onClick={() => handleBinaryClick("1")}>1</button>
            </button-container>
            {guess && !gameOver && <button id="submit" onClick={handleSubmit}>Submit</button>}
            {gameOver &&
                <div className="game-over-buttons">
                    <button id="home" onClick={() => navigate("/")}>Home</button>
                    {!friendName && <button id="play-again" onClick={() => window.location.reload()}>Retry</button>}
                </div>
            }
        </div>
    )
}