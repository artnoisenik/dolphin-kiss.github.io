(function() {

  !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

  function greet(){
    person = localStorage.getItem( "name" );
    lastHighScore = localStorage.getItem( 'highScore' );
    if ( person == null || person == "null" ){
      alert( "Hi, Stranger!" );
      person = prompt( "What is your name?" );
      localStorage.setItem( "name", person );
    } else {
      alert ("Hi, " + person + "!" );
    }
      uname.innerHTML = 'Player: '+person+ '!';
      highScoreTotal.innerHTML = 'High Score: '+lastHighScore;
  }

  function spaceShot(){

    var year = 2001 + Math.floor( Math.random() * 15 );
    var month = 1 + Math.floor( Math.random() * 12 );
    var day = 1 + Math.floor( Math.random() * 28 );

    var location = "https://api.nasa.gov/planetary/apod?date=" + year + "-" + month + "-" + day + "&api_key=OaFBdZCq89Gly77oIhEQF3fupeTBThyZ9mFAVYh8";

   $.getJSON( location )
     .done(function( data ) {
         console.log( data.hdurl );
         var spacePic = document.getElementById( 'spaceBackground' );
         $( spacePic ).attr( "src", data.hdurl );
         $( spacePic ).css( 'height', '100%' );
         $( spacePic ).css( 'object-fit', 'fill' );
         $( spacePic ).css( 'background-repeat', 'no-repeat' );
     });
  }

  spaceShot();
  setInterval( spaceShot,20000 );
  greet();
})();


var game = new Phaser.Game( 800, 690, Phaser.AUTO, 'container', { preload: preload, create: create, update: update, }, transparent = true );

function preload() {
  game.load.image( 'water', 'assets/sky.png' );
  game.load.spritesheet( 'dolphin','assets/dolphin.png', 108, 48 );
  game.load.image( 'ball', 'assets/greenCat.png' );
  game.load.image( 'bullet', 'assets/heart_clear.png' );
  game.load.image( 'enemyBullet', 'assets/bulletCat_small.png' );
}

var player;
var lives = 3;
var swim;
var bullets;
var fireRate = 300;
var nextFire = 0;

var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];
var cats;

var highScore = 0;
var score = 0;
var total = 0;
var gameOver;

