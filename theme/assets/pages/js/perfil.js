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

    const detalhes = document.querySelectorAll(".detalhe-item");

    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    const emailRegex = /^[a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

    // Alterna a visibilidade da senha e o ícone do olho
    const togglePasswordVisibility = () => {
        const senhaInput = document.getElementById("senha-input");
        const eyeIcon = document.getElementById("toggle-eye");

        if (senhaInput.type === "password") {
            senhaInput.type = "text"; // Torna a senha visível
            eyeIcon.classList.remove("bi-eye-slash"); // Remove o ícone de olho fechado
            eyeIcon.classList.add("bi-eye"); // Adiciona o ícone de olho aberto
        } else {
            senhaInput.type = "password"; // Torna a senha oculta
            eyeIcon.classList.remove("bi-eye"); // Remove o ícone de olho aberto
            eyeIcon.classList.add("bi-eye-slash"); // Adiciona o ícone de olho fechado
        }
    };

    // Ao clicar no ícone do olho, alterna entre mostrar e esconder a senha
    const eyeIcon = document.getElementById("toggle-eye");
    eyeIcon.addEventListener("click", togglePasswordVisibility);

    editarBtn.addEventListener("click", () => {
        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");

            input.value = span.textContent; // Preenche o input com o valor atual

            // Verifica se é um campo de senha e altera temporariamente para texto
            if (input.type === "password") {
                input.type = "text";
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
        });

        if (!isValid) {
            errorAlert(errorMessage);
            return;
        }

        detalhes.forEach(item => {
            const span = item.querySelector(".detalhe-valor");
            const input = item.querySelector(".detalhe-input");

            span.textContent = input.value;

            // Se for um campo de senha, esconde os caracteres novamente
            if (input.type === "text") {
                input.type = "password";
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
    })

});
