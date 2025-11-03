import React, { useEffect, useMemo, useState } from 'react';
import Square from './Square';
import './Board.css';
import { pieces as pieceDefinitions } from '../../../../shared/game-rules/pieces';

const BOARD_SIZE = 8;

const boardKey = (x, y) => `${x},${y}`;

const cloneBoardState = (state) => JSON.parse(JSON.stringify(state));

const withinBounds = (x, y) => x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

const directionSets = {
  orthogonal: [
    { dx: 1, dy: 0 },
    { dx: -1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
  ],
  diagonal: [
    { dx: 1, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: -1, dy: -1 },
  ],
};

const getPieceById = (pieces, id) =>
  Object.values(pieces).find((piece) => piece.id === id) || null;

const mergeUniqueCoordinates = (source, additions) => {
  const merged = [...source];
  const existingKeys = new Set(source.map((coord) => boardKey(coord.x, coord.y)));

  additions.forEach((coord) => {
    const key = boardKey(coord.x, coord.y);
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      merged.push(coord);
    }
  });

  return merged;
};

const computeMovementOptions = (piece, pieces) => {
  const equipment = piece.equipment || [];
  const moves = [];
  const counts = {
    orthogonal: 0,
    diagonal: 0,
    octagonal: 0,
  };

  equipment.forEach((eq) => {
    if (eq.effect?.type !== 'movement') {
      return;
    }
    if (eq.effect.pattern === 'orthogonal') {
      counts.orthogonal += eq.effect.range ?? 1;
    } else if (eq.effect.pattern === 'diagonal') {
      counts.diagonal += eq.effect.range ?? 1;
    } else if (eq.effect.pattern === 'octagonal') {
      counts.octagonal += eq.effect.range ?? 1;
    }
  });

  const addMovesFromDirections = (directions, maxSteps) => {
    directions.forEach(({ dx, dy }) => {
      for (let step = 1; step <= maxSteps; step += 1) {
        const targetX = piece.x + dx * step;
        const targetY = piece.y + dy * step;

        if (!withinBounds(targetX, targetY)) {
          break;
        }

        const occupant = pieces[boardKey(targetX, targetY)];
        if (occupant && occupant.player === piece.player) {
          break;
        }

        moves.push({ x: targetX, y: targetY });

        if (occupant && occupant.player !== piece.player) {
          break;
        }
      }
    });
  };

  if (counts.orthogonal > 0) {
    addMovesFromDirections(directionSets.orthogonal, counts.orthogonal);
  }

  if (counts.diagonal > 0) {
    addMovesFromDirections(directionSets.diagonal, counts.diagonal);
  }

  if (counts.octagonal > 0) {
    const octagonalDirections = [
      ...directionSets.orthogonal,
      ...directionSets.diagonal,
    ];
    addMovesFromDirections(octagonalDirections, counts.octagonal);
  }

  return moves;
};

const computeAttackOptions = (piece, pieces) => {
  const equipment = piece.equipment || [];
  let attacks = [];

  equipment.forEach((eq) => {
    if (eq.effect?.type !== 'attack') {
      return;
    }

    const range = eq.effect.range ?? 1;
    let directions = [];

    if (eq.effect.pattern === 'orthogonal') {
      directions = directionSets.orthogonal;
    } else if (eq.effect.pattern === 'diagonal') {
      directions = directionSets.diagonal;
    } else if (eq.effect.pattern === 'octagonal') {
      directions = [
        ...directionSets.orthogonal,
        ...directionSets.diagonal,
      ];
    } else if (eq.effect.pattern === 'self') {
      directions = [{ dx: 0, dy: 0 }];
    }

    const generated = [];
    directions.forEach(({ dx, dy }) => {
      for (let step = 1; step <= range; step += 1) {
        const targetX = piece.x + dx * step;
        const targetY = piece.y + dy * step;

        if (!withinBounds(targetX, targetY)) {
          break;
        }

        generated.push({ x: targetX, y: targetY });

        const occupant = pieces[boardKey(targetX, targetY)];
        if (occupant) {
          break;
        }
      }
    });

    attacks = mergeUniqueCoordinates(attacks, generated);
  });

  return attacks;
};

