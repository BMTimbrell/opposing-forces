export default class Projectile {
    constructor(game) {
        this.game = game;
        this.width = 1 * this.game.scale;
        this.height = 3 * this.game.scale;
        this.x = 0;
        this.y = 0;
        this.type = 'projectile';
        this.frameX = 19;
        this.frameY = 3;
        this.speed = 20;
        this.free = true;
        this.image = document.getElementById('projectiles');
        this.damage = 1;
    }

    draw(context) {
        if (!this.free) {
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
        if (this instanceof EnemyProjectile) {
            this.game.enemyProjectilesOnScreen--;
        }
        this.free = true;
    }
}

export class Rocket extends Projectile {
    constructor(game) {
        super(game);
        this.damage = 2;
        this.width = 4 * this.game.scale;
        this.height = 5 * this.game.scale;
        this.frameX = 42;
        this.frameY = 17;
        this.type = 'rocket';
        this.jetsImage = document.getElementById('animations');
        this.animationStartFrame = 5;
        this.jetsFrameX = this.animationStartFrame;
        this.animationDelay = 4;
        this.animationTimer = this.animationDelay;
        this.maxAnimationFrame =  this.jetsFrameX + 4;
        this.explosionImage = document.getElementById('explosion');
        this.explosionTimer = this.animationDelay;
        this.isBoomTime = false;
        this.explosionStartFrame = 0;
        this.explosionFrameX = this.explosionStartFrame;
        this.explosionFrameY = 0;
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
                this.explosionFrameY, 
                16, 
                16,
                this.x,
                this.y,
                this.width,
                this.height
            );
            
        }
    }

    update() {
        if (this.game.player.upgrades.rocketDamage) this.damage = 4;
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
            if (this.explosionTimer <= 0) {
                this.explosionTimer = this.animationDelay;
                this.explosionFrameX++;
                if (this.explosionFrameX >= this.maxAnimationFrame) {
                    this.reset();
                }
            }
            
            if (this.canDamage) {
                this.game.waves[0].enemies.forEach(enemy => {
                    if (this.game.checkCollision(this, enemy)) {
                        enemy.hit(this.damage);
                    }
                });
                this.canDamage = false;
            }
        }
    }

    explode() {
        this.isBoomTime = true;
        this.speed = 0;
        this.width = 160;
        this.height = 160;
        this.canDamage = true;
        this.x -= this.width / 2 + 20;
        this.y -= this.height / 2;
    }

    reset() {
        this.canDamage = false;
        this.isBoomTime = false;
        this.explosionFrameX = this.explosionStartFrame;
        this.explosionTimer = this.animationDelay;
        this.speed = 20;
        this.jetsFrameX = this.animationStartFrame;
        this.width = 4 * this.game.scale;
        this.height = 5 * this.game.scale;
        super.reset();
    }
}

export class StrongLaser extends Projectile {
    constructor(game) {
        super(game);
        this.damage = 3;
        this.frameX = 10;
        this.frameY = 9;
        this.width = 3 * this.game.scale;
        this.height = 6 * this.game.scale;
        this.type = 'strongLaser'
    }
}

export class EnemyProjectile extends Projectile {
    constructor(game) {
        super(game);
        this.speed = 6;
        this.damage = 1;
        this.frameX = 35;
        this.frameY = 3;
        this.width = 3 * this.game.scale;
        this.height = 2 * this.game.scale;
        this.type = 'enemyProjectile';
    }

    update() {
        if (!this.free) {
            this.y += this.speed;
            if (this.y > this.game.height) this.reset();
        }
    }

    draw(context) {
        context.save();
        context.scale(1, -1);
        if (!this.free) {
            context.drawImage(
                this.image, 
                this.frameX, 
                this.frameY, 
                this.width / this.game.scale, 
                this.height / this.game.scale,
                this.x,
                -this.y - this.height,
                this.width,
                this.height
            );
        }
        context.restore();
    }
}

export class DoubleShooterProjectile extends EnemyProjectile {
    constructor(game) {
        super(game);
        this.damage = 1;
        this.speed = 8;
        this.type = 'doubleShooterProjectile';
        this.frameX = 4;
        this.frameY = 4;
        this.width = 1 * this.game.scale;
        this.height = 1 * this.game.scale;
    }
}

export class BossProjectile_1 extends EnemyProjectile {
    constructor(game) {
        super(game);
        this.damage = 2;
        this.type = 'bossProjectile_1';
        this.frameX = 25;
        this.frameY = 9;
        this.width = 6 * this.game.scale;
        this.height = 6 * this.game.scale;
    }
}

