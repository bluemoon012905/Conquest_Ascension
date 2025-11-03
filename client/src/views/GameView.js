
import React from 'react';
import Button from '../components/ui/Button';
import Board from '../components/board/Board';
import PieceSelection from '../components/ui/PieceSelection';

import EquipmentSelection from '../components/ui/EquipmentSelection';

function GameView({ setView }) {
  return (
    <div>
      <h1>Game View</h1>
      <div style={{ display: 'flex' }}>
        <Board />
        <PieceSelection />
        <EquipmentSelection />
      </div>
      <Button onClick={() => setView('LEVEL_SELECTION')}>Back to Level Selection</Button>
    </div>
  );
}

export default GameView;
