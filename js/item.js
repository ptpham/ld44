// Items create Attack objects when they are used
class BaseItem {
    constructor(scene, cooldown) {
        this.scene = scene
        this.cooldown = cooldown
        this.ready = true
    }

    // returns a list of GameObject which will be added to player's attackGroup.
    // needed for overlap to work
    newAttacks(x, y, orientation) {
        return [];
    }
    resetCooldown() {
        this.ready = false
        setTimeout(() => { this.ready = true }, this.cooldown)
    }
}

// Returns a rectangle oriented toward direction of attack
function getAttackRect(scene, x, y, orientation, w, h, duration = 100) {
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
    const rect = scene.add.rectangle(x, y, w, h);
    setTimeout(() => {
        rect.destroy();
    }, duration);
    return rect;
}

class DefaultSword extends BaseItem {

    constructor(scene) {
        super(scene, 1000)
    }

    newAttacks(x, y, orientation) {
        let attack = getAttackRect(this.scene, x, y, orientation, 30, 50)
        attack.damage = 5 // hack: just add a property to the GameObject
        attack.hitstun = this.cooldown / 4;
        return [attack]
    }
}

class LongSword extends BaseItem {
    constructor(scene) {
        super(scene, 2000)
    }

    newAttacks(x, y, orientation) {
        let attack = getAttackRect(this.scene, x, y, orientation, 60, 50)
        attack.damage = 10
        attack.hitstun = this.cooldown / 4;
        return [attack]
    }
}

class Gun extends BaseItem {
    constructor(scene) {
        super(scene, 500)
    }

    newAttacks(x, y, orientation) {
      // TODO
      return [];
    }
}
