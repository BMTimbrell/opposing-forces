export default class Button {
    constructor(
        game, 
        x, 
        y, 
        text,
        width = 50, 
        height = 50,
        fontSize = '12px', 
        style = {
            background: '#8c8c8c',
            textColor: 'white',
            borderColor: 'black'
        }, 
        hoverStyle = {
            background: '#cacaca',
            textColor: 'black',
            borderColor: 'black'
        }
    ) {
        this.game = game;
        this.mouse = this.game.mouse;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height
        this.text = text;
        this.fontSize = fontSize;
        this.style = style;
        this.hoverStyle = hoverStyle;
    }

    draw(context) {
        context.save();
        context.font = `${this.fontSize} Pixel`;
        const metrics = context.measureText(this.text);
        const textWidth = metrics.width;
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

        // change style on mouse hover
        if (this.game.checkCollision(this, this.mouse)) {
            // background
            context.fillStyle = this.hoverStyle.background;
            context.fillRect(this.x, this.y, this.width, this.height);
            // border
            context.strokeStyle = this.hoverStyle.borderColor;
            context.strokeRect(this.x, this.y, this.width, this.height);
            // text
            context.fillStyle = this.hoverStyle.textColor;
            context.fillText(this.text, this.x + (this.width - textWidth) / 2, this.y + (this.height + textHeight) / 2);
        } else {
            // background
            context.fillStyle = this.style.background;
            context.fillRect(this.x, this.y, this.width, this.height);
            // border
            context.strokeStyle = this.style.borderColor;
            context.strokeRect(this.x, this.y, this.width, this.height);
            // text
            context.fillStyle = this.style.textColor;
            context.fillText(this.text, this.x + (this.width - textWidth) / 2, this.y + (this.height + textHeight) / 2);
        }
        context.restore();
    }
}