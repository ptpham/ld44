

class Screen {
  constructor(scene) {
    this.scene = scene;
    this.lastTabTimeDown = 0;
  }

  stopPlayerMovement() {
    // Make sure we don't slide around during the dialog
    state.player.update({ move: { x: 0, y: 0 } });
    state.player.sprite.setVelocityX(0);
    state.player.sprite.setVelocityY(0);
  }

  fadeFromBlack(duration, onComplete) {
    this.black = this.scene.add.sprite(WIDTH, HEIGHT, 'black');
    this.black.scaleX = WIDTH;
    this.black.scaleY = HEIGHT;
    this.black.depth = 20000;
    this.black.alpha = 1;

    this.scene.tweens.add({
      targets: this.black,
      alpha: 0,
      ease: 'Power1',
      duration: duration,
      onComplete: () => {
        onComplete && onComplete();
        this.black.destroy();
        this.black = null;
      },
    });
  }

  fadeToBlack(duration, onComplete) {
    this.black = this.scene.add.sprite(WIDTH, HEIGHT, 'black');
    this.black.scaleX = WIDTH;
    this.black.scaleY = HEIGHT;
    this.black.depth = 20000;
    this.black.alpha = 0;

    this.scene.tweens.add({
      targets: this.black,
      alpha: 1,
      ease: 'Power1',
      duration: duration,
      onComplete: () => {
        onComplete && onComplete();
        this.black.destroy();
        this.black = null
      },
    });
  }

  setDialog(sprite, string) {
    sprite.x = -DIALOG_WIDTH/2 + 52;
    sprite.y = 0;
    let font = _.clone(DEFAULT_FONT);
    font.wordWrap = { width: DIALOG_WIDTH/2 + 16 };

    let dialog = this.scene.add.sprite(
      0, 0,
      state.background.frame.name > 0 ? 'dialog_fight' : 'dialog'
    );
    let text = this.scene.add.text(-DIALOG_WIDTH/2 + 100, -DIALOG_HEIGHT/2 + 32, string, font);
    let nextText = this.scene.add.text(DIALOG_WIDTH/2 - 75, DIALOG_HEIGHT/2 - 40, 'Enter', DEFAULT_FONT);
    let arrow = this.scene.add.sprite(DIALOG_WIDTH/2 - 16, DIALOG_HEIGHT/2 - 34, 'arrow');
    arrow.anims.play('arrow-bounce');
    arrow.rotation = -Math.PI/2;

    let children = [dialog, sprite, text, nextText, arrow];
    this.dialog = this.scene.add.container(WIDTH/2, HEIGHT/2, children);
    this.dialog.depth = 5000;
    this.dialog.canBeDismissedMinTime = this.scene.time.now + DIALOG_COOLDOWN;
  }

  clearDialog() {
    if (
      this.dialog &&
      this.dialog.canBeDismissedMinTime < this.scene.time.now
    ) {
      this.dialog.destroy();
      this.dialog = null;
    }
  }

  _updateDialog() {
    if (this.dialog) {
      if (state.enter.isDown) this.clearDialog();
      return this;
    }
  }

  getInputs() {
    let playerX = 0, playerY = 0;
    if (state.cursors.left.isDown) {
      playerX = -1;
    } else if (state.cursors.right.isDown) {
      playerX = 1;
    }

    if (state.cursors.up.isDown) {
      playerY = -1;
    } else if (state.cursors.down.isDown) {
      playerY = 1;
    }
    

    // keypress checking for tab
    let tabpressed = false;
    if (state.tabkey.isDown) {
      if (this.lastTabTimeDown < state.tabkey.timeDown) {
        tabpressed = true;
        this.lastTabTimeDown = state.tabkey.timeDown
      }
    }

    return {
      move: { x: playerX, y: playerY },
      damage: 0,
      hitstun: 0,
      attacking: state.cursors.space.isDown,
      pickItem: null,
      dropItem: null,
      switchItem: tabpressed,
    };
  }

