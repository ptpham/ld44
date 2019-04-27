

class Screen {
  constructor(scene) {
    this.scene = scene;
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

    return {
      move: { x: playerX, y: playerY },
      damage: 0,
      hitstun: 0,
      attacking: false,
      pickItem: null,
      dropItem: null,
    };
  }

  update() { }
}

class TitleScreen extends Screen {
  update() {
    if ( state.cursors.left.isDown || state.cursors.right.isDown
      || state.cursors.up.isDown || state.cursors.down.isDown) {
      return new StagingScreen(this.scene);
    }
  }
}

class StagingScreen extends Screen {
  constructor(scene) {
    super(scene);
    state.background.anims.play('background-staging');
    this.items = _.sampleSize(state.allItems, 3);
    this.sprites = _.map(this.items, (item, i) =>
      scene.physics.add.sprite(i*WIDTH/3 + WIDTH/6, HEIGHT/4, item.spriteName));
    this.arrow = scene.physics.add.sprite(WIDTH/2, HEIGHT - 32, 'arrow');
    this.arrow.anims.play('arrow-bounce');
  }
  
  destroy() {
    for (let sprite of this.sprites) sprite.destroy();
    this.arrow.destroy();
  }

  update() {
    let { player } = state;
    player.update(this.getInputs());
  
    let { scene, items, sprites } = this;
    let { physics } = scene;
    for (let i = 0; i < items.length; i++) {
      if (physics.overlap(player.sprite, sprites[i])) {
        player.update({ pickItem: items[i] });
        sprites[i].destroy();
      }
    }
    
    if (
      player.sprite.y > 250 &&
      player.sprite.x < WIDTH / 2 + 50 &&
      player.sprite.x > WIDTH / 2 - 50
    ) {
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
    this.enemy.sprite.y = HEIGHT / 2;
    this.enemy.sprite.setCollideWorldBounds(true);
    this.hearts = _.times(player.healthMax, i => scene.add.sprite(32*(i+1), 32, 'heart'));

    this.arrow = scene.physics.add.sprite(-WIDTH, -HEIGHT, 'arrow');
    this.arrow.anims.play('arrow-bounce');
  }

  update() {
    let { player } = state;
    let { physics } = this.scene;
    let inputs = this.getInputs();

    inputs.attacking = state.cursors.space.isDown;
    player.update(inputs);

    let enemyInputs = this.enemyAI.getInputsForEnemy(this.enemy, player);
    this.enemy.update(enemyInputs);

    physics.collide(player.sprite, this.enemy.sprite);

    if (player.isDead()) return new LoseScreen(this.scene);
    if (this.enemy.isDead()) {
      if (this.index < state.enemyData.length - 1) {
        this.arrow.x = WIDTH/2;
        this.arrow.y = 32;
        state.currentEnemy = this.index + 1;

        if (
          player.sprite.y < 32 &&
          player.sprite.x < WIDTH / 2 + 50 &&
          player.sprite.x > WIDTH / 2 - 50
        ) {
          this.destroy();
          player.sprite.y = HEIGHT - 50;
          return new StagingScreen(this.scene);
        }
      } else {
        return new VictoryScreen(this.scene);
      }
    }

    state.heartManager.update();
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

