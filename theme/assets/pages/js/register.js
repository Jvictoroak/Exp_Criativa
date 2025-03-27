document.getElementById("registroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let usuario = document.getElementById("usuario").value.trim();
    let senha = document.getElementById("senha").value;
    let email = document.getElementById("email").value.trim();
    let nascimento = document.getElementById("nascimento").value;
    let foto = document.getElementById("foto").files[0];

    let regexUsuario = /^[A-Za-záàâãéèêíóôõúç\s]{3,20}$/;
    let regexSenha = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    let regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usuario) {
        Swal.fire("Erro!", "O campo Usuário é obrigatório.", "error");
        return;
    }
    if (!regexUsuario.test(usuario)) {
        Swal.fire("Erro!", "Usuário deve ter entre 3 e 20 letras.", "error");
        return;
    }

    if (!senha) {
        Swal.fire("Erro!", "O campo Senha é obrigatório.", "error");
        return;
    }
    if (!regexSenha.test(senha)) {
        Swal.fire("Erro!", "A senha deve ter entre 8 e 20 caracteres, contendo pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.", "error");
        return;
    }

    if (!email) {
        Swal.fire("Erro!", "O campo E-mail é obrigatório.", "error");
        return;
    }
    if (!regexEmail.test(email)) {
        Swal.fire("Erro!", "E-mail inválido!", "error");
        return;
    }

    if (!nascimento) {
        Swal.fire("Erro!", "O campo Data de nascimento é obrigatório.", "error");
        return;
    }
    let dataAtual = new Date().toISOString().split("T")[0]; 
    if (nascimento > dataAtual) {
        Swal.fire("Erro!", "A data de nascimento não pode ser maior que o dia atual.", "error");
        return;
    }

    if (foto && !["image/jpeg", "image/png"].includes(foto.type)) {
        Swal.fire("Erro!", "Apenas imagens JPG e PNG são permitidas.", "error");
        return;
    }

    Swal.fire("Sucesso!", "Registro concluído!", "success");
});

document.getElementById("toggleSenha").addEventListener("click", function () {
    let senhaInput = document.getElementById("senha");
    let senhaIcon = document.getElementById("senhaIcon");
    
    if (senhaInput.type === "password") {
        senhaInput.type = "text";
        senhaIcon.classList.remove("bi-eye");
        senhaIcon.classList.add("bi-eye-slash");
    } else {
        senhaInput.type = "password";
        senhaIcon.classList.remove("bi-eye-slash");
        senhaIcon.classList.add("bi-eye");
    }
});

