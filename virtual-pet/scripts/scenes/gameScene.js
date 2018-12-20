const gameScene = new Phaser.Scene('Game');

gameScene.init = function () {
	this.state = {
		health: 10,
		fun: 100
	};

	this.decay = {
		health: -1,
		fun: -1
	}
}


gameScene.create = function () {
	this.background = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();
	this.background.on('pointerdown', this.placeItem, this);
	this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive();
	this.input.setDraggable(this.pet);
	this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
		
		gameObject.x = dragX;
		gameObject.y = dragY;
	}, this);
	this.anims.create({
		key: 'eat',
		frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
		frameRate: 7,
		yoyo: true,
		repeat: 0
	});
	this.createUI();
	this.createHUD();
	this.refreshHUD();
	this.time.addEvent({
		delay: 1000,
		repeat: Infinity,
		callbackScope: this,
		callback: function() {
			this.updateState(this.decay);
		}
	});
}

gameScene.createUI = function () {
	this.btnApple = this.add.sprite(72, 570, 'apple').setInteractive();
	this.btnApple.on('pointerdown', () => this.pickItem(this.btnApple), this);
	this.btnApple.state = { health: 20, fun: -10 };

	this.btnCandy = this.add.sprite(144, 570, 'candy').setInteractive();
	this.btnCandy.on('pointerdown', () => this.pickItem(this.btnCandy), this);
	this.btnCandy.state = { health: -10, fun: 50 };

	this.btnToy = this.add.sprite(216, 570, 'toy').setInteractive();
	this.btnToy.on('pointerdown', () => this.pickItem(this.btnToy), this);
	this.btnToy.state = { health: -5, fun: 25 };

	this.btnRotate = this.add.sprite(288, 570, 'rotate').setInteractive();
	this.btnRotate.on('pointerdown', () => this.rotatePet(this.btnRotate), this);
	this.btnRotate.state = { health: 0, fun: 5 };

	this.buttons = [this.btnApple, this.btnCandy, this.btnToy, this.btnRotate];

	this.uiBlocked = false;

	this.uiReady();
}

gameScene.createHUD = function() {
	this.healthText = this.add.text(20, 20, 'Health: ', {
		font: '24px Arial',
		fill: '#fff',
	});

	this.funText = this.add.text(170, 20, 'Fun: ', {
		font: '24px Arial',
		fill: '#fff',
	});
}

gameScene.refreshHUD = function() {
	this.healthText.setText(`Health: ${this.state.health}`);
	this.funText.setText(`Fun: ${this.state.fun}`);
}

gameScene.updateState = function(statsDiff){
	let isGameOver = false;
	for (let key in statsDiff) {
		if (!statsDiff.hasOwnProperty(key)) continue;
		this.state[key] += statsDiff[key];
		if(this.state[key] <= 0){
			this.state[key] = 0;
			isGameOver = true;
		}
	}
	this.refreshHUD();
	if(isGameOver) {
		this.gameOver();
	}
}

gameScene.rotatePet = function (button) {
	if (this.uiBlocked) {
		return;
	}
	this.uiReady();
	this.uiBlocked = true;
	button.alpha = 0.5;

	let rotateTween = this.tweens.add({
		targets: this.pet,
		duration: 600,
		angle: 360,
		pause: false,
		callbackScope: this,
		onComplete: function (tween, sprites) {
			this.uiReady();
			this.updateState(button.state);
		}
	});
}

gameScene.pickItem = function (button) {
	if (this.uiBlocked) {
		return;
	}
	this.uiReady();
	this.selectedItem = button;
	button.alpha = 0.5;
}

gameScene.uiReady = function () {
	this.selectedItem = null;
	this.buttons.forEach(btn => btn.alpha = 1);
	this.uiBlocked = false;
}

gameScene.placeItem = function (pointer, localX, localY) {
	if (!this.selectedItem || this.uiBlocked) return;
	let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);
	this.uiBlocked = true;
	this.tweens.add({
		targets: this.pet,
		duration: 500,
		x: newItem.x,
		y: newItem.y,
		paused: false,
		callbackScope: this,
		onComplete: function () {
			this.pet.once('animationcomplete', function () {
				newItem.destroy();
				this.updateState(this.selectedItem.state);
				this.pet.setFrame(0);
				this.uiReady();
			}, this);
			this.pet.play('eat');
		}
	});
}

gameScene.gameOver = function() {
	this.uiBlocked = true;
	this.pet.setFrame(4);
	this.time.addEvent({
		delay: 2000,
		repeat: 0,
		callbackScope: this,
		callback: function() {
			this.scene.start('Home');
		}
	});
}