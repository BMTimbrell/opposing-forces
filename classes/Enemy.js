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
        this.goldDropped = 10;
    }
    
    draw(context) {
        context.drawImage(
            this.image, 
            this.frameX * this.game.enemySize / this.game.scale, 
            this.frameY * this.game.enemySize / this.game.scale, 
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
                        if (!projectile.canDamage && !projectile.isBoomTime) {
                            projectile.explode();
                        }
                    } else {
                        this.hit(projectile.damage);
                        projectile.reset();
                    }
                }
            });
        }
        
        // enemy dies
        if (this.lives < 1) {
            if (this instanceof Boss) {
                this.game.waves[0].speedX = 0;
            }

            // death animation
            this.image = document.getElementById(
                !(this instanceof Boss) ? 'animations' : 'explosion'
            );
            this.frameX = this.animationFrameX
            this.frameY = this.animationFrameY;
            this.animationTimer--;
            if (this.animationTimer === 0) {
                this.animationFrameX += !(this instanceof Boss) ? 1 : 2;
                this.animationTimer = this.animationDelay;
            }
            if (this.animationFrameX > this.maxAnimationFrame) { 
                this.markedForDeletion = true;
            }

            // reward player gold and score
            if (!this.game.gameOver && this.markedForDeletion) {
                this.game.score += this.maxLives;
                this.game.gold += this.goldDropped;
            }
        }

        // check collision with player
        if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
            if (!(this instanceof Boss)) {
                this.lives = 0;
                this.game.player.lives--;
            } else {
                if (!this.game.player.shield) this.game.player.lives = 0;
            }
        }

        if (
            this.game.player.upgrades.shield && 
            this.game.player.shield &&
            this.game.checkCollision(this, this.game.player.shield) && 
            this.lives > 0
        ) {
            this.game.player.shield.fading = true;
            if (!(this instanceof Boss)) this.lives = 0;
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
        this.goldDropped = 15;
    }
}

export class Shooter extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 2;
        this.frameX = 8;
        this.frameY = 2;
        this.goldDropped = 20;
        this.shootChance = 0.01;
        this.lastShot = 0;
    }

    update(x, y) {
        super.update(x, y);
        this.lastShot++;
        if (
            Math.random() < this.shootChance && 
            this.game.enemyProjectilesOnScreen < 5 &&
            this.lastShot > 20
        ) {
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
        this.goldDropped = 25;
    }
}

export class Boss extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.width = this.game.enemySize * 2;
        this.height = this.game.enemySize * 2;
        this.animationFrameX = 0;
        this.animationFrameY = 0;
        this.lastShot = 0;
    }

    update(x, y) {
        super.update(x, y);
        this.lastShot++;
    }
}

export class Boss_1 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 20;
        this.frameX = 4;
        this.frameY = 6;
        this.shootChance = 0.015;
        this.yOffset = 60;
        this.goldDropped = 100;
    }

    update(x, y) {
        super.update(x, y);
        if (
            Math.random() < this.shootChance && 
            this.game.enemyProjectilesOnScreen < 4 && 
            this.lastShot > 20
        ) {
            this.lastShot = 0;
            const projectiles = this.game.getProjectile('bossProjectile_1', 2);
            const projectile_1 = projectiles[0];
            const projectile_2 = projectiles[1];
            if (projectile_1 && projectile_2) {
                projectile_1.start(this.x + projectile_1.width / 2, this.y + this.height - this.yOffset);
                projectile_2.start(this.x + this.width - projectile_2.width / 2, this.y + this.height - this.yOffset);
                this.game.enemyProjectilesOnScreen += 2;
            }
        }
    }
}

export class Boss_2 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.lives = 40;
        this.frameX = 6;
        this.frameY = 6;
        this.shootChance = 0.02;
        this.xOffset = 10;
        this.yOffset = 20;
        this.goldDropped = 200;
    }

    update(x, y) {
        super.update(x, y);
        if (
            Math.random() < this.shootChance && 
            this.game.enemyProjectilesOnScreen < 4 && 
            this.lastShot > 20
        ) {
            this.lastShot = 0;
            const projectiles = this.game.getProjectile('bossProjectile_2', 2);
            const projectile_1 = projectiles[0];
            const projectile_2 = projectiles[1];
            if (projectile_1 && projectile_2) {
                projectile_1.start(
                    this.x + projectile_1.width / 2 + this.xOffset, 
                    this.y + this.height - this.yOffset
                );
                projectile_2.start(
                    this.x + this.width - projectile_2.width / 2 - this.xOffset, 
                    this.y + this.height - this.yOffset
                );
                this.game.enemyProjectilesOnScreen += 2;
            }
        }
    }
}