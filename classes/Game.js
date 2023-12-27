import Player from './Player.js';
import Projectile, 
    { 
        EnemyProjectile, 
        StrongLaser, 
        Rocket, 
        BossProjectile_1, 
        BossProjectile_2,
        BossProjectile_3,
        BossBomb, 
        DoubleShooterProjectile 
    } from './Projectile.js';
import Wave from './Wave.js';
import UpgradeMenu from './UpgradeMenu.js';
import isBossWave from '../helper/isBossWave.js';

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
        this.numberOfProjectiles = 30;
        this.createProjectiles();

        this.bossWaves = [8, 12, 16];
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
            this.mouse.x = (e.x - this.canvasPosition.left) 
                * this.canvas.width / this.canvas.clientWidth;
            this.mouse.y = (e.y - this.canvasPosition.top) 
                * this.canvas.height / this.canvas.clientHeight;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = undefined;
            this.mouse.y = undefined;
        });

        window.addEventListener('resize', () => {
            this.canvasPosition = this.canvas.getBoundingClientRect();
        });
    }

    update() {
        // only update player if menu not showing and player alive 
        // or not finished death animation
        if (!this.upgradeMenu.isShowing && !this.player.doneDying) 
            this.player.update();

        // remove projectile when menu is showing
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
                this.player.rocketCooldownTimer = this.player.rocketCooldown;
                this.player.rocketOnCooldown = false;
                this.upgradeMenu.isShowing = true;
                this.nextWave = wave;
                if (this.player.lives < this.player.maxLives) this.player.lives++;
            }
        });
    }

    render(context) {
        this.waves.forEach(wave => wave.render(context));

        this.projectilesPool.forEach(projectile => projectile.draw(context));

        if (!this.upgradeMenu.isShowing && !this.player.doneDying) 
            this.player.draw(context);
        
        this.drawStatusText(context);

        if (this.upgradeMenu.isShowing) this.upgradeMenu.draw(context);
    }

    createProjectiles() {
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            this.projectilesPool.push(new Projectile(this));
            this.projectilesPool.push(new StrongLaser(this));
            this.projectilesPool.push(new DoubleShooterProjectile(this));
        }

        for (let i = 0; i < 15; i++) {
            this.projectilesPool.push(new EnemyProjectile(this));
            this.projectilesPool.push(new BossProjectile_1(this));
            this.projectilesPool.push(new BossProjectile_2(this));
            this.projectilesPool.push(new BossProjectile_3(this));
        }

        for (let i = 0; i < 3; i++) {
            this.projectilesPool.push(new BossBomb(this));
        }

        this.projectilesPool.push(new Rocket(this));
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
        // game score, wave number, gold
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.font = '20px Pixel';
        context.fillText(`SCORE: ${this.score}`, 20, 40);
        context.fillText(`WAVE: ${this.waveCount}`, 20, 80);
        context.fillText(`GOLD: ${this.gold}`, 20, 120);

        // player lives
        for (let i = 0; i < this.player.maxLives; i++) {
            context.strokeRect(20 + 20 * i, 140, 10, 15);
        }

        for (let i = 0; i < this.player.lives; i++) {
            context.fillRect(20 + 20 * i, 140, 10, 15);
        }

        // rocket cooldown
        if (this.player.upgrades.rocket) {
            context.strokeRect(20, 180, 200, 15);
            context.save();
            if (this.player.rocketOnCooldown) context.fillStyle = 'red';
            for (let i = 0; i < this.player.rocketCooldownTimer; i++) {
                context.fillRect(20 + 2 * i, 180, 2, 15);
            }
            context.restore();
            
            if (!this.player.rocketOnCooldown) {
                context.save();
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.fillStyle = 'black';
                context.font = '14px Pixel';
                context.fillText('Press E', 70, 195);
                context.restore();
            }
        }

        // game over
        if (this.gameOver) {
            context.textAlign = 'center';
            context.font = '50px Pixel';
            context.fillText('GAME OVER', this.width * 0.5, this.height * 0.5);

            context.font = '20px Pixel';
            context.fillText('Press R to Restart!', this.width * 0.5, this.height * 0.5 + 50);
        }
        context.restore();
    }

    // create new wave
    newWave() {
        if (
            Math.random() < 0.5 && 
            this.columns * this.enemySize < this.width * 0.8 &&
            !isBossWave(this.waveCount, this.bossWaves)
        ) {
            this.columns++;
        } else if (
            this.rows * this.enemySize < this.height * 0.5 &&
            !isBossWave(this.waveCount, this.bossWaves)
        ) {
            this.rows++;
        }

        if (this.waveCount === 16) this.rows++;
        else if (this.waveCount === 21) this.rows++;

        const wave = new Wave(this);
        this.waves.push(wave);
        this.waves = this.waves.filter(w => w === wave);
    }

    restart() {
        this.player.restart();
        this.upgradeMenu.restart();

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

        this.projectilesPool.forEach(projectile => {
            if (!projectile.free) projectile.reset();
        });
        this.enemyProjectilesOnScreen = 0;
    }
}