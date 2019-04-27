
class FighterState {
  constructor(fighter) {
    this.fighter = fighter;
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

    let { x, y } = input.move || {};
    let { sprite, speed } = this.fighter;
    sprite.setVelocityX(x*speed);
    sprite.setVelocityY(y*speed);
    if (x) sprite.anims.play(x < 0 ? 'left' : 'right', true);
    if (y) sprite.anims.play(y < 0 ? 'up' : 'down', true);
    if (x == 0 && y == 0) {
      return new FighterStanding(this.fighter);
    }
  }
}

class FighterStanding extends FighterState {
  update(input) {
    let defaultState = this._updateDefault(input);
    if (defaultState) return defaultState;

    let { sprite } = this.fighter;
    sprite.anims.play('stand', true);
    if (input.move) {
      return new FighterMoving(this.fighter);
    }
    return this;
  }
}

class FighterDead extends FighterState {
  constructor(fighter) {
    super(fighter);
    fighter.sprite.anims.play('stand', true);
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

class Fighter {
  constructor(sprite) {
    this.items = [];
    this.health = 5;
    this.sprite = sprite;
    this.speed = 160;
    this.state = new FighterStanding(this);
  }

  update(input) {
    this.state = this.state.update(input) || this.state;
  }
}


