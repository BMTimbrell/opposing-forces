import isBossWave from './isBossWave.js';

export default function getWaveSpeed(game, enemies) {
    return (
        game.waveCount === game.bossWaves[3] ? 1 :
        isBossWave(game.waveCount, game.bossWaves) ? 2 :
        game.waveCount <= 8 ? 2 :
        enemies.length > 25 ? 0.5 :
        enemies.length > 15 ? 1 :
        enemies.length > 10 ? 2 :
        enemies.length > 5 ? 3 :
        enemies.length > 1 ? 4 :
        8
    );
}