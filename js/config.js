
let config = {
    type: Phaser.AUTO,
    scale: {
      zoom: 2,
      width: WIDTH,
      height: HEIGHT,
      expandParent: true,
      mode: Phaser.Scale.ScaleModes.ENVELOP
    },
    render: {
      pixelArt: true
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: DEBUG,
      },
    }
};

