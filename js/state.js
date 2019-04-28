
let state = {
  debugText: null,
  player: null,
  cursors: null,
  arrow: null,
  allItems: [
    {
      name: 'Item 1',
      spriteName: 'shield',
      cost: 1,
      getItem: () => new DefaultSword(), // TODO: needs to be a shield
    }, {
      name: 'Item 2',
      spriteName: 'sword',
      cost: 2,
      getItem: () => new LongSword(),
    }, {
      name: 'Item 3',
      spriteName: 'gun',
      cost: 1,
      getItem: () => new Gun(),
    }
  ],
  enemyData: [
    {
      name: 'Bad Dude',
      sprite: 'boss',
      health: 5,
      speed: 200,
      baseDamage: 2,
      items: [
        new SuperSlowSword(),
      ],
      getAI: () => new SimpleEnemyAI(),
    },
    {
      name: 'Boss',
      sprite: 'boss',
      health: 10,
      speed: 80,
      baseDamage: 2,
      items: [
        new SuperSlowSword(),
      ],
      getAI: () => new SimpleEnemyAI(),
    },
  ],
  currentEnemy: 0,
};

