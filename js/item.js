// Items create Attack objects when they are used
class BaseItem {
    constructor(cooldown) {
        this.cooldown = cooldown
        this.ready = true
    }

    // creates new attacks
    getAttacks(fighter) { return []; }
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
        state.screen.scene.sound.play('stick_hit', { volume: 0.2 });
        return [
            new Slash({
                fighter,
                item: this,
                damage: 1,
                hitstun: this.cooldown / 4,
                duration: this.cooldown,
                range: this.range,
                w: 30,
                h: 50
            })
        ]
    }
}

class SuperSlowSword extends BaseItem {

    constructor() {
        super(5000)
        this.range = 15;
    }

    getAttacks(fighter) {
        state.screen.scene.sound.play('boss_attack');
        return [
            new Slash({
                fighter,
                item: this,
                damage: 1,
                hitstun: this.cooldown / 6,
                duration: this.cooldown,
                range: this.range,
                w: 40,
                h: 70
            })
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
        state.screen.scene.sound.play('longsword_swipe');
        return [
            new Slash({
                fighter,
                item: this,
                damage: 2,
                hitstun: this.cooldown / 4,
                duration: this.cooldown,
                range: this.range,
                w: 60,
                h: 50
            })
        ]
    }
}

class Gun extends BaseItem {
    constructor() {
        super(500)
        this.playerAttackSprite = 'gun';
    }

    getAttacks(fighter) {
        state.screen.scene.sound.play('bullet_firing');
        return [
            new Bullet({
                fighter,
                item: this,
                damage: 1,
                hitstun: 50,
                w: 10,
                h: 10,
                duration: 1000,
                speed: 500
            })
        ]
    }
}

class Shield extends BaseItem {
    constructor() {
        super(1000)
        this.playerAttackSprite = 'shield';
    }

    getAttacks(fighter) {
        return [
            new Block({ fighter, item: this, pushback: 100, w: 30, h: 80, duration: this.cooldown })
        ]
    }
}
