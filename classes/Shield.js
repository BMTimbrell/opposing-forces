import { EnemyProjectile } from "./Projectile.js";

export default class Shield {
    constructor(game, x, y, width, height) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.shieldImage = document.getElementById('animations');
        this.frameX = 11 * (this.width / 2) / this.game.scale;
        this.fadingFrameX = 9 * (this.width / 2) / this.game.scale;
        this.frameY = 4 * (this.width / 2) / this.game.scale;
        this.fading = false;
        this.gracePeriod = 20;
    }

    draw(context) {
        context.drawImage(
            this.shieldImage, 
            this.fading ? this.fadingFrameX : this.frameX, 
            this.frameY, 
            this.width / this.game.scale, 
            this.height / this.game.scale,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update() {
        if (this.fading) {
            this.gracePeriod--;
            if (this.gracePeriod <= 0) this.game.player.shield = null;
        }

        // collision with enemy projectiles
        this.game.projectilesPool.forEach(projectile => {
            if (
                !projectile.free && 
                projectile instanceof EnemyProjectile && 
                this.game.checkCollision(projectile, this)
            ) {
                this.fading = true;
                projectile.reset();
            }
        });
    }
}