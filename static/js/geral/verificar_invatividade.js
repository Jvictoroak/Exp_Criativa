// Defina o tempo limite de inatividade em milissegundos (por exemplo, 5 minutos)
let inactivityTime = 0.5 * 60 * 1000; // 5 minutos em milissegundos
let timer;

function resetTimer() {
    // Limpa o timer existente
    clearTimeout(timer);

    // Reinicia o timer
    timer = setTimeout(logoutUser, inactivityTime);
}

function logoutUser() {
    Swal.fire({
            icon: 'error',
            title: 'Usuário Inativo.',
            text: 'Deslogando da sessão. Retornando ao Login',
        });;
    window.location.href = '/login'; // Redireciona para a página de logout
}

// Adiciona eventos para reiniciar o timer a cada interação do usuário
window.onload = () => {
    // Define o timer ao carregar a página
    resetTimer();

    // Reseta o timer em interações do usuário
    window.onmousemove = resetTimer;   // Movimento do mouse
    window.onkeydown = resetTimer;     // Pressionamento de teclas
    window.onclick = resetTimer;       // Clique do mouse
    window.onscroll = resetTimer;      // Rolagem da página
};
