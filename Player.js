export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.speed = 5;
        this.lives = 3;
    }

    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // horizontal movement
        if (this.game.keys.indexOf('a') > -1) this.x -= this.speed;
        if (this.game.keys.indexOf('d') > -1) this.x += this.speed;

        //horizontal boundaries
        if (this.x < -this.width / 2) this.x = -this.width / 2;
        else if (this.x > this.game.width - this.width / 2) this.x = this.game.width - this.width / 2;
    }

    shoot() {
        const projectile = this.game.getProjectile();
        if (projectile) projectile.start(this.x + this.width / 2, this.y);
    }

    restart() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.lives = 3;
    }
}