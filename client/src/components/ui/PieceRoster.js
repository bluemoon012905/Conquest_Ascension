import React from 'react';

const playerLabels = {
  blue: 'Blue Army',
  red: 'Red Army',
};

const formatResourceString = (piece) => {
  const remaining = piece.resourcesRemaining || {};
  const max = piece.maxResources || piece.resources || {};
  const format = (key) => `${remaining[key] ?? 0}/${max[key] ?? 0}`;
  return `A: ${format('a')}  B: ${format('b')}  C: ${format('c')}`;
};

const formatEquipmentSummary = (piece) => {
  const equipment = piece.equipment || [];
  if (equipment.length === 0) {
    return '—';
  }

  const buckets = equipment.reduce(
    (acc, item) => {
      const category = item.category ?? 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    { movement: [], attack: [], armor: [], other: [] }
  );

  const labelMap = {
    movement: 'Move',
    attack: 'Capture',
    armor: 'Armor',
    other: 'Other',
  };

  const summarise = (items) => {
    const counts = items.reduce((acc, item) => {
      const key = item.name || item.id || 'Equipment';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
      .join(', ');
  };

  return Object.entries(buckets)
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => `${labelMap[category] ?? category} (${items.length}): ${summarise(items)}`)
    .join(' | ');
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
              Resources
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
                  {formatResourceString(piece)}
                </td>
                <td style={{ padding: '4px', borderBottom: '1px solid #eee' }}>
                  {formatEquipmentSummary(piece)}
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
  const sortedPieces = [...pieces].sort((a, b) => a.type.localeCompare(b.type));

  const grouped = sortedPieces.reduce(
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
