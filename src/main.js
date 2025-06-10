var config = {
  type: Phaser.AUTO,
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  scene: [GameScene],
};

var game = new Phaser.Game(config);
