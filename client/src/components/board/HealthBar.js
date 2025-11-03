import React from 'react';

const HealthBar = ({ health, maxHealth }) => {
  const percentage = (health / maxHealth) * 100;

  return (
    <div style={{ width: '100%', backgroundColor: '#ccc' }}>
      <div style={{ width: `${percentage}%`, backgroundColor: 'green', height: '5px' }} />
    </div>
  );
};

export default HealthBar;
