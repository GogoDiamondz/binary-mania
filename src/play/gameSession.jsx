import React from 'react';
import { useLocation } from "react-router-dom";

import './gameSession.css';

import { Game } from './game';
import { Players } from './players';

export function GameSession(props) {
  const location = useLocation();
  const userName = props.userName;
  const friendName = location.state?.friendName || 'placeholder friend';
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState(null);

  function handleGameEnd(winner) {
    setGameOver(true);
    setWinner(winner);
  }

  //TODO: add options for singleplayer or multiplayer
  return (
      <main className="play-main">
        <Players 
          friendName={friendName}
          winner={winner}
          gameOver={gameOver}
        />
        <Game
          userName={userName}
          friendName={friendName}
          gameOver={gameOver}
          onGameEnd={handleGameEnd}
        />
      </main>
  );
}