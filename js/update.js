
function update ()
{
  if (DEBUG) {
    state.debugText.text = state.screen;
  }

  const updaters = {
    [TITLE]: function() {
      if (
        state.cursors.left.isDown ||
        state.cursors.right.isDown ||
        state.cursors.up.isDown ||
        state.cursors.down.isDown
      ) {
        state.screen = STAGING;
      }
    },
    [STAGING]: function () {
      move();
    },
    [FIGHT]: function () { },
    [GAME_OVER]: function () { },
    [WIN]: function () { },
    [CREDITS]: function () { },
  }

  updaters[state.screen]();
}

function move() {
  if (state.cursors.left.isDown) {
    state.player.setVelocityX(-160);
    state.player.anims.play('left', true);
  }
  else if (state.cursors.right.isDown) {
    state.player.setVelocityX(160);
    state.player.anims.play('right', true);
  } else {
    state.player.setVelocityX(0);
  }

  if (state.cursors.up.isDown) {
    state.player.setVelocityY(-160);
  }
  else if (state.cursors.down.isDown) {
    state.player.setVelocityY(160);
  }
  else {
    state.player.setVelocityY(0);
  }

  if (
    state.player.body.velocity.x === 0 &&
    state.player.body.velocity.y === 0
  ) {
    state.player.anims.play('stand', true);
  }
}

