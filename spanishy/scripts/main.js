const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {

}

gameScene.preload = function () {
	this.load.image('background', './assets/images/background-city.png');
	this.load.image('building', './assets/images/building.png');
	this.load.image('car', './assets/images/car.png');
	this.load.image('house', './assets/images/house.png');
	this.load.image('tree', './assets/images/tree.png');

	this.load.audio('au_tree', './assets/audio/arbol.mp3');
	this.load.audio('au_car', './assets/audio/auto.mp3');
	this.load.audio('au_house', './assets/audio/casa.mp3');
	this.load.audio('au_building', './assets/audio/edificio.mp3');
	this.load.audio('au_correct', './assets/audio/correct.mp3');
	this.load.audio('au_wrong', './assets/audio/wrong.mp3');
}

gameScene.create = function () {
	this.items = this.add.group([
		{
			key: 'building',
			setXY: { x: 100, y: 240 }
		}, {
			key: 'house',
			setXY: { x: 240, y: 280 },
			setScale: { x: 0.8, y: 0.8 }
		}, {
			key: 'car',
			setXY: { x: 400, y: 300 },
			setScale: { x: 0.8, y: 0.8 }
		}, {
			key: 'tree',
			setXY: { x: 550, y: 250 }
		}
	]);

	let bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
	bg.setInteractive();

	Phaser.Actions.Call(this.items.getChildren(), item => {
		item.setInteractive();

		item.resizeTween = this.tweens.add({
			targets: item,
			scaleX: 1.2,
			scaleY: 1.2,
			duration: 200,
			ease: 'Quad.easeInOut',
			yoyo: true,
			paused: true
		});

		item.opacityTween = this.tweens.add({
			targets: item,
			alpha: 0.7,
			duration: 200,
			paused: true
		});


		item.on('pointerdown', function () {
			this.resizeTween.restart();
		}, item);

		item.on('pointerover', function(){
			this.opacityTween.restart();
		}, item);

		item.on('pointerout', function(){
			this.opacityTween.stop();
			this.alpha = 1;
		}, item);
	}, this);
}

gameScene.update = function () {

}

window.onload = () => {
	new Phaser.Game({
		type: Phaser.AUTO,
		width: 640,
		height: 360,
		parent: "game",
		title: 'Spanishy',
		pixelArt: false,
		scene: gameScene
	});
};