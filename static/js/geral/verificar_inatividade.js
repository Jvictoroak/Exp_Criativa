document.addEventListener('DOMContentLoaded', () => {
    // Defina o tempo limite de inatividade em milissegundos
    let inactivityTime = 0.2 * 60 * 1000; // 12 segundos, por exemplo
    let timer;

    function resetTimer() {
        console.log('Atividade detectada, resetando o timer...');
        clearTimeout(timer);
        timer = setTimeout(logoutUser, inactivityTime);
    }

    function logoutUser() {
        console.log('Usuário inativo por 2 minutos, encerrando sessão...');
        fetch('/logout', { credentials: 'include' })
            .then(() => {
                window.location.href = '/login';
            })
            .catch(() => {
                window.location.href = '/login';
            });
    }

    // Define o timer ao carregar a página
    resetTimer();

    // Adiciona eventos para reiniciar o timer a cada interação do usuário
    window.onmousemove = resetTimer;   // Movimento do mouse
    window.onkeydown = resetTimer;     // Pressionamento de teclas
    window.onclick = resetTimer;       // Clique do mouse
    window.onscroll = resetTimer;      // Rolagem da página
});
