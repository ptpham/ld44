/*
  * enemy factory
  * Swappable AIs
*/

class EnemyAI {
  _makeBaseInputs() {
    return {
      move: { x: 0, y: 0 },
      pushback: {x: 0, y: 0},
      damage: 0,
      hitstun: 0,
      attacking: false,
      pickItem: null,
      switchItem: false,
      turnToOrientation: null,
    };
  }

  getInputsForEnemy(enemy, player) { return this._makeBaseInputs(); }
}

class StayInPlaceAI extends EnemyAI {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
  }

  getInputsForEnemy(enemy, player) {
    const inputs = this._makeBaseInputs();
    const dX = this.x - enemy.sprite.getCenter().x;
    const dY = this.y - enemy.sprite.getCenter().y;

    const distance =
      Math.sqrt(
        Math.pow(dX, 2) +
        Math.pow(dY, 2)
      );

    if (distance > 10) {
      inputs.move.x = Math.sign(Math.round(dX / 10));
      inputs.move.y = Math.sign(Math.round(dY / 10));
    }
    return inputs;
  }
}

class SimpleEnemyAI extends EnemyAI {
  constructor() {
    super();
    this.standingCooldown = 500;
    this.lastInputs = this._makeBaseInputs();
    this.readyForAttack = 0;
  }

  getInputsForEnemy(enemy, player) {
    const now = enemy.sprite.scene.time.now;
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
      enemy.lastStateChange + this.standingCooldown >= now
    ) {
      return this.lastInputs;
    }
  
    // We'll try to move close to the player
    if (distance > 80) {
      inputs.move.x = Math.sign(Math.round(dX / 10));
      inputs.move.y = Math.sign(Math.round(dY / 10));
    } else {
      // If we're close enough, ready an attack
      this.readyForAttack = now + enemy.attackSpeed * 10;
      this.turnToPlayer(dX, dY);
      inputs.attacking = true;
    }

    if (this.readyForAttack) {
      if (this.readyForAttack < now) {
        inputs.attacking = true;
        this.readyForAttack = 0;
        return inputs;
      } else {
        return inputs;
      }
    }

    this.lastInputs = inputs;
    return inputs;
  }

  turnToPlayer(dX, dY) {
    if (Math.abs(dX) > Math.abs(dY)) {
      if (dX < 0) {
        return 'left';
      }
      return 'right';
    } else {
      if (dY < 0) {
        return 'up';
      }
      return 'down';
    }
  }
}

class HitAndRunAI extends SimpleEnemyAI {
  getInputsForEnemy(enemy, player) {
    const now = enemy.sprite.scene.time.now;
    let inputs = this._makeBaseInputs();

    const isUsingShield = enemy.getCurrentItem() instanceof Shield;
    const damagingWeapon = enemy.items.find((item) => {
      return !(item instanceof Shield);
    });

    const dX = player.sprite.getCenter().x - enemy.sprite.getCenter().x;
    const dY = player.sprite.getCenter().y - enemy.sprite.getCenter().y;

    if (damagingWeapon.ready) {
      // Do the Simple AI thing
      inputs = SimpleEnemyAI.prototype.getInputsForEnemy.call(this, enemy, player);
      if (isUsingShield) inputs.switchItem = true;
      console.log(inputs);
    } else {
      if (!isUsingShield) inputs.switchItem = true;
      inputs.turnToOrientation = this.turnToPlayer(dX, dY);
      inputs.attacking = true;
      // Run Away :D
      inputs.move.x = -Math.sign(Math.round(dX / 10));
      inputs.move.y = -Math.sign(Math.round(dY / 10));
    }
    return inputs;
  }
}

class ShooterEnemyAI extends EnemyAI {
  constructor() {
    super();
    this.lastInputs = this._makeBaseInputs();
    this.currentFirePattern = null;
    this.currentFirePatternIndex = 0;
    this.readyForFirePattern = 0;
    this.firePatternCooldown = 5000;

    this.firePatternBottom = [
      { x: 0, y: HEIGHT, direction: 'up' },
      { x: WIDTH / 4, y: HEIGHT, direction: 'up' },
      { x: WIDTH / 2, y: HEIGHT, direction: 'up' },
      { x: 3 * WIDTH / 4, y: HEIGHT, direction: 'up' },
      { x: WIDTH, y: HEIGHT, direction: 'up' },
    ];

    this.firePatternLeft = [
      { x: 0, y: 0, direction: 'right' },
      { x: 0, y: HEIGHT / 4, direction: 'right' },
      { x: 0, y: HEIGHT / 2, direction: 'right' },
      { x: 0, y: 3 * HEIGHT / 4, direction: 'right' },
      { x: 0, y: HEIGHT, direction: 'right' },
    ];

    this.firePatternRight = [
      { x: WIDTH, y: 0, direction: 'left' },
      { x: WIDTH, y: HEIGHT / 4, direction: 'left' },
      { x: WIDTH, y: HEIGHT / 2, direction: 'left' },
      { x: WIDTH, y: 3 * HEIGHT / 4, direction: 'left' },
      { x: WIDTH, y: HEIGHT, direction: 'left' },
    ];

    this.firePatternTop = [
      { x: 0, y: 0, direction: 'down' },
      { x: WIDTH / 4, y: 0, direction: 'down' },
      { x: WIDTH / 2, y: 0, direction: 'down' },
      { x: 3 * WIDTH / 4, y: 0, direction: 'down' },
      { x: WIDTH, y: 0, direction: 'down' },
    ];

    this.firePatterns = [
      this.firePatternBottom,
      this.firePatternTop,
      this.firePatternLeft,
      this.firePatternRight,
    ];
  }

