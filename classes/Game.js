import Player from './Player.js';
import Projectile from './Projectile.js';
import Wave from './Wave.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = 10;
        this.keys = [];
        this.player = new Player(this);

        this.projectilesPool = [];
        this.numberOfProjectiles = 10;
        this.createProjectiles();

        this.restart();

        window.addEventListener('keydown', e => {
            if (this.keys.indexOf(e.key) === -1) this.keys.push(e.key);
            if (e.key === 'r' && this.gameOver) this.restart();
        });

        window.addEventListener('keyup', e => {
            const index = this.keys.indexOf(e.key);
            if (index > -1) this.keys.splice(index, 1);
        });
    }

    update() {
        this.player.update();
        this.projectilesPool.forEach(projectile => projectile.update());
        this.waves.forEach(wave => {
            if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
                this.newWave();
                this.waveCount++;
                wave.nextWaveTrigger = true;
            }
        });
    }

    render(context) {
        this.projectilesPool.forEach(projectile => projectile.draw(context));
        this.player.draw(context);
        this.waves.forEach(wave => wave.render(context));
        this.drawStatusText(context);
    }

    createProjectiles() {
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new Projectile(this));
        }
    }

    getProjectile() {
        for (let i = 0; i < this.projectilesPool.length; i++) {
            if (this.projectilesPool[i].free) return this.projectilesPool[i];
        }
    }

    // collision detection
    checkCollision(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    drawStatusText(context) {
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.fillText(`Score: ${this.score}`, 20, 40);
        context.fillText(`Wave: ${this.waveCount}`, 20, 80);

        for (let i = 0; i < this.player.lives; i++) {
            context.fillRect(10 * i + 20, 100, 5, 20);
        }

        if (this.gameOver) {
            context.textAlign = 'center';
            context.font = '100px Impact';
            context.fillText('Game Over!', this.width * 0.5, this.height * 0.5);

            context.font = '20px Impact';
            context.fillText('Press R to restart!', this.width * 0.5, this.height * 0.5 + 50);
        }
        context.restore();
    }

    newWave() {
        if (
            Math.random() < 0.5 && 
            this.columns * this.enemySize < this.width * 0.8
        ) {
            this.columns++
        } else if (this.rows * this.enemySize < this.height * 0.6) {
            this.rows++;
        }
        
        this.waves.push(new Wave(this));
    }

    restart() {
        this.player.restart();

        this.columns = 2;
        this.rows = 2;
        this.enemySize = 80;

        this.waves = [];
        this.waves.push(new Wave(this));
        this.waveCount = 1;

        this.score = 0;
        this.gameOver = false;
    }
}