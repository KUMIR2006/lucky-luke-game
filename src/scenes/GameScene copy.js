export class GameScene {
  constructor() {
    super('GameScene');
  }

  preload() {
    // Загружаем спрайты для всех направлений
    this.load.spritesheet('cowboy_walk_left', 'assets/walk/cowboy_walk_left.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 4,
    });
    this.load.spritesheet('cowboy_walk_right', 'assets/walk/cowboy_walk_right.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 4,
    });
    this.load.spritesheet('cowboy_walk_up', 'assets/walk/cowboy_walk_up.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 4,
    });
    this.load.spritesheet('cowboy_walk_down', 'assets/walk/cowboy_walk_down.png', {
      frameWidth: 32,
      frameHeight: 32,
      endFrame: 4,
    });
  }

  create() {
    const mapWidth = 1600;
    const mapHeight = 1200;

    // Создание анимаций
    this.anims.create({
      key: 'walk_left',
      frames: this.anims.generateFrameNumbers('cowboy_walk_left', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_right',
      frames: this.anims.generateFrameNumbers('cowboy_walk_right', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_up',
      frames: this.anims.generateFrameNumbers('cowboy_walk_up', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'walk_down',
      frames: this.anims.generateFrameNumbers('cowboy_walk_down', { start: 0, end: 4 }),
      frameRate: 10,
      repeat: -1,
    });

    this.player = this.matter.add.sprite(100, 100, 'cowboy_walk_down');

    this.player.setFixedRotation();
    this.player.setFrictionAir(0.1);
    this.player.setCircle(16);
    this.player.play('walk_down');

    // Камера и границы
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.matter.world.setBounds(0, 0, mapWidth, mapHeight);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const speed = 2.5;
    let vx = 0;
    let vy = 0;

    if (this.cursors.left.isDown) {
      vx = -speed;
      this.player.setTexture('cowboy_walk_left');
      this.player.play('walk_left', true);
    } else if (this.cursors.right.isDown) {
      vx = speed;
      this.player.setTexture('cowboy_walk_right');
      this.player.play('walk_right', true);
    } else if (this.cursors.up.isDown) {
      vy = -speed;
      this.player.setTexture('cowboy_walk_up');
      this.player.play('walk_up', true);
    } else if (this.cursors.down.isDown) {
      vy = speed;
      this.player.setTexture('cowboy_walk_down');
      this.player.play('walk_down', true);
    } else {
      this.player.anims.stop();
    }

    this.player.setVelocity(vx, vy);
  }
}
