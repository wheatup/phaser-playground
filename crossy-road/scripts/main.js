const gameScene = new Phaser.Scene('Game');

gameScene.init = function() {
	this.isGameOver = false;
	this.cameras.main.fadeIn(200);
}

gameScene.preload = function () {
	this.load.image('background', './assets/images/background.png');
	this.load.image('player', './assets/images/player.png');
	this.load.image('enemy', './assets/images/dragon.png');
	this.load.image('goal', './assets/images/treasure.png');
}

gameScene.create = function () {
	this.background = this.add.sprite(0, 0, 'background');
	this.background.setOrigin(0, 0);

	this.player = this.add.sprite(50, this.sys.game.config.height * .5, 'player');
	this.player.depth = 1;
	this.player.speed = 2;
	this.player.setScale(.5);

	this.enemies = this.add.group({
		key: 'enemy',
		repeat: 5,
		setXY: {
			x: 100,
			y: 100,
			stepX: 75,
			stepY: 20
		}
	});
	Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
	Phaser.Actions.Call(this.enemies.getChildren(), enemy => {
		enemy.flipX = true;
		enemy.speed = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.floor(Math.random() * 15) * 0.1);
		enemy.minBound = 80;
		enemy.maxBound = 280;
	});

	this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height * .5, 'goal');
	this.goal.setScale(.5);
}

gameScene.update = function () {
	if (this.isGameOver) {
		return;
	}

	if (this.input.activePointer.isDown) {
		this.player.x += this.player.speed;
	}

	if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.goal.getBounds())) {
		console.log('A winner is you!');
		return this.win();
	}

	this.enemies.getChildren().forEach(enemy => {
		if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemy.getBounds())) {
			console.log('You dieded.');
			return this.gameOver();
		}

		if ((enemy.speed < 0 && enemy.y <= enemy.minBound)
			|| (enemy.speed > 0 && enemy.y >= enemy.maxBound)) {
			enemy.speed *= -1;
		}
		enemy.y += enemy.speed;
	});
}

gameScene.gameOver = function () {
	this.isGameOver = true;
	this.cameras.main.shake(300, 0.02);
	this.cameras.main.once('camerashakecomplete', camera => {
		this.cameras.main.fadeOut(500);
	}, this);
	this.cameras.main.once('camerafadeoutcomplete', camera => {
		this.scene.restart();
	}, this);
}

gameScene.win = function () {
	this.isGameOver = true;
	this.cameras.main.fadeOut(500);
	this.cameras.main.once('camerafadeoutcomplete', camera => {
		this.scene.restart();
	}, this);
}

window.onload = () => {
	new Phaser.Game({
		width: 640,
		height: 360,
		type: Phaser.AUTO,
		parent: "game",
		pixelArt: true,
		scene: gameScene,
		physics: {
			default: "arcade",
			arcade: {
				gravity: { y: 0 }
			}
		}
	});
};