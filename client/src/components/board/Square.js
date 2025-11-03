import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './Piece'; // Assuming Piece.js exports ItemTypes
import Piece from './Piece';
import './Square.css';

const Square = ({ x, y, onDrop, piece, colorClass }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.PIECE,
    drop: (item) => onDrop(item, { x, y }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [x, y, onDrop]);

  return (
    <div
      ref={drop}
      className={`board-square ${colorClass}`}
      style={{
        backgroundColor: isOver ? '#c9a37c' : (colorClass === 'board-square-light' ? '#f0d9b5' : '#b58863'),
      }}
    >
      {piece && <Piece piece={piece} />}
    </div>
  );
};

export default Square;
