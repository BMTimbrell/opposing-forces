export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.speed = 10;
        this.lives = 3;
        this.attackInterval = 15;
        this.attackTimer = this.attackInterval;
        this.canFire = true;
    }

    draw(context) {
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        // horizontal movement
        if (this.game.keys.indexOf('a') > -1) this.x -= this.speed;
        if (this.game.keys.indexOf('d') > -1) this.x += this.speed;

        // shooting
        if (this.game.keys.indexOf(' ') > -1 && this.canFire) this.shoot();

        // horizontal boundaries
        if (this.x < -this.width / 2) this.x = -this.width / 2;
        else if (this.x > this.game.width - this.width / 2) this.x = this.game.width - this.width / 2;
        
        // attack interval for shooting
        if (this.attackTimer > this.attackInterval) {
            this.canFire = true;
        } else {
            this.canFire = false;
            this.attackTimer++;
        }
    }

    shoot() {
        const projectile = this.game.getProjectile();
        if (projectile) projectile.start(this.x + this.width / 2, this.y);
        this.attackTimer = 0;
    }

    restart() {
        this.x = this.game.width / 2 - this.width / 2;
        this.y = this.game.height - this.height;
        this.lives = 3;
    }
}