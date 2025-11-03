import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EquipmentItemTypes } from '../ui/EquipmentSelection';
import './Piece.css';

import { pieces } from '../../../../shared/game-rules/pieces';

import HealthBar from './HealthBar';

const ItemTypes = {
  PIECE: 'piece',
};

const Piece = ({ piece, onDropEquipment, currentPlayer, onPieceClick, gamePhase }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id: piece.id, type: piece.type, player: piece.player, source: 'board' },
    canDrag: () => gamePhase === 'SETUP' || piece.player === currentPlayer,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: EquipmentItemTypes.EQUIPMENT,
    drop: (item) => onDropEquipment(item, piece),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const playerClass = piece.player === 'blue' ? 'piece-blue' : 'piece-red';
  const pieceData = pieces[piece.type];

  return (
    <div
      ref={(node) => drag(drop(node))}
      onClick={() => onPieceClick(piece)}
      className={`piece ${playerClass}`}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? '#c9a37c' : (piece.player === 'blue' ? 'blue' : 'red'),
      }}
    >
      <HealthBar health={piece.health || pieceData.health} maxHealth={pieceData.health} />
      <div>
        {piece.equipment && piece.equipment.map(eq => <div key={eq.id}>{eq.name}</div>)}
      </div>
    </div>
  );
};

export { ItemTypes }; // Export ItemTypes
export default Piece;
