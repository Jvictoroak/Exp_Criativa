const telefoneRegex = /^\d{10,11}$/; // Aceita apenas números com 10 ou 11 dígitos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usuarioRegex = /^[A-Za-záàâãéèêíóôõúç\s\d]{3,20}$/;

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
    const fotoInput = document.getElementById(`foto-${id}`); // Novo campo para a imagem
    const foto = fotoInput.files[0]; // Obtém o arquivo selecionado

    const hoje = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD

    if (data > hoje) {
        Swal.fire({
            icon: 'error',
            title: 'Data inválida!',
            text: 'A data não pode ser maior que hoje.',
        });
        return;
    }

    if (!usuarioRegex.test(nome)) {
        Swal.fire({
            icon: 'error',
            title: 'Nome de usuário inválido!',
            text: 'O nome de usuário deve conter entre 3 e 20 caracteres e pode incluir letras, números e espaços.',
        });
        return;
    }

    if (!emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email inválido!',
            text: 'Por favor, insira um email válido.',
        });
        return;
    }

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

    if (foto) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById(`input-foto-${id}`).value = e.target.result; // Converte a imagem para base64
        };
        reader.readAsDataURL(foto);
    }

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
