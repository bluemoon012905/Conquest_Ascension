export const equipments = {
  'oct-movement': {
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
    name: 'Light Swing Down',
    description: 'Attack orthogonal squares for moderate damage.',
    category: 'attack',
    cost: { b: 1 },
    effect: {
      type: 'attack',
      pattern: 'orthogonal',
      damage: {
        base: 2,
        dice: '1d4',
      },
    },
  },
  'hardswing-down': {
    name: 'Hard Swing Down',
    description: 'Attack diagonal squares for heavier damage.',
    category: 'attack',
    cost: { b: 2 },
    effect: {
      type: 'attack',
      pattern: 'diagonal',
      damage: {
        base: 3,
        dice: '1d6',
      },
    },
  },
  'light-armor': {
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
    name: 'Heavy Armor',
    description: 'Adds 1d4+1d6 defense when attacked.',
    category: 'armor',
    cost: { c: 2, a: 1 },
    effect: {
      type: 'armor',
      dice: ['1d4', '1d6'],
    },
  },
};
