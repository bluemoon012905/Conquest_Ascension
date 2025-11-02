
import React from 'react';
import Button from '../components/ui/Button';

function MainMenu({ setView }) {
  return (
    <div>
      <h1>Conquest Ascension</h1>
      <Button onClick={() => setView('LEVEL_SELECTION')}>Start Game</Button>
    </div>
  );
}

export default MainMenu;
