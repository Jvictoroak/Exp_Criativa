// Faz uma requisição para /debug_session e imprime a sessão ativa no console
fetch('/debug_session', {
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        console.log('Sessão ativa:', data.session);
    })
    .catch(error => {
        console.error('Erro ao buscar sessão:', error);
    });
