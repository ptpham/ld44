// Attacks wrap Phaser game objects which can be used scene.overlap to determine damage, etc
class SwordSlash {
    constructor(scene, x, y, orientation, w, h) {
        const ox = x
        const oy = y
        if (orientation == 'up' || orientation == 'down') {
            // swap width/height
            const t = w
            w = h
            h = t
        }

        switch (orientation) {
            case 'left':
                x -= w / 2
                break
            case 'right':
                x += w / 2
                break
            case 'up':
                y -= h / 2
                break
            case 'down':
                y += h / 2
                break
        }
        console.log('swordslash', ox, oy, orientation, x, y, w, h)
        this.gameObject = scene.add.rectangle(x, y, w, h, 0xff0000)
    }
}

class GunBullet {
    constructor (scene, x, y, dx, dy, w, h) {
        // TODO(dkamm)
    }
}