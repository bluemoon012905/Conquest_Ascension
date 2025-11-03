import React from 'react';

const playerLabels = {
  blue: 'Blue Army',
  red: 'Red Army',
};

const PieceRosterSection = ({
  player,
  pieces,
  selectedPieceId,
  onSelectPiece,
}) => {
  if (pieces.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ color: player === 'blue' ? '#1e90ff' : '#dc143c' }}>
        {playerLabels[player]}
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '4px' }}>
              Piece
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '4px' }}>
              Position
            </th>
            <th style={{ borderBottom: '1px solid #ccc', textAlign: 'left', padding: '4px' }}>
              Equipment
            </th>
          </tr>
        </thead>
        <tbody>
          {pieces.map((piece) => {
            const isSelected = piece.id === selectedPieceId;
            return (
              <tr
                key={piece.id}
                onClick={() => onSelectPiece(piece.id)}
                style={{
                  backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
                  {piece.type}
                </td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
                  ({piece.x + 1}, {piece.y + 1})
                </td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
                  {(piece.equipment || []).length > 0
                    ? piece.equipment.map((eq) => eq.name).join(', ')
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const PieceRoster = ({ pieces, selectedPieceId, onSelectPiece }) => {
  const grouped = pieces.reduce(
    (acc, piece) => {
      acc[piece.player] = acc[piece.player] || [];
      acc[piece.player].push(piece);
      return acc;
    },
    { blue: [], red: [] }
  );

  return (
    <div style={{ minWidth: '260px' }}>
      <h2>Deployment Overview</h2>
      <PieceRosterSection
        player="blue"
        pieces={grouped.blue}
        selectedPieceId={selectedPieceId}
        onSelectPiece={onSelectPiece}
      />
      <PieceRosterSection
        player="red"
        pieces={grouped.red}
        selectedPieceId={selectedPieceId}
        onSelectPiece={onSelectPiece}
      />
    </div>
  );
};

export default PieceRoster;