  getInputsForEnemy(enemy, player) {
    // This AI tries to stay away from the player
    // and shoot from a distance
    const weapon = enemy.getCurrentItem();

    const now = enemy.sprite.scene.time.now;
    const inputs = this._makeBaseInputs();
    const center = enemy.sprite.getCenter();

    const dX = player.sprite.getCenter().x - center.x;
    const dY = player.sprite.getCenter().y - center.y;

    const distance =
      Math.sqrt(
        Math.pow(dX, 2) +
        Math.pow(dY, 2)
      );

    // Get away from the player
    if (distance < 130) {
      this.readyEscape(inputs, center, dX, dY);
      this.readyBlocking(inputs, weapon, dX, dY);
    } else {
      this.readyFiring(inputs, weapon, center, dX, dY, now);
    }

    if (!this.readyForFirePattern) {
      this.readyForFirePattern = now + this.firePatternCooldown;
    }
    return inputs;
  }

  readyEscape(inputs, center, dX, dY) {
    inputs.move.x = -Math.sign(Math.round(dX / 10));
    inputs.move.y = -Math.sign(Math.round(dY / 10));
    this.currentFirePattern = null;
    this.currentFirePatternIndex = 0;

    if (
      center.x < 64 && center.y < 64 ||
      center.x > WIDTH - 64 && center.y < 64 ||
      center.x > WIDTH - 64 && center.y > HEIGHT - 64 ||
      center.x < 64 && center.y > HEIGHT - 64
    ) {
      // Avoid getting cornered
      inputs.move.x = Math.sign(WIDTH / 2 - center.x);
      inputs.move.y = Math.sign(HEIGHT / 2 - center.y);
    }
  }

  readyBlocking(inputs, weapon, dX, dY) {
    const canBlock = weapon instanceof Shield;
    if (!canBlock) {
      inputs.switchItem = true;
      return;
    }
    inputs.turnToOrientation = this.turnToPlayer(dX, dY);
    inputs.attacking = true;
  }

  readyFiring(inputs, weapon, center, dX, dY, now) {
    // If we're far enough away, make sure we're in line
    const canAttack = weapon instanceof Gun;
    if (!canAttack) {
      inputs.switchItem = true;
      return;
    }
    if (this.currentFirePattern) {
      this.readyFirePattern(inputs, center);
      return;
    }

    if (this.readyForFirePattern <= now) {
      this.readyForFirePattern = false;
      this.currentFirePattern = _.sample(this.firePatterns);
      this.currentFirePatternIndex = 0;
    }

    // Try to get aligned with the player
    if (dX > dY) {
      inputs.move.y = Math.sign(Math.round(dY / 10));
    } else {
      inputs.move.x = Math.sign(Math.round(dX / 10));
    }

    inputs.turnToOrientation = this.turnToPlayer(dX, dY);
    inputs.attacking = true;
  }

  readyFirePattern(inputs, center) {
    const target = this.currentFirePattern[this.currentFirePatternIndex];
    const dX = target.x - center.x;
    const dY = target.y - center.y;

    inputs.move.x = Math.sign(Math.round(dX/64));
    inputs.move.y = Math.sign(Math.round(dY/64));
    inputs.turnToOrientation = target.direction;
    inputs.attacking = true;

    if (inputs.move.x + inputs.move.y === 0) {
      this.currentFirePatternIndex += 1;
    }

    if (this.currentFirePatternIndex >= this.currentFirePattern.length) {
      this.currentFirePattern = null;
      this.currentFirePatternIndex = 0;
    }
  }

  turnToPlayer(dX, dY) {
    if (Math.abs(dX) > Math.abs(dY)) {
      if (dX < 0) {
        return 'left';
      }
      return 'right';
    } else {
      if (dY < 0) {
        return 'up';
      }
      return 'down';
    }
  }
}