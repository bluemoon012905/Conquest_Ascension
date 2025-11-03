import React, { useMemo, useState } from 'react';
import Button from '../components/ui/Button';
import Board from '../components/board/Board';
import PieceSelection from '../components/ui/PieceSelection';
import EquipmentSelection from '../components/ui/EquipmentSelection';
import PieceRoster from '../components/ui/PieceRoster';

function GameView({ setView }) {
  const [gamePhase, setGamePhase] = useState('SETUP');
  const [currentPlayer, setCurrentPlayer] = useState('blue');
  const [history, setHistory] = useState([]);
  const [pieces, setPieces] = useState({});
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [winner, setWinner] = useState(null);

  const pieceArray = useMemo(() => Object.values(pieces), [pieces]);

  const handleStartGame = () => {
    setGamePhase('PLAYING');
    setSelectedPieceId(null);
    setHistory([]);
  };

  const handleEndTurn = () => {
    setCurrentPlayer((prev) => (prev === 'blue' ? 'red' : 'blue'));
    setHistory([]);
    setSelectedPieceId(null);
  };

  const handleUndo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length === 0) {
        return prevHistory;
      }

      const previousState = prevHistory[prevHistory.length - 1];
      setPieces(previousState);
      return prevHistory.slice(0, -1);
    });
  };

  const handleSetWinner = (player) => {
    setWinner(player);
  };

  const handleSelectPieceFromRoster = (pieceId) => {
    setSelectedPieceId(pieceId);
  };

  return (
    <div>
      <h1>Game View</h1>
      {winner && <h2>{winner} wins!</h2>}
      {gamePhase === 'PLAYING' && <h2>Current Player: {currentPlayer}</h2>}
      <div style={{ display: 'flex' }}>
        <Board
          currentPlayer={currentPlayer}
          history={history}
          setHistory={setHistory}
          setWinner={handleSetWinner}
          gamePhase={gamePhase}
          pieces={pieces}
          setPieces={setPieces}
          selectedPieceId={selectedPieceId}
          setSelectedPieceId={setSelectedPieceId}
        />
        {gamePhase === 'SETUP' && (
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '24px', gap: '24px' }}>
            <PieceSelection />
            <EquipmentSelection />
            <PieceRoster
              pieces={pieceArray}
              selectedPieceId={selectedPieceId}
              onSelectPiece={handleSelectPieceFromRoster}
            />
          </div>
        )}
      </div>
      {gamePhase === 'SETUP' ? (
        <div>
          <Button onClick={handleStartGame}>Start Game</Button>
          <Button onClick={() => setView('LEVEL_SELECTION')}>Back to Level Selection</Button>
        </div>
      ) : winner ? (
        <div>
          <Button
            onClick={() => {
              setWinner(null);
              setPieces({});
              setHistory([]);
              setSelectedPieceId(null);
              setGamePhase('SETUP');
            }}
          >
            Back to Demo Setup
          </Button>
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
