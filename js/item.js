// Items create Attack objects when they are used
class BaseItem {
    constructor(scene, cooldown) {
        this.scene = scene
        this.cooldown = cooldown
        this.ready = true
    }

    newAttacks(x, y, orientation) {}
    resetCooldown() {
        this.ready = false
        setTimeout(() => { this.ready = true }, this.cooldown)
    }
}

class DefaultSword extends BaseItem {

    constructor(scene) {
        super(scene, 100)
    }

    newAttacks(x, y, orientation) {
        return [new SwordSlash(this.scene, x, y, orientation, 30, 50)]
    }
}

class LongSword extends BaseItem {
    constructor(scene) {
        super(scene, 200)
    }

    newAttacks(x, y, orientation) {
        return [new SwordSlash(this.scene, x, y, orientation, 60, 50)]
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
