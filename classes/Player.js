import { Rocket } from './Projectile.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 8 * this.game.scale;
        this.height = 8 * this.game.scale;
        this.x = this.game.width / 2 - this.width / 2;
        this.y =  this.game.height - this.height - 20;
        this.speed = 10;
        this.lives = 3;
        this.attackInterval = 15;
        this.attackTimer = this.attackInterval;
        this.canFire = true;
        this.frameX = 1;
        this.image = document.getElementById('ships');
        this.jetsImage = document.getElementById('animations');
        this.animationStartFrame = 5;
        this.xOffset = 0;
        this.jetsFrameX = this.animationStartFrame;
        this.animationDelay = 4;
        this.animationTimer = this.animationDelay;
        this.maxAnimationFrame = this.jetsFrameX + 4;
    }

    draw(context) {
        // draw ship
        context.drawImage(
            this.image, 
            this.frameX * this.width / this.game.scale, 
            0, 
            this.width / this.game.scale, 
            this.height / this.game.scale,
            this.x,
            this.y,
            this.width,
            this.height
        );
        
        //draw jets
        context.drawImage(
            this.jetsImage, 
            this.jetsFrameX * this.width / this.game.scale, 
            8, 
            this.width / this.game.scale, 
            this.height / this.game.scale,
            this.x - this.xOffset,
            this.y + this.height - 10,
            this.width,
            this.height
        );
    }

    update() {
        // horizontal movement
        if (this.game.keys.indexOf('a') > -1) {
            this.x -= this.speed;
            this.frameX = 0;
            this.xOffset = 8;
        } else if (this.game.keys.indexOf('d') > -1) {
            this.x += this.speed;
            this.frameX = 2;
            this.xOffset = -8;
        } else {
            this.frameX = 1;
            this.xOffset = 0;
        }

        // shooting
        if (this.game.keys.indexOf(' ') > -1 && this.canFire) this.shoot();
        if (this.game.keys.indexOf('e') > -1 && this.canFire) {
            const rocket = new Rocket(
                this.game, 
                this.jetsImage, 
                this.jetsFrameX, 
                this.jetsFrameX2,
                this.animationDelay,
                this.animationTimer,
                this.animationStartFrame,
                this.maxAnimationFrame
            );
            this.game.projectilesPool.push(rocket);
            rocket.start(this.x + this.width / 2 - this.xOffset, this.y);
            this.attackTimer = 0;
        }

        // horizontal boundaries
        if (this.x < -this.width / 2) this.x = -this.width / 2;
        else if (this.x > this.game.width - this.width / 2) 
            this.x = this.game.width - this.width / 2;
        
        // attack interval for shooting
        if (this.attackTimer > this.attackInterval) {
            this.canFire = true;
        } else {
            this.canFire = false;
            this.attackTimer++;
        }

        // jets animation
        this.animationTimer--;
        if (this.animationTimer === 0) {
            this.animationTimer = this.animationDelay;
            this.jetsFrameX++;
            if (this.jetsFrameX === this.maxAnimationFrame) {
                this.jetsFrameX = this.animationStartFrame;
            }
        }
    }

    shoot() {
        const projectile = this.game.getProjectile();
        if (projectile) projectile.start(this.x + this.width / 2 - this.xOffset, this.y);
        this.attackTimer = 0;
    }

    restart() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.lives = 3;
    }
}