
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Board from '../components/board/Board';
import PieceSelection from '../components/ui/PieceSelection';
import EquipmentSelection from '../components/ui/EquipmentSelection';

function GameView({ setView }) {
  const [currentPlayer, setCurrentPlayer] = useState('blue');
  const [history, setHistory] = useState([]);
  const [undo, setUndo] = useState(null);
  const [winner, setWinner] = useState(null);

  const handleEndTurn = () => {
    setCurrentPlayer(currentPlayer === 'blue' ? 'red' : 'blue');
    setHistory([]);
  };

  const handleUndo = () => {
    if (undo) {
      undo();
    }
  };

  const handleSetWinner = (player) => {
    setWinner(player);
  };

  return (
    <div>
      <h1>Game View</h1>
      {winner && <h2>{winner} wins!</h2>}
      <h2>Current Player: {currentPlayer}</h2>
      <div style={{ display: 'flex' }}>
        <Board currentPlayer={currentPlayer} onUndo={setUndo} history={history} setHistory={setHistory} setWinner={handleSetWinner} />
        <PieceSelection />
        <EquipmentSelection />
      </div>
      {winner ? (
        <div>
          <Button onClick={() => setView('LEVEL_SELECTION')}>Play Again</Button>
          <Button onClick={() => setView('MAIN_MENU')}>Main Menu</Button>
        </div>
      ) : (
        <div>
          <Button onClick={handleEndTurn}>Submit Moves</Button>
          <Button onClick={handleUndo}>Undo</Button>
          <Button onClick={() => setView('LEVEL_SELECTION')}>Back to Level Selection</Button>
        </div>
      )}
    </div>
  );
}

export default GameView;
