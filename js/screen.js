

class Screen {
  constructor(scene) {
    this.scene = scene;
    this.lastTabTimeDown = 0;
  }

  useBlackTransitionScreen(startBlack, onCompletelyBlack, onComplete) {
    this.black = this.scene.add.sprite(WIDTH, HEIGHT, 'black');
    this.black.scaleX = WIDTH;
    this.black.scaleY = HEIGHT;
    this.black.depth = 20000;
    this.black.alpha = startBlack ? 1 : 0;

    this.scene.tweens.add({
      targets: this.black,
      alpha: startBlack ? 0 : 1,
      ease: 'Power1',
      duration: startBlack ? 4000 : 6000,
      yoyo: !startBlack,
      onYoyo: onCompletelyBlack,
      onComplete: () => {
        onComplete && onComplete();
        this.black.destroy();
      },
    });
  }

  setDialog(sprite, string) {
    sprite.x += sprite.width - DIALOG_WIDTH/2 + 16;
    let font = _.clone(DEFAULT_FONT);
    font.wordWrap = { width: DIALOG_WIDTH/2 + 16 };

    let dialog = this.scene.add.sprite(0, 0, 'dialog');
    let text = this.scene.add.text(-DIALOG_WIDTH/2 + 100, -DIALOG_HEIGHT/2 + 32, string, font);
    let nextText = this.scene.add.text(DIALOG_WIDTH/2 - 75, DIALOG_HEIGHT/2 - 40, 'Enter', DEFAULT_FONT);
    let arrow = this.scene.add.sprite(DIALOG_WIDTH/2 - 16, DIALOG_HEIGHT/2 - 32, 'arrow');
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
    this.useBlackTransitionScreen(true);
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

    this.arrow = scene.physics.add.sprite(WIDTH/2, HEIGHT - 12, 'arrow');
    this.arrow.anims.play('arrow-bounce');
    this.isStagingForFinalBoss = state.currentEnemy >= state.enemyData.length - 1;
    this.itemContainers = [];

    this.intro = [
      {
        sprite: this.scene.add.sprite(0, 0, 'player'),
        text: 'You find yourself in a strange place.\n\n' +
          'Use the arrow keys to move.\n' +
          'Press "Space" to attack.\n' +
          'Press "Tab" to switch weapons.'
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'merchant', 3),
        text: 'Hey! You awake?'
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'player'),
        text: '??'
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'merchant'),
        text: 'There are a bunch of really dangerous guys in the other room, ' +
          'by the only exit. I wish I were strong enough to fight them...\n' +
          'but as you can see, I am very small, and very weak.'
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'merchant', 4),
        text: 'I\'ve been trying to escape, but all I have are all these ' +
          'weapons that are too big for my small hands.',
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'player'),
        text: '...'
      },
      {
        sprite: this.scene.add.sprite(0, 0, 'merchant', 5),
        text: 'I could...give you these weapons in exchange for some of your hearts? ' +
          'They\'re very cute and I want them. And then we can escape together!',
      },
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
      this.merchant.setCollideWorldBounds(true);
      this.merchantFighter = new Fighter(this.merchant);
      this.merchantFighter.speed = 60;
      this.merchantAI = new StayInPlaceAI(PLAYER_START_X / 2, PLAYER_START_Y);
    }

    if (fromTitle) {
      this.introIndex = 0;
      this.inIntro = true;
    }
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
    carpet.scaleX = 1.5;
    carpet.scaleY = 0.8;

    container.add(carpet);
    container.add(itemSprite);

    for (let i = 0; i < cost; i++) {
      let x = RANGE_X*(i - cost/2 + 0.5)/ cost;
      let y = OFFSET_Y;
      let heart = scene.add.sprite(x, y, 'heart');
      heart.scaleX = heart.scaleY = 0.7;
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
      heart.anims.play('heart-full');
      return Promise.delay(100);
    });
  }
  
  destroy() {
    for (let container of this.itemContainers) container.destroy();
    if (this.smoke) this.smoke.destroy();
    this.arrow.destroy();
    if (this.merchant) { this.merchant.destroy(); }
  }

  updateForIntro() {
    const introDialog = this.intro[this.introIndex];
    if (!this.dialog) {
      this.setDialog(introDialog.sprite, introDialog.text);
      this.introIndex += 1;

      if (this.introIndex >= this.intro.length) {
        this.inIntro = false;
      }
    }
    this._updateDialog();
  }

  update() {
    if (this.inIntro) {
      return this.updateForIntro();
    }
    this._updateDialog();

    let { player } = state;
    player.update(this.getInputs());

    let { merchant, scene, items, itemContainers } = this;
    let { physics } = scene;

    if (player.isDead()) {
      return new DelayScreen(this.scene, 1000, () => new LoseScreen(this.scene), () => this.destroy());
    }

    if (physics.overlap(player.sprite, this.arrow)) {
      this.destroy();
      return new FightingScreen(scene);
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
    state.background.anims.play('background-fighting');

    this.index = state.currentEnemy;
    this.enemy = state.enemies[this.index];
    this.enemyAI = state.enemyData[this.index].getAI();
    this.enemy.sprite.x = WIDTH / 2;
    this.enemy.sprite.y = HEIGHT - this.enemy.sprite.height;
    this.enemy.sprite.setCollideWorldBounds(true);
    this.hearts = _.times(player.healthMax, i => scene.add.sprite(32*(i+1), 32, 'heart'));

    this.arrow = scene.physics.add.sprite(-WIDTH, -HEIGHT, 'arrow');
    this.arrow.anims.play('arrow-bounce');

    // switch music for final boss
    const musicKey = this.isFinalBoss() ? 'music_2' : 'music_1';
    const musicVolume = this.isFinalBoss() ? 0.3 : 0.2;
    this.music = scene.sound.add(musicKey, { volume: musicVolume, loop: true})
    this.music.play()
  }

  isFinalBoss() {
    return this.index === (state.enemies.length - 1)
  }

  update() {
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
      if (this.index < state.enemyData.length - 1) {
        this.arrow.rotation = Math.PI;
        this.arrow.x = WIDTH/2;
        this.arrow.y = 12;
        state.currentEnemy = this.index + 1;

        if (physics.overlap(player.sprite, this.arrow)) {
          this.music.setLoop(false)
          this.destroy();
          player.sprite.y = HEIGHT/2 + 72;
          return new StagingScreen(this.scene);
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
    this.setDialog(sprite, 'You have failed to pass the tests of purgatory. Your suffering is eternal. Try again with another poor soul.');
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
    this.setDialog(sprite, 'You have escaped purgatory! Try again with another poor soul.');
  }

  update() {
    let dialogUpdate = this._updateDialog();
    if (dialogUpdate) return dialogUpdate;
    document.location.reload();
  }
}

