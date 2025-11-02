
import React from 'react';
import Button from '../components/ui/Button';

function MainMenu() {
  const handleStartGame = () => {
    console.log('Start Game clicked');
  };

  const handleDemo = () => {
    console.log('Demo clicked');
  };

  return (
    <div>
      <h1>Conquest Ascension</h1>
      <Button onClick={handleStartGame}>Start Game</Button>
      <Button>Tutorial</Button>
      <Button>Campaign</Button>
      <Button>Ascension</Button>
      <Button onClick={handleDemo}>Demo</Button>
    </div>
  );
}

export default MainMenu;
