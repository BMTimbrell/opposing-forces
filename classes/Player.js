import { EnemyProjectile } from './Projectile.js';
import Shield from './Shield.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.restart();
        this.animationImage = document.getElementById('animations');
        this.xOffset = 0;
        this.dAnimationDelay = this.animationDelay;
        this.dAnimationTimer = this.dAnimationDelay;
    }

    draw(context) {
        // draw ship
        context.drawImage(
            this.image, 
            this.frameX * this.width / this.game.scale, 
            this.frameY * this.width / this.game.scale, 
            this.width / this.game.scale, 
            this.height / this.game.scale,
            this.x,
            this.y,
            this.width,
            this.height
        );
        
        //draw jets
        if (this.lives > 0) {
            context.drawImage(
                this.animationImage, 
                this.jetsFrameX * this.width / this.game.scale, 
                this.jetsFrameY * this.width / this.game.scale, 
                this.width / this.game.scale, 
                this.height / this.game.scale,
                this.x - this.xOffset,
                this.y + this.height - 10,
                this.width,
                this.height
            );
        }

        //draw shield
        if (this.shield) {
            this.shield.draw(context);
        }
    }

    update() {
        // check for max lives upgrades
        if (this.upgrades.increasedLives) this.maxLives = 4;
        if (this.upgrades.increasedLives_2) this.maxLives = 6;

        // shield upgrade
        if (this.shield) this.shield.update();

        // horizontal movement
        if (this.lives > 0) {
            if (this.game.keys.indexOf('a') > -1) {
                this.x -= this.speed;
                this.frameX = 0;
                this.xOffset = 8;
                if (this.shield) this.shield.x -= this.speed;
            } else if (this.game.keys.indexOf('d') > -1) {
                this.x += this.speed;
                this.frameX = 2;
                this.xOffset = -8;
                if (this.shield) this.shield.x += this.speed;
            } else {
                this.frameX = 1;
                this.xOffset = 0;
            }
        }
        
        // rocket cooldown
        if (this.rocketOnCooldown)
            this.upgrades.reducedRocketCooldown ? this.rocketCooldownTimer++ 
            : this.rocketCooldownTimer += 0.5;

        this.rocketOnCooldown = this.rocketCooldownTimer < this.rocketCooldown;

        // shooting
        if (this.game.keys.indexOf(' ') > -1 && this.canFire && this.lives > 0) 
            this.shoot();

        // fire rocket
        if (
            this.game.keys.indexOf('e') > -1 && 
            this.upgrades.rocket && 
            !this.rocketOnCooldown &&
            this.lives > 0
        ) {
            const rocket = this.game.getProjectile('rocket');
            if (rocket) {
                rocket.start(this.x + this.width / 2 - this.xOffset, this.y);
            }
            this.rocketOnCooldown = true;
            this.rocketCooldownTimer = 0;
        }

        // horizontal boundaries
        if (this.x < -this.width / 2) {
            this.x = -this.width / 2;
            if (this.shield) this.shield.x = -this.shield.width / 2;
        } else if (this.x > this.game.width - this.width / 2) {
            this.x = this.game.width - this.width / 2;
            if (this.shield) this.shield.x = this.game.width - this.shield.width / 2;
        } 
   
        // rapid fire upgrade
        if (this.upgrades.rapidFire_2) this.attackInterval = 10;
        else if (this.upgrades.rapidFire) this.attackInterval = 15;

        // attack interval for shooting
        if (this.attackTimer > this.attackInterval) {
            this.canFire = true;
        } else {
            this.canFire = false;
            this.attackTimer++;
        }
       
        // jets animation
        this.animationTimer--;
        if (this.animationTimer === 0 && this.lives > 0) {
            this.animationTimer = this.animationDelay;
            this.jetsFrameX++;
            if (this.jetsFrameX === this.maxAnimationFrame) {
                this.jetsFrameX = this.animationStartFrame;
            }
        }

        // death animation
        if (this.lives === 0) {
            this.dAnimationTimer--;
            if (this.dAnimationTimer === 0) {
                this.dAnimationTimer = this.dAnimationDelay;
                this.frameX++;
                if (this.frameX === this.maxAnimationFrame) {
                    this.doneDying = true;
                }
            }
        }

        // change sprite when have dual shot upgrade
        if (this.upgrades.dualShot) this.frameY = 2;

        // collision with enemy projectiles
        this.game.projectilesPool.forEach(projectile => {
            if (
                !projectile.free && 
                projectile instanceof EnemyProjectile && 
                this.game.checkCollision(projectile, this) &&
                this.lives > 0
            ) {
                this.lives -= projectile.damage;
                if (this.lives === 0) this.die();
                projectile.reset();
            }
        });
    }

    shoot() {
        const projectileType = !this.upgrades.strongLasers ? 'projectile' : 'strongLaser';
        if (!this.upgrades.dualShot) {
            const projectile = this.game.getProjectile(projectileType);
            if (projectile) projectile.start(this.x + this.width / 2 - this.xOffset, this.y);
        } else {
            const projectiles = this.game.getProjectile(projectileType, 2);
            const projectile_1 = projectiles[0];
            const projectile_2 = projectiles[1];
            if (projectile_1 && projectile_2) {
                projectile_1.start(this.x + 15 - this.xOffset, this.y);
                projectile_2.start(this.x + 65 - this.xOffset, this.y);
            }
        }
        this.attackTimer = 0;
    }

    resetShield() {
        this.shield = new Shield(
            this.game, 
            this.x - this.width / 2, 
            this.y - this.height / 2,
            this.width * 2,
            this.height * 2 
        );
    }

    die() {
        this.image = this.animationImage;
        this.frameX = 9;
        this.frameY = 6;
        this.maxDAnimationFrame = this.frameX + 4;
    }

    restart() {
        this.width = 8 * this.game.scale;
        this.height = 8 * this.game.scale;
        this.x = this.game.width / 2 - this.width / 2;
        this.y =  this.game.height - this.height - 20;
        this.image = document.getElementById('ships');
        this.speed = 10;
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.attackInterval = 20;
        this.attackTimer = this.attackInterval;
        this.canFire = true;
        this.frameX = 1;
        this.frameY = 0;
        this.upgrades = {
            rocket: false,
            rocketDamage: false,
            reducedRocketCooldown: false,
            improvedJets: false,
            dualShot: false,
            strongLasers: false,
            shield: false,
            rapidFire: false,
            rapidFire_2: false,
            increasedLives: false,
            increasedLives_2: false
        };
        this.rocketCooldown = 100;
        this.rocketCooldownTimer = this.rocketCooldown;
        this.rocketOnCooldown = false;
        this.shield = null;
        this.animationStartFrame = 5;
        this.jetsFrameX = this.animationStartFrame;
        this.jetsFrameY = 1;
        this.maxAnimationFrame = this.jetsFrameX + 4;
        this.animationDelay = 4;
        this.animationTimer = this.animationDelay;
        this.doneDying = false;
    }
}