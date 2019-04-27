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

    const distance =
      Math.pow(player.sprite.getCenter().x - enemy.sprite.getCenter().x, 2) +
      Math.pow(player.sprite.getCenter().y - enemy.sprite.getCenter().y, 2);
  
    // We'll try to move close to the player
    if (distance > 4000) {
      inputs.move.x = Math.sign(player.sprite.getCenter().x - enemy.sprite.getCenter().x);
      inputs.move.y = Math.sign(player.sprite.getCenter().y - enemy.sprite.getCenter().y);
    } else {
      // If we're close enough, try to perform an attack in the direction of the player
      inputs.attacking = true;
    }

    return inputs;
  }
}