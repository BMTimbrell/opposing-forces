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
        if (
            this.game.checkCollision(this, this.game.player) && 
            this.lives > 0 &&
            this.game.player.lives > 0
        ) {
            if (!(this instanceof Boss)) {
                this.lives = 0;
                this.game.player.lives--;
                this.game.score--;
            } else {
                if (!this.game.player.shield) {
                    this.game.score--;
                    this.game.player.lives = 0;
                }
            }
            if (this.game.player.lives <= 0) this.game.player.die();
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
        this.maxLives = 2;
        this.lives = this.maxLives;
        this.frameX = 7;
        this.frameY = 2;
        this.goldDropped = 15;
    }
}

export class Shooter extends Enemy {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 2;
        this.lives = this.maxLives;
        this.frameX = 8;
        this.frameY = 2;
        this.goldDropped = 20;
        this.shootChance = 0.01;
        this.lastShot = 0;
        this.attackInterval = 160;
        this.animationFrameX = 5; 
        this.animationFrameY = 6;
        this.maxAnimationFrame = this.animationFrameX + 3;
        this.numOfShots = 1;
        this.maxProjectiles = 5;
    }

    update(x, y) {
        super.update(x, y);
        this.lastShot++;
        if (
            Math.random() < this.shootChance && 
            this.game.enemyProjectilesOnScreen < this.maxProjectiles &&
            this.lastShot > this.attackInterval &&
            this.lives > 0
        ) {
            if (this.numOfShots === 2) {
                const projectiles = this.game.getProjectile('doubleShooterProjectile', 2);
                const projectile_1 = projectiles[0];
                const projectile_2 = projectiles[1];
                if (projectile_1 && projectile_2) {
                    projectile_1.start(this.x + this.xOffset, this.y + this.height - this.yOffset);
                    projectile_2.start(this.x + this.xOffset_2, this.y + this.height - this.yOffset);
                    this.game.enemyProjectilesOnScreen += 2;
                }
            } else {
                const projectile = this.game.getProjectile('enemyProjectile');
                if (projectile) {
                    projectile.start(this.x + this.width / 2, this.y + this.height);
                    this.game.enemyProjectilesOnScreen++;
                }
            }
            this.lastShot = 0;
        }
    }
}

export class ArmouredShooter extends Shooter {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.frameX = 4;
        this.frameY = 4;
        this.goldDropped = 25;
    }
}

export class DoubleShooter extends Shooter {
    constructor(game, positionX, positionY, speed) {
        super(game, positionX, positionY);
        this.maxLives = 4;
        this.lives = this.maxLives;
        this.frameX = 4;
        this.frameY = 2;
        this.goldDropped = 30;
        this.numOfShots = 2;
        this.yOffset = 30;
        this.xOffset = 25;
        this.xOffset_2 = 65
        this.attackInterval = 60;
        this.maxProjectiles = 5;
        this.animationFrameX = 9; 
        this.animationFrameY = 6;
        this.maxAnimationFrame = this.animationFrameX + 3;
        this.speed = speed;
    }

    update(x, y) {
        super.update(x, y);
        if (this.speed) this.y += this.speed;
    }
}

export class ArmouredDoubleShooter extends DoubleShooter {
    constructor(game, positionX, positionY, speed) {
        super(game, positionX, positionY, speed);
        this.maxLives = 6;
        this.lives = this.maxLives;
        this.frameX = 7;
        this.frameY = 4;
        this.goldDropped = 35;
        this.yOffset = 0;
        this.xOffset = 10;
        this.xOffset_2 = 70
        this.speed = speed;
    }

    update(x, y) {
        super.update(x, y);
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
        this.attackInterval = 50;
        this.hBarHeight = 15;
        this.maxProjectiles = 4;
    }

    update(x, y) {
        super.update(x, y);
        if (
            Math.random() < this.shootChance && 
            this.game.enemyProjectilesOnScreen < this.maxProjectiles && 
            this.lastShot > this.attackInterval &&
            this.lives > 0
        ) {
            this.lastShot = 0;
            const projectiles = this.game.getProjectile(this.projectileType, 2);
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
        this.lastShot++;
        
        if (this.lives <= 0) this.game.waves[0].speedX = 0;
    }

    draw(context) {
        super.draw(context);
        if (this.lives > 0) {
            context.strokeRect(this.x, this.y - this.hBarHeight - 10, this.width, this.hBarHeight);
            context.save();
            context.fillStyle = 'gray';
            context.fillRect(this.x, this.y - this.hBarHeight - 10, this.width, this.hBarHeight);
            context.fillStyle = (
                this.lives / this.maxLives < 0.25 ? 'red' : 
                this.lives / this.maxLives < 0.5 ? 'gold' : 
                'green'
            );
            context.fillRect(this.x, this.y - this.hBarHeight - 10, this.width * (this.lives / this.maxLives), this.hBarHeight);
            context.restore();
        }
    }
}

export class Boss_1 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 30;
        this.lives = this.maxLives;
        this.frameX = 4;
        this.frameY = 6;
        this.shootChance = 0.015;
        this.yOffset = 60;
        this.xOffset = 0;
        this.goldDropped = 100;
        this.projectileType = 'bossProjectile_1';
    }

    update(x, y) {
        super.update(x, y);
    }

    draw(context) {
        super.draw(context);
    }
}

