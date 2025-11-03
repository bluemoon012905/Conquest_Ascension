import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Piece'; // Assuming Piece.js exports ItemTypes
import Piece from './Piece';
import './Square.css';

const Square = ({ x, y, onDrop, onDropEquipment, piece, colorClass, isPossibleMove, isPossibleAttack, currentPlayer, onPieceClick, gamePhase }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(item, { x, y }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [x, y, onDrop]);

  const backgroundColor = isPossibleMove && isPossibleAttack ? 'purple' : (isPossibleAttack ? 'red' : (isPossibleMove ? '#87CEEB' : (isOver ? '#c9a37c' : (colorClass === 'board-square-light' ? '#f0d9b5' : '#b58863'))));

  return (
    <div
      ref={drop}
      className={`board-square ${colorClass}`}
      style={{
        backgroundColor,
      }}
    >
      {piece && <Piece piece={piece} onDropEquipment={onDropEquipment} currentPlayer={currentPlayer} onPieceClick={onPieceClick} gamePhase={gamePhase} />}
    </div>
  );
};

export default Square;
