import React from 'react';
import Piece from '../board/Piece';

const PieceSelection = () => {
  const bluePieces = [
    { id: 'b1', type: 'Vanguard', player: 'blue' },
    { id: 'b2', type: 'Horseman', player: 'blue' },
    { id: 'b3', type: 'Shieldman', player: 'blue' },
  ];

  const redPieces = [
    { id: 'r1', type: 'Vanguard', player: 'red' },
    { id: 'r2', type: 'Horseman', player: 'red' },
    { id: 'r3', type: 'Shieldman', player: 'red' },
  ];

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h2>Blue Pieces</h2>
        {bluePieces.map(piece => <Piece key={piece.id} piece={piece} />)}
      </div>
      <div>
        <h2>Red Pieces</h2>
        {redPieces.map(piece => <Piece key={piece.id} piece={piece} />)}
      </div>
    </div>
  );
};

export default PieceSelection;
