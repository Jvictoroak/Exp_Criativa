// Função para mostrar um alerta de sucesso
const successAlert = (mensagem = "Operação realizada com sucesso!") => {
    Swal.fire('Sucesso', mensagem, 'success');
};

// Função para mostrar um alerta de erro com mensagem personalizada
const errorAlert = (mensagem) => {
    Swal.fire('Erro', mensagem, 'error');
};

// Função para confirmar exclusão do perfil
const confirmarExclusao = () => {
    Swal.fire({
        title: 'Tem certeza?',
        text: "Essa ação não pode ser desfeita!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7066e0',
        cancelButtonColor: ' #6e7881',
        confirmButtonText: 'Sim, excluir!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('excluir-form').submit();
        }
    });
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
    salvarBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default form submission

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

            // Atualiza os valores nos campos ocultos do formulário
            if (input.id === "nome-usuario-input") {
                document.getElementById("nome-usuario-hidden").value = inputValue;
            } else if (input.id === "email-input") {
                document.getElementById("email-hidden").value = inputValue;
            } else if (input.id === "telefone-input") {
                document.getElementById("telefone-hidden").value = inputValue;
            } else if (input.id === "data-nascimento-input") {
                document.getElementById("data-nascimento-hidden").value = inputValue;
            }

            span.textContent = inputValue;

            if (input.type === "text" && input.id === "senha-input") {
                input.type = "password"; // Volta a esconder a senha
            }

            span.style.display = "inline-block";
            input.style.display = "none";
        });

        if (!isValid) {
            errorAlert(errorMessage);
            return;
        }

        successAlert("Informações atualizadas com sucesso!");
        document.getElementById("editar-form").submit(); // Submete o formulário
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
                document.getElementById("excluir-form").submit(); // Submete o formulário de exclusão
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

    // Popup de alteração de senha
    const alterarSenhaBtn = document.getElementById("alterar-senha-btn");
    const popupSenha = document.getElementById("popup-alterar-senha");
    const fecharPopupSenha = document.getElementById("fechar-popup-senha");

    if (alterarSenhaBtn && popupSenha) {
        alterarSenhaBtn.addEventListener("click", () => {
            popupSenha.classList.add("block"); // Usa a classe block para exibir o popup-senha
        });
    }
    if (fecharPopupSenha && popupSenha) {
        fecharPopupSenha.addEventListener("click", () => {
            popupSenha.classList.remove("block"); // Remove a classe block para esconder o popup-senha
        });
    }

    if (alterarSenhaBtn) {
        alterarSenhaBtn.addEventListener("click", () => {
            console.log("Botão Alterar Senha clicado");
        });
    }

    // Visualizar senhas no popup de alteração de senha
    const toggleSenhasBtn = document.getElementById("toggle-visualizar-senhas");
    if (toggleSenhasBtn) {
        toggleSenhasBtn.addEventListener("click", function () {
            const camposSenha = [
                document.getElementById("senha-atual"),
                document.getElementById("nova-senha"),
                document.getElementById("confirmar-senha")
            ];
            const mostrando = camposSenha[0].type === "text";
            camposSenha.forEach(input => {
                if (input) {
                    input.type = mostrando ? "password" : "text";
                    if (!mostrando) {
                        input.classList.add("senha-visivel");
                    } else {
                        input.classList.remove("senha-visivel");
                    }
                }
            });
            this.textContent = mostrando ? "Mostrar Senhas" : "Ocultar Senhas";
        });
    }

    // Validação do popup de alteração de senha
    const formAlterarSenha = document.getElementById("form-alterar-senha");
    if (formAlterarSenha) {
        const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
        formAlterarSenha.addEventListener("submit", function (event) {
            const senhaAtual = document.getElementById("senha-atual").value.trim();
            const novaSenha = document.getElementById("nova-senha").value.trim();
            const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                event.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Preencha todos os campos!',
                    text: 'Todos os campos são obrigatórios.',
                });
                return;
            }
            if (novaSenha !== confirmarSenha) {
                event.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Erro na confirmação de senha!',
                    text: 'As senhas não coincidem. Tente novamente.'
                });
                return;
            }
            if (!senhaRegex.test(novaSenha)) {
                event.preventDefault();
                Swal.fire({
                    icon: 'error',
                    title: 'Nova senha inválida!',
                    text: 'A senha deve conter entre 8 e 20 caracteres, incluindo pelo menos um número, uma letra maiúscula, uma letra minúscula e um caractere especial, sem espaços.'
                });
                return;
            }
            // Mensagem de sucesso ao trocar a senha
            event.preventDefault();
            Swal.fire({
                icon: 'success',
                title: 'Senha alterada com sucesso!',
                text: 'Sua senha foi atualizada.'
            }).then(() => {
                formAlterarSenha.submit();
            });
        });
    }

    // Remove o required dos campos do popup de senha para evitar balão nativo
    const senhaAtualInput = document.getElementById("senha-atual");
    const novaSenhaInput = document.getElementById("nova-senha");
    const confirmarSenhaInput = document.getElementById("confirmar-senha");
    if (senhaAtualInput) senhaAtualInput.removeAttribute("required");
    if (novaSenhaInput) novaSenhaInput.removeAttribute("required");
    if (confirmarSenhaInput) confirmarSenhaInput.removeAttribute("required");
});

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.bi-trash2').forEach(trashIcon => {
        trashIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            const postEl = trashIcon.closest('.post');
            if (!postEl) return;
            const postId = postEl.getAttribute('data-id');
            if (!postId) {
                Swal.fire('Erro', 'ID da publicação não encontrado.', 'error');
                return;
            }
            Swal.fire({
                title: 'Tem certeza?',
                text: "Deseja realmente excluir esta publicação?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#7066e0',
                cancelButtonColor: ' #6e7881',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch('/publicacaoExcluir', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: postId })
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                postEl.remove();
                                Swal.fire('Excluído!', 'A publicação foi excluída.', 'success');
                            } else {
                                Swal.fire('Erro', data.error || 'Não foi possível excluir a publicação.', 'error');
                            }
                        })
                        .catch(() => {
                            Swal.fire('Erro', 'Não foi possível excluir a publicação.', 'error');
                        });
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const formPublicar = document.getElementById('form-publicar');
    if (formPublicar) {
        formPublicar.addEventListener('submit', function (e) {
            // Validação simples dos campos obrigatórios
            const titulo = document.getElementById('titulo-input').value.trim();
            const imagem = document.getElementById('criar-imagem').files[0];
            if (!titulo || !imagem) {
                e.preventDefault();
                errorAlert('Preencha os campos de imagem e título, eles são obrigatórios!');
                return;
            }
            // Mensagem de sucesso (apenas visual, não impede submit real)
            e.preventDefault();
            Swal.fire({
                icon: 'success',
                title: 'Publicação criada com sucesso!',
                confirmButtonText: 'OK',
            }).then(() => {
                formPublicar.submit();
            });
        });
    }
});