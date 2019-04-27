
function create ()
{
  if (DEBUG) {
    state.debugText = this.add.text(0, 0, '', { font: "15px monospace", fill: "#ffffff" });
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

  state.player = new Fighter(this.physics.add.sprite(WIDTH/2, HEIGHT/2, 'dude'));
  state.cursors = this.input.keyboard.createCursorKeys();
  state.screen = new TitleScreen(this);
}

