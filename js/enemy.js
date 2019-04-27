/*
  * enemy factory
  * Swappable AIs
*/

class EnemyAI {
  _makeBaseInputs(enemy, player) {
    // We can do base checks here like whether the enemy is getting
    // hit by the player
    return {
      move: { x: 0, y: 0 },
      damage: 0,
      hitstun: 0,
      attacking: false,
      pickItem: null,
    };
  }

  getInputsForEnemy(enemy, player) { return this._makeBaseInputs(enemy, player); }
}

class SimpleEnemyAI extends EnemyAI {
  getInputsForEnemy(enemy, player) {
    const inputs = this._makeBaseInputs(enemy, player);
  
    // We'll try to move to the player
    inputs.move.x = Math.sign(player.sprite.x - enemy.sprite.x);
    inputs.move.y = Math.sign(player.sprite.y - enemy.sprite.y);

    // If we're close enough, try to perform an attack in the direction of the player
    const distance =
      Math.pow(player.sprite.x - enemy.sprite.x, 2) +
      Math.pow(player.sprite.y - enemy.sprite.y, 2);
    
    if (distance < 10) {
      inputs.attacking = true;
    }

    return inputs;
  }
}