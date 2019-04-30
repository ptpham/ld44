
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
      cost: 1,
      item: new LongSword(),
    }, {
      name: 'Item 3',
      spriteName: 'gun',
      cost: 2,
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
      health: 7,
      speed: 120,
      tint: 0x00ff00,
      items: [
        new SuperSlowSword(),
        new Shield(),
      ],
      getAI: () => new HitAndRunAI(),
    },
    {
      name: 'Bad Dude 3',
      sprite: 'boss',
      health: 9,
      speed: 120,
      tint: 0xff0000,
      items: [
        new DoubleSword(),
        new Shield(),
      ],
      getAI: () => new HitAndRunAI(),
    },
    {
      name: 'Boss',
      sprite: 'finalboss',
      health: 10,
      speed: 180,
      items: [
        new FastGun(),
        new Shield(),
      ],
      getAI: () => new ShooterEnemyAI(),
    },
  ],
  currentEnemy: 0,
};

