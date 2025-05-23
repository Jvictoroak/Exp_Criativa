// Seleção dos elementos do DOM
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const visualizarSenha = document.getElementById("toggleSenha");
const botaoLogin = document.getElementById("button-login");

// Declaração dos Regex no início do script
const usuarioRegex = /^[A-Za-záàâãéèêíóôõúç\s\d]{3,20}$/; 
// Valida o nome de usuário: 3 a 20 caracteres, apenas letras, números e espaços

const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/; 
// Valida a senha: 8 a 20 caracteres, pelo menos 1 número, 1 letra maiúscula, 1 letra minúscula, 1 caractere especial, sem espaços

// Verificação dos inputs
botaoLogin.addEventListener("click", function(event) {
    // event.preventDefault(); // Impede o envio do formulário caso haja erro

    // Verificar se os campos obrigatórios estão preenchidos
    if (!usuarioInput.value || !senhaInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Preencha todos os campos obrigatórios!',
            text: 'Todos os campos com * são obrigatórios.',
        });
        return;
    }

    // Verificar se o usuário é válido
    if (!usuarioRegex.test(usuarioInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Usuário inválido!',
            text: 'Usuário não encontrado',
            confirmButtonText: "OK",
        });
        return;
    }

    // Verificar se a senha atende ao padrão
    if (!senhaRegex.test(senhaInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Senha inválida!',
            text: 'A senha não corresponde ao usuário.',
            confirmButtonText: "OK",
        });
        return;
    }

    // Simula o login bem-sucedido
    Swal.fire({
        icon: "success",
        title: "Sucesso",
        text: "Login realizado com sucesso!",
        confirmButtonText: "OK",
    })
});

// CheckBox de Visualização de senha
visualizarSenha.addEventListener("change", function () {
    senhaInput.type = visualizarSenha.checked ? "text" : "password";
});
