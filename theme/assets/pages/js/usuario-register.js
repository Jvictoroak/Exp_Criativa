const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const email = document.getElementById('email');
const dataNascimento = document.getElementById('nascimento');
const foto = document.getElementById('foto');

const successAlert = () => {
    Swal.fire(
        'Mensagem',
        'Mensagem de Sucesso!',
        'success'
    );
}

const errorAlert = (mensagem) => {
    Swal.fire(
        'Erro',
        mensagem,
        'error'
    );
}

const validaEmail = (email) => {
    const emailRegex = /^([a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]{1,})@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
}

const validaSenha = (senha) => {
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    return senhaRegex.test(String(senha));
}

const verificarCadastro = () => {
    if (!usuario.value) {
        return errorAlert('Usuário não pode estar vazio!');
    }

    if (!senha.value || !validaSenha(senha.value)) {
        return errorAlert('A senha deve ter entre 8 a 20 caracteres, incluir números, letras maiúsculas e minúsculas, e um caractere especial.');
    }

    if (!email.value || !validaEmail(email.value)) {
        return errorAlert('Por favor, insira um e-mail válido!');
    }

    if (!dataNascimento.value) {
        return errorAlert('A data de nascimento não pode estar vazia!');
    }

    if (!foto.value) {
        return errorAlert('Por favor, faça o upload de uma foto!');
    }

    successAlert();
}

const verificarConta = () => {
    if(!usuario.value && !senha.value) {
        errorAlert('Usuário ou Senha Incorreto!')
    }
}