  update() { }
}

class TitleScreen extends Screen {
  constructor(scene) {
    super(scene);
    this.fadeFromBlack(4000);
    this.container = this.scene.add.container(0, 0);
    this.titleCard = this.scene.add.sprite(WIDTH/2, HEIGHT/2, 'title');

    this.startText = this.scene.add.text(
      15,
      HEIGHT - 90,
      'Press Enter',
      DEFAULT_FONT
    );

    this.container.add(this.titleCard);
    this.container.add(this.startText);
    this.container.depth = 10000;
    this.scene.tweens.add({
      targets: this.startText,
      x: 21,
      ease: 'Power1',
      yoyo: true,
      repeat: -1,
      duration: 1000,
    });
  }

  destroy() {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      ease: 'Power1',
      duration: 3000,
      onComplete: () => {
        this.container.destroy();
      }
    });
  }

  update() {
    if (state.enter.isDown) {
      this.destroy();
      return new StagingScreen(this.scene, true);
    }
  }
}

class DelayScreen extends Screen {
  constructor(scene, wait, nextScreen, onDestroy) {
    super(scene);
    this.onDestroy = onDestroy;
    this.nextScreen = nextScreen;
    this.begin = Date.now();
    this.wait = wait;
  }

  update() {
    if (Date.now() > this.begin + this.wait) {
      if (this.onDestroy) this.onDestroy();
      return this.nextScreen();
    }
  }
}

