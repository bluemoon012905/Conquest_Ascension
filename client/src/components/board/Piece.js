import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { EquipmentItemTypes } from '../ui/EquipmentSelection';
import './Piece.css';

import { pieces as pieceDefinitions } from '../../../../shared/game-rules/pieces';

import HealthBar from './HealthBar';

const ItemTypes = {
  PIECE: 'piece',
};

const tokenForEquipment = (equipment) => {
  if (!equipment?.category) {
    return equipment?.name ?? 'Card';
  }

  if (equipment.category === 'movement') {
    return 'Rect';
  }

  if (equipment.category === 'attack') {
    return 'Hex';
  }

  if (equipment.category === 'armor') {
    return 'Shield';
  }

  return equipment.name;
};

const Piece = ({
  piece,
  onDropEquipment,
  currentPlayer,
  onPieceClick,
  gamePhase,
  isSelected,
}) => {
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

  const definition = pieceDefinitions[piece.type];
  const maxHealth = definition?.health ?? piece.health ?? 10;
  const equipmentList = piece.equipment || [];

  return (
    <div
      ref={(node) => drag(drop(node))}
      className="piece-container"
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div style={{ width: '100%', paddingBottom: '4px' }}>
        <HealthBar health={piece.health ?? maxHealth} maxHealth={maxHealth} />
      </div>
      <button
        type="button"
        onClick={() => onPieceClick(piece)}
        className={`piece-button ${piece.player} ${isSelected ? 'selected' : ''}`}
        style={{
          backgroundColor: isOver
            ? '#c9a37c'
            : piece.player === 'blue'
            ? '#1e90ff'
            : '#dc143c',
        }}
      >
        <span className="piece-label">{piece.type}</span>
      </button>
      {equipmentList.length > 0 && (
        <div className="piece-equipment">
          {equipmentList.map((eq, index) => (
            <span key={`${eq.id}-${index}`} className="piece-equipment-token">
              {tokenForEquipment(eq)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export { ItemTypes };
export default Piece;
