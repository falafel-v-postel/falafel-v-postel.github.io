import 'p2';
import 'pixi';
import Phaser from 'phaser';

export default class extends Phaser.State {
create() {
    //game.time.events.add(Phaser.Timer.SECOND * 4, restart, this);
    
    this.game.world.setBounds(0, 0, 1024, 3000); 
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.stage.backgroundColor = '#000';

    this.bg = this.game.add.tileSprite(0, 0, 1024, 3000, 'backgroundMain');
    this.bg.fixedToCamera = false;
 
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles-1');
    this.map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    this.layer = this.map.createLayer('Tile Layer 1');
    this.layer.fixedToCamera = true;    
    //layer.debug = true;

    this.cursors = this.game.input.keyboard.createCursorKeys();    
    this.game.physics.arcade.gravity.y = 250;

    //The hero!
    this.player = this.game.add.sprite(300, 2850, 'dude');
    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);
    
    this.player.body.bounce.y = 0.2;
    this.player.body.collideWorldBounds = true;
    this.player.body.setSize(15, 38, 25, 16);

    this.player.animations.add('left', [19, 20, 21, 22], 10, true);
    this.player.animations.add('turn', [5], 20, true);
    this.player.animations.add('right', [7, 8, 9, 10], 10, true);

    this.game.camera.follow(this.player);
    this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Rocketman
    this.rocketman = this.game.add.emitter(680, this.game.world.top, 250);    
    this.game.physics.enable(this.rocketman, Phaser.Physics.ARCADE);
    this.rocketman.makeParticles('rocketmanHit', [0], 5, true, true);
    this.rocketman.minParticleSpeed.setTo(-200, -300);
    this.rocketman.maxParticleSpeed.setTo(200, -400);
    this.rocketman.gravity = 50;
    this.rocketman.bounce.setTo(0.4, 0.4);
    this.rocketman.angularDrag = 30;
    this.rocketman.start(false, 10000, 1000);

    //Rocketman2
    this.rocketman2 = this.game.add.emitter(340, this.game.world.top, 250);    
    this.game.physics.enable(this.rocketman2, Phaser.Physics.ARCADE); 
    this.rocketman2.makeParticles('rocketmanKill', [0], 5, true, true);
    this.rocketman2.minParticleSpeed.setTo(-200, -300);
    this.rocketman2.maxParticleSpeed.setTo(200, -400);
    this.rocketman2.gravity = 50;
    this.rocketman2.bounce.setTo(0.4, 0.4);
    this.rocketman2.angularDrag = 30;    
    this.rocketman2.start(false, 10000, 1000);

    //The astronaut
    this.astronaut = this.game.add.sprite(520, 50, 'astronaut');
    this.game.physics.enable(this.astronaut, Phaser.Physics.ARCADE);
    this.astronaut.fixedToCamera = false;
    this.astronaut.animations.add('fly', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 5, true);
    this.astronaut.play('fly');
    this.astronaut.body.moves = false;
    this.game.add.tween(this.astronaut.cameraOffset).to( { x: 100}, 10000, Phaser.Easing.Sinusoidal.InOut, true, 0, 2000, true);  
  
    // Music
    this.music = this.game.add.audio('mainMusic');
    this.music.play();
    this.music.loopFull();

    // Game intro
    this.music2 = this.game.add.audio('introMain');
    this.music2.play();   

    // Game over text
    this.loseText = this.game.add.bitmapText(400, 300, 'k-font', "Sorry You Are Not a Winner! \n Click to restart", 56);
    this.loseText.fixedToCamera = true;
    this.loseText.cameraOffset.setTo(400, 300);    
    this.loseText.anchor.setTo(0.5, 0.5);
    this.loseText.visible = false;

    // Win text
    this.winText = this.game.add.bitmapText(400, 300, 'k-font', "You Won, \n Click to restart", 56);
    this.winText.fixedToCamera = true;
    this.winText.cameraOffset.setTo(400, 300);    
    this.winText.anchor.setTo(0.5, 0.5);
    this.winText.visible = false;

    //  An explosion pool (player vs. rocketman2)
    this.explosions = this.game.add.group();
    this.explosions.createMultiple(10, 'kaboomPlayer');
    this.explosions.setAll('anchor.x', 0.5);
    this.explosions.setAll('anchor.y', 0.5);
    this.explosions.forEach(player => player.animations.add('kaboomPlayer'));
    
    //  An explosion pool (rocketman vs. rocketman)
    this.explosions2 = this.game.add.group();
    this.explosions2.createMultiple(30, 'kaboomBomb');
    this.explosions2.setAll('anchor.x', 0.5);
    this.explosions2.setAll('anchor.y', 0.5);
    this.explosions2.forEach(rocketman => rocketman.animations.add('kaboomBomb'));
    
    //Create sound toggle button
    this.soundButton = this.game.add.button(730, 530, 'mute', this.toggleMute, this);
    this.soundButton.frame = 1;   
    this.soundButton.fixedToCamera = true;
    if (!this.game.sound.mute) {
        this.soundButton.tint = 16777215;
    } else {
        this.soundButton.tint = 16711680;
    }
}

