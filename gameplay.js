

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

}

var player;
var swim;
var words;
var highScore = 0;
var score = 0;
var total = 0;
var text1;


function create() {

  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 150;
  // game.add.sprite(0, 0, 'water');


  //player created/position
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dolphin');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //Addint shift as swim key
  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  //Scoreboard
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff'});

  words = game.add.group();
  words.enableBody = true;

  // Create initial function instance
  createBall()


}

function createBall() {

  word = words.create(game.world.randomX, (Math.random() * 50), 'ball');
  word.body.bounce.y = 0.9;
  word.body.collideWorldBounds = true;

  total ++;

}

function update() {

    game.physics.arcade.overlap(player, words, collectWord, null, this);
    // game.physics.arcade.overlap(player, text1, collectWord, null, this);

  //  only move when you click
  if (swim.isDown)
  {
      //  400 is the speed it will move towards the mouse
      game.physics.arcade.moveToPointer(player, 350);

      //  if it's overlapping the mouse, don't move any more
      if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
      {
          player.body.velocity.setTo(0, 0);
      }
  }
  else{
      player.body.velocity.setTo(0, 0);
  }

  if (total < 10){
      createBall();
  }

  function collectWord (player, word) {
  word.kill();
  total--;
  score += 10;
  scoreText.text = 'Score: ' + score;
  }

}

function newHighScore() {
  var highScore = 0;
    if(score>highScore){
      console.log(highScore);
      // $('#sidebar').text(highScore);
    }
};

$(score).on('change', newHighScore);
newHighScore();

// console.log(score);
