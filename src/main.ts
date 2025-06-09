import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: {
    preload() {},
    create() {
      this.add.text(200, 300, 'Hello Cowboy!', { color: '#ffffff' });
    },
    update() {},
  },
};

new Phaser.Game(config);
