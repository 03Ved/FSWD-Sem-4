function changeBackgroundColor() {
    function randomNum() {
        return Math.floor(Math.random()*256);
    }
    const randomColor = `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
    document.body.style.backgroundColor = randomColor;
}
setInterval(changeBackgroundColor, 5000);