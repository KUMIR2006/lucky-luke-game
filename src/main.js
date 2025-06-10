var config = {
  type: Phaser.AUTO,
  width: 1600,
  height: 1200,
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [GameScene],
};

var game = new Phaser.Game(config);
