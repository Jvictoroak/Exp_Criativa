const vermais = document.getElementsByClassName('vermais');
const popup = document.getElementById('popup-publicacao');
const popup_fechar = document.getElementById('fechar-popup');

Array.from(vermais).forEach(element => {
    element.addEventListener('click', () => {
        popup.classList.toggle('block');
    });
});

popup_fechar.addEventListener('click', () => {
    popup.classList.toggle('block');
});