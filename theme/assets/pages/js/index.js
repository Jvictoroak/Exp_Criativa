const vermais = document.getElementById('vermais');
const popup_publicacao = document.getElementById('popup-publicacao');
const popup_fechar = document.getElementById('fechar-popup');

vermais.addEventListener('click', () => {
    popup_publicacao.classList.toggle('block');
});

popup_fechar.addEventListener('click', () => {
    popup_publicacao.classList.toggle('block'); 
})