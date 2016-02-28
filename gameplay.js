var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('water', 'assets/sky.png');
  game.load.image('dolphin', 'assets/diamond.png');

}

var player;
var swim;

function create() {
  //background water created/position
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.add.sprite(0, 0, 'water');

  //player created/position
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'dolphin');
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  swim = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);

}

function update() {

  //  only move when you click
  if (swim.isDown)
  {
      //  400 is the speed it will move towards the mouse
      game.physics.arcade.moveToPointer(player, 400);

      //  if it's overlapping the mouse, don't move any more
      if (Phaser.Rectangle.contains(player.body, game.input.x, game.input.y))
      {
          player.body.velocity.setTo(0, 0);
      }
  }
  else
  {
      player.body.velocity.setTo(0, 0);
  }

}
