import React, { useState } from 'react';
import Square from './Square';
import './Board.css';

const Board = ({ currentPlayer, onUndo, history, setHistory, setWinner }) => {
  const [pieces, setPieces] = useState({});
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [possibleAttacks, setPossibleAttacks] = useState([]);

  const handlePieceClick = (piece) => {
    if (piece.player !== currentPlayer) {
      return;
    }
    setSelectedPiece(piece);
    // Dummy data for possible moves
    const moves = [];
    for (let i = 1; i < 3; i++) {
      moves.push({ x: piece.x + i, y: piece.y });
      moves.push({ x: piece.x - i, y: piece.y });
      moves.push({ x: piece.x, y: piece.y + i });
      moves.push({ x: piece.x, y: piece.y - i });
    }
    setPossibleMoves(moves);

    // Dummy data for possible attacks
    const attacks = [];
    attacks.push({ x: piece.x + 1, y: piece.y + 1 });
    attacks.push({ x: piece.x - 1, y: piece.y - 1 });
    setPossibleAttacks(attacks);
  };

  const handleDrop = (item, to) => {
    if (item.player !== currentPlayer) {
      return;
    }

    const isPossibleMove = possibleMoves.some(move => move.x === to.x && move.y === to.y);
    const isPossibleAttack = possibleAttacks.some(attack => attack.x === to.x && attack.y === to.y);

    if (isPossibleMove && isPossibleAttack) {
      if (window.confirm('Attack?')) {
        // Attack
        console.log('Attacking!');
      } else {
        // Move
        console.log('Moving!');
      }
    } else if (isPossibleAttack) {
      // Attack
      console.log('Attacking!');
    } else if (isPossibleMove) {
      // Move
      console.log('Moving!');
    }

    setHistory([...history, pieces]);

    const targetPiece = pieces[`${to.x},${to.y}`];
    if (targetPiece && targetPiece.player !== item.player) {
      console.log('Combat!');
      setPieces(prevPieces => {
        const newPieces = { ...prevPieces };
        const defender = newPieces[`${to.x},${to.y}`];
        defender.health -= 1;
        if (defender.health <= 0) {
          delete newPieces[`${to.x},${to.y}`];
        }

        const remainingOpponentPieces = Object.values(newPieces).filter(p => p.player !== currentPlayer);
        if (remainingOpponentPieces.length === 0) {
          setWinner(currentPlayer);
        }

        return newPieces;
      });
      return;
    }
      const pieceToMove = Object.values(newPieces).find(p => p.id === item.id);

      if (pieceToMove) {
        // Moving an existing piece
        const fromKey = `${pieceToMove.x},${pieceToMove.y}`;
        delete newPieces[fromKey];
        pieceToMove.x = to.x;
        pieceToMove.y = to.y;
        newPieces[`${to.x},${to.y}`] = pieceToMove;
      } else {
        // Adding a new piece from the selection
        const newPiece = { ...item, x: to.x, y: to.y, equipment: [] };
        newPieces[`${to.x},${to.y}`] = newPiece;
      }

      return newPieces;
    });
    setSelectedPiece(null);
    setPossibleMoves([]);
    setPossibleAttacks([]);
  };

  const handleDropEquipment = (equipment, piece) => {
    if (piece.player !== currentPlayer) {
      return;
    }

    setHistory([...history, pieces]);

    setPieces(prevPieces => {
      const newPieces = { ...prevPieces };
      const targetPiece = Object.values(newPieces).find(p => p.id === piece.id);
      if (targetPiece) {
        targetPiece.equipment.push(equipment);
      }
      return newPieces;
    });
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setPieces(lastState);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  React.useEffect(() => {
    onUndo(handleUndo);
  }, [handleUndo]);

  const renderSquare = (i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';
    const piece = pieces[`${x},${y}`];
    const isPossibleMove = possibleMoves.some(move => move.x === x && move.y === y);
    const isPossibleAttack = possibleAttacks.some(attack => attack.x === x && attack.y === y);

    return (
      <Square
        key={i}
        x={x}
        y={y}
        onDrop={handleDrop}
        onDropEquipment={handleDropEquipment}
        piece={piece}
        colorClass={colorClass}
        currentPlayer={currentPlayer}
        onPieceClick={handlePieceClick}
        isPossibleMove={isPossibleMove}
        isPossibleAttack={isPossibleAttack}
      />
    );
  };

export default Board;
