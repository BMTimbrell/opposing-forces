export default function isBossWave(waveCount, bossWavesArray) {
    return bossWavesArray.some(wave => wave === waveCount);
};