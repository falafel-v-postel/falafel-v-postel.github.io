import 'p2';
import 'pixi';
import Phaser from 'phaser';

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

//game.state.add('boot', bootState);
//game.state.add('load', loadState);
//game.state.add('menu', menuState);
//game.state.add('play', playState);
//game.state.add('win', winState);

//game.state.start('boot');

function preload() {

    game.load.tilemap('level1', '../assets/images/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', '../assets/images/tiles-1.png');
    game.load.spritesheet('dude', '../assets/images/trump.png', 66, 66);
    game.load.image('background', '../assets/images/background5.jpeg');
    game.load.spritesheet('bomb', '../assets/images/rocketman.png', 95, 72);
    game.load.spritesheet('bomb2', '../assets/images/rocketman2.png', 95, 72);
    game.load.spritesheet('astronaut', '../assets/images/giphy.png', 75, 75);      
    //  Firefox doesn't support mp3 files, so use Chrome
    game.load.audio('lollybomb', '../assets/audio/Little_Big_-_Lolly_Bomb.mp3');
    game.load.audio('intro', '../assets/audio/upinsmoke.mp3');   
    game.load.audio('crap', '../assets/audio/Craaaaaap.wav');
    game.load.audio('doh', '../assets/audio/Doh.mp3');
    game.load.audio('woohoo', '../assets/audio/woo.mp3');       
    game.load.audio('boom', '../assets/audio/bomb.mp3');         
    game.load.spritesheet('kaboom', '../assets/images/explosion.png', 128, 256);
    game.load.spritesheet('kaboom2', '../assets/images/explode.png', 128, 128);
    game.load.bitmapFont('k-font', '../assets/fonts/font1.png', '../assets/fonts/font1.fnt');      
}
var map;
var tileset;
var layer;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var music;
var music2;
var sound1;
var sound2;
var sound3;
var sound4;
var explosions;
var explosions2;
var player;
var lives;
var rocketman;
var rocketman2;
var astronaut; 
var explosion;
var explosion2;
var loseText;
var winText;

function create() {
    //game.time.events.add(Phaser.Timer.SECOND * 4, restart, this);
    
    game.world.setBounds(0, 0, 1024, 3000); 
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000';

    bg = game.add.tileSprite(0, 0, 1024, 3000, 'background');
    bg.fixedToCamera = false;
 
    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');
    layer.fixedToCamera = true;    
    //layer.debug = true;

    cursors = game.input.keyboard.createCursorKeys();    
    game.physics.arcade.gravity.y = 250;

    //The hero!
    player = game.add.sprite(300, 2850, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    
    player.body.bounce.y = 0.2;
    player.body.collideWorldBounds = true;
    player.body.setSize(15, 38, 25, 16);

    player.animations.add('left', [19, 20, 21, 22], 10, true);
    player.animations.add('turn', [5], 20, true);
    player.animations.add('right', [7, 8, 9, 10], 10, true);

    game.camera.follow(player);
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    //Rocketman
    rocketman = game.add.emitter(680, game.world.top, 250);
    game.physics.enable(rocketman, Phaser.Physics.ARCADE);  
    rocketman.makeParticles('bomb', [0], 5, true, true);
    rocketman.minParticleSpeed.setTo(-200, -300);
    rocketman.maxParticleSpeed.setTo(200, -400);
    rocketman.gravity = 50;
    rocketman.bounce.setTo(0.4, 0.4);
    rocketman.angularDrag = 30;
    rocketman.start(false, 10000, 1000);

    //Rocketman2
    rocketman2 = game.add.emitter(340, game.world.top, 250);
    game.physics.enable(rocketman2, Phaser.Physics.ARCADE);    
    rocketman2.makeParticles('bomb2', [0], 5, true, true);
    rocketman2.minParticleSpeed.setTo(-200, -300);
    rocketman2.maxParticleSpeed.setTo(200, -400);
    rocketman2.gravity = 50;
    rocketman2.bounce.setTo(0.4, 0.4);
    rocketman2.angularDrag = 30;    
    rocketman2.start(false, 10000, 1000);

    //The astronaut
    astronaut = game.add.sprite(520, 50, 'astronaut');
    game.physics.enable(astronaut, Phaser.Physics.ARCADE);
    astronaut.fixedToCamera = false;
    astronaut.animations.add('fly', [ 0, 1, 2, 3, 4, 5, 6, 7 ], 5, true);
    astronaut.play('fly');
    astronaut.body.moves = false;
    game.add.tween(astronaut.cameraOffset).to( { x: 100}, 10000, Phaser.Easing.Sinusoidal.InOut, true, 0, 2000, true);  
  
    // Music
    music = game.add.audio('lollybomb');
    music.play();
    music.loopFull();
    game.input.onDown.add(changeVolume, this); 

    // Music intro
    music2 = game.add.audio('intro');
    music2.play();   

    // Game over text
    loseText = game.add.bitmapText(400, 300, 'k-font', "Sorry You Are Not a Winner! \n Click to restart", 64);
    loseText.fixedToCamera = true;
    loseText.cameraOffset.setTo(400, 300);    
    loseText.anchor.setTo(0.5, 0.5);
    loseText.visible = false;

    // Win text
    winText = game.add.bitmapText(400, 300, 'k-font', "You Won, \n Click to restart", 64);
    winText.fixedToCamera = true;
    winText.cameraOffset.setTo(400, 300);    
    winText.anchor.setTo(0.5, 0.5);
    winText.visible = false;

    //  An explosion pool (player vs. rocketman2)
    explosions = game.add.group();
    explosions.createMultiple(10, 'kaboom');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach(player => player.animations.add('kaboom'));
    
    //  An explosion pool (rocketman vs. rocketman)
    explosions2 = game.add.group();
    explosions2.createMultiple(30, 'kaboom2');
    explosions2.setAll('anchor.x', 0.5);
    explosions2.setAll('anchor.y', 0.5);
    explosions2.forEach(rocketman => rocketman.animations.add('kaboom2'));    
}

function update() {

    //  Run collision
    game.physics.arcade.overlap(rocketman, player, rocketmanHitsPlayer, null, this);
    game.physics.arcade.overlap(player, rocketman2, rocketman2HitsPlayer, null, this);
    game.physics.arcade.overlap(rocketman, rocketman2, rocketman2HitsRocketman, null, this);
    game.physics.arcade.overlap(player, astronaut, playerTouchAstronaut, null, this);
    
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(rocketman, player);
    
    player.body.velocity.x = 0;    

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }

    if (cursors.up.isDown)
    {
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        game.camera.y += 4;
    }

    if (cursors.left.isDown)
    {
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        game.camera.x += 4;
    }

}

