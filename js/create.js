
function create ()
{
  createAnimsForDude.call(this);
  createAnimsForPlayer.call(this);
  createTexturesAndAnimationsForPlayerItems.call(this);
  createAnimsForBoss.call(this);
  createAnimsForFinalBoss.call(this);
  createAnimsForMerchant.call(this);
  createAnimsForItems.call(this);

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
    frameRate: 15
  });

  this.anims.create({
    key: 'gun-fire',
    frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 11 }),
    frameRate: 20
  })

  this.anims.create({
    key: 'slash',
    frames: this.anims.generateFrameNumbers('slash', { start: 0, end: 5 }),
    duration: 200,
    hideOnComplete: true,
  });

  this.anims.create({
    key: 'block',
    frames: this.anims.generateFrameNumbers('block', { start: 0, end: 5 }),
    duration: 200,
    hideOnComplete: true,
  });

  this.anims.create({
    key: 'dialog-main',
    frames: this.anims.generateFrameNumbers('dialog', { start: 0, end: 0 }),
    frameRate: 20
  });

  state.background = this.add.sprite(WIDTH/2, HEIGHT/2, 'background');
  state.player = new Fighter(this.physics.add.sprite(PLAYER_START_X, PLAYER_START_Y, 'player'));
  state.player.sprite.setCollideWorldBounds(true);
  state.player.sprite.depth = 1000;
  state.player.items.push(new DefaultSword());

  state.cursors = this.input.keyboard.createCursorKeys();
  state.tabkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TAB)
  state.screen = new TitleScreen(this);
  state.heartManager = new HeartManager(this);
  state.itemManager = new ItemManager(this);
  state.enemies = state.enemyData.map((data) => {
    const fighter = new Fighter(this.physics.add.sprite(-WIDTH, -HEIGHT, data.sprite));
    fighter.health = data.health;
    fighter.speed = data.speed;
    fighter.items = data.items;
    fighter.baseDamage = data.baseDamage;
    if (data.tint) fighter.sprite.tint = data.tint;

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
    frames: this.anims.generateFrameNumbers('playerDeath', { start: 0, end: 2 }),
    frameRate: 10
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

function createAnimsForMerchant() {
  let label = 'merchant';
  let config = {
    stand_down: [0,1],
    stand_up: [0,1],
    stand_left: [0,1],
    stand_right: [0,1],
    hitstun: [0,1], 
    dead: [0,1], 
    pick: [0,1],
    move_left: [0,1], 
    move_right: [0,1],
    move_down: [0,1],
    move_up: [0,1], 
    move_down_left: [0,1],
    move_down_right: [0,1],
    move_up_left: [0,1], 
    move_up_right: [0,1],
    attack_left: [0,1],
    attack_right: [0,1],
    attack_down: [0,1],
    attack_up: [0,1]
  };

  for (let key in config) {
    let [start, end] = config[key];
    this.anims.create({
      key: `${label}_${key}`,
      frames: this.anims.generateFrameNumbers(label, { start, end }),
      frameRate: 5
    });
  }
}

function createAnimsForBoss() {
  let label = 'boss';
  let config = {
    stand_down: [9,9],
    stand_up: [4,4],
    stand_left: [13,13],
    stand_right: [0,0],
    pick: [0,0],
    move_left: [12,15], 
    move_right: [0,3],
    move_down: [8,11],
    move_up: [4,7], 
    move_down_left: [12,15],
    move_down_right: [0,3],
    move_up_left: [12,15], 
    move_up_right: [0,3],
  };


  for (let key in config) {
    let [start, end] = config[key];
    this.anims.create({
      key: `${label}_${key}`,
      frames: this.anims.generateFrameNumbers('boss', { start, end }),
      frameRate: 20
    });
  }

  const configForHitAndAttack = {
    hit_up: [3, 3],
    hit_down: [1, 1],
    hit_left: [6, 6],
    hit_right: [1, 1],
    attack_left: [14, 14],
    attack_right: [9, 9],
    attack_down: [9, 9],
    attack_up: [11, 11]
  }

  for (let key in configForHitAndAttack) {
    let [start, end] = configForHitAndAttack[key];
    this.anims.create({
      key: `${label}_${key}`,
      frames: this.anims.generateFrameNumbers('bossHitAttack', { start, end }),
      frameRate: 20
    });
  }

  this.anims.create({
    key: 'boss_dead',
    frames: this.anims.generateFrameNumbers('bossDeath', { start: 0, end: 4 }),
    frameRate: 10
  });
}

function createAnimsForFinalBoss() {
  let label = 'finalboss';
  let down_general = [3,4];
  let up_general = [11,12];
  let left_general = [4,5];
  let right_general = [2,3];

  let config = {
    stand_down: down_general,
    stand_up: up_general,
    stand_left: left_general,
    stand_right: right_general,
    hitstun: [0,0], 
    dead: [16,22],
    pick: [1,1],
    move_left: left_general,
    move_right: right_general,
    move_down: down_general,
    move_up: up_general, 
    move_down_left: left_general,
    move_down_right: right_general,
    move_up_left: [12,13], 
    move_up_right: [10,11],
    attack_left: [5,6],
    attack_right: [1,2],
    attack_down: [5,6],
    attack_up: [9,10]
  };

  for (let key in config) {
    let [start, end] = config[key];
    let frameRate = key == 'dead' ? 3 : 20;
    this.anims.create({
      key: `${label}_${key}`,
      frames: this.anims.generateFrameNumbers(label, { start, end }),
      frameRate
    });
  }
}

function createTexturesAndAnimationsForPlayerItems() {

  const modes = ['attack', 'hit']
  const itemsWithAttack = ['stick', 'sword', 'gun', 'shield'];
  const directions = ['up', 'left', 'right', 'down'];

  modes.forEach((mode) => {
    const data = this.cache.json.get(`player_${mode}_data`)
    const texture = this.textures.get(`player_${mode}`)
    const anims = this.anims;

    data.frames.forEach((frame, i) => {
      texture.add(frame.name, 0, frame.frame.x, frame.frame.y, frame.frame.w, frame.frame.h);
    });

    function makeAnim(key, frames) {
      console.log('makeAnim', key, frames)
      const animFrames = frames.map((frame) => ({
        key: `player_${mode}`,
        frame: frame,
      }));
      anims.create({
        key: key,
        frames: animFrames,
        frameRate: 20
      });
    }

    function getFramesForAction(item, direction) {
      // reuse left action frame for down (just for stun)
      if (mode == 'hit' && direction == 'down') {
        direction = 'right'
      }
      return [`${item}_${direction}_1`]
    }

    function getFramesForStanding(item, direction) {
      return [`${item}_${direction}_0`];
    }

    if (mode == 'attack') {
      // add the standing animations just on the attack mode
      itemsWithAttack.forEach(key => {
        directions.forEach((direction) => {
          makeAnim(`player_stand_${direction}_${key}`, getFramesForStanding(key, direction))
        })
      })
    }

    // add action frames for mode
    itemsWithAttack.forEach(key => {
        directions.forEach((direction) => {
          makeAnim(`player_${mode}_${direction}_${key}`, getFramesForAction(key, direction))
        })
    })
  })

}

function createAnimsForItems() {
  let config = ['sword', 'shield', 'gun', 'stick'];
  for (let i = 0; i < config.length; i++) {
    this.anims.create({
      key: config[i],
      frames: this.anims.generateFrameNumbers('items', { start: i, end: i }),
      frameRate: 20
    });
  }
}

