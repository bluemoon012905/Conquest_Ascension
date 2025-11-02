
import React from 'react';
import Button from '../components/ui/Button';

function LevelSelection({ setView }) {
  return (
    <div>
      <h1>Select a Level</h1>
      <Button>Tutorial</Button>
      <Button>Campaign</Button>
      <Button>Ascension</Button>
      <Button onClick={() => setView('GAME_VIEW')}>Demo</Button>
    </div>
  );
}

export default LevelSelection;
