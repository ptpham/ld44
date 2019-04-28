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
function getAttackRect(fighter, d, w, h, duration = 200) {
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

    // Add some random noise for variation
    x += Math.random() * 20 - 10;
    y += Math.random() * 20 - 10;

    const rect = scene.add.rectangle(x, y, w, h);
    const sprite = scene.add.sprite(x, y, 'slash');
    sprite.scaleX = w/sprite.width;
    sprite.scaleY = h/sprite.height;
    sprite.flipX = orientation === 'left';
    sprite.flipY = orientation === 'up';

    sprite.anims.play('slash');
    sprite.anims.setTimeScale(500 / duration);

    setTimeout(() => { rect.destroy(); sprite.destroy(); }, duration);
    return rect;
}

class DefaultSword extends BaseItem {

    constructor() {
        super(500)
        this.range = 20;
    }

    newAttacks(fighter) {
        let attack = getAttackRect(fighter, this.range, 30, 50, this.cooldown)
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
        super(1000)
        this.range = 20;
    }

    newAttacks(fighter) {
        let attack = getAttackRect(fighter, this.range, 60, 50, this.cooldown)
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
