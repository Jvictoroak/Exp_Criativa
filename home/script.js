// Add basic interactivity (e.g., alert on button click)
document.querySelectorAll('.post-actions button').forEach(button => {
    button.addEventListener('click', () => {
        alert(`You clicked ${button.textContent}!`);
    });
});