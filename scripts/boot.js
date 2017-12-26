import Phaser from 'phaser';

export default class extends Phaser.State {
  preload() {
    this.load.image('backgroundPreload', '../assets/images/preload-bg.jpg');
    this.load.audio('preloadMusic', '../assets/audio/Dust_Brothers_-_Marla.mp3');   
  }

  create() {
    this.state.start('about');
  }
}