const Board = ({
  currentPlayer,
  gamePhase,
  pieces,
  setPieces,
  history,
  setHistory,
  setWinner,
  selectedPieceId,
  setSelectedPieceId,
}) => {
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [possibleAttacks, setPossibleAttacks] = useState([]);

  const selectedPiece = useMemo(
    () => (selectedPieceId ? getPieceById(pieces, selectedPieceId) : null),
    [pieces, selectedPieceId]
  );

  useEffect(() => {
    if (!selectedPiece || gamePhase !== 'PLAYING') {
      setPossibleMoves([]);
      setPossibleAttacks([]);
      return;
    }

    setPossibleMoves(computeMovementOptions(selectedPiece, pieces));
    setPossibleAttacks(computeAttackOptions(selectedPiece, pieces));
  }, [selectedPiece, pieces, gamePhase]);

  useEffect(() => {
    if (selectedPieceId && !selectedPiece) {
      setSelectedPieceId(null);
    }
  }, [selectedPiece, selectedPieceId, setSelectedPieceId]);

  const pushHistory = () => {
    setHistory((prev) => [...prev, cloneBoardState(pieces)]);
  };

  const handlePieceClick = (piece) => {
    if (gamePhase === 'SETUP') {
      setSelectedPieceId(piece.id);
      return;
    }

    if (piece.player !== currentPlayer) {
      return;
    }

    setSelectedPieceId(piece.id);
  };

  const placeNewPiece = (item, to) => {
    if (pieces[boardKey(to.x, to.y)]) {
      return;
    }

    const definition = pieceDefinitions[item.type];
    const uniqueId = `${item.type}-${item.player}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    pushHistory();
    setPieces((prevPieces) => {
      const updated = { ...prevPieces };
      updated[boardKey(to.x, to.y)] = {
        id: uniqueId,
        type: item.type,
        player: item.player,
        x: to.x,
        y: to.y,
        equipment: [],
        health: definition?.health ?? 10,
      };
      return updated;
    });

    setSelectedPieceId(uniqueId);
  };

  const repositionExistingPiece = (item, to) => {
    const pieceEntry = Object.entries(pieces).find(
      ([, piece]) => piece.id === item.id
    );

    if (!pieceEntry) {
      return;
    }

    const [fromKey, piece] = pieceEntry;
    const destinationKey = boardKey(to.x, to.y);
    const occupant = pieces[destinationKey];

    if (occupant && occupant.id !== piece.id) {
      return;
    }

    pushHistory();
    setPieces((prevPieces) => {
      const updated = { ...prevPieces };
      const movingPiece = { ...piece, x: to.x, y: to.y };
      delete updated[fromKey];
      updated[destinationKey] = movingPiece;
      return updated;
    });
    setSelectedPieceId(item.id);
  };

  const handleDrop = (item, to) => {
    if (gamePhase === 'SETUP') {
      if (item.source === 'board') {
        repositionExistingPiece(item, to);
      } else if (item.source === 'selection') {
        placeNewPiece(item, to);
      }
      return;
    }

    if (item.player !== currentPlayer) {
      return;
    }

    const isPossibleMove = possibleMoves.some(
      (move) => move.x === to.x && move.y === to.y
    );
    const isPossibleAttack = possibleAttacks.some(
      (attack) => attack.x === to.x && attack.y === to.y
    );

    if (!isPossibleMove && !isPossibleAttack) {
      return;
    }

    const targetKey = boardKey(to.x, to.y);
    const targetPiece = pieces[targetKey];

    pushHistory();

    if (isPossibleAttack && targetPiece && targetPiece.player !== item.player) {
      setPieces((prevPieces) => {
        const updated = { ...prevPieces };
        const defender = updated[targetKey];

        if (defender) {
          const remainingHealth = (defender.health ?? 0) - 1;
          if (remainingHealth <= 0) {
            delete updated[targetKey];
          } else {
            updated[targetKey] = { ...defender, health: remainingHealth };
          }
        }

        const remainingOpponentPieces = Object.values(updated).filter(
          (piece) => piece.player !== currentPlayer
        );

        if (remainingOpponentPieces.length === 0) {
          setWinner(currentPlayer);
        }

        return updated;
      });

      return;
    }

    if (isPossibleMove) {
      const movingEntry = Object.entries(pieces).find(
        ([, piece]) => piece.id === item.id
      );

      if (!movingEntry) {
        return;
      }

      const [fromKey, movingPiece] = movingEntry;

      setPieces((prevPieces) => {
        const updated = { ...prevPieces };
        const updatedPiece = { ...movingPiece, x: to.x, y: to.y };
        delete updated[fromKey];
        updated[targetKey] = updatedPiece;
        return updated;
      });

      setSelectedPieceId(item.id);
    }
  };

  const handleDropEquipment = (equipment, piece) => {
    if (gamePhase !== 'SETUP' && piece.player !== currentPlayer) {
      return;
    }

    pushHistory();
    setPieces((prevPieces) => {
      const updated = { ...prevPieces };
      const entry = Object.entries(updated).find(
        ([, candidate]) => candidate.id === piece.id
      );

      if (!entry) {
        return prevPieces;
      }

      const [key, targetPiece] = entry;
      const equipmentList = [...(targetPiece.equipment || []), equipment];
      updated[key] = { ...targetPiece, equipment: equipmentList };
      return updated;
    });
  };

  const renderSquare = (index) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';
    const piece = pieces[boardKey(x, y)];
    const isPossibleMove = possibleMoves.some(
      (move) => move.x === x && move.y === y
    );
    const isPossibleAttack = possibleAttacks.some(
      (attack) => attack.x === x && attack.y === y
    );
    const isSelected = piece ? piece.id === selectedPieceId : false;

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
        isSelected={isSelected}
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
