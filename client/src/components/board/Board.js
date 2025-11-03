import React from 'react';
import Square from './Square';
import './Board.css'; // We'll create this file next

const Board = () => {
  const renderSquare = (i) => {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isEven = (x + y) % 2 === 0;
    const colorClass = isEven ? 'board-square-light' : 'board-square-dark';

    return (
      <Square
        key={i}
        value={i}
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
