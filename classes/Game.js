import Player from './Player.js';
import Projectile, { EnemyProjectile, StrongLaser } from './Projectile.js';
import Wave from './Wave.js';
import UpgradeMenu from './UpgradeMenu.js';

export default class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvasPosition = this.canvas.getBoundingClientRect();
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.scale = 10;
        this.keys = [];
        this.player = new Player(this);
        this.mouse = {
            x: undefined,
            y: undefined,
            width: 0.1,
            height: 0.1
        };
        this.upgradeMenu = new UpgradeMenu(this);

        this.projectilesPool = [];
        this.enemyProjectilesOnScreen = 0;
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

        // update mouse position
        this.canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.x - this.canvasPosition.left;
            this.mouse.y = e.y - this.canvasPosition.top;
        });

        this.canvas.addEventListener('mouseleave', e => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });
    }

    update() {
        // only update player and projectiles if menu not showing
        if (!this.upgradeMenu.isShowing) this.player.update();
        if (this.upgradeMenu.isShowing) {
            this.projectilesPool.forEach(projectile => {
                if (!projectile.free) projectile.reset();
            });
        }

        // projectiles and waves
        this.projectilesPool.forEach(projectile => projectile.update());
        this.waves.forEach(wave => {
            if (
                wave.enemies.length < 1 && 
                !wave.nextWaveTrigger && 
                !this.gameOver && 
                !this.upgradeMenu.isShowing
            ) {
                this.upgradeMenu.isShowing = true;
                this.nextWave = wave;
            }
        });
    }

    render(context) {
        this.waves.forEach(wave => wave.render(context));
        if (!this.upgradeMenu.isShowing) this.player.draw(context);

        this.projectilesPool.forEach(projectile => projectile.draw(context));
        this.drawStatusText(context);

        if (this.upgradeMenu.isShowing) this.upgradeMenu.draw(context);
    }

    createProjectiles() {
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new Projectile(this));
        }

        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new StrongLaser(this));
        }

        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new EnemyProjectile(this));
        }
    }

    getProjectile(type = 'projectile', amount = 1) {
        // find right amount of projectiles to give to player
        const projectiles = [];
        for (let i = 0; i < this.projectilesPool.length; i++) {
            if (
                this.projectilesPool[i].free && 
                this.projectilesPool[i].type === type
            ) {
                if (amount === 1) return this.projectilesPool[i];
                projectiles.push(this.projectilesPool[i]);
                if (projectiles.length === amount) return projectiles;
            }
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
        context.font = '20px Pixel';
        context.fillText(`SCORE: ${this.score}`, 20, 40);
        context.fillText(`WAVE: ${this.waveCount}`, 20, 80);
        context.fillText(`GOLD: ${this.gold}`, 20, 120);

        for (let i = 0; i < this.player.lives; i++) {
            context.fillRect(10 * i + 20, 140, 5, 20);
        }

        if (this.gameOver) {
            context.textAlign = 'center';
            context.font = '50px Pixel';
            context.fillText('GAME OVER', this.width * 0.5, this.height * 0.5);

            context.font = '20px Pixel';
            context.fillText('Press R to restart!', this.width * 0.5, this.height * 0.5 + 50);
        }
        context.restore();
    }

    newWave() {
        if (
            Math.random() < 0.5 && 
            this.columns * this.enemySize < this.width * 0.6
        ) {
            this.columns++;
        } else if (this.rows * this.enemySize < this.height * 0.7) {
            this.rows++;
        }
        
        this.waves.push(new Wave(this));
    }

    restart() {
        this.player.restart();

        this.columns = 2;
        this.rows = 1;
        this.enemySize = 80;

        this.waves = [];
        this.waveCount = 1;
        this.waves.push(new Wave(this));
        this.nextWave = null;

        this.score = 0;
        this.gold = 0;
        this.gameOver = false;
    }
}