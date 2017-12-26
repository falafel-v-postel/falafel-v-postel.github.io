import Phaser from 'phaser';

export default class extends Phaser.State {
  preload() {
    this.add.sprite(0, 0, 'backgroundPreload');
    this.preloadSound = this.add.audio('preloadMusic', 1, true);
    this.preloadSound.volume = 0.6;
    this.preloadSound.play();
    this.text = this.game.add.text(220, this.world.bounds.height - 100, '', { fill: '#fff', font: '42px "Awesome North Korea"', align: 'left' });
    this.text.anchor.setTo(0.5, 0.5);
    
    this.load.tilemap('level1', '../assets/images/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles-1', '../assets/images/tiles-1.png');
    this.load.image('backgroundMain', '../assets/images/background.jpeg');    
    this.load.spritesheet('mute', '../assets/images/mute.png', 50, 50);    
    this.load.spritesheet('dude', '../assets/images/trump.png', 66, 66);
    this.load.spritesheet('rocketmanHit', '../assets/images/rocketman.png', 95, 72);
    this.load.spritesheet('rocketmanKill', '../assets/images/rocketman2.png', 95, 72);
    this.load.spritesheet('astronaut', '../assets/images/giphy.png', 75, 75);
    this.load.spritesheet('kaboomPlayer', '../assets/images/explosion.png', 128, 256);
    this.load.spritesheet('kaboomBomb', '../assets/images/explode.png', 128, 128);
    this.load.bitmapFont('k-font', '../assets/fonts/font1.png', '../assets/fonts/font1.fnt');      
    //  Firefox doesn't support mp3 files, so use Chrome
    this.load.audio('mainMusic', '../assets/audio/Little_Big_-_Lolly_Bomb.mp3');    
    this.load.audio('preloadMusic', '../assets/audio/Dust_Brothers_-_Marla.mp3');
    this.load.audio('introMain', '../assets/audio/upinsmoke.mp3');
    this.load.audio('outroMain', '../assets/audio/Brian_Tyler_-_A_Boy_And_His_Spirit.mp3');       
    this.load.audio('crap', '../assets/audio/Craaaaaap.wav');
    this.load.audio('doh', '../assets/audio/Doh.mp3');
    this.load.audio('woohoo', '../assets/audio/woo.mp3');       
    this.load.audio('boomSound', '../assets/audio/bomb.mp3');         
   
    this.load.onFileComplete.add(this.fileComplete, this);
  }

  create() {  
    this.text.setText('PRESS ENTER TO START');
    this.text.alpha = 0;
    this.add.tween(this.text).to({ alpha: 0.8 }, 1500, 'Linear', true, 0, -1, true);
    const enterBtn2 = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterBtn2.onDown.add(this.loadMain, this);
    }

  loadMain() {
    this.preloadSound.destroy();
    this.game.state.start('main');
  }

  fileComplete(progress) {
    this.text.setText(`LOADING: ${progress}% `);  
  }

  function () {
		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('preloadMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('main');
		}
	}
}