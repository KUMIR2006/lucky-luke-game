var GameScene = new Phaser.Class({
  Extends: Phaser.Scene,

  initialize: function () {
    Phaser.Scene.call(this, { key: 'GameScene' });
  },

  preload: function () {
    //loading map
    this.load.tilemapTiledJSON('map', 'assets/map/western.json');
    this.load.image('western', 'assets/map/westernTileset.png');

    //loading chest
    this.load.spritesheet('chest', 'assets/chest/chest.png', {
      frameWidth: 96,
      frameHeight: 96,
      endFrame: 3,
    });

    //loading animations of character
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
    //creating animations
    this.createAnimations();

    //map settings
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('westernTileset', 'western');

    const groundLayer = map.createLayer('ground', tileset);
    const decorLayer = map.createLayer('decor', tileset);
    const cactusLayer = map.createLayer('cactus', tileset);
    const checkpointsLayer = map.createLayer('checkpoints', tileset);
    const fenceLayer = map.createLayer('fence', tileset);

    cactusLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(cactusLayer);
    fenceLayer.setCollisionByProperty({ collides: true });
    this.matter.world.convertTilemapLayer(fenceLayer);

    //player settings
    this.player = this.matter.add.sprite(200, 200, 'cowboy_walk_down');

    this.player.setDisplaySize(96, 96);
    this.player.setFixedRotation();
    this.player.setFrictionAir(0.1);
    this.player.setCircle(25);

    this.player.body.inertia = Infinity;
    this.player.body.frictionAir = 0.15;
    this.player.body.friction = 0.8;

    //camera settings
    this.cameras.main.startFollow(this.player, true, 1, 1);
    this.cameras.main.setBounds(0, 0, 3840, 3840);

    //world size
    this.matter.world.setBounds(0, 0, 3840, 3840);

    //control buttons
    this.cursors = this.input.keyboard.createCursorKeys();

    // creating chest
    this.chestOpened = false;

    this.chest = this.matter.add.sprite(1968, 1968, 'chest', 0, {
      isStatic: true,
    });
    this.chest.setFrame(0);
    this.chest.setBody(
      {
        type: 'rectangle',
        width: 60,
        height: 50,
      },
      {
        isStatic: true,
      },
    );

    //notification text
    this.chestText = this.add.text(0, 0, 'Нажмите X', {
      font: '32px Courier New',
      fill: '#e8a820',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
    });
    this.chestText.setOrigin(0.5, 0.5);
    this.chestText.setVisible(false);
    this.chestText.setScrollFactor(0);
    this.chestText.setDepth(1000);

    // start text
    this.startText = this.add.text(this.sys.game.config.width / 2, 150, 'Идите к центру карты', {
      font: '32px Courier New',
      fill: '#e8a820',
      backgroundColor: '#000000',
      padding: { x: 15, y: 10 },
    });
    this.startText.setOrigin(0.5, 0.5);
    this.startText.setScrollFactor(0);
    this.startText.setDepth(1000);
    this.startText.setAlpha(0.7);
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.startText,
        alpha: 0,
        duration: 1000,
        onComplete: () => this.startText.setVisible(false),
      });
    });
  },

  createAnimations: function () {
    // animation opening chest
    this.anims.create({
      key: 'chest_open',
      frames: this.anims.generateFrameNumbers('chest', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 0,
    });

    //animation of walking
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
    //variables player's movement
    var speed = 6;
    var vx = 0;
    var vy = 0;
    var isMoving = false;

    //logic of movement
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

    //stop animation when player is standing
    if (!isMoving) {
      this.player.anims.stop();
      this.player.setFrame(0);
      vx = 0;
      vy = 0;
    }

    this.player.setVelocity(vx, vy);

    // fix rotating
    this.player.setAngularVelocity(0);
    this.player.setRotation(0);
    if (
      Math.abs(this.player.body.velocity.x) < 0.1 &&
      Math.abs(this.player.body.velocity.y) < 0.1 &&
      !isMoving
    ) {
      this.player.setVelocity(0, 0);
    }

    // changing position of chest text
    this.chestText.setPosition(this.cameras.main.centerX, this.cameras.main.height - 200);

    //checking chest state(opened or not)
    if (!this.chestOpened) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.chest.x,
        this.chest.y,
      );

      // shows hint when player stays next to chest
      if (distance < 100) {
        if (!this.chestText.visible) {
          this.chestText.setVisible(true);
          this.chestText.setAlpha(0);
          this.tweens.add({
            targets: this.chestText,
            alpha: 0.7,
            duration: 300,
          });
        }

        // check for x key press
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('X'))) {
          this.openChest();
        }
      } else if (this.chestText.visible) {
        this.tweens.add({
          targets: this.chestText,
          alpha: 0,
          duration: 300,
          onComplete: () => {
            this.chestText.setVisible(false);
            this.chestText.setText('Нажмите X');
          },
        });
      }
    }
  },

  openChest() {
    if (this.chestOpened) return;
    this.chestOpened = true;

    this.chest.play('chest_open');

    this.chestText.setText('Победа!');

    this.chest.on('animationcomplete', () => {
      this.chest.setFrame(3);

      this.time.delayedCall(2000, () => {
        this.tweens.add({
          targets: this.chestText,
          alpha: 0,
          duration: 300,
          onComplete: () => this.chestText.setVisible(false),
        });
      });
    });
  },
});
