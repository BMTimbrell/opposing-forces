import Button from './Button.js';
import splitLines from '../helper/splitLines.js';

export default class UpgradeMenu {
    constructor(game) {
        this.game = game;
        this.width = 400;
        this.height = 600;
        this.x = (game.width - this.width) / 2;
        this.y = (game.height - this.height) / 2 + 50;
        this.gap = 10;
        this.isShowing = false;
        this.buttons = {
            nextWaveButton : new Button(
                this.game, 
                this.x + this.width - 150 - this.gap, 
                this.y + this.height - 50 - this.gap, 
                'NEXT WAVE',
                150, 
                50
            ),
            rocket : new Button(
                this.game, 
                this.x + this.width - 50 - this.gap, 
                this.y + this.gap * 7, 
                'BUY',
                50, 
                50
            )
        }

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
        if (!this.game.player.upgrades.rocket) {
            context.font = '12px Pixel';
            metrics = context.measureText('Purchase Upgrades');
            const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            splitLines(
                context, 
                'Rockets: shoot rockets \nthat explode on impact\nCost: 30g', 
                this.x + this.gap, 
                this.y + this.gap * 7 + textHeight, 
                20
            );
        }

        // draw buttons
        for (const button in this.buttons) {
            if (button === 'nextWaveButton') {
                this.buttons[button].draw(context);
            } else if (!this.game.player.upgrades[button]) {
                this.buttons[button].draw(context);
            }
        }
        
        context.restore();
    }

    handleButtonClick() {
        // if menu is showing let player click buttons
        if (this.isShowing) {
            for (const button in this.buttons) {
                // next wave button
                if (button === 'nextWaveButton') {
                    if (this.game.checkCollision(this.game.mouse, this.buttons[button])) {
                        this.isShowing = false;
                        this.game.newWave();
                        this.game.waveCount++;
                        this.game.nextWave.nextWaveTrigger = true;
                    }
                } else if (this.game.checkCollision(this.game.mouse, this.buttons[button])) {
                    let upgradeCost = 0;
                    switch (button) {
                        case 'rocket':
                            upgradeCost = 30;
                            break;
                        default:
                            upgradeCost = 0;    
                    }

                    if (
                        upgradeCost &&  
                        upgradeCost <= this.game.gold &&
                        !this.game.player.upgrades[button]
                    ) {
                        this.game.gold -= upgradeCost;
                        this.game.player.upgrades[button] = true;
                    }
                }
            }
        }
    }
}