

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
      attacking: 0,
      pickItem: null,
      dropItem: null,
    };
  }
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
  update() {
    state.player.update(this.getInputs());
  }
}

class FightingSreen extends Screen {
}


