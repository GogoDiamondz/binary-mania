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
  const [timeScore, setTimeScore] = React.useState(0);
  const [bestTime, setBestTime] = React.useState(null);

  React.useEffect(() => {
    async function loadBestTime() {
      try {
        const userRes = await fetch('/api/user');
        if (!userRes.ok) throw new Error(`Failed to load user (${userRes.status})`);
        const userData = await userRes.json();
        setBestTime(userData.bestTime === 'None' ? null : Number(userData.bestTime));
      } catch (err) {
        console.error(err);
      }
    }

    loadBestTime();
  }, []);

  async function updateBestTimeIfLower(score) {
    const currentBest = bestTime == null ? Infinity : bestTime;
    if (score < currentBest) {
      setBestTime(score);
      try {
        await fetch('/api/singleplayer/score', {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ bestTime: score })
        });
      } catch (err) {
        console.error('Failed to save best time', err);
      }
    }
  }

  async function updateMultiplayerScore(winner) {
    try {
      await fetch('/api/multiplayer/score', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ friendName, winner: winner === userName ? 'user' : 'friend' })
      });
    }
    catch (err) {
      console.error('Failed to update multiplayer score', err);
    }
  }

  function handleGameEnd(winner) {
    setGameOver(true);

    if (friendName) {
      setWinner(winner);
      updateMultiplayerScore(winner);
    } else {
      updateBestTimeIfLower(timeScore);
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