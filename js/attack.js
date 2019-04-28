class BaseAttack {
    constructor(fighter, item, damage, hitstun, sprite) {
        this.fighter = fighter
        this.item = item
        this.damage = damage
        this.hitstun = hitstun
        this.sprite = sprite
        this.active = true

        // bind this to sprite for reference in physics.overlap
        this.sprite.attack = this
    }

    onCollideAttack(attack) {}
    onCollideEnemy(enemy, enemyInputs) {}
}

class Slash extends BaseAttack {
    constructor(fighter, item, damage, hitstun, duration, range, w, h) {
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
                x = center.x - fighter.sprite.width / 2 - range;
                y = center.y;
                break
            case 'right':
                x = center.x + fighter.sprite.width / 2 + range;
                y = center.y;
                break
            case 'up':
                x = center.x
                y = center.y - fighter.sprite.height/2 - range;
                break
            case 'down':
                x = center.x
                y = center.y + fighter.sprite.height/2 + range;
                break
        }

        // Add some random noise for variation
        x += Math.random() * 20 - 10;
        y += Math.random() * 20 - 10;
        const rotation = Math.random() * 2 -1;

        function makeSlashSprite() {
            const sprite = scene.physics.add.sprite(x, y, 'slash');
            sprite.scaleX = w / sprite.width;
            sprite.scaleY = h / sprite.height;
            sprite.flipX = orientation === 'left';
            sprite.flipY = orientation === 'up';
            sprite.rotation = rotation;

            sprite.anims.play('slash');
            sprite.anims.setTimeScale(500 / duration);
            return sprite;
        }

        const sprite = makeSlashSprite();
         // Make an extra so we see the slashes even when they hit
        const sprite2 = makeSlashSprite();

        super(fighter, item, damage, hitstun, sprite)
        setTimeout(() => {
            sprite.destroy();
            sprite2.destroy();
            this.active = false
        }, duration)
    }

    onCollideEnemy(enemy, enemyInputs) {
        if (!this.active) return;
        console.log('slash', 'damage', this.damage, 'hitstun', this.hitstun, 'enemyHealth', enemy.health)
        enemyInputs.hitstun = this.hitstun || 0;
        enemyInputs.damage = this.damage
        this.active = false
    }
}

class Bullet extends BaseAttack {
    constructor(fighter, item, damage, hitstun, w, h, duration, speed) {
        const orientation = fighter.orientation;
        const scene = fighter.sprite.scene;
        const length = w;

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
                x = center.x - length/2;
                y = center.y;
                break
            case 'right':
                x = center.x + length/2;
                y = center.y;
                break
            case 'up':
                x = center.x
                y = center.y - length / 2;
                break
            case 'down':
                x = center.x
                y = center.y + length / 2;
                break
        }

        // Add some random noise for variation
        x += Math.random() * 20 - 10;
        y += Math.random() * 20 - 10;

        let sprite = scene.physics.add.sprite(x, y, 'gun-fire');
        sprite.scaleX = w / sprite.width;
        sprite.scaleY = h / sprite.height;
        sprite.flipX = orientation === 'left';
        sprite.flipY = orientation === 'up';

        switch (orientation) {
            case 'left':
                sprite.setVelocityX(-speed)
                break
            case 'right':
                sprite.setVelocityX(speed)
                break
            case 'up':
                sprite.setVelocityY(-speed)
                break
            case 'down':
                sprite.setVelocityY(speed)
                break
        }
        console.log('bullet', sprite.getCenter(), 'sprite', sprite, 'orientation', orientation);
        super(fighter, item, damage, hitstun, sprite)
        setTimeout(() => {
            sprite.destroy();
            this.active = false
        }, duration)
    }
    onCollideEnemy(enemy, enemyInputs) {
        if (!this.active) return;
        console.log('bullet', 'damage', this.damage, 'hitstun', this.hitstun, 'enemyHealth', enemy.health,
            this.sprite.getCenter())
        enemyInputs.hitstun = this.hitstun || 0;
        enemyInputs.damage = this.damage
        this.active = false;
    }
}