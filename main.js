const dotsContainer = document.getElementById('dotsContainer');
let topPosition = 50; // Percentage
let leftPosition = 50; // Percentage
const moveStep = 1; // Movement step in percentage

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            topPosition -= moveStep;
            break;
        case 'ArrowDown':
            topPosition += moveStep;
            break;
        case 'ArrowLeft':
            leftPosition -= moveStep;
            break;
        case 'ArrowRight':
            leftPosition += moveStep;
            break;
        default:
            return; // Exit if not an arrow key
    }

    updateDotsPosition();
});

function updateDotsPosition() {
    // We use top/left percentage for positioning
    // transform translate(-50%, -50%) keeps it centered relative to its point
    dotsContainer.style.top = `${topPosition}%`;
    dotsContainer.style.left = `${leftPosition}%`;
}
