// Items create Attack objects when they are used
class BaseItem {
    constructor(scene, cooldown) {
        this.scene = scene
        this.cooldown = cooldown
        this.ready = true
    }

    // returns a list of GameObject which will be added to player's attackGroup.
    // needed for overlap to work
    newAttacks(x, y, orientation) {}
    resetCooldown() {
        this.ready = false
        setTimeout(() => { this.ready = true }, this.cooldown)
    }
}

// Returns a rectangle oriented toward direction of attack
function getAttackRect(scene, x, y, orientation, w, h) {
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
    return scene.add.rectangle(x, y, w, h)
}

class DefaultSword extends BaseItem {

    constructor(scene) {
        super(scene, 100)
    }

    newAttacks(x, y, orientation) {
        let attack = getAttackRect(this.scene, x, y, orientation, 30, 50)
        attack.damage = 5 // hack: just add a property to the GameObject
        return [attack]
    }
}

class LongSword extends BaseItem {
    constructor(scene) {
        super(scene, 200)
    }

    newAttacks(x, y, orientation) {
        let attack = getAttackRect(this.scene, x, y, orientation, 60, 50)
        attack.damage = 10
        return [attack]
    }
}

class Gun extends BaseItem {
    constructor(scene) {
        super(scene, 100)
    }

    newAttacks(x, y, orientation) {
        return [new GunBullet(x, y)]
    }
}