function create() {
  game.physics.startSystem( Phaser.Physics.ARCADE );
  game.physics.arcade.gravity.y = 50;

  player = game.add.sprite( game.world.centerX, game.world.centerY, 'dolphin' );
  player.animations.add( 'swims', [0, 1, 2, 3], 10, true );
  player.anchor.setTo( 0.5, 0.5 );
  game.physics.arcade.enable( player );
  player.health = 100;
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 200;
  player.body.collideWorldBounds = true;
  player.body.setSize( 38, 38 )

  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  // cats = game.add.group();
  cats = game.add.physicsGroup();
  cats.enableBody = true;

  game.add.text( 500, 16, 'Health', { font: '25px Arial', fill: '#fff' } );
  var barConfig = { x: 200, y: 100, width: 200, height: 20 };
  this.myHealthBar = new HealthBar( this.game, barConfig );
  this.myHealthBar.setPosition( 600, 56 );
  this.healthValue = 100;

  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;
  bullets.createMultiple( 50, 'bullet' );
  bullets.setAll( 'checkWorldBounds', true );
  bullets.setAll( 'outOfBoundsKill', true );

  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple( 30, 'enemyBullet' );
  enemyBullets.setAll( 'outOfBoundsKill', true );
  enemyBullets.setAll( 'checkWorldBounds', true );
  enemyBullets.scale.setTo( 0.7, 0.7 );

  scoreText = game.add.text( 16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' } );
  livesText = game.add.text( 16, 56, 'lives : 3', { font: '25px Arial', fill: '#fff' } );

  gameOver = game.add.text( 150, game.world.centerY, '- game over - click to restart -', { font: "40px Arial", fill: "#ffffff"} );
  gameOver.visible = false;

  createBall();
}

function createBall() {
  cat = cats.create( game.world.randomX, 0, 'ball' );
  cat.body.setSize( 108, 70 )
  // cat.body.bounce.setTo(1, 1);
  cat.body.bounce.x = 1;
  cat.body.bounce.y = 0.9;
  cat.body.collideWorldBounds = true;
    total ++;
  if (score > 200){ cat.body.velocity.setTo(200, 200); }
}

function fire() {
  if ( game.time.now > nextFire && bullets.countDead() > 0 ){
    nextFire = game.time.now + fireRate;
    var bullet = bullets.getFirstDead();
    bullet.reset( player.x - 8, player.y - 8 );
    game.physics.arcade.moveToPointer( bullet, 650 );
  }
}

function enemyFires () {
  enemyBullet = enemyBullets.getFirstExists( false );
  livingEnemies.length = 0;
  enemyBullet.body.setSize( 58, 38 )

  cats.forEachAlive(function( alien ){
    livingEnemies.push( cat );
  });

  if (enemyBullet && livingEnemies.length > 0){
    var random=game.rnd.integerInRange( 0,livingEnemies.length-1 );
    var shooter=livingEnemies[random];
    enemyBullet.reset(shooter.body.x, shooter.body.y);
    game.physics.arcade.moveToObject(enemyBullet,player,450);
      if ( score < 400 ){ firingTimer = game.time.now + 1000; }
      else if ( score < 600 ) { firingTimer = game.time.now + 600; }
      else { firingTimer = game.time.now + 400; }
    }
}

function enemyHitsPlayer ( player, bullet ) {
  bullet.kill();
  this.healthValue = this.healthValue - 10;
  this.myHealthBar.setPercent(this.healthValue);
    if ( this.healthValue === 0 ){
      lives--;
      livesText.text = 'lives: ' + lives;

      if ( lives === 0 ){
        playerDeath();
        game.input.onTap.addOnce( restartA, this );
      } else { this.healthValue = 110; }
    }
}

function playerDeath(){
  gameOver.visible = true;
  player.kill();
}

function update() {

    game.physics.arcade.overlap( bullets, cats, collectCat, null, this );
    game.physics.arcade.overlap( bullets, enemyBullets, killEnemyBullet, null, this );
    game.physics.arcade.overlap( enemyBullets, player, enemyHitsPlayer, null, this );
    player.rotation = game.physics.arcade.angleToPointer(player);

      if ( game.input.activePointer.x < player.x ) {
        player.scale.x = 1; player.scale.y = -1 }
      else { player.scale.x = 1; player.scale.y = 1 }

  if ( swim.isDown ){
    player.animations.play('swims');
    game.physics.arcade.moveToPointer(player, 350);

      if( lives > 0){ fire(); }

      if ( Phaser.Rectangle.contains( player.body, game.input.x, game.input.y )) {
        player.animations.stop();
        player.body.velocity.setTo(0, 0);
        }
  } else {
      player.animations.stop();
      player.body.velocity.setTo(0, 0);
  }

  if ( game.time.now > firingTimer ){ enemyFires(); }

  if ( total < 5 ){ createBall(); }

  function killEnemyBullet ( bullet, enemyBullet ) { enemyBullet.kill(); }
  // game.physics.arcade.collide(this.cats, this.cats);

  function collectCat ( bullet, cat ) {
    cat.kill();
    total--;
    score += 10;
    scoreText.text = 'score: ' + score;
      if(score > highScore){
        highScore = score;
        localStorage.setItem( 'highScore', highScore );
      }
  }
}

function restartA () {
  lives = 3;
  livesText.text = 'lives: ' + lives;
  score = 0;
  scoreText.text = 'score: ' + score;
  this.healthValue = 110;
  this.myHealthBar.setPercent( this.healthValue );
  player.revive();
  gameOver.visible = false;
}
