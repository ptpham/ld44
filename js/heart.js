

class HeartManager {
  constructor(scene) {
    this.scene = scene;
    this.hearts = [];
  }

  setMax(max) {
    let { scene, hearts } = this;
    if (hearts.length == max) return;

    while (hearts.length < max) {
      hearts.push(scene.add.sprite(32*(hearts.length+1), 32, 'heart'));
      _.last(hearts).setAlpha(0.5);
      _.last(hearts).depth = 2000;
    }
    for (let i = max; i < hearts.length; i++) hearts[i].destroy();
    this.hearts = hearts.slice(0, max);
  }

  update() {
    let { player } = state;
    this.setMax(player.healthMax);
    for (let i = 0; i < player.healthMax; i++) {
      let animation = (i < player.health) ? 'heart-full' : 'heart-empty';
      this.hearts[i].anims.play(animation);
    }
  }
}
