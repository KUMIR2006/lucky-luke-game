var GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  preload: function () {
    this.load.spritesheet('cowboy_walk_left', 'assets/walk/cowboy_walk_left.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 3,
    });
    this.load.spritesheet('cowboy_walk_right', 'assets/walk/cowboy_walk_right.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 3,
    });
    this.load.spritesheet('cowboy_walk_up', 'assets/walk/cowboy_walk_up.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 3,
    });
    this.load.spritesheet('cowboy_walk_down', 'assets/walk/cowboy_walk_down.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 3,
    });
  },

  create: function () {
    console.log('Textures loaded:', this.textures.getTextureKeys());

    this.createAnimations();

    this.player = this.matter.add.sprite(100, 100, 'cowboy_walk_down');
    this.player.setDisplaySize(100, 100);
    this.player.setFixedRotation();
    this.player.setFrictionAir(0.1);
    this.player.setCircle(25);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.matter.world.setBounds(0, 0, 1600, 1200);

    this.cursors = this.input.keyboard.createCursorKeys();
  },

  createAnimations: function () {
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('cowboy_walk_left', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
      yoyo: false,
    });

    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('cowboy_walk_right', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('cowboy_walk_up', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('cowboy_walk_down', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: -1,
    });
  },

  update: function () {
    var speed = 2.5;
    var vx = 0;
    var vy = 0;
    var isMoving = false;

    if (this.cursors.left.isDown) {
      vx = -speed;
      this.player.play('walk_left', true);
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      vx = speed;
      this.player.play('walk_right', true);
      isMoving = true;
    } else if (this.cursors.up.isDown) {
      vy = -speed;
      this.player.play('walk_up', true);
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      vy = speed;
      this.player.play('walk_down', true);
      isMoving = true;
    }

    if (!isMoving) {
      this.player.anims.stop();
      this.player.setFrame(0);
    }

    this.player.setVelocity(vx, vy);
  },
});
