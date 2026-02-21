import React from 'react';
import { useLocation } from "react-router-dom";

import './gameSession.css';

import { Game } from './game';
import { Players } from './players';

export function GameSession(props) {
  const location = useLocation();
  const userName = props.userName;
  const friendName = location.state?.friendName || null;
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState(null);
  const [timeScore, setTimeScore] = React.useState(null);

  function handleGameEnd(winner) {
    setGameOver(true);
    if (friendName) {
      setWinner(winner);
    }
  }

  function handleTimeScore(score) {
    setTimeScore(score);
  }

  return (
      <main className="gameSession-main">
        <Players 
          friendName={friendName}
          winner={winner}
          gameOver={gameOver}
          timeScore={timeScore}
        />
        <Game
          userName={userName}
          friendName={friendName}
          gameOver={gameOver}
          onGameEnd={handleGameEnd}
          onTimeScoreChange={handleTimeScore}
        />
      </main>
  );
}