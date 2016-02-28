var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('water', 'assets/sky.png');
  game.load.image('dolphin', 'assets/diamond.png');
  game.load.image('ball', 'assets/pangball.png');

}

var player;
var swim;
var words;
var score = 0;
var total = 0;

function create() {
  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 150;
  game.add.sprite(0, 0, 'water');


  //player created/position
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dolphin');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //Addint shift as swim key
  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

  //Scoreboard
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000'});

  words = game.add.group();
  stars.enableBody = true;

  //Create initial function instance
  createBall()

}

function createBall() {

  var word = words.create(game.world.randomX, (Math.random() * 50), 'ball');
  // game.physics.enable(word, Phaser.Physics.ARCADE);
  ball.body.bounce.y = 0.9;
  ball.body.collideWorldBounds = true;

  total ++;

}

function update() {

    game.physics.arcade.overlap(player, words, collectWord, null, this);

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

  function collectWord (player, words) {
  words.kill();
  score += 10;
  scoreText.text = 'Score: ' + score;
}

}
