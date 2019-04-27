
function update () {
  if (DEBUG) {
    state.debugText.text = state.screen.constructor.name + ' ' + state.player.state.constructor.name;
  }

  state.screen = state.screen.update() || state.screen;
}

