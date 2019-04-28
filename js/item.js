// Items create Attack objects when they are used
class BaseItem {
    constructor(cooldown) {
        this.cooldown = cooldown
        this.ready = true
    }

    // creates new attacks
    getAttacks(fighter) {}
    resetCooldown() {
        this.ready = false
        setTimeout(() => { this.ready = true }, this.cooldown)
    }
}

class DefaultSword extends BaseItem {

    constructor() {
        super(500)
        this.range = 20;
        this.playerAttackSprite = 'stick';
    }

    getAttacks(fighter) {
        return [new Slash(fighter, this, 1, this.cooldown / 4, this.cooldown,
            this.range, 30, 50)
        ]
    }
}

class SuperSlowSword extends BaseItem {

    constructor() {
        super(5000)
        this.range = 15;
    }

    getAttacks(fighter) {
        return [
            new Slash(fighter, this, 1, this.cooldown / 6, this.cooldown,
            this.range, 40, 70)
        ]
    }
}

class LongSword extends BaseItem {
    constructor() {
        super(1000)
        this.range = 20;
        this.playerAttackSprite = 'sword';
    }

    getAttacks(fighter) {
        return [
            new Slash(fighter, this, 2, this.cooldown / 4,
            this.cooldown, this.range, 60, 50)
        ]
    }
}

class Gun extends BaseItem {
    constructor() {
        super(500)
        this.playerAttackSprite = 'gun';
    }

    getAttacks(fighter) {
        return [
            new Bullet(fighter, this, 1, 10,
                10000, 10, this.cooldown)
        ]
    }
}
