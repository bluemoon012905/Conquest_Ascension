import React from 'react';
import { equipments } from '../../../../shared/game-rules/equipments';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  EQUIPMENT: 'equipment',
};

const DraggableEquipment = ({ equipment }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EQUIPMENT,
    item: { id: equipment.id, type: 'equipment' }, // Add type for drop handling
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '5px',
        border: '1px solid black',
        margin: '5px',
      }}
    >
      {equipment.name}
    </div>
  );
};

const EquipmentSelection = () => {
  return (
    <div>
      <h2>Equipment</h2>
      {Object.entries(equipments).map(([id, equipment]) => (
        <DraggableEquipment key={id} equipment={{ ...equipment, id }} />
      ))}
    </div>
  );
};

export { ItemTypes as EquipmentItemTypes }; // Export with a unique name
export default EquipmentSelection;
