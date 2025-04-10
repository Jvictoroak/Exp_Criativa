// Seleção dos elementos do DOM
const usuarioInput = document.getElementById("usuario");
const senhaInput = document.getElementById("senha");
const visualizarSenha = document.getElementById("toggleSenha");
const botaoLogin = document.getElementById("button-login");

// Declaração dos Regex no início do script
const usuarioRegex = /^[A-Za-záàâãéèêíóôõúç\s\d]{3,20}$/; 
// Valida o nome de usuário: 3 a 20 caracteres, incluindo letras, números e espaços

const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/; 
// Valida a senha: 8 a 20 caracteres, pelo menos 1 número, 1 letra maiúscula, 1 letra minúscula, 1 caractere especial, sem espaços

// Verificação dos inputs
botaoLogin.addEventListener("click", async function(event) { // Adicione 'async' aqui
    event.preventDefault(); // Impede o envio do formulário caso haja erro

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
            text: 'O usuário deve conter 3 a 20 letras e/ou números.',
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

    try {
        // Enviar as credenciais para o backend
        const response = await fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                username: usuarioInput.value,
                password: senhaInput.value,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            Swal.fire({
                icon: 'error',
                title: 'Erro de Login!',
                text: errorData.detail || 'Erro ao autenticar.',
            });
            return;
        }

        const data = await response.json();
        Swal.fire({
            icon: "success",
            title: "Sucesso",
            text: `Bem-vindo, ${data.nome}!`,
            confirmButtonText: "OK",
        }).then(() => {
            // Redireciona para a home (index.html) após o login
            window.location.href = "../../theme/templates/index.html";
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro de Conexão!',
            text: 'Não foi possível conectar ao servidor.',
        });
    }
});

// CheckBox de Visualização de senha
visualizarSenha.addEventListener("change", function () {
    senhaInput.type = visualizarSenha.checked ? "text" : "password";
});
