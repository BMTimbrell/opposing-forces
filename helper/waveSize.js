export default function waveSize(enemies) {
    return (
        enemies.length > 25 ? 'giant' :
        enemies.length > 15 ? 'large' :
        enemies.length > 10 ? 'medium' :
        enemies.length > 5 ? 'small' :
        enemies.length > 1 ? 'tiny' :
        'teenyTiny'
    );
}