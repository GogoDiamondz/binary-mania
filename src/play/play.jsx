import React from 'react';

import './play.css';

import { Game } from './game';
import { Players } from './players';

export function Play(props) {
  const userName = props.userName;
  const friendName = props.friendName || "[friend name goes here]"; // TODO: make multiplayer functionality linked from friends page
  const [gameOver, setGameOver] = React.useState(false);
  const [winner, setWinner] = React.useState(null);

  function handleGameEnd(winner) {
    setGameOver(true);
    setWinner(winner);
  }

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