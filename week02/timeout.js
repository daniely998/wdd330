const display = document.getElementById('countdown');
let time = 10;

document.getElementById('startButton').addEventListener('click', () => {
    setInterval(() => {
        if (time >= 0) {
            display.textContent = time;
            time--;
        } else {
            setTimeout(() => {
                display.textContent = 'Time\'s up';
            });
        }
    }, 1000);
});