// ...JS para editar/criar publicações no perfil...
document.addEventListener('DOMContentLoaded', function () {
    // Editar publicação
    document.querySelectorAll('.editar-publicacao-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pubId = this.getAttribute('data-pub-id');
            fetch(`/editar_publicacao/${pubId}`, {
                headers: { "X-Requested-With": "XMLHttpRequest" }
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('titulo-input').value = data.titulo || '';
                document.getElementById('descricao-input').value = data.descricao || '';
                document.querySelectorAll('#form-publicar input[type="checkbox"][name="tags"]').forEach(cb => {
                    cb.checked = false;
                });
                if (data.tags_pub) {
                    data.tags_pub.forEach(function(tagId) {
                        let cb = document.querySelector('#form-publicar input[type="checkbox"][name="tags"][value="' + tagId + '"]');
                        if (cb) cb.checked = true;
                    });
                }
                document.getElementById('criar-imagem').required = false;
                document.getElementById('form-publicar').action = `/editar_publicacao/${pubId}`;
                document.getElementById('publicar-btn').value = "EDITAR";
                // Garante que o popup será aberto
                const criarDiv = document.getElementById('criar');
                criarDiv.classList.add('block');
                criarDiv.style.display = '';
            });
        });
    });
    // Botão criar: sempre abre o popup e reseta o formulário
    document.getElementById('menu-criar').addEventListener('click', function(e) {
        // Garante que o popup será aberto
        const criarDiv = document.getElementById('criar');
        criarDiv.classList.add('block');
        criarDiv.style.display = '';
        // Reseta o formulário para modo de criação
        document.getElementById('form-publicar').reset();
        document.getElementById('form-publicar').action = "/publicar";
        document.getElementById('publicar-btn').value = "PUBLICAR";
        document.getElementById('criar-imagem').required = true;
    });
    // Corrige o botão de fechar do popup de criar
    document.getElementById('fechar-criar').addEventListener('click', function() {
        const criarDiv = document.getElementById('criar');
        criarDiv.classList.remove('block');
        criarDiv.style.display = 'none';
        document.getElementById('form-publicar').reset();
        document.getElementById('form-publicar').action = "/publicar";
        document.getElementById('publicar-btn').value = "PUBLICAR";
        document.getElementById('criar-imagem').required = true;
    });
});