export class Boss_2 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 70;
        this.lives = this.maxLives;
        this.frameX = 6;
        this.frameY = 6;
        this.shootChance = 0.02;
        this.xOffset = 10;
        this.yOffset = 20;
        this.goldDropped = 200;
        this.attackInterval = 30;
        this.projectileType = 'bossProjectile_2';
    }

    update(x, y) {
        super.update(x, y);
    }
    
    draw(context) {
        super.draw(context);
    }
}

export class Boss_3 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 140;
        this.lives = this.maxLives;
        this.frameX = 8;
        this.frameY = 6;
        this.shootChance = 0.02;
        this.xOffset = 1;
        this.yOffset = 20;
        this.goldDropped = 300;
        this.attackInterval = 30;
        this.projectileType = 'bossProjectile_3';
        this.bombChance = 0.01;
        this.bombShot = 30;
        this.bombsFired = 0;
    }

    update(x, y) {
        super.update(x, y);
        if (
            Math.random() < this.bombChance && 
            this.bombShot > 30 &&
            this.bombsFired <= 5
        ) {
            const bomb = this.game.getProjectile('bossBomb');
            if (bomb) {
                bomb.start(this.x + this.width / 2, this.y + this.height - this.yOffset);
                this.game.enemyProjectilesOnScreen++;
                this.bombsFired++;
                this.bombShot = 0;
            }
        }
        this.bombShot++;
    }

    draw(context) {
        super.draw(context);
    }
}

export class Boss_4 extends Boss {
    constructor(game, positionX, positionY) {
        super(game, positionX, positionY);
        this.maxLives = 120;
        this.lives = this.maxLives;
        this.frameX = 4;
        this.frameY = 8;
        this.shootChance = 0.02;
        this.xOffset = 20;
        this.yOffset = 80;
        this.goldDropped = 400;
        this.attackInterval = 30;
        this.projectileType = 'doubleShooterProjectile';
        this.lastShot_2 = this.attackInterval;
        this.enemies = [
            new ArmouredDoubleShooter(this.game, 0, 0, 2),
            new DoubleShooter(this.game, this.game.enemySize, 0, 2),
            new ArmouredDoubleShooter(this.game, 3 * this.game.enemySize, 0, 2),
            new DoubleShooter(this.game, 5 * this.game.enemySize, 0, 2),
            new ArmouredDoubleShooter(this.game, 6 * this.game.enemySize, 0, 2)
        ];
        this.specialAttackTimer = 100;
        this.specialAttack = false;
        this.maxProjectiles = 100;
    }

    update(x, y) {
        super.update(x, y);
         if (
             Math.random() < this.shootChance && 
             this.lastShot_2 > this.attackInterval &&
             this.lives > 0 &&
             this.lives / this.maxLives < 0.5
         ) {
             this.lastShot_2 = 0;
             const projectiles = this.game.getProjectile(this.projectileType, 2);
             const projectile_1 = projectiles[0];
             const projectile_2 = projectiles[1];
             if (projectile_1 && projectile_2) {
                 projectile_1.start(
                     this.x + projectile_1.width / 2 + this.xOffset + 17, 
                     this.y + this.height - this.yOffset + 20
                 );
                 projectile_2.start(
                     this.x + this.width - projectile_2.width / 2 - this.xOffset - 17, 
                     this.y + this.height - this.yOffset + 20
                 );
                 this.game.enemyProjectilesOnScreen += 2;
             }
         }
         this.lastShot_2++;

        // spawn enemies when boss is only enemy left or boss' health is less than half of max health
        if (
            (this.game.waves[0].enemies.length === 1 && this.game.waves[0].enemies[0] === this) || 
            this.lives / this.maxLives < 0.5
        ) {
            this.enemies.forEach(enemy => {
                enemy.update(0, enemy.y + enemy.speed);
            });
            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        }

        // special attack condition
        if (this.lives / this.maxLives < 0.5) {
            if (this.specialAttackTimer > 0) 
                this.specialAttack = true;
             else if (this.specialAttackTimer <= 0 && this.specialAttack) {
                this.game.waves[0].speedX = Math.random() < 0.5 ? 1 : -1;
                this.shootChance = 0.02;
                this.specialAttack = false;
                this.attackInterval = 30;
            }
        }

        if (this.specialAttack) {
            this.shootChance = 1;
            this.specialAttackTimer--;
            this.game.waves[0].speedX = 0;
            this.attackInterval = 10;
        }
    }

    draw(context) {
        super.draw(context);
        if (
            (this.game.waves[0].enemies.length === 1 && this.game.waves[0].enemies[0] === this) || 
            this.lives / this.maxLives < 0.5
        ) {
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
        }
    }
}