update() {
    //  Run collision
    this.game.physics.arcade.overlap(this.rocketman, this.player, this.rocketmanHitsPlayer, null, this);
    this.game.physics.arcade.overlap(this.player, this.rocketman2, this.rocketman2HitsPlayer, null, this);
    this.game.physics.arcade.overlap(this.rocketman, this.rocketman2, this.rocketman2HitsRocketman, null, this);
    this.game.physics.arcade.overlap(this.player, this.astronaut,this.playerTouchAstronaut, null, this);
    
    this.game.physics.arcade.collide(this.player, this.layer);
    this.game.physics.arcade.collide(this.rocketman, this.player);
    
    this.player.body.velocity.x = 0;    

    if (this.cursors.left.isDown)
    {
        this.player.body.velocity.x = -150;

        if (this.facing != 'left')
        {
            this.player.animations.play('left');
            this.facing = 'left';
        }
    }
    else if (this.cursors.right.isDown)
    {
        this.player.body.velocity.x = 150;

        if (this.facing != 'right')
        {
            this.player.animations.play('right');
            this.facing = 'right';
        }
    }
    else
    {
        if (this.facing != 'idle')
        {
            this.player.animations.stop();

            if (this.facing == 'left')
            {
                this.player.frame = 0;
            }
            else
            {
                this.player.frame = 5;
            }

            this.facing = 'idle';
        }
    }
    
    if (this.jumpButton.isDown && this.player.body.onFloor() && this.game.time.now)
    {
        this.player.body.velocity.y = -250;
        this.jumpTimer = this.game.time.now + 750;
    }

    if (this.cursors.up.isDown)
    {
        this.game.camera.y -= 4;
    }
    else if (this.cursors.down.isDown)
    {
        this.game.camera.y += 4;
    }

    if (this.cursors.left.isDown)
    {
        this.game.camera.x -= 4;
    }
    else if (this.cursors.right.isDown)
    {
        this.game.camera.x += 4;
    }
}

rocketmanHitsPlayer (player,rocketman) {
    // Sound collision
    this.sound1 = this.game.add.audio('doh', 0.4, false);
    this.sound1.play();        
    }
        
rocketman2HitsPlayer (player,rocketman2) {    
    //  When a rocketman2 hits a player we kill them both
    rocketman2.kill();
    player.kill();
        
    //  And create an explosion :)
    this.explosion = this.explosions.getFirstExists(false);
    this.explosion.reset(player.body.x, player.body.y-player.body.height*1.5);
    this.explosion.play('kaboomPlayer', 10, false, true);

    // Sound and text effects, restart
    this.sound2 = this.game.add.audio('crap', 0.6);
    this.sound2.play();
    this.preloadSound = this.add.audio('outroMain', 1, true);   
    this.preloadSound.play();
    this.preloadSound.fadeIn(2000);       
    this.music.destroy();
    this.loseText.visible = true;
    this.game.input.onTap.addOnce(this.restart,this);            
    }

rocketman2HitsRocketman (rocketman,rocketman2) {            
    rocketman.kill();
    rocketman2.kill();          
     
    //  And create an explosion :)
    this.explosion2 = this.explosions2.getFirstExists(false);
    this.explosion2.reset(rocketman2.body.x+rocketman.body.width, rocketman2.body.y);
    this.explosion2.play('kaboomBomb', 30, false, true);

    // Sound effects
    this.sound3 = this.game.add.audio('boomSound', 0.3);
    this.sound3.play();
    
    if (this.explosion) {
        this.sound3.mute = true;        
    }
}

playerTouchAstronaut (player,astronaut) {            
    player.kill();
    astronaut.kill();
     
     // Sound and text effects, restart
    this.sound4 = this.game.add.audio('woohoo', 1);
    this.sound4.play();
    this.music.destroy();            
    this.winText.visible = true;
    this.game.input.onTap.addOnce(this.restart,this);      
    }    

toggleMute () {
    if (!this.game.sound.mute) {
        this.game.sound.mute = true;
        this.soundButton.frame = 0;
        this.soundButton.tint = 16711680;        
    } else {
        this.game.sound.mute = false;
        this.soundButton.frame = 1;
        this.soundButton.tint = 16777215;        
    }
}    

restart () {
    this.preloadSound.stop();   
    this.game.state.restart();
    //hides the text
    this.loseText.visible = false;
    this.winText.visible = false;  
}

/**render () {
    this.game.debug.text(this.game.time.physicsElapsed, 32, 32);
    this.game.debug.body(player);
    this.game.debug.bodyInfo(player, 16, 24);
    this.game.debug.text("Time until event: " + this.game.time.events.duration, 400, 300);   
    this.game.debug.cameraInfo(this.game.camera, 32, 32);
    this.game.debug.spriteCoords(player, 32, 500);
}*/
}