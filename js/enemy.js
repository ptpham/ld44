/*
  * enemy factory
  * Swappable AIs
*/

class EnemyAI {
  _makeBaseInputs() {
    return {
      move: { x: 0, y: 0 },
      damage: 0,
      hitstun: 0,
      attacking: false,
      pickItem: null,
    };
  }

  getInputsForEnemy(enemy, player) { return this._makeBaseInputs(); }
}

class SimpleEnemyAI extends EnemyAI {
  constructor() {
    super();
    this.standingCooldown = 500;
    this.lastInputs = this._makeBaseInputs();
  }

  getInputsForEnemy(enemy, player) {
    const inputs = this._makeBaseInputs();

    const dX = player.sprite.getCenter().x - enemy.sprite.getCenter().x;
    const dY = player.sprite.getCenter().y - enemy.sprite.getCenter().y;

    const distance =
      Math.sqrt(
        Math.pow(dX, 2) +
        Math.pow(dY, 2)
      );

    if (
      enemy.state instanceof FighterStanding &&
      enemy.lastStateChange + this.standingCooldown >= enemy.sprite.scene.time.now
    ) {
      return this.lastInputs;
    }
  
    // We'll try to move close to the player
    if (distance > 80) {
      inputs.move.x = Math.sign(Math.round(dX / 10));
      inputs.move.y = Math.sign(Math.round(dY / 10));
    } else {
      // If we're close enough, try to perform an attack in the direction of the player
      inputs.attacking = true;
    }

    this.lastInputs = inputs;
    return inputs;
  }
}