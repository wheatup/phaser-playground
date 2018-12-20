const loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = async function () {
	let { width, height } = this.sys.game.config;
	let logo = this.add.sprite(width * .5, height * .5 - 50, 'logo').setOrigin(.5, .5);

	let bgBar = this.add.graphics();
	let barW = 150, barH = 20;
	bgBar.setPosition(width * .5 - barW * .5, height * .5 - barH * .5);
	bgBar.fillStyle(0xF5F5F5, 1);
	bgBar.fillRect(0, 0, barW, barH);

	let pgBar = this.add.graphics();
	pgBar.setPosition(width * .5 - barW * .5 + 2, height * .5 - barH * .5 + 2);
	this.load.on('progress', function (value) {
		pgBar.clear();
		pgBar.fillStyle(0x9AD98D, 1);
		pgBar.fillRect(0, 0, (barW - 4) * value, barH - 4);
	}, this);

	this.load.image('backyard', './assets/images/backyard.png');
	this.load.image('apple', './assets/images/apple.png');
	this.load.image('candy', './assets/images/candy.png');
	this.load.image('rotate', './assets/images/rotate.png');
	this.load.image('toy', './assets/images/rubber_duck.png');
	this.load.spritesheet('pet', './assets/images/pet.png', {
		frameWidth: 97,
		frameHeight: 83,
		margin: 1,
		spacing: 1
	});
}

loadingScene.create = function () {
	this.scene.start('Home');
}