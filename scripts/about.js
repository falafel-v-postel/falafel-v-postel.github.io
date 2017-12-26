import Phaser from 'phaser';

export default class extends Phaser.State {
  preload() {
    this.add.sprite(0, 0, 'backgroundPreload');
    this.preloadSound = this.add.audio('preloadMusic', 1, true);
    this.preloadSound.volume = 0.8;
    this.preloadSound.play();
    this.text = this.game.add.text(20, this.world.bounds.height - 215, '', { font: '42px "Awesome North Korea"', fill: "#7b7c7e" });    
    this.text2 = this.game.add.text(220, this.world.bounds.height - 100, '', { fill: '#fff', font: '42px "Awesome North Korea"', align: 'left' });
    this.text2.anchor.setTo(0.5, 0.5);

  this.content = [
      " ",
      "Evgeni Krivko presents",
      "ROCKETMAN",
      " ",
      "made with love and Phaser",
      " ",
      "rise to the top",      
      "use arrow keys to move",
      "use spacebar to jump",
      "    ",
      "04:20 PM, near future",
      "in the middle of nowhere",      
      "the characters are real",
      "the plot is possible",
      "    ",      
      "make peace, not war",      
    ];
  this.index = 0;
  this.line = '';  
  }

  create() {
    this.nextLine();    
    this.text2.setText('PRESS ENTER TO CONTINUE...');
    this.text2.alpha = 0;
    this.add.tween(this.text2).to({ alpha: 0.8 }, 3000, 'Linear', true, 48000, -1, true);
    const enterBtn = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    enterBtn.onDown.add(this.loadPreload, this);
  }

  updateLine() {    
    if (this.line.length < this.content[this.index].length)
      {
      this.line = this.content[this.index].substr(0, this.line.length + 1);
      // text.text = line;
      this.text.setText(this.line);
      }
    else
      {
      //  Wait 2 seconds then start a new line
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.nextLine, this);
      }    
  }
    
  nextLine() {    
    this.index++;    
    if (this.index <this.content.length)
      {
      this.line = '';
      this.game.time.events.repeat(80, this.content[this.index].length + 1, this.updateLine, this);
      }    
  }

  loadPreload() {
    this.preloadSound.destroy();
    this.game.state.start('preload');
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
			this.state.start('preload');
		}
	}
}