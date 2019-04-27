
class Fighter {
  constructor(sprite) {
    this.items = [];
    this.health = 5;
    this.sprite = sprite;
    this.speed = 160;
    this.state = FIGHTER_STANDING;
  }

  _preventWalkingWithState(state, time) {
    clearInterval(this._timeoutState);
    this.stop();
    this.state = state;
    if (time >= 0) {
      this._timeoutState = setTimeout(() => {
        this.state = FIGHTER_STANDING;
      }, time);
    }
  }

  getItem(item) {
    let { cost = 0 } = item;
    this._preventWalkingWithState(FIGHTER_GET_ITEM, Math.max(cost, 1)*1000);
    this.items.push(item);
  }

  dropItem(item) {
    let { cost = 0 } = item;
    this._preventWalkingWithState(FIGHTER_DROP_ITEM, Math.max(cost, 1)*1000);
    _.pull(this.items, item);
  }

  damage(amount) {
    if (this.state == FIGHTER_HITSTUN) return;
    this.health -= amount;
    if (this.health <= 0) {
      this._preventWalkingWithState(FIGHTER_DEAD, -1);
      let { sprite } = this;
      sprite.anims.play('die', true);
    }
  }

  hitstun(time) {
    this._preventWalkingWithState(FIGHTER_HITSTUN, time);
  }

  canMove() {
    return this.state == FIGHTER_WALKING || this.state == FIGHTER_STANDING;
  }

  _move(x, y) {
    let { sprite, speed } = this;
    sprite.setVelocityX(x*speed);
    sprite.setVelocityY(y*speed);
    if (x) sprite.anims.play(x < 0 ? 'left' : 'right', true);
    if (y) sprite.anims.play(y < 0 ? 'up' : 'down', true);
    if (sprite.body.velocity.x === 0 && sprite.body.velocity.y === 0) {
      sprite.anims.play('stand', true);
      this.state = FIGHTER_STANDING;
    } else {
      this.state = FIGHTER_WALKING;
    }
  }

  stop() {
    this._move(0, 0);
  }

  move(x, y) {
    if (this.canMove()) {
      this._move(x, y);
    }
  }
}


