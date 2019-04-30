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

    const damagingWeapon = enemy.items.find((item) => {
      return !(item instanceof Shield);
    });

    if (
      enemy.state instanceof FighterStanding &&
      enemy.lastStateChange + this.standingCooldown >= now
    ) {
      return _.clone(this.lastInputs);
    }
  
    // We'll try to move close to the player
    if (damagingWeapon.ready) {
      if (distance > 80) {
        inputs.move.x = Math.sign(Math.round(dX / 10));
        inputs.move.y = Math.sign(Math.round(dY / 10));
      } else {
        // If we're close enough, ready an attack
        this.readyForAttack = now + enemy.attackSpeed * 10;
        this.turnToPlayer(dX, dY);
        inputs.attacking = true;
      }
    } else if (distance < 90) {
      // Back off from the player a bit
      inputs.move.x = -Math.sign(Math.round(dX / 10));
      inputs.move.y = -Math.sign(Math.round(dY / 10));
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

    this.lastInputs = _.clone(inputs);
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
    this.nextFirePatternTime = 0;
    this.firePatternCooldown = 5000;
    this.corneredEndTime = 0;
    this.corneredCooldown = 1000;
    this.lastMoveX = 0
    this.lastMoveY = 0

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
    if (distance < 60) {
      let cornered = this.readyEscape(inputs, center, dX, dY, now, enemy);
      if (cornered) {
        this.readyAttack(inputs, weapon, dX, dY, DoubleSword);
      } else {
        this.readyAttack(inputs, weapon, dX, dY, Shield);
      }
    } else {
      this.readyFiring(inputs, weapon, center, dX, dY, now, player);
    }

    // oscillation check
    if ((this.lastMoveX || this.lastMoveY) &&
        this.lastMoveX === -inputs.move.x && this.lastMoveY === -inputs.move.y) {
      inputs.move.x = this.lastMoveX
      inputs.move.y = this.lastMoveY
    }

    // bounds check to prevent it from running into a wall repeatedly when it's too close
    if ((center.x + inputs.move.x < enemy.sprite.width / 2 && inputs.move.x < 0) ||
        (center.x + inputs.move.x > WIDTH - enemy.sprite.width / 2 && inputs.move.x > 0)) {
      inputs.move.x = 0
    }

    if ((center.y + inputs.move.y < enemy.sprite.height / 2 && inputs.move.y < 0) ||
        (center.y + inputs.move.y > HEIGHT - enemy.sprite.height / 2 && inputs.move.y > 0)) {
      inputs.move.y = 0
    }

    this.lastMoveX = inputs.move.x
    this.lastMoveY = inputs.move.y

    return inputs;
  }

  readyEscape(inputs, center, dX, dY, now, enemy) {
    let stepSize = 1;
    let dXMove = -Math.sign(Math.round(dX)) * stepSize;
    let dYMove = -Math.sign(Math.round(dY)) * stepSize;
    let cornered = false
    if ( (this.corneredEndTime > now) ||
        (center.x < 64 && center.y < 64 ||
      center.x > WIDTH - 64 && center.y < 64 ||
      center.x > WIDTH - 64 && center.y > HEIGHT - 64 ||
      center.x < 64 && center.y > HEIGHT - 64)
    ) {
      // avoid getting cornered
      dXMove = Math.sign(Math.round(WIDTH / 2 - center.x)) * stepSize;
      dYMove = Math.sign(Math.round(HEIGHT / 2 - center.y)) * stepSize;
      cornered = true

      if (this.corneredEndTime < now) {
        this.currentFirePattern = null;
        this.currentFirePatternIndex = 0;
        this.corneredEndTime += this.corneredCooldown
      }
    }

    inputs.move.x = dXMove;
    inputs.move.y = dYMove;
    return cornered
  }

  readyAttack(inputs, weapon, dX, dY, weaponClass) {
    if (weaponClass && !(weapon instanceof weaponClass)) {
      inputs.switchItem = true;
      return;
    }
    inputs.turnToOrientation = this.turnToPlayer(dX, dY);
    inputs.attacking = true;
  }

  readyFiring(inputs, weapon, center, dX, dY, now, player) {
    // If we're far enough away, make sure we're in line
    const canAttack = weapon instanceof Gun;
    if (!canAttack) {
      inputs.switchItem = true;
      return;
    }

    // already have a fire pattern, cycle through it
    if (this.currentFirePattern) {
      this.readyFirePattern(inputs, center, player);
      return;
    }

    // check fire pattern cooldown
    if (this.nextFirePatternTime > now) {
      return;
    }

    // pick a new fire pattern that we will go through
    this.currentFirePattern = _.sample(this.firePatterns);
    this.currentFirePatternIndex = 0;
    this.nextFirePatternTime += this.firePatternCooldown;
  }

  readyFirePattern(inputs, center, player) {
    const target = this.currentFirePattern[this.currentFirePatternIndex];
    const dX = target.x - center.x;
    const dY = target.y - center.y;

    if (Math.abs(dX) < 64 && Math.abs(dY) < 64) {
      // turn to player to attack
      const dXPlayer = player.sprite.getCenter().x - center.x;
      const dYPlayer = player.sprite.getCenter().y - center.y;

      inputs.turnToOrientation = this.turnToPlayer(dXPlayer, dYPlayer);
      inputs.attacking = true;
      this.currentFirePatternIndex += 1;
    } else {
        inputs.move.x = Math.sign(Math.round(dX/64));
        inputs.move.y = Math.sign(Math.round(dY/64));
    }

    if (this.currentFirePatternIndex >= this.currentFirePattern.length) {
      // finished the fire pattern
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
