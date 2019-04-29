
let state = {
  debugText: null,
  player: null,
  cursors: null,
  arrow: null,
  allPickItems: [
    {
      name: 'Item 1',
      spriteName: 'shield',
      cost: 1,
      item: new Shield(),
    }, {
      name: 'Item 2',
      spriteName: 'sword',
      cost: 2,
      item: new LongSword(),
    }, {
      name: 'Item 3',
      spriteName: 'gun',
      cost: 1,
      item: new Gun(),
    }
  ],
  enemyData: [
    {
      name: 'Bad Dude',
      sprite: 'boss',
      health: 5,
      speed: 80,
      items: [
        new SuperSlowSword(),
      ],
      getAI: () => new SimpleEnemyAI(),
    },
    {
      name: 'Bad Dude 2',
      sprite: 'boss',
      health: 10,
      speed: 120,
      items: [
        new SuperSlowSword(),
        new Shield(),
      ],
      getAI: () => new HitAndRunAI(),
    },
    {
      name: 'Boss',
      sprite: 'boss',
      health: 10,
      speed: 180,
      items: [
        new Gun(),
        new Shield(),
      ],
      getAI: () => new ShooterEnemyAI(),
    },
  ],
  currentEnemy: 0,
};

