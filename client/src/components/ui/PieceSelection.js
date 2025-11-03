import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../board/Piece';
import { pieces as pieceDefinitions } from '../../../../shared/game-rules/pieces';

const pieceTypes = ['Vanguard', 'Horseman', 'Shieldman'];
const players = ['blue', 'red'];

const pieceColors = {
  blue: '#1e90ff',
  red: '#dc143c',
};

const PieceCard = ({ type, player }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PIECE,
    item: { type, player, source: 'selection' },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [type, player]);

  const pieceData = pieceDefinitions[type];
  const formatBudget = (resources) => {
    const values = {
      a: resources?.a ?? 0,
      b: resources?.b ?? 0,
      c: resources?.c ?? 0,
    };
    return `A: ${values.a}  B: ${values.b}  C: ${values.c}`;
  };

  return (
    <div
      ref={drag}
      style={{
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        border: `2px solid ${pieceColors[player]}`,
        borderRadius: '8px',
        padding: '8px',
        marginBottom: '8px',
        width: '140px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <div style={{ fontWeight: 'bold', color: pieceColors[player], marginBottom: '4px' }}>
        {player.toUpperCase()} {type}
      </div>
      {pieceData && (
        <div style={{ fontSize: '0.85rem', lineHeight: 1.3 }}>
          <div>HP: {pieceData.health}</div>
          <div>Budget: {formatBudget(pieceData.resources)}</div>
        </div>
      )}
    </div>
  );
};

const PieceSelectionColumn = ({ player }) => (
  <div style={{ marginRight: '16px' }}>
    <h2 style={{ color: pieceColors[player] }}>
      {player === 'blue' ? 'Blue Pieces' : 'Red Pieces'}
    </h2>
    {pieceTypes.map((type) => (
      <PieceCard key={`${player}-${type}`} type={type} player={player} />
    ))}
  </div>
);

const PieceSelection = () => (
  <div style={{ display: 'flex', padding: '0 16px' }}>
    {players.map((player) => (
      <PieceSelectionColumn key={player} player={player} />
    ))}
  </div>
);

export default PieceSelection;
