let gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
	this.playerSpeed = 150;
	this.jumpSpeed = -600;
};

gameScene.preload = function () {
	this.load.image('ground', './assets/images/ground.png');
	this.load.image('platform', './assets/images/platform.png');
	this.load.image('block', './assets/images/block.png');
	this.load.image('goal', './assets/images/gorilla3.png');
	this.load.image('barrel', './assets/images/barrel.png');

	this.load.spritesheet('player', './assets/images/player_spritesheet.png', {
		frameWidth: 28,
		frameHeight: 30,
		margin: 1,
		spacing: 1
	});

	this.load.spritesheet('fire', './assets/images/fire_spritesheet.png', {
		frameWidth: 20,
		frameHeight: 21,
		margin: 1,
		spacing: 1
	});

	this.load.json('level1', './assets/levels/level1.json');
};

gameScene.initLevel = function () {
	this.levelData = this.cache.json.get('level1');

	// world bounds
	this.physics.world.bounds.width = this.levelData.level.width;
	this.physics.world.bounds.height = this.levelData.level.height;

	// platform group
	this.platforms = this.physics.add.staticGroup();
	this.levelData.platforms.forEach(p => {
		let platform;
		if (p.numTiles === 1) {
			platform = this.add.sprite(p.x, p.y, p.key);
		} else {
			let width = this.textures.get(p.key).get(0).width;
			let height = this.textures.get(p.key).get(0).height;
			platform = this.add.tileSprite(p.x, p.y, p.numTiles * width, 1 * height, p.key).setOrigin(0, 0);
		}
		platform.setOrigin(0, 0);
		this.platforms.add(platform);
	}, this);

	// fire group
	this.fires = this.physics.add.group({
		allowGravity: false,
		immovable: true
	});
	this.levelData.fires.forEach(f => {
		let fire = this.fires.create(f.x, f.y, 'fire').setOrigin(0.5, 1);
		fire.anims.play('burning');
	}, this);

	// goal
	this.goal = this.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal').setOrigin(0.5, 0.5);
	this.physics.add.existing(this.goal);

	// player
	this.player = this.add.sprite(this.levelData.player.x, this.levelData.player.y, 'player', 3);
	this.player.moveSpeed = this.playerSpeed;
	this.player.jumpSpeed = this.jumpSpeed;
	this.physics.add.existing(this.player);
	this.player.body.setCollideWorldBounds(true);

	// spawner
	this.barrels = this.physics.add.group({
		bounceY: 0.1,
		bounceX: 1,
		collideWorldBounds: true
	});

	let spawningEvent = this.time.addEvent({
		delay: this.levelData.spawner.interval,
		loop: true,
		callbackScope: this,
		callback: function(){
			// let barrel = this.barrels.create(this.goal.x, this.goal.y, 'barrel');
			let barrel = this.barrels.get(this.goal.x, this.goal.y, 'barrel');
			barrel.setActive(true);
			barrel.setVisible(true);
			barrel.body.enable = true;
			barrel.setVelocityX(this.levelData.spawner.speed);
			this.time.addEvent({
				delay: this.levelData.spawner.lifespan,
				repeat: 0,
				callbackScope: this,
				callback: function(){
					// barrel.destroy();
					barrel.body.enable = false;
					this.barrels.killAndHide(barrel);
				}
			});
		}
	});

	// camera
	this.cameras.main.setBounds(0, 0, this.levelData.level.width, this.levelData.level.height);
	this.cameras.main.startFollow(this.player);

	// collision deteciton
	this.physics.add.collider([this.goal, this.player, this.barrels], this.platforms);

	// overlap detection
	this.physics.add.overlap(this.player, [this.fires, this.goal, this.barrels], this.restartGame, null, this);
};

gameScene.initControls = function () {
	this.cursors = this.input.keyboard.createCursorKeys();
};

gameScene.initAnimations = function () {
	// walking animation
	if (!this.anims.get('walking')) {
		this.anims.create({
			key: 'walking',
			frames: this.anims.generateFrameNames('player', {
				frames: [0, 1, 2]
			}),
			yoyo: true,
			frameRate: 12,
			repeat: Infinity
		});
	}

	// fire animation
	if (!this.anims.get('burning')) {
		this.anims.create({
			key: 'burning',
			frames: this.anims.generateFrameNames('fire', {
				frames: [0, 1]
			}),
			frameRate: 4,
			repeat: Infinity
		});
	}
};

gameScene.create = function () {
	this.initAnimations();
	this.initLevel();
	this.initControls();

	// this.input.on('pointerdown', ({ worldX, worldY }) => {
	// 	console.log(`${Math.round(worldX)}, ${Math.round(worldY)}`);
	// });
};

gameScene.update = function () {
	let grounded = this.player.body.blocked.down || this.player.body.touching.down;

	if (this.cursors.left.isDown) {
		this.player.body.setVelocityX(-this.player.moveSpeed);
		this.player.flipX = false;
		if (grounded && !this.player.anims.isPlaying) {
			this.player.anims.play('walking');
		}
	} else if (this.cursors.right.isDown) {
		this.player.body.setVelocityX(this.player.moveSpeed);
		this.player.flipX = true;
		if (grounded && !this.player.anims.isPlaying) {
			this.player.anims.play('walking');
		}
	} else {
		this.player.body.setVelocityX(0);
		this.player.anims.stop('walking');
		if (grounded) {
			this.player.setFrame(3);
		}
	}

	if (grounded && (this.cursors.space.isDown || this.cursors.up.isDown)) {
		this.player.body.setVelocityY(this.player.jumpSpeed);
		this.player.anims.stop('walking');
		this.player.setFrame(2);
	}
};

gameScene.restartGame = function (sourceSprite, targetSprite) {
	this.cameras.main.fade(500);
	this.cameras.main.on('camerafadeoutcomplete', function (camera, effect) {
		this.scene.restart();
	}, this);
};

let config = {
	type: Phaser.AUTO,
	width: 360,
	height: 640,
	parent: 'game',
	scene: gameScene,
	title: 'Dorky Kong',
	pixelArt: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			// debug: true
		}
	}
};

let game = new Phaser.Game(config);
