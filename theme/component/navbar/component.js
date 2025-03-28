document.addEventListener("DOMContentLoaded", function () {
    // Pega o conteúdo do header.html
    fetch("../../theme/component/navbar/component.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar").innerHTML = data;

            // Cria um elemento <link> para importar o CSS
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "../../theme/component/navbar/component.css"; // Caminho do CSS
            document.head.appendChild(link);

            const criar = document.getElementById('menu-criar');
            const component_criar = document.getElementById('criar');
            criar.addEventListener('click', () => {
                component_criar.classList.toggle('block');
            });

        })
        .catch(error => console.error("Erro ao carregar o navbar:", error));
    });


