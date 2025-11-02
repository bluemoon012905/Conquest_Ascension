
import React from 'react';
import Button from '../components/ui/Button';

function GameView({ setView }) {
  return (
    <div>
      <h1>Game View</h1>
      <p>This is the game view.</p>
      <Button onClick={() => setView('MAIN_MENU')}>Back to Main Menu</Button>
    </div>
  );
}

export default GameView;
