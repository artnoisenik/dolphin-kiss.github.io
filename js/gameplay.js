(function() {

  function input(){
    var person=prompt("Please enter your name","")
        uname = document.getElementById("uname");
        uname.innerHTML = 'Player: '+person+ '!'
}

  // var name = window.prompt("Who's playing?");

  // ('#sidebar').append('Name: ' + name);

  // var year = 0;
  // var month = 0;
  // var day = 0;
  //
  // function randomDate(){
  //   year = 2001 + Math.floor(Math.random() * 15);
  //   month = 1 + Math.floor(Math.random() * 12);
  //   day = 1 + Math.floor(Math.random() * 28);
  // }

  function spaceShot(){

    var year = 2001 + Math.floor(Math.random() * 15);
    var month = 1 + Math.floor(Math.random() * 12);
    var day = 1 + Math.floor(Math.random() * 28);

    var location = "https://api.nasa.gov/planetary/apod?date=" + year + "-" + month + "-" + day + "&api_key=OaFBdZCq89Gly77oIhEQF3fupeTBThyZ9mFAVYh8";

   $.getJSON(location)
     .done(function( data ) {
         console.log(data.hdurl);
         $("img").attr("src", data.hdurl);
         $("img").css('width', '100%');
         $("img").css('object-fit', 'fill');
         $("img").css('background-repeat', 'no-repeat');
     });
  }

  spaceShot();
  setInterval(spaceShot,20000);


  // if( x seconds) {
  //   generate random date;
  // }

  input();
})();


var game = new Phaser.Game(800, 800, Phaser.AUTO, 'container', { preload: preload, create: create, update: update }, transparent = true);

function preload() {
  game.load.image('water', 'assets/sky.png');
  game.load.image('dolphin', 'assets/diamond.png');
  game.load.image('ball', 'assets/pangball.png');
  game.load.image('bullet', 'assets/bullet.png');
  game.load.image('enemyBullet', 'assets/enemy-bullet.png');


}

var player;
var lives = 3;

var bullets;
var fireRate = 300;
var nextFire = 0;

var enemyBullet;
var firingTimer = 0;
var livingEnemies = [];

var swim;
var words;
var highScore = 0;
var score = 0;
var total = 0;


function create() {

  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 150;
  // game.add.sprite(0, 0, 'water');


  //player created/position
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dolphin');
  game.physics.arcade.enable(player);
  player.health = 100;
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

//Addint shift as swim key
  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

//Scoreboard
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff'});

  words = game.add.group();
  words.enableBody = true;

//Heathbar
  game.add.text(500, 16, 'Health', { font: '25px Arial', fill: '#fff' });
  var barConfig = {x: 200, y: 100, width: 200, height: 20};
  this.myHealthBar = new HealthBar(this.game, barConfig);
  this.myHealthBar.setPosition(600, 56);
  this.healthValue = 100;


// Create initial function instance
  createBall()

//Player Bullets
  bullets = game.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  bullets.createMultiple(50, 'bullet');
  bullets.setAll('checkWorldBounds', true);
  bullets.setAll('outOfBoundsKill', true);

// The enemy's bullets
  enemyBullets = game.add.group();
  enemyBullets.enableBody = true;
  enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
  enemyBullets.createMultiple(30, 'enemyBullet');
  enemyBullets.setAll('anchor.x', 0.5);
  enemyBullets.setAll('anchor.y', 1);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);

//Player lives
    livesText = game.add.text(16, 56, 'lives : 3', { font: '25px Arial', fill: '#fff' });

//Start text
introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
introText.anchor.setTo(0.5, 0.5);

game.input.onDown.add(createBall, this);


}

function createBall() {

  word = words.create(game.world.randomX, (Math.random() * 50), 'ball');
  word.body.bounce.y = 0.9;
  word.body.collideWorldBounds = true;

  total ++;

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(player.x - 8, player.y - 8);

        game.physics.arcade.moveToPointer(bullet, 400);
    }

}

function enemyFires () {

    //  Grab the first bullet we can from the pool
    enemyBullet = enemyBullets.getFirstExists(false);

    livingEnemies.length=0;

    words.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(word);
    });

    if (enemyBullet && livingEnemies.length > 0)
    {

        var random=game.rnd.integerInRange(0,livingEnemies.length-1);

        // randomly select one of them
        var shooter=livingEnemies[random];
        // And fire the bullet from this enemy
        enemyBullet.reset(shooter.body.x, shooter.body.y);

        game.physics.arcade.moveToObject(enemyBullet,player,320);
        firingTimer = game.time.now + 2000;
    }

}

function enemyHitsPlayer (player,bullet) {

    bullet.kill();

    this.healthValue = this.healthValue - 10;
    // if(this.healthValue === 0) this.healthValue = 0;
    this.myHealthBar.setPercent(this.healthValue);

    // this.healthValue = player.health - 10;

    console.log(lives);

    if (this.healthValue === 0)
    {
      lives--;
      livesText.text = 'lives: ' + lives;
      if (lives === 0)
   {
       gameOver();
   }
   else{
      this.healthValue = 110;

    }
    }

}

function update() {

    game.physics.arcade.overlap(bullets, words, collectWord, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

  //  only move when you click
  if (swim.isDown)
  {
      //  400 is the speed it will move towards the mouse
      game.physics.arcade.moveToPointer(player, 250);

      //  if it's overlapping the mouse, don't move any more
      if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
      {
          player.body.velocity.setTo(0, 0);
      }
  }
  else{
      player.body.velocity.setTo(0, 0);
  }

  //fire player bullet
  player.rotation = game.physics.arcade.angleToPointer(player);

  if (swim.isDown){
    fire();
  }

  //fire enemy bullet
  if (game.time.now > firingTimer)
{
    enemyFires();
}

  //create enemies
  if (total < 10){
      createBall();
  }

  //Kill enemis, update score and high score
  function collectWord (bullet, word) {
  word.kill();
  total--;
  score += 10;
  scoreText.text = 'score: ' + score;
    if(score > highScore){
      highScore = score;
      console.log(highScore);
      $('#highScoreTotal').text(highScore);
  }

  }

}

function gameOver () {

    player.velocity.setTo(0, 0);

    introText.text = 'Game Over!';
    introText.visible = true;

}

// function newHighScore() {
//   var highScore = 0;
//
// };
//
// $(score).on('change', newHighScore);
// newHighScore();

// console.log(score);
