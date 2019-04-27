class FighterState {
  constructor(fighter) {
    this.fighter = fighter;
  }

  _updateItem(input) {
    let { fighter } = this;
    let { pickItem } = input;
    if (pickItem && !fighter.hasItem(pickItem)) {
      return new FighterPickItem(fighter, pickItem); 
    }
  }

  _updateHealth(input) {
    let { fighter } = this;
    if (input.damage) {
      fighter.health -= input.damage;
    }

    if (fighter.health <= 0) {
      return new FighterDead(fighter);
    }
  }

  _updateDefault(input) {
    let healthUpdate = this._updateHealth(input);
    if (healthUpdate) return healthUpdate;

    if (input.hitstun) {
      return new FighterHitstun(fighter, input.hitstun);
    }
  }

  update(input) { }
}

class FighterMoving extends FighterState {
  update(input) {
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;

    if (input.attacking && this.fighter.isReadyToAttack()) {
      return new FighterAttacking(this.fighter, this.fighter.getCurrentItem());
    }
  
    if (input.move) {
      let { x, y } = input.move;
      let { sprite, speed } = this.fighter;
      sprite.setVelocityX(x*speed);
      sprite.setVelocityY(y*speed);
      if (x) sprite.anims.play(x < 0 ? 'left' : 'right', true);
      if (y) sprite.anims.play(y < 0 ? 'up' : 'down', true);
      if (x == 0 && y == 0) {
        return new FighterStanding(this.fighter);
      } else {
        // store last direction we were moving in for attack orientation
        this.fighter.orientation = getOrientationStr(x, y)
      }
    }
    
    return this._updateItem(input);
  }
}

class FighterAttacking extends FighterState {
  constructor(fighter, item) {
    super(fighter);
    this.item = item;

    const duration = this.fighter.attackSpeed;
    this.done = false;
    setTimeout(() => { this.done = true; }, duration);
  }

  update(input) {

    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;
    if (this.done) return new FighterStanding(this.fighter);

    this.fighter.sprite.setVelocityX(0)
    this.fighter.sprite.setVelocityY(0)

    const item = this.fighter.getCurrentItem()
    const center = this.fighter.sprite.getCenter()
    this.fighter.attacks.push(item.newAttacks(center.x, center.y, this.fighter.orientation))
    item.resetCooldown()
  }
}

class FighterStanding extends FighterState {
  update(input) {
    let { fighter } = this;
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;

    let { sprite } = this.fighter;
    sprite.anims.play(`stand_${this.fighter.orientation}`, true);
    if (input.attacking && this.fighter.isReadyToAttack()) {
      return new FighterAttacking(this.fighter, this.fighter.getCurrentItem());
    }

    if (input.move && (input.move.x || input.move.y)) {
      return new FighterMoving(fighter);
    }

    return this._updateItem(input);
  }
}

class FighterDead extends FighterState {
  constructor(fighter) {
    super(fighter);
    fighter.sprite.anims.play('stand_down', true);
  }
}

class FighterHitstun extends FighterState {
  constructor(fighter, duration) {
    super(fighter);
    this.done = false;
    setTimeout(() => { this.done = true; }, duration);
  }

  update(input) {
    let healthUpdate = this._updateHealth(input);
    if (healthUpdate) return healthUpdate;
    if (this.done) return new FighterStanding(this.fighter);
  }
}

class FighterPickItem extends FighterState {
  constructor(fighter, item) {
    super(fighter);
    this.done = true;
    if (!fighter.hasItem(item)) {
      fighter.items.push(item);
      this.done = false;

      let promise;
      let duration = 100;
      let cost = Math.max(item.cost || 0, 1);
      for (let i = 0; i < cost; i++) {
        promise = fighter.adjustHealth(-1, duration);
      }
      promise.then(() => this.done = true);
    }
  }

  update(input) {
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;
    if (this.done) return new FighterStanding(this.fighter);

    const sprite = this.fighter.sprite;
    sprite.anims.play('stand', true);
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
  }
}

class FighterDropItem extends FighterState {
  constructor(fighter, item) {
    super(fighter);
    _.pull(fighter.items, item);
    this.done = false;
    setTimeout(() => { this.done = true; }, 500);
  }

  update(input) {
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;
    if (this.done) return new FighterStanding(this.fighter);
  }
}

class Fighter {
  constructor(sprite) {
    this.items = [new DefaultSword(sprite.scene)];
    this.currentItemIndex = 0;
    this.health = 5;
    this.healthMax = 7;
    this.sprite = sprite;
    this.speed = 160;
    this.state = new FighterStanding(this);
    this.baseDamage = 1;
    this.attackSpeed = 500;
    this.stunDuration = 200;
    this._adjustHealthPromise = Promise.resolve();
    this.scene = this.sprite.scene
    this.orientation = 'down'
    this.attacks = []

    this.lastStateChange = 0;
  }

  adjustHealth(amount, duration) {
    this._adjustHealthPromise = this._adjustHealthPromise
      .delay(duration).then(() => { this.health += amount; });
    return this._adjustHealthPromise;
  }

  hasItem(item) {
    return _.find(this.items, item) != null;
  }

  isDead() {
    return this.state instanceof FighterDead;
  }

  update(input) {
    // Input is anobject containing the following:
    // * move: {x, y}
    // * damage: number (amount of health taken)
    // * hitstun: number (duration of the stun)
    // * attacking: boolean
    // * pickItem: item (item the player is picking up)
    // * dropItem: item (item the player is dropping)
    const oldState = this.state;
    this.state = this.state.update(input) || this.state;

    if (oldState.constructor.name !== this.state.constructor.name) {
      this.lastStateChange = this.sprite.scene.time.now;
    }
  }

  isReadyToAttack() {
    return this.getCurrentItem() && this.getCurrentItem().ready
  }

  getCurrentItem() {
    return this.items[this.currentItemIndex];
  }

  getDamage() {
    return this.baseDamage;
  }
}
