

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
    
    if (player.sprite.y > 250) {
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
    player.sprite.x = WIDTH/10;
    player.sprite.y = HEIGHT/2;
    state.background.anims.play('background-fighting');

    this.enemy = state.enemies[state.currentEnemy];
    this.enemyAI = state.enemyData[state.currentEnemy].getAI();
    this.enemy.sprite.x = WIDTH / 2;
    this.enemy.sprite.y = HEIGHT / 2;
    this.hearts = _.times(player.healthMax, i => scene.add.sprite(32*(i+1), 32, 'heart'));
  }

  update() {
    let { player } = state;
    let inputs = this.getInputs();

    inputs.attacking = state.cursors.space.isDown;
    player.update(inputs);

    let enemyInputs = this.enemyAI.getInputsForEnemy(this.enemy, player);
    this.enemy.update(enemyInputs);

    if (player.isDead()) return new LoseScreen(this.scene);
    state.heartManager.update();
  }
}

class LoseScreen extends Screen {
  constructor(scene) {
    super(scene);
    this.lose = scene.add.text(WIDTH/4, HEIGHT/2, 'Your Suffering is Eternal', DEFAULT_FONT);
  }
}

