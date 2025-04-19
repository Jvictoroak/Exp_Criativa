// Função para mostrar um alerta de sucesso
const successAlert = (mensagem = "Operação realizada com sucesso!") => {
    Swal.fire('Sucesso', mensagem, 'success');
};

// Função para mostrar um alerta de erro com mensagem personalizada
const errorAlert = (mensagem) => {
    Swal.fire('Erro', mensagem, 'error');
};

document.addEventListener("DOMContentLoaded", () => {
    const editarBtn = document.getElementById("editar-btn");
    const salvarBtn = document.getElementById("salvar-btn");
    const excluirBtn = document.getElementById("excluir-btn");

    const detalhes = document.querySelectorAll(".detalhe-item");
    const telefoneInput = document.getElementById("telefone-input");
    const telefoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/; // Padrão para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    const emailRegex = /^[a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const datanascimentoRegex = /^\d{4}-\d{2}-\d{2}$/; // Data no formato AAAA-MM-DD
    const nomeUsuarioRegex = /^[a-zA-Z0-9._-]{3,20}$/;

    // Removendo formatações de data e telefone
    const dataNascimentoSpan = document.getElementById("data-nascimento-valor");
    const telefoneSpan = document.getElementById("telefone-valor");

    if (dataNascimentoSpan) {
        dataNascimentoSpan.textContent = dataNascimentoSpan.textContent; // Exibe o valor como está
    }

    if (telefoneSpan) {
        telefoneSpan.textContent = telefoneSpan.textContent; // Exibe o valor como está
    }

    // Define a data máxima no input de nascimento
    function definirMaxData() {
        const dataAtual = new Date();
        const ano = dataAtual.getFullYear();
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const dataFormatada = `${ano}-${mes}-${dia}`;
        const nascimentoInput = document.getElementById("data-nascimento-input");
        if (nascimentoInput) {
            nascimentoInput.setAttribute('max', dataFormatada);
        }
    }

    definirMaxData();

    // Formatação de telefone
    telefoneInput?.addEventListener('input', function () {
        let telefone = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (telefone.length <= 2) {
            this.value = `(${telefone}`;
        } else if (telefone.length <= 6) {
            this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
        } else {
            this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
        }
    });

    // Botão de editar
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

    // Botão de salvar
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

            // Validação de telefone
            if (input.id === "telefone-input" && !telefoneRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "O telefone deve estar no formato (XX) XXXXX-XXXX.";
                return;
            }

            // Validação de data de nascimento
            if (input.id === "data-nascimento-input" && !datanascimentoRegex.test(inputValue)) {
                isValid = false;
                errorMessage = "Data de nascimento inválida! Insira uma data válida.";
                return;
            }

            // Validar se a data de nascimento é anterior à data atual
            if (input.id === "data-nascimento-input") {
                const hoje = new Date();
                const dataNascimento = new Date(inputValue);
                if (hoje < dataNascimento) {
                    isValid = false;
                    errorMessage = "Data de nascimento precisa ser anterior à data atual!";
                    return;
                }
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

    // Botão de excluir
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

    // Ícone de excluir post
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
                    successAlert("Post excluído com sucesso!");
                }
            });
        });
    });

    // Popup de visualização de post
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