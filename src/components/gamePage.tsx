import React from 'react';
import Game from './game';
import '../style/components/gamePage.scss';

export default function GamePage(): JSX.Element {
  return (
    <div className="game-page">
      <Game className="game-canvas" />
    </div>
  );
}
