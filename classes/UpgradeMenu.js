import Button from './Button.js';
import splitLines from '../helper/splitLines.js';

export default class UpgradeMenu {
    constructor(game) {
        this.game = game;
        this.width = 400;
        this.height = 500;
        this.x = (game.width - this.width) / 2;
        this.y = (game.height - this.height) / 2;
        this.gap = 10;
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

            const buttonWidth = 50;
            const buttonHeight = 50;
            const buyRocketButton = new Button(
                this.game, 
                this.x + this.width - buttonWidth - this.gap, 
                this.y + this.gap * 7, 
                'BUY',
                buttonWidth, 
                buttonHeight
            );
            buyRocketButton.draw(context);
        }
        
        context.restore();
    }
}