class StagingScreen extends Screen {
  constructor(scene, fromTitle) {
    super(scene);
    state.background.anims.play('background-staging');

    this.arrow = scene.physics.add.sprite(WIDTH/2, HEIGHT, 'light');
    this.arrow.anims.play('light-bounce');
    this.isStagingForFinalBoss = state.currentEnemy >= state.enemyData.length - 1;
    this.itemContainers = [];

    this.intro = [
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
        text: 'You find yourself in a strange place.\n\n' +
          'Use the arrow keys to move.\n' +
          'Press "Space" to attack.\n' +
          'Press "Tab" to switch weapons.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 3),
        text: 'Hey! You awake?'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
        text: '??'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
        text: 'I know you must have a lot questions, but right now we\'re in danger. ' +
          'There are some really mean guys in the other room, and they\'re blocking the only exit.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
        text: 'I wish I were strong enough to fight them...\n' +
          'but as you can see, I am very small, and very weak.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 4),
        text: 'I\'ve been trying to escape, but all I have are these ' +
          'weapons that are too big for my small hands.',
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
        text: '...'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 5),
        text: 'I could...give you these weapons in exchange for some of your hearts? ' +
          'They\'re very cute and I want them. And then we can escape together!',
      },
    ];

    this.beforeBosses = [
      [
        {
          sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 5),
          text: 'Way to take that oaf out! You’re a natural at this.',
        },
        {
          sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
          text: 'Shhh...here comes another one. Careful now, this one looks stronger than the last. ' +
                'These weapons are still here if you need them.'
        },
      ],
      [
        {
          sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
          text: 'I can\'t believe we made it this far! There\'s only one more left, who happens to be the strongest one of them all.'
        },
        {
          sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 5),
          text: 'But after you take care of him, we\'ll be home free! ' +
                'Just make sure you have a strong weapon to deal with him...'
        }
      ],
      [
        {
          sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
          text: '...?'
        },
      ]
    ];

    if (!this.isStagingForFinalBoss) {
      let ITEM_COUNT = 3;
      this.items = _.sampleSize(_.filter(state.allPickItems,
        pickItem => !state.player.hasItem(pickItem.item)), ITEM_COUNT);
      this.itemContainers = _.times(this.items.length, i => {
        let x = (i + 0.5) * WIDTH / (this.items.length), y = HEIGHT / 4;
        let result = scene.add.container(x, y);
        this.createRequirementHearts(result, this.items[i]);
        return result;
      });

      this.merchant = scene.physics.add.sprite(PLAYER_START_X / 2, PLAYER_START_Y, 'merchant');
      resizeAndCenterBody(this.merchant, 15, 35);
      this.merchant.body.offset.y -= 5;
      this.merchant.setCollideWorldBounds(true);
      this.merchantFighter = new Fighter(this.merchant);
      this.merchantFighter.speed = 60;
      this.merchantAI = new StayInPlaceAI(PLAYER_START_X / 2, PLAYER_START_Y);
    }

    this.inIntro = fromTitle;
    this.currentDialog = fromTitle ? this.intro : this.beforeBosses[state.currentEnemy - 1];
    this.currentDialogIndex = 0;

    if (!fromTitle) {
      this.fadeFromBlack(800);
    }

    this.willMoveToFighting = false;
  }

  createRequirementHearts(container, item) {
    let { scene } = this;
    let RANGE_X = 60;
    let OFFSET_Y = 50;
    let hearts = [];

    let { cost } = item;
    let carpet = scene.add.sprite(0, 0, 'carpet');
    let itemSprite = scene.physics.add.sprite(0, 0, 'items');
    itemSprite.anims.play(item.spriteName);
    resizeAndCenterBody(itemSprite, 20, 20);
    carpet.scaleX = 1.5;
    carpet.scaleY = 0.8;

    container.add(carpet);
    container.add(itemSprite);

    for (let i = 0; i < cost; i++) {
      let x = RANGE_X*(i - cost/2 + 0.5)/ cost;
      let y = OFFSET_Y;
      let heart = scene.add.sprite(x, y, 'heart');
      heart.anims.play('heart-empty');
      container.add(heart);
      hearts.push(heart);
    }

    container.itemSprite = itemSprite;
    container.hearts = hearts;
    container.item = item;
  }

  createSmoke(itemSprite) {
    this.smoke = this.scene.add.sprite(itemSprite.x, itemSprite.y, 'smoke');
    this.smoke.anims.play('smoke-spin');
    this.smoke.scaleX = 3;
    this.smoke.scaleY = 3;
  }

  selectItem(container, item) {
    this.createSmoke(container);
    container.itemSprite.destroy();
    Promise.mapSeries(container.hearts, heart => {
      heart.anims.play('heart-fill');
      return Promise.delay(100);
    });
  }
  
  destroy() {
    for (let container of this.itemContainers) container.destroy();
    if (this.smoke) this.smoke.destroy();
    this.arrow.destroy();
    if (this.merchant) { this.merchant.destroy(); }
  }

  updateForDialog() {
    if (!this.dialog && this.currentDialog) {
      const dialog = this.currentDialog[this.currentDialogIndex];
      this.setDialog(dialog.sprite, dialog.text);
      this.currentDialogIndex += 1;

      if (this.currentDialogIndex >= this.currentDialog.length) {
        this.currentDialog = null;
      }
    }
    
    if (this.dialog) {
      this._updateDialog();
    }
  }

  update() {
    if (this.black) {
      this.stopPlayerMovement();
      return;
    }
    if (this.willMoveToFighting) {
      this.destroy();
      this.stopPlayerMovement();
      return new FightingScreen(this.scene);
    }
    if (this.dialog || this.currentDialog) {
      return this.updateForDialog();
    }

    let { player } = state;
    player.update(this.getInputs());

    let { merchant, scene, items, itemContainers } = this;
    let { physics } = scene;

    if (player.isDead()) {
      return new DelayScreen(this.scene, 1000, () => new LoseScreen(this.scene), () => this.destroy());
    }

    if (physics.overlap(player.sprite, this.arrow)) {
      this.willMoveToFighting = true;
      this.fadeToBlack(800);
    }


    if (!this.isStagingForFinalBoss) {
      physics.collide(player.sprite, merchant);

      let merchantInputs = this.merchantAI.getInputsForEnemy(this.merchantFighter, player);
      this.merchantFighter.update(merchantInputs);
      merchant.setVisible(true);

      for (let i = 0; i < items.length; i++) {
        let container = itemContainers[i];
        if (physics.overlap(player.sprite, container.itemSprite)) {
          this.selectItem(container, items[i]);
          player.update({ pickItem: items[i] });
          scene.sound.play('swoosh', { volume: 0.1 });
        }
      }
    }

    state.heartManager.update();
    state.itemManager.update();
  }
}

