import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  PIECE: 'piece',
};

const Piece = ({ piece }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { id: piece.id, type: piece.type, player: piece.player },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
        color: piece.player === 'blue' ? 'blue' : 'red',
      }}
    >
      ♘
    </div>
  );
};

export { ItemTypes }; // Export ItemTypes
export default Piece;
