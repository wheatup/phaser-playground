const homeScene = new Phaser.Scene('Home');

homeScene.create = function () {
	this.background = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

	let text = this.add.text(this.sys.game.config.width * .5, this.sys.game.config.height * .5, 'VIRTUAL PET😃', {
		font: '40px Arial',
		fill: '#fff'
	});
	text.setOrigin(.5, .5);
	text.depth = 1;


	let { width, height } = this.sys.game.config;
	let textBg = this.add.graphics();
	textBg.fillStyle(0x000000, .75);

	let padding = 10;
	textBg.fillRect(
		text.x - text.width * .5 - padding,
		text.y - text.height * .5 - padding,
		text.width + padding * 2,
		text.height + padding * 2
	);


	this.background.on('pointerdown', this.startGame, this);
}

homeScene.startGame = function () {
	this.scene.start('Game');
}