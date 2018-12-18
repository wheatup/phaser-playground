const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
	this.words = [
		{
			key: 'building',
			setXY: { x: 100, y: 240 },
			spanish: 'edificio'
		}, {
			key: 'house',
			setXY: { x: 240, y: 280 },
			setScale: { x: 0.8, y: 0.8 },
			spanish: 'casa'
		}, {
			key: 'car',
			setXY: { x: 400, y: 300 },
			setScale: { x: 0.8, y: 0.8 },
			spanish: 'automóvil'
		}, {
			key: 'tree',
			setXY: { x: 550, y: 250 },
			spanish: 'árbol'
		}
	]
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
	this.items = this.add.group(this.words);

	let bg = this.add.sprite(0, 0, 'background').setOrigin(0, 0).setDepth(-1);
	bg.setInteractive();

	this.items.getChildren().forEach((item, index) => {
		item.setInteractive();

		item.correctTween = this.tweens.add({
			targets: item,
			scaleX: 1.2,
			scaleY: 1.2,
			duration: 200,
			ease: 'Quad.easeOut',
			yoyo: true,
			paused: true
		});

		item.wrongTween = this.tweens.add({
			targets: item,
			duration: 200,
			angle: 45,
			ease: 'Quad.easeOut',
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
			let result = gameScene.processAnswer(gameScene.words[index].spanish);
			if(result){
				this.correctTween.restart();
			}else{
				this.wrongTween.restart();
			}
			gameScene.showNextQuestion();
		});

		item.on('pointerover', function () {
			item.opacityTween.restart();
		});

		item.on('pointerout', function () {
			item.opacityTween.stop();
			item.alpha = 1;
		});

		let word = this.words[index];

		word.sound = this.sound.add(`au_${word.key}`);
	}, this);

	this.wordText = this.add.text(30, 20, '', {
		font: '28px Open Sans',
		fill: '#fff'
	});

	this.correctSound = this.sound.add('au_correct');
	this.wrongSound = this.sound.add('au_wrong');

	this.showNextQuestion();
}

gameScene.update = function () {

}

gameScene.showNextQuestion = function () {
	this.nextWord = Phaser.Math.RND.pick(this.words);
	this.nextWord.sound.play();
	this.wordText.setText(this.nextWord.spanish);
}

gameScene.processAnswer = function(userResponse) {
	if(userResponse === this.nextWord.spanish){
		this.correctSound.play();
		return true;
	}else{
		this.wrongSound.play();
		return false;
	}
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