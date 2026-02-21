import React from 'react';

import './play.css';

import { Game } from './game';
import { Players } from './players';

export function Play(props) {
  return (
      <main className="play-main">
        <Players/>
        <Game/>
      </main>
  );
}