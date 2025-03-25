document.addEventListener('DOMContentLoaded', () => {
    const editarBtn = document.getElementById('editar-btn');
    const salvarBtn = document.getElementById('salvar-btn');

    const emailValor = document.getElementById('email-valor');
    const emailInput = document.getElementById('email-input');
    const senhaValor = document.getElementById('senha-valor');
    const senhaInput = document.getElementById('senha-input');
    const dataNascimentoValor = document.getElementById('data-nascimento-valor');
    const dataNascimentoInput = document.getElementById('data-nascimento-input');
    
    let senhaReal = senhaInput.value; // Armazena a senha real

    // Criar botão de alternância para exibir a senha
    const toggleSenhaBtn = document.createElement('button');
    toggleSenhaBtn.textContent = '👁';
    toggleSenhaBtn.style.marginLeft = '5px';
    toggleSenhaBtn.style.border = 'none';
    toggleSenhaBtn.style.background = 'transparent';
    toggleSenhaBtn.style.cursor = 'pointer';
    senhaInput.parentNode.appendChild(toggleSenhaBtn);

    toggleSenhaBtn.addEventListener('click', () => {
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleSenhaBtn.textContent = '🙈';
        } else {
            senhaInput.type = 'password';
            toggleSenhaBtn.textContent = '👁';
        }
    });

    // Função para validar e-mail
    const validarEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    editarBtn.addEventListener('click', () => {
        emailValor.style.display = 'none';
        emailInput.style.display = 'block';
        senhaValor.style.display = 'none';
        senhaInput.style.display = 'block';
        dataNascimentoValor.style.display = 'none';
        dataNascimentoInput.style.display = 'block';

        senhaInput.value = senhaReal; // Restaurar a senha real

        salvarBtn.disabled = false;
        editarBtn.disabled = true;
    });

    salvarBtn.addEventListener('click', () => {
        if (!emailInput.value || !senhaInput.value || !dataNascimentoInput.value) {
            errorAlert("Preencha todos os campos antes de salvar!");
            return;
        }

        if (!validarEmail(emailInput.value)) {
            errorAlert("Digite um e-mail válido!");
            return;
        }

        emailValor.textContent = emailInput.value;
        senhaReal = senhaInput.value;
        senhaValor.textContent = '****';
        dataNascimentoValor.textContent = dataNascimentoInput.value;

        emailValor.style.display = 'block';
        emailInput.style.display = 'none';
        senhaValor.style.display = 'block';
        senhaInput.style.display = 'none';
        dataNascimentoValor.style.display = 'block';
        dataNascimentoInput.style.display = 'none';

        salvarBtn.disabled = true;
        editarBtn.disabled = false;

        successAlert();
    });
});
