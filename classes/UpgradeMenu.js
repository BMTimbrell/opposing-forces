import Button from './Button.js';
import splitLines from '../helper/splitLines.js';

export default class UpgradeMenu {
    constructor(game) {
        this.game = game;
        this.width = 400;
        this.height = 660;
        this.x = (game.width - this.width) / 2;
        this.y = (game.height - this.height) / 2 + 55;
        this.gap = 15;
        this.isShowing = false;
        this.restart();
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
                `Rockets: shoot rockets\nthat explode on impact\nCost: ${this.buttons[1].upgradeCost}g`, 
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
        } else if (!this.game.player.upgrades.reducedRocketCooldown) {
            splitLines(
                context, 
                `Rocket Cooldown: reduce\ncooldown of rockets\nCost: ${this.buttons[11].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 5 + textHeight, 
                20
            );
        }

        // rapid fire upgrade
        if (!this.game.player.upgrades.rapidFire) {
            splitLines(
                context, 
                `Rapid Fire: increase\nrate of fire\nCost: ${this.buttons[3].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 10 + textHeight, 
                20
            );
        } else if (!this.game.player.upgrades.rapidFire_2) {
            splitLines(
                context, 
                `Rapid Fire II: further\nincrease rate of fire\nCost: ${this.buttons[10].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 10 + textHeight, 
                20
            );
        }

        // improved jets upgrade
        if (!this.game.player.upgrades.improvedJets) {
            splitLines(
                context, 
                `Improved Jets: upgrade\njets for faster flight\nCost: ${this.buttons[4].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 15 + textHeight, 
                20
            );
        }

        // dual shot
        if (!this.game.player.upgrades.dualShot) {
            splitLines(
                context, 
                `Dual Shot: fire two\nlasers at once\nCost: ${this.buttons[5].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 20 + textHeight, 
                20
            );
        }

        // strongLasers
        if (!this.game.player.upgrades.strongLasers) {
            splitLines(
                context, 
                `Strong Lasers: increase\nlaser damage\nCost: ${this.buttons[6].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 25 + textHeight, 
                20
            );
        }

        // increased lives 1
        if (!this.game.player.upgrades.increasedLives) {
            splitLines(
                context, 
                `Extra Lives: gain 1 max\nhealth\nCost: ${this.buttons[7].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 30 + textHeight, 
                20
            );
        // increased lives 2
        } else if (!this.game.player.upgrades.increasedLives_2) {
            splitLines(
                context, 
                `Extra Lives II: gain 2\nmax health\nCost: ${this.buttons[8].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 30 + textHeight, 
                20
            );
        }

        // shield
        if (!this.game.player.upgrades.shield) {
            splitLines(
                context, 
                `Shield: start each round\nwith a damage absorbing\nshield\nCost: ${this.buttons[9].upgradeCost}g`, 
                this.x + this.gap, 
                this.y + this.gap * 35 + textHeight, 
                20
            );
        }

        // draw buttons
        this.buttons.forEach(button => {
            if (button.name === 'nextWaveButton') {
                button.button.draw(context);
            } else if (!this.game.player.upgrades[button.name]) {
                if (button.isEnabled) {
                    if (this.game.gold >= button.upgradeCost) {
                        button.button.draw(context);
                    } else {
                        button.button.draw(context, true);
                    }
                }
            }
        });
        
        context.restore();
    }

    handleButtonClick() {
        // if menu is showing let player click buttons
        if (this.isShowing) {
            let buttonName = '';
            this.buttons.forEach(button => {
                // next wave button
                if (button.name === 'nextWaveButton') {
                    if (this.game.checkCollision(this.game.mouse, button.button)) {
                        // check player upgrades
                        if (this.game.player.upgrades.shield) {
                            this.game.player.resetShield();
                        }
                        if (this.game.player.upgrades.improvedJets) {
                            this.game.player.animationStartFrame = 9;
                            this.game.player.jetsFrameX = this.game.player.animationStartFrame;
                            this.game.player.maxAnimationFrame = this.game.player.animationStartFrame + 4;
                            this.game.player.speed = 15;
                            this.game.player.animationDelay = 2;
                        }

                        // change sprite when have dual shot upgrade
                        if (this.game.player.upgrades.dualShot) this.game.player.frameY = 2;
                        
                        // hide menu and start next wave
                        this.isShowing = false;
                        this.game.waveCount++;
                        this.game.newWave();
                        this.game.nextWave.nextWaveTrigger = true;
                    }
                // purchase upgrade buttons
                } else if (this.game.checkCollision(this.game.mouse, button.button)) {
                    if (
                        button.isEnabled &&
                        button.upgradeCost <= this.game.gold
                    ) {
                        buttonName = button.name;
                        button.isEnabled = false;
                        this.game.gold -= button.upgradeCost;
                        this.game.player.upgrades[button.name] = true;
                    }
                }
            });

            // check if other buttons need to be enabled
            switch (buttonName) {
                case 'rocket':
                    this.buttons[2].isEnabled = true;
                    break;
                case 'rocketDamage':
                    this.buttons[11].isEnabled = true;
                    break;
                case 'rapidFire':
                    this.buttons[10].isEnabled = true;
                    break;
                case 'increasedLives':
                    this.buttons[8].isEnabled = true;
                    break;
                default:
                    return;
            }
        }
    }

    restart() {
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
                upgradeCost: 100,
                isEnabled: true
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
                upgradeCost: 300,
                isEnabled: false
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 10, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'rapidFire',
                upgradeCost: 150,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 15, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'improvedJets',
                upgradeCost: 100,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 20, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'dualShot',
                upgradeCost: 600,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 25, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'strongLasers',
                upgradeCost: 1200,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 30, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'increasedLives',
                upgradeCost: 50,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 30, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'increasedLives_2',
                upgradeCost: 150,
                isEnabled: false
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 35, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'shield',
                upgradeCost: 500,
                isEnabled: true
            },
            {
                button: new Button(
                    this.game, 
                    this.x + this.width - 50 - this.gap, 
                    this.y + this.gap * 10, 
                    'BUY',
                    50, 
                    50
                ),
                name: 'rapidFire_2',
                upgradeCost: 600,
                isEnabled: false
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
                name: 'reducedRocketCooldown',
                upgradeCost: 400,
                isEnabled: false
            }
        ]
    }
}