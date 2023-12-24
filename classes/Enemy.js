import { EnemyProjectile, Rocket } from './Projectile.js';

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
        this.frameX = 6;
        this.frameY = 1;
        this.animationDelay = 3;
        this.animationTimer = this.animationDelay;
        this.animationFrameX = 9; 
        this.animationFrameY = 7;
        this.maxAnimationFrame = this.animationFrameX + 3;
        this.maxLives = 1;
        this.lives = this.maxLives;
    }
    
    draw(context) {
        /*context.strokeRect(this.x, this.y, this.width, this.height);*/
        context.drawImage(
            this.image, 
            this.frameX * this.width / this.game.scale, 
            this.frameY * this.height / this.game.scale, 
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
                if (
                    !projectile.free && 
                    !(projectile instanceof EnemyProjectile) && 
                    this.game.checkCollision(projectile, this)
                ) {
                    if (projectile instanceof Rocket) {
                        if (projectile.canDamage) this.hit(projectile.damage);
                        if (!projectile.isBoomTime) projectile.explode();
                    } else {
                        this.hit(projectile.damage);
                        projectile.reset();
                    }
                }
            });
        }
        
        // enemy dies
        if (this.lives < 1) {
            this.image = document.getElementById('animations');
            this.frameX = this.animationFrameX
            this.frameY = this.animationFrameY;
            this.animationTimer--;
            if (this.animationTimer === 0) {
                this.animationFrameX++;
                this.animationTimer = this.animationDelay;
            }
            if (this.animationFrameX > this.maxAnimationFrame) { 
                this.markedForDeletion = true;
            }

            if (!this.game.gameOver && this.markedForDeletion) {
                this.game.score += this.maxLives;
                this.game.gold += this.maxLives * 10;
            }
        }

        // check collision with player
        if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
            this.lives = 0;
            this.game.player.lives--;
        }

        // lose condition
        if (this.y + this.height > this.game.height || this.game.player.lives < 1) {
            this.game.gameOver = true;
        }
    }

    hit(damage) {
        this.lives -= damage;
    }
}

export class ArmouredEnemy extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 2;
        this.frameX = 7;
        this.frameY = 2;
    }
}

export class Shooter extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 2;
        this.frameX = 8;
        this.frameY = 2;
        this.shootChance = 0.01;
    }

    update(x, y) {
        super.update(x, y);
        if (Math.random() < this.shootChance && this.game.enemyProjectilesOnScreen < 5) {
            const projectile = this.game.getProjectile('enemyProjectile');
            if (projectile) {
                projectile.start(this.x + this.width / 2, this.y + this.height);
                this.game.enemyProjectilesOnScreen++;
            }
        }
    }
}

export class ArmouredShooter extends Shooter {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 3;
        this.frameX = 4;
        this.frameY = 4;
    }
}