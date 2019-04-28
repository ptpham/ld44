
function create ()
{
  createAnimsForDude.call(this);
  createAnimsForPlayer.call(this);
  createAnimsForBoss.call(this);

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

  this.anims.create({
    key: 'smoke-spin',
    frames: this.anims.generateFrameNumbers('smoke', { start: 0, end: 15 }),
    frameRate: 20
  });

  state.background = this.add.sprite(WIDTH/2, HEIGHT/2, 'background');
  state.player = new Fighter(this.physics.add.sprite(WIDTH/2, HEIGHT/2, 'player'));
  state.player.sprite.setCollideWorldBounds(true);
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

    fighter.sprite.setImmovable(true);
    return fighter;
  });

  if (DEBUG) {
    state.debugText = this.add.text(0, 0, '', DEFAULT_FONT);
  }
}

function createAnimsForDude() {

  const standDown = 4;
  const moveLeft = { start: 0, end: 3 };
  const moveRight = { start: 5, end: 8 };

  this.anims.create({
    key: 'dude_stand_down',
    frames: [{ key: 'dude', frame: standDown }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_stand_up',
    frames: [{ key: 'dude', frame: standDown }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_stand_left',
    frames: [{ key: 'dude', frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_stand_right',
    frames: [{ key: 'dude', frame: 5 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_hitstun',
    frames: [{ key: 'dude', frame: standDown }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_dead',
    frames: [{ key: 'dude', frame: standDown }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_pick',
    frames: [{ key: 'dude', frame: standDown }],
    frameRate: 20
  });

  this.anims.create({
    key: 'dude_move_left',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_right',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_up',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_up_right',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_up_left',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_down',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_down_left',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_move_down_right',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });


  this.anims.create({
    key: 'dude_attack_left',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_attack_right',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_attack_down',
    frames: this.anims.generateFrameNumbers('dude', moveLeft),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'dude_attack_up',
    frames: this.anims.generateFrameNumbers('dude', moveRight),
    frameRate: 10,
    repeat: -1
  });
}

function createAnimsForPlayer() {
  this.anims.create({
    key: 'player_stand_down',
    frames: [{ key: 'player', frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_stand_up',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_stand_left',
    frames: [{ key: 'player', frame: 9 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_stand_right',
    frames: [{ key: 'player', frame: 0 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_hitstun',
    frames: [{ key: 'player', frame: 5 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_dead',
    frames: [{ key: 'player', frame: 5 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_pick',
    frames: [{ key: 'player', frame: 7 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'player_move_left',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_right',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_down',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_up',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_down_left',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_down_right',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_up_left',
    frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_move_up_right',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_attack_left',
    frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_attack_right',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_attack_down',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'player_attack_up',
    frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
    frameRate: 10,
    repeat: -1
  });
}

function createAnimsForBoss() {
  let label = 'boss';
  let config = {
    stand_down: [9,9],
    stand_up: [4,4],
    stand_left: [13,13],
    stand_right: [0,0],
    hitstun: [0,0], 
    dead: [0,0], 
    pick: [0,0],
    move_left: [12,15], 
    move_right: [0,3],
    move_down: [8,11],
    move_up: [4,7], 
    move_down_left: [12,15],
    move_down_right: [0,3],
    move_up_left: [12,15], 
    move_up_right: [0,3],
    attack_left: [12,15],
    attack_right: [0,3],
    attack_down: [8,11],
    attack_up: [4,7]
  };

  for (let key in config) {
    let [start, end] = config[key];
    this.anims.create({
      key: `${label}_${key}`,
      frames: this.anims.generateFrameNumbers(label, { start, end }),
      frameRate: 20
    });
  }
}