function changeVolume(pointer) {
    
        if (pointer.y < 100)
        {
            music.mute = false;
        }
        else if (pointer.y < 300)
        {
            music.volume += 0.1;
        }
        else
        {
            music.volume -= 0.1;
        }
    
    }

function rocketmanHitsPlayer (player,rocketman) {
    // Sound collision
    sound1 = game.add.audio('doh', 0.4, false);
    sound1.play();
        
    }
        
function rocketman2HitsPlayer (player,rocketman2) {
    
    //  When a rocketman2 hits a player we kill them both
    rocketman2.kill();
    player.kill();
        
    /**live = lives.getFirstAlive();        
        if (live)
            {
            live.kill();
            }*/
        
    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y-player.body.height*1.5);
    explosion.play('kaboom', 10, false, true);

    // Sound and text effects, restart
    sound2 = game.add.audio('crap', 0.6);
    sound2.play();
    music.destroy();   
    loseText.visible = true;
    game.input.onTap.addOnce(restart,this);    
        
    }

function rocketman2HitsRocketman (rocketman,rocketman2) {
            
    rocketman.kill();
    rocketman2.kill();          
     
    //  And create an explosion :)
    var explosion2 = explosions2.getFirstExists(false);
    explosion2.reset(rocketman2.body.x+rocketman.body.width, rocketman2.body.y);
    explosion2.play('kaboom2', 30, false, true);

    // Sound effects
    sound3 = game.add.audio('boom', 0.3);
    sound3.play();
            
    }

function playerTouchAstronaut (player,astronaut) {
            
    //rocketman.kill();
    //rocketman2.kill();
    player.kill();
    astronaut.kill();
     
     // Sound and text effects, restart
    sound4 = game.add.audio('woohoo', 1);
    sound4.play();
    music.destroy();            
    winText.visible = true;
    game.input.onTap.addOnce(restart,this);           
         
    }    

function restart () {
   
    //resets the life count
    //lives.callAll('revive');
    //  And brings the rocketmans back from the dead :)
    //rocketman.removeAll();
    //createRocketman();

    game.state.restart()
    //hides the text
    loseText.visible = false;
    winText.visible = false;    

}

function render () {
    //game.debug.text(game.time.physicsElapsed, 32, 32);
    //game.debug.body(player);
    //game.debug.bodyInfo(player, 16, 24);
    //game.debug.text("Time until event: " + game.time.events.duration, 400, 300);   
    //game.debug.cameraInfo(game.camera, 32, 32);
    //game.debug.spriteCoords(player, 32, 500);

}

export default function() { 
    window.console.log(Phaser)
}
