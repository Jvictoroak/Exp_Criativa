// Seleção dos elementos do DOM
const usuarioInput = document.getElementById("usuario");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const visualizarSenha = document.getElementById("toggleSenha");
const botaoRegistra = document.getElementById("button-registro");

// Declaração dos Regex no início do script
const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/; 
// Valida o formato de telefone: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
// Valida o formato de email básico: texto antes e depois do @, seguido de um domínio válido

const usuarioRegex = /^[A-Za-záàâãéèêíóôõúç\s]{3,20}$/; 
// Valida o nome de usuário: 3 a 20 caracteres, apenas letras e espaços

const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/; 
// Valida a senha: 8 a 20 caracteres, pelo menos 1 número, 1 letra maiúscula, 1 letra minúscula, 1 caractere especial, sem espaços

// Formatação de telefone
telefoneInput.addEventListener('input', function () {
    let telefone = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (telefone.length <= 2) {
        this.value = `(${telefone}`;
    } else if (telefone.length <= 6) {
        this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    } else {
        this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
    }
});

// Define a data máxima no campo de nascimento
function definirMaxData() {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mes começa de 0, então somamos 1
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona zero à frente se o dia for menor que 10

    const dataFormatada = `${ano}-${mes}-${dia}`;
    nascimentoInput.setAttribute('max', dataFormatada); // Atribui a data máxima ao campo
}

// Chama a função para definir a data máxima ao carregar a página
window.onload = definirMaxData;

// Verificação dos inputs
botaoRegistra.addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário caso haja erro

    // Verificar se os campos obrigatórios estão preenchidos
    if (!usuarioInput.value || !telefoneInput.value || !emailInput.value || !nascimentoInput.value || !senhaInput.value || !confirmarSenhaInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Preencha todos os campos obrigatórios!',
            text: 'Todos os campos com * são obrigatórios.',
        });
        return;
    }

    // Verificar se o telefone é válido
    if (!telefoneRegex.test(telefoneInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido!',
            text: 'O telefone deve estar no formato (XX) XXXXX-XXXX.',
        });
        return;
    }

    // Verificar se o email é válido
    if (!emailRegex.test(emailInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido!',
            text: 'Por favor, insira um email válido.',
        });
        return;
    }

    // Verificar se o usuário é válido
    if (!usuarioRegex.test(usuarioInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Usuário inválido!',
            text: 'O usuário deve conter 3 a 20 letras.',
        });
        return;
    }

    // Verificar se a senha e a confirmação de senha coincidem
    if (senhaInput.value !== confirmarSenhaInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Erro na confirmação de senha!',
            text: 'As senhas não coincidem. Tente novamente.',
        });
        return;
    }

    // Verificar se a senha atende ao padrão
    if (!senhaRegex.test(senhaInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Senha inválida!',
            text: 'A senha deve conter entre 8 e 20 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial, sem espaços.',
        });
        return;
    }

    // Se tudo estiver correto, mostra um alerta de sucesso
    Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        text: 'Você foi registrado com sucesso. Agora você pode fazer login.',
    });
});

// CheckBox de Visualização de senha
visualizarSenha.addEventListener('change', function () {
    if (visualizarSenha.checked) {
        senhaInput.type = "text";
        confirmarSenhaInput.type = "text"; // Mostra a confirmação da senha
    } else {
        senhaInput.type = "password"; // Oculta a senha
        confirmarSenhaInput.type = "password"; // Oculta a confirmação da senha
    }
});