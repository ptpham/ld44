
function getOrientationStr(dx, dy) {
    if (dx != 0) {
        return dx > 0 ? "right" : "left"
    }
    return dy > 0 ? "down" : "up"
}

function resizeAndCenterBody(sprite, width, height) {
    sprite.body.width = width;
    sprite.body.height = height;
    sprite.body.offset.x = (sprite.width - width) / 2;
    sprite.body.offset.y = (sprite.height - height) / 2;
}