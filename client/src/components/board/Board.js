import React, { useState, useEffect, useCallback } from 'react';
import Square from './Square';
import './Board.css';
import { pieces as pieceDefinitions } from '../../../../shared/game-rules/pieces';

const BOARD_SIZE = 8;

const cloneBoardState = (state) => JSON.parse(JSON.stringify(state));

const Board = ({ currentPlayer, onUndo, history, setHistory, setWinner, gamePhase }) => {
  const [boardPieces, setBoardPieces] = useState({});
  const [selectedPieceId, setSelectedPieceId] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [possibleAttacks, setPossibleAttacks] = useState([]);

  const handlePieceClick = (piece) => {
    if (gamePhase === 'SETUP') {
      return;
    }

    if (piece.player !== currentPlayer) {
      return;
    }

    setSelectedPieceId(piece.id);

    const moves = [];
    for (let i = 1; i < 3; i++) {
      moves.push({ x: piece.x + i, y: piece.y });
      moves.push({ x: piece.x - i, y: piece.y });
      moves.push({ x: piece.x, y: piece.y + i });
      moves.push({ x: piece.x, y: piece.y - i });
    }
    setPossibleMoves(moves);

    const attacks = [];
    attacks.push({ x: piece.x + 1, y: piece.y + 1 });
    attacks.push({ x: piece.x - 1, y: piece.y - 1 });
    setPossibleAttacks(attacks);
  };

  const placeNewPiece = (item, to) => {
    const definition = pieceDefinitions[item.type] || {};
    const uniqueId = `${item.type}-${item.player}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    setBoardPieces((prevPieces) => {
      const newPieces = { ...prevPieces };
      newPieces[`${to.x},${to.y}`] = {
        id: uniqueId,
        type: item.type,
        player: item.player,
        x: to.x,
        y: to.y,
        equipment: [],
        health: definition.health ?? 10,
      };
      return newPieces;
    });
  };

  const repositionExistingPiece = (item, to) => {
    setBoardPieces((prevPieces) => {
      const newPieces = { ...prevPieces };
      const entry = Object.entries(newPieces).find(([, piece]) => piece.id === item.id);

      if (!entry) {
        return prevPieces;
      }

      const [fromKey, piece] = entry;
      const updatedPiece = { ...piece, x: to.x, y: to.y };
      delete newPieces[fromKey];
      newPieces[`${to.x},${to.y}`] = updatedPiece;
      return newPieces;
    });
  };

  const handleDrop = (item, to) => {
    if (gamePhase === 'SETUP') {
      if (item.source === 'board') {
        repositionExistingPiece(item, to);
      } else {
        placeNewPiece(item, to);
      }
      return;
    }

    if (item.player !== currentPlayer) {
      return;
    }

    const isPossibleMove = possibleMoves.some((move) => move.x === to.x && move.y === to.y);
    const isPossibleAttack = possibleAttacks.some((attack) => attack.x === to.x && attack.y === to.y);

    if (!isPossibleMove && !isPossibleAttack) {
      return;
    }

    setHistory((prevHistory) => [...prevHistory, cloneBoardState(boardPieces)]);

    const targetPiece = boardPieces[`${to.x},${to.y}`];

    if (isPossibleAttack && targetPiece && targetPiece.player !== item.player) {
      setBoardPieces((prevPieces) => {
        const newPieces = { ...prevPieces };
        const defenderKey = `${to.x},${to.y}`;
        const defender = newPieces[defenderKey];

        if (defender) {
          const updatedDefender = { ...defender, health: (defender.health ?? 0) - 1 };
          if (updatedDefender.health <= 0) {
            delete newPieces[defenderKey];
          } else {
            newPieces[defenderKey] = updatedDefender;
          }
        }

        const remainingOpponentPieces = Object.values(newPieces).filter((p) => p.player !== currentPlayer);
        if (remainingOpponentPieces.length === 0) {
          setWinner(currentPlayer);
        }

        return newPieces;
      });

      setSelectedPieceId(null);
      setPossibleMoves([]);
      setPossibleAttacks([]);
      return;
    }

    if (isPossibleMove) {
      setBoardPieces((prevPieces) => {
        const newPieces = { ...prevPieces };
        const entry = Object.entries(newPieces).find(([, piece]) => piece.id === item.id);

        if (!entry) {
          return prevPieces;
        }

        const [fromKey, piece] = entry;
        const updatedPiece = { ...piece, x: to.x, y: to.y };
        delete newPieces[fromKey];
        newPieces[`${to.x},${to.y}`] = updatedPiece;
        return newPieces;
      });
    }

    setSelectedPieceId(null);
    setPossibleMoves([]);
    setPossibleAttacks([]);
  };

  const handleDropEquipment = (equipment, piece) => {
    if (gamePhase !== 'SETUP' && piece.player !== currentPlayer) {
      return;
    }

    setHistory((prevHistory) => [...prevHistory, cloneBoardState(boardPieces)]);

    setBoardPieces((prevPieces) => {
      const newPieces = { ...prevPieces };
      const entry = Object.entries(newPieces).find(([, candidate]) => candidate.id === piece.id);

      if (!entry) {
        return prevPieces;
      }

      const [key, targetPiece] = entry;
      const updatedEquipment = [...(targetPiece.equipment || []), equipment];
      const updatedPiece = { ...targetPiece, equipment: updatedEquipment };
      newPieces[key] = updatedPiece;
      return newPieces;
    });
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) {
      return;
    }

    const lastState = history[history.length - 1];
    setBoardPieces(lastState);
    setHistory(history.slice(0, -1));
    setSelectedPieceId(null);
    setPossibleMoves([]);
    setPossibleAttacks([]);
  }, [history, setHistory]);

  useEffect(() => {
    onUndo(() => handleUndo());
  }, [onUndo, handleUndo]);

  const renderSquare = (index) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';
    const piece = boardPieces[`${x},${y}`];
    const isPossibleMove = possibleMoves.some((move) => move.x === x && move.y === y);
    const isPossibleAttack = possibleAttacks.some((attack) => attack.x === x && attack.y === y);

    return (
      <Square
        key={index}
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
        gamePhase={gamePhase}
      />
    );
  };

  return (
    <div className="board">
      {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, index) => renderSquare(index))}
    </div>
  );
};

export default Board;
