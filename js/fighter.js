
class Fighter {
  constructor(scene, sprite) {
    this.items = [];
    this.health = 5;
    this.sprite = sprite;
    this.speed = 160;
    this.state = FIGHTER_STANDING;
  }

  damage(amount) {
    if (this.state == FIGHTER_HITSTUN) return;
    this.health -= amount;
  }

  hitstun(time) {
    this.move(0, 0);
    this.state = FIGHTER_HITSTUN;
    setTimeout(() => {
      this.state = FIGHTER_STANDING;
    }, time);
  }

  move(x, y) {
    let { sprite, speed } = this;
    if (this.state.FIGHTER_HITSTUN) {
      x = 0;
      y = 0;
    }

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
}


