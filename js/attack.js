class BaseAttack {
    constructor({fighter, item, damage, hitstun, sprite}) {
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
    constructor({fighter, item, damage, hitstun, duration, range, w, h}) {
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
            if (fighter !== state.player) {
                sprite.tint = 0xff3333;
            }

            sprite.anims.play('slash');
            sprite.anims.setTimeScale(500 / duration);
            return sprite;
        }

        const sprite = makeSlashSprite();
         // Make an extra so we see the slashes even when they hit
        const sprite2 = makeSlashSprite();

        super({fighter, item, damage, hitstun, sprite})
        this.sprite2 = sprite2;
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

    onCollideAttack() {
        this.sprite2.alpha = 0.5;
    }
}

class Bullet extends BaseAttack {
    constructor({fighter, item, damage, hitstun, w, h, duration, speed}) {
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

        let sprite = scene.physics.add.sprite(x, y, 'bullet');
        console.log(sprite);
        sprite.scaleX = w / sprite.width;
        sprite.scaleY = h / sprite.height;
        sprite.flipX = orientation === 'left';
        sprite.flipY = orientation === 'up';
        if (fighter !== state.player) {
            sprite.tint = 0xff3333;
        }

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
        super({fighter, item, damage, hitstun, sprite})
        setTimeout(() => {
            sprite.destroy();
            this.active = false
        }, duration)
    }
    onCollideEnemy(enemy, enemyInputs) {
        if (!this.active) return;
        enemyInputs.hitstun = this.hitstun || 0;
        enemyInputs.damage = this.damage
        this.active = false;
    }
}

class Block extends BaseAttack {
    constructor({fighter, item, pushback, w, h, duration}) {
        const dir = fighter.orientation;

        const center = fighter.sprite.getCenter();
        const scene = fighter.sprite.scene;
        const sprite = scene.physics.add.sprite(center.x, center.y, 'block');
        sprite.scaleX = w / sprite.width;
        sprite.scaleY = h / sprite.height;
        sprite.anims.play('block');

        switch(dir) {
            case 'left':
                sprite.flipX = true;
                sprite.x -= fighter.sprite.width / 2 + 12;
                break;
            case 'right':
                sprite.x += fighter.sprite.width / 2 + 12;
                break;
            case 'up':
                sprite.rotation = -Math.PI / 2;
                sprite.body.width = h;
                sprite.body.height = w;
                sprite.y -= fighter.sprite.height / 2 + 24;
                break;
            case 'down':
                sprite.rotation = Math.PI / 2;
                sprite.body.width = h;
                sprite.body.height = w;
                sprite.y += fighter.sprite.height / 2 + 24;
                break;
        }

        if (fighter !== state.player) {
            sprite.tint = 0xaaaaff;
        } else {
            sprite.tint = 0xaaaaaa;
        }

        super({ fighter, item, damage: 0, hitstun: 0, sprite });
        setTimeout(() => {
            sprite.destroy();
            this.active = false
        }, duration)
        this.pushback = pushback;
        this.orientation = dir;
    }
    onCollideAttack(otherAttack, userInputs, enemyInputs) {
        if (!this.active) return;
        const dir = this.orientation;

        otherAttack.active = false;
        otherAttack.sprite.destroy();
        userInputs.pushback = {
            x: dir === 'left' ? this.pushback : dir === 'right' ? -this.pushback : 0,
            y: dir === 'up' ? this.pushback : dir === 'down' ? -this.pushback : 0
        };
        enemyInputs.pushback = {
            x: -userInputs.pushback.x,
            y: -userInputs.pushback.y
        };
        this.active = false;
    }
}
