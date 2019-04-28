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
    if (input.switchItem) {
      this.fighter.currentItemIndex = (this.fighter.currentItemIndex + 1) % this.fighter.items.length
      console.log('switched to item', this.fighter.currentItemIndex)
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
      return new FighterHitstun(this.fighter, input.hitstun);
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
      let { sprite, speed, spriteKey } = this.fighter;
      sprite.setVelocityX(x*speed);
      sprite.setVelocityY(y*speed);

      let anim = `${spriteKey}_move`;
      if (y) anim = y < 0 ? `${anim}_up` : `${anim}_down`;
      if (x) anim = x < 0 ? `${anim}_left` : `${anim}_right`;

      if (x == 0 && y == 0) {
        return new FighterStanding(this.fighter);
      } else {
        sprite.anims.play(anim, true);
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
    item.resetCooldown()
    this.fighter.attackGroup.addMultiple(item.getAttacks(this.fighter).map(x => x.sprite))
  }

  update(input) {
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;
    if (this.done) return new FighterStanding(this.fighter);

    const spriteKey = this.fighter.spriteKey;

    this.fighter.sprite.setVelocityX(0)
    this.fighter.sprite.setVelocityY(0)

    let anim = `${spriteKey}_attack_${this.fighter.orientation}`;
    anim = this.fighter.getPlayerAnimationForMove(anim);
    this.fighter.sprite.anims.play(anim);
  }
}

class FighterStanding extends FighterState {
  update(input) {
    let { fighter } = this;
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;

    let { sprite, spriteKey } = this.fighter;
    let anim = `${spriteKey}_stand_${this.fighter.orientation}`;
    anim = this.fighter.getPlayerAnimationForAttack(anim);
    sprite.anims.play(anim, true);
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
    fighter.sprite.anims.play(`${fighter.spriteKey}_dead`, true);
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
    this.fighter.sprite.anims
      .play(`${this.fighter.spriteKey}_hitstun`, true);
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

    const { sprite, spriteKey } = this.fighter;
    sprite.anims.play(`${spriteKey}_pick`, true);
    sprite.setVelocityX(0);
    sprite.setVelocityY(0);
  }
}

class Fighter {
  constructor(sprite) {
    this.items = [];
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
    this.spriteKey = sprite.frame.texture.key;

    this.lastStateChange = 0;
    this.attackGroup = this.sprite.scene.physics.add.group()
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
    // * switchItem: boolean (update current item index)
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

  takeDamage(amount) {
    if (this.state instanceof FighterHitstun) {
      return;
    }
    this.health -= amount;
  }

  getPlayerAnimationForAttack(key) {
    if (this.spriteKey !== 'player') {
      // Only available for player
      return key;
    }

    const item = this.getCurrentItem();
    if (!item.playerAttackSprite) {
      return key;
    }

    return `${key}_${item.playerAttackSprite}`;
  }

  getPlayerAnimationForMove(key) {
    if (this.spriteKey !== 'player') {
      // Only available for player
      return key;
    }

    const item = this.getCurrentItem();
    if (!item.playerMoveSprite) {
      return key;
    }

    return `${key}_${item.playerMoveSprite}`;
  }
}
