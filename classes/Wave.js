import Enemy, { ArmouredEnemy, Shooter, ArmouredShooter } from './Enemy.js';

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
        this.armouredEnemyChance = () => {
            let chance = 0;
            switch (this.game.waveCount) {
                case 1:
                    chance = 0;
                    break;
                case 2: 
                    chance = 0.2;
                    break;
                case 3: 
                    chance = 0.3;
                    break;
                case 4:
                    chance = 0.4;
                default:
                    chance = 0.5;
            }

            return chance;
        };

        this.shooterChance = () => {
            let chance = 0;
            switch (this.game.waveCount) {
                case 1:
                    chance = 0;
                    break;
                case 2: 
                    chance = 0;
                    break;
                case 3: 
                    chance = 0.1;
                    break;
                case 4:
                    chance = 0.2;
                default:
                    chance = 0.5;
            }

            return chance;
        };

        this.armouredShooterChance = () => {
            let chance = 0;
            switch (this.game.waveCount) {
                case 1:
                    chance = 0;
                    break;
                case 2: 
                    chance = 0;
                    break;
                case 3: 
                    chance = 0.1;
                    break;
                case 4:
                    chance = 0.2;
                default:
                    chance = 0.5;
            }

            return chance;
        }

        this.create();
    }

    render(context) {
        if (this.y < 0) this.y += 5;
        
        if (this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX *= -1;
            this.speedY = this.game.enemySize;
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
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.columns; x++) {
                const enemyX = x * this.game.enemySize;
                const enemyY = y * this.game.enemySize;

                const enemyType = (
                    Math.random() < this.armouredShooterChance() ? ArmouredShooter : 
                    Math.random() < this.shooterChance() ? Shooter : 
                    Math.random() < this.armouredEnemyChance() ? ArmouredEnemy : Enemy
                );
                this.enemies.push(new enemyType(this.game, enemyX, enemyY));
            }
        }
    }
}