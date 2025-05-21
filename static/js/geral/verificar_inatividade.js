document.addEventListener('DOMContentLoaded', () => {
    // Defina o tempo limite de inatividade em milissegundos
    let inactivityTime = 20 * 60 * 1000; // 12 segundos, por exemplo
    let timer;

    function resetTimer() {
        console.log('Atividade detectada, resetando o timer...');
        clearTimeout(timer);
        timer = setTimeout(showInactivityAlert, inactivityTime);
    }

    function showInactivityAlert() {
        console.log('Usuário inativo, exibindo alerta...');

        // Exibe o alerta usando SweetAlert
        Swal.fire({
            title: 'Sessão expirada',
            text: 'Você ficou inativo por um tempo e será redirecionado para a página de login.',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false
        }).then(() => {
            logoutUser();
        });
    }

    function logoutUser() {
        console.log('Usuário inativo, encerrando sessão...');
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