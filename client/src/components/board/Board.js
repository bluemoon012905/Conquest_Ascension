import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Square from './Square';
import './Board.css';
import { pieces as pieceDefinitions } from '../../../../shared/game-rules/pieces';
import { equipments as equipmentDefinitions } from '../../../../shared/game-rules/equipments';

const BOARD_SIZE = 8;

const boardKey = (x, y) => `${x},${y}`;

const clonePieces = (state) => JSON.parse(JSON.stringify(state));

const withinBounds = (x, y) =>
  x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

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
  south: [{ dx: 0, dy: 1 }],
};

const patternToDirections = (pattern) => {
  switch (pattern) {
    case 'orthogonal':
      return directionSets.orthogonal;
    case 'diagonal':
      return directionSets.diagonal;
    case 'octagonal':
      return [...directionSets.orthogonal, ...directionSets.diagonal];
    case 'south':
      return directionSets.south;
    case 'self':
      return [{ dx: 0, dy: 0 }];
    default:
      return [];
  }
};

const coordinateSet = () => {
  const store = new Map();
  return {
    add: (x, y) => {
      const key = boardKey(x, y);
      if (!store.has(key)) {
        store.set(key, { x, y });
      }
    },
    has: (x, y) => store.has(boardKey(x, y)),
    values: () => Array.from(store.values()),
  };
};

const doesEquipmentCoverSquare = (equipment, fromX, fromY, targetX, targetY) => {
  const { effect } = equipment;
  if (!effect) {
    return false;
  }

  const directions = patternToDirections(effect.pattern);
  const range = effect.range ?? 1;
  const dx = targetX - fromX;
  const dy = targetY - fromY;

  return directions.some(({ dx: dirX, dy: dirY }) => {
    for (let step = 1; step <= range; step += 1) {
      if (dx === dirX * step && dy === dirY * step) {
        return true;
      }
    }
    return false;
  });
};

const computeMovementTargets = (piece, piecesByCoord) => {
  const targets = coordinateSet();
  const equipment = piece.equipment || [];

  const movementCounts = equipment.reduce(
    (acc, eq) => {
      if (eq.effect?.type !== 'movement') {
        return acc;
      }
      const bucket = eq.effect.pattern || 'orthogonal';
      const range = eq.effect.range ?? 1;
      acc[bucket] = (acc[bucket] ?? 0) + range;
      return acc;
    },
    {}
  );

  const addMovesFromDirections = (directions, maxSteps) => {
    directions.forEach(({ dx, dy }) => {
      for (let step = 1; step <= maxSteps; step += 1) {
        const targetX = piece.x + dx * step;
        const targetY = piece.y + dy * step;

        if (!withinBounds(targetX, targetY)) {
          break;
        }

        const occupants = piecesByCoord[boardKey(targetX, targetY)] || [];
        const hasEnemy = occupants.some((occ) => occ.player !== piece.player);

        if (hasEnemy) {
          break;
        }

        targets.add(targetX, targetY);
      }
    });
  };

  Object.entries(movementCounts).forEach(([pattern, count]) => {
    const directions = patternToDirections(pattern);
    addMovesFromDirections(directions, count);
  });

  return targets.values();
};

const computeAttackTargets = (piece, piecesByCoord) => {
  const targets = coordinateSet();
  const equipment = piece.equipment || [];

  equipment.forEach((eq) => {
    if (eq.effect?.type !== 'attack') {
      return;
    }

    const directions = patternToDirections(eq.effect.pattern);
    const range = eq.effect.range ?? 1;

    directions.forEach(({ dx, dy }) => {
      for (let step = 1; step <= range; step += 1) {
        const targetX = piece.x + dx * step;
        const targetY = piece.y + dy * step;

        if (!withinBounds(targetX, targetY)) {
          break;
        }

        targets.add(targetX, targetY);

        const key = boardKey(targetX, targetY);
        const occupants = piecesByCoord[key] || [];
        if (occupants.length > 0) {
          break;
        }
      }
    });
  });

  return targets.values();
};

const canAffordEquipment = (piece, equipment) => {
  const cost = equipment.cost || {};
  const remaining = piece.resourcesRemaining || {};

  return Object.entries(cost).every(
    ([resource, amount]) => (remaining[resource] ?? 0) >= amount
  );
};

