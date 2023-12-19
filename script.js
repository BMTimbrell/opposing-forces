import Game from './Game.js'

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;
    ctx.lineWidth = 5;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'white';
    ctx.font = '30px Impact';
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    const game = new Game(canvas);
    
    const fps = 1000 / 60;
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;

        if (deltaTime > fps) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            game.render(ctx);
            game.update();
            lastTime = timeStamp;
        }
        
        window.requestAnimationFrame(animate);
    }

    animate(0);
});