// Items create Attack objects when they are used

class ItemManager {
    // Item manager renders the Item UI
    constructor(scene) {
        this.scene = scene;
        const itemSprites = state.allPickItems.map(item => {
            return item.spriteName;
        });
        // Remember the humble stick
        itemSprites.push('stick');

        this.containers = {};
        
        itemSprites.forEach((key, i) => {
            const container = this.createItemBox(key, i);
            this.containers[key] = container;
        });
    }

    createItemBox(itemKey, i) {
        const scene = this.scene;
        const container = scene.add.container(-WIDTH, -HEIGHT);
        const itemSprite = scene.add.sprite(0, 0, 'items');
        const box = scene.add.sprite(0, 0, 'box');
        const white = scene.add.sprite(0, 0, 'white');
        white.scaleX = ITEM_BOX_SIZE;
        white.scaleY = ITEM_BOX_SIZE;
        white.alpha = 0.5;
        white.x = ITEM_BOX_SIZE/2;
        white.y = ITEM_BOX_SIZE/2;

        itemSprite.anims.play(itemKey);

        container.add(white);
        container.add(box);
        container.add(itemSprite);
        container.box = box;
        return container;
    }

    update() {
        let { player } = state;
        const currentItem = player.getCurrentItem();
        player.items.forEach((item, i) => {
            const container = this.containers[item.spriteKey];
            container.x = (ITEM_BOX_SIZE + 5) * i + ITEM_BOX_SIZE;
            container.y = HEIGHT - ITEM_BOX_SIZE;
            container.alpha = item === currentItem ? 1: 0.5;
            container.box.frame = state.screen instanceof FightingScreen ?
                container.box.texture.frames[1] :
                container.box.texture.frames[0];
        });
    }
}

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
        this.spriteKey = 'stick';
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
        state.screen.scene.sound.play('boss_attack', { volume: 0.2 });
        return [
            new Slash({
                fighter,
                item: this,
                damage: 1,
                hitstun: this.cooldown / 6,
                duration: 1000,
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
        this.spriteKey = 'sword';
    }

    getAttacks(fighter) {
        state.screen.scene.sound.play('longsword_swipe', { volume: 0.2 });
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
        this.spriteKey = 'gun';
    }

    getAttacks(fighter) {
        state.screen.scene.sound.play('bullet_firing', { volume: 0.2 });
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
        this.spriteKey = 'shield';
    }

    getAttacks(fighter) {
        state.screen.scene.sound.play('shield_parry', { volume: 0.2 });
        return [
            new Block({ fighter, item: this, pushback: 100, w: 30, h: 80, duration: this.cooldown })
        ]
    }
}
