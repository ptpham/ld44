
function create ()
{
  if (DEBUG) {
    state.debugText = this.add.text(0, 0, '', DEFAULT_FONT);
  }

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'stand',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'arrow-bounce',
    frames: this.anims.generateFrameNumbers('arrow', { start: 0, end: 2 }),
    frameRate: 2,
    repeat: -1
  });

  this.anims.create({
    key: 'heart-empty',
    frames: [{ key: 'heart', frame: 0 }],
    frameRate: -1
  });

  this.anims.create({
    key: 'heart-full',
    frames: [{ key: 'heart', frame: 1 }],
    frameRate: -1
  });

  this.anims.create({
    key: 'background-staging',
    frames: [{ key: 'background', frame: 0 }],
    frameRate: -1
  });

  this.anims.create({
    key: 'background-fighting',
    frames: [{ key: 'background', frame: 1 }],
    frameRate: -1
  });

  state.background = this.add.sprite(WIDTH/2, HEIGHT/2, 'background');
  state.player = new Fighter(this.physics.add.sprite(WIDTH/2, HEIGHT/2, 'dude'));
  state.cursors = this.input.keyboard.createCursorKeys();
  state.screen = new TitleScreen(this);
  state.heartManager = new HeartManager(this);
  state.enemies = state.enemyData.map((data) => {
    const fighter = new Fighter(this.physics.add.sprite(-WIDTH, -HEIGHT, data.sprite));
    fighter.health = data.health;
    fighter.speed = data.speed;
    fighter.items = data.items;
    fighter.baseDamage = data.baseDamage;
    fighter.sprite.tint = 0xff0000;
    return fighter;
  });
}

