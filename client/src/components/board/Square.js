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
  pieces = [],
  colorClass,
  isPossibleMove,
  isPossibleAttack,
  currentPlayer,
  onPieceClick,
  gamePhase,
  isSelectedSquare,
  selectedPieceId,
  onSquareClick,
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
        boxShadow: isSelectedSquare ? '0 0 0 4px rgba(255, 215, 0, 0.8) inset' : 'none',
      }}
      onClick={() => onSquareClick(x, y)}
    >
      <div className="square-occupants">
        {pieces.map((piece) => (
          <Piece
            key={piece.id}
            piece={piece}
            onDropEquipment={onDropEquipment}
            currentPlayer={currentPlayer}
            onPieceClick={onPieceClick}
            gamePhase={gamePhase}
            isSelected={piece.id === selectedPieceId}
          />
        ))}
      </div>
    </div>
  );
};

export default Square;
