

window.onload = () => {
	new Phaser.Game({
		type: Phaser.AUTO,
		width: 360,
		height: 640,
		parent: "game",
		title: 'Visual Pet',
		pixelArt: false,
		backgroundColor: '#8a9',
		scene: [bootScene, loadingScene, homeScene, gameScene]
	});
};