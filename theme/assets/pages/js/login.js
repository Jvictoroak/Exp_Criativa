document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita o envio padrão do formulário

        let isValid = true;
        let errorMessage = "";

        // Validação do campo "Username"
        if (!usuarioInput.value.trim()) {
            isValid = false;
            errorMessage = "O campo 'Username' não pode estar vazio.";
        } else if (!usuarioInput.checkValidity()) {
            isValid = false;
            errorMessage = usuarioInput.title; // Exibe a mensagem do atributo title
        }

        // Validação do campo "Password"
        if (isValid && !senhaInput.value.trim()) {
            isValid = false;
            errorMessage = "O campo 'Password' não pode estar vazio.";
        } else if (isValid && !senhaInput.checkValidity()) {
            isValid = false;
            errorMessage = senhaInput.title; // Exibe a mensagem do atributo title
        }

        // Exibe mensagem de erro ou sucesso
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: errorMessage,
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal2-confirm-button",
                },
            });
        } else {
            // Simula o login bem-sucedido
            Swal.fire({
                icon: "success",
                title: "Sucesso",
                text: "Login realizado com sucesso!",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal2-confirm-button",
                },
            }).then(() => {
                // Redireciona para outra página após o login
                window.location.href = "dashboard.html"; // Substitua pelo destino correto
            });
        }
    });
});document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    const usuarioInput = document.getElementById("usuario");
    const senhaInput = document.getElementById("senha");

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita o envio padrão do formulário

        let isValid = true;
        let errorMessage = "";

        // Validação do campo "Username"
        if (!usuarioInput.value.trim()) {
            isValid = false;
            errorMessage = "O campo 'Username' não pode estar vazio.";
        } else if (!usuarioInput.checkValidity()) {
            isValid = false;
            errorMessage = usuarioInput.title; // Exibe a mensagem do atributo title
        }

        // Validação do campo "Password"
        if (isValid && !senhaInput.value.trim()) {
            isValid = false;
            errorMessage = "O campo 'Password' não pode estar vazio.";
        } else if (isValid && !senhaInput.checkValidity()) {
            isValid = false;
            errorMessage = senhaInput.title; // Exibe a mensagem do atributo title
        }

        // Exibe mensagem de erro ou sucesso
        if (!isValid) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: errorMessage,
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal2-confirm-button",
                },
            });
        } else {
            // Simula o login bem-sucedido
            Swal.fire({
                icon: "success",
                title: "Sucesso",
                text: "Login realizado com sucesso!",
                confirmButtonText: "OK",
                customClass: {
                    confirmButton: "swal2-confirm-button",
                },
            }).then(() => {
                // Redireciona para outra página após o login
                window.location.href = "theme\templates\index.html"; // Substitua pelo destino correto
            });
        }
    });
});