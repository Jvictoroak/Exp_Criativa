// Obtém os elementos dos campos do formulário
const usuario = document.getElementById('usuario');
const senha = document.getElementById('senha');
const email = document.getElementById('email');
const dataNascimento = document.getElementById('nascimento');
const foto = document.getElementById('foto');

// Função para mostrar um alerta de sucesso
const successAlert = () => {
    Swal.fire('Mensagem', 'Mensagem de Sucesso!', 'success');
}

// Função para mostrar um alerta de erro com mensagem personalizada
const errorAlert = (mensagem) => {
    Swal.fire('Erro', mensagem, 'error');
}

// Valida o formato do email
const validaEmail = (email) => {
    const emailRegex = /^[a-zA-Z][^<>\"!@[\]#$%¨&*()~^:;ç,\-´`=+{}º\|/\\?]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
}

// Valida a senha (deve ter 8-20 caracteres, números, letras maiúsculas/minúsculas e um caractere especial)
const validaSenha = (senha) => {
    const senhaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    return senhaRegex.test(String(senha));
}

// Verifica se todos os campos do cadastro estão válidos
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

// Verifica se o usuário e a senha estão corretos
const verificarConta = () => {
    if (!usuario.value && !senha.value) {
        errorAlert('Usuário ou Senha Incorreto!');
    }
}