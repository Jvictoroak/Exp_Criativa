const usuarioInput = document.getElementById("usuario");
const telefoneInput = document.getElementById("telefone");
const emailInput = document.getElementById("email");
const nascimentoInput = document.getElementById("nascimento");
const senhaInput = document.getElementById("senha");
const confirmarSenhaInput = document.getElementById("confirmarSenha");
const visualizarSenha = document.getElementById("toggleSenha");
const botaoRegistra = document.getElementById("button-registro");

//  Formatação de telefone
telefoneInput.addEventListener('input', function(event) {
    // Remove qualquer caractere não numérico
    let telefone = this.value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX enquanto o usuário digita
    if (telefone.length <= 2) {
        this.value = `(${telefone}`;
    } else if (telefone.length <= 6) {
        this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2)}`;
    } else {
        this.value = `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7, 11)}`;
    }
});

// Define a data máxima no campo de nascimento
function definirMaxData() {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // Mes começa de 0, então somamos 1
    const dia = String(dataAtual.getDate()).padStart(2, '0'); // Adiciona zero à frente se o dia for menor que 10

    const dataFormatada = `${ano}-${mes}-${dia}`;
    nascimentoInput.setAttribute('max', dataFormatada); // Atribui a data máxima ao campo
}

// Chama a função para definir a data máxima ao carregar a página
window.onload = definirMaxData;

// Verificação dos inputs
botaoRegistra.addEventListener('click', function(event) {
    event.preventDefault(); // Impede o envio do formulário caso haja erro

    // Verificar se os campos obrigatórios estão preenchidos
    if (!usuarioInput.value || !telefoneInput.value || !emailInput.value || !nascimentoInput.value || !senhaInput.value || !confirmarSenhaInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Preencha todos os campos obrigatórios!',
            text: 'Todos os campos com * são obrigatórios.',
        });
        return;
    }
    const usuarioPattern = /[A-Za-záàâãéèêíóôõúç\s]{8,50}/;
    if (!usuarioPattern.test(usuarioInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Usuário inválido!',
            text: 'O usuário deve conter 8 a 50 letras.'
        })
        return
    }
    
    // Verificar se a senha e a confirmação de senha coincidem
    if (senhaInput.value !== confirmarSenhaInput.value) {
        Swal.fire({
            icon: 'error',
            title: 'Erro na confirmação de senha!',
            text: 'As senhas não coincidem. Tente novamente.',
        });
        return;
    }

    // Verificar se a senha atende ao padrão
    const senhaPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&*]).{6,10}$/;
    if (!senhaPattern.test(senhaInput.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Senha inválida!',
            text: 'A senha deve conter pelo menos um número, uma letra maiúscula, uma minúscula e um caractere especial, com 6 a 10 caracteres.',
        });
        return;
    }

    // Se tudo estiver correto, mostra um alerta de sucesso
    Swal.fire({
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        text: 'Você foi registrado com sucesso. Agora você pode fazer login.',
    });

});

// CheckBox de Visualização de senha
visualizarSenha.addEventListener('change', function() {
    if (visualizarSenha.checked) {
        senhaInput.type = "text";
        confirmarSenhaInput.type = "text"; // Mostra a confirmação da senha
    } else {
        senhaInput.type = "password"; // Oculta a senha
        confirmarSenhaInput.type = "password"; // Oculta a confirmação da senha
    }
});
