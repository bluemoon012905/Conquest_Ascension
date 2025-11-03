
import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Board from '../components/board/Board';
import PieceSelection from '../components/ui/PieceSelection';
import EquipmentSelection from '../components/ui/EquipmentSelection';

function GameView({ setView }) {
  const [gamePhase, setGamePhase] = useState('SETUP'); // 'SETUP' or 'PLAYING'
  const [currentPlayer, setCurrentPlayer] = useState('blue');
  const [history, setHistory] = useState([]);
  const [undo, setUndo] = useState(null);
  const [winner, setWinner] = useState(null);

  const handleStartGame = () => {
    setGamePhase('PLAYING');
  };

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
      {gamePhase === 'PLAYING' && <h2>Current Player: {currentPlayer}</h2>}
      <div style={{ display: 'flex' }}>
        <Board
          currentPlayer={currentPlayer}
          onUndo={setUndo}
          history={history}
          setHistory={setHistory}
          setWinner={handleSetWinner}
          gamePhase={gamePhase} // Pass gamePhase to Board
        />
        {gamePhase === 'SETUP' && (
          <>
            <PieceSelection />
            <EquipmentSelection />
          </>
        )}
      </div>
      {gamePhase === 'SETUP' ? (
        <div>
          <Button onClick={handleStartGame}>Start Game</Button>
          <Button onClick={() => setView('LEVEL_SELECTION')}>Back to Level Selection</Button>
        </div>
      ) : (
        winner ? (
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
        )
      )}
    </div>
  );
}

export default GameView;
