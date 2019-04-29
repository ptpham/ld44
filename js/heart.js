

class HeartManager {
  constructor(scene) {
    this.scene = scene;
    this.hearts = [];
  }

  setMax(max) {
    let { scene, hearts } = this;
    if (hearts.length == max) return;

    while (hearts.length < max) {
      hearts.push(scene.add.sprite(32*(hearts.length+1), 16, 'heart'));
      _.last(hearts).setAlpha(0.8);
      _.last(hearts).depth = 2000;
      _.last(hearts).anims.play('heart-full');
    }
    for (let i = max; i < hearts.length; i++) {
      let currentHeart = hearts[i].anims.play('heart-empty');
      Promise.delay(1000).then(() => currentHeart.destroy());
    }
    this.hearts = hearts.slice(0, max);
  }

  update() {
    let { player } = state;
    this.setMax(player.health);
    for (let i = 0; i < player.health; i++) {
      this.hearts[i].anims.play('heart-full', true);
    }
  }
}
