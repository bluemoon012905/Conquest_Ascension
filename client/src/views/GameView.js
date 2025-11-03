
import React from 'react';
import Button from '../components/ui/Button';
import Board from '../components/board/Board';

function GameView({ setView }) {
  return (
    <div>
      <h1>Game View</h1>
      <Board />
      <Button onClick={() => setView('MAIN_MENU')}>Back to Main Menu</Button>
    </div>
  );
}

export default GameView;
