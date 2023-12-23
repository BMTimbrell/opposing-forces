const splitLines = (context, text, x, y, lineHeight) => {
    const lines = text.split('\n');

    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, y + (i * lineHeight));
    }
};

export default splitLines;