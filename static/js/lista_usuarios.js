const telefoneRegex = /^\d{10,11}$/; // Aceita apenas números com 10 ou 11 dígitos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function habilitarEdicao(id) {
    document.getElementById(`nome-${id}`).disabled = false;
    document.getElementById(`email-${id}`).disabled = false;
    const telefoneInput = document.getElementById(`telefone-${id}`);
    telefoneInput.disabled = false;
    telefoneInput.maxLength = 11; // Limitar o campo a 11 caracteres
    document.getElementById(`data-${id}`).disabled = false;
}

function formatarTelefone(input) {
    let telefone = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (telefone.length <= 2) {
        input.value = `(${telefone}`;
    } else if (telefone.length <= 6) {
        input.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    } else {
        input.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
    }
}

function prepararSalvar(id) {
    const nome = document.getElementById(`nome-${id}`).value;
    const email = document.getElementById(`email-${id}`).value;
    const telefoneInput = document.getElementById(`telefone-${id}`);
    const telefone = telefoneInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos para validação
    const data = document.getElementById(`data-${id}`).value;

    if (telefone.length > 11) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido!',
            text: 'O telefone deve estar no formato (XX) XXXXX-XXXX. 11 dígitos.',
        });
        return;
    }

    if (telefone.length < 10) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido!',
            text: 'O telefone deve estar no formato (XX) XXXXX-XXXX. 11 dígitos.',
        });
        return;
    }

    if (!telefoneRegex.test(telefone)) {
        Swal.fire({
            icon: 'error',
            title: 'Telefone inválido!',
            text: 'O telefone deve estar no formato (XX) XXXXX-XXXX. 11 dígitos.',
        });
        return;
    }

    document.getElementById(`input-nome-${id}`).value = nome;
    document.getElementById(`input-email-${id}`).value = email;
    document.getElementById(`input-telefone-${id}`).value = telefone;
    document.getElementById(`input-data-${id}`).value = data;

    Swal.fire('Sucesso', 'Informações salvas com sucesso!', 'success').then(() => {
        document.getElementById(`form-salvar-${id}`).submit();
    });
}

function confirmarExclusao(id) {
    Swal.fire({
        title: "Tem certeza?",
        text: "Você está prestes a excluir este usuário!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById(`form-excluir-${id}`).submit();
        }
    });
}