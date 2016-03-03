(function() {

  function greet(){
    person = localStorage.getItem("name");
    lastHighScore = localStorage.getItem('highScore');
    if (person == null || person == "null"){
      alert("Hi, Stranger!");
      person = prompt("What is your name?");
      localStorage.setItem("name", person);
    } else {
      alert ("Hi, " + person + "!");
    } // end greet
      uname.innerHTML = 'Player: '+person+ '!';
      highScoreTotal.innerHTML = 'High Score: '+lastHighScore;

      // $('#highScoreTotal').text(lastHighScore);
  } // end function



//   function input(){
//     var person=prompt("Please enter your name","")
//         uname = document.getElementById("uname");
//         uname.innerHTML = 'Player: '+person+ '!'
// }

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
         var spacePic = document.getElementById('spaceBackground');
         $(spacePic).attr("src", data.hdurl);
         $(spacePic).css('height', '100%');
         $(spacePic).css('object-fit', 'fill');
         $(spacePic).css('background-repeat', 'no-repeat');
     });
  }

  spaceShot();
  setInterval(spaceShot,20000);


  // if( x seconds) {
  //   generate random date;
  // }

  // input();
  greet();
})();


var game = new Phaser.Game(800, 600, Phaser.AUTO, 'container', { preload: preload, create: create, update: update }, transparent = true);

function preload() {
  game.load.image('water', 'assets/sky.png');
  // game.load.image('dolphin', 'assets/diamond.png');
  game.load.spritesheet('dolphin','assets/dolphin.png', 108, 48);
  game.load.image('ball', 'assets/greenCat.png');
  game.load.image('bullet', 'assets/heart_clear.png');
  game.load.image('enemyBullet', 'assets/bulletCat_small.png');


}

var player;
var lives = 1;

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
var gameOver;
// var uname = document.getElementById("uname");
// var scoreHtml = document.getElementById("highScoreTotal");

// var config = {
//   fullName: document.getElementById('name').getAttribute('value'),
//   userId: document.getElementById('id').getAttribute('value')
// };
//
// localStorage.setItem('config', JSON.stringify(config));


function create() {

  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 50;
  // game.add.sprite(0, 0, 'water');


  //player created/position
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dolphin');
  // player.scale.setTo(2,2);
  player.animations.add('swims', [0, 1, 2, 3], 10, true);
  player.anchor.setTo(0.5,0.5);
  // player.scale.x = -1

  game.physics.arcade.enable(player);
  player.health = 100;
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

//Addint shift as swim key
  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

//Scoreboard
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff'});

  //creat enemies
  words = game.add.group();
  words.enableBody = true;
  // Create initial function instance
    createBall();

//Heathbar
  game.add.text(500, 16, 'Health', { font: '25px Arial', fill: '#fff' });
  var barConfig = {x: 200, y: 100, width: 200, height: 20};
  this.myHealthBar = new HealthBar(this.game, barConfig);
  this.myHealthBar.setPosition(600, 56);
  this.healthValue = 100;

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
  // enemyBullets.setAll('anchor.x', 0.5);
  // enemyBullets.setAll('anchor.y', 1);
  enemyBullets.setAll('outOfBoundsKill', true);
  enemyBullets.setAll('checkWorldBounds', true);
  enemyBullets.scale.setTo(0.7,0.7);

//Player lives
    livesText = game.add.text(16, 56, 'lives : 3', { font: '25px Arial', fill: '#fff' });

//Start text

//  Game over text
  gameOver = game.add.text(game.world.centerX, game.world.centerY, '- game over -', { font: "40px Arial", fill: "#ffffff", align: "center" });
  gameOver.visible = false;

}

function createBall() {


  word = words.create(game.world.randomX, 0, 'ball');
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

        game.physics.arcade.moveToObject(enemyBullet,player,350);
        firingTimer = game.time.now + 1000;
    }

}

function enemyHitsPlayer (player,bullet) {

    bullet.kill();

    this.healthValue = this.healthValue - 10;
    // if(this.healthValue === 0) this.healthValue = 0;
    this.myHealthBar.setPercent(this.healthValue);

    // this.healthValue = player.health - 10;

    console.log(lives);

    if (this.healthValue === 0){
      console.log('loss');
      lives--;
      livesText.text = 'lives: ' + lives;
    if (lives === 0){
      gameOver.visible = true;
      player.kill();
      game.input.onTap.addOnce(restartA,this);
    }
   else{
      this.healthValue = 110;
    }
  }
}

function update() {

    game.physics.arcade.overlap(bullets, words, collectWord, null, this);
    game.physics.arcade.overlap(bullets, enemyBullets, killEnemyBullet, null, this);
    game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);

    player.rotation = game.physics.arcade.angleToPointer(player);
    if (game.input.activePointer.x < player.x) { player.scale.x = 1; player.scale.y = -1 }
    else { player.scale.x = 1; player.scale.y = 1 }

  if (swim.isDown){
    player.animations.play('swims');
    game.physics.arcade.moveToPointer(player, 250);
      if( lives > 0){
        fire();
      }



      //  if it's overlapping the mouse, don't move any more
      if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y)){
          player.animations.stop();
          player.body.velocity.setTo(0, 0);
      }
  }
  else{
      player.animations.stop();
      player.body.velocity.setTo(0, 0);
  }

  //fire player bullet
  // if(lives > 0){
  // player.rotation = game.physics.arcade.angleToPointer(player);

  if (swim.isDown){

  }
// }

  //fire enemy bullet
  if (game.time.now > firingTimer)
{
    enemyFires();
}

  //create enemies
  if (total < 5){
      createBall();
  }

  //Kill enemis, update score and high score
  function killEnemyBullet (bullet, enemyBullet) {
    enemyBullet.kill();
  }

  //Kill enemis, update score and high score
  function collectWord (bullet, word) {
    enemyBullet.kill();
    word.kill();
    total--;
    score += 10;
    scoreText.text = 'score: ' + score;
      if(score > highScore){
        highScore = score;
        localStorage.setItem('highScore', highScore);
      }
  }

}



function restartA () {

    lives = 3;
    livesText.text = 'lives: ' + lives;
    score = 0;
    scoreText.text = 'score: ' + score;
    this.healthValue = 110;
    this.myHealthBar.setPercent(this.healthValue);
    player.revive();
    gameOver.visible = false;

}
