

class Screen {
  constructor(scene) {
    this.scene = scene;
    this.lastTabTimeDown = 0;
  }

  setDialog(sprite, string) {
    sprite.x += sprite.width - DIALOG_WIDTH/2 + 16;
    let font = _.clone(DEFAULT_FONT);
    font.wordWrap = { width: DIALOG_WIDTH/2 };

    let dialog = this.scene.add.sprite(0, 0, 'dialog');
    let text = this.scene.add.text(-DIALOG_WIDTH/2 + 100, -DIALOG_HEIGHT/2 + 32, string, font);
    let nextText = this.scene.add.text(DIALOG_WIDTH/2 - 72, DIALOG_HEIGHT/2 - 40, 'Space', DEFAULT_FONT);
    let arrow = this.scene.add.sprite(DIALOG_WIDTH/2 - 16, DIALOG_HEIGHT/2 - 32, 'arrow');
    arrow.anims.play('arrow-bounce');
    arrow.rotation = -Math.PI/2;

    let children = [dialog, sprite, text, nextText, arrow];
    this.dialog = this.scene.add.container(WIDTH/2, HEIGHT/2, children);
    this.dialog.depth = 5000;
  }

  clearDialog() {
    if (this.dialog) {
      this.dialog.destroy();
      this.dialog = null;
    }
  }

  _updateDialog() {
    if (this.dialog) {
      if (state.cursors.space.isDown) this.clearDialog();
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
      attacking: false,
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
    let sprite = this.scene.add.sprite(0, 0, 'dude');
    this.setDialog(sprite, 'You find yourself in a strange place. Use the arrow keys to move.');
  }

  update() {
    let dialogUpdate = this._updateDialog();
    if (dialogUpdate) return dialogUpdate;
    else return new StagingScreen(this.scene);
  }
}

class StagingScreen extends Screen {
  constructor(scene, fromTitle) {
    super(scene);
    state.background.anims.play('background-staging');

    let ITEM_COUNT = 3;
    this.items = _.sampleSize(state.allItems, ITEM_COUNT);
    this.itemContainers = _.times(ITEM_COUNT, i => {
      let x = i*WIDTH/3 + WIDTH/6, y = HEIGHT/4;
      let result =scene.add.container(x, y);
      this.createRequirementHearts(result, this.items[i]);
      return result;
    });

    this.arrow = scene.physics.add.sprite(WIDTH/2, HEIGHT - 12, 'arrow');
    this.arrow.anims.play('arrow-bounce');

    this.merchant = scene.physics.add.sprite(PLAYER_START_X / 2, PLAYER_START_Y, 'merchant');
    this.merchant.setCollideWorldBounds(true);
    this.merchant.anims.play('merchant-idle');

    // if (fromTitle) {
    //   this.itemContainers.forEach((container) => {
    //     container.alpha = 0;
    //     container.
    //   });
    // }
  }

  createRequirementHearts(container, item) {
    let { scene } = this;
    let RANGE_X = 60;
    let OFFSET_Y = 60;
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
    this.merchant.destroy();
  }

  update() {
    let { player } = state;
    player.update(this.getInputs());

    let { merchant, scene, items, itemContainers } = this;
    let { physics } = scene;
    physics.collide(player.sprite, merchant);
    merchant.setVelocityX(0);
    merchant.setVelocityY(0);
    merchant.setVisible(true);

    for (let i = 0; i < items.length; i++) {
      let container = itemContainers[i];
      if (physics.overlap(player.sprite, container.itemSprite)) {
        this.selectItem(container, items[i]);
        player.update({ pickItem: items[i] });
      }
    }

    if (physics.overlap(player.sprite, this.arrow)) {
      this.destroy();
      return new FightingScreen(scene);
    }

    state.heartManager.update();
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
  }

  update() {
    let { player } = state;
    let { physics } = this.scene;
    let inputs = this.getInputs();
    let enemyInputs = this.enemyAI.getInputsForEnemy(this.enemy, player);

    inputs.attacking = state.cursors.space.isDown;

    // resolve attacks
    physics.overlap(player.attackGroup, this.enemy.sprite, (obj, attackSprite) => {
      attackSprite.attack.onCollideEnemy(this.enemy, enemyInputs)
    })

    physics.overlap(this.enemy.attackGroup, player.sprite, (obj, attackSprite) => {
      attackSprite.attack.onCollideEnemy(player, inputs)
    })

    player.update(inputs);
    this.enemy.update(enemyInputs);

    physics.collide(player.sprite, this.enemy.sprite);
    state.heartManager.update();

    if (player.isDead()) return new LoseScreen(this.scene);
    if (this.enemy.isDead()) {
      console.log('enemy dead!')
      if (this.index < state.enemyData.length - 1) {
        this.arrow.x = WIDTH/2;
        this.arrow.y = 12;
        state.currentEnemy = this.index + 1;

        if (physics.overlap(player.sprite, this.arrow)) {
          this.destroy();
          player.sprite.y = HEIGHT/2 + 72;
          return new StagingScreen(this.scene);
        }
      } else {
        return new VictoryScreen(this.scene);
      }
    }
  }

  destroy() {
    this.arrow.destroy();
    this.enemy.sprite.setCollideWorldBounds(false);
    this.enemy.sprite.x = -WIDTH;
    this.enemy.sprite.y = -HEIGHT;
  }
}

class LoseScreen extends Screen {
  constructor(scene) {
    super(scene);
    this.text = scene.add.text(WIDTH/4, HEIGHT/2, 'Your suffering is eternal', DEFAULT_FONT);
  }
}

class VictoryScreen extends Screen {
  constructor(scene) {
    super(scene);
    this.text = scene.add.text(WIDTH/4, HEIGHT/2, 'You have escaped purgatory', DEFAULT_FONT);
  }
}