export class BossProjectile_2 extends EnemyProjectile {
    constructor(game) {
        super(game);
        this.damage = 2;
        this.type = 'bossProjectile_2';
        this.frameX = 2;
        this.frameY = 9;
        this.width = 3 * this.game.scale;
        this.height = 6 * this.game.scale;
        this.speed = 7;
    }
}

export class BossProjectile_3 extends EnemyProjectile {
    constructor(game) {
        super(game);
        this.damage = 2;
        this.type = 'bossProjectile_3';
        this.frameX = 10;
        this.frameY = 17;
        this.width = 3 * this.game.scale;
        this.height = 6 * this.game.scale;
        this.speed = 7;
    }
}

export class BossBomb extends EnemyProjectile {
    constructor(game) {
        super(game);
        this.damage = 3;
        this.type = 'bossBomb';
        this.frameX = 33;
        this.frameY = 25;
        this.width = 6 * this.game.scale;
        this.height = 6 * this.game.scale;
        this.speed = 4;
        this.explosionTimer = 60;
        this.isBoomTime = false;
        this.canDamage = false;
        this.explosionImage = document.getElementById('explosion');
        this.explosionStartFrame = 0;
        this.explosionFrameX = this.explosionStartFrame;
        this.explosionFrameY = 0;
        this.animationDelay = 4;
        this.animationTimer = this.animationDelay;
        this.maxAnimationFrame = this.explosionStartFrame + 4;
        this.maxHealth = 10;
        this.health = this.maxHealth;
        this.hBarHeight = 10;
    }

    draw(context) {
        if (!this.free && !this.isBoomTime) {
            context.save();
            context.strokeRect(this.x, this.y - this.hBarHeight - 5, this.width, this.hBarHeight);
            context.filleStyle = 'gray';
            context.fillRect(this.x, this.y - this.hBarHeight - 5, this.width, this.hBarHeight);
            context.fillStyle = (
                this.health / this.maxHealth < 0.25 ? 'red' : 
                this.health / this.maxHealth < 0.5 ? 'gold' : 
                'green'
            );
            context.fillRect(
                this.x, this.y - this.hBarHeight - 5, 
                this.width * (this.health / this.maxHealth), 
                this.hBarHeight
            );
            context.restore();

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
        } else if (!this.free && this.isBoomTime) {
            context.drawImage(
                this.explosionImage, 
                this.explosionFrameX * 16, 
                this.explosionFrameY, 
                16, 
                16,
                this.x,
                this.y,
                this.width,
                this.height
            );
            
        }
    }

    update(x, y) {
        super.update(x, y);

        if (!this.isBoomTime && this.y + this.height >= this.game.height) {
            this.speed = 0;
            this.explosionTimer--;
            if (this.explosionTimer === 0) {
                this.explode();
            }
        }

        // exploding
        if (this.isBoomTime) {
            this.animationTimer--;
            if (this.animationTimer <= 0) {
                this.animationTimer = this.animationDelay;
                this.explosionFrameX++;
                if (this.explosionFrameX >= this.maxAnimationFrame) {
                    this.reset();
                }
            }
        }

        // collision with player projectiles
        this.game.projectilesPool.forEach(projectile => {
            if (
                !this.free &&
                !projectile.free &&
                !(projectile instanceof EnemyProjectile) &&
                !this.isBoomTime && 
                this.game.checkCollision(this, projectile)
            ) {
                if (projectile instanceof Rocket) {
                    if (!projectile.isBoomTime) projectile.explode();
                    else if (projectile.canDamage) {
                        this.health -= projectile.damage;
                        projectile.canDamage = false;
                    }
                    return;
                }
                this.health -= projectile.damage;
                projectile.reset();
                if (this.health <= 0) this.explode();
            }
        });
    }

    explode() {
        this.isBoomTime = true;
        this.speed = 0;
        this.x -= (160 - this.width) / 2;
        this.y -= (160 - this.height) / 2;
        this.width = 160;
        this.height = 160;
        this.canDamage = true;
    }

    reset() {
        this.canDamage = false;
        this.isBoomTime = false;
        this.explosionFrameX = this.explosionStartFrame;
        this.explosionTimer = 60;
        this.animationTimer = this.animationDelay;
        this.speed = 4;
        this.width = 6 * this.game.scale;
        this.height = 6 * this.game.scale;
        this.health = this.maxHealth;
        super.reset();
    }
}