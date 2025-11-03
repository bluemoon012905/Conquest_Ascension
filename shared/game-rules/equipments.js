export const equipments = {
  'oct-movement': {
    id: 'oct-movement',
    name: 'Oct Movement',
    description: 'Move one square in any of the eight directions per card.',
    category: 'movement',
    cost: { a: 3 },
    effect: {
      type: 'movement',
      pattern: 'octagonal',
      range: 1,
    },
  },
  'cross-movement': {
    id: 'cross-movement',
    name: 'Cross Movement',
    description: 'Move one square horizontally or vertically per card.',
    category: 'movement',
    cost: { a: 2 },
    effect: {
      type: 'movement',
      pattern: 'orthogonal',
      range: 1,
    },
  },
  'diagonal-movement': {
    id: 'diagonal-movement',
    name: 'Diagonal Movement',
    description: 'Move one square diagonally per card.',
    category: 'movement',
    cost: { a: 2 },
    effect: {
      type: 'movement',
      pattern: 'diagonal',
      range: 1,
    },
  },
  'lightswing-down': {
    id: 'lightswing-down',
    name: 'Light Swing Down',
    description: 'Strike the square directly below for 2 + 1d4 damage.',
    category: 'attack',
    cost: { b: 1 },
    effect: {
      type: 'attack',
      pattern: 'south',
      range: 1,
      damage: {
        base: 2,
        dice: '1d4',
      },
    },
  },
  'hardswing-down': {
    id: 'hardswing-down',
    name: 'Hard Swing Down',
    description: 'Strike the square directly below for 3 + 1d6 damage.',
    category: 'attack',
    cost: { b: 2 },
    effect: {
      type: 'attack',
      pattern: 'south',
      range: 1,
      damage: {
        base: 3,
        dice: '1d6',
      },
    },
  },
  'light-armor': {
    id: 'light-armor',
    name: 'Light Armor',
    description: 'Adds 1d4 defense when attacked.',
    category: 'armor',
    cost: { c: 1 },
    effect: {
      type: 'armor',
      dice: ['1d4'],
    },
  },
  'heavy-armor': {
    id: 'heavy-armor',
    name: 'Heavy Armor',
    description: 'Adds 1d4 + 1d6 defense when attacked.',
    category: 'armor',
    cost: { c: 2, a: 1 },
    effect: {
      type: 'armor',
      dice: ['1d4', '1d6'],
    },
  },
};
