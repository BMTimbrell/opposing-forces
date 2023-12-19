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