export default class Projectile {
    constructor(game) {
        this.game = game;
        this.width = 1 * this.game.scale;
        this.height = 3 * this.game.scale;
        this.x = 0;
        this.y = 0;
        this.speed = 20;
        this.free = true;
        this.image = document.getElementById('projectiles');
        this.damage = 1;
    }

    draw(context) {
        if (!this.free) {
            context.drawImage(
                this.image, 
                19, 
                3, 
                this.width / this.game.scale, 
                this.height / this.game.scale,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
    }

    update() {
        if (!this.free) {
            this.y -= this.speed;
            if (this.y < -this.height) this.reset();
        }
    }

    start(x, y) {
        this.x = x - this.width / 2;
        this.y = y;
        this.free = false; 
    }

    reset() {
        this.free = true;
    }
}

export class Rocket extends Projectile {
    constructor(
        game, 
        jetsImage, 
        jetsFrameX, 
        animationDelay,
        animationTimer,
        animationStartFrame,
        maxAnimationFrame

    ) {
        super(game);
        this.damage = 1;
        this.width = 4 * this.game.scale;
        this.height = 5 * this.game.scale;
        this.jetsImage = jetsImage;
        this.jetsFrameX = jetsFrameX;
        this.animationDelay = animationDelay;
        this.animationTimer = animationTimer;
        this.animationStartFrame = animationStartFrame;
        this.maxAnimationFrame = maxAnimationFrame;
        this.explosionImage = document.getElementById('explosion');
        this.explosionTimer = this.animationDelay;
        this.isBoomTime = false;
        this.explosionStartFrame = 0;
        this.explosionFrameX = this.explosionStartFrame;
        this.canDamage = false;
    }

    draw(context) {
        if (!this.free && !this.isBoomTime) {
            context.drawImage(
                this.image, 
                42, 
                17, 
                this.width / this.game.scale, 
                this.height / this.game.scale,
                this.x,
                this.y,
                this.width,
                this.height
            );

            // rocket fire
            context.drawImage(
                this.jetsImage, 
                this.jetsFrameX * 8, 
                16, 
                8, 
                8,
                this.x - this.width / 2 - 5,
                this.y + this.height - 10,
                80,
                80
            );
        } else if (!this.free && this.isBoomTime) {
            context.drawImage(
                this.explosionImage, 
                this.explosionFrameX * 16, 
                0, 
                16, 
                16,
                this.x - this.width / 2 + 20,
                this.y - this.height / 2,
                this.width,
                this.height
            );
            
        }
    }

    update() {
        super.update();
        // animation
        this.animationTimer--;
        if (this.animationTimer === 0) {
            this.animationTimer = this.animationDelay;
            this.jetsFrameX++;
            if (this.jetsFrameX === this.maxAnimationFrame) {
                this.jetsFrameX = this.animationStartFrame;
            }
        }

        // exploding
        if (this.isBoomTime) {
            this.explosionTimer--;
            if (this.explosionTimer === 0) {
                this.explosionTimer = this.animationDelay;
                this.explosionFrameX++;
                if (this.explosionFrameX === this.maxAnimationFrame) {
                    this.reset();
                }
            }
            if (this.explosionTimer < this.animationDelay - 3) this.canDamage = false;
        }
    }

    explode() {
        this.isBoomTime = true;
        this.speed = 0;
        this.width = 160;
        this.height = 160;
        this.canDamage = true;
    }
}