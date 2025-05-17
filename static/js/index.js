const vermais = document.getElementsByClassName('vermais');
const popup = document.getElementById('popup-publicacao');
const popup_fechar = document.getElementById('fechar-popup');
Array.from(vermais).forEach(element => {
    element.addEventListener('click', () => {
        popup.classList.toggle('block');
    });
});

// popup_fechar.addEventListener('click', () => {
//     popup.classList.toggle('block');
// });


document.addEventListener('DOMContentLoaded', function() {
    // Seleciona todas as tags pelo atributo 'tag' e classe 'tag-item'
    const tagElements = document.querySelectorAll('.tag-item');
    const posts = document.querySelectorAll('.post');

    tagElements.forEach(tagEl => {
        tagEl.addEventListener('click', (e) => {
            // Remove 'ativo' de todas as tags
            tagElements.forEach(t => t.classList.remove('ativo'));
            // Adiciona 'ativo' apenas na tag clicada
            tagEl.classList.add('ativo');

            const tagId = tagEl.getAttribute('tag');
            posts.forEach(post => {
                const postTags = JSON.parse(post.getAttribute('data-tags'));
                if (postTags.includes(Number(tagId))) {
                    post.classList.add('ativo');
                } else {
                    post.classList.remove('ativo');
                }
            });
        });
    });
});