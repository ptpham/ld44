
function update () {
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
  let playerX = 0, playerY = 0;
  if (state.cursors.left.isDown) {
    playerX = -1; 
  } else if (state.cursors.right.isDown) {
    playerX = 1;
  }

  if (state.cursors.up.isDown) {
    playerY = -1;
  } else if (state.cursors.down.isDown) {
    playerY = 1;
  }

  state.player.move(playerX, playerY);
}

