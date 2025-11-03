import React, { useState } from 'react';
import Square from './Square';
import Piece from './Piece';
import './Board.css';

const Board = () => {
  const [pieces, setPieces] = useState({});

  const handleDrop = (item, to) => {
    setPieces(prevPieces => {
      const newPieces = { ...prevPieces };

      // Find the piece being moved
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
        const newPiece = { ...item, x: to.x, y: to.y };
        newPieces[`${to.x},${to.y}`] = newPiece;
      }

      return newPieces;
    });
  };

  const renderSquare = (i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';
    const piece = pieces[`${x},${y}`];

    return (
      <Square
        key={i}
        x={x}
        y={y}
        onDrop={handleDrop}
        piece={piece}
        colorClass={colorClass}
      />
    );
  };

  const squares = [];
  for (let i = 0; i < 64; i++) {
    squares.push(renderSquare(i));
  }

  return (
    <div className="board-grid">
      {squares}
    </div>
  );
};

export default Board;