const applyEquipmentCost = (remaining, equipment) => {
  const next = { ...remaining };
  Object.entries(equipment.cost || {}).forEach(([resource, amount]) => {
    next[resource] = (next[resource] ?? 0) - amount;
  });
  return next;
};

const checkForWinner = (pieces, currentPlayer, setWinner) => {
  const remainingOpponents = Object.values(pieces).some(
    (piece) => piece.player !== currentPlayer
  );

  if (!remainingOpponents) {
    setWinner(currentPlayer);
  }
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
  const [moveTargets, setMoveTargets] = useState([]);
  const [attackTargets, setAttackTargets] = useState([]);

  const piecesByCoord = useMemo(() => {
    const map = {};
    Object.values(pieces).forEach((piece) => {
      const key = boardKey(piece.x, piece.y);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(piece);
    });
    return map;
  }, [pieces]);

  const moveTargetKeys = useMemo(
    () => new Set(moveTargets.map(({ x, y }) => boardKey(x, y))),
    [moveTargets]
  );

  const attackTargetKeys = useMemo(
    () => new Set(attackTargets.map(({ x, y }) => boardKey(x, y))),
    [attackTargets]
  );

  const selectedPiece = selectedPieceId ? pieces[selectedPieceId] : null;

  useEffect(() => {
    if (!selectedPiece || gamePhase !== 'PLAYING') {
      setMoveTargets([]);
      setAttackTargets([]);
      return;
    }

    const moves = computeMovementTargets(selectedPiece, piecesByCoord);
    const attacks = computeAttackTargets(selectedPiece, piecesByCoord);

    setMoveTargets(moves);
    setAttackTargets(attacks);
  }, [selectedPiece, piecesByCoord, gamePhase]);

  useEffect(() => {
    if (selectedPieceId && !selectedPiece) {
      setSelectedPieceId(null);
    }
  }, [selectedPiece, selectedPieceId, setSelectedPieceId]);

  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev, clonePieces(pieces)]);
  }, [pieces, setHistory]);

  const createPieceInstance = (item, to) => {
    const definition = pieceDefinitions[item.type];
    const baseHealth = definition?.health ?? 10;
    const resources = { a: 0, b: 0, c: 0, ...(definition?.resources || {}) };

    return {
      id: `${item.type}-${item.player}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 6)}`,
      type: item.type,
      player: item.player,
      x: to.x,
      y: to.y,
      equipment: [],
      health: baseHealth,
      maxHealth: baseHealth,
      resources: { ...resources },
      resourcesRemaining: { ...resources },
      maxResources: { ...resources },
    };
  };

  const placeNewPiece = (item, to) => {
    pushHistory();
    const newPiece = createPieceInstance(item, to);
    setPieces((prevPieces) => {
      const next = { ...prevPieces };
      next[newPiece.id] = newPiece;
      return next;
    });
    setSelectedPieceId(newPiece.id);
  };

  const repositionPiece = (item, to) => {
    const targetPiece = pieces[item.id];
    if (!targetPiece) {
      return;
    }

    if (targetPiece.x === to.x && targetPiece.y === to.y) {
      return;
    }

    pushHistory();
    setPieces((prevPieces) => {
      const next = clonePieces(prevPieces);
      if (next[item.id]) {
        next[item.id].x = to.x;
        next[item.id].y = to.y;
      }
      return next;
    });
    setSelectedPieceId(item.id);
  };

  const handleDrop = (item, to) => {
    if (gamePhase !== 'SETUP') {
      return;
    }

    if (item.source === 'board') {
      repositionPiece(item, to);
    } else if (item.source === 'selection') {
      placeNewPiece(item, to);
    }
  };

  const performMove = (pieceId, to) => {
    const movingPiece = pieces[pieceId];
    if (!movingPiece) {
      return;
    }

    const occupants = piecesByCoord[boardKey(to.x, to.y)] || [];
    const hasEnemy = occupants.some(
      (occupant) => occupant.player !== movingPiece.player
    );

    if (hasEnemy) {
      return;
    }

    pushHistory();
    setPieces((prevPieces) => {
      const next = clonePieces(prevPieces);
      if (!next[pieceId]) {
        return prevPieces;
      }
      next[pieceId].x = to.x;
      next[pieceId].y = to.y;
      return next;
    });
  };

  const performAttack = (pieceId, to) => {
    const attacker = pieces[pieceId];
    if (!attacker) {
      return;
    }

    const potentialTargets = Object.values(pieces).filter(
      (candidate) =>
        candidate.player !== attacker.player &&
        candidate.x === to.x &&
        candidate.y === to.y
    );

    if (potentialTargets.length === 0) {
      return;
    }

    const matchingEquipment = (attacker.equipment || []).filter((eq) =>
      eq.effect?.type === 'attack' &&
      doesEquipmentCoverSquare(eq, attacker.x, attacker.y, to.x, to.y)
    );

    if (matchingEquipment.length === 0) {
      return;
    }

    const totalBaseDamage = matchingEquipment.reduce(
      (sum, eq) => sum + (eq.effect?.damage?.base ?? 1),
      0
    );

    pushHistory();
    setPieces((prevPieces) => {
      const next = clonePieces(prevPieces);
      const targetList = Object.values(next).filter(
        (candidate) =>
          candidate.player !== attacker.player &&
          candidate.x === to.x &&
          candidate.y === to.y
      );

      if (targetList.length === 0) {
        return prevPieces;
      }

      const target = targetList[0];
      const remainingHealth = (target.health ?? 0) - totalBaseDamage;

      if (remainingHealth <= 0) {
        delete next[target.id];
      } else {
        next[target.id] = {
          ...target,
          health: remainingHealth,
        };
      }

      checkForWinner(next, attacker.player, setWinner);

      return next;
    });
  };

  const handleSquareClick = (x, y) => {
    if (gamePhase === 'SETUP') {
      const occupants = piecesByCoord[boardKey(x, y)] || [];
      if (occupants.length > 0) {
        setSelectedPieceId(occupants[occupants.length - 1].id);
      }
      return;
    }

    if (!selectedPiece || selectedPiece.player !== currentPlayer) {
      return;
    }

    const key = boardKey(x, y);
    const isMoveTarget = moveTargetKeys.has(key);
    const isAttackTarget = attackTargetKeys.has(key);

    if (!isMoveTarget && !isAttackTarget) {
      return;
    }

    if (isMoveTarget && isAttackTarget) {
      if (window.confirm('Use capture on this square?')) {
        performAttack(selectedPiece.id, { x, y });
      } else {
        performMove(selectedPiece.id, { x, y });
      }
    } else if (isAttackTarget) {
      performAttack(selectedPiece.id, { x, y });
    } else if (isMoveTarget) {
      performMove(selectedPiece.id, { x, y });
    }
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

  const handleDropEquipment = (equipmentItem, piece) => {
    const equipment =
      equipmentDefinitions[equipmentItem.id] || equipmentItem || null;

    if (!equipment) {
      return;
    }

    const targetPiece = pieces[piece.id];

    if (!targetPiece) {
      return;
    }

    if (gamePhase !== 'SETUP' && targetPiece.player !== currentPlayer) {
      return;
    }

    if (!canAffordEquipment(targetPiece, equipment)) {
      window.alert('Not enough resources to equip this item.');
      return;
    }

    pushHistory();
    setPieces((prevPieces) => {
      const next = clonePieces(prevPieces);
      const updateTarget = next[piece.id];

      if (!updateTarget) {
        return prevPieces;
      }

      const updatedEquipment = [
        ...(updateTarget.equipment || []),
        { ...equipment },
      ];

      next[piece.id] = {
        ...updateTarget,
        equipment: updatedEquipment,
        resourcesRemaining: applyEquipmentCost(
          updateTarget.resourcesRemaining || {},
          equipment
        ),
      };

      return next;
    });
  };

  const renderSquare = (index) => {
    const x = index % BOARD_SIZE;
    const y = Math.floor(index / BOARD_SIZE);
    const key = boardKey(x, y);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';
    const occupants = piecesByCoord[key] || [];
    const isMoveTarget = moveTargetKeys.has(key);
    const isAttackTarget = attackTargetKeys.has(key);
    const isSelected = occupants.some((piece) => piece.id === selectedPieceId);

    return (
      <Square
        key={index}
        x={x}
        y={y}
        onDrop={handleDrop}
        onDropEquipment={handleDropEquipment}
        pieces={occupants}
        colorClass={colorClass}
        currentPlayer={currentPlayer}
        onPieceClick={handlePieceClick}
        isPossibleMove={isMoveTarget}
        isPossibleAttack={isAttackTarget}
        gamePhase={gamePhase}
        isSelectedSquare={isSelected}
        selectedPieceId={selectedPieceId}
        onSquareClick={handleSquareClick}
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