class FightingScreen extends Screen {
  constructor(scene) {
    super(scene);
    let { player } = state;
    player.sprite.y = 50;
    state.background.anims.play('background-fighting-closed');

    this.index = state.currentEnemy;
    this.enemy = state.enemies[this.index];
    this.enemyAI = state.enemyData[this.index].getAI();
    this.enemy.sprite.x = WIDTH / 2;
    this.enemy.sprite.y = HEIGHT - this.enemy.sprite.height;
    this.enemy.sprite.setCollideWorldBounds(true);

    this.arrow = scene.physics.add.sprite(-WIDTH, -HEIGHT, 'light');
    this.arrow.anims.play('light-bounce');

    // switch music for final boss
    const musicKey = this.isFinalBoss() ? 'music_2' : 'music_1';
    const musicVolume = this.isFinalBoss() ? 0.3 : 0.2;
    this.music = scene.sound.add(musicKey, { volume: musicVolume, loop: true})
    this.music.play()

    this.showFinalBossStory = this.isFinalBoss();
    this.finalBossDialogIndex = 0;
    this.finalBossDialog = [
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 1),
        text: 'Oh, you’re here...'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 1),
        text: 'The exit is right over there.',
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 3),
        text: 'Before you go, I really must thank you for helping me dispose of those guards. ' +
        'They were quite a nuisance, weren’t they?'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
        text: '...\n\n\n...?'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 1),
        text: 'What are those hearts you’ve been paying me with? ' +
              'Well, I suppose it doesn\'t matter if I tell you now...'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 4),
        text: 'Those hearts...\n\n\nThey\'re the virtues from your life.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player_hit', 'unarmed_right_1'),
        text: '... !!'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
        text: 'That\'s right, you\'re dead. We\'re in Purgatory, and when you cross that exit, you face judgement. ' +
            'Those with many virtues will get into Heaven, and the rest are doomed to eternal ' +
            'suffering in Hell. '
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
        text: 'Those big oafs you defeated take you and toss you through when it\'s your turn. But I wasn\'t ready yet...'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player'),
        text: '??'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant'),
        text: 'I committed quite a few sins in my life so I had a pretty ' +
        'big hole to dig myself out of.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 5),
        text: 'I had to trick a lot of suckers like ' +
        'you into taking my place in eternal damnation to get to where am I now.'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'merchant', 5),
        text: 'But now, thanks to ' +
          'you, I\'ll finally have enough virtues to get into Heaven. I just need ' +
          'those last few hearts you got there...'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'player', 1),
        text: '!!!'
      },
      {
        sprite: this.scene.add.sprite(-WIDTH, -HEIGHT, 'finalboss', 2),
        text: 'Not gonna hand \'em over, huh? Well, enjoy spending eternity in Hell!'
      },
    ];

    this.canStartFight = this.scene.time.now + 1500;
    this.fadeFromBlack(800);
  }

  isFinalBoss() {
    return this.index === (state.enemies.length - 1)
  }

  updateForFinalBossStory() {
    if (!this.dialog && this.finalBossDialog) {
      const bossDialog = this.finalBossDialog[this.finalBossDialogIndex];
      this.setDialog(bossDialog.sprite, bossDialog.text);
      this.finalBossDialogIndex += 1;

      if (this.finalBossDialogIndex >= this.finalBossDialog.length) {
        this.showFinalBossStory = false;
      }
    }

    if (this.dialog) {
      this._updateDialog();
    }
  }

  update() {
    if (this.black || this.canStartFight > this.scene.time.now) {
      this.stopPlayerMovement();
      return;
    }
    if (this.willGoToStaging) {
      this.destroy();
      this.music.setLoop(false)
      this.stopPlayerMovement();
      state.player.sprite.y = HEIGHT / 2 + 72;
      return new StagingScreen(this.scene);
    }
    if (this.dialog || this.showFinalBossStory) {
      return this.updateForFinalBossStory();
    }

    let { player } = state;
    let { physics } = this.scene;
    let inputs = this.getInputs();
    let enemyInputs = this.enemyAI.getInputsForEnemy(this.enemy, player);

    // Check for attack collisions first
    this.enemy.attacks = this.enemy.attacks.map((enemyAttack) => {
      player.attacks = player.attacks.map((playerAttack) => {
        if (physics.overlap(playerAttack.sprite, enemyAttack.sprite)) {
          playerAttack.onCollideAttack(enemyAttack, inputs, enemyInputs);
          enemyAttack.onCollideAttack(playerAttack, enemyInputs, inputs);
        }
        return playerAttack;
      }).filter((x) => x.active);
      return enemyAttack;
    }).filter((x) => x.active);

    // resolve attacks
    player.attacks = player.attacks.map((attack) => {
      if (physics.overlap(this.enemy.sprite, attack.sprite)) {
        attack.onCollideEnemy(this.enemy, enemyInputs)
      }
      return attack
    }).filter((x) => x.active)

    this.enemy.attacks = this.enemy.attacks.map((attack) => {
      if (physics.overlap(player.sprite, attack.sprite)) {
        attack.onCollideEnemy(player, inputs)
      }
      return attack
    }).filter((x) => x.active)

    player.update(inputs);
    this.enemy.update(enemyInputs);

    if (!this.enemy.isDead()) {
      physics.collide(player.sprite, this.enemy.sprite);
    }
    state.heartManager.update();
    state.itemManager.update();

    if (player.isDead()) {
      this.music.setLoop(false)
      return new DelayScreen(this.scene, 1000, () => new LoseScreen(this.scene), () => this.destroy());
    }

    if (this.enemy.isDead()) {
      state.background.anims.play('background-fighting');
      if (this.index < state.enemyData.length - 1) {
        this.arrow.rotation = Math.PI;
        this.arrow.x = WIDTH/2;
        this.arrow.y = 15;
        state.currentEnemy = this.index + 1;

        if (physics.overlap(player.sprite, this.arrow)) {
          this.willGoToStaging = true;
          this.fadeToBlack(800);
          return;
        }
      } else {
        this.music.setLoop(false)
        return new VictoryScreen(this.scene);
      }
    }
  }

  destroy() {
    this.music.setLoop(false)
    this.music.stop()
    this.arrow.destroy();
    this.enemy.sprite.setCollideWorldBounds(false);
    this.enemy.sprite.x = -WIDTH;
    this.enemy.sprite.y = -HEIGHT;
  }
}

class LoseScreen extends Screen {
  constructor(scene) {
    super(scene);
    let sprite = scene.add.sprite(0, 0, 'playerDeath');
    sprite.anims.play('player_dead');
    this.setDialog(sprite, 'Everything goes black. You awake several hours later without any memory of what happened, still trapped in these mysterious chambers.');
  }

  update() {
    let { player } = state;
    state.heartManager.update();
    state.itemManager.update();
    player.update();

    let dialogUpdate = this._updateDialog();
    if (dialogUpdate) return dialogUpdate;
    document.location.reload();
  }
}

class VictoryScreen extends Screen {
  constructor(scene) {
    super(scene);
    let sprite = scene.add.sprite(0, 0, 'playerDeath');
    sprite.anims.play('player_attack_right');
    this.setDialog(sprite, 'You have escaped Purgatory! May your virtues bring you a favorable judgement.');
  }

  update() {
    let dialogUpdate = this._updateDialog();
    if (dialogUpdate) return dialogUpdate;
    document.location.reload();
  }
}

