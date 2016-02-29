SC.initialize({
  client_id: '27f99f4210b158b064142eba4909d231',
});

SC.stream('/tracks/293').then(function(player){
  player.play();
});

// SC.get('/tracks', {
//   genres: 'seapunk', bpm: { from: 60 }
// }).then(function(tracks) {
//   console.log(tracks);
//   for(i = 0; i < tracks.length; i++){
//     console.log(tracks[i].stream_url);
//     SC.stream('/tracks/293').then(function(player){
//     player.play();
//   });
//   }
// });




var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('water', 'assets/sky.png');
  game.load.image('dolphin', 'assets/diamond.png');
  game.load.image('ball', 'assets/pangball.png');
  game.load.bitmapFont('stack', 'assets/fonts/bitmapFonts/shortStack.png', 'assets/fonts/bitmapFonts/shortStack.xml');

}

var player;
var swim;
var words;
var score = 0;
var total = 0;
var text1;


function create() {

  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.physics.arcade.gravity.y = 150;
  game.add.sprite(0, 0, 'water');

  // text1 = game.add.bitmapText(200, 100, 'stack', 'BitmapText', 64);
  // game.physics.arcade.enable(text1);
  // text1.body.velocity.setTo(200, 200);
  // text1.body.collideWorldBounds = true;
  // text1.body.bounce.set(1);


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
