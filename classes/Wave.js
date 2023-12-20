import Enemy from './Enemy.js';

export default class Wave {
    constructor(game) {
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width * 0.5 - this.width * 0.5;
        this.y = -this.height;
        this.speed = 3;
        this.speedX = Math.random() < 0.5 ? -this.speed : this.speed;
        this.speedY = 0;
        this.enemies = [];
        this.nextWaveTrigger = false;
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
                let enemyX = x * this.game.enemySize;
                let enemyY = y * this.game.enemySize;
                this.enemies.push(new Enemy(this.game, enemyX, enemyY));
            }
        }
    }
}