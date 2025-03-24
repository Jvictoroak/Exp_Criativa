document.addEventListener('DOMContentLoaded', () => {
    const editarBtn = document.getElementById('editar-btn');
    const salvarBtn = document.getElementById('salvar-btn');

    const emailValor = document.getElementById('email-valor');
    const emailInput = document.getElementById('email-input');
    const senhaValor = document.getElementById('senha-valor');
    const senhaInput = document.getElementById('senha-input');
    const dataNascimentoValor = document.getElementById('data-nascimento-valor');
    const dataNascimentoInput = document.getElementById('data-nascimento-input');

    // Função para alternar para o modo de edição
    editarBtn.addEventListener('click', () => {
        // Esconder os spans e mostrar os inputs
        emailValor.style.display = 'none';
        emailInput.style.display = 'inline-block';
        senhaValor.style.display = 'none';
        senhaInput.style.display = 'inline-block';
        dataNascimentoValor.style.display = 'none';
        dataNascimentoInput.style.display = 'inline-block';

        // Ativar o botão "Salvar informações" e desativar o "Editar informações"
        salvarBtn.disabled = false;
        editarBtn.disabled = true;
    });

    // Função para salvar as alterações
    salvarBtn.addEventListener('click', () => {
        // Transferir os valores dos inputs para os spans
        emailValor.textContent = emailInput.value;
        senhaValor.textContent = senhaInput.value;
        dataNascimentoValor.textContent = dataNascimentoInput.value;

        // Esconder os inputs e mostrar os spans
        emailValor.style.display = 'inline-block';
        emailInput.style.display = 'none';
        senhaValor.style.display = 'inline-block';
        senhaInput.style.display = 'none';
        dataNascimentoValor.style.display = 'inline-block';
        dataNascimentoInput.style.display = 'none';

        // Desativar o botão "Salvar informações" e reativar o "Editar informações"
        salvarBtn.disabled = true;
        editarBtn.disabled = false;
    });
});