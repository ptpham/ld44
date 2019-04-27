
function getOrientationStr(dx, dy) {
    if (dx != 0) {
        return dx > 0 ? "right" : "left"
    }
    return dy > 0 ? "down" : "up"
}