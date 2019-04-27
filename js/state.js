
let state = {
  debugText: null,
  player: null,
  cursors: null,
  allItems: [
    {
      name: 'Item 1',
      spriteName: 'dude',
      cost: 1,
    }, {
      name: 'Item 2',
      spriteName: 'dude',
      cost: 1,
    }, {
      name: 'Item 3',
      spriteName: 'dude',
      cost: 1,
    }
  ],
  enemyData: [
    {
      name: 'Bad Dude',
      sprite: 'dude',
      health: 5,
      speed: 200,
      baseDamage: 2,
      items: [],
      getAI: () => new SimpleEnemyAI(),
    },
  ],
  currentEnemy: 0,
};

