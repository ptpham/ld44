
function update () {
  if (DEBUG) {
    state.debugText.text = state.screen;
  }

  state.screen = state.screen.update() || state.screen;
}

