

class Fighter {
  constructor(sprite) {
    this.items = [];
    this.health = 5;
    this.sprite = sprite;
    this.speed = 160;
  }

  damage(amount) {
    this.health -= amount;
  }

  move(x, y) {
    let { sprite, speed } = this;
    sprite.setVelocityX(x*speed);
    sprite.setVelocityY(y*speed);
    if (x) sprite.anims.play(x < 0 ? 'left' : 'right', true);
    if (y) sprite.anims.play(y < 0 ? 'up' : 'down', true);
    if (sprite.body.velocity.x === 0 && sprite.body.velocity.y === 0) {
      sprite.anims.play('stand', true);
    }
  }
}


