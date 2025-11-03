import React from 'react';
import { useDrag } from 'react-dnd';
import { equipments } from '../../../../shared/game-rules/equipments';

const ItemTypes = {
  EQUIPMENT: 'equipment',
};

const shapeTokens = {
  movement: '[RECT]',
  attack: '<HEX>',
  armor: '{SHIELD}',
};

const DraggableEquipment = ({ equipment, id }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.EQUIPMENT,
      item: { id, type: 'equipment', name: equipment.name, effect: equipment.effect },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [id, equipment]
  );

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
        padding: '6px 8px',
        border: '1px solid #333',
        borderRadius: '6px',
        margin: '6px 0',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        {shapeTokens[equipment.category] ?? '[CARD]'} {equipment.name}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#444' }}>{equipment.description}</div>
    </div>
  );
};

const groupByCategory = () => {
  const buckets = {
    movement: [],
    attack: [],
    armor: [],
  };

  Object.entries(equipments).forEach(([id, equipment]) => {
    const category = equipment.category ?? 'misc';
    if (!buckets[category]) {
      buckets[category] = [];
    }
    buckets[category].push({ id, equipment });
  });

  return buckets;
};

const EquipmentSelection = () => {
  const grouped = groupByCategory();

  return (
    <div style={{ marginLeft: '24px', minWidth: '220px' }}>
      <h2>Equipment</h2>
      {Object.entries(grouped).map(([category, items]) =>
        items.length > 0 ? (
          <div key={category} style={{ marginBottom: '16px' }}>
            <h3 style={{ textTransform: 'capitalize', marginBottom: '8px' }}>{category}</h3>
            {items.map(({ id, equipment }) => (
              <DraggableEquipment key={id} id={id} equipment={equipment} />
            ))}
          </div>
        ) : null
      )}
    </div>
  );
};

export { ItemTypes as EquipmentItemTypes };
export default EquipmentSelection;
