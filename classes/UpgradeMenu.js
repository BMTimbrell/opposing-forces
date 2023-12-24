import Button from './Button.js';
import splitLines from '../helper/splitLines.js';

export default class UpgradeMenu {
    constructor(game) {
        this.game = game;
        this.width = 400;
        this.height = 600;
        this.x = (game.width - this.width) / 2;
        this.y = (game.height - this.height) / 2 + 50;
        this.gap = 15;
        this.isShowing = false;
        this.buttons = [
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 150 - this.gap, 
                    this.y + this.height - 50 - this.gap, 
                    'NEXT WAVE',
                    150, 
                    50
                ),
                name: 'nextWaveButton'
                    
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 5, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'rocket',
                upgradeCost: 30
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 5, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'rocketDamage',
                upgradeCost: 50
            }
        ]

        this.game.canvas.addEventListener('click', this.handleButtonClick.bind(this));
    }

    
    draw(context) {
        context.save();
        context.fillStyle = '#8c8c8c';
        context.fillRect(this.x, this.y, this.width, this.height);
        // title
        context.fillStyle = 'white';
        context.font = '20px Pixel';
        let metrics = context.measureText('Purchase Upgrades');
        const titleWidth = metrics.width;
        const titleHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        context.fillText('Purchase Upgrades', this.x + (this.width - titleWidth) / 2, this.y + titleHeight + this.gap);

        // rocket upgrade
        context.font = '12px Pixel';
        metrics = context.measureText('Purchase Upgrades');
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        if (!this.game.player.upgrades.rocket) {
            splitLines(
                context, 
                `Rockets: shoot rockets \nthat explode on impact\nCost: ${this.buttons[1].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 5 + textHeight, 
                20
            );
        // rocket damage upgrade
        } else if (!this.game.player.upgrades.rocketDamage) {
            splitLines(
                context, 
                `Rocket Damage: increase\ndamage of rockets\nCost: ${this.buttons[2].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 5 + textHeight, 
                20
            );
        }

        // draw buttons
        this.buttons.forEach(button => {
            if (button.name === 'nextWaveButton') {
                button.button.draw(context);
            } else if (!this.game.player.upgrades[button.name]) {
                if (button.name === 'rocketDamage' && !this.game.player.upgrades.rocket) return;
                button.button.draw(context);
            }
        });
        
        context.restore();
    }

    handleButtonClick() {
        // if menu is showing let player click buttons
        if (this.isShowing) {
            this.buttons.forEach(button => {
                // next wave button
                if (button.name === 'nextWaveButton') {
                    if (this.game.checkCollision(this.game.mouse, button.button)) {
                        this.isShowing = false;
                        this.game.newWave();
                        this.game.waveCount++;
                        this.game.nextWave.nextWaveTrigger = true;
                    }
                // purchase upgrade buttons
                } else if (this.game.checkCollision(this.game.mouse, button.button)) {
                    if (
                        button.upgradeCost &&  
                        button.upgradeCost <= this.game.gold &&
                        !this.game.player.upgrades[button.name]
                    ) {
                        this.game.gold -= button.upgradeCost;
                        this.game.player.upgrades[button.name] = true;
                    }
                }
            });
        }
    }
}