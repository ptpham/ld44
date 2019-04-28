
function preload ()
{
  this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  this.load.spritesheet('player', 'assets/player.png', { frameWidth: 27, frameHeight: 66 });
  this.load.spritesheet('playerDeath', 'assets/player_death.png', { frameWidth: 31, frameHeight: 57 });
  this.load.spritesheet('boss', 'assets/boss.png', { frameWidth: 60, frameHeight: 90 });
  this.load.spritesheet('bossDeath', 'assets/boss_death.png', { frameWidth: 45, frameHeight: 87 });
  this.load.spritesheet('arrow', 'assets/arrow.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('heart', 'assets/heart.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('smoke', 'assets/smoke.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('background', 'assets/background.png', { frameWidth: 400, frameHeight: 300 });
  this.load.spritesheet('merchant', 'assets/merchant.png', { frameWidth: 23, frameHeight: 40 });
  this.load.spritesheet('carpet', 'assets/carpet.png', { frameWidth: 50, frameHeight: 120 });
  this.load.spritesheet('slash', 'assets/slash.png', { frameWidth: 24, frameHeight: 24 });
  this.load.spritesheet('block', 'assets/block.png', { frameWidth: 12, frameHeight: 32 });
  this.load.spritesheet('items', 'assets/items.png', { frameWidth: 30, frameHeight: 60 });
  this.load.spritesheet('dialog', 'assets/dialog.png', { frameWidth: 300, frameHeight: 200 });

  this.load.image('bullet', 'assets/sprites/bullet.png');
  this.load.spritesheet('fire', 'assets/sprites/fire.png', { frameWidth: 8, frameHeight: 16 });

  this.load.image('player_attack', 'assets/player_allattacks.png');
  this.load.json('player_attack_data', 'assets/player_allattacks.json');

  this.load.image('player_hit', 'assets/player_hit.png')
  this.load.json('player_hit_data', 'assets/player_hit.json')

  this.load.audio('swoosh', 'assets/swoosh.mp3');
  this.load.audio('bullet_firing', 'assets/bullet.mp3');
  this.load.audio('longsword_swipe', 'assets/longsword_swipe.mp3');
  this.load.audio('stick_hit', 'assets/stick_hit.mp3');
  this.load.audio('boss_attack', 'assets/boss_attack.mp3');
}

