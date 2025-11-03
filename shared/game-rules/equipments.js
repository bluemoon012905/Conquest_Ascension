export const equipments = {
  'oct-movement': {
    name: 'Octagonal Movement',
    description: 'Allows movement in 8 directions.',
    effect: {
      type: 'movement',
      value: 'octagonal',
    },
  },
  'cross-movement': {
    name: 'Cross Movement',
    description: 'Allows movement in 4 directions (cross shape).'
    effect: {
      type: 'movement',
      value: 'cross',
    },
  },
  '+1_attack': {
    name: '+1 Attack',
    description: 'Increases attack by 1.',
    effect: {
      type: 'stat',
      stat: 'attack',
      value: 1,
    },
  },
  '+1_defense': {
    name: '+1 Defense',
    description: 'Increases defense by 1.',
    effect: {
      type: 'stat',
      stat: 'defense',
      value: 1,
    },
  },
};
