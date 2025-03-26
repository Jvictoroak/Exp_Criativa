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

    // Incluímos o nome-usuario como um detalhe editável
    const detalhes = document.querySelectorAll(".detalhe-item");

    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    const emailRegex = /^[a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    // Regex simples para nome de usuário (ex.: 3-20 caracteres, letras, números e alguns símbolos)
    const nomeUsuarioRegex = /^[a-zA-Z0-9._-]{3,20}$/;

    // Alterna a visibilidade da senha e o ícone do olho
    const togglePasswordVisibility = () => {
        const senhaInput = document.getElementById("senha-input");
        const eyeIcon = document.getElementById("toggle-eye");

        if (senhaInput.type === "password") {
            senhaInput.type = "text";
            eyeIcon.classList.remove("bi-eye-slash");
            eyeIcon.classList.add("bi-eye");
        } else {
            senhaInput.type = "password";
            eyeIcon.classList.remove("bi-eye");
            eyeIcon.classList.add("bi-eye-slash");
        }
    };

    const eyeIcon = document.getElementById("toggle-eye");
    eyeIcon.addEventListener("click", togglePasswordVisibility);

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

    salvarBtn.addEventListener("click", () => {
        let isValid = true;
        let errorMessage = "";

        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");
            const inputValue = input.value.trim();

            if (!inputValue) {
                isValid = false;
                errorMessage = "Todos os campos devem ser preenchidos!";
                return;
            }

            if (input.type === "email" && !emailRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "Email inválido! Insira um email válido.";
                return;
            }

            if (input.type === "password" && !senhaRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "A senha deve ter entre 8 e 20 caracteres, incluir uma letra maiúscula, uma minúscula, um número e um caractere especial.";
                return;
            }

            // Validação do nome de usuário
            if (input.id === "nome-usuario-input" && !nomeUsuarioRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "O nome de usuário deve ter entre 3 e 20 caracteres, sem conter espaços.";
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

    // exluir post
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
