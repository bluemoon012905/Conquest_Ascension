import React from 'react';
import './Square.css'; // We'll create this file next

const Square = ({ value, colorClass }) => {
  return (
    <div className={`board-square ${colorClass}`}>
      {/* {value} */}
    </div>
  );
};

export default Square;
