import Enemy, { ArmouredEnemy, Shooter, ArmouredShooter, Boss_1, Boss_2 } from './Enemy.js';

export default class Wave {
    constructor(game) {
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = -this.height;
        this.speed = 2;
        this.speedX = Math.random() < 0.5 ? -this.speed : this.speed;
        this.speedY = 0;
        this.enemies = [];
        this.nextWaveTrigger = false;
        this.create();
    }

    render(context) {
        if (this.y < 0) this.y += 5;

        if (
            this.checkLeftMostEnemy() < 0 || 
            this.checkRightMostEnemy() > this.game.width
        ) {
            this.speedX *= -1;
            if (this.game.bossWaves.some(wave => wave === this.game.waveCount)) 
                this.speedY = this.game.enemySize * 2;
            else this.speedY = this.game.enemySize;
        }

        this.x += this.speedX;
        this.y += this.speedY
        this.speedY = 0;

        this.enemies.forEach(enemy => {
            enemy.update(this.x, this.y);
            enemy.draw(context);
        });
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        
    }

    create() {
        if (this.game.bossWaves.some(wave => wave === this.game.waveCount)) {
            if (this.game.waveCount === 10) {
                this.enemies.push(new Boss_2(this.game, 0, 0));
                return;
            }
            this.enemies.push(new Boss_1(this.game, 0, 0));
            return;
        }
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.columns; x++) {
                const enemyX = x * this.game.enemySize;
                const enemyY = y * this.game.enemySize;

                const enemyType = (
                    Math.random() < this.calculateEnemyChance(ArmouredShooter) ? ArmouredShooter : 
                    Math.random() < this.calculateEnemyChance(Shooter) ? Shooter : 
                    Math.random() < this.calculateEnemyChance(ArmouredEnemy) ? ArmouredEnemy : Enemy
                );
                this.enemies.push(new enemyType(this.game, enemyX, enemyY));
            }
        }
    }

    checkLeftMostEnemy() {
        let x = this.game.width;
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].x === this.x) {
                x = this.x;
                break;
            } else if (this.enemies[i].x < x) {
                x = this.enemies[i].x;
            }
        }
        return x;
    }

    checkRightMostEnemy() {
        let x = 0;
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].x === this.x + this.width - this.enemies[i].width) {
                x = this.enemies[i].x + this.enemies[i].width;
                break;
            } else if (this.enemies[i].x > x) {
                x = this.enemies[i].x + this.enemies[i].width;
            }
        }
        return x;
    }

    calculateEnemyChance(type) {
        let chance = 0;
            switch (this.game.waveCount) {
                case 1:
                    chance = 0;
                    break;
                case 2: 
                    chance = (
                        type === ArmouredEnemy ? 0.2 :
                        type === Shooter ? 0 :
                        type === ArmouredShooter ? 0 :
                        0
                    );
                    break;
                case 3: 
                    chance = (
                        type === ArmouredEnemy ? 0.3 :
                        type === Shooter ? 0.1 :
                        type === ArmouredShooter ? 0 :
                        0
                    );
                    break;
                case 4:
                    chance = (
                        type === ArmouredEnemy ? 0.4 :
                        type === Shooter ? 0.2 :
                        type === ArmouredShooter ? 0.1 :
                        0
                    );
                    break;
                case 6:
                    chance = (
                        type === ArmouredEnemy ? 0.5 :
                        type === Shooter ? 0.3 :
                        type === ArmouredShooter ? 0.2 :
                        0
                    );
                    break;
                case 7:
                    chance = (
                        type === ArmouredEnemy ? 0.5 :
                        type === Shooter ? 0.4 :
                        type === ArmouredShooter ? 0.3 :
                        0
                    );
                    break;
                case 8:
                    chance = (
                        type === ArmouredEnemy ? 0.5 :
                        type === Shooter ? 0.5 :
                        type === ArmouredShooter ? 0.4 :
                        0
                    );
                    break;
                case 9:
                    chance = (
                        type === ArmouredEnemy ? 0.5 :
                        type === Shooter ? 0.5 :
                        type === ArmouredShooter ? 0.5 :
                        0
                    );
                    break;
                default:
                    chance = (
                        type === ArmouredEnemy ? 0.5 :
                        type === Shooter ? 0.5 :
                        type === ArmouredShooter ? 0.5 :
                        0
                    );
            }

            return chance;
    }
}