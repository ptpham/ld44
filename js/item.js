// Items create Attack objects when they are used
class BaseItem {
    constructor(cooldown) {
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
function getAttackRect(fighter, d, w, h, duration = 100) {
    const orientation = fighter.orientation;
    const scene = fighter.sprite.scene;

    if (orientation == 'up' || orientation == 'down') {
        // swap width/height
        const t = w
        w = h
        h = t
    }

    const center = fighter.sprite.getCenter();
    let x = center.x;
    let y = center.y;

    switch (orientation) {
        case 'left':
            x = center.x - fighter.sprite.width / 2 - d;
            y = center.y;
            break
        case 'right':
            x = center.x + fighter.sprite.width / 2 + d;
            y = center.y;
            break
        case 'up':
            x = center.x
            y = center.y - fighter.sprite.height/2 - d;
            break
        case 'down':
            x = center.x
            y = center.y + fighter.sprite.height/2 + d;
            break
    }
    const rect = scene.add.rectangle(x, y, w, h);
    setTimeout(() => { rect.destroy(); }, duration);
    return rect;
}

class DefaultSword extends BaseItem {

    constructor() {
        super(1000)
        this.range = 20;
    }

    newAttacks(fighter) {
        let attack = getAttackRect(fighter, this.range, 30, 50)
        attack.damage = 1 // hack: just add a property to the GameObject
        attack.hitstun = this.cooldown / 4;
        return [attack]
    }
}

class SuperSlowSword extends BaseItem {

    constructor() {
        super(5000)
        this.range = 15;
    }

    newAttacks(fighter) {
        let attack = getAttackRect(fighter, this.range, 40, 70)
        attack.damage = 1
        attack.hitstun = 500;
        return [attack]
    }
}

class LongSword extends BaseItem {
    constructor() {
        super(2000)
        this.range = 20;
    }

    newAttacks(fighter) {
        let attack = getAttackRect(fighter, this.ranve, 60, 50)
        attack.damage = 2
        attack.hitstun = this.cooldown / 4;
        return [attack]
    }
}

class Gun extends BaseItem {
    constructor() {
        super(500)
    }

    newAttacks(fighter) {
      // TODO
      return [];
    }
}
