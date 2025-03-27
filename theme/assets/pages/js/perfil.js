// Função para mostrar um alerta de sucesso
const successAlert = () => {
    Swal.fire('Mensagem', 'Mensagem de Sucesso!', 'success');
}

// Função para mostrar um alerta de erro com mensagem personalizada
const errorAlert = (mensagem) => {
    Swal.fire('Erro', mensagem, 'error');
}

document.addEventListener("DOMContentLoaded", () => {
    const editarBtn = document.getElementById("editar-btn");
    const salvarBtn = document.getElementById("salvar-btn");
    const excluirBtn = document.getElementById("excluir-btn");

    const detalhes = document.querySelectorAll(".detalhe-item"); // Incluímos o nome-usuario como um detalhe editável
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/; // Senha: 8-20 caracteres, 1 minúscula, 1 maiúscula, 1 número, 1 caractere especial, sem espaços
    const emailRegex = /^[a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/; // Email: começa com letra, sem caracteres especiais inválidos antes do @, domínio válido
    const datanascimentoRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;// Data (DD/MM/AAAA): dia 01-31, mês 01-12, ano com 4 dígitos
    const nomeUsuarioRegex = /^[a-zA-Z0-9._-]{3,20}$/; // Nome de usuário: 3-20 caracteres, letras, números, ., _ e -

    // botão de editar
    editarBtn.addEventListener("click", () => {
        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");

            input.value = span.textContent; // Preenche o input com o valor atual

            if (input.type === "password") {
                input.type = "text"; // Temporariamente mostra a senha
            }

            span.style.display = "none";
            input.style.display = "inline-block";
        });

        salvarBtn.disabled = false;
    });

    // botão de salvar
    salvarBtn.addEventListener("click", () => {
        let isValid = true;
        let errorMessage = "";

        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");
            const inputValue = input.value.trim();

            // Validação de campos vazios
            if (!inputValue) {
                isValid = false;
                errorMessage = "Todos os campos devem ser preenchidos!";
                return;
            }

            // Validação do nome de usuário
            if (input.id === "nome-usuario-input" && !nomeUsuarioRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "O nome de usuário deve ter entre 3 e 20 caracteres, sem conter espaços.";
                return;
            }

            // Validação de email
            if (input.type === "email" && !emailRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "Email inválido! Insira um email válido.";
                return;
            }

            // Validação de senha
            if (input.id === "senha-input" && !senhaRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "A senha deve ter entre 8 e 20 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.";
                return;
            }

            // validação de data
            if (input.id === "data-nascimento-input" && !datanascimentoRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "Data de nascimento inválida! Insira uma data válida.";
                return;
            }
        });

        if (!isValid) {
            errorAlert(errorMessage);
            return;
        }

        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");

            span.textContent = input.value;

            if (input.type === "text" && input.id === "senha-input") {
                input.type = "password"; // Volta a esconder a senha
            }

            span.style.display = "inline-block";
            input.style.display = "none";
        });

        salvarBtn.disabled = true;
        successAlert();
    });

    // botão de excluir
    excluirBtn.addEventListener("click", () => {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você está prestes a excluir seu perfil!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "../templates/register.html"; // Ou uma lógica de exclusão real
                successAlert("Perfil excluído com sucesso!");
            }
        });
    });

    // icone exluir post
    const iconesExcluir = document.getElementsByClassName('bi-trash2');

    Array.from(iconesExcluir).forEach(icone => {
        icone.addEventListener("click", () => {
            Swal.fire({
                title: "Tem certeza?",
                text: "Você está prestes a excluir esse post!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sim, excluir",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../templates/perfil.html"; // Ou uma lógica de exclusão real
                    successAlert("Post excluído com sucesso!");
                }
            });
        });
    });



    // Cuidado aqui ja é popup
    const vermais = document.getElementsByClassName('vermais');
    const popup = document.getElementById('popup-publicacao');
    const popup_fechar = document.getElementById('fechar-popup');

    Array.from(vermais).forEach(element => {
        element.addEventListener('click', () => {
            popup.classList.toggle('block');
        });
    });

    popup_fechar.addEventListener('click', () => {
        popup.classList.toggle('block');
    });
});
