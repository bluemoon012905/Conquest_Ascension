import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Piece';
import Piece from './Piece';
import './Square.css';

const Square = ({
  x,
  y,
  onDrop,
  onDropEquipment,
  piece,
  colorClass,
  isPossibleMove,
  isPossibleAttack,
  currentPlayer,
  onPieceClick,
  gamePhase,
  isSelected,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ItemTypes.PIECE,
      drop: (item) => onDrop(item, { x, y }),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [x, y, onDrop]
  );

  const baseColor = colorClass === 'board-square-light' ? '#f0d9b5' : '#b58863';
  let backgroundColor = baseColor;

  if (isPossibleMove && isPossibleAttack) {
    backgroundColor = 'purple';
  } else if (isPossibleAttack) {
    backgroundColor = 'red';
  } else if (isPossibleMove) {
    backgroundColor = '#87CEEB';
  } else if (isOver) {
    backgroundColor = '#c9a37c';
  }

  return (
    <div
      ref={drop}
      className={`board-square ${colorClass}`}
      style={{
        backgroundColor,
        boxShadow: isSelected ? '0 0 0 4px rgba(255, 215, 0, 0.8) inset' : 'none',
      }}
    >
      {piece && (
        <Piece
          piece={piece}
          onDropEquipment={onDropEquipment}
          currentPlayer={currentPlayer}
          onPieceClick={onPieceClick}
          gamePhase={gamePhase}
          isSelected={isSelected}
        />
      )}
    </div>
  );
};

export default Square;
