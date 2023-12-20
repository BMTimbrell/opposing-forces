export default class Enemy {
    constructor(game, positionX, positionY) {
        this.game = game;
        this.width = this.game.enemySize;
        this.height = this.game.enemySize;
        this.x = 0;
        this.y = 0;
        this.positionX = positionX;
        this.positionY = positionY;
        this.markedForDeletion = false;
        this.image = document.getElementById('ships');
        this.frameX = 64;
        this.frameY = 17;
        this.animationDelay = 3;
        this.animationTimer = this.animationDelay;
        this.animationFrameX = 72;
        this.animationFrameY = 48;
        this.maxAnimationFrame = this.animationFrameX + 8 * 4;
        this.lives = 1;
    }
    
    draw(context) {
        /*context.strokeRect(this.x, this.y, this.width, this.height);*/
        context.drawImage(
            this.image, 
            this.frameX, 
            this.frameY, 
            this.width / this.game.scale, 
            this.height / this.game.scale,
            this.x,
            this.y,
            this.width,
            this.height
        );
    }

    update(x, y) {
        this.x = x + this.positionX;
        this.y = y + this.positionY;

        // check collision with projectiles
        if (this.lives > 0) {
            this.game.projectilesPool.forEach(projectile => {
                if (!projectile.free && this.game.checkCollision(projectile, this)) {
                    this.hit(1);
                    projectile.reset();
                }
            });
        }
        
        if (this.lives < 1) {
            this.image = document.getElementById('animations');
            this.frameX = this.animationFrameX
            this.frameY = this.animationFrameY;
            this.animationTimer--;
            if (this.animationTimer === 0) {
                this.animationFrameX += 8;
                this.animationTimer = this.animationDelay;
            }
            if (this.frameX > this.maxAnimationFrame) { 
                this.markedForDeletion = true;
            }

            if (!this.game.gameOver && this.markedForDeletion) this.game.score++;
        }

        // check collision with player
        if (this.game.checkCollision(this, this.game.player)) {
            this.markedForDeletion = true;
            if (!this.game.gameOver && this.game.score > 0) this.game.score--;
            this.game.player.lives--;
            if (this.game.player.lives < 1) this.game.gameOver = true;
        }

        // lose condition
        if (this.y + this.height > this.game.height) {
            this.game.gameOver = true;
            this.markedForDeletion = true;
        }
    }

    hit(damage) {
        this.lives -= damage;
    }
}

export class strongEnemy extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 3;
    }
}