import waveSize from './waveSize.js';
import isBossWave from './isBossWave.js';

export default function getWaveSpeed(game, enemies) {
    return (
        isBossWave(game.waveCount, game.bossWaves) ? 2 :
        game.waveCount <= 8 ? 2 :
        waveSize(enemies) === 'giant' ? 0.5 :
        waveSize(enemies) === 'large' ? 1 :
        waveSize(enemies) === 'medium' ? 2 :
        waveSize(enemies) === 'small' ? 3 :
        waveSize(enemies) === 'tiny' ? 4 :
        6
    );
}